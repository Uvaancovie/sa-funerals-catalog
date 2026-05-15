import { Injectable, signal, computed, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ImageOptimizationService } from './image-optimization.service';

export interface Product {
  // This service is used by the catalog UI. Supabase-backed products and the local
  // `products-safs.json` format are not identical, so most fields are optional.
  productId?: number;
  id: string; // slug
  name: string;
  category: string;
  description?: string | null;
  price?: number | null;
  priceOnRequest?: boolean;
  images: string; // JSON string array (Supabase) OR encoded as a string by our local adapter
  colorVariations?: string | null; // JSON string array of color variation objects
  specifications?: string | null; // JSON object as string
  features?: string | null; // JSON string array
  inStock?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface CartItem {
  product: Product;
  variant: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private supabaseService = inject(SupabaseService);
  private imageOptimization = inject(ImageOptimizationService);

  // Signals
  readonly products = signal<Product[]>([]);
  readonly cart = signal<CartItem[]>([]);
  readonly wishlist = signal<Product[]>([]);

  constructor() {
    // Always start with the local dataset (SAFS IMAGES), so the catalog
    // renders correctly even if Supabase is misconfigured/unavailable.
    this.loadLocalProducts();
    this.loadProducts();
  }

  private normalizeImageUrl(url: string): string {
    // Make image paths absolute and handle legacy database formats
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    
    let path = url.replace(/^\/+/, '');
    if (path.toLowerCase().startsWith('assets/')) return `/${path}`;
    if (path.toUpperCase().startsWith('SAFS IMAGES/')) return `/safs-images/${path.substring(12)}`;
    if (path.toLowerCase().startsWith('safs-images/')) return `/${path}`;
    
    return `/safs-images/${path}`;
  }

  private async loadLocalProducts(): Promise<void> {
    // Local dataset referencing images under `src/SAFS IMAGES`.
    try {
      const res = await fetch('/products-safs.json');
      if (!res.ok) {
        console.warn('Local products fetch failed:', res.status, res.statusText);
        return;
      }

      const raw = (await res.json()) as any[];
      if (!Array.isArray(raw) || raw.length === 0) return;

      const now = new Date().toISOString();

      const mapped: Product[] = raw.map((p) => {
        const imageList: string[] = Array.isArray(p.images)
          ? p.images
          : typeof p.image === 'string'
            ? [p.image]
            : [];

        const images = JSON.stringify(imageList.map((u) => this.normalizeImageUrl(String(u))));

        const variants: string[] = Array.isArray(p.variants) ? p.variants.map(String) : [];
        const featureList = variants;

        // Use pre-built colorVariations from JSON if available, otherwise generate from variants
        let colorVariations: string;
        if (typeof p.colorVariations === 'string') {
          // Already a JSON string, use it directly
          try {
            const parsed = JSON.parse(p.colorVariations);
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Normalize image URLs in the color variations
              const normalized = parsed.map((cv: any) => ({
                color: cv.color,
                images: Array.isArray(cv.images) ? cv.images.map((u: string) => this.normalizeImageUrl(u)) : []
              }));
              colorVariations = JSON.stringify(normalized);
            } else {
              throw new Error('Invalid colorVariations format');
            }
          } catch (e) {
            // Fallback to generating from variants
            colorVariations = JSON.stringify(
              (variants.length > 0 ? variants : (imageList.length > 0 ? ['Standard'] : []))
                .map((color) => ({
                  color,
                  images: imageList.map((u) => this.normalizeImageUrl(String(u))),
                }))
            );
          }
        } else {
          // Generate from variants as before
          colorVariations = JSON.stringify(
            (variants.length > 0 ? variants : (imageList.length > 0 ? ['Standard'] : []))
              .map((color) => ({
                color,
                images: imageList.map((u) => this.normalizeImageUrl(String(u))),
              }))
          );
        }

        return {
          productId: 0,
          id: String(p.id ?? ''),
          name: String(p.name ?? ''),
          category: String(p.category ?? ''),
          description: null,
          price: typeof p.price === 'number' ? p.price : 0,
          priceOnRequest: false,
          images,
          colorVariations,
          specifications: null,
          features: JSON.stringify(featureList),
          inStock: true,
          featured: false,
          createdAt: now,
          updatedAt: null,
        } satisfies Product;
      });

      // Guard against empty mapping or missing identifiers.
      this.products.set(mapped.filter((p) => p.id && p.name && p.category));
      console.warn(`Loaded ${this.products().length} products from local dataset.`);
    } catch (err) {
      console.error('Failed to load local products dataset', err);
    }
  }

  async loadProducts() {
    try {
      const { data, error } = await this.supabaseService.client
        // Supabase error hints the actual table name is `Products` (capital P).
        // Using the correct case avoids REST 404s for a non-existent table.
        .from('Products')
        .select('*');
      
      if (error) {
        console.error('Supabase error loading products:', error);
        return;
      }
      if (data && Array.isArray(data) && data.length > 0) {
        const products = data as Product[];
        if (!products.some(p => p.images && p.images.includes('SAFS IMAGES'))) {
          console.warn('Supabase products loaded, but images are not SAFS IMAGES. Keeping local dataset.');
          this.loadLocalProducts();
          return;
        }
        
        this.products.set(products);
        return;
      }
    } catch (err) {
      console.error('Failed to load products', err);
      // Keep local dataset
    }
  }

  // Toast notification
  readonly toastItem = signal<CartItem | null>(null);
  private toastTimeout: any = null;

  // Helper methods to parse JSON fields
  parseImages(product: Product): string[] {
    try {
      const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      const list = Array.isArray(parsed) ? parsed : [];
      return list.map((u) => this.normalizeOptimizedImageUrl(String(u)));
    } catch {
      return [];
    }
  }

  private normalizeOptimizedImageUrl(url: string): string {
    // Convert legacy image paths to optimized paths
    const optimizedPath = this.imageOptimization.getOptimizedImagePath(url);
    return optimizedPath;
  }

  parseFeatures(product: Product): string[] {
    try {
      if (!product.features) return [];
      const parsed = typeof product.features === 'string' ? JSON.parse(product.features) : product.features;
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }

  parseSpecifications(product: Product): Record<string, string> {
    try {
      return product.specifications ? JSON.parse(product.specifications) : {};
    } catch {
      return {};
    }
  }

  parseColorVariations(product: Product): { color: string; images: string[] }[] {
    try {
      if (!product.colorVariations) return [];
      const parsed = JSON.parse(product.colorVariations);
      if (!Array.isArray(parsed)) return [];
      // Normalize both PascalCase (Color/Images from seeder) and camelCase
      return parsed.map((v: any) => ({
        color: v.color ?? v.Color ?? '',
        images: (Array.isArray(v.images) ? v.images
          : Array.isArray(v.Images) ? v.Images
            : []
        ).map((u: any) => this.normalizeImageUrl(String(u))),
      })).filter(v => v.color);
    } catch {
      return [];
    }
  }

  // Computed
  readonly cartCount = computed(() => this.cart().reduce((acc, item) => acc + item.quantity, 0));
  readonly cartTotal = computed(() => this.cart().reduce((acc, item) => acc + ((item.product.price || 0) * item.quantity), 0));

  addToCart(product: Product, variant: string) {
    let addedItem: CartItem | null = null;
    this.cart.update(items => {
      const existing = items.find(i => i.product.id === product.id && i.variant === variant);
      if (existing) {
        const updated = items.map(i => i.product.id === product.id && i.variant === variant
          ? { ...i, quantity: i.quantity + 1 }
          : i);
        addedItem = updated.find(i => i.product.id === product.id && i.variant === variant) || null;
        return updated;
      }
      addedItem = { product, variant, quantity: 1 };
      return [...items, addedItem];
    });

    // Show toast
    if (addedItem) {
      this.showToast(addedItem);
    }
  }

  private showToast(item: CartItem) {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastItem.set({ ...item });
    this.toastTimeout = setTimeout(() => {
      this.toastItem.set(null);
    }, 4000);
  }

  dismissToast() {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastItem.set(null);
  }

  removeFromCart(productId: string, variant: string) {
    this.cart.update(items => items.filter(i => !(i.product.id === productId && i.variant === variant)));
  }

  updateQuantity(productId: string, variant: string, delta: number) {
    this.cart.update(items => {
      return items.map(item => {
        if (item.product.id === productId && item.variant === variant) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  }

  clearCart() {
    this.cart.set([]);
  }

  addToWishlist(product: Product) {
    this.wishlist.update(items => {
      // Check if product already in wishlist
      if (items.some(p => p.id === product.id)) {
        return items;
      }
      return [...items, product];
    });
  }

  removeFromWishlist(productId: string) {
    this.wishlist.update(items => items.filter(p => p.id !== productId));
  }

  isInWishlist(productId: string): boolean {
    return this.wishlist().some(p => p.id === productId);
  }

  clearWishlist() {
    this.wishlist.set([]);
  }
}

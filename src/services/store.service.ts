import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Product {
  productId: number;
  id: string; // slug
  name: string;
  category: string;
  description: string | null;
  price: number | null;
  priceOnRequest: boolean;
  images: string; // JSON string array
  colorVariations: string | null; // JSON string array of color variation objects
  specifications: string | null; // JSON object as string
  features: string | null; // JSON string array
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string | null;
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
  private http = inject(HttpClient);

  // Signals
  readonly products = signal<Product[]>([]);
  readonly cart = signal<CartItem[]>([]);

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<Product[]>('/api/products').subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (err) => {
        console.error('Failed to load products', err);
      }
    });
  }
  
  // Toast notification
  readonly toastItem = signal<CartItem | null>(null);
  private toastTimeout: any = null;

  // Helper methods to parse JSON fields
  parseImages(product: Product): string[] {
    try {
      return JSON.parse(product.images);
    } catch {
      return [];
    }
  }

  parseFeatures(product: Product): string[] {
    try {
      return product.features ? JSON.parse(product.features) : [];
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
      return product.colorVariations ? JSON.parse(product.colorVariations) : [];
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
}

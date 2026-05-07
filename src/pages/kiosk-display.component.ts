import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService, ExpoProduct } from '../services/products.service';

export interface ProductExpoDisplay {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number | null;
  priceOnRequest: boolean;
  images: string[];
  colorVariations: Array<{ color: string; images: string[] }> | null;
}

@Component({
  selector: 'app-kiosk-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kiosk-container">
      @if (loading()) {
        <div class="loading-screen">
          <div class="spinner"></div>
          <p>Loading products...</p>
        </div>
      } @else if (products().length === 0) {
        <div class="no-products">
          <h1>No Products Available</h1>
          <p>Please add products with the "ExpoFeatured" flag to display here.</p>
        </div>
      } @else {
        <div class="product-carousel">
          @let currentProduct = products()[currentIndex()];

          <!-- Product Image -->
          <div class="image-container">
            @if (currentProduct.images && currentProduct.images.length > 0) {
              <img
                [src]="getImageUrl(currentProduct.images[0])"
                [alt]="currentProduct.name"
                class="product-image"
                loading="lazy"
                (error)="onImageError($event)"
              >
            } @else {
              <div class="no-image">
                <p>No Image Available</p>
              </div>
            }
          </div>

          <!-- Product Info Overlay -->
          <div class="info-overlay">
            <div class="info-content">
              <span class="category-badge">{{ currentProduct.category }}</span>
              <h1 class="product-name">{{ currentProduct.name }}</h1>

              @if (currentProduct.priceOnRequest) {
                <p class="price-badge">Price on Request</p>
              } @else if (currentProduct.price) {
                <p class="price">R{{ currentProduct.price | number:'1.2-2' }}</p>
              }

              @if (currentProduct.description) {
                <p class="description">{{ currentProduct.description }}</p>
              }

              <!-- Color Variations -->
              @if (currentProduct.colorVariations && currentProduct.colorVariations.length > 0) {
                <div class="color-variations">
                  <span class="variations-label">Available Colors:</span>
                  <div class="colors">
                    @for (color of currentProduct.colorVariations; track color.color) {
                      <span class="color-badge">{{ color.color }}</span>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Navigation Controls -->
          <div class="controls">
            <button
              class="nav-button prev-button"
              (click)="previousProduct()"
              aria-label="Previous product"
            >
              <span class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                PREVIOUS
              </span>
            </button>

            <div class="product-counter">
              {{ currentIndex() + 1 }} / {{ products().length }}
            </div>

            <button
              class="nav-button next-button"
              (click)="nextProduct()"
              aria-label="Next product"
            >
              <span class="flex items-center gap-2">
                NEXT
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </span>
            </button>
          </div>

          <!-- Auto-rotate indicator -->
          <div class="auto-rotate-indicator">
            <span>Auto-rotating...</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .kiosk-container {
      width: 100%;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a103c 0%, #2a1a4e 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      overflow: hidden;
    }

    .loading-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      color: #a89f6e;
    }

    .spinner {
      border: 4px solid rgba(168, 159, 110, 0.3);
      border-radius: 50%;
      border-top: 4px solid #a89f6e;
      width: 60px;
      height: 60px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-screen p {
      font-size: 1.5rem;
      color: #a89f6e;
    }

    .no-products {
      text-align: center;
      color: #fff;
    }

    .no-products h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #a89f6e;
    }

    .no-products p {
      font-size: 1.2rem;
      color: #ccc;
    }

    .product-carousel {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(45deg, rgba(26, 16, 60, 0.95), rgba(42, 26, 78, 0.95));
    }

    .product-image {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
    }

    .no-image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #1a103c, #2a1a4e);
      color: #a89f6e;
      font-size: 2rem;
    }

    .info-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(26, 16, 60, 0.98), transparent);
      padding: 3rem 2rem 2rem 2rem;
      z-index: 10;
      min-height: 30%;
      display: flex;
      align-items: flex-end;
    }

    .info-content {
      width: 100%;
      color: #fff;
    }

    .category-badge {
      display: inline-block;
      background: #a89f6e;
      color: #1a103c;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .product-name {
      font-size: 3rem;
      font-weight: bold;
      margin: 0.5rem 0;
      color: #fff;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .price {
      font-size: 2rem;
      font-weight: bold;
      color: #a89f6e;
      margin: 0.5rem 0;
    }

    .price-badge {
      font-size: 1.2rem;
      color: #a89f6e;
      font-weight: bold;
      margin: 0.5rem 0;
    }

    .description {
      font-size: 1rem;
      color: #ddd;
      margin: 1rem 0 0 0;
      max-width: 600px;
      line-height: 1.5;
    }

    .color-variations {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .variations-label {
      font-size: 0.9rem;
      color: #a89f6e;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .colors {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .color-badge {
      display: inline-block;
      background: rgba(168, 159, 110, 0.2);
      border: 1px solid #a89f6e;
      color: #a89f6e;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.8rem;
      text-transform: capitalize;
    }

    .controls {
      position: absolute;
      bottom: 2rem;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      z-index: 20;
    }

    .nav-button {
      background: #a89f6e;
      color: #1a103c;
      border: none;
      padding: 1.5rem 3rem;
      font-size: 1.2rem;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      min-width: 200px;
    }

    .nav-button:hover {
      background: #c9bfa5;
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(168, 159, 110, 0.4);
    }

    .nav-button:active {
      transform: scale(0.98);
    }

    .nav-button span {
      display: block;
    }

    .product-counter {
      background: rgba(168, 159, 110, 0.3);
      color: #a89f6e;
      padding: 1rem 2rem;
      border-radius: 4px;
      font-size: 1.5rem;
      font-weight: bold;
      border: 2px solid #a89f6e;
      text-align: center;
    }

    .auto-rotate-indicator {
      position: absolute;
      top: 2rem;
      right: 2rem;
      background: rgba(168, 159, 110, 0.2);
      color: #a89f6e;
      padding: 0.8rem 1.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
      border: 1px solid #a89f6e;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }

    /* Tablet & Landscape Optimizations */
    @media (max-width: 1024px) {
      .product-name {
        font-size: 2rem;
      }

      .price {
        font-size: 1.5rem;
      }

      .nav-button {
        padding: 1rem 2rem;
        font-size: 1rem;
        min-width: 150px;
      }

      .product-counter {
        font-size: 1rem;
        padding: 0.5rem 1rem;
      }

      .info-overlay {
        padding: 2rem 1.5rem 1.5rem 1.5rem;
        min-height: 25%;
      }

      .controls {
        padding: 0 1.5rem;
        bottom: 1.5rem;
      }

      .category-badge {
        font-size: 0.8rem;
        padding: 0.4rem 0.8rem;
      }
    }

    @media (max-width: 640px) {
      .kiosk-container {
        height: 100vh;
      }

      .product-name {
        font-size: 1.5rem;
      }

      .price {
        font-size: 1.2rem;
      }

      .nav-button {
        padding: 0.8rem 1.2rem;
        font-size: 0.9rem;
        min-width: 100px;
      }

      .product-counter {
        font-size: 0.8rem;
        padding: 0.4rem 0.8rem;
      }

      .info-overlay {
        padding: 1.5rem 1rem 1rem 1rem;
        min-height: 20%;
      }

      .controls {
        padding: 0 1rem;
        bottom: 1rem;
        gap: 0.5rem;
      }

      .description {
        font-size: 0.85rem;
      }

      .auto-rotate-indicator {
        top: 1rem;
        right: 1rem;
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
      }

      .category-badge {
        font-size: 0.7rem;
        padding: 0.3rem 0.6rem;
      }
    }
  `]
})
export class KioskDisplayComponent implements OnInit, OnDestroy {
  products = signal<ProductExpoDisplay[]>([]);
  currentIndex = signal(0);
  loading = signal(true);
  private autoRotateInterval: number | undefined;
  private autoRotateDelay = 6000; // 6 seconds per product

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.loadExpoProducts();
  }

  ngOnDestroy() {
    this.stopAutoRotate();
  }

  private loadExpoProducts() {
    this.loading.set(true);
    // Call the backend expo endpoint
    this.productsService.getExpoProducts().subscribe({
      next: (products: ExpoProduct[]) => {
        // Transform from Product to ProductExpoDisplay
        const expoProducts: ProductExpoDisplay[] = products.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          price: p.price,
          priceOnRequest: p.priceOnRequest,
          images: this.normalizeImages(p.images),
          colorVariations: this.normalizeColorVariations(p.colorVariations)
        }));

        this.products.set(expoProducts);
        this.loading.set(false);

        if (expoProducts.length > 0) {
          this.startAutoRotate();
        }
      },
      error: (err) => {
        console.error('Failed to load expo products:', err);
        this.loading.set(false);
      }
    });
  }

  private parseJsonArray(jsonString: string): string[] {
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private normalizeImages(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }
    if (typeof value === 'string') {
      return this.parseJsonArray(value);
    }
    return [];
  }

  private parseColorVariations(jsonString: string | null): Array<{ color: string; images: string[] }> | null {
    if (!jsonString) return null;
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  private normalizeColorVariations(value: unknown): Array<{ color: string; images: string[] }> | null {
    if (Array.isArray(value)) {
      return value as Array<{ color: string; images: string[] }>;
    }
    if (typeof value === 'string') {
      return this.parseColorVariations(value);
    }
    return null;
  }

  private startAutoRotate() {
    this.autoRotateInterval = window.setInterval(() => {
      this.currentIndex.set((this.currentIndex() + 1) % this.products().length);
    }, this.autoRotateDelay);
  }

  private stopAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
    }
  }

  nextProduct() {
    const nextIndex = (this.currentIndex() + 1) % this.products().length;
    this.currentIndex.set(nextIndex);
    // Reset auto-rotate on manual navigation
    this.stopAutoRotate();
    this.startAutoRotate();
  }

  previousProduct() {
    const prevIndex = (this.currentIndex() - 1 + this.products().length) % this.products().length;
    this.currentIndex.set(prevIndex);
    // Reset auto-rotate on manual navigation
    this.stopAutoRotate();
    this.startAutoRotate();
  }

  getImageUrl(url: string): string {
    // Return the URL directly; if it's a Supabase URL or public URL, use it as-is
    return url;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.error('Failed to load image:', img.src);
    // Optionally set a placeholder image
    img.style.display = 'none';
  }
}

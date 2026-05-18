import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { WishlistService } from '../services/wishlist.service';
import { Product, StoreService } from '../services/store.service';
import { OptimizedImageComponent } from '../components/optimized-image.component';
import { ImageOptimizationService } from '../services/image-optimization.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, OptimizedImageComponent],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div class="flex items-center gap-3 mb-6">
          <a routerLink="/catalog" class="text-safs-dark font-bold hover:text-safs-gold-dark transition-colors">
            ← Back to catalog
          </a>
          <span class="text-gray-400">/</span>
          <span class="text-gray-600 font-semibold truncate">{{ product()?.category }}</span>
        </div>

        @if (!product()) {
          <div class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div class="text-gray-600 font-semibold">Loading product...</div>
          </div>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <!-- Gallery -->
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="p-4 sm:p-6 border-b border-gray-100">
                <div class="flex items-center justify-between gap-4">
                  <h1 class="text-3xl sm:text-4xl font-bold text-safs-dark leading-tight truncate">
                    {{ product()!.name }}
                  </h1>
                </div>

                <div class="mt-2 text-gray-500 font-medium">
                  {{ product()!.category }}
                </div>
              </div>

               <div class="p-4 sm:p-6">
                 <div
                   class="relative rounded-2xl bg-gray-50 overflow-hidden h-[360px] sm:h-[420px] cursor-crosshair"
                   (mousemove)="updateZoomPosition($event)"
                   (mouseenter)="isZoomed.set(true)"
                   (mouseleave)="isZoomed.set(false)"
                 >
                   <div
                     class="w-full h-full transition-transform duration-200 ease-out"
                     [style.transform-origin]="zoomOrigin()"
                     [class.scale-150]="isZoomed()"
                   >
                     <app-optimized-image
                       [src]="getOptimizedMainImage()"
                       [alt]="product()!.name"
                       [aspectRatio]="getProductDetailAspectRatio()"
                       loading="eager"
                       fetchpriority="high"
                       containerClass="object-contain"
                     ></app-optimized-image>
                   </div>
                 </div>

                 @if (activeThumbnails().length > 1) {
                   <div class="mt-4 flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                     @for (img of activeThumbnails(); track img) {
                       <button
                         type="button"
                         class="shrink-0 rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:border-safs-gold transition-colors"
                         (click)="selectedImage.set(img)"
                         [class.ring-2]="img === selectedImage()"
                         [class.ring-safs-gold]="img === selectedImage()"
                       >
                         <img class="w-14 h-14 sm:w-16 sm:h-16 object-cover" [src]="img" [alt]="product()!.name" />
                       </button>
                     }
                   </div>
                 }
              </div>

            </div>

            <!-- Details / options -->
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div class="flex items-start justify-between gap-6">
                <div>
                  <div class="text-xs uppercase tracking-widest font-black text-safs-gold-dark">
                    {{ product()!.category }}
                  </div>
                  <p class="mt-3 text-gray-600 leading-relaxed">
                    {{ product()!.description || 'View product details and select your finish/variant below.' }}
                  </p>
                </div>

              </div>

              <!-- Color/Finish selector -->
              @if (colors().length > 0) {
                <div class="mt-8">
                  <h3 class="font-bold text-safs-dark mb-4 uppercase tracking-wider text-sm">
                    Select color
                  </h3>

                  <div class="flex flex-wrap gap-2">
                    @for (c of colors(); track c.color) {
                      <button
                        type="button"
                        class="px-4 py-3 rounded-xl font-bold border transition-all shadow-sm"
                        (click)="selectColor(c.color)"
                        [class.bg-safs-gold]="selectedColor() === c.color"
                        [class.text-black]="selectedColor() === c.color"
                        [class.bg-white]="selectedColor() !== c.color"
                        [class.text-gray-600]="selectedColor() !== c.color"
                        [class.border-safs-gold]="selectedColor() === c.color"
                        [class.border-gray-200]="selectedColor() !== c.color"
                      >
                        <span class="capitalize">{{ c.color }}</span>
                      </button>
                    }
                  </div>
                </div>
              }

              @if (variantOptions().length > 0) {
                <div class="mt-6">
                  <h3 class="font-bold text-safs-dark mb-4 uppercase tracking-wider text-sm">
                    Select finish/variant
                  </h3>

                  <div class="flex flex-wrap gap-2">
                    @for (v of variantOptions(); track v) {
                      <button
                        type="button"
                        class="px-4 py-3 rounded-xl font-bold border transition-all shadow-sm"
                        (click)="selectVariant(v)"
                        [class.bg-safs-dark]="selectedVariant() === v"
                        [class.text-white]="selectedVariant() === v"
                        [class.bg-white]="selectedVariant() !== v"
                        [class.text-gray-600]="selectedVariant() !== v"
                        [class.border-gray-200]="selectedVariant() !== v"
                        [class.border-safs-dark]="selectedVariant() === v"
                      >
                        {{ v }}
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Specifications -->
              @if (specificationsKeys().length > 0) {
                <div class="mt-8">
                  <h3 class="font-bold text-safs-dark mb-4 uppercase tracking-wider text-sm">
                    Specifications
                  </h3>
                  <div class="overflow-hidden rounded-2xl border border-gray-100">
                    <table class="w-full text-sm">
                      <tbody>
                        @for (k of specificationsKeys(); track k) {
                          <tr class="border-t border-gray-100">
                            <td class="px-4 py-3 font-semibold text-gray-700 w-1/3 align-top">{{ k }}</td>
                            <td class="px-4 py-3 text-gray-600">{{ specifications()[k] }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }

               <!-- Actions (Add to Quote Removed) -->
            </div>
          </div>

          @if (relatedProducts().length > 0) {
            <div
              class="mt-16 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8"
              (mouseenter)="pauseCarousel()"
              (mouseleave)="resumeCarousel()"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-safs-dark">More in {{ product()!.category }}</h2>
                <div class="flex gap-2">
                  <button
                    type="button"
                    (click)="prevRelated()"
                    class="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                    aria-label="Previous related products"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    (click)="nextRelated()"
                    class="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                    aria-label="Next related products"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="overflow-hidden relative">
                <div
                  class="flex transition-transform duration-500 ease-in-out gap-4"
                  [style.transform]="'translateX(calc(-' + currentRelatedIndex() + ' * (100% / ' + getVisibleCards() + ')))'"
                >
                  @for (rp of relatedProducts(); track rp.id) {
                    <a
                      [routerLink]="['/product', rp.id]"
                      class="shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 group border border-gray-100 rounded-2xl p-4 hover:border-safs-gold hover:shadow-md transition-all"
                    >
                      <div class="rounded-xl bg-gray-50 overflow-hidden mb-4">
                        <app-optimized-image
                          [src]="getOptimizedRelatedImage(rp)"
                          [alt]="rp.name"
                          aspectRatio="4/3"
                          loading="lazy"
                          containerClass="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        ></app-optimized-image>
                      </div>
                      <h3 class="font-bold text-safs-dark truncate">{{ rp.name }}</h3>
                      <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ rp.description || 'View details' }}</p>
                    </a>
                  }
                </div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private store = inject(StoreService);
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);
  private imageOptimization = inject(ImageOptimizationService);

  // Selection state
  selectedColor = signal<string | null>(null);
  selectedVariant = signal<string>('Standard');
  selectedImage = signal<string>('');

  // Zoom state
  isZoomed = signal(false);
  zoomOrigin = signal('center center');

  // Carousel state
  currentRelatedIndex = signal(0);
  private carouselInterval: ReturnType<typeof setInterval> | null = null;

  productId = signal('');
  private routeSubscription: Subscription | null = null;

  product = computed<Product | null>(() => {
    const id = this.productId();
    if (!id) return null;
    return this.store.products().find((p) => p.id === id) ?? null;
  });

  colors = computed(() => {
    const p = this.product();
    if (!p) return [];
    return this.store.parseColorVariations(p);
  });

  variantOptions = computed(() => {
    const p = this.product();
    if (!p) return [];
    // In this app, "features" represent available finishes/variants.
    return this.store.parseFeatures(p);
  });

  specifications = computed(() => {
    const p = this.product();
    if (!p) return {};
    return this.store.parseSpecifications(p);
  });

  specificationsKeys = computed(() => Object.keys(this.specifications()));

  mainImage = computed(() => {
    const p = this.product();
    if (!p) return '';

    // Prefer selected color gallery if present.
    const c = this.colors().find((x) => x.color === this.selectedColor());
    if (c?.images?.length) return this.selectedImage() || c.images[0];

    const imgs = this.store.parseImages(p);
    return this.selectedImage() || imgs[0] || '';
  });

  activeThumbnails = computed(() => {
    const c = this.colors().find((x) => x.color === this.selectedColor());
    if (c?.images?.length) return c.images;
    const p = this.product();
    if (!p) return [];
    return this.store.parseImages(p);
  });

  wishlistActive = computed(() => {
    const p = this.product();
    if (!p) return false;
    return this.wishlistService.isInWishlist(p.id);
  });

  relatedProducts = computed(() => {
    const currentProduct = this.product();
    if (!currentProduct) return [];

    return this.store.products()
      .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
      .slice(0, 6);
  });

  constructor() {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.productId.set(params.get('id') ?? '');
    });

    effect(() => {
      const p = this.product();
      if (!p) return;

      // Reset selections when navigating to a different product.
      this.selectedImage.set('');
      this.isZoomed.set(false);
      this.currentRelatedIndex.set(0);

      const cs = this.colors();
      if (cs.length > 0) {
        const current = this.selectedColor();
        if (!current || !cs.some((x) => x.color === current)) {
          this.selectedColor.set(cs[0].color);
        }
      } else {
        this.selectedColor.set(null);
      }

      const variants = this.variantOptions();
      if (variants.length > 0 && !variants.includes(this.selectedVariant())) {
        this.selectedVariant.set(variants[0]);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
    this.routeSubscription?.unsubscribe();
    this.routeSubscription = null;
  }

  updateZoomPosition(event: MouseEvent) {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.zoomOrigin.set(`${x}% ${y}%`);
  }

  selectColor(color: string) {
    this.selectedColor.set(color);
    // In many SAFS products, color maps to a finish/variant too.
    if (this.variantOptions().includes(color)) {
      this.selectedVariant.set(color);
    }
    const c = this.colors().find((x) => x.color === color);
    if (c?.images?.length) {
      this.selectedImage.set(c.images[0]);
    } else {
      this.selectedImage.set('');
    }
  }

  selectVariant(variant: string) {
    this.selectedVariant.set(variant);
    // If the variant matches a color/finish that has images, sync the color selection
    // to display the corresponding image gallery.
    if (this.colors().some((c) => c.color === variant)) {
      this.selectedColor.set(variant);
      const c = this.colors().find((color) => color.color === variant);
      if (c?.images?.length) {
        this.selectedImage.set(c.images[0]);
      } else {
        this.selectedImage.set('');
      }
    }
  }

  toggleWishlist(product: Product) {
    if (!this.authService.isAuthenticated()) return;

    if (this.wishlistService.isInWishlist(product.id)) {
      const item = this.wishlistService.wishlistItems().find((i) => i.productId === product.id);
      if (item) {
        this.wishlistService.removeFromWishlist(item.id).subscribe();
      }
      return;
    }

    this.wishlistService.addToWishlist(product.id).subscribe();
  }

  addToCart() {
    const p = this.product();
    if (!p) return;
    const variant = this.selectedVariant() || 'Standard';
    this.store.addToCart(p, variant);
  }

  getOptimizedMainImage(): string {
    return this.imageOptimization.getOptimizedImagePath(this.mainImage());
  }

  getOptimizedRelatedImage(product: Product): string {
    const images = this.store.parseImages(product);
    return images.length > 0 ? this.imageOptimization.getOptimizedImagePath(images[0]) : '';
  }

  getProductDetailAspectRatio(): string {
    const p = this.product();
    if (!p) return '4/3';

    return this.imageOptimization.getAspectRatioForCategory(p.category);
  }

  getVisibleCards(): number {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 768) return 2;
    if (window.innerWidth < 1024) return 3;
    return 4;
  }

  nextRelated() {
    const total = this.relatedProducts().length;
    const maxIndex = Math.max(0, total - this.getVisibleCards());
    if (this.currentRelatedIndex() < maxIndex) {
      this.currentRelatedIndex.update((i) => i + 1);
    } else {
      this.currentRelatedIndex.set(0);
    }
  }

  prevRelated() {
    const total = this.relatedProducts().length;
    const maxIndex = Math.max(0, total - this.getVisibleCards());
    if (this.currentRelatedIndex() > 0) {
      this.currentRelatedIndex.update((i) => i - 1);
    } else {
      this.currentRelatedIndex.set(maxIndex);
    }
  }

  startCarousel() {
    this.stopCarousel();
    this.carouselInterval = setInterval(() => {
      this.nextRelated();
    }, 4000);
  }

  stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }

  pauseCarousel() {
    this.stopCarousel();
  }

  resumeCarousel() {
    this.startCarousel();
  }
}


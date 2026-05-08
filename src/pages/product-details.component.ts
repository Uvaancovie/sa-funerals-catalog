import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
                 <div class="rounded-2xl bg-gray-50 overflow-hidden h-[360px] sm:h-[420px]">
                   <app-optimized-image
                     [src]="getOptimizedMainImage()"
                     [alt]="product()!.name"
                     [aspectRatio]="getProductDetailAspectRatio()"
                     loading="eager"
                     fetchpriority="high"
                     containerClass="object-contain"
                   ></app-optimized-image>
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

               <!-- Mobile Wishlist -->
               <div class="px-4 sm:px-6 pb-6 lg:hidden">
                 <button
                   type="button"
                   class="w-full py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm font-semibold text-gray-700 flex items-center justify-center gap-2"
                   (click)="toggleWishlist(product()!)"
                   [disabled]="!authService.isAuthenticated()"
                   [class.opacity-60]="!authService.isAuthenticated()"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                     [attr.fill]="wishlistActive() ? 'currentColor' : 'none'"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                     <path
                       d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                     ></path>
                   </svg>
                   {{ wishlistActive() ? 'Remove from wishlist' : 'Add to wishlist' }}
                 </button>
                 @if (!authService.isAuthenticated()) {
                   <div class="text-xs text-gray-500 mt-2 text-center">
                     Login to save items.
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
                    {{ product()!.description || 'Request a quote for this item. Select your finish/variant below.' }}
                  </p>
                </div>

                <!-- Desktop Wishlist -->
                <button
                  type="button"
                  class="hidden lg:inline-flex items-center justify-center w-12 h-12 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                  (click)="toggleWishlist(product()!)"
                  [disabled]="!authService.isAuthenticated()"
                  [class.opacity-60]="!authService.isAuthenticated()"
                  aria-label="Toggle wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                    [attr.fill]="wishlistActive() ? 'currentColor' : 'none'"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    ></path>
                  </svg>
                </button>
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
                        (click)="selectedVariant.set(v)"
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

               <!-- Actions -->
               <div class="mt-8 lg:mt-10 pt-6 border-t border-gray-100 flex flex-col gap-4">
                 @if (authService.isApproved() || authService.isAdmin()) {
                   <button
                     type="button"
                     class="py-3 lg:py-4 w-full rounded-xl lg:rounded-2xl bg-safs-dark text-white font-bold text-lg lg:text-xl hover:opacity-95 transition-all shadow-xl"
                     (click)="addToCart()"
                   >
                     Add to Quote
                   </button>
                 } @else if (authService.isPending()) {
                   <button
                     type="button"
                     class="py-3 lg:py-4 w-full rounded-xl lg:rounded-2xl bg-white border border-yellow-200 text-yellow-700 font-bold text-lg lg:text-xl hover:bg-yellow-50 transition-all shadow-sm"
                     disabled
                   >
                     Awaiting Approval
                   </button>
                 } @else {
                   <button
                     type="button"
                     class="py-3 lg:py-4 w-full rounded-xl lg:rounded-2xl bg-white border border-gray-200 text-safs-dark font-bold text-lg lg:text-xl hover:bg-gray-50 transition-all shadow-sm"
                     disabled
                   >
                     Login to Price
                   </button>
                 }

                 <div class="text-xs text-gray-500 text-center lg:text-left">
                   Selected variant: <span class="font-semibold text-gray-700">{{ selectedVariant() }}</span>
                 </div>
               </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ProductDetailsComponent {
  private route = inject(ActivatedRoute);
  private store = inject(StoreService);
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);
  private imageOptimization = inject(ImageOptimizationService);

  // Selection state
  selectedColor = signal<string | null>(null);
  selectedVariant = signal<string>('Standard');
  selectedImage = signal<string>('');

  productId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');

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

  constructor() {
    effect(() => {
      const p = this.product();
      if (!p) return;

      // Reset selections when navigating to a different product.
      this.selectedImage.set('');

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

  selectColor(color: string) {
    this.selectedColor.set(color);
    // In many SAFS products, color maps to a finish/variant too.
    if (this.variantOptions().includes(color)) {
      this.selectedVariant.set(color);
    }
    // Reset image selection; computed `mainImage` will fall back to first image for the color.
    this.selectedImage.set('');
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

  getProductDetailAspectRatio(): string {
    const p = this.product();
    if (!p) return '4/3';

    return this.imageOptimization.getAspectRatioForCategory(p.category);
  }
}


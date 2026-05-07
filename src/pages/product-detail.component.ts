import { Component, inject, computed, signal, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoreService, Product } from '../services/store.service';
import { AuthService } from '../services/auth.service';
import { GoogleReviewsComponent } from '../components/google-reviews.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, GoogleReviewsComponent],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="container mx-auto px-4 max-w-7xl">
        
        <!-- Breadcrumb -->
        <nav class="mb-10 text-sm flex items-center gap-2 text-gray-400">
          <a routerLink="/" class="hover:text-safs-gold transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </a>
          <span class="opacity-30">/</span>
          <a routerLink="/catalog" class="hover:text-safs-gold transition-colors">Products</a>
          <span class="opacity-30">/</span>
          <span class="text-safs-dark font-bold underline decoration-safs-gold decoration-2 underline-offset-4">{{ product()?.name }}</span>
        </nav>

        @if (product(); as p) {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 text-safs-dark">
            
            <!-- Left: Interactive Image Area -->
            <div class="lg:col-span-7 space-y-6">
              
              <!-- Main Image with Zoom -->
              <div 
                class="relative bg-white rounded-xl shadow-sm p-6 md:p-10 border border-gray-200 overflow-hidden group cursor-crosshair h-[400px] md:h-[600px] flex items-center justify-center touch-none"
                (mousemove)="handleMagnify($event)"
                (mouseleave)="isMagnifying.set(false)"
                (touchstart)="handleTouch($event)"
                (touchmove)="handleTouch($event)"
                (touchend)="isMagnifying.set(false)"
                #imageContainer>
                
                <div class="absolute top-6 left-6 md:top-8 md:left-8 z-10">
                   <span class="bg-safs-dark text-white text-[10px] font-semibold px-3 py-1.5 rounded uppercase tracking-wider shadow-sm">Premium Collection</span>
                </div>

                <!-- Base Image -->
                <img 
                  [src]="getCurrentImage(p)" 
                  [alt]="p.name" 
                  class="max-w-full max-h-full object-contain transition-all duration-500"
                  [style.opacity]="isMagnifying() ? '0.3' : '1'"
                  #mainImage>

                <!-- Magnifier Lens View -->
                @if (isMagnifying()) {
                  <div 
                    class="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-xl"
                    style="background-repeat: no-repeat;"
                    [style.background-image]="'url(' + getCurrentImage(p) + ')'"
                    [style.background-position]="magnifyPos()"
                    [style.background-size]="'200%'">
                  </div>
                  
                  <!-- Magnifier Circle UI Overlay -->
                  <div 
                    class="absolute w-40 h-40 rounded-full border-4 border-white shadow-2xl pointer-events-none z-30 flex items-center justify-center overflow-hidden"
                    [style.left.px]="mousePos().x - 80"
                    [style.top.px]="mousePos().y - 80">
                     <div class="absolute inset-0 bg-safs-gold/10"></div>
                  </div>
                }

                <div class="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex justify-between items-end z-10 pointer-events-none">
                   <div class="p-4 bg-white/95 rounded-lg shadow-sm border border-gray-200 text-left">
                      <p class="text-[10px] text-gray-500 uppercase font-semibold tracking-wider mb-1">Interactive Detail</p>
                      <p class="text-xs font-semibold text-safs-dark">Hold & slide to explore</p>
                   </div>
                </div>
              </div>

              <!-- Carousel Controls -->
              @if (getVariantImages(p).length > 1) {
                <div class="space-y-4">
                  <!-- Carousel Navigation -->
                  <div class="flex items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <button
                      (click)="previousImage()"
                      class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:border-safs-gold hover:bg-safs-gold/5 transition-all text-gray-600 hover:text-safs-gold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>

                    <div class="flex-1 text-center">
                      <span class="text-xs font-bold text-safs-dark uppercase tracking-wider">
                        {{ selectedImageIndex() + 1 }} / {{ getVariantImages(p).length }}
                      </span>
                      @if (isAutoRotating()) {
                        <div class="flex items-center justify-center gap-1.5 mt-1">
                          <span class="flex h-1.5 w-1.5">
                            <span class="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-safs-gold opacity-75"></span>
                            <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-safs-gold"></span>
                          </span>
                          <span class="text-[9px] text-gray-500">Auto-rotating</span>
                        </div>
                      }
                    </div>

                    <button
                      (click)="nextImage()"
                      class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:border-safs-gold hover:bg-safs-gold/5 transition-all text-gray-600 hover:text-safs-gold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>

                  <!-- Thumbnail Carousel -->
                  <div class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar px-1">
                    @for (img of getVariantImages(p); track img; let i = $index) {
                      <button
                        (click)="selectedImageIndex.set(i); pauseAutoRotate(); startAutoRotate();"
                        class="relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white shadow-sm"
                        [class.border-safs-gold]="selectedImageIndex() === i"
                        [class.opacity-50]="selectedImageIndex() !== i"
                        [class.hover:opacity-100]="selectedImageIndex() !== i"
                        [class.border-transparent]="selectedImageIndex() !== i">
                        <img [src]="img" class="w-full h-full object-cover">
                      </button>
                    }
                  </div>
                </div>
              }
              
              <!-- FAQ Accordion -->
              <div class="space-y-4 pt-4">
                 <h3 class="font-bold text-safs-dark text-lg mb-4">Frequently Asked Questions</h3>
                 
                 <details class="group border border-gray-200 rounded-xl bg-white overflow-hidden">
                    <summary class="flex items-center justify-between font-bold cursor-pointer list-none p-5 text-safs-dark hover:bg-safs-dark hover:text-white transition-colors">
                       Who is South African Funeral Supplies?
                       <span class="transition group-open:rotate-180">
                          <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                       </span>
                    </summary>
                    <div class="text-gray-600 mt-3 p-5 pt-0 border-t border-gray-100">
                       Since our inception in 1998, we have been at the forefront of product design and innovation. This has established our brand as the premium supplier of quality caskets, equipment and requisites to the funeral industry, both in South Africa and within the African continent.
                    </div>
                 </details>

                 <details class="group border border-gray-200 rounded-xl bg-white overflow-hidden">
                    <summary class="flex items-center justify-between font-bold cursor-pointer list-none p-5 text-safs-dark hover:bg-safs-dark hover:text-white transition-colors">
                       What is your commitment to quality?
                       <span class="transition group-open:rotate-180">
                          <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                       </span>
                    </summary>
                    <div class="text-gray-600 mt-3 p-5 pt-0 border-t border-gray-100">
                       As a quality-conscious organisation, we are committed to providing bereaved families with products that are manufactured with a strict and consistent commitment to the highest quality standards.
                    </div>
                 </details>

                 <details class="group border border-gray-200 rounded-xl bg-white overflow-hidden">
                    <summary class="flex items-center justify-between font-bold cursor-pointer list-none p-5 text-safs-dark hover:bg-safs-dark hover:text-white transition-colors">
                       What is your company Vision?
                       <span class="transition group-open:rotate-180">
                          <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                       </span>
                    </summary>
                    <div class="text-gray-600 mt-3 p-5 pt-0 border-t border-gray-100">
                       Our vision is to be Africa's largest manufacturer and supplier of superior quality products and services that will assist our customers to meet their organisational objectives.
                    </div>
                 </details>

                 <details class="group border border-gray-200 rounded-xl bg-white overflow-hidden">
                    <summary class="flex items-center justify-between font-bold cursor-pointer list-none p-5 text-safs-dark hover:bg-safs-dark hover:text-white transition-colors">
                       How do you approach business sustainability?
                       <span class="transition group-open:rotate-180">
                          <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                       </span>
                    </summary>
                    <div class="text-gray-600 mt-3 p-5 pt-0 border-t border-gray-100">
                       We develop our business sustainably for the benefit of our stakeholders, achieving optimal ROI while maintaining the highest levels of quality and service, and assisting with the profitability of our customers' businesses.
                    </div>
                 </details>
              </div>
            </div>

            <!-- Right: Details Section -->
            <div class="lg:col-span-5">
              <div class="bg-white rounded-xl p-8 lg:p-12 shadow-sm border border-gray-200 sticky top-10">
                
                <div class="mb-10">
                  <div class="flex items-center gap-3 mb-4">
                    <span class="text-safs-gold font-semibold uppercase tracking-widest text-xs">{{ p.category }}</span>
                  </div>
                  <h1 data-testid="product-title" class="text-4xl font-bold text-safs-dark mb-4 leading-tight">{{ p.name }}</h1>
                  
                  <div class="flex items-center gap-4 text-xs text-gray-500 mb-8 border-y border-gray-100 py-4">
                     <span class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span class="font-bold text-gray-600">Available to Order</span>
                     </span>
                     <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                     <span>Manufactured in South Africa</span>
                  </div>
                </div>

                <div class="mb-10">
                  <h3 class="font-semibold text-safs-dark mb-3 text-sm uppercase tracking-wider">Product Description</h3>
                  <p class="text-gray-600 leading-relaxed text-sm">
                    This exquisite {{ p.name }} is custom built with focus on dignity and durability. 
                    Featuring a smooth high-gloss finish and plush satin interior for a truly respectful tribute.
                  </p>
                </div>

                <!-- Color Variations or Variants selection -->
                <div class="mb-10">
                  <h3 class="font-semibold text-safs-dark mb-4 text-sm uppercase tracking-wider flex items-center justify-between">
                     <span>Selective Finish</span>
                     <span class="text-safs-gold text-xs font-semibold">{{ selectedVariant() }}</span>
                  </h3>
                  <div class="flex flex-wrap gap-5">
                    @if (getColorVariations(p).length > 0) {
                      @for (variation of getColorVariations(p); track variation.color; let i = $index) {
                        <button 
                          (click)="selectColorVariation(i, variation.color)"
                          class="group relative"
                          [title]="variation.color">
                          <div 
                             [style.background-color]="getVariantColor(variation.color)" 
                             class="w-12 h-12 rounded-full border border-gray-200 transition-all duration-300 transform group-hover:scale-105 shadow-sm"
                             [class.ring-2]="selectedColorIndex() === i"
                             [class.ring-safs-gold]="selectedColorIndex() === i"
                             [class.ring-offset-2]="selectedColorIndex() === i">
                          </div>
                          @if (selectedColorIndex() === i) {
                            <div class="absolute -top-1 -right-1 w-4 h-4 bg-safs-gold rounded-full flex items-center justify-center shadow border border-white">
                               <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          }
                          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {{ variation.color }}
                          </div>
                        </button>
                      }
                    } @else {
                      @for (variant of store.parseFeatures(p); track variant) {
                        <button 
                          (click)="selectedVariant.set(variant)"
                          class="group relative"
                          [title]="variant">
                          <div 
                             [style.background-color]="getVariantColor(variant)" 
                             class="w-14 h-14 rounded-2xl border-2 transition-all duration-300 transform group-hover:scale-110 shadow-sm"
                             [class.border-safs-gold]="selectedVariant() === variant"
                             [class.scale-110]="selectedVariant() === variant"
                             [class.shadow-xl]="selectedVariant() === variant"
                             [class.border-transparent]="selectedVariant() !== variant">
                          </div>
                          @if (selectedVariant() === variant) {
                            <div class="absolute -top-2 -right-2 w-5 h-5 bg-safs-gold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                               <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          }
                        </button>
                      }
                    }
                  </div>
                </div>

                <!-- Quantity & Add to Quote -->
                <div class="space-y-6">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                       <h3 class="font-bold text-safs-dark text-[10px] md:text-xs uppercase tracking-widest shrink-0">Quantity</h3>
                       <div class="flex items-center bg-gray-50 rounded-2xl p-1.5 md:p-2 border border-gray-100">
                          <button (click)="updateQuantity(-1)" class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 text-safs-dark transition-colors font-bold text-base">-</button>
                          <span class="w-10 md:w-12 text-center font-bold text-base md:text-lg">{{ quantity() }}</span>
                          <button (click)="updateQuantity(1)" class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 text-safs-dark transition-colors font-bold text-base">+</button>
                       </div>
                    </div>

                    <div class="flex gap-4">
                        <button (click)="addToCart()" class="flex-1 bg-safs-dark text-white font-bold py-4 md:py-6 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 md:gap-4 text-base md:text-lg shadow-sm shadow-safs-dark/20 transform active:scale-95 group">
                          <span>Add to Quote Request</span>
                          <svg class="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                        
                        <button
                          (click)="toggleWishlist(p)"
                          class="w-16 md:w-20 font-bold rounded-xl transition-all flex items-center justify-center shadow-sm transform active:scale-95 group"
                          [class.bg-red-100]="store.isInWishlist(p.id)"
                          [class.bg-gray-100]="!store.isInWishlist(p.id)"
                          [class.text-red-600]="store.isInWishlist(p.id)"
                          [class.text-safs-dark]="!store.isInWishlist(p.id)"
                          [class.hover:bg-red-200]="store.isInWishlist(p.id)"
                          [class.hover:bg-gray-200]="!store.isInWishlist(p.id)"
                          title="Add to Wishlist">
                          <svg class="group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" [attr.fill]="store.isInWishlist(p.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
                    </div>
                    
                    <a routerLink="/cart" class="w-full text-center py-2 text-gray-400 font-bold hover:text-safs-dark transition-colors flex items-center justify-center gap-2 text-[11px] md:text-sm">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
                       Review Quote List ({{ store.cartCount() }})
                    </a>
                </div>
                <div class="mt-10 pt-10 border-t border-gray-100">
                    <h3 class="font-bold text-safs-dark mb-6 text-xs uppercase tracking-widest">
                       Customer Confidence
                    </h3>
                    <app-google-reviews></app-google-reviews>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom: Related -->
          <div class="border-t border-gray-200 pt-24 pb-20">
             <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                <div>
                   <h2 class="text-3xl md:text-4xl font-bold text-safs-dark mb-4 tracking-tight">View similar products</h2>
                   <p class="text-gray-400 font-medium">Explore further from our extensive {{ p.category }} range.</p>
                </div>
                <a routerLink="/catalog" class="bg-white border-2 border-safs-gold text-safs-gold font-bold px-8 py-4 rounded-xl hover:bg-safs-gold hover:text-white transition-all flex items-center gap-3 shadow-sm">
                   View Full Collection
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
             </div>
             
             <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               @for (related of relatedProducts(); track related.id) {
                 <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 p-6 flex flex-col cursor-pointer group" [routerLink]="['/product', related.id]">
                    <div class="aspect-square bg-gray-50 rounded-2xl mb-6 flex items-center justify-center p-6 border border-gray-50 overflow-hidden">
                       <img [src]="store.parseImages(related)[0] || ''" class="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <div class="text-[9px] font-black text-safs-gold uppercase tracking-[0.3em] mb-2">{{ related.category }}</div>
                    <h4 class="text-xl font-bold text-safs-dark mb-4 group-hover:text-safs-gold transition-colors leading-tight">{{ related.name }}</h4>
                    <div class="mt-auto pt-4 border-t border-gray-50 flex justify-end items-center">
                       <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-safs-dark group-hover:bg-safs-gold group-hover:text-white transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                       </div>
                    </div>
                 </div>
               }
             </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  store = inject(StoreService);
  authService = inject(AuthService);

  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;

  productId = signal<string>('');
  selectedVariant = signal<string>('');
  selectedColorIndex = signal<number>(0);
  selectedImageIndex = signal<number>(0);
  quantity = signal<number>(1);

  // Magnifier signals
  isMagnifying = signal<boolean>(false);
  mousePos = signal({ x: 0, y: 0 });
  magnifyPos = signal('center');

  // Carousel signals
  autoRotateInterval = signal<any>(null);
  isAutoRotating = signal<boolean>(false);

  product = computed(() => {
    return this.store.products().find(p => p.id === this.productId());
  });

  relatedProducts = computed(() => {
    const current = this.product();
    if (!current) return [];
    return this.store.products()
      .filter(p => p.category === current.category && p.id !== current.id)
      .slice(0, 4);
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId.set(id);
        this.selectedColorIndex.set(0);
        this.selectedImageIndex.set(0);
        const p = this.store.products().find(p => p.id === id);
        if (p) {
          const colorVars = this.store.parseColorVariations(p);
          if (colorVars.length > 0) {
            this.selectedVariant.set(colorVars[0].color);
          } else {
            const features = this.store.parseFeatures(p);
            if (features.length > 0) {
              this.selectedVariant.set(features[0]);
            }
          }
        }
        this.quantity.set(1);
      }
    });
  }

  ngOnInit() {
    // Start auto-rotate when product is loaded
    const p = this.product();
    if (p && this.getVariantImages(p).length > 1) {
      this.startAutoRotate();
    }
  }

  getColorVariations(product: Product): { color: string; images: string[] }[] {
    return this.store.parseColorVariations(product);
  }

  getCurrentImage(product: Product): string {
    const images = this.getVariantImages(product);
    return images.length > this.selectedImageIndex() ? images[this.selectedImageIndex()] : images[0] || '';
  }

  getVariantImages(product: Product): string[] {
    const colorVars = this.getColorVariations(product);
    if (colorVars.length > 0) {
      const selectedIndex = this.selectedColorIndex();
      if (selectedIndex >= 0 && selectedIndex < colorVars.length) {
        return colorVars[selectedIndex].images;
      }
    }
    return this.store.parseImages(product);
  }

  selectColorVariation(index: number, color: string) {
    this.selectedColorIndex.set(index);
    this.selectedImageIndex.set(0);
    this.selectedVariant.set(color);
    this.pauseAutoRotate();
    this.startAutoRotate();
  }

  addToWishlist(product: Product) {
    this.store.addToWishlist(product);
  }

  toggleWishlist(product: Product) {
    if (this.store.isInWishlist(product.id)) {
      this.store.removeFromWishlist(product.id);
    } else {
      this.store.addToWishlist(product);
    }
  }

  // Carousel methods
  startAutoRotate() {
    if (this.autoRotateInterval()) {
      clearInterval(this.autoRotateInterval());
    }

    const images = this.product() ? this.getVariantImages(this.product()!) : [];
    if (images.length <= 1) return;

    this.isAutoRotating.set(true);
    const interval = setInterval(() => {
      this.nextImage();
    }, 5000); // Auto-rotate every 5 seconds

    this.autoRotateInterval.set(interval);
  }

  pauseAutoRotate() {
    if (this.autoRotateInterval()) {
      clearInterval(this.autoRotateInterval());
      this.autoRotateInterval.set(null);
    }
    this.isAutoRotating.set(false);
  }

  nextImage() {
    const p = this.product();
    if (!p) return;

    const images = this.getVariantImages(p);
    if (images.length === 0) return;

    const current = this.selectedImageIndex();
    const next = (current + 1) % images.length;
    this.selectedImageIndex.set(next);
    this.pauseAutoRotate();
    this.startAutoRotate();
  }

  previousImage() {
    const p = this.product();
    if (!p) return;

    const images = this.getVariantImages(p);
    if (images.length === 0) return;

    const current = this.selectedImageIndex();
    const prev = (current - 1 + images.length) % images.length;
    this.selectedImageIndex.set(prev);
    this.pauseAutoRotate();
    this.startAutoRotate();
  }

  ngOnDestroy() {
    this.pauseAutoRotate();
  }

  handleMagnify(event: MouseEvent) {
    if (!this.imageContainer) return;
    this.isMagnifying.set(true);

    const rect = this.imageContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.updateMagnify(x, y, rect);
  }

  handleTouch(event: TouchEvent) {
    if (!this.imageContainer || event.touches.length === 0) return;
    this.isMagnifying.set(true);

    const rect = this.imageContainer.nativeElement.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    this.updateMagnify(x, y, rect);
  }

  private updateMagnify(x: number, y: number, rect: DOMRect) {
    this.mousePos.set({ x, y });

    // Calculate percentage for background position
    const posX = (x / rect.width) * 100;
    const posY = (y / rect.height) * 100;
    this.magnifyPos.set(`${posX}% ${posY}%`);
  }

  updateQuantity(delta: number) {
    this.quantity.update(q => Math.max(1, q + delta));
  }

  addToCart() {
    const p = this.product();
    const v = this.selectedVariant();
    const q = this.quantity();
    if (p && v) {
      // Small trick: to handle quantity we could call store.addToCart 'q' times or update store
      // For now we'll just add it with current store logic (quantity=1) but we should improve service
      for (let i = 0; i < q; i++) {
        this.store.addToCart(p, v);
      }
    }
  }

  getVariantColor(variant: string): string {
    const v = variant.toLowerCase();
    const colors: Record<string, string> = {
      'cherry': '#7e2d2d',
      'cherry gloss': '#8b2020',
      'dark cherry': '#451a1a',
      'kiaat': '#a0522d',
      'kiaat gloss': '#b5642f',
      'teak': '#8b4513',
      'walnut': '#5d3a1a',
      'white': '#ffffff',
      'ash': '#b8b8b8',
      'black': '#000000',
      'brown': '#5c4033',
      'green': '#2d5a27',
      'hemlock': '#d2b48c',
      'mahogany': '#4a1c1c',
      'mahogany rose': '#6b2c3c',
      'pecan': '#b8864e',
      'pecan rose': '#c09066',
      'rose': '#d4a0a0',
      'rose gold': '#c9968c',
      'gold': '#c9a84c',
      'red': '#8b1a1a',
      'imbuia': '#6b4226',
      'purple': '#6b21a8',
      'redwood': '#a45a52',
      'redwood gloss': '#b5635a',
      'uv dotted mahogany': '#5a2020',
      'pink': '#ec4899',
      'minniemouse': '#ff69b4',
      'batman': '#333333',
      'spiderman': '#cc0000',
      'standard': '#d4d4d4',
      '3x6': '#2d5a27'
    };

    // Check for exact match first
    if (colors[v]) return colors[v];

    // Then check for partial match
    for (const key in colors) {
      if (v.includes(key)) return colors[key];
    }
    return '#f3f4f6';
  }
}

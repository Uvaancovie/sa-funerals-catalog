import { Component, inject, computed, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoreService, Product } from '../services/store.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
                class="relative bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 overflow-hidden group cursor-crosshair h-[600px] flex items-center justify-center"
                (mousemove)="handleMagnify($event)"
                (mouseleave)="isMagnifying.set(false)"
                #imageContainer>
                
                <div class="absolute top-8 left-8 z-10">
                   <span class="bg-safs-dark text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl border border-white/10 backdrop-blur-md">Premium Collection</span>
                </div>

                <!-- Base Image -->
                <img 
                  [src]="p.image" 
                  [alt]="p.name" 
                  class="max-w-full max-h-full object-contain transition-all duration-500"
                  [style.opacity]="isMagnifying() ? '0.3' : '1'"
                  #mainImage>

                <!-- Magnifier Lens View -->
                @if (isMagnifying()) {
                  <div 
                    class="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-3xl"
                    style="background-repeat: no-repeat;"
                    [style.background-image]="'url(' + p.image + ')'"
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

                <div class="absolute bottom-8 left-8 flex justify-between items-end">
                   <div class="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 text-left">
                      <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Interactive Detail</p>
                      <p class="text-xs font-serif font-bold text-safs-dark">Hover image to explore textures</p>
                   </div>
                </div>
              </div>
              
              <!-- Feature Badges -->
              <div class="grid grid-cols-3 gap-6">
                 <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center transform hover:-translate-y-1 transition-all">
                    <div class="w-12 h-12 bg-safs-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                       <svg class="text-safs-gold" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <h4 class="text-xs font-bold uppercase tracking-widest text-safs-dark mb-1">Quality Guaranteed</h4>
                    <p class="text-[10px] text-gray-400 uppercase">Hand-finished details</p>
                 </div>
                 <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center transform hover:-translate-y-1 transition-all">
                    <div class="w-12 h-12 bg-safs-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                       <svg class="text-safs-gold" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                    </div>
                    <h4 class="text-xs font-bold uppercase tracking-widest text-safs-dark mb-1">Structural Integrity</h4>
                    <p class="text-[10px] text-gray-400 uppercase">Reinforced Base</p>
                 </div>
                 <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center transform hover:-translate-y-1 transition-all">
                    <div class="w-12 h-12 bg-safs-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                       <svg class="text-safs-gold" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                    </div>
                    <h4 class="text-xs font-bold uppercase tracking-widest text-safs-dark mb-1">Ethical Sourcing</h4>
                    <p class="text-[10px] text-gray-400 uppercase">Sustainable Material</p>
                 </div>
              </div>
            </div>

            <!-- Right: Details Section -->
            <div class="lg:col-span-5">
              <div class="bg-white rounded-[2.5rem] p-10 lg:p-14 shadow-2xl border border-gray-100 sticky top-10">
                
                <div class="mb-10">
                  <div class="flex items-center gap-3 mb-6">
                    <span class="w-12 h-0.5 bg-safs-gold"></span>
                    <span class="text-safs-gold font-bold uppercase tracking-[0.4em] text-[10px]">{{ p.category }}</span>
                  </div>
                  <h1 class="font-serif text-4xl lg:text-5xl font-bold text-safs-dark mb-6 leading-[1.1]">{{ p.name }}</h1>
                  
                  <div class="flex items-center gap-6 text-xs text-gray-400 mb-10 border-y border-gray-100 py-5">
                     <span class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span class="font-bold text-gray-600">Available to Order</span>
                     </span>
                     <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                     <span>Manufactured in South Africa</span>
                  </div>
                </div>

                <div class="mb-12">
                  <h3 class="font-bold text-safs-dark mb-4 text-xs uppercase tracking-widest">Product Description</h3>
                  <p class="text-gray-500 leading-relaxed font-medium">
                    This exquisite {{ p.name }} is custom built with focus on dignity and durability. 
                    Featuring a smooth high-gloss finish and plush satin interior for a truly respectful tribute.
                  </p>
                </div>

                <!-- Variants selection -->
                <div class="mb-12">
                  <h3 class="font-bold text-safs-dark mb-6 text-xs uppercase tracking-widest flex items-center justify-between">
                     <span>Selective Finish</span>
                     <span class="text-safs-gold text-[10px] font-black">{{ selectedVariant() }}</span>
                  </h3>
                  <div class="flex flex-wrap gap-5">
                    @for (variant of p.variants; track variant) {
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
                  </div>
                </div>

                <!-- Quantity & Add to Quote -->
                <div class="space-y-6">
                    <div class="flex items-center gap-6">
                       <h3 class="font-bold text-safs-dark text-xs uppercase tracking-widest">Quantity</h3>
                       <div class="flex items-center bg-gray-50 rounded-2xl p-2 border border-gray-100">
                          <button (click)="updateQuantity(-1)" class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 text-safs-dark transition-colors">-</button>
                          <span class="w-12 text-center font-bold text-lg">{{ quantity() }}</span>
                          <button (click)="updateQuantity(1)" class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 text-safs-dark transition-colors">+</button>
                       </div>
                    </div>

                    <button (click)="addToCart()" class="w-full bg-safs-gold text-safs-dark font-black py-6 rounded-[1.5rem] hover:bg-yellow-600 transition-all flex items-center justify-center gap-4 text-xl shadow-2xl shadow-safs-gold/40 transform active:scale-95 group">
                      <span>Add to Quote Request</span>
                      <svg class="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                    
                    <a routerLink="/cart" class="w-full text-center py-4 text-gray-400 font-bold hover:text-safs-dark transition-colors flex items-center justify-center gap-3 text-sm">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
                       Go to Quote Summary ({{ store.cartCount() }})
                    </a>
                </div>

              </div>
            </div>
          </div>

          <!-- Bottom: Related -->
          <div class="border-t border-gray-200 pt-24 pb-20">
             <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                <div>
                   <h2 class="font-serif text-4xl font-bold text-safs-dark mb-4">View similar products</h2>
                   <p class="text-gray-400 font-medium">Explore further from our extensive {{ p.category }} range.</p>
                </div>
                <a routerLink="/catalog" class="bg-white border-2 border-safs-gold text-safs-gold font-bold px-8 py-4 rounded-2xl hover:bg-safs-gold hover:text-white transition-all flex items-center gap-3 shadow-sm">
                   View Full Collection
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
             </div>
             
             <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               @for (related of relatedProducts(); track related.id) {
                 <div class="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-gray-100 p-6 flex flex-col cursor-pointer group" [routerLink]="['/product', related.id]">
                    <div class="aspect-square bg-gray-50 rounded-2xl mb-6 flex items-center justify-center p-6 border border-gray-50 overflow-hidden">
                       <img [src]="related.image" class="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <div class="text-[9px] font-black text-safs-gold uppercase tracking-[0.3em] mb-2">{{ related.category }}</div>
                    <h4 class="font-serif text-xl font-bold text-safs-dark mb-4 group-hover:text-safs-gold transition-colors leading-tight">{{ related.name }}</h4>
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
export class ProductDetailComponent {
  route = inject(ActivatedRoute);
  store = inject(StoreService);

  @ViewChild('imageContainer') imageContainer!: ElementRef<HTMLDivElement>;

  productId = signal<string>('');
  selectedVariant = signal<string>('');
  quantity = signal<number>(1);

  // Magnifier signals
  isMagnifying = signal<boolean>(false);
  mousePos = signal({ x: 0, y: 0 });
  magnifyPos = signal('center');

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
        const p = this.store.products().find(p => p.id === id);
        if (p && p.variants.length > 0) {
          this.selectedVariant.set(p.variants[0]);
        }
        this.quantity.set(1);
      }
    });
  }

  handleMagnify(event: MouseEvent) {
    if (!this.imageContainer) return;
    this.isMagnifying.set(true);

    const rect = this.imageContainer.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

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
      'kiaat': '#a0522d',
      'teak': '#8b4513',
      'walnut': '#5d3a1a',
      'white': '#ffffff',
      'ash': '#b8b8b8',
      'black': '#000000',
      'brown': '#5c4033',
      'green': '#2d5a27',
      'hemlock': '#d2b48c',
      'dark cherry': '#451a1a',
      'minniemouse': '#ff69b4',
      'batman': '#333333',
      'spiderman': '#cc0000'
    };

    for (const key in colors) {
      if (v.includes(key)) return colors[key];
    }
    return '#f3f4f6';
  }
}

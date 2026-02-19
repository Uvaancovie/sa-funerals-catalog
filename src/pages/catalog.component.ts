import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService, Product } from '../services/store.service';
import { AuthService } from '../services/auth.service';
import { WishlistService } from '../services/wishlist.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="container mx-auto px-4">
        
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="font-serif text-4xl font-bold text-safs-dark mb-4">Product Catalogue 2026</h1>
          <p class="text-gray-600 max-w-2xl mx-auto mb-8">
            Browse our extensive range of high-quality caskets and funeral accessories.
          </p>

          <!-- Search Bar -->
          <div class="max-w-xl mx-auto relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search products by name, category, or finish..." 
              (input)="onSearch($event)"
              [value]="searchQuery()"
              class="w-full pl-12 pr-12 py-4 rounded-full shadow-md border border-gray-200 focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none transition-all text-gray-700 placeholder-gray-400 bg-white" />
            @if (searchQuery()) {
              <button (click)="clearSearch()" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            }
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          
          <!-- Filters Sidebar -->
          <div class="lg:w-1/4 space-y-8">
            
            <!-- Main Category Filter -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 class="font-bold text-safs-dark mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                Categories
              </h3>
              <div class="space-y-2">
                @for (cat of ['all', 'casket', 'child', 'accessory']; track cat) {
                  <button 
                    (click)="activeFilter.set(cat)"
                    [class.bg-safs-dark]="activeFilter() === cat"
                    [class.text-white]="activeFilter() === cat"
                    [class.text-gray-600]="activeFilter() !== cat"
                    [class.hover:bg-gray-50]="activeFilter() !== cat"
                    class="w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all flex justify-between items-center group">
                    <span class="capitalize">{{ cat === 'all' ? 'All Products' : (cat === 'child' ? 'Child Caskets' : (cat === 'casket' ? 'Caskets' : 'Accessories')) }}</span>
                    <span class="text-xs opacity-50 group-hover:opacity-100">{{ getCategoryCount(cat) }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- Casket Type Filter (Only visible if 'casket' or 'all' is selected) -->
            @if (activeFilter() === 'all' || activeFilter() === 'casket') {
              <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
                <h3 class="font-bold text-safs-dark mb-4 uppercase tracking-wider text-sm">Casket Styles</h3>
                <div class="flex flex-wrap gap-2">
                  @for (style of casketStyles; track style) {
                    <button 
                      (click)="toggleStyle(style)"
                      [class.bg-safs-gold]="selectedStyles().includes(style)"
                      [class.text-white]="selectedStyles().includes(style)"
                      [class.bg-gray-100]="!selectedStyles().includes(style)"
                      [class.text-gray-600]="!selectedStyles().includes(style)"
                      class="px-3 py-1.5 rounded-md text-xs font-bold transition-all hover:shadow-sm">
                      {{ style }}
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Color/Finish Filter -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 class="font-bold text-safs-dark mb-4 uppercase tracking-wider text-sm">Finishes & Colors</h3>
              <div class="grid grid-cols-2 gap-2">
                @for (finish of availableFinishes; track finish) {
                  <button 
                    (click)="toggleFinish(finish)"
                    [class.ring-2]="selectedFinishes().includes(finish)"
                    [class.ring-safs-gold]="selectedFinishes().includes(finish)"
                    [class.ring-offset-2]="selectedFinishes().includes(finish)"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all text-sm group">
                    <div [style.background-color]="getFinishColor(finish)" class="w-3 h-3 rounded-full border border-gray-300"></div>
                    <span class="text-gray-600 group-hover:text-safs-dark truncate">{{ finish }}</span>
                  </button>
                }
              </div>
            </div>

            <button (click)="resetFilters()" class="w-full py-3 text-safs-gold font-bold text-sm uppercase tracking-widest hover:underline">
              Clear All Filters
            </button>
          </div>

          <!-- Grid Section -->
          <div class="lg:w-3/4">
            
            <!-- Active Filters Display -->
            @if (hasActiveFilters()) {
              <div class="flex flex-wrap gap-2 mb-6">
                @if (searchQuery()) {
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-safs-dark text-white text-xs font-bold">
                    Search: {{ searchQuery() }}
                    <button (click)="clearSearch()">×</button>
                  </span>
                }
                @for (s of selectedStyles(); track s) {
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-safs-gold text-white text-xs font-bold">
                    Style: {{ s }}
                    <button (click)="toggleStyle(s)">×</button>
                  </span>
                }
                @for (f of selectedFinishes(); track f) {
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-600 text-white text-xs font-bold">
                    Finish: {{ f }}
                    <button (click)="toggleFinish(f)">×</button>
                  </span>
                }
              </div>
            }

            <!-- Results count -->
            <div class="mb-6 text-sm text-gray-500 flex justify-between items-center">
              <span>Showing <span class="font-bold text-safs-dark">{{ filteredProducts().length }}</span> product(s)</span>
            </div>

            <!-- Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (product of filteredProducts(); track product.id) {
                <div class="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden border border-gray-100 cursor-pointer" [routerLink]="['/product', product.id]">
                  
                  <!-- Image Area -->
                  <div class="relative h-64 overflow-hidden bg-gray-50">
                    <img [src]="getProductDisplayImage(product)" [alt]="product.name" class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span class="bg-white text-safs-dark font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">
                         View Details
                       </span>
                    </div>
                    
                    <!-- Color Variation Swatches -->
                    @if (getProductColorVariations(product).length > 0) {
                      <div class="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
                        @for (variation of getProductColorVariations(product); track variation.color) {
                          <button
                            (click)="selectColor(product, variation.color, $event)"
                            [class.ring-2]="isColorSelected(product, variation.color)"
                            [class.ring-safs-gold]="isColorSelected(product, variation.color)"
                            [class.ring-offset-2]="isColorSelected(product, variation.color)"
                            class="group/swatch relative flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-100 transition-all"
                            [title]="variation.color">
                            <div 
                              [style.background-color]="getFinishColor(variation.color)" 
                              class="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"></div>
                            <span class="text-xs font-medium text-gray-700">{{ variation.color }}</span>
                          </button>
                        }
                      </div>
                    }
                  </div>

                  <!-- Content -->
                  <div class="p-6 flex-1 flex flex-col border-t border-gray-50">
                    <div class="text-[10px] font-bold text-safs-gold uppercase tracking-[0.2em] mb-2">{{ product.category }}</div>
                    <h3 class="font-serif text-lg font-bold text-safs-dark mb-2 group-hover:text-safs-gold transition-colors leading-tight">{{ product.name }}</h3>
                    <div class="mt-auto">
                       <div class="flex flex-wrap gap-1 mb-4">
                         @for (v of store.parseFeatures(product); track v) {
                           <span class="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase font-medium">{{ v }}</span>
                         }
                       </div>
                       <div class="flex items-center justify-between">
                         <!-- Pricing Display Based on Auth Status -->
                         @if (authService.isApproved() || authService.isAdmin()) {
                           <span class="text-lg font-bold text-safs-dark">Request Quote</span>
                         } @else if (authService.isPending()) {
                           <span class="text-xs text-yellow-600 italic font-medium">Awaiting Approval</span>
                         } @else {
                           <a routerLink="/login" (click)="$event.stopPropagation()" class="text-xs text-safs-gold font-bold hover:underline">Login to View Price</a>
                         }
                         <div class="flex gap-2">
                           <!-- Wishlist Button (only for authenticated customers) -->
                           @if (authService.isAuthenticated() && !authService.isAdmin()) {
                             <button 
                               (click)="$event.preventDefault(); $event.stopPropagation(); toggleWishlist(product)" 
                               [class.bg-red-500]="wishlistService.isInWishlist(product.id)"
                               [class.text-white]="wishlistService.isInWishlist(product.id)"
                               [class.bg-gray-50]="!wishlistService.isInWishlist(product.id)"
                               [class.text-safs-dark]="!wishlistService.isInWishlist(product.id)"
                               [class.hover:bg-red-600]="wishlistService.isInWishlist(product.id)"
                               [class.hover:bg-gray-100]="!wishlistService.isInWishlist(product.id)"
                               class="p-2.5 rounded-full transition-all shadow-sm flex items-center justify-center" 
                               [title]="wishlistService.isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'">
                               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" [attr.fill]="wishlistService.isInWishlist(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                               </svg>
                             </button>
                           }
                           <button (click)="$event.preventDefault(); $event.stopPropagation(); addToCart(product)" class="p-2.5 rounded-full bg-gray-50 text-safs-dark hover:bg-safs-gold hover:text-white transition-all shadow-sm flex items-center justify-center" title="Add to Quote">
                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                           </button>
                         </div>
                       </div>
                    </div>
                  </div>

                </div>
              }
            </div>

            @if (filteredProducts().length === 0) {
              <div class="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                 <div class="inline-block p-6 rounded-full bg-gray-50 mb-6 text-gray-300">
                   <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                     <circle cx="11" cy="11" r="8"></circle>
                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                   </svg>
                 </div>
                 <h3 class="text-2xl font-bold text-safs-dark mb-2 font-serif">Empty Catalog</h3>
                 <p class="text-gray-500 mb-8 max-w-sm mx-auto">No products match your current selection. Try broadening your scope by removing filters.</p>
                 <button (click)="resetFilters()" class="bg-safs-gold text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-opacity-90 transition-all">Reset All Filters</button>
              </div>
            }
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
  `]
})
export class CatalogComponent implements OnInit {
  store = inject(StoreService);
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);

  ngOnInit() {
    // Load wishlist if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.wishlistService.getMyWishlist().subscribe();
    }
  }

  activeFilter = signal<string>('all');
  searchQuery = signal<string>('');
  selectedStyles = signal<string[]>([]);
  selectedFinishes = signal<string[]>([]);
  selectedColors = signal<Map<string, string>>(new Map()); // Map<productId, selectedColor>

  // Derived filter options
  readonly casketStyles = ['Dome', 'Halfview', 'Figurine', 'Woodturning', 'Traditional'];
  readonly availableFinishes = [
    'Cherry', 'Kiaat', 'Teak', 'Walnut', 'White', 'Ash', 'Black', 'Brown', 'Green', 'Hemlock'
  ];

  filteredProducts = computed(() => {
    const filter = this.activeFilter();
    const q = this.searchQuery().toLowerCase().trim();
    const styles = this.selectedStyles();
    const finishes = this.selectedFinishes();

    let products = this.store.products();

    // 1. Search Filter
    if (q) {
      products = products.filter(p => this.matchesSearch(p, q));
    }

    // 2. Main Category Filter
    if (filter !== 'all') {
      products = products.filter(p => p.category === filter);
    }

    // 3. Casket Style Filter
    if (styles.length > 0) {
      products = products.filter(p => {
        const name = p.name.toLowerCase();
        return styles.some(s => {
          if (s === 'Traditional') {
            return !['dome', 'halfview', 'figurine', 'woodturning'].some(keyword => name.includes(keyword));
          }
          return name.includes(s.toLowerCase());
        });
      });
    }

    // 4. Finish/Color Filter
    if (finishes.length > 0) {
      products = products.filter(p =>
        this.store.parseFeatures(p).some(v => finishes.some(f => v.toLowerCase().includes(f.toLowerCase())))
      );
    }

    return products;
  });

  private matchesSearch(p: Product, query: string): boolean {
    return p.name.toLowerCase().includes(query)
      || p.category.toLowerCase().includes(query)
      || this.store.parseFeatures(p).some(v => v.toLowerCase().includes(query));
  }

  getCategoryCount(cat: string): number {
    const products = this.store.products();
    if (cat === 'all') return products.length;
    return products.filter(p => p.category === cat).length;
  }

  toggleStyle(style: string) {
    this.selectedStyles.update(curr =>
      curr.includes(style) ? curr.filter(s => s !== style) : [...curr, style]
    );
  }

  toggleFinish(finish: string) {
    this.selectedFinishes.update(curr =>
      curr.includes(finish) ? curr.filter(f => f !== finish) : [...curr, finish]
    );
  }

  hasActiveFilters(): boolean {
    return this.searchQuery().length > 0 || this.selectedStyles().length > 0 || this.selectedFinishes().length > 0;
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  resetFilters() {
    this.searchQuery.set('');
    this.activeFilter.set('all');
    this.selectedStyles.set([]);
    this.selectedFinishes.set([]);
  }

  addToCart(product: Product) {
    const features = this.store.parseFeatures(product);
    this.store.addToCart(product, features[0] || 'Standard');
  }

  getFinishColor(finish: string): string {
    const colors: Record<string, string> = {
      'Cherry': '#7e2d2d',
      'Kiaat': '#a0522d',
      'Teak': '#8b4513',
      'Walnut': '#5d3a1a',
      'White': '#ffffff',
      'Ash': '#b8b8b8',
      'Black': '#000000',
      'Brown': '#5c4033',
      'Green': '#2d5a27',
      'Hemlock': '#d2b48c'
    };
    return colors[finish] || '#ccc';
  }

  getProductColorVariations(product: Product): { color: string; images: string[] }[] {
    return this.store.parseColorVariations(product);
  }

  getProductDisplayImage(product: Product): string {
    const colorVariations = this.getProductColorVariations(product);

    if (colorVariations.length > 0) {
      const selectedColor = this.selectedColors().get(product.id);
      if (selectedColor) {
        const variation = colorVariations.find(v => v.color === selectedColor);
        if (variation && variation.images.length > 0) {
          return variation.images[0];
        }
      }
      // Default to first color variation's first image
      return colorVariations[0].images[0] || this.store.parseImages(product)[0] || '';
    }

    // No color variations, use regular images
    return this.store.parseImages(product)[0] || '';
  }

  selectColor(product: Product, color: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedColors.update(map => {
      const newMap = new Map(map);
      newMap.set(product.id, color);
      return newMap;
    });
  }

  isColorSelected(product: Product, color: string): boolean {
    const selectedColor = this.selectedColors().get(product.id);
    if (!selectedColor) {
      // First color is selected by default
      const variations = this.getProductColorVariations(product);
      return variations.length > 0 && variations[0].color === color;
    }
    return selectedColor === color;
  }

  toggleWishlist(product: Product) {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    if (this.wishlistService.isInWishlist(product.id)) {
      // Find the wishlist item and remove it
      const wishlistItem = this.wishlistService.wishlistItems()
        .find(item => item.productId === product.id);

      if (wishlistItem) {
        this.wishlistService.removeFromWishlist(wishlistItem.id).subscribe({
          next: () => {
            console.log('Removed from wishlist');
          },
          error: (err) => {
            console.error('Error removing from wishlist:', err);
          }
        });
      }
    } else {
      // Add to wishlist
      this.wishlistService.addToWishlist(product.id).subscribe({
        next: () => {
          console.log('Added to wishlist');
        },
        error: (err) => {
          console.error('Error adding to wishlist:', err);
        }
      });
    }
  }
}


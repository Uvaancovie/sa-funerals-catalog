import { Component, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService, Product } from '../services/store.service';
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
          <h1 class="font-serif text-4xl font-bold text-safs-dark mb-4">Product Catalogue 2024</h1>
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
              placeholder="Search products by name, category, or variant..." 
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

        <!-- Filters -->
        <div class="flex justify-center mb-10 space-x-3 flex-wrap gap-y-3">
          <button 
            (click)="activeFilter.set('all')"
            [class.bg-safs-dark]="activeFilter() === 'all'"
            [class.text-white]="activeFilter() === 'all'"
            [class.bg-white]="activeFilter() !== 'all'"
            [class.text-gray-600]="activeFilter() !== 'all'"
            class="px-6 py-2 rounded-full shadow-sm font-medium transition-all hover:shadow-md border border-gray-200">
            All ({{ productCounts().all }})
          </button>
          <button 
            (click)="activeFilter.set('casket')"
            [class.bg-safs-dark]="activeFilter() === 'casket'"
            [class.text-white]="activeFilter() === 'casket'"
            [class.bg-white]="activeFilter() !== 'casket'"
            [class.text-gray-600]="activeFilter() !== 'casket'"
            class="px-6 py-2 rounded-full shadow-sm font-medium transition-all hover:shadow-md border border-gray-200">
            Caskets ({{ productCounts().casket }})
          </button>
          <button 
            (click)="activeFilter.set('child')"
            [class.bg-safs-dark]="activeFilter() === 'child'"
            [class.text-white]="activeFilter() === 'child'"
            [class.bg-white]="activeFilter() !== 'child'"
            [class.text-gray-600]="activeFilter() !== 'child'"
            class="px-6 py-2 rounded-full shadow-sm font-medium transition-all hover:shadow-md border border-gray-200">
            Child Caskets ({{ productCounts().child }})
          </button>
          <button 
            (click)="activeFilter.set('accessory')"
            [class.bg-safs-dark]="activeFilter() === 'accessory'"
            [class.text-white]="activeFilter() === 'accessory'"
            [class.bg-white]="activeFilter() !== 'accessory'"
            [class.text-gray-600]="activeFilter() !== 'accessory'"
            class="px-6 py-2 rounded-full shadow-sm font-medium transition-all hover:shadow-md border border-gray-200">
            Accessories ({{ productCounts().accessory }})
          </button>
        </div>

        <!-- Results count -->
        <div class="mb-6 text-sm text-gray-500">
          <span class="font-medium">{{ filteredProducts().length }}</span> product(s) found
          @if (searchQuery()) {
            <span> for "<span class="font-bold text-safs-dark">{{ searchQuery() }}</span>"</span>
          }
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          @for (product of filteredProducts(); track product.id) {
            <div class="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden border border-gray-100 cursor-pointer" [routerLink]="['/product', product.id]">
              
              <!-- Image Area -->
              <div class="relative h-64 overflow-hidden bg-gray-100">
                <img [src]="product.image" [alt]="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span class="bg-white text-safs-dark font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">
                     View Details
                   </span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6 flex-1 flex flex-col">
                <div class="text-xs font-bold text-safs-gold uppercase tracking-wider mb-2">{{ product.category }}</div>
                <h3 class="font-serif text-lg font-bold text-safs-dark mb-2 group-hover:text-safs-gold transition-colors">{{ product.name }}</h3>
                <div class="mt-auto">
                   <p class="text-gray-500 text-sm mb-4 line-clamp-2">Available in: {{ product.variants.join(', ') }}</p>
                   <div class="flex items-center justify-between">
                     <span class="text-sm font-bold text-gray-400 uppercase tracking-widest">Request Quote</span>
                     <button (click)="$event.preventDefault(); $event.stopPropagation(); addToCart(product)" class="p-2 rounded-full bg-gray-100 text-safs-dark hover:bg-safs-gold hover:text-white transition-colors" title="Add to Quote">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                     </button>
                   </div>
                </div>
              </div>

            </div>
          }
        </div>

        @if (filteredProducts().length === 0) {
          <div class="text-center py-20">
             <div class="inline-block p-6 rounded-full bg-gray-100 mb-6 text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                 <circle cx="11" cy="11" r="8"></circle>
                 <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
               </svg>
             </div>
             <h3 class="text-xl font-bold text-safs-dark mb-2">No products found</h3>
             <p class="text-gray-500 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
             <button (click)="resetFilters()" class="text-safs-gold font-bold hover:underline">Clear all filters</button>
          </div>
        }

      </div>
    </div>
  `
})
export class CatalogComponent {
  store = inject(StoreService);

  activeFilter = signal<'all' | 'casket' | 'child' | 'accessory'>('all');
  searchQuery = signal<string>('');

  // Counts for each category (respecting search)
  productCounts = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const products = this.store.products();
    const searched = q ? products.filter(p => this.matchesSearch(p, q)) : products;
    return {
      all: searched.length,
      casket: searched.filter(p => p.category === 'casket').length,
      child: searched.filter(p => p.category === 'child').length,
      accessory: searched.filter(p => p.category === 'accessory').length
    };
  });

  filteredProducts = computed(() => {
    const filter = this.activeFilter();
    const q = this.searchQuery().toLowerCase().trim();
    let products = this.store.products();

    // Apply search
    if (q) {
      products = products.filter(p => this.matchesSearch(p, q));
    }

    // Apply category filter
    if (filter !== 'all') {
      products = products.filter(p => p.category === filter);
    }

    return products;
  });

  private matchesSearch(p: Product, query: string): boolean {
    return p.name.toLowerCase().includes(query)
      || p.category.toLowerCase().includes(query)
      || p.variants.some(v => v.toLowerCase().includes(query));
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
  }

  addToCart(product: Product) {
    this.store.addToCart(product, product.variants[0]);
  }
}

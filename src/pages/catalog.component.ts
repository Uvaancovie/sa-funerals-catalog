import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { StoreService, Product } from '../services/store.service';
import { AuthService } from '../services/auth.service';
import { WishlistService } from '../services/wishlist.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OptimizedImageComponent } from '../components/optimized-image.component';
import { ImageOptimizationService } from '../services/image-optimization.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, OptimizedImageComponent],
   template: `
     <div class="bg-gray-50 min-h-screen w-full flex flex-col">

       <!-- Mobile Filters Toggle -->
       <div class="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
         <button
           (click)="toggleMobileFilters()"
           class="flex items-center gap-3 bg-safs-dark text-white px-4 py-2 rounded-lg hover:bg-safs-gold-dark transition-colors"
         >
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
           </svg>
           Filters
           @if (activeFilterCount() > 0) {
             <span class="bg-safs-gold text-black text-xs px-2 py-1 rounded-full font-bold">{{ activeFilterCount() }}</span>
           }
         </button>
         <div class="text-sm text-gray-500">
           Showing <span class="font-bold text-safs-dark">{{ filteredProducts().length }}</span> products
         </div>
       </div>

       <div class="flex flex-1">
         <!-- Filters Sidebar (Desktop) -->
          <div class="hidden lg:block w-[320px] sticky top-[92px] h-[calc(100vh-120px)] overflow-y-auto glass-panel p-6 m-4 rounded-3xl space-y-8 flex-shrink-0" style="contain: layout style;">

            <!-- Desktop Filters Header -->
            <div class="sticky top-0 bg-white/40 z-20 pb-4 mb-4 border-b border-white/20">
              <h2 class="text-xl font-bold text-safs-primary">Filters</h2>
              @if (activeFilterCount() > 0) {
                <button (click)="resetFilters()" class="mt-1 text-safs-accent font-semibold hover:text-safs-primary transition-colors text-sm">
                  Clear all filters
                </button>
              }
            </div>
         <!-- Main Category Filter -->
         <div class="bg-white/40 p-4 rounded-2xl border border-white/20 shadow-sm">
           <h3 class="font-bold text-safs-primary mb-3 uppercase tracking-wider text-xs flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
             Categories
           </h3>
           <div class="space-y-1.5">
              @for (cat of categoryOptions; track cat.value) {
                  <button (click)="selectCategory(cat.value)" [class.bg-safs-primary]="activeFilter() === cat.value" [class.text-white]="activeFilter() === cat.value" [class.text-safs-primary]="activeFilter() !== cat.value" [class.bg-white]="activeFilter() !== cat.value" [class.border-safs-accent]="activeFilter() !== cat.value" [class.border-white]="activeFilter() === cat.value" [class.bg-opacity-60]="activeFilter() !== cat.value" [class.border-opacity-20]="activeFilter() !== cat.value" [class.border-opacity-40]="activeFilter() === cat.value" class="w-full text-left px-3.5 py-2.5 rounded-xl font-bold transition-all hover-lift flex justify-between items-center group text-sm border shadow-sm border-transparent">
                  <span>{{ cat.label }}</span>
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full" [class.bg-white]="activeFilter() === cat.value" [class.bg-safs-primary]="activeFilter() !== cat.value" [class.bg-opacity-20]="activeFilter() === cat.value" [class.bg-opacity-10]="activeFilter() !== cat.value">{{ getCategoryCount(cat.value) }}</span>
                </button>
              }
           </div>
         </div>

         <!-- Product Style Filter -->
         @if (showStyleFilter()) {
           <div class="bg-white/40 p-4 rounded-2xl border border-white/20 shadow-sm animate-fade-in">
             <h3 class="font-bold text-safs-primary mb-3 uppercase tracking-wider text-xs">Product Styles</h3>
             <div class="flex flex-wrap gap-1.5">
               @for (style of casketStyles; track style) {
                  <button 
                    (click)="toggleStyle(style)"
                    [class.bg-safs-primary]="selectedStyles().includes(style)"
                    [class.text-white]="selectedStyles().includes(style)"
                    [class.bg-white]="!selectedStyles().includes(style)"
                    [class.text-safs-primary]="!selectedStyles().includes(style)"
                    [class.bg-opacity-80]="!selectedStyles().includes(style)"
                    class="px-3 py-2 rounded-xl text-xs font-semibold transition-all hover-lift border border-white/40 shadow-sm"
                  >
                    {{ style }}
                  </button>
               }
             </div>
           </div>
         }

         <!-- Color/Finish Filter -->
         <div class="bg-white/40 p-4 rounded-2xl border border-white/20 shadow-sm mb-6">
           <h3 class="font-bold text-safs-primary mb-3 uppercase tracking-wider text-xs">Finishes & Colors</h3>
           <div class="grid grid-cols-1 gap-2">
             @for (finish of availableFinishes; track finish) {
                <button 
                  (click)="toggleFinish(finish)"
                  [class.border-safs-accent]="selectedFinishes().includes(finish)"
                  [class.bg-safs-primary]="selectedFinishes().includes(finish)"
                  [class.bg-opacity-5]="selectedFinishes().includes(finish)"
                  class="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/70 hover:bg-white transition-all text-sm font-medium shadow-sm border border-white/40 group hover-lift"
                >
                  <div [style.background-color]="getFinishColor(finish)" class="w-4 h-4 rounded-full border border-gray-300 shadow-inner shrink-0"></div>
                  <span class="text-safs-primary group-hover:text-safs-accent text-left whitespace-normal break-words leading-tight font-medium">{{ finish }}</span>
                </button>
             }
           </div>
         </div>

            <button (click)="resetFilters()" class="w-full py-3 text-safs-accent font-bold text-sm uppercase tracking-widest hover:bg-white/40 rounded-xl border border-white/20 transition-colors mb-6">
              Clear All Filters
            </button>
          </div>
         
         <!-- Mobile Filters Modal -->
         @if (showMobileFilters()) {
           <div class="lg:hidden fixed inset-0 z-50 flex items-start justify-center pt-16">
             <!-- Backdrop -->
             <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" (click)="closeMobileFilters()"></div>

             <!-- Modal Content -->
             <div class="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden animate-modal-pop">
               <!-- Header -->
               <div class="flex items-center justify-between p-6 border-b border-gray-100">
                 <h2 class="text-xl font-bold text-safs-dark">Filters</h2>
                 <button (click)="closeMobileFilters()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                     <line x1="18" y1="6" x2="6" y2="18"></line>
                     <line x1="6" y1="6" x2="18" y2="18"></line>
                   </svg>
                 </button>
               </div>

               <!-- Filters Content -->
               <div class="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                 <!-- Main Category Filter -->
                 <div class="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100">
                   <h3 class="font-bold text-safs-dark mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                     Categories
                   </h3>
                   <div class="space-y-2">
                     @for (cat of categoryOptions; track cat.value) {
                       <button
                         (click)="activeFilter.set(cat.value)"
                         [class.bg-safs-dark]="activeFilter() === cat.value"
                         [class.text-white]="activeFilter() === cat.value"
                         [class.text-gray-600]="activeFilter() !== cat.value"
                         [class.hover:bg-gray-200]="activeFilter() !== cat.value"
                         class="w-full text-left px-3 py-2 rounded-lg font-bold transition-all flex justify-between items-center text-sm shadow-sm border border-transparent"
                         [class.border-gray-200]="activeFilter() !== cat.value">
                         <span>{{ cat.label }}</span>
                         <span class="text-xs font-medium opacity-60 bg-black/10 px-2 py-1 rounded-full">{{ getCategoryCount(cat.value) }}</span>
                       </button>
                     }
                   </div>
                 </div>

                 <!-- Product Style Filter -->
                 @if (showStyleFilter()) {
                   <div class="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
                     <h3 class="font-bold text-safs-dark mb-3 uppercase tracking-wider text-sm">Product Styles</h3>
                     <div class="flex flex-wrap gap-2">
                       @for (style of casketStyles; track style) {
                         <button
                           (click)="toggleStyle(style)"
                           [class.bg-safs-dark]="selectedStyles().includes(style)"
                           [class.text-white]="selectedStyles().includes(style)"
                           [class.bg-white]="!selectedStyles().includes(style)"
                           [class.text-gray-600]="!selectedStyles().includes(style)"
                           class="px-3 py-2 rounded-lg text-sm font-bold transition-all shadow-sm border border-gray-200 border-b-3 hover:brightness-95 active:border-b active:translate-y-0.5">
                           {{ style }}
                         </button>
                       }
                     </div>
                   </div>
                 }

                 <!-- Color/Finish Filter -->
                 <div class="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                   <h3 class="font-bold text-safs-dark mb-3 uppercase tracking-wider text-sm">Finishes & Colors</h3>
                   <div class="grid grid-cols-1 gap-2">
                     @for (finish of availableFinishes; track finish) {
                       <button
                         (click)="toggleFinish(finish)"
                         [class.ring-2]="selectedFinishes().includes(finish)"
                         [class.ring-safs-dark]="selectedFinishes().includes(finish)"
                         [class.ring-offset-2]="selectedFinishes().includes(finish)"
                         class="flex items-center gap-3 px-3 py-3 rounded-lg bg-white hover:bg-gray-100 transition-all text-sm font-medium shadow-sm border border-gray-200 group">
                         <div [style.background-color]="getFinishColor(finish)" class="w-4 h-4 rounded-full border border-gray-300 shadow-inner"></div>
                         <span class="text-gray-700 group-hover:text-safs-dark text-left whitespace-normal break-words leading-tight">{{ finish }}</span>
                       </button>
                     }
                   </div>
                 </div>
               </div>

               <!-- Footer Actions -->
               <div class="border-t border-gray-100 p-4 bg-gray-50">
                 <div class="flex gap-3">
                   <button (click)="resetFilters()" class="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                     Clear All
                   </button>
                   <button (click)="closeMobileFilters()" class="flex-1 py-3 bg-safs-dark text-white rounded-lg font-bold hover:bg-safs-gold-dark transition-colors">
                     Apply Filters
                   </button>
                 </div>
               </div>
             </div>
           </div>
         }

      <!-- Main Content Area (Right Split) -->
      <div class="flex-1 bg-gray-50 flex flex-col relative w-full">
        
        <!-- Header & Search -->
        <div class="bg-gradient-to-r from-safs-primary to-[#2A3470] px-4 py-4 sm:px-8 sm:py-6 md:px-12 md:py-8 border-b border-white/10 shadow-lg relative z-20 flex-shrink-0 m-4 rounded-3xl">
          <div class="absolute inset-0 bg-radial-gradient from-safs-accent/10 via-transparent to-transparent pointer-events-none rounded-3xl"></div>
          <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 items-center justify-between relative z-10">
            <div class="text-center md:text-left">
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-wide font-sans">SAFS Catalog</h1>
              <p class="text-safs-accent text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase">Premium range of caskets & professional funeral equipment</p>
            </div>
            
            <!-- Search Bar -->
            <div class="w-full md:w-[320px] relative flex-shrink-0">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-safs-primary">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search catalog..." 
                (input)="onSearch($event)"
                [value]="searchQuery()"
                class="w-full pl-10 pr-10 py-3 rounded-xl shadow-xl bg-white/95 border-2 border-transparent focus:border-safs-accent outline-none transition-all text-safs-primary text-sm placeholder-safs-primary/50 font-semibold" />
              @if (searchQuery()) {
                <button (click)="clearSearch()" class="absolute inset-y-0 right-0 pr-4 flex items-center text-safs-primary/50 hover:text-safs-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              }
            </div>
          </div>
        </div>
        
          <!-- Product Grid Area -->
         <div class="p-4 sm:p-6 md:p-10 lg:p-16 flex-1 max-w-[1600px] w-full mx-auto pb-32 min-h-[100vh]" id="product-grid">

           <!-- Featured Products Section -->
           @if (!hasActiveFilters()) {
             <div class="mb-12 animate-fade-in" aria-label="Featured Products">
               <h2 class="text-2xl font-bold text-safs-dark mb-6">
                 Featured Products
               </h2>
               <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                 @for (product of featuredProducts(); track product.id) {
                   <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all group border border-gray-100 cursor-pointer overflow-hidden flex flex-row items-center p-3" [routerLink]="['/product', product.id]">
                     <div class="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                       <app-optimized-image [src]="getOptimizedProductImagePath(product)" [alt]="product.name" aspectRatio="1/1"></app-optimized-image>
                     </div>
                     <div class="ml-4 flex-1">
                       <div class="text-[10px] font-black text-safs-gold-dark uppercase tracking-widest">{{ getCategoryDisplayName(product.category) }}</div>
                       <h3 class="text-sm font-bold text-safs-dark group-hover:text-safs-gold-dark leading-tight mt-1">{{ product.name }}</h3>
                     </div>
                   </div>
                 }
               </div>
             </div>
             
             <hr class="border-gray-100 mb-10">
           }

           <!-- Active Filters & Count (Desktop) -->
           <div class="hidden md:flex justify-between items-center gap-4 mb-8">
             <div class="text-lg text-gray-500 bg-white px-5 py-2 rounded-full shadow-sm border border-gray-100">
               Showing <span class="font-bold text-safs-dark text-xl">{{ filteredProducts().length }}</span> product(s)
             </div>

             @if (hasActiveFilters()) {
              <div class="flex flex-wrap gap-2">
                @if (searchQuery()) {
                  <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-safs-dark text-white text-sm font-bold shadow-sm">
                    Search: {{ searchQuery() }}
                    <button (click)="clearSearch()" class="hover:text-red-300">×</button>
                  </span>
                }
                @for (s of selectedStyles(); track s) {
                  <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-safs-gold text-black text-sm font-bold shadow-sm">
                    Style: {{ s }}
                    <button (click)="toggleStyle(s)" class="hover:text-red-800">×</button>
                  </span>
                }
                @for (f of selectedFinishes(); track f) {
                  <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-600 text-white text-sm font-bold shadow-sm">
                    Finish: {{ f }}
                    <button (click)="toggleFinish(f)" class="hover:text-red-300">×</button>
                  </span>
                }
              </div>
            }
          </div>

           <!-- Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
             @for (product of filteredProducts(); track product.id) {
               <div data-testid="catalog-card" class="glass-card hover-lift rounded-3xl overflow-hidden group flex flex-col cursor-pointer border border-white/40 shadow-sm" [routerLink]="['/product', product.id]">
                 
                  <!-- Image Area -->
                  <div class="relative h-64 sm:h-72 md:h-80 lg:h-90 overflow-hidden bg-white/80 border-b border-white/20">
                    <app-optimized-image
                      [src]="getOptimizedProductImagePath(product)"
                      [alt]="product.name"
                      [aspectRatio]="getProductAspectRatio(product)"
                      [loading]="getImageLoadingStrategy($index, filteredProducts().length, $first)"
                      [fetchpriority]="getImageFetchPriority($index, $first)"
                      containerClass="group-hover:scale-105 transition-transform duration-700 ease-out"
                    ></app-optimized-image>
                   
                   <div class="absolute inset-0 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100 bg-safs-primary/10 backdrop-blur-[2px]">
                       <span class="bg-safs-primary text-white font-bold py-2.5 px-6 rounded-xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-sm flex items-center gap-2 border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                         View Details
                     </span>
                   </div>
                   
                   @if (getProductColorVariations(product).length > 0) {
                     <div class="absolute bottom-3 left-3 inline-flex px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md shadow-md items-center gap-1.5 border border-white/20">
                       <div class="flex -space-x-1.5">
                         @for (variation of getProductColorVariations(product).slice(0, 3); track variation.color) {
                           <div [style.background-color]="getFinishColor(variation.color)" class="w-4 h-4 rounded-full border border-white shadow-sm"></div>
                         }
                       </div>
                       <span class="text-[10px] font-bold text-safs-primary pl-1">{{ getProductColorVariations(product).length }} Colors</span>
                     </div>
                   }
                 </div>
 
                  <!-- Content -->
                  <div class="p-5 flex-1 flex flex-col glass-card-inner border-t border-white/20">
                    <div class="text-[10px] font-black text-safs-accent uppercase tracking-[0.2em] mb-1.5">{{ getCategoryDisplayName(product.category) }}</div>
                    <h2 class="text-base font-bold text-safs-primary group-hover:text-safs-accent transition-colors leading-tight mb-2">{{ product.name }}</h2>
                   
                   <div class="mt-auto">
                     <!-- Actions removed -->
                   </div>
                 </div>
               </div>
             }
           </div>
        

          @if (filteredProducts().length === 0) {
            <div class="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-300">
              <div class="inline-block p-8 rounded-full bg-gray-50 mb-6 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h2 class="text-3xl font-bold text-safs-dark mb-4 font-serif">No products found</h2>
              <p class="text-gray-500 mb-10 max-w-md mx-auto text-lg">Adjust your filters to find what you're looking for.</p>
              <button (click)="resetFilters()" class="bg-safs-gold text-black px-10 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all">Clear All Filters</button>
            </div>
          }
        </div>
      </div>
      
      <!-- Quick-View Modal -->
      @if (selectedProductForModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in bg-black/60 backdrop-blur-sm" (click)="closeQuickView()">
          <div class="w-full max-w-5xl max-h-full bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative border border-white/20 animate-modal-pop" (click)="$event.stopPropagation()">
            
            <!-- Close button absolute top right -->
            <button (click)="closeQuickView()" class="absolute top-6 right-6 z-20 p-3 bg-white/80 hover:bg-gray-100 backdrop-blur-md rounded-full shadow-sm transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <!-- Left Image Side -->
            <div
              class="w-full md:w-1/2 h-[360px] sm:h-[420px] md:h-[680px] bg-gray-50 relative p-4 flex items-center justify-center"
              (mouseenter)="onModalImageEnter()"
              (mousemove)="onModalImageMove($event)"
              (mouseleave)="onModalImageLeave()">
              <app-optimized-image
                [src]="getOptimizedModalImagePath()"
                [alt]="selectedProductForModal()!.name"
                [aspectRatio]="getModalAspectRatio()"
                loading="eager"
                fetchpriority="high"
                containerClass="drop-shadow-xl animate-fade-in"
              ></app-optimized-image>

              @if (magnifierVisible()) {
                <div
                  class="pointer-events-none absolute w-40 h-40 rounded-full border-2 border-white shadow-2xl overflow-hidden z-10"
                  [style.left.%]="magnifierX()"
                  [style.top.%]="magnifierY()"
                  style="transform: translate(-50%, -50%);">
                  <div
                    class="w-full h-full bg-no-repeat"
                    [style.background-image]="getMagnifierBackgroundImage()"
                    [style.background-size]="getMagnifierBackgroundSize()"
                    [style.background-position]="getMagnifierBackgroundPosition()"></div>
                </div>
              }
            </div>

            <!-- Right Details Side -->
            <div class="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col h-auto max-h-[100%] md:max-h-[80vh] overflow-y-auto">
              <div class="text-sm font-black text-safs-gold-dark uppercase tracking-[0.2em] mb-4">{{ selectedProductForModal()!.category }}</div>
              <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-safs-dark mb-4 md:mb-6 leading-tight">{{ selectedProductForModal()!.name }}</h2>

              <div class="flex flex-wrap gap-2 mb-8">
                 @for (v of store.parseFeatures(selectedProductForModal()!); track v) {
                   <span class="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-lg uppercase font-bold">{{ v }}</span>
                 }
              </div>
              
              <!-- Interactive Variations -->
              @if (getProductColorVariations(selectedProductForModal()!).length > 0) {
                <div class="mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h4 class="font-bold text-safs-dark text-sm uppercase tracking-wider mb-4 opacity-70 flex justify-between items-end">
                    Select Finish
                    <span class="text-safs-gold-dark opacity-100 font-bold capitalize">{{ modalSelectedColor() || 'Standard' }}</span>
                  </h4>
                  <div class="flex flex-wrap gap-4">
                    @for (variation of getProductColorVariations(selectedProductForModal()!); track variation.color) {
                      <button 
                        (click)="selectModalColor(variation.color)"
                        class="relative group"
                        [title]="variation.color">
                        <div class="absolute -inset-1.5 rounded-full transition-all border-2"
                             [class.border-safs-gold]="modalSelectedColor() === variation.color"
                             [class.border-transparent]="modalSelectedColor() !== variation.color"
                             [class.scale-110]="modalSelectedColor() === variation.color"></div>
                        <div [style.background-color]="getFinishColor(variation.color)" 
                             class="w-12 h-12 rounded-full border-4 border-white shadow-md transition-transform group-hover:scale-105 active:scale-95 z-10 relative"></div>
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Bottom Actions -->
              <div class="mt-auto pt-8 border-t border-gray-100 flex gap-4">
                 @if (authService.isAuthenticated() && !authService.isAdmin()) {
                    <button 
                      (click)="toggleWishlist(selectedProductForModal()!)"
                      class="p-5 rounded-2xl transition-all shadow-sm border border-gray-200 active:scale-95 hover:bg-gray-50"
                      [class.bg-red-50]="wishlistService.isInWishlist(selectedProductForModal()!.id)"
                      [class.border-red-200]="wishlistService.isInWishlist(selectedProductForModal()!.id)"
                      [class.text-red-500]="wishlistService.isInWishlist(selectedProductForModal()!.id)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" [attr.fill]="wishlistService.isInWishlist(selectedProductForModal()!.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                 }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes modalPop {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out forwards;
    }
    .animate-modal-pop {
      animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class CatalogComponent implements OnInit {
  store = inject(StoreService);
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);
  imageOptimization = inject(ImageOptimizationService);

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

  // Mobile filters
  showMobileFilters = signal<boolean>(false);

  // Modal state
  selectedProductForModal = signal<Product | null>(null);
  modalSelectedColor = signal<string | null>(null);
  magnifierVisible = signal(false);
  magnifierX = signal(50);
  magnifierY = signal(50);
  readonly magnifierZoom = 2.3;

  openQuickView(product: Product) {
    this.selectedProductForModal.set(product);
    
    // Set initial modal color based on grid selection or default
    const variations = this.getProductColorVariations(product);
    if (variations.length > 0) {
      const existingSelection = this.selectedColors().get(product.id);
      if (existingSelection) {
        this.modalSelectedColor.set(existingSelection);
      } else {
        this.modalSelectedColor.set(variations[0].color);
      }
    } else {
      this.modalSelectedColor.set(null);
    }
  }

  closeQuickView() {
    this.selectedProductForModal.set(null);
    this.modalSelectedColor.set(null);
    this.magnifierVisible.set(false);
  }

  onModalImageEnter() {
    this.magnifierVisible.set(true);
  }

  onModalImageLeave() {
    this.magnifierVisible.set(false);
  }

  onModalImageMove(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    this.magnifierX.set(Math.max(0, Math.min(100, x)));
    this.magnifierY.set(Math.max(0, Math.min(100, y)));
  }

  getMagnifierBackgroundImage(): string {
    return `url(${this.getModalDisplayImage()})`;
  }

  getMagnifierBackgroundSize(): string {
    const zoomPercent = this.magnifierZoom * 100;
    return `${zoomPercent}% ${zoomPercent}%`;
  }

  getMagnifierBackgroundPosition(): string {
    return `${this.magnifierX()}% ${this.magnifierY()}%`;
  }

  selectModalColor(color: string) {
    this.modalSelectedColor.set(color);
    // Also save it to the main grid's map so selection persists
    const product = this.selectedProductForModal();
    if (product) {
      this.selectedColors.update(map => {
        const newMap = new Map(map);
        newMap.set(product.id, color);
        return newMap;
      });
    }
  }

  getModalDisplayImage(): string {
    const product = this.selectedProductForModal();
    if (!product) return '';
    
    const colorVariations = this.getProductColorVariations(product);
    if (colorVariations.length > 0) {
      const selectedColor = this.modalSelectedColor();
      if (selectedColor) {
        const variation = colorVariations.find(v => v.color === selectedColor);
        if (variation?.images?.length) {
          return variation.images[0];
        }
      }
    }
    
    // Default image
    const images = this.store.parseImages(product);
    return images[0] || '';
  }

  addModalItemToCart() {
    const product = this.selectedProductForModal();
    if (!product) return;
    
    const features = this.store.parseFeatures(product);
    this.store.addToCart(product, features[0] || 'Standard');
    this.closeQuickView();
  }

  // Category options for new 8-category structure
  readonly categoryOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'baby-caskets', label: 'Baby Caskets' },
    { value: 'bespoke', label: 'Bespoke' },
    { value: 'coffins', label: 'Coffins' },
    { value: 'domes', label: 'Domes' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'executive-domes', label: 'Executive Domes' },
    { value: 'flatlids', label: 'Flatlids' },
    { value: 'skinz', label: 'Skinz' }
  ];

  // Derived filter options
  readonly casketStyles = ['Dome', 'Halfview', 'Coffin', 'Figurine', 'Woodturning', 'Glitter', 'Senator', 'Porthole', 'Pongee'];
  readonly availableFinishes = [
    'Cherry', 'Kiaat', 'Teak', 'Walnut', 'White', 'Ash', 'Black', 'Brown', 'Green', 'Hemlock',
    'Mahogany', 'Pecan', 'Rose', 'Gold', 'Red', 'Imbuia', 'Purple', 'Dark Cherry'
  ];

  // Show style filter for casket-type categories
  showStyleFilter = computed(() => {
    const f = this.activeFilter();
    return f === 'all' || f === 'coffins' || f === 'domes' || f === 'executive-domes' || f === 'flatlids' || f === 'skinz';
  });

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

  featuredProducts = computed(() => {
    const products = this.store.products();
    const featured = products.filter(p => p.featured);
    if (featured.length >= 4) return featured.slice(0, 4);
    
    const popularIds = ['top-end-coffin', 'royal-dome', 'senator-coffin', 'casket-racking-system'];
    const popular = products.filter(p => popularIds.includes(p.id));
    
    if (popular.length >= 4) return popular.slice(0, 4);
    return products.slice(0, 4); 
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
    this.scrollToResults();
  }

  toggleFinish(finish: string) {
    this.selectedFinishes.update(curr =>
      curr.includes(finish) ? curr.filter(f => f !== finish) : [...curr, finish]
    );
    this.scrollToResults();
  }

  selectCategory(cat: string) {
    this.activeFilter.set(cat);
    this.scrollToResults();
  }

  getCategoryDisplayName(category: string): string {
    const found = this.categoryOptions.find(c => c.value === category);
    return found ? found.label : category;
  }

  hasActiveFilters(): boolean {
    return this.searchQuery().length > 0 || this.selectedStyles().length > 0 || this.selectedFinishes().length > 0;
  }

  activeFilterCount = computed(() => {
    let count = 0;
    if (this.searchQuery().length > 0) count++;
    if (this.selectedStyles().length > 0) count++;
    if (this.selectedFinishes().length > 0) count++;
    if (this.activeFilter() !== 'all') count++;
    return count;
  });

  toggleMobileFilters() {
    this.showMobileFilters.set(!this.showMobileFilters());
  }

  closeMobileFilters() {
    this.showMobileFilters.set(false);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  quickSearch(query: string) {
    this.searchQuery.set(query);
    this.scrollToResults();
  }

  scrollToResults() {
    setTimeout(() => {
      const grid = document.getElementById('product-grid');
      if (grid) {
        const y = grid.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
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
      'pecan': '#b8864e',
      'rose': '#d4a0a0',
      'rose gold': '#c9968c',
      'gold': '#c9a84c',
      'red': '#8b1a1a',
      'imbuia': '#6b4226',
      'purple': '#6b21a8',
      'redwood': '#a45a52',
      'redwood gloss': '#b5635a',
      'uv dotted mahogany': '#5a2020',
      'pink': '#ec4899'
    };
    const key = finish.toLowerCase();
    return colors[key] || '#ccc';
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
        if (variation?.images?.length) {
          return variation.images[0];
        }
      }
      // Default to first color variation's first image (guard against empty images array)
      const firstVariation = colorVariations[0];
      if (firstVariation?.images?.length) {
        return firstVariation.images[0];
      }
    }

    // No color variations (or all empty), use regular images
    const images = this.store.parseImages(product);
    return images[0] || '';
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

  getOptimizedProductImagePath(product: Product): string {
    const images = this.store.parseImages(product);
    return images[0] || '';
  }

  getProductAspectRatio(product: Product): string {
    return this.imageOptimization.getAspectRatioForCategory(product.category);
  }

  getImageLoadingStrategy(index: number, total: number, isFirst: boolean): 'lazy' | 'eager' {
    const strategy = this.imageOptimization.getLoadingStrategy(index, total, isFirst);
    return strategy.loading;
  }

  getImageFetchPriority(index: number, isFirst: boolean): 'high' | 'low' | 'auto' {
    const strategy = this.imageOptimization.getLoadingStrategy(index, 10, isFirst);
    return strategy.fetchpriority;
  }

  getOptimizedModalImagePath(): string {
    const product = this.selectedProductForModal();
    if (!product) return '';

    const images = this.store.parseImages(product);
    const colorVariations = this.getProductColorVariations(product);

    if (colorVariations.length > 0) {
      const selectedColor = this.modalSelectedColor();
      if (selectedColor) {
        const variation = colorVariations.find(v => v.color === selectedColor);
        if (variation?.images?.length) {
          return this.imageOptimization.getOptimizedImagePath(variation.images[0]);
        }
      }
    }

    return images[0] || '';
  }

  getModalAspectRatio(): string {
    const product = this.selectedProductForModal();
    if (!product) return '4/3';

    return this.imageOptimization.getAspectRatioForCategory(product.category);
  }
}


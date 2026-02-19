import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../services/wishlist.service';
import { StoreService } from '../services/store.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="container mx-auto px-4 max-w-6xl">
        
        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-serif text-4xl font-bold text-safs-dark mb-2">My Wishlist</h1>
          <p class="text-gray-600">Products you're interested in</p>
        </div>

        <!-- Loading State -->
        @if (wishlistService.loading()) {
          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-safs-gold"></div>
            <p class="mt-4 text-gray-600">Loading your wishlist...</p>
          </div>
        }

        <!-- Error State -->
        @if (wishlistService.error()) {
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p class="text-red-600">{{ wishlistService.error() }}</p>
          </div>
        }

        <!-- Empty State -->
        @if (!wishlistService.loading() && wishlistService.wishlistItems().length === 0) {
          <div class="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
            <div class="inline-block p-6 rounded-full bg-gray-50 mb-6 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-safs-dark mb-2 font-serif">Your Wishlist is Empty</h3>
            <p class="text-gray-500 mb-8 max-w-sm mx-auto">Start adding products to your wishlist to keep track of items you're interested in.</p>
            <a routerLink="/catalog" class="inline-block bg-safs-gold text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-opacity-90 transition-all">Browse Catalog</a>
          </div>
        }

        <!-- Wishlist Items -->
        @if (!wishlistService.loading() && wishlistService.wishlistItems().length > 0) {
          <div class="space-y-4">
            @for (item of wishlistService.wishlistItems(); track item.id) {
              <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 flex gap-6 group">
                
                <!-- Product Image -->
                <div class="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                  <img 
                    [src]="getProductImage(item.images)" 
                    [alt]="item.productName" 
                    class="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform">
                </div>

                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <div class="text-xs font-bold text-safs-gold uppercase tracking-wider mb-1">{{ item.category }}</div>
                      <h3 class="font-serif text-xl font-bold text-safs-dark mb-2 group-hover:text-safs-gold transition-colors">
                        {{ item.productName }}
                      </h3>
                    </div>
                    
                    <!-- Remove Button -->
                    <button 
                      (click)="removeFromWishlist(item.id)" 
                      class="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                      title="Remove from wishlist">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>

                  <div class="flex items-center gap-4 mb-4">
                    @if (item.priceOnRequest) {
                      <span class="text-sm font-medium text-gray-600">Price on Request</span>
                    } @else if (item.price) {
                      <span class="text-lg font-bold text-safs-dark">R{{ item.price.toFixed(2) }}</span>
                    }
                    <span class="text-xs text-gray-400">Added {{ formatDate(item.createdAt) }}</span>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-3">
                    <a 
                      [routerLink]="['/product', item.productId]" 
                      class="inline-flex items-center gap-2 px-4 py-2 bg-safs-dark text-white rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      View Details
                    </a>
                    <button 
                      (click)="addToCart(item)" 
                      class="inline-flex items-center gap-2 px-4 py-2 bg-safs-gold text-white rounded-lg font-medium hover:bg-opacity-90 transition-all text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                        <path d="M3 6h18"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                      Add to Quote
                    </button>
                  </div>
                </div>

              </div>
            }
          </div>

          <!-- Summary -->
          <div class="mt-8 bg-white rounded-xl shadow-sm p-6">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-bold text-safs-dark text-lg mb-1">Total Items</h3>
                <p class="text-gray-600 text-sm">You have {{ wishlistService.wishlistCount() }} product(s) in your wishlist</p>
              </div>
              <a routerLink="/catalog" class="inline-flex items-center gap-2 px-6 py-3 bg-safs-gold text-white rounded-full font-bold hover:bg-opacity-90 transition-all">
                Continue Shopping
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: []
})
export class WishlistComponent implements OnInit {
  wishlistService = inject(WishlistService);
  storeService = inject(StoreService);
  authService = inject(AuthService);

  ngOnInit() {
    this.wishlistService.getMyWishlist().subscribe();
  }

  getProductImage(imagesJson: string): string {
    try {
      const images = JSON.parse(imagesJson);
      return images[0] || '';
    } catch {
      return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  }

  removeFromWishlist(id: number) {
    if (confirm('Are you sure you want to remove this item from your wishlist?')) {
      this.wishlistService.removeFromWishlist(id).subscribe();
    }
  }

  addToCart(item: any) {
    // Find the product in the store using the slug (item.productId)
    const product = this.storeService.products().find(p => p.id === item.productId);
    if (product) {
      this.storeService.addToCart(product, 'Standard');
    }
  }
}

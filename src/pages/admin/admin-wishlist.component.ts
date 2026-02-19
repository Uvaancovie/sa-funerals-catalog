import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { WishlistAnalytics, PopularProduct, CustomerWishlistSummary } from '../../types/api.types';

@Component({
  selector: 'app-admin-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4 max-w-7xl">
        
        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-serif text-4xl font-bold text-safs-dark mb-2">Wishlist Analytics</h1>
          <p class="text-gray-600">Track customer interests and popular products</p>
        </div>

        <!-- Loading State -->
        @if (loading()) {
          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-safs-gold"></div>
            <p class="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        }

        @if (!loading() && analytics()) {
          <!-- Stats Overview -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-safs-gold">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm font-medium mb-1">Total Wishlist Items</p>
                  <p class="text-3xl font-bold text-safs-dark">{{ analytics()!.totalWishlistItems }}</p>
                </div>
                <div class="p-3 bg-safs-gold/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-safs-gold">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm font-medium mb-1">Unique Customers</p>
                  <p class="text-3xl font-bold text-safs-dark">{{ analytics()!.uniqueCustomers }}</p>
                </div>
                <div class="p-3 bg-blue-500/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-600 text-sm font-medium mb-1">Unique Products</p>
                  <p class="text-3xl font-bold text-safs-dark">{{ analytics()!.uniqueProducts }}</p>
                </div>
                <div class="p-3 bg-green-500/10 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                    <path d="M3 6h18"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- View Tabs -->
          <div class="mb-6 bg-white rounded-lg shadow-sm p-1 inline-flex">
            <button 
              (click)="activeView.set('popular')"
              [class.bg-safs-gold]="activeView() === 'popular'"
              [class.text-white]="activeView() === 'popular'"
              [class.text-gray-600]="activeView() !== 'popular'"
              class="px-6 py-2 rounded-md font-medium transition-all">
              Popular Products
            </button>
            <button 
              (click)="activeView.set('customers')"
              [class.bg-safs-gold]="activeView() === 'customers'"
              [class.text-white]="activeView() === 'customers'"
              [class.text-gray-600]="activeView() !== 'customers'"
              class="px-6 py-2 rounded-md font-medium transition-all">
              Customer Summaries
            </button>
          </div>

          <!-- Popular Products View -->
          @if (activeView() === 'popular') {
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="p-6 border-b border-gray-100">
                <h2 class="text-2xl font-bold text-safs-dark">Most Wanted Products</h2>
                <p class="text-gray-600 mt-1">Products with the highest wishlist count</p>
              </div>

              @if (analytics()!.popularProducts.length === 0) {
                <div class="p-12 text-center text-gray-500">
                  <p>No wishlist data available yet</p>
                </div>
              } @else {
                <div class="divide-y divide-gray-100">
                  @for (product of analytics()!.popularProducts; track product.productId) {
                    <div class="p-6 hover:bg-gray-50 transition-all">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="flex items-center gap-3 mb-2">
                            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-safs-gold text-white font-bold text-sm">
                              {{ product.wishlistCount }}
                            </span>
                            <div>
                              <h3 class="font-bold text-safs-dark text-lg">{{ product.productName }}</h3>
                              <span class="text-xs text-gray-500 uppercase tracking-wider">{{ product.category }}</span>
                            </div>
                          </div>
                          
                          <div class="mt-3 ml-11">
                            <p class="text-sm text-gray-600 mb-2">
                              <span class="font-medium">Interested Customers:</span>
                            </p>
                            <div class="flex flex-wrap gap-2">
                              @for (customer of product.interestedCustomers; track customer) {
                                <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                  {{ customer }}
                                </span>
                              }
                            </div>
                          </div>
                        </div>

                        <a 
                          [routerLink]="['/product', product.productId]" 
                          class="ml-4 px-4 py-2 text-safs-gold hover:bg-safs-gold hover:text-white border border-safs-gold rounded-lg transition-all text-sm font-medium">
                          View Product
                        </a>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- Customer Summaries View -->
          @if (activeView() === 'customers') {
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="p-6 border-b border-gray-100">
                <h2 class="text-2xl font-bold text-safs-dark">Customer Wishlists</h2>
                <p class="text-gray-600 mt-1">See what each customer is interested in</p>
              </div>

              @if (analytics()!.customerSummaries.length === 0) {
                <div class="p-12 text-center text-gray-500">
                  <p>No customer wishlists yet</p>
                </div>
              } @else {
                <div class="divide-y divide-gray-100">
                  @for (customer of analytics()!.customerSummaries; track customer.userId) {
                    <div class="p-6 hover:bg-gray-50 transition-all">
                      <div class="flex items-start justify-between mb-4">
                        <div>
                          <h3 class="font-bold text-safs-dark text-lg">
                            {{ customer.companyName || customer.email }}
                          </h3>
                          <div class="flex gap-4 mt-1 text-sm text-gray-600">
                            @if (customer.contactPerson) {
                              <span>{{ customer.contactPerson }}</span>
                            }
                            <span>{{ customer.email }}</span>
                          </div>
                        </div>
                        <span class="inline-flex items-center gap-2 px-4 py-2 bg-safs-gold/10 text-safs-gold rounded-full font-bold text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          {{ customer.wishlistItemCount }} item{{ customer.wishlistItemCount !== 1 ? 's' : '' }}
                        </span>
                      </div>

                      <div>
                        <p class="text-sm font-medium text-gray-700 mb-2">Interested in:</p>
                        <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                          @for (product of customer.products; track product) {
                            <li class="flex items-center gap-2 text-sm text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-safs-gold flex-shrink-0">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              {{ product }}
                            </li>
                          }
                        </ul>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }
        }

      </div>
    </div>
  `,
  styles: []
})
export class AdminWishlistComponent implements OnInit {
  wishlistService = inject(WishlistService);

  analytics = signal<WishlistAnalytics | null>(null);
  loading = signal(false);
  activeView = signal<'popular' | 'customers'>('popular');

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading.set(true);
    this.wishlistService.getWishlistAnalytics().subscribe({
      next: (data) => {
        this.analytics.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading analytics:', err);
        this.loading.set(false);
      }
    });
  }
}

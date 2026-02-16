import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoreService, Product } from '../services/store.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="container mx-auto px-4">
        
        <!-- Breadcrumb -->
        <div class="mb-8 text-sm text-gray-500">
          <a routerLink="/" class="hover:text-safs-gold transition-colors">Home</a>
          <span class="mx-2">/</span>
          <a routerLink="/catalog" class="hover:text-safs-gold transition-colors">Products</a>
          <span class="mx-2">/</span>
          <span class="text-safs-dark font-semibold">{{ product()?.name }}</span>
        </div>

        @if (product(); as p) {
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-2">
              
              <!-- Image Section -->
              <div class="bg-gray-100 p-8 flex items-center justify-center min-h-[400px]">
                <img [src]="p.image" [alt]="p.name" class="max-w-full max-h-[500px] object-contain shadow-lg rounded">
              </div>

              <!-- Details Section -->
              <div class="p-8 md:p-12 flex flex-col">
                <div class="mb-6">
                  <span class="text-safs-gold font-bold uppercase tracking-wider text-sm">{{ p.category }}</span>
                  <h1 class="font-serif text-4xl font-bold text-safs-dark mt-2 mb-4">{{ p.name }}</h1>
                  <div class="w-20 h-1 bg-safs-gold"></div>
                </div>

                <p class="text-gray-600 text-lg leading-relaxed mb-8">
                  Expertly crafted with attention to detail. This {{ p.category }} represents our commitment to quality, dignity, and value.
                  Manufactured to the highest standards using premium materials.
                </p>

                <div class="mb-8">
                  <h3 class="font-bold text-gray-800 mb-4 text-lg">Available Finishes / Variants</h3>
                  <div class="flex flex-wrap gap-3">
                    @for (variant of p.variants; track variant) {
                      <button 
                        (click)="selectedVariant.set(variant)"
                        [class.bg-safs-dark]="selectedVariant() === variant"
                        [class.text-white]="selectedVariant() === variant"
                        [class.bg-gray-100]="selectedVariant() !== variant"
                        [class.text-gray-700]="selectedVariant() !== variant"
                        class="px-5 py-2 rounded-full font-medium transition-all hover:shadow-md border border-transparent">
                        {{ variant }}
                      </button>
                    }
                  </div>
                </div>

                <div class="mt-auto pt-8 border-t border-gray-100">
                  <div class="flex flex-col gap-4">
                    <button (click)="addToCart()" class="w-full bg-safs-gold text-safs-dark font-bold py-4 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-3 text-lg shadow-sm hover:shadow-lg transform active:scale-95 duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                      <span>Add to Quote Request</span>
                    </button>
                    <a routerLink="/cart" class="w-full bg-safs-dark text-white text-center font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
                      View Quote Request
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-20">
            <p class="text-xl text-gray-500">Product not found.</p>
            <a routerLink="/catalog" class="text-safs-gold hover:underline mt-4 inline-block">Return to Catalog</a>
          </div>
        }

      </div>
    </div>
  `
})
export class ProductDetailComponent {
  route = inject(ActivatedRoute);
  store = inject(StoreService);

  productId = signal<string>('');
  selectedVariant = signal<string>('');

  product = computed(() => {
    return this.store.products().find(p => p.id === this.productId());
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
      }
    });
  }

  addToCart() {
    const p = this.product();
    const v = this.selectedVariant();
    if (p && v) {
      this.store.addToCart(p, v);
    }
  }
}

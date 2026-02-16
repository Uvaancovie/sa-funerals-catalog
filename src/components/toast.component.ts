import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../services/store.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    @if (store.toastItem()) {
      <div class="fixed bottom-6 right-6 z-[200] animate-slide-up">
        <div class="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-[380px] max-w-[90vw]">
          
          <!-- Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <path d="m9 11 3 3L22 4"></path>
              </svg>
              <span class="font-bold text-sm">Added to Quote</span>
            </div>
            <button (click)="store.dismissToast()" class="text-gray-400 hover:text-gray-600 transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Product Info -->
          <div class="flex items-center gap-3 mb-4 bg-gray-50 rounded-lg p-3">
            <img [src]="store.toastItem()?.product?.image" class="w-14 h-14 object-cover rounded-lg border border-gray-200">
            <div class="flex-1 min-w-0">
              <p class="font-bold text-safs-dark text-sm truncate">{{ store.toastItem()?.product?.name }}</p>
              <p class="text-xs text-gray-500">Variant: {{ store.toastItem()?.variant }}</p>
              <p class="text-xs text-safs-gold font-bold">Qty: {{ store.toastItem()?.quantity }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button (click)="store.dismissToast()" class="flex-1 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Continue Shopping
            </button>
            <a routerLink="/cart" (click)="store.dismissToast()" class="flex-1 py-2.5 text-sm font-bold text-white bg-safs-dark rounded-lg hover:bg-opacity-90 transition-colors text-center flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              View Quote
            </a>
          </div>
        </div>
      </div>
    }
  `,
    styles: [`
    @keyframes slideUp {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    :host ::ng-deep .animate-slide-up {
      animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class ToastComponent {
    store = inject(StoreService);
}

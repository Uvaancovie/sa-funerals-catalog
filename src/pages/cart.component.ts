import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../services/store.service';
import { EnquiryService } from '../services/enquiry.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-3xl font-bold font-serif text-safs-dark mb-8">Your Cart</h1>

      @if (store.cartCount() === 0) {
        <div class="flex flex-col items-center justify-center py-16 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mb-4 opacity-50">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
          </svg>
          <p class="text-lg">Your cart is empty.</p>
          <a routerLink="/catalog" class="mt-6 px-6 py-3 bg-safs-dark text-white font-bold rounded-xl hover:bg-safs-gold transition-colors inline-block">Browse Catalog</a>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-xl font-bold text-safs-dark mb-6 border-b border-gray-100 pb-4">Order Items</h2>
            <div class="flex flex-col gap-6">
              @for (item of store.cart(); track item.product.id + item.variant) {
                <div class="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0 relative group items-center">
                  <div class="flex-1">
                    <h3 class="font-bold text-safs-dark text-lg">{{ item.product.name }}</h3>
                    <p class="text-sm text-gray-500 mt-1">Color: {{ item.variant }}</p>
                    <div class="flex items-center gap-3 mt-4">
                      <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button (click)="updateQuantity(item, -1)" class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-sm font-bold text-safs-dark transition-colors">-</button>
                        <span class="text-sm font-semibold w-8 text-center bg-gray-50 h-8 flex items-center justify-center">{{ item.quantity }}</span>
                        <button (click)="updateQuantity(item, 1)" class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-sm font-bold text-safs-dark transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                  <button (click)="removeItem(item)" class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
              }
            </div>
          </div>

          <div class="lg:col-span-1">
            <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-28">
              <h2 class="text-xl font-bold text-safs-dark mb-4 border-b border-gray-200 pb-4">Request a Quote</h2>
              <p class="text-sm text-gray-600 mb-6">Submit your details below and our team will get back to you with pricing and availability.</p>

              <form (ngSubmit)="submitEnquiry()" #cartForm="ngForm" class="flex flex-col gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input type="text" [(ngModel)]="enquiryData.name" name="name" required class="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-safs-gold w-full text-sm bg-white">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" [(ngModel)]="enquiryData.email" name="email" required class="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-safs-gold w-full text-sm bg-white">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" [(ngModel)]="enquiryData.phone" name="phone" required class="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-safs-gold w-full text-sm bg-white">
                </div>

                <button type="submit" [disabled]="cartForm.invalid || isSubmitting()" class="w-full bg-safs-dark text-white px-6 py-4 rounded-xl font-bold hover:bg-safs-gold transition-colors disabled:opacity-50 mt-4 shadow-md text-lg">
                  {{ isSubmitting() ? 'Processing...' : 'Submit Enquiry' }}
                </button>

                @if (submitSuccess()) {
                  <div class="text-green-600 text-sm font-semibold mt-4 text-center bg-green-50 p-3 rounded-lg border border-green-200">Enquiry sent successfully! We will contact you soon.</div>
                }
                @if (submitError()) {
                  <div class="text-red-500 text-sm font-semibold mt-4 text-center bg-red-50 p-3 rounded-lg border border-red-200">Failed to send enquiry. Please try again.</div>
                }
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CartComponent {
  store = inject(StoreService);
  private enquiryService = inject(EnquiryService);
  private router = inject(Router);

  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);

  enquiryData = { name: '', email: '', phone: '' };

  updateQuantity(item: any, change: number) {
    const newQty = item.quantity + change;
    if (newQty <= 0) {
      this.removeItem(item);
    } else {
      this.store.updateQuantity(item.product.id, item.variant, change);
    }
  }

  removeItem(item: any) {
    this.store.removeFromCart(item.product.id, item.variant);
  }

  async submitEnquiry() {
    if (this.store.cart().length === 0) return;

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);
    this.submitError.set(false);

    try {
      const cartItems = this.store.cart();
      await this.enquiryService.addEnquiry({
        customer_name: this.enquiryData.name,
        customer_email: this.enquiryData.email,
        customer_phone: this.enquiryData.phone,
        items: cartItems.map(i => ({
          name: i.product.name,
          quantity: i.quantity
        }))
      });

      this.isSubmitting.set(false);
      this.submitSuccess.set(true);

      setTimeout(() => {
        this.store.clearCart();
        this.submitSuccess.set(false);
        this.enquiryData = { name: '', email: '', phone: '' };
        this.router.navigate(['/catalog']);
      }, 3000);
    } catch {
      this.isSubmitting.set(false);
      this.submitError.set(true);
    }
  }
}

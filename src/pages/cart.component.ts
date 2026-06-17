import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../services/store.service';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 class="text-3xl font-bold text-safs-primary mb-8 font-sans">Your Cart</h1>

      @if (store.cartCount() === 0) {
        <div class="flex flex-col items-center justify-center py-20 text-safs-text-muted glass-panel border border-white/40 rounded-3xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mb-6 text-safs-accent opacity-75">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
          </svg>
          <p class="text-xl font-medium">Your cart is empty.</p>
          <a routerLink="/catalog" class="mt-6 px-8 py-3.5 bg-safs-primary text-white font-bold rounded-xl hover:bg-safs-accent hover-lift transition-colors inline-block text-sm shadow-md">Browse Catalog</a>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/40 shadow-sm">
            <h2 class="text-xl font-bold text-safs-primary mb-6 border-b border-white/20 pb-4">Order Items</h2>
            <div class="flex flex-col gap-6">
              @for (item of store.cart(); track item.product.id + item.variant) {
                <div class="flex gap-6 border-b border-white/10 pb-6 last:border-0 last:pb-0 relative group items-center">
                  <div class="flex-1">
                    <h3 class="font-bold text-safs-primary text-lg">{{ item.product.name }}</h3>
                    <p class="text-xs text-safs-accent uppercase tracking-wider font-semibold mt-1">Finish: {{ item.variant }}</p>
                    <div class="flex items-center gap-3 mt-4">
                      <div class="flex items-center border border-white/40 bg-white/40 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm">
                        <button (click)="updateQuantity(item, -1)" class="w-9 h-9 flex items-center justify-center hover:bg-white/80 text-sm font-bold text-safs-primary transition-colors">-</button>
                        <span class="text-sm font-semibold w-9 text-center bg-white/20 h-9 flex items-center justify-center text-safs-primary">{{ item.quantity }}</span>
                        <button (click)="updateQuantity(item, 1)" class="w-9 h-9 flex items-center justify-center hover:bg-white/80 text-sm font-bold text-safs-primary transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                  <button (click)="removeItem(item)" class="text-safs-primary/40 hover:text-red-500 hover:bg-red-50/50 transition-colors p-3 rounded-xl border border-transparent hover:border-red-200 shadow-sm backdrop-blur-sm hover-lift">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
              }
            </div>
          </div>

          <div class="lg:col-span-1">
            <div class="glass-panel p-6 rounded-3xl border border-white/40 sticky top-28 shadow-lg">
              <h2 class="text-xl font-bold text-safs-primary mb-3 border-b border-white/20 pb-3">Request a Quote</h2>
              <p class="text-xs text-safs-text-muted mb-6 leading-relaxed">Submit your contact details below and our team will prepare a formal estimate with delivery logistics.</p>

              <form (ngSubmit)="submitEnquiry()" #cartForm="ngForm" class="flex flex-col gap-4">
                <div>
                  <label class="block text-xs font-semibold text-safs-primary mb-1 uppercase tracking-wider">Your Name</label>
                  <input type="text" [(ngModel)]="enquiryData.name" name="name" required class="px-4 py-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-safs-accent w-full text-sm bg-white/70 focus:bg-white transition-all text-safs-primary placeholder-safs-primary/40 font-semibold shadow-sm">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-safs-primary mb-1 uppercase tracking-wider">Email Address</label>
                  <input type="email" [(ngModel)]="enquiryData.email" name="email" required class="px-4 py-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-safs-accent w-full text-sm bg-white/70 focus:bg-white transition-all text-safs-primary placeholder-safs-primary/40 font-semibold shadow-sm">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-safs-primary mb-1 uppercase tracking-wider">Phone Number</label>
                  <input type="tel" [(ngModel)]="enquiryData.phone" name="phone" required class="px-4 py-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-safs-accent w-full text-sm bg-white/70 focus:bg-white transition-all text-safs-primary placeholder-safs-primary/40 font-semibold shadow-sm">
                </div>

                <button type="submit" [disabled]="cartForm.invalid || isSubmitting()" class="w-full bg-safs-primary text-white px-6 py-4 rounded-xl font-bold hover:bg-safs-accent transition-colors disabled:opacity-50 mt-4 shadow-lg text-base hover-lift">
                  {{ isSubmitting() ? 'Processing...' : 'Submit Enquiry' }}
                </button>

                @if (submitSuccess()) {
                  <div class="text-green-600 text-sm font-semibold mt-4 text-center bg-green-50/50 p-3 rounded-xl border border-green-200 backdrop-blur-sm">Enquiry sent successfully! We will contact you soon.</div>
                }
                @if (submitError()) {
                  <div class="text-red-500 text-sm font-semibold mt-4 text-center bg-red-50/50 p-3 rounded-xl border border-red-200 backdrop-blur-sm">Failed to send enquiry. Please try again.</div>
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
  private ordersService = inject(OrdersService);
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
      const items = cartItems.map(i => ({
        name: i.product.name,
        category: i.product.category,
        variant: i.variant,
        quantity: i.quantity,
        price: i.product.price || 0
      }));

      await this.ordersService.createOrder({
        customer_name: this.enquiryData.name,
        customer_email: this.enquiryData.email,
        customer_phone: this.enquiryData.phone,
        items,
        total: this.store.cartTotal()
      });

      this.isSubmitting.set(false);
      this.submitSuccess.set(true);

      setTimeout(() => {
        this.store.clearCart();
        this.submitSuccess.set(false);
        this.enquiryData = { name: '', email: '', phone: '' };
        this.router.navigate(['/catalog']);
      }, 3000);
    } catch (err) {
      console.error('Order submission failed:', err);
      this.isSubmitting.set(false);
      this.submitError.set(true);
    }
  }
}

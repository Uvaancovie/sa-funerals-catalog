import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../services/store.service';
import { OrdersService } from '../services/orders.service';
import { DeliveryCalculatorComponent } from '../components/delivery-calculator.component';
import { DeliveryOption, ProductDimensions } from '../services/delivery-calculator.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DeliveryCalculatorComponent],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 class="text-3xl font-bold text-safs-primary mb-2 font-sans">Your Cart & Delivery Options</h1>
      <p class="text-sm text-safs-text-muted mb-8">Review your selected funeral supplies and choose your preferred SA distribution mode.</p>

      @if (store.cartCount() === 0) {
        <div class="flex flex-col items-center justify-center py-20 text-safs-text-muted glass-panel border border-white/40 rounded-3xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mb-6 text-safs-accent opacity-75">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
          </svg>
          <p class="text-xl font-medium">Your cart is empty.</p>
          <a routerLink="/catalog" class="mt-6 px-8 py-3.5 bg-safs-dark text-white font-bold rounded-xl hover:bg-slate-900 hover-lift transition-colors inline-block text-sm shadow-md">Browse Catalog</a>
        </div>
      } @else {

        <!-- STEP 1: MANDATORY DELIVERY METHOD SELECTION CALCULATOR -->
        <app-delivery-calculator 
          [dimensions]="cartDimensions()"
          (optionSelected)="onDeliveryOptionSelected($event)"
        ></app-delivery-calculator>

        <!-- CART ITEMS AND QUOTE SUMMARY -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div class="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/40 shadow-sm">
            <h2 class="text-xl font-bold text-safs-primary mb-6 border-b border-white/20 pb-4">Selected Products</h2>
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

          <!-- STEP 2: SUMMARY & SUBMISSION FORM -->
          <div class="lg:col-span-1">
            <div class="glass-panel p-6 rounded-3xl border border-white/40 sticky top-28 shadow-lg space-y-6">
              <div>
                <h2 class="text-xl font-bold text-safs-primary mb-1">Order & Delivery Quote</h2>
                <p class="text-xs text-safs-text-muted">Itemized cost calculation with delivery tariff.</p>
              </div>

              <!-- Price Breakdown Box -->
              <div class="bg-white/60 p-4 rounded-2xl border border-white/60 space-y-3 text-sm">
                <div class="flex justify-between text-safs-primary">
                  <span>Product Subtotal:</span>
                  <span class="font-semibold">R{{ store.cartTotal() | number:'1.2-2' }}</span>
                </div>

                <div class="flex justify-between text-safs-primary">
                  <span class="flex items-center gap-1">
                    Delivery Tariff:
                    @if (selectedDelivery()) {
                      <span class="text-[10px] bg-safs-gold/20 text-safs-dark font-bold px-1.5 py-0.5 rounded uppercase">{{ selectedDelivery()?.badge }}</span>
                    }
                  </span>
                  @if (selectedDelivery()) {
                    <span class="font-semibold text-safs-primary">
                      {{ selectedDelivery()?.calculatedPriceZar === 0 ? 'FREE' : 'R' + (selectedDelivery()?.calculatedPriceZar | number:'1.2-2') }}
                    </span>
                  } @else {
                    <span class="text-xs text-amber-600 font-bold">Select Mode ▲</span>
                  }
                </div>

                @if (selectedDelivery() && selectedDelivery()?.calculatedPriceZar !== 0) {
                  <div class="flex justify-between text-xs text-slate-500 border-t border-slate-200/60 pt-2">
                    <span>Transport VAT (15%):</span>
                    <span>R{{ selectedDelivery()?.vatZar | number:'1.2-2' }}</span>
                  </div>
                }

                <div class="flex justify-between text-base font-bold text-safs-primary border-t border-slate-300 pt-3">
                  <span>Estimated Total:</span>
                  <span class="text-safs-dark text-lg">R{{ finalEstimatedTotal() | number:'1.2-2' }}</span>
                </div>
              </div>

              <!-- Form Submission -->
              <form (ngSubmit)="submitEnquiry()" #cartForm="ngForm" class="flex flex-col gap-4">
                <div>
                  <label class="block text-xs font-semibold text-safs-primary mb-1 uppercase tracking-wider">Funeral Parlor / Company Name</label>
                  <input type="text" [(ngModel)]="enquiryData.company" name="company" placeholder="e.g. Grace Funeral Services" class="px-4 py-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-safs-accent w-full text-sm bg-white/70 focus:bg-white transition-all text-safs-primary placeholder-safs-primary/40 font-semibold shadow-sm">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-safs-primary mb-1 uppercase tracking-wider">Contact Person Name *</label>
                  <input type="text" [(ngModel)]="enquiryData.name" name="name" required class="px-4 py-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-safs-accent w-full text-sm bg-white/70 focus:bg-white transition-all text-safs-primary placeholder-safs-primary/40 font-semibold shadow-sm">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-safs-primary mb-1 uppercase tracking-wider">Email Address *</label>
                  <input type="email" [(ngModel)]="enquiryData.email" name="email" required class="px-4 py-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-safs-accent w-full text-sm bg-white/70 focus:bg-white transition-all text-safs-primary placeholder-safs-primary/40 font-semibold shadow-sm">
                </div>

                <div>
                  <label class="block text-xs font-semibold text-safs-primary mb-1 uppercase tracking-wider">Phone Number *</label>
                  <input type="tel" [(ngModel)]="enquiryData.phone" name="phone" required class="px-4 py-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-safs-accent w-full text-sm bg-white/70 focus:bg-white transition-all text-safs-primary placeholder-safs-primary/40 font-semibold shadow-sm">
                </div>

                <!-- SUBMIT BUTTON WITH MANDATORY SELECTION GUARD -->
                @if (!selectedDelivery()) {
                  <div class="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-xl text-xs text-center font-medium">
                    ⚠️ Please select a delivery option above before submitting your enquiry.
                  </div>
                }

                <button 
                  type="submit" 
                  [disabled]="cartForm.invalid || isSubmitting() || !selectedDelivery()" 
                  class="w-full bg-safs-dark text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-900 transition-colors disabled:opacity-50 mt-2 shadow-lg text-base hover-lift flex items-center justify-center gap-2"
                >
                  @if (isSubmitting()) {
                    <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing Order...</span>
                  } @else {
                    <span>Submit Compliant Order Quote</span>
                  }
                </button>

                @if (submitSuccess()) {
                  <div class="text-green-600 text-sm font-semibold mt-4 text-center bg-green-50/50 p-3 rounded-xl border border-green-200 backdrop-blur-sm">
                    Order quote sent successfully! Our logistics team will contact you shortly.
                  </div>
                }
                @if (submitError()) {
                  <div class="text-red-500 text-sm font-semibold mt-4 text-center bg-red-50/50 p-3 rounded-xl border border-red-200 backdrop-blur-sm">
                    Failed to submit order. Please try again.
                  </div>
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

  selectedDelivery = signal<DeliveryOption | null>(null);

  enquiryData = { name: '', email: '', phone: '', company: '' };

  // Calculate cargo dimensions for cart items (standard casket spec: 84" x 28" x 23", 68.04 kg)
  cartDimensions = computed<ProductDimensions>(() => {
    const qty = this.store.cartCount() || 1;
    return {
      lengthInches: 84,
      widthInches: 28,
      heightInches: 23,
      actualWeightKg: 68.0388555,
      quantity: qty
    };
  });

  finalEstimatedTotal = computed(() => {
    const productTotal = this.store.cartTotal();
    const delivery = this.selectedDelivery();
    const deliveryCost = delivery ? delivery.totalWithVatZar : 0;
    return productTotal + deliveryCost;
  });

  onDeliveryOptionSelected(option: DeliveryOption) {
    this.selectedDelivery.set(option);
  }

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
    if (this.store.cart().length === 0 || !this.selectedDelivery()) return;

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

      const deliveryOption = this.selectedDelivery()!;
      
      // Append delivery choice details to order notes
      const notes = `[DELIVERY METHOD: ${deliveryOption.title}] Tariff: R${deliveryOption.calculatedPriceZar} + VAT: R${deliveryOption.vatZar}. Total Delivery: R${deliveryOption.totalWithVatZar}. Estimated: ${deliveryOption.estimatedDays}. Company: ${this.enquiryData.company || 'N/A'}`;

      await this.ordersService.createOrder({
        customer_name: `${this.enquiryData.name} (${this.enquiryData.company || 'Private'})`,
        customer_email: this.enquiryData.email,
        customer_phone: this.enquiryData.phone,
        items,
        total: this.finalEstimatedTotal()
      });

      this.isSubmitting.set(false);
      this.submitSuccess.set(true);

      setTimeout(() => {
        this.store.clearCart();
        this.submitSuccess.set(false);
        this.enquiryData = { name: '', email: '', phone: '', company: '' };
        this.selectedDelivery.set(null);
        this.router.navigate(['/catalog']);
      }, 3000);
    } catch (err) {
      console.error('Order submission failed:', err);
      this.isSubmitting.set(false);
      this.submitError.set(true);
    }
  }
}

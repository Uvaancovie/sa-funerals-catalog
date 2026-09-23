import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../services/store.service';
import { BrevoService } from '../services/brevo.service';
import { OrdersService } from '../services/orders.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-[#0F2040]">Product Enquiry</h1>
        <p class="text-sm text-[#0F2040]/50 mt-1">Review your selected products and submit your enquiry. Our team will get back to you with a tailored quote.</p>
      </div>

      <!-- Submission Success State -->
      @if (submitSuccess() && lastSubmittedOrder()) {
        <div class="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sm:p-10 max-w-2xl mx-auto text-center">
          <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <span class="inline-block px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] font-bold text-xs tracking-wider uppercase rounded-full mb-2">
            Reference: {{ lastSubmittedOrder()?.reference }}
          </span>

          <h2 class="text-2xl font-bold text-[#0F2040]">Enquiry Successfully Submitted!</h2>
          <p class="text-sm text-[#0F2040]/70 mt-2 max-w-md mx-auto">
            Thank you, <strong class="text-[#0F2040]">{{ lastSubmittedOrder()?.name }}</strong>. 
            A confirmation email has been dispatched to <strong class="text-[#0F2040]">{{ lastSubmittedOrder()?.email }}</strong>. Our wholesale sales team will review your quantities and contact you promptly.
          </p>

          <!-- Selected Products Summary in Confirmation -->
          <div class="mt-6 border border-gray-100 bg-gray-50/70 rounded-xl p-4 text-left">
            <div class="text-xs font-bold text-[#0F2040] uppercase tracking-wider mb-2">Requested Items:</div>
            <div class="divide-y divide-gray-200/60">
              @for (item of lastSubmittedOrder()?.items; track item.name + item.variant) {
                <div class="py-2 flex justify-between items-center text-xs">
                  <div>
                    <span class="font-medium text-[#0F2040]">{{ item.name }}</span>
                    <span class="text-[#D4AF37] ml-2">({{ item.variant }})</span>
                  </div>
                  <span class="font-bold text-[#0F2040] bg-white px-2 py-0.5 rounded border border-gray-200">Qty: {{ item.quantity }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              type="button"
              (click)="downloadInvoice()"
              [disabled]="isDownloadLimited()"
              class="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              [class]="isDownloadLimited() ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-[#0F2040] text-white hover:bg-[#142848]'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              @if (isDownloadLimited()) {
                <span>Download Limit Reached (3/3)</span>
              } @else {
                <span>Download Enquiry PDF ({{ downloadCount() }}/3)</span>
              }
            </button>

            <a routerLink="/catalog" class="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-[#0F2040] hover:bg-gray-50 transition-colors">
              Continue Browsing
            </a>
          </div>

          <!-- Small disclaimer -->
          <p class="text-[10px] text-[#0F2040]/40 mt-6 leading-relaxed max-w-lg mx-auto">
            DISCLAIMER: This enquiry summary is for reference and record-keeping purposes only and does not constitute a tax invoice. All data is processed in accordance with POPIA & GDPR regulations. PDF downloads are limited to 3 per submission.
          </p>
        </div>
      } @else if (store.cartCount() === 0) {
        <div class="flex flex-col items-center justify-center py-20 text-[#0F2040]/40 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mb-5 text-[#D4AF37]/60">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
          </svg>
          <p class="text-lg font-medium text-[#0F2040]/60">No products selected yet.</p>
          <a routerLink="/catalog" class="mt-5 px-6 py-3 bg-[#0F2040] text-white font-semibold rounded-xl hover:bg-[#142848] transition-colors text-sm shadow-sm">
            Browse Catalog
          </a>
        </div>
      } @else {

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">

          <!-- ═══ LEFT: PRODUCT LIST ═══ -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div class="px-5 py-4 border-b border-gray-100">
                <h2 class="font-bold text-[#0F2040] text-base">Selected Products ({{ store.cartCount() }})</h2>
              </div>

              <div class="divide-y divide-gray-100">
                @for (item of store.cart(); track item.product.id + item.variant) {
                  <div class="flex items-center gap-4 px-5 py-4 group">
                    <!-- Product info -->
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-[#0F2040] text-sm truncate">{{ item.product.name }}</h3>
                      <p class="text-xs text-[#D4AF37] font-medium mt-0.5">{{ item.variant }}</p>
                    </div>

                    <!-- Quantity controls -->
                    <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
                      <button (click)="updateQuantity(item, -1)" class="w-8 h-8 flex items-center justify-center text-[#0F2040] hover:bg-gray-50 text-sm font-bold transition-colors">−</button>
                      <span class="w-9 h-8 flex items-center justify-center text-sm font-semibold text-[#0F2040] bg-gray-50 border-x border-gray-200">{{ item.quantity }}</span>
                      <button (click)="updateQuantity(item, 1)" class="w-8 h-8 flex items-center justify-center text-[#0F2040] hover:bg-gray-50 text-sm font-bold transition-colors">+</button>
                    </div>

                    <!-- Remove button -->
                    <button (click)="removeItem(item)" class="p-1.5 text-gray-300 hover:text-red-500 transition-colors shrink-0" title="Remove item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                }
              </div>

              <!-- Clear all -->
              <div class="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <span class="text-xs text-[#0F2040]/40">{{ store.cart().length }} product(s)</span>
                <button (click)="clearAll()" class="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">Clear All</button>
              </div>
            </div>
          </div>

          <!-- ═══ RIGHT: ENQUIRY FORM ═══ -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-24">

              <div class="px-5 py-4 border-b border-gray-100">
                <h2 class="font-bold text-[#0F2040] text-base">Your Details</h2>
                <p class="text-xs text-[#0F2040]/40 mt-0.5">We'll use this to prepare your quote.</p>
              </div>

              <form (ngSubmit)="submitEnquiry()" #cartForm="ngForm" class="p-5 space-y-4">

                <div>
                  <label class="enquiry-label">Business / Funeral Parlor Name *</label>
                  <input type="text" [(ngModel)]="enquiryData.company" name="company" required
                    placeholder="e.g. Grace Funeral Services"
                    class="enquiry-input" />
                </div>

                <div>
                  <label class="enquiry-label">Contact Person *</label>
                  <input type="text" [(ngModel)]="enquiryData.name" name="name" required
                    placeholder="Full name"
                    class="enquiry-input" />
                </div>

                <div>
                  <label class="enquiry-label">Email Address *</label>
                  <input type="email" [(ngModel)]="enquiryData.email" name="email" required
                    placeholder="you@company.co.za"
                    class="enquiry-input" />
                </div>

                <div>
                  <label class="enquiry-label">Phone Number *</label>
                  <input type="tel" [(ngModel)]="enquiryData.phone" name="phone" required
                    placeholder="+27 ..."
                    class="enquiry-input" />
                </div>

                <div>
                  <label class="enquiry-label">City / Region</label>
                  <input type="text" [(ngModel)]="enquiryData.region" name="region"
                    placeholder="e.g. Durban, KZN"
                    class="enquiry-input" />
                </div>

                <div>
                  <label class="enquiry-label">Additional Notes</label>
                  <textarea [(ngModel)]="enquiryData.notes" name="notes" rows="2"
                    placeholder="Any special requirements..."
                    class="enquiry-input resize-none"></textarea>
                </div>

                <!-- GDPR / POPIA Consent -->
                <div class="bg-gray-50 rounded-xl p-3 space-y-2">
                  <label class="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" [(ngModel)]="enquiryData.consentContact" name="consentContact" required
                      class="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]" />
                    <span class="text-[11px] text-[#0F2040]/60 leading-tight">
                      I consent to South African Funeral Supplies contacting me regarding this enquiry via email or phone. *
                    </span>
                  </label>
                  <label class="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" [(ngModel)]="enquiryData.consentStore" name="consentStore" required
                      class="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]" />
                    <span class="text-[11px] text-[#0F2040]/60 leading-tight">
                      I agree that my details may be stored and processed in accordance with the POPIA (Protection of Personal Information Act) and GDPR. *
                    </span>
                  </label>
                </div>

                <!-- Submit -->
                <button
                  type="submit"
                  [disabled]="cartForm.invalid || isSubmitting() || !enquiryData.consentContact || !enquiryData.consentStore"
                  class="w-full bg-[#0F2040] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#142848] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
                >
                  @if (isSubmitting()) {
                    <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Submitting...</span>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 2L11 13"></path>
                      <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                    <span>Submit Enquiry</span>
                  }
                </button>

                <!-- Error message if submission fails -->
                @if (submitError()) {
                  <div class="text-red-600 text-xs font-semibold bg-red-50 p-3 rounded-xl border border-red-200 text-center">
                    Submission failed. Please check your network or try again.
                  </div>
                }
              </form>

              <!-- Disclaimer -->
              <div class="px-5 pb-4">
                <p class="text-[10px] text-[#0F2040]/30 leading-relaxed">
                  This is an enquiry only — no payment is processed. Prices are quoted separately by our sales team.
                  Your personal data is handled in compliance with POPIA and GDPR. Downloads are limited to 3 per enquiry for security.
                  South African Funeral Supplies (Pty) Ltd reserves the right to amend pricing without prior notice.
                </p>
              </div>

            </div>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    .enquiry-label {
      display: block;
      font-size: 0.6875rem;
      font-weight: 600;
      color: #0F2040;
      margin-bottom: 0.25rem;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }
    .enquiry-input {
      display: block;
      width: 100%;
      padding: 0.625rem 0.875rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #0F2040;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      transition: all 0.15s ease;
    }
    .enquiry-input::placeholder {
      color: rgba(15, 32, 64, 0.25);
    }
    .enquiry-input:focus {
      outline: none;
      background-color: #FFFFFF;
      border-color: #D4AF37;
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.08);
    }
  `]
})
export class CartComponent {
  store = inject(StoreService);
  private brevoService = inject(BrevoService);
  private ordersService = inject(OrdersService);
  private router = inject(Router);

  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);
  downloadCount = signal(0);
  lastSubmittedOrder = signal<any>(null);

  isDownloadLimited = computed(() => this.downloadCount() >= 3);

  enquiryData = {
    company: 'Way2fly Digital',
    name: 'South African Funeral Supplies',
    email: 'i.t.safuneralsupplies@gmail.com',
    phone: '031 508 6700',
    region: 'Durban KZN',
    notes: '',
    consentContact: true,
    consentStore: true
  };

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

  clearAll() {
    this.store.clearCart();
  }

  async submitEnquiry() {
    if (this.store.cart().length === 0) return;
    if (!this.enquiryData.consentContact || !this.enquiryData.consentStore) return;

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);
    this.submitError.set(false);

    try {
      const cartItems = [...this.store.cart()];

      const enquiryRecord = {
        reference: 'SAFS-ENQ-378750',
        date: '23 Sept 2026',
        company: this.enquiryData.company,
        name: this.enquiryData.name,
        email: this.enquiryData.email,
        phone: this.enquiryData.phone,
        region: this.enquiryData.region,
        notes: this.enquiryData.notes,
        items: cartItems.map(i => ({
          name: i.product.name,
          variant: i.variant,
          quantity: i.quantity
        }))
      };

      // 1. Save directly into Supabase public."Orders" table
      try {
        await this.ordersService.createOrder({
          customer_id: 2,
          customer_name: this.enquiryData.name,
          customer_email: this.enquiryData.email,
          customer_phone: this.enquiryData.phone,
          customer_company: this.enquiryData.company,
          items: cartItems.map(i => ({
            productId: i.product.id,
            productName: i.product.name,
            variant: i.variant,
            quantity: i.quantity,
            price: i.product.price || 0
          })),
          total: this.store.cartTotal(),
          notes: `Ref: ${enquiryRecord.reference}. Region: ${this.enquiryData.region}. Notes: ${this.enquiryData.notes || 'None'}`
        });
        console.info('Order successfully recorded in Supabase Orders table');
      } catch (dbErr) {
        console.warn('Orders database save notice:', dbErr);
      }

      // 2. Dispatch email notification to i.t.safuneralsupplies@gmail.com and customer
      try {
        await this.brevoService.sendCartEnquiry(this.enquiryData, cartItems);
      } catch (emailErr) {
        console.warn('Email dispatch notice:', emailErr);
      }

      this.lastSubmittedOrder.set(enquiryRecord);
      this.downloadCount.set(0);
      this.store.clearCart();
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
    } catch (err) {
      console.error('Enquiry submission failed:', err);
      this.isSubmitting.set(false);
      this.submitError.set(true);
    }
  }

  downloadInvoice() {
    if (this.isDownloadLimited()) return;

    const enquiry = this.lastSubmittedOrder();
    if (!enquiry) return;

    const doc = new jsPDF();

    // Top Header Banner
    doc.setFillColor(15, 32, 64); // Dark Navy #0F2040
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('SOUTH AFRICAN FUNERAL SUPPLIES', 20, 16);

    doc.setTextColor(212, 175, 55); // Gold #D4AF37
    doc.setFontSize(9);
    doc.text('Product Enquiry & Quotation Summary', 20, 24);

    // Business & Contact Meta
    doc.setTextColor(15, 32, 64);
    doc.setFontSize(10);
    doc.text(`Reference: ${enquiry.reference}`, 20, 44);
    doc.text(`Date: ${enquiry.date}`, 20, 50);
    doc.text(`Business / Parlor: ${enquiry.company}`, 20, 56);
    doc.text(`Contact Person: ${enquiry.name}`, 20, 62);

    doc.text(`Email: ${enquiry.email}`, 115, 44);
    doc.text(`Phone: ${enquiry.phone}`, 115, 50);
    if (enquiry.region) {
      doc.text(`Region: ${enquiry.region}`, 115, 56);
    }

    // Divider
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(20, 68, 190, 68);

    // Table Header
    let y = 77;
    doc.setFillColor(245, 247, 250);
    doc.rect(20, y - 5, 170, 8, 'F');
    doc.setFontSize(9);
    doc.setTextColor(15, 32, 64);
    doc.text('Product Description', 24, y);
    doc.text('Color / Finish', 115, y);
    doc.text('Qty', 175, y, { align: 'right' });

    y += 8;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);

    enquiry.items.forEach((item: any) => {
      doc.setFontSize(9);
      doc.setTextColor(30, 40, 60);
      doc.text(item.name.substring(0, 48), 24, y);
      doc.text(item.variant || 'Standard', 115, y);
      doc.text(String(item.quantity), 175, y, { align: 'right' });
      doc.line(20, y + 3, 190, y + 3);
      y += 8;
    });

    if (enquiry.notes) {
      y += 4;
      doc.setFontSize(8);
      doc.setTextColor(100, 110, 125);
      doc.text(`Special Notes: ${enquiry.notes}`, 20, y);
      y += 6;
    }

    // Disclaimer
    y += 12;
    doc.setFontSize(7.5);
    doc.setTextColor(120, 130, 145);
    const disclaimer = 'DISCLAIMER: This document serves as a verified product enquiry and price request. It is not a final tax invoice. Official wholesale pricing, VAT, and logistics will be confirmed by South African Funeral Supplies (Pty) Ltd upon review. All personal data is processed strictly under POPIA and GDPR standards.';
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 170);
    doc.text(splitDisclaimer, 20, y);

    doc.save(`${enquiry.reference}.pdf`);
    this.downloadCount.update(c => c + 1);
  }
}

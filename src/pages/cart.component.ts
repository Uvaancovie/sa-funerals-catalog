import { Component, inject, signal } from '@angular/core';
import { StoreService } from '../services/store.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="container mx-auto px-4 max-w-5xl">
        <h1 class="font-serif text-3xl font-bold text-safs-dark mb-8 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
          Quote Request
        </h1>

        @if (store.cart().length > 0) {
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Cart Items -->
            <div class="lg:w-2/3">
              <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <table class="w-full text-left">
                  <thead class="bg-gray-100 text-gray-600 text-sm uppercase">
                    <tr>
                      <th class="p-4">Product</th>
                      <th class="p-4 text-center">Quantity</th>
                      <th class="p-4"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    @for (item of store.cart(); track item.product.id + item.variant) {
                      <tr class="hover:bg-gray-50 transition-colors">
                        <td class="p-4">
                          <div class="flex items-center gap-4">
                            <img [src]="item.product.image" class="w-16 h-16 object-cover rounded-lg bg-gray-100 border border-gray-200">
                            <div>
                              <div class="font-bold text-safs-dark">{{ item.product.name }}</div>
                              <div class="text-sm text-gray-500">Variant: {{ item.variant }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="p-4">
                          <div class="flex items-center justify-center gap-3">
                            <button (click)="store.updateQuantity(item.product.id, item.variant, -1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">-</button>
                            <span class="font-bold w-6 text-center text-safs-dark">{{ item.quantity }}</span>
                            <button (click)="store.updateQuantity(item.product.id, item.variant, 1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">+</button>
                          </div>
                        </td>
                        <td class="p-4 text-center">
                          <button (click)="store.removeFromCart(item.product.id, item.variant)" class="text-red-400 hover:text-red-600 transition-colors p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <!-- Clear Cart -->
              <div class="mt-4 flex justify-between items-center">
                <a routerLink="/catalog" class="text-safs-gold font-medium hover:underline flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  Continue Shopping
                </a>
                <button (click)="store.clearCart()" class="text-red-500 text-sm font-medium hover:underline">Clear All</button>
              </div>
            </div>

            <!-- Summary & Quote Generation -->
            <div class="lg:w-1/3">
              <div class="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 class="font-bold text-lg mb-6 border-b pb-2 text-safs-dark">Quote Summary</h3>
                
                <div class="flex justify-between mb-3 text-gray-600">
                  <span>Total Items</span>
                  <span class="font-bold text-safs-dark">{{ store.cartCount() }}</span>
                </div>
                <div class="flex justify-between mb-3 text-gray-600">
                  <span>Products</span>
                  <span class="font-bold text-safs-dark">{{ store.cart().length }}</span>
                </div>

                <div class="border-t pt-4 mt-4 mb-6">
                  <p class="text-xs text-gray-500 mb-4">
                    Final pricing will be provided by our sales team once your quote request is submitted. Prices vary based on quantity, delivery, and customisation.
                  </p>
                </div>

                <button (click)="generateQuote()" class="w-full bg-safs-gold text-safs-dark font-bold py-3.5 rounded-lg hover:bg-yellow-600 transition-colors mb-3 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Generate Quote PDF
                </button>

                <button (click)="showEmailForm.set(!showEmailForm())" class="w-full bg-safs-dark text-white font-bold py-3.5 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  Email Quote Request
                </button>

                <!-- Email Form -->
                @if (showEmailForm()) {
                  <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                    <input type="text" placeholder="Company Name" (input)="companyName = getValue($event)" class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none" />
                    <input type="text" placeholder="Contact Person" (input)="contactPerson = getValue($event)" class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none" />
                    <input type="email" placeholder="Email Address" (input)="emailAddress = getValue($event)" class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none" />
                    <input type="tel" placeholder="Phone Number" (input)="phoneNumber = getValue($event)" class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none" />
                    <textarea placeholder="Additional Notes..." rows="3" (input)="additionalNotes = getValue($event)" class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-safs-gold focus:border-transparent outline-none resize-none"></textarea>
                    <button (click)="submitQuoteRequest()" class="w-full bg-green-600 text-white font-bold py-2.5 rounded text-sm hover:bg-green-700 transition-colors">
                      Submit Quote Request
                    </button>
                  </div>
                }

                @if (showSubmitSuccess()) {
                  <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm text-center">
                    <p class="font-bold mb-1">Quote request submitted!</p>
                    <p class="text-xs text-green-600">Our sales team will contact you shortly.</p>
                  </div>
                }
              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-20 bg-white rounded-lg shadow-sm">
             <div class="inline-block p-6 rounded-full bg-gray-100 mb-6 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
             </div>
             <h2 class="text-2xl font-bold text-safs-dark mb-4">Your quote request is empty</h2>
             <p class="text-gray-500 mb-8">Browse our catalogue to add premium funeral products.</p>
             <a routerLink="/catalog" class="inline-block bg-safs-dark text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors">
               Go to Catalogue
             </a>
          </div>
        }
      </div>
    </div>
  `
})
export class CartComponent {
  store = inject(StoreService);

  showEmailForm = signal(false);
  showSubmitSuccess = signal(false);

  companyName = '';
  contactPerson = '';
  emailAddress = '';
  phoneNumber = '';
  additionalNotes = '';

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  generateQuote() {
    const items = this.store.cart();
    const now = new Date();
    const quoteNumber = 'SAF-' + now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0') + '-' + String(Math.floor(Math.random() * 9000) + 1000);

    let html = `
<!DOCTYPE html>
<html>
<head>
  <title>SA Funeral Supplies - Quote ${quoteNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 40px; background: #fff; }
    .header { background: #1a103c; color: white; padding: 40px; margin: -40px -40px 40px -40px; }
    .header h1 { font-size: 28px; color: #a89f6e; margin-bottom: 4px; font-family: serif; }
    .header p { color: #ccc; font-size: 14px; }
    .quote-info { display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap; gap: 20px; }
    .quote-info div { font-size: 14px; }
    .quote-info strong { color: #1a103c; display: block; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #f3f4f6; padding: 12px 16px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; border-bottom: 2px solid #e5e7eb; }
    td { padding: 14px 16px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .product-info { display: flex; align-items: center; gap: 12px; }
    .product-info img { width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #a89f6e; text-align: center; font-size: 12px; color: #888; }
    .footer strong { color: #1a103c; }
    .note { background: #fef3cd; padding: 16px; border-radius: 8px; font-size: 13px; color: #856404; margin-bottom: 30px; }
    .total-row { background: #f9fafb; font-weight: bold; }
    .total-row td { font-size: 16px; color: #1a103c; }
    @media print { body { padding: 20px; } .header { margin: -20px -20px 30px -20px; padding: 30px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>SOUTH AFRICAN FUNERAL SUPPLIES</h1>
    <p>Quality &bull; Value &bull; Service &bull; Innovation</p>
  </div>

  <div class="quote-info">
    <div>
      <strong>Quote Number</strong>
      ${quoteNumber}
    </div>
    <div>
      <strong>Date</strong>
      ${now.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
    <div>
      <strong>Valid Until</strong>
      ${new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
  </div>

  <div class="note">
    <strong>Please Note:</strong> This is a quote request summary. Final pricing will be provided by our sales team after review. Prices may vary based on quantity, delivery location, and customisation requirements.
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 10%">#</th>
        <th style="width: 50%">Product</th>
        <th style="width: 20%">Variant</th>
        <th style="width: 20%; text-align: center;">Quantity</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((item, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>
          <div class="product-info">
            <img src="${item.product.image}" alt="${item.product.name}">
            <div>
              <strong>${item.product.name}</strong>
              <div style="color: #888; font-size: 12px; text-transform: uppercase;">${item.product.category}</div>
            </div>
          </div>
        </td>
        <td>${item.variant}</td>
        <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
      </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="3" style="text-align: right;">Total Items</td>
        <td style="text-align: center;">${this.store.cartCount()}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p><strong>SA Funeral Supplies</strong></p>
    <p>160 Aberdare Drive, Phoenix Industrial Park, Durban, 4090</p>
    <p>Tel: +27 31 508 6700 &bull; Email: pamg&#64;safuneral.co.za &bull; www.safuneral.co.za</p>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  }

  submitQuoteRequest() {
    // In a real app this would send to an API
    this.showSubmitSuccess.set(true);
    this.showEmailForm.set(false);
    setTimeout(() => this.showSubmitSuccess.set(false), 5000);
  }
}

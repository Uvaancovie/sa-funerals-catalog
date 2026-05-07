import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OrdersService, Order, OrderItem } from '../services/orders.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [`
    @media print {
      .no-print { display: none !important; }
      .print-invoice { display: block !important; }
      body { background: white; }
    }
    .print-invoice { display: none; }
    .status-pending   { background:#fef3c7; color:#92400e; }
    .status-confirmed { background:#dbeafe; color:#1e40af; }
    .status-processing{ background:#ede9fe; color:#5b21b6; }
    .status-fulfilled { background:#dcfce7; color:#166534; }
    .status-cancelled { background:#fee2e2; color:#991b1b; }
  `],
  template: `
    <div class="bg-gray-50 min-h-screen no-print">
      <div class="bg-safs-dark text-white py-10">
        <div class="container mx-auto px-4">
          <a routerLink="/catalog" class="text-safs-gold text-sm font-bold hover:underline no-print flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Catalogue
          </a>
          <h1 class="font-serif text-3xl font-bold mt-2">My Orders</h1>
          <p class="text-gray-400 text-sm mt-1">{{ authService.currentUser()?.companyName }}</p>
        </div>
      </div>

      <div class="container mx-auto px-4 py-10 max-w-5xl">

        @if (ordersService.loading()) {
          <div class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-safs-gold border-t-transparent"></div>
          </div>
        } @else if (ordersService.myOrders().length === 0) {
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div class="mb-4 flex justify-center text-safs-gold">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14h6"></path><path d="M9 10h6"></path><path d="M9 18h6"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-safs-dark font-serif mb-2">No orders yet</h3>
            <p class="text-gray-500 mb-6">Browse our catalogue and add items to your cart to place an order.</p>
            <a routerLink="/catalog" class="bg-safs-gold text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all">
              Browse Catalogue
            </a>
          </div>
        } @else {
          <div class="space-y-6">
            @for (order of ordersService.myOrders(); track order.orderId) {
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <!-- Order Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
                  <div>
                    <div class="flex items-center gap-3 mb-1">
                      <span class="text-sm font-mono text-gray-500">#ORD-{{ order.orderId.toString().padStart(5, '0') }}</span>
                      <span class="text-xs font-bold px-2 py-0.5 rounded-full status-{{ order.status }}">
                        {{ order.status | uppercase }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-400">Placed {{ formatDate(order.createdAt) }}</p>
                  </div>
                  <div class="flex gap-3">
                    <button
                      (click)="printOrder(order)"
                      class="no-print flex items-center gap-2 px-4 py-2 bg-safs-dark text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                      Download PDF
                    </button>
                  </div>
                </div>

                <!-- Items Table -->
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead class="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider">
                      <tr>
                        <th class="px-6 py-3 text-left">Product</th>
                        <th class="px-6 py-3 text-left">Variant</th>
                        <th class="px-6 py-3 text-center">Qty</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      @for (item of ordersService.parseItems(order); track item.productId) {
                        <tr>
                          <td class="px-6 py-4 font-medium text-safs-dark">{{ item.productName }}</td>
                          <td class="px-6 py-4 text-gray-500">{{ item.variant }}</td>
                          <td class="px-6 py-4 text-center font-bold">{{ item.quantity }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

                @if (order.notes) {
                  <div class="px-6 py-4 bg-amber-50 border-t border-amber-100 text-sm text-amber-800">
                    <strong>Note:</strong> {{ order.notes }}
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>

    <!-- Hidden printable invoice (shown only on print) -->
    <div id="print-area" class="print-invoice p-8 max-w-3xl mx-auto">
      @if (printingOrder()) {
        <div>
          <div class="flex justify-between items-start mb-8">
            <div>
              <h1 class="text-2xl font-bold">SA Funeral Supplies</h1>
              <p class="text-gray-500 text-sm">Product Quotation Request</p>
            </div>
            <div class="text-right text-sm text-gray-600">
              <p class="font-bold text-lg">#ORD-{{ printingOrder()!.orderId.toString().padStart(5, '0') }}</p>
              <p>{{ formatDate(printingOrder()!.createdAt) }}</p>
            </div>
          </div>

          <div class="border-t border-b border-gray-200 py-4 mb-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="font-bold text-gray-700 mb-1">Bill To:</p>
              <p class="font-bold">{{ printingOrder()!.customerCompany || printingOrder()!.customerEmail }}</p>
              <p class="text-gray-500">{{ printingOrder()!.customerEmail }}</p>
            </div>
            <div>
              <p class="font-bold text-gray-700 mb-1">Status:</p>
              <p class="font-bold uppercase">{{ printingOrder()!.status }}</p>
            </div>
          </div>

          <table class="w-full text-sm mb-8" style="border-collapse:collapse">
            <thead>
              <tr style="border-bottom:2px solid #000">
                <th class="py-2 text-left font-bold">Product</th>
                <th class="py-2 text-left font-bold">Variant/Finish</th>
                <th class="py-2 text-center font-bold">Qty</th>
                <th class="py-2 text-right font-bold">Price</th>
              </tr>
            </thead>
            <tbody>
              @for (item of ordersService.parseItems(printingOrder()!); track item.productId) {
                <tr style="border-bottom:1px solid #e5e7eb">
                  <td class="py-3">{{ item.productName }}</td>
                  <td class="py-3 text-gray-500">{{ item.variant }}</td>
                  <td class="py-3 text-center">{{ item.quantity }}</td>
                  <td class="py-3 text-right text-gray-500">On Request</td>
                </tr>
              }
            </tbody>
          </table>

          @if (printingOrder()!.notes) {
            <div class="border border-gray-200 rounded p-3 text-sm mb-6">
              <strong>Notes:</strong> {{ printingOrder()!.notes }}
            </div>
          }

          <div class="text-xs text-gray-400 border-t border-gray-200 pt-4 mt-8">
            <p>All prices are on request. Contact us for a formal quotation.</p>
            <p class="mt-1">SA Funeral Supplies — admin&#64;safuneralsupplies.co.za</p>
          </div>
        </div>
      }
    </div>
  `
})
export class MyOrdersComponent implements OnInit {
  ordersService = inject(OrdersService);
  authService = inject(AuthService);
  printingOrder = signal<Order | null>(null);

  ngOnInit() {
    this.ordersService.getMyOrders().subscribe();
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-ZA', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  printOrder(order: Order) {
    this.printingOrder.set(order);
    setTimeout(() => {
      window.print();
      // Reset after printing
      setTimeout(() => this.printingOrder.set(null), 1000);
    }, 200);
  }
}

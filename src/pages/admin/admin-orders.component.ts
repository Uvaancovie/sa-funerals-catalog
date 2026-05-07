import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrdersService, Order } from '../../services/orders.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    styles: [`
    .status-pending   { background:#fef3c7; color:#92400e; }
    .status-confirmed { background:#dbeafe; color:#1e40af; }
    .status-processing{ background:#ede9fe; color:#5b21b6; }
    .status-fulfilled { background:#dcfce7; color:#166534; }
    .status-cancelled { background:#fee2e2; color:#991b1b; }
  `],
    template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-safs-dark text-white shadow-lg">
        <div class="container mx-auto px-4 py-6 flex justify-between items-center">
          <div class="flex items-center gap-4">
            <a routerLink="/admin" class="text-white hover:text-safs-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </a>
            <div>
              <h1 class="text-2xl font-bold">Order Management</h1>
              <p class="text-sm text-gray-400">{{ ordersService.allOrders().length }} total orders</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm">{{ authService.currentUser()?.email }}</span>
            <button (click)="logout()" class="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-sm font-bold">Logout</button>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8 max-w-7xl">

        <!-- Status filter tabs -->
        <div class="flex gap-2 mb-6 overflow-x-auto pb-1">
          @for (s of statuses; track s.value) {
            <button
              (click)="filterOrders(s.value)"
              [class.bg-safs-dark]="statusFilter() === s.value"
              [class.text-white]="statusFilter() === s.value"
              [class.bg-white]="statusFilter() !== s.value"
              [class.text-gray-600]="statusFilter() !== s.value"
              class="px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap shadow-sm border border-gray-200 transition-all">
              {{ s.label }}
            </button>
          }
        </div>

        @if (ordersService.loading()) {
          <div class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-safs-gold border-t-transparent"></div>
          </div>
        } @else if (ordersService.allOrders().length === 0) {
          <div class="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <div class="text-5xl mb-4">📋</div>
            <h3 class="text-xl font-bold text-safs-dark font-serif">No orders found</h3>
            <p class="text-gray-500 mt-2">No orders match the current filter.</p>
          </div>
        } @else {
          <div class="space-y-4">
            @for (order of ordersService.allOrders(); track order.orderId) {
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                <!-- Order header -->
                <div class="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                  <div class="flex items-start gap-4">
                    <div>
                      <div class="flex items-center gap-3 mb-1">
                        <span class="font-mono font-bold text-safs-dark">#ORD-{{ order.orderId.toString().padStart(5, '0') }}</span>
                        <span class="text-xs font-bold px-2 py-0.5 rounded-full status-{{ order.status }}">{{ order.status | uppercase }}</span>
                      </div>
                      <p class="text-sm text-gray-600 font-bold">{{ order.customerCompany || order.customerEmail }}</p>
                      <p class="text-xs text-gray-400">{{ order.customerEmail }} · {{ formatDate(order.createdAt) }}</p>
                    </div>
                  </div>

                  <!-- Status update -->
                  <div class="flex items-center gap-3">
                    <select
                      [value]="order.status"
                      (change)="updateStatus(order, $event)"
                      class="text-sm border border-gray-300 rounded-lg px-3 py-2 font-bold focus:ring-2 focus:ring-safs-gold focus:border-transparent">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="fulfilled">Fulfilled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button (click)="toggleExpanded(order.orderId)"
                      class="px-3 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                      {{ isExpanded(order.orderId) ? 'Hide' : 'View Items' }}
                    </button>
                  </div>
                </div>

                <!-- Expanded items -->
                @if (isExpanded(order.orderId)) {
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
                    <div class="px-6 py-3 bg-amber-50 border-t border-amber-100 text-sm text-amber-800">
                      <strong>Notes:</strong> {{ order.notes }}
                    </div>
                  }
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
    ordersService = inject(OrdersService);
    authService = inject(AuthService);
    router = inject(Router);

    statusFilter = signal<string>('');
    expandedOrders = signal<Set<number>>(new Set());

    statuses = [
        { value: '', label: 'All Orders' },
        { value: 'pending', label: '⏳ Pending' },
        { value: 'confirmed', label: '✅ Confirmed' },
        { value: 'processing', label: '🔄 Processing' },
        { value: 'fulfilled', label: '📦 Fulfilled' },
        { value: 'cancelled', label: '❌ Cancelled' },
    ];

    ngOnInit() {
        this.ordersService.getAllOrders().subscribe();
    }

    filterOrders(status: string) {
        this.statusFilter.set(status);
        this.ordersService.getAllOrders(status || undefined).subscribe();
    }

    toggleExpanded(orderId: number) {
        this.expandedOrders.update(set => {
            const next = new Set(set);
            if (next.has(orderId)) next.delete(orderId);
            else next.add(orderId);
            return next;
        });
    }

    isExpanded(orderId: number): boolean {
        return this.expandedOrders().has(orderId);
    }

    updateStatus(order: Order, event: Event) {
        const newStatus = (event.target as HTMLSelectElement).value;
        this.ordersService.updateStatus(order.orderId, newStatus).subscribe({
            next: (updated) => {
                this.ordersService.allOrders.update(orders =>
                    orders.map(o => o.orderId === updated.orderId ? updated : o)
                );
            },
            error: (err) => alert('Failed to update status: ' + (err.error?.error || 'Unknown error'))
        });
    }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('en-ZA', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/admin-signin']);
    }
}

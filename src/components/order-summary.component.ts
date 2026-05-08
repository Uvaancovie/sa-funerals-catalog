import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, Order, OrderItem } from '../services/orders.service';
import { ProductsService, Product } from '../services/products.service';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-summary">
      <h2>Order Summary</h2>

      <div class="current-order">
        <h3>Current Order</h3>
        <div *ngFor="let item of currentOrderItems()">
          <p>{{ item.productName }} - Qty: {{ item.quantity }} - R{{ item.total.toFixed(2) }}</p>
        </div>
        <p>Total: R{{ currentOrderTotal().toFixed(2) }}</p>
        <button (click)="placeOrder()">Place Order</button>
      </div>

      <div class="past-orders">
        <h3>Past Orders</h3>
        <div *ngFor="let order of ordersService.orders()">
          <div class="order-card">
            <p>Order ID: {{ order.id }}</p>
            <p>Date: {{ order.date | date }}</p>
            <p>Total: R{{ order.total.toFixed(2) }}</p>
            <button (click)="downloadPDF(order)">Download PDF</button>
            <button (click)="removeOrder(order.id)">Remove</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-summary { padding: 20px; }
    .order-card { border: 1px solid #ccc; padding: 10px; margin: 10px 0; }
  `]
})
export class OrderSummaryComponent {
  ordersService = inject(OrdersService);
  productsService = inject(ProductsService);

  // For demo, assume some current order items
  currentOrderItems = signal<OrderItem[]>([
    { productId: '1', productName: 'Sample Product', quantity: 2, price: 100, total: 200 }
  ]);
  currentOrderTotal = signal<number>(200);

  placeOrder() {
    const order: Order = {
      id: Date.now().toString(),
      items: this.currentOrderItems(),
      total: this.currentOrderTotal(),
      date: new Date().toISOString(),
      customerName: 'John Doe'
    };
    this.ordersService.addOrder(order);
    // Clear current order
    this.currentOrderItems.set([]);
    this.currentOrderTotal.set(0);
  }

  downloadPDF(order: Order) {
    this.ordersService.generatePDF(order);
  }

  removeOrder(orderId: string) {
    this.ordersService.removeOrder(orderId);
  }
}
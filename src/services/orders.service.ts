import { Injectable, signal } from '@angular/core';
import jsPDF from 'jspdf';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  customerName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private ordersSignal = signal<Order[]>([]);
  orders = this.ordersSignal.asReadonly();

  addOrder(order: Order) {
    const current = this.ordersSignal();
    this.ordersSignal.set([...current, order]);
    // Persist to localStorage
    localStorage.setItem('orders', JSON.stringify([...current, order]));
  }

  removeOrder(orderId: string) {
    const current = this.ordersSignal();
    const updated = current.filter(o => o.id !== orderId);
    this.ordersSignal.set(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
  }

  loadOrders() {
    const stored = localStorage.getItem('orders');
    if (stored) {
      this.ordersSignal.set(JSON.parse(stored));
    }
  }

  generatePDF(order: Order) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('Order Receipt', 20, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 20, 35);
    doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 20, 45);
    if (order.customerName) {
      doc.text(`Customer: ${order.customerName}`, 20, 55);
    }

    // Items
    let y = 70;
    doc.setFontSize(10);
    doc.text('Product', 20, y);
    doc.text('Qty', 120, y);
    doc.text('Price', 140, y);
    doc.text('Total', 170, y);
    y += 10;

    order.items.forEach(item => {
      doc.text(item.productName, 20, y);
      doc.text(item.quantity.toString(), 120, y);
      doc.text(`R${item.price.toFixed(2)}`, 140, y);
      doc.text(`R${item.total.toFixed(2)}`, 170, y);
      y += 10;
    });

    // Total
    y += 10;
    doc.setFontSize(12);
    doc.text(`Total: R${order.total.toFixed(2)}`, 20, y);

    // Footer
    y += 20;
    doc.setFontSize(8);
    doc.text('Thank you for your business!', 20, y);

    // Download
    doc.save(`order-${order.id}.pdf`);
  }

  constructor() {
    this.loadOrders();
  }
}
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';
import jsPDF from 'jspdf';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  status: string;
  notes?: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly apiUrl = environment.apiUrl;
  private ordersSignal = signal<Order[]>([]);
  orders = this.ordersSignal.asReadonly();
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  async fetchOrders(): Promise<void> {
    const res = await lastValueFrom(
      this.http.get<Order[]>(`${this.apiUrl}/api/orders`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    this.ordersSignal.set(res);
  }

  async createOrder(order: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
  }): Promise<Order> {
    const res = await lastValueFrom(
      this.http.post<Order>(`${this.apiUrl}/api/orders`, order)
    );
    return res;
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await lastValueFrom(
      this.http.patch(`${this.apiUrl}/api/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchOrders();
  }

  async deleteOrder(id: number): Promise<void> {
    await lastValueFrom(
      this.http.delete(`${this.apiUrl}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchOrders();
  }

  generatePDF(order: Order) {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Order Receipt', 20, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: #${order.id}`, 20, 35);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 20, 45);
    doc.text(`Customer: ${order.customer_name}`, 20, 55);

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

    y += 10;
    doc.setFontSize(12);
    doc.text(`Total: R${Number(order.total).toFixed(2)}`, 20, y);
    doc.save(`order-${order.id}.pdf`);
  }
}

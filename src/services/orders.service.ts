import { Injectable, signal, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import jsPDF from 'jspdf';

export interface OrderItem {
  productId?: string;
  productName?: string;
  name?: string;
  category?: string;
  variant: string;
  quantity: number;
  price: number;
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
  private supabase = inject(SupabaseService);
  private ordersSignal = signal<Order[]>([]);
  orders = this.ordersSignal.asReadonly();

  async fetchOrders(): Promise<void> {
    const { data, error } = await this.supabase.client
      .from('Orders')
      .select('*')
      .order('CreatedAt', { ascending: false });

    if (error) {
      console.error('Supabase fetchOrders error:', error);
      return;
    }

    if (data) {
      const mapped: Order[] = data.map((d: any) => {
        let parsedItems: any[] = [];
        try {
          parsedItems = typeof d.Items === 'string' ? JSON.parse(d.Items) : (d.Items || []);
        } catch {
          parsedItems = [];
        }

        return {
          id: d.OrderId,
          customer_name: d.CustomerContact || d.CustomerCompany || d.CustomerEmail,
          customer_email: d.CustomerEmail,
          customer_phone: d.CustomerContact || '',
          items: parsedItems.map((i: any) => ({
            name: i.productName || i.name || 'Casket Item',
            category: i.category || 'Caskets',
            variant: i.variant || 'Standard',
            quantity: i.quantity || 1,
            price: i.price || 0
          })),
          total: parsedItems.reduce((sum: number, it: any) => sum + ((it.price || 0) * (it.quantity || 1)), 0),
          status: d.Status || 'pending',
          notes: d.Notes,
          created_at: d.CreatedAt
        };
      });

      this.ordersSignal.set(mapped);
    }
  }

  async createOrder(orderData: {
    customer_id?: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_company?: string;
    items: any[];
    total?: number;
    notes?: string;
  }): Promise<Order> {
    const formattedItems: OrderItem[] = orderData.items.map(i => ({
      productId: i.productId || i.product?.id || i.name || '',
      productName: i.productName || i.product?.name || i.name || 'Casket Item',
      name: i.productName || i.product?.name || i.name || 'Casket Item',
      category: i.category || i.product?.category || 'Caskets',
      variant: i.variant || 'Standard',
      quantity: i.quantity || 1,
      price: i.price || i.product?.price || 0
    }));

    const { data, error } = await this.supabase.client
      .from('Orders')
      .insert([{
        CustomerId: orderData.customer_id || 2,
        CustomerEmail: orderData.customer_email,
        CustomerCompany: orderData.customer_company || null,
        CustomerContact: `${orderData.customer_name} (${orderData.customer_phone})`,
        Items: JSON.stringify(formattedItems),
        Status: 'pending',
        Notes: orderData.notes || null,
        CreatedAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase Orders insert error:', error);
      throw error;
    }

    const created: Order = {
      id: data.OrderId,
      customer_name: data.CustomerContact || data.CustomerCompany || data.CustomerEmail,
      customer_email: data.CustomerEmail,
      customer_phone: data.CustomerContact || '',
      items: formattedItems,
      total: orderData.total || 0,
      status: data.Status,
      notes: data.Notes,
      created_at: data.CreatedAt
    };

    // Update in-memory signal
    this.ordersSignal.update(existing => [created, ...existing]);

    return created;
  }

  async updateStatus(id: number, status: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('Orders')
      .update({ Status: status, UpdatedAt: new Date().toISOString() })
      .eq('OrderId', id);

    if (error) {
      console.error('Supabase updateStatus error:', error);
    }
    await this.fetchOrders();
  }

  async deleteOrder(id: number): Promise<void> {
    const { error } = await this.supabase.client
      .from('Orders')
      .delete()
      .eq('OrderId', id);

    if (error) {
      console.error('Supabase deleteOrder error:', error);
    }
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
      doc.text(item.name, 20, y);
      doc.text(item.quantity.toString(), 120, y);
      doc.text(`R${item.price.toFixed(2)}`, 140, y);
      doc.text(`R${Number(item.price * item.quantity).toFixed(2)}`, 170, y);
      y += 10;
    });

    y += 10;
    doc.setFontSize(12);
    doc.text(`Total: R${Number(order.total).toFixed(2)}`, 20, y);
    doc.save(`order-${order.id}.pdf`);
  }
}

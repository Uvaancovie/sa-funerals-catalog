import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

export interface OrderItem {
    productId: string;
    productName: string;
    variant: string;
    quantity: number;
}

export interface Order {
    orderId: number;
    customerId: number;
    customerEmail: string;
    customerCompany: string | null;
    customerContact: string | null;
    items: string;         // JSON string
    status: 'pending' | 'confirmed' | 'processing' | 'fulfilled' | 'cancelled';
    notes: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export interface PlaceOrderRequest {
    items: OrderItem[];
    notes?: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = '/api/orders';

    myOrders = signal<Order[]>([]);
    allOrders = signal<Order[]>([]);
    loading = signal(false);

    private headers(): HttpHeaders {
        return this.authService.getAuthHeaders();
    }

    parseItems(order: Order): OrderItem[] {
        try {
            const raw = JSON.parse(order.items);
            if (!Array.isArray(raw)) return [];
            // Normalize both PascalCase (old) and camelCase (new) storage format
            return raw.map((v: any) => ({
                productId: v.productId ?? v.ProductId ?? '',
                productName: v.productName ?? v.ProductName ?? '',
                variant: v.variant ?? v.Variant ?? '',
                quantity: v.quantity ?? v.Quantity ?? 1
            }));
        } catch { return []; }
    }

    placeOrder(request: PlaceOrderRequest): Observable<Order> {
        return this.http.post<Order>(this.apiUrl, request, { headers: this.headers() });
    }

    getMyOrders(): Observable<Order[]> {
        this.loading.set(true);
        return this.http.get<Order[]>(`${this.apiUrl}/my`, { headers: this.headers() }).pipe(
            tap({
                next: (data) => { this.myOrders.set(data); this.loading.set(false); },
                error: () => this.loading.set(false)
            })
        );
    }

    getAllOrders(status?: string): Observable<{ total: number; orders: Order[] }> {
        this.loading.set(true);
        const params = status ? `?status=${status}` : '';
        return this.http.get<{ total: number; orders: Order[] }>(`${this.apiUrl}${params}`, { headers: this.headers() }).pipe(
            tap({
                next: (data) => { this.allOrders.set(data.orders); this.loading.set(false); },
                error: () => this.loading.set(false)
            })
        );
    }

    updateStatus(orderId: number, status: string): Observable<Order> {
        return this.http.put<Order>(
            `${this.apiUrl}/${orderId}/status`,
            { status },
            { headers: this.headers() }
        );
    }
}

import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

export interface Customer {
    id: number;
    email: string;
    companyName: string;
    contactPerson: string;
    phone: string;
    address: string | null;
    status: 'pending' | 'approved' | 'declined';
    createdAt: string;
    updatedAt: string | null;
}

export interface CustomersListResponse {
    customers: Customer[];
}

export interface CreateCustomerRequest {
    email: string;
    password: string;
    companyName: string;
    contactPerson: string;
    phone: string;
    address?: string;
    status?: 'pending' | 'approved' | 'declined';
}

export interface UpdateCustomerStatusRequest {
    status: 'pending' | 'approved' | 'declined';
    reason?: string;
}

export interface CustomerFilters {
    status?: string;
    search?: string;
}

/**
 * Service for managing customers (Admin only)
 */
@Injectable({
    providedIn: 'root'
})
export class CustomersService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = '/api/admin/customers';

    // Signals
    customers = signal<Customer[]>([]);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    /**
     * Get all customers with optional filters (Admin only)
     */
    getCustomers(filters?: CustomerFilters): Observable<CustomersListResponse> {
        this.loading.set(true);
        this.error.set(null);

        const headers = this.authService.getAuthHeaders();
        let params = new HttpParams();

        if (filters?.status) {
            params = params.set('status', filters.status);
        }
        if (filters?.search) {
            params = params.set('search', filters.search);
        }

        return this.http.get<CustomersListResponse>(this.apiUrl, { headers, params }).pipe(
            tap({
                next: (response) => {
                    this.customers.set(response.customers);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.error.set(err.error?.error || 'Failed to load customers');
                    this.loading.set(false);
                }
            })
        );
    }

    /**
     * Create a new customer (Admin only)
     */
    createCustomer(request: CreateCustomerRequest): Observable<Customer> {
        const headers = this.authService.getAuthHeaders();
        return this.http.post<Customer>(this.apiUrl, request, { headers }).pipe(
            tap({
                next: (customer) => {
                    // Add to the list
                    this.customers.update(customers => [customer, ...customers]);
                },
                error: (err) => {
                    this.error.set(err.error?.error || 'Failed to create customer');
                }
            })
        );
    }

    /**
     * Update customer status (Admin only)
     */
    updateCustomerStatus(
        id: number,
        request: UpdateCustomerStatusRequest
    ): Observable<{ success: boolean; message: string }> {
        const headers = this.authService.getAuthHeaders();
        return this.http.patch<{ success: boolean; message: string }>(
            `${this.apiUrl}/${id}`,
            request,
            { headers }
        ).pipe(
            tap({
                next: () => {
                    // Update in the local list
                    this.customers.update(customers =>
                        customers.map(c =>
                            c.id === id ? { ...c, status: request.status } : c
                        )
                    );
                },
                error: (err) => {
                    this.error.set(err.error?.error || 'Failed to update status');
                }
            })
        );
    }

    /**
     * Helper methods for filtering
     */
    filterByStatus(status: 'pending' | 'approved' | 'declined'): Customer[] {
        return this.customers().filter(c => c.status === status);
    }

    getPendingCustomers(): Customer[] {
        return this.filterByStatus('pending');
    }

    getApprovedCustomers(): Customer[] {
        return this.filterByStatus('approved');
    }

    getDeclinedCustomers(): Customer[] {
        return this.filterByStatus('declined');
    }
}

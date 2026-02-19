import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

export interface Product {
    productId: number;
    id: string; // slug
    name: string;
    category: string;
    description: string | null;
    price: number | null;
    priceOnRequest: boolean;
    images: string; // JSON string array
    colorVariations: string | null; // JSON string array of color variation objects
    specifications: string | null; // JSON string
    features: string | null; // JSON string array
    inStock: boolean;
    featured: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface ProductFilters {
    category?: string;
    search?: string;
}

export interface ProductAuditLog {
    id: number;
    productId: string;
    productName: string;
    action: string;
    changes: string | null;
    changedBy: string;
    timestamp: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = '/api/products';

    // Signals
    products = signal<Product[]>([]);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    /**
     * Get all products with optional filters
     */
    getProducts(filters?: ProductFilters): Observable<Product[]> {
        this.loading.set(true);
        this.error.set(null);

        let params = new HttpParams();
        if (filters?.category) {
            params = params.set('category', filters.category);
        }
        if (filters?.search) {
            params = params.set('search', filters.search);
        }

        return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
            tap({
                next: (data) => {
                    this.products.set(data);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.error.set(err.error?.error || 'Failed to load products');
                    this.loading.set(false);
                }
            })
        );
    }

    /**
     * Get a single product by ID
     */
    getProduct(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create a new product (Admin only)
     */
    createProduct(product: Partial<Product>): Observable<Product> {
        const headers = this.authService.getAuthHeaders();
        return this.http.post<Product>(this.apiUrl, product, { headers });
    }

    /**
     * Update an existing product (Admin only)
     */
    updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
        const headers = this.authService.getAuthHeaders();
        return this.http.put<Product>(`${this.apiUrl}/${id}`, updates, { headers });
    }

    /**
     * Delete a product (Admin only)
     */
    deleteProduct(id: string): Observable<{ success: boolean; message: string }> {
        const headers = this.authService.getAuthHeaders();
        return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`, { headers });
    }

    /**
     * Get history/audit logs for a specific product
     */
    getProductHistory(id: string): Observable<ProductAuditLog[]> {
        const headers = this.authService.getAuthHeaders();
        return this.http.get<ProductAuditLog[]>(`${this.apiUrl}/${id}/history`, { headers });
    }

    /**
     * Helper method to parse JSON fields
     */
    parseImages(product: Product): string[] {
        try {
            return JSON.parse(product.images);
        } catch {
            return [];
        }
    }

    parseFeatures(product: Product): string[] {
        try {
            return product.features ? JSON.parse(product.features) : [];
        } catch {
            return [];
        }
    }

    parseSpecifications(product: Product): Record<string, string> {
        try {
            return product.specifications ? JSON.parse(product.specifications) : {};
        } catch {
            return {};
        }
    }

    parseColorVariations(product: Product): { color: string; images: string[] }[] {
        try {
            return product.colorVariations ? JSON.parse(product.colorVariations) : [];
        } catch {
            return [];
        }
    }
}

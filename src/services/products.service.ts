import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, map, tap, catchError, throwError } from 'rxjs';
import { SupabaseService } from './supabase.service';

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

export interface ExpoProduct {
    id: string;
    name: string;
    category: string;
    description: string | null;
    price: number | null;
    priceOnRequest: boolean;
    images: string[];
    colorVariations: { color: string; images: string[] }[] | null;
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
    private supabase = inject(SupabaseService).client;
    private http = inject(HttpClient);
    private apiUrl = '/api/products';

    // Signals
    products = signal<Product[]>([]);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    /**
     * Map database row (PascalCase) to Angular model (camelCase)
     */
    private mapDbRowToProduct(dbRow: any): Product {
        return {
            productId: dbRow.ProductId || 0,
            id: dbRow.Id || '',
            name: dbRow.Name || '',
            category: dbRow.Category || '',
            description: dbRow.Description || null,
            price: dbRow.Price || null,
            priceOnRequest: dbRow.PriceOnRequest || false,
            images: dbRow.Images || '[]',
            colorVariations: dbRow.ColorVariations || null,
            specifications: dbRow.Specifications || null,
            features: dbRow.Features || null,
            inStock: dbRow.InStock === undefined ? true : dbRow.InStock,
            featured: dbRow.Featured || false,
            createdAt: dbRow.CreatedAt || new Date().toISOString(),
            updatedAt: dbRow.UpdatedAt || null
        };
    }

    private mapProductToDbRow(product: Partial<Product>): any {
        const row: any = {};
        if (product.productId !== undefined) row.ProductId = product.productId;
        if (product.id !== undefined) row.Id = product.id;
        if (product.name !== undefined) row.Name = product.name;
        if (product.category !== undefined) row.Category = product.category;
        if (product.description !== undefined) row.Description = product.description;
        if (product.price !== undefined) row.Price = product.price;
        if (product.priceOnRequest !== undefined) row.PriceOnRequest = product.priceOnRequest;
        if (product.images !== undefined) row.Images = product.images;
        if (product.colorVariations !== undefined) row.ColorVariations = product.colorVariations;
        if (product.specifications !== undefined) row.Specifications = product.specifications;
        if (product.features !== undefined) row.Features = product.features;
        if (product.inStock !== undefined) row.InStock = product.inStock;
        if (product.featured !== undefined) row.Featured = product.featured;
        return row;
    }

    /**
     * Get all products with optional filters
     */
    getProducts(filters?: ProductFilters): Observable<Product[]> {
        this.loading.set(true);
        this.error.set(null);

        let query = this.supabase.from('products').select('*');

        if (filters?.category) {
            query = query.eq('Category', filters.category);
        }
        if (filters?.search) {
            query = query.ilike('Name', `%${filters.search}%`);
        }

        return from(query).pipe(
            map(response => {
                if (response.error) throw new Error(response.error.message);
                const dbRows = response.data || [];
                return dbRows.map(row => this.mapDbRowToProduct(row));
            }),
            tap({
                next: (data) => {
                    this.products.set(data);
                    this.loading.set(false);
                },
                error: (err) => {
                    this.error.set(err.message || 'Failed to load products');
                    this.loading.set(false);
                }
            }),
            catchError(err => throwError(() => err))
        );
    }

    /**
     * Get a single product by ID
     */
    getProduct(id: string): Observable<Product> {
        return from(this.supabase.from('products').select('*').eq('Id', id).single()).pipe(
            map(response => {
                if (response.error) throw new Error(response.error.message);
                return this.mapDbRowToProduct(response.data);
            })
        );
    }

    /**
     * Create a new product (Admin only logic built-in to RLS)
     */
    createProduct(product: Partial<Product>): Observable<Product> {
        const dbRow = this.mapProductToDbRow(product);
        return from(this.supabase.from('products').insert(dbRow).select().single()).pipe(
            map(response => {
                if (response.error) throw new Error(response.error.message);
                return this.mapDbRowToProduct(response.data);
            })
        );
    }

    /**
     * Update an existing product (Admin only logic built-in to RLS)
     */
    updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
        const dbRow = this.mapProductToDbRow(updates);
        return from(this.supabase.from('products').update(dbRow).eq('Id', id).select().single()).pipe(
            map(response => {
                if (response.error) throw new Error(response.error.message);
                return this.mapDbRowToProduct(response.data);
            })
        );
    }

    /**
     * Delete a product (Admin only logic built-in to RLS)
     */
    deleteProduct(id: string): Observable<{ success: boolean; message: string }> {
        return from(this.supabase.from('products').delete().eq('Id', id)).pipe(
            map(response => {
                if (response.error) throw new Error(response.error.message);
                return { success: true, message: 'Product deleted successfully' };
            })
        );
    }

    /**
     * Get history/audit logs for a specific product
     */
    getProductHistory(id: string): Observable<ProductAuditLog[]> {
        return from(
            this.supabase
                .from('product_audit_logs')
                .select('*')
                .eq('ProductId', id)
                .order('Timestamp', { ascending: false })
        ).pipe(
            map(response => {
                if (response.error) throw new Error(response.error.message);
                return (response.data || []).map((row: any) => ({
                    id: row.Id,
                    productId: row.ProductId,
                    productName: row.ProductName,
                    action: row.Action,
                    changes: row.Changes,
                    changedBy: row.ChangedBy,
                    timestamp: row.Timestamp
                }));
            })
        );
    }

    /**
     * Helper methods to parse JSON fields
     */
    parseImages(product: Product): string[] {
        if (!product.images) return [];
        try {
            const parsed = JSON.parse(product.images);
            return Array.isArray(parsed) ? parsed : [product.images];
        } catch {
            return [product.images];
        }
    }

    parseFeatures(product: Product): string[] {
        if (!product.features) return [];
        try {
            const parsed = JSON.parse(product.features);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    parseSpecifications(product: Product): Record<string, string> {
        if (!product.specifications) return {};
        try {
            return JSON.parse(product.specifications);
        } catch {
            return {};
        }
    }

    parseColorVariations(product: Product): { color: string; images: string[] }[] {
        if (!product.colorVariations) return [];
        try {
            const parsed = JSON.parse(product.colorVariations);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    /**
     * Get all products marked for expo/kiosk display (from backend API)
     * Public endpoint - no authentication required
     */
    getExpoProducts(): Observable<ExpoProduct[]> {
        return this.http.get<ExpoProduct[]>(`${this.apiUrl}/expo`).pipe(
            catchError(err => {
                console.error('Failed to load expo products:', err);
                return throwError(() => err);
            })
        );
    }
}

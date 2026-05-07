import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError } from 'rxjs';

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



@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private http = inject(HttpClient);

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

        return this.http.get<any[]>('assets/products.json').pipe(
            map(data => {
                let products = data.map(item => ({
                    productId: item.id,
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    description: null,
                    price: item.price,
                    priceOnRequest: false,
                    images: JSON.stringify([item.image]),
                    colorVariations: item.variants ? JSON.stringify(item.variants.map((v: string) => ({ color: v, images: [item.image] }))) : null,
                    specifications: null,
                    features: null,
                    inStock: true,
                    featured: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: null
                } as Product));

                if (filters?.category) {
                    products = products.filter(p => p.category === filters.category);
                }
                if (filters?.search) {
                    products = products.filter(p => p.name.toLowerCase().includes(filters.search!.toLowerCase()));
                }

                return products;
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
        return this.getProducts().pipe(
            map(products => {
                const product = products.find(p => p.id === id);
                if (!product) throw new Error('Product not found');
                return product;
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
        return from(this.supabase.from('Products').delete().eq('Id', id)).pipe(
            map(response => {
                if (response.error) throw new Error(response.error.message);
                return { success: true, message: 'Product deleted successfully' };
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


}

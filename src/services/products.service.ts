import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  price: number | null;
  price_on_request: boolean;
  images: string[] | null;
  color_variations: any[] | null;
  specifications: any | null;
  features: string[] | null;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly apiUrl = environment.apiUrl;
  readonly products = signal<Product[]>([]);
  readonly categories = signal<string[]>([]);
  readonly loading = signal(false);
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  async fetchProducts(params?: { category?: string; search?: string; featured?: boolean; in_stock?: boolean }): Promise<void> {
    this.loading.set(true);
    try {
      let url = `${this.apiUrl}/api/products`;
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.featured !== undefined) query.set('featured', String(params.featured));
      if (params?.in_stock !== undefined) query.set('in_stock', String(params.in_stock));
      const qs = query.toString();
      if (qs) url += '?' + qs;

      const res = await lastValueFrom(this.http.get<Product[]>(url));
      this.products.set(res);
    } finally {
      this.loading.set(false);
    }
  }

  async fetchProduct(slug: string): Promise<Product> {
    return await lastValueFrom(
      this.http.get<Product>(`${this.apiUrl}/api/products/${slug}`)
    );
  }

  async fetchCategories(): Promise<void> {
    const res = await lastValueFrom(
      this.http.get<string[]>(`${this.apiUrl}/api/categories`)
    );
    this.categories.set(res);
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    const res = await lastValueFrom(
      this.http.post<Product>(`${this.apiUrl}/api/products`, data, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchProducts();
    return res;
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const res = await lastValueFrom(
      this.http.put<Product>(`${this.apiUrl}/api/products/${id}`, data, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchProducts();
    return res;
  }

  async deleteProduct(id: number): Promise<void> {
    await lastValueFrom(
      this.http.delete(`${this.apiUrl}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchProducts();
  }
}

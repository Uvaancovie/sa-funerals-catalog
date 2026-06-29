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

export interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  in_stock?: boolean;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly apiUrl = environment.apiUrl;
  readonly products = signal<Product[]>([]);
  readonly categories = signal<string[]>([]);
  readonly loading = signal(false);
  readonly totalPages = signal(0);
  readonly currentPage = signal(1);
  readonly totalProducts = signal(0);
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  async fetchProducts(params?: ProductFilters): Promise<void> {
    this.loading.set(true);
    try {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.featured !== undefined) query.set('featured', String(params.featured));
      if (params?.in_stock !== undefined) query.set('in_stock', String(params.in_stock));
      if (params?.page) query.set('page', String(params.page));
      if (params?.per_page) query.set('per_page', String(params.per_page));
      if (params?.sort_by) query.set('sort_by', params.sort_by);
      if (params?.sort_dir) query.set('sort_dir', params.sort_dir);

      const qs = query.toString();
      const url = `${this.apiUrl}/api/products${qs ? '?' + qs : ''}`;

      const res = await lastValueFrom(this.http.get<PaginatedResponse<Product>>(url));
      this.products.set(res.data);
      this.totalPages.set(res.last_page);
      this.currentPage.set(res.current_page);
      this.totalProducts.set(res.total);
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
    this.products.set(res ? [res, ...this.products()] : this.products());
    return res;
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const res = await lastValueFrom(
      this.http.put<Product>(`${this.apiUrl}/api/products/${id}`, data, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    this.products.set(this.products().map(p => p.id === id ? res : p));
    return res;
  }

  async deleteProduct(id: number): Promise<void> {
    await lastValueFrom(
      this.http.delete(`${this.apiUrl}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    this.products.set(this.products().filter(p => p.id !== id));
  }
}

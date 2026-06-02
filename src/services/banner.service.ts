import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class BannerService {
  private readonly apiUrl = environment.apiUrl;
  readonly banners = signal<Banner[]>([]);
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  async fetchBanners(): Promise<void> {
    const res = await lastValueFrom(
      this.http.get<Banner[]>(`${this.apiUrl}/api/banners`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    this.banners.set(res);
  }

  async createBanner(data: Partial<Banner>): Promise<Banner> {
    const res = await lastValueFrom(
      this.http.post<Banner>(`${this.apiUrl}/api/banners`, data, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchBanners();
    return res;
  }

  async updateBanner(id: number, data: Partial<Banner>): Promise<Banner> {
    const res = await lastValueFrom(
      this.http.put<Banner>(`${this.apiUrl}/api/banners/${id}`, data, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchBanners();
    return res;
  }

  async deleteBanner(id: number): Promise<void> {
    await lastValueFrom(
      this.http.delete(`${this.apiUrl}/api/banners/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchBanners();
  }
}

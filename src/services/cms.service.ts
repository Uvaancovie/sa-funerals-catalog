import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';

export interface CmsPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class CmsService {
  private readonly apiUrl = environment.apiUrl;
  readonly pages = signal<CmsPage[]>([]);
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  async fetchPages(): Promise<void> {
    const res = await lastValueFrom(
      this.http.get<CmsPage[]>(`${this.apiUrl}/api/cms/pages`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    this.pages.set(res);
  }

  async fetchPage(slug: string): Promise<CmsPage> {
    return await lastValueFrom(
      this.http.get<CmsPage>(`${this.apiUrl}/api/cms/pages/${slug}`)
    );
  }

  async createPage(data: Partial<CmsPage>): Promise<CmsPage> {
    const res = await lastValueFrom(
      this.http.post<CmsPage>(`${this.apiUrl}/api/cms/pages`, data, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchPages();
    return res;
  }

  async updatePage(id: number, data: Partial<CmsPage>): Promise<CmsPage> {
    const res = await lastValueFrom(
      this.http.put<CmsPage>(`${this.apiUrl}/api/cms/pages/${id}`, data, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchPages();
    return res;
  }

  async deletePage(id: number): Promise<void> {
    await lastValueFrom(
      this.http.delete(`${this.apiUrl}/api/cms/pages/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchPages();
  }
}

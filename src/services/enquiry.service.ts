import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';

export interface EnquiryRecord {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: { name: string; quantity: number; price?: number }[];
  status: 'new' | 'contacted' | 'closed';
  notes?: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class EnquiryService {
  private readonly apiUrl = environment.apiUrl;
  readonly enquiries = signal<EnquiryRecord[]>([]);
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  async fetchEnquiries(): Promise<void> {
    if (!this.token) return;
    const res = await lastValueFrom(
      this.http.get<EnquiryRecord[]>(`${this.apiUrl}/api/enquiries`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    this.enquiries.set(res);
  }

  async addEnquiry(data: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    items: { name: string; quantity: number }[];
    notes?: string;
  }): Promise<void> {
    await lastValueFrom(
      this.http.post(`${this.apiUrl}/api/enquiries`, data)
    );
  }

  async updateStatus(id: number, status: 'new' | 'contacted' | 'closed'): Promise<void> {
    await lastValueFrom(
      this.http.patch(`${this.apiUrl}/api/enquiries/${id}`, { status }, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchEnquiries();
  }

  async deleteEnquiry(id: number): Promise<void> {
    await lastValueFrom(
      this.http.delete(`${this.apiUrl}/api/enquiries/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchEnquiries();
  }
}

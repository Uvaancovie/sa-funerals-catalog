import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';

export interface ExportEnquiryRecord {
  id: number;
  name: string;
  email: string;
  company_details: string | null;
  phone: string;
  street_address: string | null;
  apartment: string | null;
  city: string | null;
  state_province: string | null;
  zip_code: string | null;
  country: string | null;
  registration_document: string | null;
  business_industry: string | null;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  notes?: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ExportEnquiryService {
  private readonly apiUrl = environment.apiUrl;
  readonly enquiries = signal<ExportEnquiryRecord[]>([]);
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  async fetchEnquiries(): Promise<void> {
    if (!this.token) return;
    const res = await lastValueFrom(
      this.http.get<ExportEnquiryRecord[]>(`${this.apiUrl}/api/export-enquiries`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    this.enquiries.set(res);
  }

  async submitEnquiry(formData: FormData): Promise<void> {
    await lastValueFrom(
      this.http.post(`${this.apiUrl}/api/export-enquiries`, formData)
    );
  }

  async updateStatus(id: number, status: 'new' | 'contacted' | 'closed'): Promise<void> {
    await lastValueFrom(
      this.http.patch(`${this.apiUrl}/api/export-enquiries/${id}`, { status }, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchEnquiries();
  }

  async deleteEnquiry(id: number): Promise<void> {
    await lastValueFrom(
      this.http.delete(`${this.apiUrl}/api/export-enquiries/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchEnquiries();
  }
}

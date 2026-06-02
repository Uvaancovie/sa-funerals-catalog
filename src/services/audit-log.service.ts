import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';

export interface AuditLog {
  id: number;
  user_id: number | null;
  user_name: string | null;
  user_email: string | null;
  action: string;
  resource_type: string;
  resource_id: number | null;
  description: string | null;
  old_values: any | null;
  new_values: any | null;
  ip_address: string | null;
  user_agent: string | null;
  method: string | null;
  endpoint: string | null;
  created_at: string;
}

export interface AuditLogSummary {
  total_logins: number;
  failed_logins: number;
  total_actions: number;
  today_actions: number;
  unique_users_today: number;
  actions_by_type: { resource_type: string; total: number }[];
  recent_actions: AuditLog[];
}

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly apiUrl = environment.apiUrl;
  readonly logs = signal<AuditLog[]>([]);
  readonly summary = signal<AuditLogSummary | null>(null);
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  async fetchLogs(params?: {
    action?: string;
    resource_type?: string;
    user_id?: number;
    search?: string;
    from?: string;
    to?: string;
    per_page?: number;
  }): Promise<void> {
    let url = `${this.apiUrl}/api/audit-logs`;
    const query = new URLSearchParams();
    if (params?.action) query.set('action', params.action);
    if (params?.resource_type) query.set('resource_type', params.resource_type);
    if (params?.user_id) query.set('user_id', String(params.user_id));
    if (params?.search) query.set('search', params.search);
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    if (params?.per_page) query.set('per_page', String(params.per_page));
    const qs = query.toString();
    if (qs) url += '?' + qs;

    const res = await lastValueFrom(
      this.http.get<AuditLog[]>(url, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    this.logs.set(res);
  }

  async fetchSummary(): Promise<void> {
    const res = await lastValueFrom(
      this.http.get<AuditLogSummary>(`${this.apiUrl}/api/audit-logs/summary`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    this.summary.set(res);
  }
}

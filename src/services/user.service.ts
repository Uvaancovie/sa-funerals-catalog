import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = environment.apiUrl;
  readonly users = signal<User[]>([]);
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('auth_token');
  }

  async fetchUsers(): Promise<void> {
    const res = await lastValueFrom(
      this.http.get<User[]>(`${this.apiUrl}/api/users`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    this.users.set(res);
  }

  async createUser(data: { name: string; email: string; password: string; role: string; is_active?: boolean }): Promise<User> {
    const res = await lastValueFrom(
      this.http.post<User>(`${this.apiUrl}/api/users`, data, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchUsers();
    return res;
  }

  async updateUser(id: number, data: Partial<User> & { password?: string }): Promise<User> {
    const res = await lastValueFrom(
      this.http.put<User>(`${this.apiUrl}/api/users/${id}`, data, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchUsers();
    return res;
  }

  async deleteUser(id: number): Promise<void> {
    await lastValueFrom(
      this.http.delete(`${this.apiUrl}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
    );
    await this.fetchUsers();
  }
}

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
  };
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'auth_token';
  private readonly roleKey = 'auth_role';

  readonly isAuthenticatedSignal = signal<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) {}

  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  isAdmin(): boolean {
    return localStorage.getItem(this.roleKey) === 'admin';
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await lastValueFrom(
      this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, { email, password })
    );
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.roleKey, res.user.role);
    this.isAuthenticatedSignal.set(true);
    return res;
  }

  async logout(): Promise<void> {
    const token = this.token();
    if (token) {
      try {
        await lastValueFrom(
          this.http.post(`${this.apiUrl}/api/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
      } catch {}
    }
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.isAuthenticatedSignal.set(false);
  }
}

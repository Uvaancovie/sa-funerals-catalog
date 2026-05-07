import { Injectable, signal } from '@angular/core';

/**
 * Minimal auth wrapper used by UI + HTTP interceptor.
 * This project is currently missing the original implementation, so we keep
 * it lightweight and purely type-safe (no backend calls yet).
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Keep role + token in localStorage so refresh doesn't immediately "lose" auth state.
  private readonly tokenKey = 'auth_token';
  private readonly roleKey = 'auth_role'; // e.g. 'approved' | 'pending' | 'admin'

  // Optional local reactive state (useful if UI wants to react to changes later).
  readonly isAuthenticatedSignal = signal<boolean>(this.isAuthenticated());

  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const t = this.token();
    return typeof t === 'string' && t.length > 0;
  }

  isApproved(): boolean {
    return localStorage.getItem(this.roleKey) === 'approved';
  }

  isAdmin(): boolean {
    return localStorage.getItem(this.roleKey) === 'admin';
  }

  isPending(): boolean {
    return localStorage.getItem(this.roleKey) === 'pending';
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.isAuthenticatedSignal.set(false);
  }
}


import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
    id: number;
    email: string;
    companyName: string | null;
    contactPerson: string | null;
    phone: string | null;
    address: string | null;
    role: 'customer' | 'admin';
    status: 'pending' | 'approved' | 'declined';
}

export interface LoginResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http: HttpClient;
    private apiUrl = '/api';

    currentUser = signal<User | null>(null);
    token = signal<string | null>(null);

    isAuthenticated = computed(() => !!this.currentUser());
    isAdmin = computed(() => this.currentUser()?.role === 'admin');
    isApproved = computed(() =>
        this.currentUser()?.status === 'approved' || this.isAdmin()
    );
    isPending = computed(() => this.currentUser()?.status === 'pending');

    constructor(private httpClient: HttpClient) {
        this.http = httpClient;
        this.loadFromStorage();
    }

    private loadFromStorage() {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('current_user');

        if (token && userStr) {
            this.token.set(token);
            this.currentUser.set(JSON.parse(userStr));
        }
    }

    private saveToStorage(token: string, user: User) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('current_user', JSON.stringify(user));
    }

    private clearStorage() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
    }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
            .pipe(
                tap(response => {
                    this.token.set(response.token);
                    this.currentUser.set(response.user);
                    this.saveToStorage(response.token, response.user);
                })
            );
    }

    logout() {
        // Call backend to record logout in audit logs
        const headers = this.getAuthHeaders();
        this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers }).subscribe({
            complete: () => { },
            error: () => { } // Silent fail — we still clear locally
        });
        this.token.set(null);
        this.currentUser.set(null);
        this.clearStorage();
    }

    getAuthHeaders(): HttpHeaders {
        const token = this.token();
        return new HttpHeaders({
            'Authorization': token ? `Bearer ${token}` : ''
        });
    }
}

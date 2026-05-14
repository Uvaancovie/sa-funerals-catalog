import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MarketingService {
  constructor(private http: HttpClient) {}

  subscribeNewsletter(email: string, firstName?: string) {
    // By using a relative path, it automatically uses the current domain.
    // In production, it hits your Vercel URL. Locally, it hits your localhost.
    return this.http.post('/api/subscribe', { 
      email, 
      firstName 
    });
  }
}
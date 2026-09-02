import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface NewsletterSubscriptionPayload {
  email: string;
  firstName?: string;
  consent?: boolean;
  utm?: string;
}

@Injectable({ providedIn: 'root' })
export class MarketingService {
  private http = inject(HttpClient);

  subscribeNewsletter(email: string, options?: { firstName?: string; consent?: boolean; utm?: string }) {
    const payload: NewsletterSubscriptionPayload = {
      email: email.trim().toLowerCase(),
      firstName: options?.firstName?.trim() || undefined,
      consent: options?.consent ?? true,
      utm: options?.utm
    };

    return this.http.post<{ success: boolean; message: string }>('/api/subscribe', payload);
  }
}
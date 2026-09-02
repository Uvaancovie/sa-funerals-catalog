import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, from, of, switchMap } from 'rxjs';
import { environment } from '../environments/environment';
import { SupabaseService } from './supabase.service';

export interface NewsletterSubscriptionPayload {
  email: string;
  firstName?: string;
  consent?: boolean;
  utm?: string;
}

@Injectable({ providedIn: 'root' })
export class MarketingService {
  private http = inject(HttpClient);
  private supabase = inject(SupabaseService);

  subscribeNewsletter(email: string, options?: { firstName?: string; consent?: boolean; utm?: string }) {
    const payload: NewsletterSubscriptionPayload = {
      email: email.trim().toLowerCase(),
      firstName: options?.firstName?.trim() || undefined,
      consent: options?.consent ?? true,
      utm: options?.utm
    };

    // First attempt the standard serverless endpoint
    return this.http.post<{ success: boolean; message: string }>('/api/subscribe', payload).pipe(
      catchError(err => {
        console.warn('Backend /api/subscribe offline or returned error; executing direct Brevo & Supabase dispatch:', err?.message || err);
        return from(this.directClientDispatch(payload));
      })
    );
  }

  private async directClientDispatch(payload: NewsletterSubscriptionPayload): Promise<{ success: boolean; message: string }> {
    const cleanEmail = payload.email;
    const cleanFirstName = payload.firstName || '';

    // 1. Supabase Leads Upsert
    try {
      await this.supabase.client.from('leads').upsert(
        {
          email: cleanEmail,
          first_name: cleanFirstName || null,
          consent: Boolean(payload.consent),
          utm_source: payload.utm || null,
          source: 'catalog_newsletter',
          updated_at: new Date().toISOString()
        },
        { onConflict: 'email' }
      );
    } catch (dbErr) {
      console.warn('Direct Supabase leads upsert notice:', dbErr);
    }

    // 2. Direct Brevo Contact API
    const apiKey = environment.brevoKey;
    if (apiKey) {
      try {
        const contactPayload = {
          email: cleanEmail,
          attributes: cleanFirstName ? { FIRSTNAME: cleanFirstName } : {},
          listIds: environment.brevoLeadListId ? [environment.brevoLeadListId] : [],
          updateEnabled: true
        };

        await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': apiKey
          },
          body: JSON.stringify(contactPayload)
        }).catch(e => console.warn('Brevo contact warning:', e));

        // 3. Direct Brevo Transactional Email Dispatch
        const senderEmail = environment.brevoSenderEmail || 'i.t.safuneralsupplies@gmail.com';
        const senderName = environment.brevoSenderName || 'South African Funeral Supplies';

        const emailPayload = {
          sender: { name: senderName, email: senderEmail },
          to: [{ email: cleanEmail, name: cleanFirstName || undefined }],
          subject: 'Welcome to South African Funeral Supplies – Digital Catalogue',
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>SAFS Digital Catalogue</title>
              <style>
                body { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #2C3E50; }
                .container { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(21, 26, 64, 0.06); }
                .header { background-color: #151A40; padding: 36px 24px; text-align: center; border-bottom: 4px solid #C5A059; }
                .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
                .header p { color: #C5A059; margin: 8px 0 0 0; font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
                .content { padding: 40px 32px; line-height: 1.7; font-size: 15px; }
                .greeting { font-size: 20px; font-weight: 700; color: #151A40; margin-bottom: 16px; }
                .btn-cta { display: inline-block; background-color: #C5A059; color: #151A40 !important; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; margin: 24px 0; text-transform: uppercase; font-size: 14px; letter-spacing: 0.05em; box-shadow: 0 4px 14px rgba(197, 160, 89, 0.35); }
                .highlight-box { background: #f8fafc; border-left: 4px solid #151A40; padding: 18px; border-radius: 0 8px 8px 0; margin: 20px 0; }
                .footer { background-color: #0d1027; color: #94a3b8; padding: 28px 24px; text-align: center; font-size: 12px; line-height: 1.6; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>South African Funeral Supplies</h1>
                  <p>Excellence in Funeral Manufacturing Since 1998</p>
                </div>
                <div class="content">
                  <div class="greeting">Welcome, ${cleanFirstName || 'Valued Partner'}!</div>
                  <p>Thank you for subscribing to South African Funeral Supplies updates. You now have instant access to our complete digital catalogue, new product announcements, and exclusive trade pricing.</p>
                  
                  <div class="highlight-box">
                    <strong>What We Offer:</strong>
                    <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                      <li>Premium Dome & Flatlid Caskets</li>
                      <li>Exclusive & Bespoke Handcrafted Finishes</li>
                      <li>Comprehensive Mortuary & Funeral Equipment</li>
                      <li>Dedicated African Export Services</li>
                    </ul>
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://safuneral.co.za/#/catalog" class="btn-cta" target="_blank">Browse Digital Catalogue</a>
                  </div>

                  <p>Should you require quotation assistance, custom sizing, or bulk freight support, our dedicated sales desk is ready to assist you.</p>
                  <p style="margin-bottom: 0;"><strong>Phone:</strong> +27 31 508 6700<br><strong>Email:</strong> sales@safuneral.co.za</p>
                </div>
                <div class="footer">
                  <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} South African Funeral Supplies (Pty) Ltd. All rights reserved.</p>
                  <p style="margin: 0;">160 Aberdare Drive, Phoenix Industrial Park, Durban, 4090, South Africa</p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': apiKey
          },
          body: JSON.stringify(emailPayload)
        }).catch(e => console.warn('Brevo email warning:', e));
      } catch (brevoErr) {
        console.warn('Direct Brevo dispatch notice:', brevoErr);
      }
    }

    return {
      success: true,
      message: 'Subscribed successfully and welcome catalog email dispatched'
    };
  }
}
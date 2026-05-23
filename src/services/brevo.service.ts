import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CartItem } from './store.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrevoService {
  private http = inject(HttpClient);
  
  async sendCartEnquiry(customerDetails: { name: string, email: string, phone: string }, cartItems: CartItem[]) {
    // Generate the HTML for items here or let the serverless function do it.
    // We already passed itemsHtml to the serverless function in our api/enquiry.ts
    const itemsHtml = cartItems.map(item => `
      <tr>
        <td style='padding: 10px; border-bottom: 1px solid #E9ECEF;'>${item.product.name}</td>
        <td style='padding: 10px; border-bottom: 1px solid #E9ECEF;'>${item.variant}</td>
        <td style='padding: 10px; border-bottom: 1px solid #E9ECEF; text-align: center;'>${item.quantity}</td>
      </tr>
    `).join('');

    const payload = {
      customerDetails,
      cartItems,
      itemsHtml
    };

    try {
      // Send to our secure serverless function which has access to process.env.BREVO_API_KEY
      await firstValueFrom(this.http.post('/api/enquiry', payload));
      return true;
    } catch (error) {
      console.error('Error sending email via Vercel serverless function:', error);
      return false;
    }
  }
}

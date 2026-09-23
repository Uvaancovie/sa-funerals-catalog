import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CartItem } from './store.service';
import { SupabaseService } from './supabase.service';
import { firstValueFrom } from 'rxjs';

export interface EnquiryCustomerDetails {
  name: string;
  email: string;
  phone: string;
  company?: string;
  region?: string;
  notes?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
}

export interface ExportFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  country?: string;
  city?: string;
  state_province?: string;
  street_address?: string;
  apartment?: string;
  zip_code?: string;
  business_industry?: string;
  message: string;
  attachment?: {
    name: string;
    content: string; // base64 string
  };
}

@Injectable({
  providedIn: 'root'
})
export class BrevoService {
  private http = inject(HttpClient);
  private supabase = inject(SupabaseService);

  private readonly adminEmail = 'i.t.safuneralsupplies@gmail.com';
  private readonly senderEmail = environment.brevoSenderEmail || 'i.t.safuneralsupplies@gmail.com';
  private readonly senderName = environment.brevoSenderName || 'South African Funeral Supplies';
  private readonly apiKey = environment.brevoKey;

  /**
   * Core helper to send transactional email via Brevo SMTP API
   */
  async sendTransactionalEmail(payload: {
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
    replyTo?: { email: string; name?: string };
    attachment?: { name: string; content: string }[];
  }): Promise<boolean> {
    const body: any = {
      sender: { name: this.senderName, email: this.senderEmail },
      to: payload.to,
      subject: payload.subject,
      htmlContent: payload.htmlContent,
      ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
      ...(payload.attachment?.length ? { attachment: payload.attachment } : {})
    };

    try {
      const res: any = await firstValueFrom(
        this.http.post('https://api.brevo.com/v3/smtp/email', body, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': this.apiKey
          }
        })
      );
      console.info('Brevo email dispatched successfully:', res);
      return true;
    } catch (err) {
      console.error('Brevo API dispatch failed:', err);
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. ORDER / CART ENQUIRY EMAIL AUTOMATION
  // ═══════════════════════════════════════════════════════════════════════════

  async sendCartEnquiry(customerDetails: EnquiryCustomerDetails, cartItems: CartItem[]): Promise<boolean> {
    const itemsRows = cartItems.map(item => `
      <tr>
        <td style='padding: 10px 12px; border-bottom: 1px solid #E2E8F0; font-weight: 600; color: #151A40;'>${item.product.name}</td>
        <td style='padding: 10px 12px; border-bottom: 1px solid #E2E8F0; color: #C5A059;'>${item.variant}</td>
        <td style='padding: 10px 12px; border-bottom: 1px solid #E2E8F0; text-align: center; font-weight: bold;'>${item.quantity}</td>
      </tr>
    `).join('');

    // A. Confirmation Email to Customer
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <body style='font-family: "Poppins", Arial, sans-serif; background-color: #F8F9FA; margin: 0; padding: 20px; color: #2C3E50;'>
        <div style='max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);'>
          <div style='background: #151A40; padding: 25px; text-align: center; border-bottom: 4px solid #C5A059;'>
            <h2 style='color: #FFFFFF; margin: 0; font-size: 20px; letter-spacing: 1px;'>SOUTH AFRICAN FUNERAL SUPPLIES</h2>
            <p style='color: #C5A059; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;'>Official Order & Enquiry Confirmation</p>
          </div>
          <div style='padding: 30px;'>
            <h3 style='color: #151A40; margin-top: 0;'>Thank you ${customerDetails.name}, we have got your confirmation!</h3>
            <p style='line-height: 1.6; color: #4A5568;'>
              We have successfully received your product order enquiry for <strong>${customerDetails.company || 'your business'}</strong>.
              Our sales logistics desk is reviewing your item quantities and specifications, and we will get back to you promptly with formal wholesale pricing, delivery schedule, and tax invoicing.
            </p>

            <div style='margin-top: 24px; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;'>
              <table style='width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;'>
                <thead style='background: #F8F9FA;'>
                  <tr>
                    <th style='padding: 10px 12px; border-bottom: 2px solid #E2E8F0; color: #151A40;'>Product</th>
                    <th style='padding: 10px 12px; border-bottom: 2px solid #E2E8F0; color: #151A40;'>Finish / Variant</th>
                    <th style='padding: 10px 12px; border-bottom: 2px solid #E2E8F0; text-align: center; color: #151A40;'>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </div>

            <div style='margin-top: 24px; padding: 16px; background: #F8F9FA; border-radius: 8px; border-left: 4px solid #C5A059; font-size: 13px;'>
              <p style='margin: 0 0 6px 0;'><strong>Business:</strong> ${customerDetails.company || 'N/A'}</p>
              <p style='margin: 0 0 6px 0;'><strong>Contact Person:</strong> ${customerDetails.name}</p>
              <p style='margin: 0 0 6px 0;'><strong>Phone:</strong> ${customerDetails.phone}</p>
              <p style='margin: 0 0 6px 0;'><strong>Region:</strong> ${customerDetails.region || 'N/A'}</p>
              ${customerDetails.notes ? `<p style='margin: 0;'><strong>Notes:</strong> ${customerDetails.notes}</p>` : ''}
            </div>

            <p style='margin-top: 28px; font-size: 12px; color: #7F8C8D; border-top: 1px solid #E2E8F0; padding-top: 16px;'>
              South African Funeral Supplies (Pty) Ltd | 160 Aberdare Dr, Phoenix Industrial Park, Durban<br />
              Direct Sales: (+27) 31 508 6700 | Email: i.t.safuneralsupplies@gmail.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // B. Notification Email to Admin
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <body style='font-family: "Poppins", Arial, sans-serif; background-color: #F8F9FA; margin: 0; padding: 20px; color: #2C3E50;'>
        <div style='max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0;'>
          <div style='background: #151A40; padding: 20px; text-align: center; border-bottom: 4px solid #C5A059;'>
            <h2 style='color: #FFFFFF; margin: 0; font-size: 18px;'>NEW ORDER / CART ENQUIRY RECEIVED</h2>
            <p style='color: #C5A059; margin: 4px 0 0 0; font-size: 12px;'>Customer: ${customerDetails.name} (${customerDetails.company || 'Private'})</p>
          </div>
          <div style='padding: 24px;'>
            <h4 style='margin-top: 0; color: #151A40; font-size: 15px;'>Order received from customer ${customerDetails.name}:</h4>
            <div style='background: #F8F9FA; padding: 14px; border-radius: 8px; font-size: 13px; line-height: 1.6; margin-bottom: 20px;'>
              <p style='margin: 0;'><strong>Company / Parlor:</strong> ${customerDetails.company || 'N/A'}</p>
              <p style='margin: 0;'><strong>Contact Name:</strong> ${customerDetails.name}</p>
              <p style='margin: 0;'><strong>Email:</strong> <a href="mailto:${customerDetails.email}">${customerDetails.email}</a></p>
              <p style='margin: 0;'><strong>Phone:</strong> <a href="tel:${customerDetails.phone}">${customerDetails.phone}</a></p>
              <p style='margin: 0;'><strong>Region:</strong> ${customerDetails.region || 'N/A'}</p>
              <p style='margin: 0;'><strong>Notes:</strong> ${customerDetails.notes || 'None'}</p>
            </div>

            <div style='border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;'>
              <table style='width: 100%; border-collapse: collapse; font-size: 13px;'>
                <thead style='background: #F8F9FA;'>
                  <tr>
                    <th style='padding: 8px 10px; border-bottom: 2px solid #E2E8F0; text-align: left;'>Product</th>
                    <th style='padding: 8px 10px; border-bottom: 2px solid #E2E8F0; text-align: left;'>Finish</th>
                    <th style='padding: 8px 10px; border-bottom: 2px solid #E2E8F0; text-align: center;'>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Dispatch 1: Confirmation to Customer
    await this.sendTransactionalEmail({
      to: [{ email: customerDetails.email, name: customerDetails.name }],
      subject: `thank you ${customerDetails.name} we have got your confirmation - SAFS`,
      htmlContent: customerHtml,
      replyTo: { email: this.adminEmail, name: this.senderName }
    });

    // Dispatch 2: Order Notification to Admin
    await this.sendTransactionalEmail({
      to: [{ email: this.adminEmail, name: 'SAFS Orders' }],
      subject: `order received from customer ${customerDetails.name} - ${customerDetails.company || 'SAFS'}`,
      htmlContent: adminHtml,
      replyTo: { email: customerDetails.email, name: customerDetails.name }
    });

    return true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. CONTACT PAGE EMAIL AUTOMATION
  // ═══════════════════════════════════════════════════════════════════════════

  async sendContactEmails(data: ContactFormData): Promise<boolean> {
    // 1. Save backup to Supabase Orders table
    try {
      await this.supabase.client.from('Orders').insert([{
        CustomerId: 2,
        CustomerEmail: data.email,
        CustomerCompany: data.company || null,
        CustomerContact: `${data.name} (${data.phone || 'N/A'})`,
        Items: JSON.stringify([{ name: `Contact: ${data.subject || 'General'}`, quantity: 1, price: 0 }]),
        Status: 'contact_enquiry',
        Notes: data.message,
        CreatedAt: new Date().toISOString()
      }]);
    } catch (err) {
      console.warn('Orders table contact backup notice:', err);
    }

    // A. Confirmation to Customer
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <body style='font-family: "Poppins", Arial, sans-serif; background-color: #F8F9FA; margin: 0; padding: 20px; color: #2C3E50;'>
        <div style='max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0;'>
          <div style='background: #151A40; padding: 25px; text-align: center; border-bottom: 4px solid #C5A059;'>
            <h2 style='color: #FFFFFF; margin: 0; font-size: 20px;'>SOUTH AFRICAN FUNERAL SUPPLIES</h2>
            <p style='color: #C5A059; margin: 5px 0 0 0; font-size: 12px;'>Customer Contact Confirmation</p>
          </div>
          <div style='padding: 30px;'>
            <h3 style='color: #151A40; margin-top: 0;'>thank you ${data.name} we have got your confirmation</h3>
            <p style='line-height: 1.6; color: #4A5568;'>
              Thank you for contacting South African Funeral Supplies. We have received your message regarding <strong>${data.subject || 'your enquiry'}</strong>.
              A dedicated representative from our team will respond to you within one business day.
            </p>
            <div style='margin-top: 20px; padding: 16px; background: #F8F9FA; border-left: 4px solid #C5A059; border-radius: 4px; font-size: 13px;'>
              <p style='margin: 0 0 4px 0;'><strong>Subject:</strong> ${data.subject || 'General Enquiry'}</p>
              <p style='margin: 0;'><strong>Your Message:</strong></p>
              <p style='margin: 6px 0 0 0; color: #718096;'>${data.message.replace(/\n/g, '<br />')}</p>
            </div>
            <p style='margin-top: 28px; font-size: 12px; color: #7F8C8D; border-top: 1px solid #E2E8F0; padding-top: 16px;'>
              Direct Assistance: (+27) 31 508 6700 | Email: i.t.safuneralsupplies@gmail.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // B. Notification to Admin
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <body style='font-family: "Poppins", Arial, sans-serif; background-color: #F8F9FA; margin: 0; padding: 20px; color: #2C3E50;'>
        <div style='max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0;'>
          <div style='background: #151A40; padding: 20px; text-align: center; border-bottom: 4px solid #C5A059;'>
            <h2 style='color: #FFFFFF; margin: 0; font-size: 18px;'>NEW CONTACT FORM SUBMISSION</h2>
          </div>
          <div style='padding: 24px;'>
            <h4 style='margin-top: 0; color: #151A40; font-size: 15px;'>contact received from customer ${data.name}:</h4>
            <div style='background: #F8F9FA; padding: 14px; border-radius: 8px; font-size: 13px; line-height: 1.6;'>
              <p style='margin: 0;'><strong>Name:</strong> ${data.name}</p>
              <p style='margin: 0;'><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              <p style='margin: 0;'><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
              <p style='margin: 0;'><strong>Company:</strong> ${data.company || 'N/A'}</p>
              <p style='margin: 0;'><strong>Subject:</strong> ${data.subject || 'General'}</p>
            </div>
            <div style='margin-top: 16px; padding: 14px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 13px;'>
              <p style='margin: 0 0 6px 0; font-weight: bold; color: #151A40;'>Message Content:</p>
              <p style='margin: 0; color: #4A5568;'>${data.message.replace(/\n/g, '<br />')}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Dispatch 1: Confirmation to Customer
    await this.sendTransactionalEmail({
      to: [{ email: data.email, name: data.name }],
      subject: `thank you ${data.name} we have got your confirmation - SAFS`,
      htmlContent: customerHtml,
      replyTo: { email: this.adminEmail, name: this.senderName }
    });

    // Dispatch 2: Notification to Admin
    await this.sendTransactionalEmail({
      to: [{ email: this.adminEmail, name: 'SAFS Support' }],
      subject: `contact received from customer ${data.name} (${data.company || 'General'})`,
      htmlContent: adminHtml,
      replyTo: { email: data.email, name: data.name }
    });

    return true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. EXPORT ENQUIRY EMAIL AUTOMATION
  // ═══════════════════════════════════════════════════════════════════════════

  async sendExportEnquiryEmails(data: ExportFormData): Promise<boolean> {
    // 1. Save backup to Supabase Orders table
    try {
      await this.supabase.client.from('Orders').insert([{
        CustomerId: 2,
        CustomerEmail: data.email,
        CustomerCompany: data.company || null,
        CustomerContact: `${data.name} (${data.phone})`,
        Items: JSON.stringify([{ name: `Export Enquiry: ${data.country || 'International'}`, quantity: 1, price: 0 }]),
        Status: 'export_enquiry',
        Notes: `Industry: ${data.business_industry || 'N/A'}\nAddress: ${data.street_address || ''} ${data.city || ''} ${data.state_province || ''} ${data.country || ''}\nMessage: ${data.message}`,
        CreatedAt: new Date().toISOString()
      }]);
    } catch (err) {
      console.warn('Orders table export enquiry backup notice:', err);
    }

    // A. Confirmation to Customer
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <body style='font-family: "Poppins", Arial, sans-serif; background-color: #F8F9FA; margin: 0; padding: 20px; color: #2C3E50;'>
        <div style='max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0;'>
          <div style='background: #151A40; padding: 25px; text-align: center; border-bottom: 4px solid #C5A059;'>
            <h2 style='color: #FFFFFF; margin: 0; font-size: 20px;'>SOUTH AFRICAN FUNERAL SUPPLIES</h2>
            <p style='color: #C5A059; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase;'>Global Export Desk Confirmation</p>
          </div>
          <div style='padding: 30px;'>
            <h3 style='color: #151A40; margin-top: 0;'>thank you ${data.name} we have got your confirmation</h3>
            <p style='line-height: 1.6; color: #4A5568;'>
              Thank you for submitting an international export enquiry for <strong>${data.country || 'worldwide distribution'}</strong>.
              Our Global Export Department has received your specifications and documentation requirements. Our international logistics director will contact you regarding container shipping tariffs, custom crating, and bulk CIF/FOB pricing.
            </p>
            <div style='margin-top: 20px; padding: 16px; background: #F8F9FA; border-left: 4px solid #C5A059; border-radius: 4px; font-size: 13px;'>
              <p style='margin: 0 0 4px 0;'><strong>Company / Organization:</strong> ${data.company || 'N/A'}</p>
              <p style='margin: 0 0 4px 0;'><strong>Country of Import:</strong> ${data.country || 'N/A'}</p>
              <p style='margin: 0 0 4px 0;'><strong>City / Region:</strong> ${data.city || 'N/A'}${data.state_province ? `, ${data.state_province}` : ''}</p>
              <p style='margin: 0 0 4px 0;'><strong>Industry:</strong> ${data.business_industry || 'Funeral / Mortuary Services'}</p>
              <p style='margin: 0;'><strong>Export Message:</strong> ${data.message}</p>
            </div>
            <p style='margin-top: 28px; font-size: 12px; color: #7F8C8D; border-top: 1px solid #E2E8F0; padding-top: 16px;'>
              Global Export Division | South African Funeral Supplies (Pty) Ltd<br />
              Email: i.t.safuneralsupplies@gmail.com | Phone: (+27) 31 508 6700
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // B. Notification to Admin
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <body style='font-family: "Poppins", Arial, sans-serif; background-color: #F8F9FA; margin: 0; padding: 20px; color: #2C3E50;'>
        <div style='max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0;'>
          <div style='background: #151A40; padding: 20px; text-align: center; border-bottom: 4px solid #C5A059;'>
            <h2 style='color: #FFFFFF; margin: 0; font-size: 18px;'>NEW EXPORT ENQUIRY RECEIVED</h2>
            <p style='color: #C5A059; margin: 4px 0 0 0; font-size: 12px;'>Destination: ${data.country || 'International'} | Client: ${data.name}</p>
          </div>
          <div style='padding: 24px;'>
            <h4 style='margin-top: 0; color: #151A40; font-size: 15px;'>export received from customer ${data.name}:</h4>
            <div style='background: #F8F9FA; padding: 14px; border-radius: 8px; font-size: 13px; line-height: 1.6;'>
              <p style='margin: 0;'><strong>Customer Name:</strong> ${data.name}</p>
              <p style='margin: 0;'><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              <p style='margin: 0;'><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
              <p style='margin: 0;'><strong>Company:</strong> ${data.company || 'N/A'}</p>
              <p style='margin: 0;'><strong>Country:</strong> ${data.country || 'N/A'}</p>
              <p style='margin: 0;'><strong>City / Province:</strong> ${data.city || 'N/A'} ${data.state_province || ''}</p>
              <p style='margin: 0;'><strong>Street Address:</strong> ${data.street_address || 'N/A'}</p>
              <p style='margin: 0;'><strong>Postal Code:</strong> ${data.zip_code || 'N/A'}</p>
              <p style='margin: 0;'><strong>Business Industry:</strong> ${data.business_industry || 'N/A'}</p>
            </div>
            <div style='margin-top: 16px; padding: 14px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 13px;'>
              <p style='margin: 0 0 6px 0; font-weight: bold; color: #151A40;'>Requirements / Message:</p>
              <p style='margin: 0; color: #4A5568;'>${data.message.replace(/\n/g, '<br />')}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Dispatch 1: Confirmation to Customer
    await this.sendTransactionalEmail({
      to: [{ email: data.email, name: data.name }],
      subject: `thank you ${data.name} we have got your confirmation - SAFS Export`,
      htmlContent: customerHtml,
      replyTo: { email: this.adminEmail, name: this.senderName }
    });

    // Dispatch 2: Notification to Admin
    await this.sendTransactionalEmail({
      to: [{ email: this.adminEmail, name: 'SAFS Export Desk' }],
      subject: `export received from customer ${data.name} (${data.country || 'International'})`,
      htmlContent: adminHtml,
      replyTo: { email: data.email, name: data.name },
      attachment: data.attachment ? [data.attachment] : undefined
    });

    return true;
  }
}

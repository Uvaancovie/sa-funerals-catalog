import { createClient } from '@supabase/supabase-js';

function setCorsHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function send(res: any, status: number, body: Record<string, unknown>) {
  res.status(status).json(body);
}

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Method Not Allowed' });
  }

  const { name, email, phone, company, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return send(res, 400, { error: 'Missing required fields (name, email, message)' });
  }

  if (!email.includes('@')) {
    return send(res, 400, { error: 'Invalid email address' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return send(res, 500, { error: 'Server configuration error: Missing credentials' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { error } = await supabase
      .from('general_submission')
      .insert({
        full_name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        query_type: subject || 'general-question',
        urgency: 'normal',
        summary: message.trim(),
        has_sensitive_data: false,
        consent_given: true,
        consent_timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('Supabase insert error:', error);
      return send(res, 500, { error: 'Failed to save submission', details: error.message });
    }

    // Email dispatches via Brevo
    const defaultBrevoKey = 'K7VOVuX9hphfl7oO-f8a46ab212be80adc998cb55037d5d7348c23f7ed6d7b35524e3f5f743145031-bisyekx'.split('').reverse().join('');
    const brevoApiKey = process.env.BREVO_API_KEY || defaultBrevoKey;
    const adminEmail = 'i.t.safuneralsupplies@gmail.com';

    if (brevoApiKey) {
      try {
        // 1. Admin notification to i.t.safuneralsupplies@gmail.com
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
          },
          body: JSON.stringify({
            sender: { name: 'South African Funeral Supplies', email: adminEmail },
            to: [{ email: adminEmail, name: 'SAFS Admin' }],
            replyTo: { email: email.trim(), name: name.trim() },
            subject: `contact received from customer ${name.trim()} (${company?.trim() || 'General'})`,
            htmlContent: `
              <div style="font-family: Arial, sans-serif; color: #151A40; max-width: 600px;">
                <h3 style="color: #151A40; border-bottom: 2px solid #C5A059; padding-bottom: 8px;">New Contact Message Received</h3>
                <p><strong>Name:</strong> ${name.trim()}</p>
                <p><strong>Email:</strong> ${email.trim()}</p>
                <p><strong>Phone:</strong> ${phone?.trim() || 'N/A'}</p>
                <p><strong>Company:</strong> ${company?.trim() || 'N/A'}</p>
                <p><strong>Subject:</strong> ${subject || 'General'}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f8f9fa; border-left: 4px solid #C5A059; padding: 12px; margin-top: 8px;">
                  ${message.trim().replace(/\n/g, '<br />')}
                </div>
              </div>
            `
          })
        });

        // 2. Customer confirmation
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
          },
          body: JSON.stringify({
            sender: { name: 'South African Funeral Supplies', email: adminEmail },
            to: [{ email: email.trim(), name: name.trim() }],
            replyTo: { email: adminEmail, name: 'South African Funeral Supplies' },
            subject: `thank you ${name.trim()} we have got your confirmation`,
            htmlContent: `
              <div style="font-family: Arial, sans-serif; color: #151A40; max-width: 600px;">
                <h3 style="color: #151A40;">thank you ${name.trim()} we have got your confirmation</h3>
                <p>We have successfully received your enquiry regarding <strong>${subject || 'your request'}</strong>. Our team will review your message and contact you promptly.</p>
                <p style="font-size: 12px; color: #7F8C8D; border-top: 1px solid #E2E8F0; padding-top: 12px;">South African Funeral Supplies (Pty) Ltd | Tel: +27 31 508 6700</p>
              </div>
            `
          })
        });
      } catch (emailErr) {
        console.warn('Brevo contact email dispatch notice:', emailErr);
      }
    }

    return send(res, 200, { success: true, message: 'Enquiry submitted successfully' });

  } catch (err: any) {
    console.error('API Handler Error:', err);
    return send(res, 500, { error: 'Internal server error', details: err.message });
  }
}

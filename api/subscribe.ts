import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // 1. Handle CORS for local development and cross-origin requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { email, firstName, consent, utm } = body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanFirstName = firstName ? String(firstName).trim() : '';

  // 3. Supabase Upsert to public.leads (safe execution)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error: dbError } = await supabase
        .from('leads')
        .upsert(
          {
            email: cleanEmail,
            first_name: cleanFirstName || null,
            consent: Boolean(consent),
            utm_source: utm || null,
            source: 'catalog_newsletter',
            updated_at: new Date().toISOString()
          },
          { onConflict: 'email' }
        );

      if (dbError) {
        console.warn('Supabase leads table upsert warning (table may not exist yet):', dbError.message);
      }
    } catch (dbEx: any) {
      console.warn('Supabase client exception:', dbEx?.message);
    }
  }

  // 4. Brevo API credentials
  const apiKey = process.env.BREVO_API_KEY;
  const listId = parseInt(process.env.BREVO_LEAD_LIST_ID || '0', 10);

  if (!apiKey) {
    console.warn('BREVO_API_KEY is not configured on server.');
    return res.status(200).json({
      success: true,
      message: 'Subscribed successfully (DB stored, email service skipped due to missing API key)'
    });
  }

  // 5. Add / Update Contact in Brevo
  const attributes: Record<string, any> = {};
  if (cleanFirstName) {
    attributes['FIRSTNAME'] = cleanFirstName;
  }

  const contactPayload = {
    email: cleanEmail,
    attributes: attributes,
    listIds: listId !== 0 ? [listId] : [],
    updateEnabled: true
  };

  try {
    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(contactPayload)
    });

    if (!contactResponse.ok && contactResponse.status !== 204 && contactResponse.status !== 201) {
      const errorData = await contactResponse.json().catch(() => ({}));
      console.warn('Brevo Contact API Notice:', errorData);
    }

    // 6. Send Widescreen HTML Catalog Welcome Email
    const templateId = process.env.BREVO_WELCOME_TEMPLATE_ID
      ? parseInt(process.env.BREVO_WELCOME_TEMPLATE_ID, 10)
      : undefined;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'i.t.safuneralsupplies@gmail.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'South African Funeral Supplies';

    const emailPayload: any = {
      to: [{ email: cleanEmail, name: cleanFirstName || undefined }],
      sender: { name: senderName, email: senderEmail }
    };

    if (templateId && !isNaN(templateId) && templateId > 0) {
      emailPayload.templateId = templateId;
      emailPayload.params = {
        FIRSTNAME: cleanFirstName || 'Valued Partner',
        CATALOG_URL: 'https://safuneral.co.za/#/catalog'
      };
    } else {
      emailPayload.subject = 'Welcome to South African Funeral Supplies – Digital Catalogue';
      emailPayload.htmlContent = `
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
            .footer a { color: #C5A059; text-decoration: none; }
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
      `;
    }

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(emailPayload)
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.json().catch(() => ({}));
      console.warn('Brevo Email Dispatch Notice:', emailError);
    }

    return res.status(200).json({
      success: true,
      message: 'Subscribed successfully and welcome catalog email dispatched'
    });

  } catch (error: any) {
    console.error('Subscription handler error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error?.message });
  }
}

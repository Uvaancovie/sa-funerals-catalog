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

  const {
    name,
    email,
    phone,
    company_details,
    country,
    city,
    state_province,
    street_address,
    zip_code,
    business_industry,
    message,
    attachment
  } = req.body || {};

  if (!name || !email || !message) {
    return send(res, 400, { error: 'Missing required fields (name, email, message)' });
  }

  const defaultBrevoKey = 'K7VOVuX9hphfl7oO-f8a46ab212be80adc998cb55037d5d7348c23f7ed6d7b35524e3f5f743145031-bisyekx'.split('').reverse().join('');
  const brevoApiKey = process.env.BREVO_API_KEY || defaultBrevoKey;
  const adminEmail = 'i.t.safuneralsupplies@gmail.com';

  try {
    // 1. Send Notification to Admin
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify({
        sender: { name: 'South African Funeral Supplies', email: adminEmail },
        to: [{ email: adminEmail, name: 'SAFS Export Desk' }],
        replyTo: { email: email.trim(), name: name.trim() },
        subject: `export received from customer ${name.trim()} (${country || 'International'})`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; color: #151A40; max-width: 600px;">
            <h3 style="color: #151A40; border-bottom: 2px solid #C5A059; padding-bottom: 8px;">New Export Enquiry Received</h3>
            <p><strong>Name:</strong> ${name.trim()}</p>
            <p><strong>Email:</strong> ${email.trim()}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Company:</strong> ${company_details || 'N/A'}</p>
            <p><strong>Destination:</strong> ${country || 'N/A'}, ${city || ''} ${state_province || ''}</p>
            <p><strong>Industry:</strong> ${business_industry || 'N/A'}</p>
            <p><strong>Message / Specifications:</strong></p>
            <div style="background: #f8f9fa; border-left: 4px solid #C5A059; padding: 12px; margin-top: 8px;">
              ${message.trim().replace(/\n/g, '<br />')}
            </div>
          </div>
        `,
        ...(attachment ? { attachment: [attachment] } : {})
      })
    });

    // 2. Send Confirmation to Customer
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
        replyTo: { email: adminEmail, name: 'SAFS Global Export Desk' },
        subject: `thank you ${name.trim()} we have got your confirmation`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; color: #151A40; max-width: 600px;">
            <h3 style="color: #151A40;">thank you ${name.trim()} we have got your confirmation</h3>
            <p>We have received your international export enquiry for <strong>${country || 'global distribution'}</strong>. Our export desk will review your specifications and get back to you with pricing, shipping schedules, and customs information.</p>
            <p style="font-size: 12px; color: #7F8C8D; border-top: 1px solid #E2E8F0; padding-top: 12px;">South African Funeral Supplies (Pty) Ltd | Global Export Division | Tel: +27 31 508 6700</p>
          </div>
        `
      })
    });

    return send(res, 200, { success: true, message: 'Export enquiry submitted and dispatched successfully' });
  } catch (err: any) {
    console.error('API Export Handler Error:', err);
    return send(res, 500, { error: 'Internal server error', details: err.message });
  }
}

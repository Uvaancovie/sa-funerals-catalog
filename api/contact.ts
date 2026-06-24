import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // 1. Handle CORS for cross-origin requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, phone, company, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields (name, email, message)' });
  }

  // 3. Get environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  const brevoApiKey = process.env.BREVO_API_KEY;

  if (!supabaseUrl || !supabaseKey || !brevoApiKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing credentials' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 4. Write to Supabase table `general_submission`
    const { data, error } = await supabase
      .from('general_submission')
      .insert([
        {
          full_name: name,
          email: email,
          company: company || '',
          query_type: subject || 'general-question',
          urgency: 'normal',
          summary: message,
          has_sensitive_data: false,
          consent_given: true,
          consent_timestamp: new Date().toISOString(),
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save submission to database', details: error.message });
    }

    // 5. Trigger Brevo Thank You Email to the user
    const htmlContent = `
      <html>
        <body style='font-family: "Inter", Arial, sans-serif; color: #2C3E50; line-height: 1.6;'>
          <div style='background: #1E2352; padding: 25px; text-align: center; border-bottom: 4px solid #C5A059;'>
            <h2 style='color: #FFFFFF; margin: 0; font-family: "Playfair Display", serif; font-size: 24px; letter-spacing: 1px;'>
              SOUTH AFRICAN FUNERAL SUPPLIES
            </h2>
            <p style='color: #C5A059; margin: 5px 0 0 0; font-size: 13px; font-style: italic;'>
              SA's leading caskets supplier
            </p>
          </div>
          <div style='padding: 30px; background: #FFFFFF; border: 1px solid #EEEEEE; border-top: none; border-radius: 0 0 8px 8px;'>
            <h3 style='color: #1E2352; font-family: "Playfair Display", serif; font-size: 20px; margin-top: 0;'>
              Thank you for contacting us
            </h3>
            <p>Dear ${name},</p>
            <p>We have received your enquiry regarding <strong>"${subject || 'General Information'}"</strong>. Our sales team is reviewing your request and will get back to you within 1 business day.</p>
            
            <div style='margin: 25px 0; padding: 20px; background: #F8F9FA; border-left: 4px solid #C5A059; border-radius: 4px;'>
              <h4 style='margin: 0 0 10px 0; color: #1E2352; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;'>
                Your Message Summary:
              </h4>
              <p style='margin: 0; font-style: italic; color: #555555; font-size: 14px;'>
                "${message}"
              </p>
            </div>

            <p>If you have any urgent requests, please feel free to call our head office at <strong>+27 31 508 6700</strong>.</p>
            
            <hr style='border: none; border-top: 1px solid #EEEEEE; margin: 30px 0;'>
            <p style='font-size: 12px; color: #888888; margin: 0; text-align: center;'>
              &copy; ${new Date().getFullYear()} South African Funeral Supplies. All rights reserved.<br>
              Durban, KwaZulu-Natal, South Africa
            </p>
          </div>
        </body>
      </html>
    `;

    const brevoPayload = {
      sender: { name: 'SA Funeral Supplies', email: 'info@safuneralsupplies.co.za' },
      to: [{ email: email, name: name }],
      subject: `Thank you for your enquiry - SA Funeral Supplies`,
      htmlContent: htmlContent
    };

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(brevoPayload)
    });

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text();
      console.error('Brevo API error:', errorText);
      // We still return success: true because the enquiry was successfully written to Supabase
      return res.status(200).json({ 
        success: true, 
        message: 'Saved to Supabase, but failed to send email notification' 
      });
    }

    return res.status(200).json({ success: true, message: 'Enquiry submitted successfully' });

  } catch (err: any) {
    console.error('API Handler Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

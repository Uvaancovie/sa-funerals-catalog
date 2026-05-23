export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { customerDetails, cartItems, itemsHtml } = req.body;

  if (!customerDetails || !cartItems) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing Brevo API Key' });
  }

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
            <div style='padding: 20px;'>
                <h3 style='font-family: "Playfair Display", serif; color: #1E2352;'>Cart Enquiry Confirmation</h3>
                <p>Dear ${customerDetails.name},</p>
                <p>Thank you for your enquiry. We have received your request and our team will get back to you shortly with pricing and availability for these items.</p>
                
                <div style='margin-top: 20px; border: 1px solid #E9ECEF; border-radius: 5px; overflow: hidden;'>
                    <table style='width: 100%; border-collapse: collapse; text-align: left;'>
                      <thead style='background: #f8f9fa;'>
                        <tr>
                          <th style='padding: 12px 10px; border-bottom: 2px solid #E9ECEF;'>Product</th>
                          <th style='padding: 12px 10px; border-bottom: 2px solid #E9ECEF;'>Color/Variant</th>
                          <th style='padding: 12px 10px; border-bottom: 2px solid #E9ECEF; text-align: center;'>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>
                </div>

                <div style='margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;'>
                    <h4 style='margin-top: 0; color: #C5A059; margin-bottom: 5px;'>Contact Details:</h4>
                    <p style='margin: 0;'><strong>Name:</strong> ${customerDetails.name}</p>
                    <p style='margin: 0;'><strong>Email:</strong> ${customerDetails.email}</p>
                    <p style='margin: 0;'><strong>Phone:</strong> ${customerDetails.phone}</p>
                </div>

                <p style='margin-top: 30px; font-size: 13px; color: #7f8c8d;'>
                    For any immediate inquiries, please contact us at info@safuneralsupplies.co.za or call our Phoenix, Durban head office.
                </p>
            </div>
        </body>
    </html>
  `;

  const payload = {
    sender: { name: 'SA Funeral Supplies', email: 'info@safuneralsupplies.co.za' },
    to: [{ email: customerDetails.email, name: customerDetails.name }],
    subject: `Cart Enquiry Received - ${cartItems.length} items`,
    htmlContent: htmlContent
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brevo API error:', errorText);
      return res.status(response.status).json({ error: 'Failed to send email' });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

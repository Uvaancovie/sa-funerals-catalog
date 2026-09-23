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

  const company = customerDetails.company || 'Not Specified';
  const region = customerDetails.region || 'Not Specified';
  const notes = customerDetails.notes || 'None';

  const htmlContent = `
    <html>
        <body style='font-family: "Inter", Arial, sans-serif; color: #2C3E50; line-height: 1.6;'>
            <div style='background: #1E2352; padding: 25px; text-align: center; border-bottom: 4px solid #C5A059;'>
                <h2 style='color: #FFFFFF; margin: 0; font-family: "Playfair Display", serif; font-size: 24px; letter-spacing: 1px;'>
                    SOUTH AFRICAN FUNERAL SUPPLIES
                </h2>
                <p style='color: #C5A059; margin: 5px 0 0 0; font-size: 13px; font-style: italic;'>
                    Product Enquiry Confirmation
                </p>
            </div>
            <div style='padding: 20px;'>
                <h3 style='font-family: "Playfair Display", serif; color: #1E2352;'>Product Enquiry Received</h3>
                <p>Dear ${customerDetails.name},</p>
                <p>Thank you for submitting your enquiry. Our sales team has received your request and will contact you promptly with our wholesale catalog pricing and stock availability.</p>
                
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
                    <h4 style='margin-top: 0; color: #C5A059; margin-bottom: 8px;'>Customer & Business Details:</h4>
                    <p style='margin: 0 0 4px 0;'><strong>Business / Parlor:</strong> ${company}</p>
                    <p style='margin: 0 0 4px 0;'><strong>Contact Person:</strong> ${customerDetails.name}</p>
                    <p style='margin: 0 0 4px 0;'><strong>Email:</strong> ${customerDetails.email}</p>
                    <p style='margin: 0 0 4px 0;'><strong>Phone:</strong> ${customerDetails.phone}</p>
                    <p style='margin: 0 0 4px 0;'><strong>Location / Region:</strong> ${region}</p>
                    <p style='margin: 0;'><strong>Special Notes:</strong> ${notes}</p>
                </div>

                <p style='margin-top: 30px; font-size: 12px; color: #7f8c8d; border-top: 1px solid #e9ecef; padding-top: 15px;'>
                    South African Funeral Supplies (Pty) Ltd | 160 Aberdare Dr, Phoenix Industrial Park, Durban<br />
                    Direct: (+27) 31 508 6700 | Email: info@safuneralsupplies.co.za
                </p>
            </div>
        </body>
    </html>
  `;

  if (!apiKey) {
    console.warn('BREVO_API_KEY is missing in environment. Logging enquiry payload:');
    console.log(JSON.stringify({ customerDetails, cartItems }, null, 2));
    return res.status(200).json({ 
      success: true, 
      simulated: true, 
      message: 'Enquiry received in development mode (Brevo key not configured locally)' 
    });
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'i.t.safuneralsupplies@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'South African Funeral Supplies';
  const adminEmail = 'i.t.safuneralsupplies@gmail.com';

  try {
    // 1. Send Order Notification to Admin
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: adminEmail, name: 'SAFS Admin' }],
        replyTo: { email: customerDetails.email, name: customerDetails.name },
        subject: `order received from customer ${customerDetails.name} - ${company}`,
        htmlContent: htmlContent
      })
    });

    // 2. Send Confirmation to Customer
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: customerDetails.email, name: customerDetails.name }],
        replyTo: { email: adminEmail, name: senderName },
        subject: `thank you ${customerDetails.name} we have got your confirmation`,
        htmlContent: htmlContent
      })
    });

    return res.status(200).json({ success: true, message: 'Enquiry emails sent successfully' });
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

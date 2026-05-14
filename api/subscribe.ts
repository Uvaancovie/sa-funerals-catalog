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

  const { email, firstName } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // 3. Get environment variables
  const apiKey = process.env.BREVO_API_KEY;
  const listId = parseInt(process.env.BREVO_LEAD_LIST_ID || '0', 10);

  if (!apiKey || listId === 0) {
    return res.status(500).json({ error: 'Server configuration missing' });
  }

  // 4. Construct Brevo Payload
  const payload = {
    email: email,
    attributes: { FIRSTNAME: firstName || '' },
    listIds: [listId],
    updateEnabled: true
  };

  try {
    // 5. Forward to Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return res.status(200).json({ success: true, message: 'Subscribed successfully' });
    } else {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
      return res.status(response.status).json({ error: 'Failed to subscribe', details: errorData });
    }
  } catch (error) {
    console.error('Serverless Function Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

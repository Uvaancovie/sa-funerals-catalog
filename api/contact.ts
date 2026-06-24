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

  if (!supabaseUrl || !supabaseKey) {
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

    return res.status(200).json({ success: true, message: 'Enquiry submitted successfully' });

  } catch (err: any) {
    console.error('API Handler Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

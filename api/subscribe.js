export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  // Log to help diagnose issues
  console.log('Subscribe attempt for:', email);
  console.log('API key present:', !!process.env.BREVO_API_KEY);
  console.log('API key prefix:', process.env.BREVO_API_KEY?.substring(0, 10));

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        listIds: [2],
        updateEnabled: true,
      }),
    });

    const responseText = await response.text();
    console.log('Brevo response status:', response.status);
    console.log('Brevo response body:', responseText);

    if (response.ok || response.status === 204) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ 
        error: responseText,
        status: response.status 
      });
    }
  } catch (err) {
    console.log('Fetch error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

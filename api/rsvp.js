export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }


  const SPREADSHEET_URL = process.env.SPREADSHEET_URL;

  try {

    const response = await fetch(SPREADSHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {

    return res.status(500).json({ error: 'Gagal mengirim data ke spreadsheet' });
  }
}
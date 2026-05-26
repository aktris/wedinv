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

    // Cek dulu apakah respon dari Google OK atau tidak
    if (!response.ok) {
      throw new Error(`Google Script error: ${response.status}`);
    }

    // Ambil teksnya dulu buat antisipasi kalau bukan JSON
    const textData = await response.text();
    
    // Coba parsing JSON, kalau gagal berarti bukan JSON
    let data;
    try {
      data = JSON.parse(textData);
    } catch (e) {
      data = { message: textData }; // Kalau bukan JSON, balikin teksnya aja
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error detail:', error); // Cek ini di log Vercel!
    return res.status(500).json({ error: 'Gagal mengirim data', details: error.message });
  }
}

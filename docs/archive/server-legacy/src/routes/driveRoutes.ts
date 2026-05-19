import { Router } from 'express';
import { google } from 'googleapis';

const router = Router();

const getOAuth2Client = (req: any) => {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  const tokensStr = req.cookies.google_tokens;
  if (tokensStr) {
    client.setCredentials(JSON.parse(tokensStr));
  }
  return client;
};

router.get('/url', (req, res) => {
  const client = getOAuth2Client(req);
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
    prompt: 'consent'
  });
  res.json({ url });
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  const client = getOAuth2Client(req);
  const { tokens } = await client.getToken(code as string);
  
  res.cookie('google_tokens', JSON.stringify(tokens), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.send('Autentisering klar! Du kan stänga detta fönster.');
});

router.get('/files', async (req, res) => {
  try {
    const client = getOAuth2Client(req);
    const drive = google.drive({ version: 'v3', auth: client });
    const response = await drive.files.list({
      pageSize: 10,
      fields: 'files(id, name, mimeType)'
    });
    res.json(response.data.files);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

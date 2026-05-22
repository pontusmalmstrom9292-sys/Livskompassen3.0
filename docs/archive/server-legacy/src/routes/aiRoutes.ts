import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const getAI = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY missing');
  return new GoogleGenerativeAI(key);
};

router.post('/gemini', async (req, res) => {
  try {
    const { prompt, systemInstruction, model } = req.body;
    const ai = getAI();
    const genModel = ai.getGenerativeModel({ 
      model: model || 'gemini-1.5-flash',
      systemInstruction 
    });

    const result = await genModel.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/media', upload.single('mediaData'), async (req, res) => {
  try {
    const { systemInstruction } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const ai = getAI();
    const genModel = ai.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction 
    });

    const result = await genModel.generateContent([
      {
        inlineData: {
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype
        }
      },
      'Analysera detta underlag.'
    ]);

    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

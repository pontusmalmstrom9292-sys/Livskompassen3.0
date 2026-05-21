import { defineSecret } from 'firebase-functions/params';

/** Firebase Secret Manager — injiceras via onCall `secrets: [geminiApiKey]`. */
export const geminiApiKey = defineSecret('GEMINI_API_KEY');

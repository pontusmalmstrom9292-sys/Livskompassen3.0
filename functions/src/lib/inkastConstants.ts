/** G10 Inkast — delade trösklar och MIME (backend + synkad med klient). */

export const INKAST_CONFIDENCE_THRESHOLD = 0.75;

export const INKAST_AUDIO_MIMES = new Set([
  'audio/webm',
  'audio/mpeg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/wav',
]);

export const INKAST_MAX_AUDIO_BYTES = 20 * 1024 * 1024;

export function isInkastAudioMime(mimeType: string): boolean {
  return INKAST_AUDIO_MIMES.has(mimeType) || mimeType.startsWith('audio/');
}

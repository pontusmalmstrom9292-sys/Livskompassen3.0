/** Smart Inkast — stödda MIME och accept-attribut (Web API, ingen tredjepart). */
export const INKAST_TEXT_MIMES = new Set([
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
]);

export const INKAST_AUDIO_MIMES = new Set([
  'audio/webm',
  'audio/mpeg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/wav',
]);

export const INKAST_BINARY_MIMES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
]);

export const INKAST_FILE_ACCEPT =
  '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.csv,.json,.png,.jpg,.jpeg,.webp,.gif,.webm,.mp3,.m4a,.wav';

const EXT_TO_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  md: 'text/markdown',
  csv: 'text/csv',
  json: 'application/json',
  txt: 'text/plain',
  webm: 'audio/webm',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  wav: 'audio/wav',
};

export function resolveInkastMime(file: File): string {
  if (file.type) {
    if (file.type === 'image/jpg') return 'image/jpeg';
    return file.type;
  }
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return EXT_TO_MIME[ext] ?? 'text/plain';
}

export function isInkastAudioFile(file: File): boolean {
  const mime = resolveInkastMime(file);
  if (INKAST_AUDIO_MIMES.has(mime) || mime.startsWith('audio/')) return true;
  return /\.(webm|mp3|m4a|wav)$/i.test(file.name);
}

export function isInkastBinaryFile(file: File): boolean {
  const mime = resolveInkastMime(file);
  if (INKAST_BINARY_MIMES.has(mime)) return true;
  return /\.(pdf|docx?|xlsx?|pptx?|png|jpe?g|webp|gif)$/i.test(file.name);
}

export function isInkastTextFile(file: File): boolean {
  const mime = resolveInkastMime(file);
  return INKAST_TEXT_MIMES.has(mime) || /\.(txt|md|csv|json)$/i.test(file.name);
}

export function isInkastSupportedFile(file: File): boolean {
  return isInkastBinaryFile(file) || isInkastTextFile(file) || isInkastAudioFile(file);
}

export const INKAST_UNSUPPORTED_FORMAT_MSG =
  'Stödda format: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .md, .csv, .json, .png, .jpg, .webp, .gif, .webm, .mp3, .m4a, .wav';

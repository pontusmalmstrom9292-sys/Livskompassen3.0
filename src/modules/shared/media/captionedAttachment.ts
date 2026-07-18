/**
 * @locked MOD-SHARED-MEDIA
 * Shared captioned media model — journal, inkast, valv, barnlivslogg.
 * Max 2 attachments per post. Caption optional (≤ CAPTION_MAX_CHARS).
 */

export const CAPTIONED_ATTACHMENT_MAX = 2;
export const CAPTION_MAX_CHARS = 500;

export type CaptionedAttachment = {
  url: string;
  storagePath: string;
  name: string;
  mimeType: string;
  size: number;
  caption?: string;
};

/** Pending pick before upload (session only). */
export type PendingCaptionedMedia = {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
  mimeType: string;
};

export function clampCaption(raw: string | undefined | null): string | undefined {
  if (raw == null) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, CAPTION_MAX_CHARS);
}

export function isCaptionedAttachment(raw: unknown): raw is CaptionedAttachment {
  if (!raw || typeof raw !== 'object') return false;
  const a = raw as Record<string, unknown>;
  return (
    typeof a.url === 'string' &&
    typeof a.storagePath === 'string' &&
    typeof a.name === 'string' &&
    typeof a.mimeType === 'string' &&
    (typeof a.size === 'number' || typeof a.size === 'string')
  );
}

export function normalizeCaptionedAttachment(raw: unknown): CaptionedAttachment | undefined {
  if (!isCaptionedAttachment(raw)) return undefined;
  const a = raw as Record<string, unknown>;
  const size = typeof a.size === 'number' ? a.size : Number(a.size) || 0;
  const caption = clampCaption(typeof a.caption === 'string' ? a.caption : undefined);
  const base: CaptionedAttachment = {
    url: String(a.url ?? ''),
    storagePath: String(a.storagePath ?? ''),
    name: String(a.name ?? ''),
    mimeType: String(a.mimeType ?? ''),
    size,
  };
  if (!base.url && !base.name) return undefined;
  return caption ? { ...base, caption } : base;
}

/**
 * Resolve attachments from new `attachments[]` or legacy single `attachment`.
 * Never exceeds CAPTIONED_ATTACHMENT_MAX.
 */
export function resolveCaptionedAttachments(data: {
  attachments?: unknown;
  attachment?: unknown;
}): CaptionedAttachment[] {
  const fromList = Array.isArray(data.attachments)
    ? data.attachments
        .map(normalizeCaptionedAttachment)
        .filter((x): x is CaptionedAttachment => Boolean(x))
    : [];
  if (fromList.length > 0) {
    return fromList.slice(0, CAPTIONED_ATTACHMENT_MAX);
  }
  const legacy = normalizeCaptionedAttachment(data.attachment);
  return legacy ? [legacy] : [];
}

export function toLegacyAttachment(
  list: CaptionedAttachment[] | undefined,
): CaptionedAttachment | undefined {
  if (!list?.length) return undefined;
  return list[0];
}

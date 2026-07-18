/**
 * Journal attachment — extends shared CaptionedAttachment.
 * Legacy posts may have a single `attachment` without caption.
 */
export type { CaptionedAttachment as JournalAttachment } from '@/modules/shared/media';

export {
  CAPTIONED_ATTACHMENT_MAX as JOURNAL_ATTACHMENT_MAX,
  CAPTION_MAX_CHARS,
  clampCaption,
  normalizeCaptionedAttachment as normalizeJournalAttachment,
  resolveCaptionedAttachments as resolveJournalAttachments,
  toLegacyAttachment,
} from '@/modules/shared/media';

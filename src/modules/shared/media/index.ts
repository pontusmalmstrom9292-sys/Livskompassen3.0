/**
 * @locked MOD-SHARED-MEDIA
 */
export {
  CAPTIONED_ATTACHMENT_MAX,
  CAPTION_MAX_CHARS,
  type CaptionedAttachment,
  type PendingCaptionedMedia,
  clampCaption,
  isCaptionedAttachment,
  normalizeCaptionedAttachment,
  resolveCaptionedAttachments,
  toLegacyAttachment,
} from './captionedAttachment';

export {
  MediaAttachWithCaption,
  type MediaAttachWithCaptionProps,
  type MediaAttachValidation,
} from './MediaAttachWithCaption';

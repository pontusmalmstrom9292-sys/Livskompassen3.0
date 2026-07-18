export type MediaAttachmentKind = 'image' | 'audio' | 'video' | 'file';

export type MediaAttachment = {
  id: string;
  file: File;
  previewUrl: string;
  kind: MediaAttachmentKind;
  /** Valfri bildtext / anteckning (t.ex. skärmdump-kontext). */
  caption?: string;
};

export function inferMediaKind(file: File): MediaAttachmentKind {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  return 'file';
}

export function createMediaAttachment(file: File, caption = ''): MediaAttachment {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    file,
    previewUrl: URL.createObjectURL(file),
    kind: inferMediaKind(file),
    caption,
  };
}

export function revokeMediaAttachments(attachments: MediaAttachment[]) {
  for (const item of attachments) {
    URL.revokeObjectURL(item.previewUrl);
  }
}

import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Mail, Plus } from 'lucide-react';
import { ChromeV5Icon, type ChromeV5Category } from '../ui/chromeIcons';
import type { HubContextIconId } from './hubContextBar';

/** PWA shortcut-glyph (samma assets som `manifest.webmanifest` WH1–WH2). */
function PwaShortcutImg({ src, className }: { src: string; className: string }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      className={clsx('shrink-0 object-contain', className)}
    />
  );
}

function ChromeGlyph({
  category,
  className,
}: {
  category: ChromeV5Category;
  className: string;
}) {
  return <ChromeV5Icon category={category} className={className} />;
}

export function renderHubContextIcon(id: HubContextIconId, className: string): ReactNode {
  const cls = className;
  const stroke = 1.65;
  switch (id) {
    case 'list':
      return <ChromeGlyph category="planering" className={cls} />;
    case 'calendar':
      return <ChromeGlyph category="planering" className={cls} />;
    case 'clock':
      return <ChromeGlyph category="arbetsliv" className={cls} />;
    case 'note':
      return <PwaShortcutImg src="/icons/drawer-l2/drawer-anteckning.svg" className={cls} />;
    case 'record':
      return <PwaShortcutImg src="/icons/drawer-l2/drawer-inspelning.svg" className={cls} />;
    case 'wallet':
      return <ChromeGlyph category="ekonomi" className={cls} />;
    case 'mail':
      return <Mail className={cls} strokeWidth={stroke} />;
    case 'folder':
      return <ChromeGlyph category="planering" className={cls} />;
    case 'focus':
      return <ChromeGlyph category="utveckling" className={cls} />;
    case 'plus':
      return <Plus className={cls} strokeWidth={stroke} />;
    case 'sprout':
      return <ChromeGlyph category="rutiner" className={cls} />;
    case 'book':
      return <ChromeGlyph category="dagbok" className={cls} />;
    case 'brain':
      return <ChromeGlyph category="utveckling" className={cls} />;
    case 'anchor':
      return <ChromeGlyph category="hamn" className={cls} />;
    case 'sparkles':
      return <ChromeGlyph category="mabra" className={cls} />;
    case 'users':
      return <ChromeGlyph category="familjen" className={cls} />;
    case 'bookheart':
      return <ChromeGlyph category="familjen" className={cls} />;
    default:
      return null;
  }
}

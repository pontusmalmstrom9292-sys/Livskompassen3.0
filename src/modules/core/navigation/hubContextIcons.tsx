import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import {
  BookHeart,
  Brain,
  Clock,
  Focus,
  FolderKanban,
  List,
  Mail,
  Plus,
  Sprout,
  Wallet,
} from 'lucide-react';
import { ChromeV4Icon } from '../ui/chromeIcons';
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

export function renderHubContextIcon(id: HubContextIconId, className: string): ReactNode {
  const cls = className;
  const stroke = 1.65;
  switch (id) {
    case 'list':
      return <List className={cls} strokeWidth={stroke} />;
    case 'calendar':
      return <ChromeV4Icon category="planering" className={cls} />;
    case 'clock':
      return <Clock className={cls} strokeWidth={stroke} />;
    case 'note':
      return <PwaShortcutImg src="/icons/shortcuts/wh-anteckning.svg" className={cls} />;
    case 'record':
      return <PwaShortcutImg src="/icons/shortcuts/wh-inspelning.svg" className={cls} />;
    case 'wallet':
      return <Wallet className={cls} strokeWidth={stroke} />;
    case 'mail':
      return <Mail className={cls} strokeWidth={stroke} />;
    case 'folder':
      return <FolderKanban className={cls} strokeWidth={stroke} />;
    case 'focus':
      return <Focus className={cls} strokeWidth={stroke} />;
    case 'plus':
      return <Plus className={cls} strokeWidth={stroke} />;
    case 'sprout':
      return <Sprout className={cls} strokeWidth={stroke} />;
    case 'book':
      return <ChromeV4Icon category="dagbok" className={cls} />;
    case 'brain':
      return <Brain className={cls} strokeWidth={stroke} />;
    case 'anchor':
      return <ChromeV4Icon category="hamn" className={cls} />;
    case 'sparkles':
      return <ChromeV4Icon category="mabra" className={cls} />;
    case 'users':
      return <ChromeV4Icon category="familjen" className={cls} />;
    case 'bookheart':
      return <BookHeart className={cls} strokeWidth={stroke} />;
    default:
      return null;
  }
}

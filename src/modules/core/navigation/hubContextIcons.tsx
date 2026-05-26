import type { ReactNode } from 'react';
import {
  Anchor,
  BookHeart,
  BookOpen,
  Brain,
  Calendar,
  Clock,
  Focus,
  FolderKanban,
  List,
  Mail,
  Plus,
  Sparkles,
  Sprout,
  Users,
  Wallet,
} from 'lucide-react';
import { WidgetMicIcon, WidgetNoteIcon } from '../ui/widget-icons';
import type { HubContextIconId } from './hubContextBar';

export function renderHubContextIcon(id: HubContextIconId, className: string): ReactNode {
  const cls = className;
  const stroke = 1.5;
  switch (id) {
    case 'list':
      return <List className={cls} strokeWidth={stroke} />;
    case 'calendar':
      return <Calendar className={cls} strokeWidth={stroke} />;
    case 'clock':
      return <Clock className={cls} strokeWidth={stroke} />;
    case 'note':
      return <WidgetNoteIcon className={cls} />;
    case 'record':
      return <WidgetMicIcon className={cls} />;
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
      return <BookOpen className={cls} strokeWidth={stroke} />;
    case 'brain':
      return <Brain className={cls} strokeWidth={stroke} />;
    case 'anchor':
      return <Anchor className={cls} strokeWidth={stroke} />;
    case 'sparkles':
      return <Sparkles className={cls} strokeWidth={stroke} />;
    case 'users':
      return <Users className={cls} strokeWidth={stroke} />;
    case 'bookheart':
      return <BookHeart className={cls} strokeWidth={stroke} />;
    default:
      return null;
  }
}

import type { ReactNode } from 'react';
import { ChromeV5Icon } from '../ui/chromeIcons/ChromeV5Icon';
import type { ChromeV5Category } from '../ui/chromeIcons/ChromeV5Icon';
import type { HubContextIconId } from '../navigation/hubContextBar';
import type { HubContextSlot } from '../navigation/hubContextBar';

export const DOCK_CHROME_ICON_CLASS = 'dock-nav-btn__chrome-v5';

function V5({ category }: { category: ChromeV5Category }) {
  return <ChromeV5Icon category={category} className={DOCK_CHROME_ICON_CLASS} />;
}

function PwaShortcutIcon({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      className={DOCK_CHROME_ICON_CLASS}
    />
  );
}

function renderByIcon(icon: HubContextIconId): ReactNode {
  switch (icon) {
    case 'list':
    case 'calendar':
    case 'folder':
    case 'plus':
      return <V5 category="planering" />;
    case 'clock':
    case 'record':
      return <V5 category="arbetsliv" />;
    case 'note':
      return <PwaShortcutIcon src="/icons/shortcuts/wh-anteckning.svg" />;
    case 'wallet':
      return <V5 category="ekonomi" />;
    case 'mail':
      return <V5 category="dagbok" />;
    case 'focus':
    case 'brain':
    case 'sprout':
      return <V5 category="utveckling" />;
    case 'book':
    case 'bookheart':
      return <V5 category="dagbok" />;
    case 'anchor':
      return <V5 category="hamn" />;
    case 'sparkles':
      return <V5 category="mabra" />;
    case 'users':
      return <V5 category="familjen" />;
    default:
      return <V5 category="planering" />;
  }
}

/** Premium v5-guldikoner för dock — samma familj som hero + drawer. */
export function renderDockNavIcon(slot: Pick<HubContextSlot, 'id' | 'icon'>): ReactNode {
  switch (slot.id) {
    case 'inkop':
      return <V5 category="ekonomi" />;
    case 'handling':
    case 'planering':
    case 'hub':
      return <V5 category="planering" />;
    case 'projekt':
      return <V5 category="projekt" />;
    case 'fokus':
      return <V5 category="utveckling" />;
    case 'stampla':
    case 'tid':
    case 'arbetsliv':
      return <V5 category="arbetsliv" />;
    case 'inkorg':
    case 'logg':
    case 'dagbok':
      return <V5 category="dagbok" />;
    case 'reflektion':
    case 'mabra':
      return <V5 category="mabra" />;
    case 'livslogg':
    case 'tillsammans':
    case 'familjen':
      return <V5 category="familjen" />;
    case 'hamn':
      return <V5 category="hamn" />;
    case 'biff':
      return <V5 category="hamnBiff" />;
    case 'kunskap':
      return <V5 category="kunskap" />;
    case 'note':
      return <PwaShortcutIcon src="/icons/shortcuts/wh-anteckning.svg" />;
    default:
      return renderByIcon(slot.icon);
  }
}

export function renderDockSideIcon(icon: HubContextIconId): ReactNode {
  return renderByIcon(icon);
}

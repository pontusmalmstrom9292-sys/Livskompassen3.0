import type { ReactNode } from 'react';
import { ChromeV4Icon } from '../ui/chromeIcons';
import type { HubContextIconId } from '../navigation/hubContextBar';
import type { HubContextSlot } from '../navigation/hubContextBar';

export const DOCK_CHROME_ICON_CLASS = 'dock-nav-btn__chrome-v4';

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
      return <ChromeV4Icon category="planering" className={DOCK_CHROME_ICON_CLASS} />;
    case 'clock':
    case 'record':
      return <PwaShortcutIcon src="/icons/shortcuts/wh-stampla.svg" />;
    case 'note':
      return <PwaShortcutIcon src="/icons/shortcuts/wh-anteckning.svg" />;
    case 'wallet':
      return <ChromeV4Icon category="ekonomi" className={DOCK_CHROME_ICON_CLASS} />;
    case 'mail':
      return <ChromeV4Icon category="dagbok" className={DOCK_CHROME_ICON_CLASS} />;
    case 'focus':
    case 'brain':
    case 'sprout':
      return <ChromeV4Icon category="utveckling" className={DOCK_CHROME_ICON_CLASS} />;
    case 'book':
    case 'bookheart':
      return <ChromeV4Icon category="dagbok" className={DOCK_CHROME_ICON_CLASS} />;
    case 'anchor':
      return <ChromeV4Icon category="hamn" className={DOCK_CHROME_ICON_CLASS} />;
    case 'sparkles':
      return <ChromeV4Icon category="mabra" className={DOCK_CHROME_ICON_CLASS} />;
    case 'users':
      return <ChromeV4Icon category="familjen" className={DOCK_CHROME_ICON_CLASS} />;
    default:
      return <ChromeV4Icon category="planering" className={DOCK_CHROME_ICON_CLASS} />;
  }
}

/** Premium v4/WH-ikoner för dock — samma familj som hero + drawer. */
export function renderDockNavIcon(slot: Pick<HubContextSlot, 'id' | 'icon'>): ReactNode {
  switch (slot.id) {
    case 'inkop':
      return <ChromeV4Icon category="ekonomi" className={DOCK_CHROME_ICON_CLASS} />;
    case 'handling':
    case 'planering':
    case 'hub':
    case 'projekt':
      return <ChromeV4Icon category="planering" className={DOCK_CHROME_ICON_CLASS} />;
    case 'fokus':
      return <ChromeV4Icon category="utveckling" className={DOCK_CHROME_ICON_CLASS} />;
    case 'stampla':
    case 'tid':
    case 'arbetsliv':
      return <PwaShortcutIcon src="/icons/shortcuts/wh-stampla.svg" />;
    case 'inkorg':
      return <ChromeV4Icon category="dagbok" className={DOCK_CHROME_ICON_CLASS} />;
    case 'logg':
    case 'dagbok':
      return <ChromeV4Icon category="dagbok" className={DOCK_CHROME_ICON_CLASS} />;
    case 'reflektion':
    case 'mabra':
      return <ChromeV4Icon category="mabra" className={DOCK_CHROME_ICON_CLASS} />;
    case 'livslogg':
    case 'tillsammans':
    case 'familjen':
      return <ChromeV4Icon category="familjen" className={DOCK_CHROME_ICON_CLASS} />;
    case 'hamn':
    case 'biff':
      return <ChromeV4Icon category="hamn" className={DOCK_CHROME_ICON_CLASS} />;
    case 'kunskap':
      return <ChromeV4Icon category="kunskap" className={DOCK_CHROME_ICON_CLASS} />;
    case 'note':
      return <PwaShortcutIcon src="/icons/shortcuts/wh-anteckning.svg" />;
    default:
      return renderByIcon(slot.icon);
  }
}

export function renderDockSideIcon(icon: HubContextIconId): ReactNode {
  switch (icon) {
    case 'users':
      return <ChromeV4Icon category="familjen" className={DOCK_CHROME_ICON_CLASS} />;
    case 'anchor':
      return <ChromeV4Icon category="hamn" className={DOCK_CHROME_ICON_CLASS} />;
    case 'book':
      return <ChromeV4Icon category="dagbok" className={DOCK_CHROME_ICON_CLASS} />;
    case 'sparkles':
      return <ChromeV4Icon category="mabra" className={DOCK_CHROME_ICON_CLASS} />;
    case 'calendar':
      return <ChromeV4Icon category="planering" className={DOCK_CHROME_ICON_CLASS} />;
    case 'clock':
      return <PwaShortcutIcon src="/icons/shortcuts/wh-stampla.svg" />;
    default:
      return renderByIcon(icon);
  }
}

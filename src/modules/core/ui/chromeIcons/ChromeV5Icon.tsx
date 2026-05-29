import { clsx } from 'clsx';
import { getChromeIconStyle, type ChromeIconStyle } from '../../theme/chromeIconPrefs';

/** Hub chrome — gold wire G1 default (v5 proposals). */
export type ChromeV5Category =
  | 'familjen'
  | 'hamn'
  | 'hamnBiff'
  | 'valv'
  | 'dagbok'
  | 'planering'
  | 'mabra'
  | 'kompis'
  | 'projekt'
  | 'arbetsliv'
  | 'rutiner'
  | 'ekonomi'
  | 'utveckling'
  | 'kunskap';

function iconSrc(category: ChromeV5Category, style: ChromeIconStyle): string {
  return `/icons/chrome/v5-${style}-${category}.svg`;
}

type Props = {
  category: ChromeV5Category;
  className?: string;
  style?: ChromeIconStyle;
};

export function ChromeV5Icon({ category, className, style }: Props) {
  const resolved = style ?? getChromeIconStyle();
  return (
    <img
      src={iconSrc(category, resolved)}
      className={clsx('chrome-v5-icon shrink-0 object-contain', className)}
      alt=""
      aria-hidden
      decoding="async"
      draggable={false}
    />
  );
}

/** Map legacy v4 category + slot id → v5. */
export function createChromeV5Icon(category: ChromeV5Category) {
  return function ChromeV5IconSlot({
    className,
    strokeWidth: _strokeWidth,
  }: {
    className?: string;
    strokeWidth?: number;
  }) {
    return <ChromeV5Icon category={category} className={className} />;
  };
}

export function toChromeV5Category(
  category: string,
  slotId?: string,
): ChromeV5Category {
  if (slotId === 'biff') return 'hamnBiff';
  if (category === 'hamn' && slotId === 'biff') return 'hamnBiff';
  const allowed: ChromeV5Category[] = [
    'familjen',
    'hamn',
    'hamnBiff',
    'valv',
    'dagbok',
    'planering',
    'mabra',
    'kompis',
    'projekt',
    'arbetsliv',
    'rutiner',
    'ekonomi',
    'utveckling',
    'kunskap',
  ];
  if (allowed.includes(category as ChromeV5Category)) {
    return category as ChromeV5Category;
  }
  return 'planering';
}

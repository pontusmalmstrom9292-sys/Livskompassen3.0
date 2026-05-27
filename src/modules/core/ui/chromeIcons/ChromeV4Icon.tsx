import { clsx } from 'clsx';

/** v4 rad 1 — D1-skiva + kategori-glyph (F1/H1/V1/…). Källa: icons-proposals/2026-05-26-v4-round2-dna */
export type ChromeV4Category =
  | 'familjen'
  | 'hamn'
  | 'valv'
  | 'dagbok'
  | 'planering'
  | 'mabra'
  | 'rutiner'
  | 'ekonomi'
  | 'utveckling'
  | 'kunskap';

const SRC: Record<ChromeV4Category, string> = {
  familjen: '/icons/chrome/v4-familjen.svg',
  hamn: '/icons/chrome/v4-hamn.svg',
  valv: '/icons/chrome/v4-valv.svg',
  dagbok: '/icons/chrome/v4-dagbok.svg',
  planering: '/icons/chrome/v4-planering.svg',
  mabra: '/icons/chrome/v4-mabra.svg',
  rutiner: '/icons/chrome/v4-rutiner.svg',
  ekonomi: '/icons/chrome/v4-ekonomi.svg',
  utveckling: '/icons/chrome/v4-utveckling.svg',
  kunskap: '/icons/chrome/v4-kunskap.svg',
};

type Props = {
  category: ChromeV4Category;
  className?: string;
};

/** Premium chrome-ikon (48×48 asset, skalas via className). */
export function ChromeV4Icon({ category, className }: Props) {
  return (
    <img
      src={SRC[category]}
      className={clsx('chrome-v4-icon shrink-0 object-contain', className)}
      alt=""
      aria-hidden
      decoding="async"
      draggable={false}
    />
  );
}

export function createChromeV4Icon(category: ChromeV4Category) {
  return function ChromeV4IconSlot({
    className,
    strokeWidth: _strokeWidth,
  }: {
    className?: string;
    strokeWidth?: number;
  }) {
    return <ChromeV4Icon category={category} className={className} />;
  };
}

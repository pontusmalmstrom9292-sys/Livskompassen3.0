/* PROTECTED BASTA-DESIGN CHROME LOCK — docs/design/BASTA-DESIGN-CHROME-LOCK.md · npm run smoke:basta-dock-lock */
import { PenLine } from 'lucide-react';
import type { JournalEntryPreview } from './bastaDesignTypes';
import { BastaButton, BastaGoldDivider, BastaSectionLabel } from './bastaDesignParts';

type Props = {
  todayEntry?: JournalEntryPreview | null;
  onWrite: () => void;
};

/** Figma Make hero — Dagens reflektion + aside reflektionsfråga. */
export function BastaDesignHero({ todayEntry, onWrite }: Props) {
  return (
    <div className="basta-design__hero">
      <img
        src="/design/home-hero-scenic.png"
        alt="Solnedgång över berg och vatten"
        className="basta-design__hero-img"
      />
      <div className="basta-design__hero-overlay" />
      <div className="basta-design__hero-content">
        <div className="basta-design__hero-main">
          <BastaSectionLabel>Dagens reflektion</BastaSectionLabel>
          {todayEntry?.text ? (
            <p className="basta-design__hero-title basta-design__hero-title--quote">
              &ldquo;{todayEntry.text.slice(0, 120)}&rdquo;
            </p>
          ) : (
            <>
              <h2 className="basta-design__hero-title">
                Stanna upp.
                <br />
                <em>Känn efter.</em>
              </h2>
              <p className="basta-design__hero-lead">
                En stund för dig själv,
                <br />
                är aldrig bortkastad.
              </p>
            </>
          )}
          <BastaButton type="button" onClick={onWrite}>
            <PenLine size={12} aria-hidden />
            Skriv nu
          </BastaButton>
        </div>
        <aside className="basta-design__hero-aside">
          <p className="basta-design__hero-aside-label">Reflektionsfråga</p>
          <p>Du är den trygga hamnen — även när världen känns splittrad.</p>
          <BastaGoldDivider />
          <p className="basta-design__hero-aside-label">Vad vill din inre röst säga — en sak?</p>
          <p className="basta-design__hero-aside-foot">Skriv det första som dyker upp...</p>
        </aside>
      </div>
    </div>
  );
}

export function BudgetPreviewMini() {
  return (
    <div className="space-y-1.5 text-[10px] leading-relaxed text-text-muted" aria-hidden>
      <div className="flex justify-between gap-2">
        <span>Mat</span>
        <span className="tabular-nums text-accent">4 200 kr</span>
      </div>
      <div className="flex justify-between gap-2">
        <span>Boende</span>
        <span className="tabular-nums">12 500 kr</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
        <div className="h-full w-2/3 rounded-full bg-accent/60" />
      </div>
    </div>
  );
}

export function MealPrepPreviewMini() {
  return (
    <ul className="space-y-1 text-[10px] leading-relaxed text-text-muted" aria-hidden>
      <li>Sön: välj 3 rätter</li>
      <li>Mån: handla en gång</li>
      <li>Tis–fre: färdig plan</li>
    </ul>
  );
}

export function ImpulsePreviewMini() {
  return (
    <div
      className="rounded-xl border border-accent/20 bg-accent/5 p-2.5 text-center text-[10px] leading-relaxed text-text-muted"
      aria-hidden
    >
      <p>Paus 24 h</p>
      <p className="mt-1 text-accent-light">Köp inte nu — sov på saken</p>
    </div>
  );
}

export function SavingsPreviewMini() {
  return (
    <div className="flex justify-around gap-2 text-center text-[10px] leading-relaxed text-text-muted" aria-hidden>
      <div>
        <p className="text-sm font-light tabular-nums text-accent">2 400</p>
        <p>Äventyrskassa</p>
      </div>
      <div>
        <p className="text-sm font-light tabular-nums text-success">800</p>
        <p>Buffert</p>
      </div>
    </div>
  );
}

export function LoggPreviewMini() {
  return (
    <div className="space-y-1 text-[10px] leading-relaxed text-text-muted" aria-hidden>
      <p>Hyra · 8 500 kr</p>
      <p>Mat/Köp · −420 kr</p>
    </div>
  );
}

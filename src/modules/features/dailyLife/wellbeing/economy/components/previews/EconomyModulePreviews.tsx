export function BudgetPreviewMini() {
  return (
    <div className="space-y-1 text-[10px] text-text-muted">
      <div className="flex justify-between">
        <span>Mat</span>
        <span className="text-accent">4 200 kr</span>
      </div>
      <div className="flex justify-between">
        <span>Boende</span>
        <span>12 500 kr</span>
      </div>
      <div className="h-1 rounded-full bg-surface-3">
        <div className="h-1 w-2/3 rounded-full bg-accent/60" />
      </div>
    </div>
  );
}

export function MealPrepPreviewMini() {
  return (
    <ul className="space-y-0.5 text-[10px] text-text-muted">
      <li>Sön: välj 3 rätter</li>
      <li>Mån: handla en gång</li>
      <li>Tis–fre: färdig plan</li>
    </ul>
  );
}

export function ImpulsePreviewMini() {
  return (
    <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-2 text-center text-[10px] text-text-muted">
      <p>Paus 24 h</p>
      <p className="mt-1 text-indigo-300">Köp inte nu — sov på saken</p>
    </div>
  );
}

export function SavingsPreviewMini() {
  return (
    <div className="flex justify-around text-center text-[10px] text-text-muted">
      <div>
        <p className="text-sm font-light text-accent">2 400</p>
        <p>Äventyrskassa</p>
      </div>
      <div>
        <p className="text-sm font-light text-success">800</p>
        <p>Buffert</p>
      </div>
    </div>
  );
}

export function LoggPreviewMini() {
  return (
    <div className="space-y-1 text-[10px] text-text-muted">
      <p>Hyra · 8 500 kr</p>
      <p>Mat/Köp · −420 kr</p>
    </div>
  );
}

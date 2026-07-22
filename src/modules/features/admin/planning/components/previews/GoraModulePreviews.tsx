import { KANBAN_COLUMNS } from '../../constants';

export function KanbanPreviewMini() {
  return (
    <div className="grid grid-cols-3 gap-1.5 text-[9px] uppercase tracking-wider text-text-muted">
      {KANBAN_COLUMNS.map((col) => (
        <div key={col.id} className="rounded-lg border border-accent/15 bg-surface-2/60 p-1.5">
          <p className="mb-1 text-accent/70">{col.label}</p>
          {col.id === 'todo' && (
            <div className="rounded border border-accent/20 bg-surface/50 px-1 py-0.5 text-[8px] normal-case text-text">
              Veckomeny: 3 rätter
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function FokusPreviewMini() {
  return (
    <div className="rounded-lg border border-accent/20 bg-accent/5 p-2 text-center">
      <p className="text-[9px] uppercase tracking-widest text-text-muted">Nästa steg</p>
      <p className="mt-1 text-xs text-accent">Läs 2 sidor · ~10 min</p>
    </div>
  );
}

export function FramstegPreviewMini() {
  return (
    <div className="flex justify-around text-center text-[10px] text-text-muted">
      <div>
        <p className="text-lg font-light text-accent">4</p>
        <p>Att göra</p>
      </div>
      <div>
        <p className="text-lg font-light text-accent">2</p>
        <p>Väntar</p>
      </div>
      <div>
        <p className="text-lg font-light text-success">7</p>
        <p>Klart</p>
      </div>
    </div>
  );
}

export function InkorgPreviewMini() {
  return (
    <div className="space-y-1 text-[10px] text-text-muted">
      <p className="font-mono text-[9px] text-text-muted">Från: skola@…</p>
      <p className="text-text">Terminsstart — datum saknas</p>
      <p className="text-accent/80">→ Väntar i Handling</p>
    </div>
  );
}

export function ProjektPreviewMini() {
  return (
    <div className="flex flex-wrap gap-1 text-[9px] uppercase tracking-wider">
      {['Lista', 'Anteckning', 'Bild', 'Uppgift'].map((label) => (
        <span
          key={label}
          className="rounded border border-accent/20 bg-surface/40 px-1.5 py-0.5 text-text-muted"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export function InkopslistaPreviewMini() {
  return (
    <ul className="space-y-0.5 text-[10px] text-text-muted">
      <li>□ Mjölk</li>
      <li>□ Pasta</li>
      <li>□ Tomater</li>
    </ul>
  );
}

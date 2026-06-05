import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { listBuiltinTagGroupsForHelp } from '@/modules/inkast/api/inkastService';

/** Utfällbar tagg-hjälp — Obsidian Calm, läser från TAG_GROUPS. */
export function TaggHelpPanel() {
  const [open, setOpen] = useState(false);
  const groups = listBuiltinTagGroupsForHelp();

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="tagg-help-panel"
        onClick={() => setOpen((prev) => !prev)}
        className="btn-pill--ghost inline-flex items-center gap-1.5 self-end text-[10px] uppercase tracking-widest"
      >
        <HelpCircle className="h-3.5 w-3.5 text-accent/80" aria-hidden />
        Hjälp
        <ChevronDown
          className={clsx('h-3 w-3 transition-transform duration-300', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          id="tagg-help-panel"
          className="animate-fade-in max-h-56 overflow-y-auto rounded-xl border border-border/30 bg-surface-2/60 p-3 backdrop-blur-md"
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-text-dim">
            Tagg-guide
          </p>
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <section key={group.groupId}>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent/90">
                  {group.label}
                </h4>
                <ul className="mt-2 space-y-2">
                  {group.tags.map((tag) => (
                    <li key={tag.id} className="text-xs leading-relaxed">
                      <span className="font-semibold text-text">{tag.label}</span>
                      <span className="text-text-muted"> — {tag.description}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

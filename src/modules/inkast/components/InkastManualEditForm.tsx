import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button, TextArea } from '@/design-system';
import { HubDropdownNav } from '@/core/ui/HubDropdownNav';
import { useStore } from '@/core/store';
import { BiffRewriteButton } from '@/shared/ui/BiffRewriteButton';
import { normalizeInkastTagSelection } from '../api/inkastService';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { TaggSelector } from '@/shared/components/TaggSelector';
import {
  INKAST_SILO_DESCRIPTIONS,
  INKAST_SILO_ITEMS,
  type InkastManualChoice,
  type InkastUiSilo,
} from '../constants/inkastSiloOptions';

type Props = {
  silo: InkastUiSilo;
  tags: string[];
  comment: string;
  childAlias: string;
  busy?: boolean;
  onSiloChange: (silo: InkastUiSilo) => void;
  onTagsChange: (tags: string[]) => void;
  onCommentChange: (value: string) => void;
  onChildAliasChange: (value: string) => void;
  onSave: (choice: InkastManualChoice) => void;
  onCancel: () => void;
};

/** Manuell silo + universell tagg-matris — Obsidian Calm. */
export function InkastManualEditForm({
  silo,
  tags,
  comment,
  childAlias,
  busy = false,
  onSiloChange,
  onTagsChange,
  onCommentChange,
  onChildAliasChange,
  onSave,
  onCancel,
}: Props) {
  const [siloMenuOpen, setSiloMenuOpen] = useState(false);
  const user = useStore((s) => s.user);
  const selectedTags = normalizeInkastTagSelection(tags);

  const handleSave = () => {
    onSave({
      silo,
      tags: selectedTags,
      comment: comment.trim(),
      childAlias: silo === 'barnen' ? childAlias.trim() || undefined : undefined,
      optInTrauma: true,
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-surface-2/80 p-4 backdrop-blur-md">
      <div className="relative z-[var(--ds-z-raised)]">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-text-dim">
          Välj arkiv
        </p>
        <HubDropdownNav
          items={INKAST_SILO_ITEMS}
          activeId={silo}
          onChange={onSiloChange}
          glowColor="gold"
          ariaLabel="Välj målarkiv"
          onOpenChange={setSiloMenuOpen}
        />
        {!siloMenuOpen ? (
          <p className="mt-2 text-xs leading-relaxed text-text-muted">
            {INKAST_SILO_DESCRIPTIONS[silo]}
          </p>
        ) : null}
      </div>

      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim">
            Analys-tagg
          </p>
          <ModuleHelpFromRegistry moduleId="inkast_tags" />
        </div>
        <TaggSelector
          value={tags}
          onChange={onTagsChange}
          userId={user?.uid}
          disabled={busy}
        />
      </div>

      {silo === 'barnen' && (
        <label htmlFor="inkast-manual-child" className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-dim">
            Barn
          </span>
          <select
            id="inkast-manual-child"
            value={childAlias}
            onChange={(e) => onChildAliasChange(e.target.value)}
            disabled={busy}
            className="input-glass min-h-11 w-full rounded-xl px-3 py-2 text-sm"
          >
            <option value="">Välj barn…</option>
            <option value="Kasper">Kasper</option>
            <option value="Arvid">Arvid</option>
          </select>
        </label>
      )}

      <label htmlFor="inkast-manual-comment" className="block">
        <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-text-dim">
          Kommentar / sammanfattning
        </span>
        <TextArea
          id="inkast-manual-comment"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Kort beskrivning av innehållet…"
          rows={3}
          disabled={busy}
          className="input-glass min-h-11 w-full resize-none rounded-xl px-3 py-2 text-sm"
        />
        <div className="mt-2">
          <BiffRewriteButton
            text={comment}
            context="inkast"
            disabled={busy}
            onRewrite={onCommentChange}
          />
        </div>
      </label>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          disabled={busy || (silo === 'barnen' && !childAlias.trim())}
          onClick={handleSave}
        >
          {busy ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              Sparar…
            </span>
          ) : (
            'Spara'
          )}
        </Button>
        <Button variant="ghost" size="sm" disabled={busy} onClick={onCancel}>
          Avbryt
        </Button>
      </div>
    </div>
  );
}

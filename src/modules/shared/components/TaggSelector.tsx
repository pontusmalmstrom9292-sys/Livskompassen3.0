import { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Loader2, Plus, X } from 'lucide-react';
import { TabBar } from '@/core/ui/TabBar';
import type { UserTagRow } from '@/core/types/firestore';
import {
  INKAST_TAG_GROUP_ORDER,
  inkastTagMeta,
  inkastTagsForGroup,
  normalizeInkastTagSelection,
  resolveInkastTag,
  TAG_GROUPS,
  toggleInkastTag,
  type InkastTagGroupId,
} from '@/modules/inkast/api/inkastService';
import { createUserTag, listenUserTags, userTagStorageId } from '@/shared/tags/userTagsApi';
import { Button } from '@/design-system';

type Props = {
  value: string[];
  onChange: (tagIds: string[]) => void;
  userId?: string | null;
  disabled?: boolean;
};

const GROUP_TABS = INKAST_TAG_GROUP_ORDER.map((id) => ({
  id,
  label: id === 'egen' ? 'Egen' : TAG_GROUPS[id as Exclude<InkastTagGroupId, 'egen'>].label,
}));

/** Universell tagg-matris — flerval, Obsidian Calm. */
export function TaggSelector({ value, onChange, userId, disabled = false }: Props) {
  const [userTags, setUserTags] = useState<UserTagRow[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [customBusy, setCustomBusy] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<InkastTagGroupId>('narcissism');

  useEffect(() => {
    if (!userId) {
      setUserTags([]);
      return;
    }
    return listenUserTags(userId, setUserTags);
  }, [userId]);

  const selectedTags = useMemo(
    () => normalizeInkastTagSelection(value, userTags),
    [value, userTags],
  );

  const visibleTags = useMemo(
    () => inkastTagsForGroup(activeGroup, userTags),
    [activeGroup, userTags],
  );

  useEffect(() => {
    if (selectedTags.length > 0) {
      setActiveGroup(inkastTagMeta(selectedTags[0]!, userTags).groupId);
    }
  }, [selectedTags.join('|')]);

  const handleToggleTag = (tagId: string) => {
    onChange(toggleInkastTag(selectedTags, tagId, userTags));
  };

  const handleRemoveTag = (tagId: string) => {
    onChange(selectedTags.filter((id) => id !== tagId));
  };

  const handleCreateCustomTag = async () => {
    if (!userId || disabled) return;
    const trimmed = customInput.trim();
    if (!trimmed) {
      setCustomError('Skriv ett namn för taggen.');
      return;
    }

    setCustomBusy(true);
    setCustomError(null);
    try {
      const created = await createUserTag(userId, { label: trimmed });
      const storageId = userTagStorageId(created.slug);
      onChange(toggleInkastTag(selectedTags, storageId, [...userTags, created]));
      setActiveGroup('egen');
      setCustomInput('');
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : 'Kunde inte spara taggen.');
    } finally {
      setCustomBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {selectedTags.length > 0 ? (
        <div className="rounded-xl border border-accent/25 bg-surface-3/40 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-dim">
            Valda taggar ({selectedTags.length})
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {selectedTags.map((tagId) => {
              const meta = inkastTagMeta(tagId, userTags);
              return (
                <button
                  key={tagId}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleRemoveTag(tagId)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRemoveTag(tagId);
                    }
                  }}
                  className="chip--active inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
                  aria-label={`Ta bort ${meta.label}`}
                >
                  {meta.label}
                  <X className="h-3 w-3 opacity-70" aria-hidden />
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-text-dim">
            Klicka på en tagg ovan för att ta bort, eller välj fler nedan.
          </p>
        </div>
      ) : (
        <p className="text-xs text-text-dim">Välj en eller flera taggar.</p>
      )}

      <TabBar
        tabs={GROUP_TABS}
        active={activeGroup}
        onChange={(id) => setActiveGroup(id as InkastTagGroupId)}
        size="compact"
      />

      <div key={activeGroup} className="animate-fade-in flex flex-wrap gap-2">
        {visibleTags.length === 0 ? (
          <p className="text-xs text-text-dim">
            {activeGroup === 'egen'
              ? 'Inga egna taggar ännu — skapa en nedan.'
              : 'Inga taggar i den här gruppen.'}
          </p>
        ) : (
          visibleTags.map((tag) => {
            const selected = selectedTags.includes(resolveInkastTag(tag.id, userTags));
            return (
              <button
                key={tag.id}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                onClick={() => handleToggleTag(tag.id)}
                className={clsx(
                  'inline-flex min-h-11 items-center rounded-full border px-3 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55',
                  selected ? 'chip--active' : 'chip--idle',
                )}
              >
                {tag.label}
              </button>
            );
          })
        )}
      </div>

      {activeGroup === 'egen' ? (
        <div className="rounded-xl border border-border/30 bg-surface-2/50 p-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-text-dim">
            Skapa egen tagg
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="t.ex. advokat, schema tvist"
              disabled={disabled || customBusy || !userId}
              aria-label="Namn på egen tagg"
              className="input-glass min-h-11 min-w-[180px] flex-1 rounded-xl px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleCreateCustomTag();
                }
              }}
            />
            <Button
              type="button"
              disabled={disabled || customBusy || !userId}
              onClick={() => void handleCreateCustomTag()}
              variant="ghost"
              className="inline-flex min-h-11 items-center gap-1 text-xs"
            >
              {customBusy ? (
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              ) : (
                <Plus className="h-3 w-3" aria-hidden />
              )}
              Spara tagg
            </Button>
          </div>
          {!userId ? (
            <p className="mt-2 text-xs text-text-dim">Logga in för att spara egna taggar.</p>
          ) : null}
          {customError ? (
            <p className="mt-2 text-xs text-danger/90" role="alert">
              {customError}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

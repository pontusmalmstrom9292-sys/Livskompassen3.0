import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/design-system';
import { Check, Loader2, Plus, Trash2, X } from 'lucide-react';
import { useStore } from '@/core/store';
import { createProject } from '../../projects/api/projectsApi';
import { createProjectBlock } from '../../projects/api/projectBlocksApi';
import { resolveProjectSaveError } from '../../projects/utils/resolveProjectSaveError';
import { PlaneringModulePinPanel } from './PlaneringModulePinPanel';
import {
  addQuickListItem,
  clearDoneQuickListItems,
  getQuickList,
  openItems,
  removeQuickListItem,
  toggleQuickListItem,
} from '../quickListStorage';
import type { QuickList } from '../types';
import { EmptyState } from '@/core/ui/EmptyState';

type Props = {
  listId?: string;
  onHomePinChange?: () => void;
};

export function PlaneringQuickListPanel({ listId = 'inkop', onHomePinChange }: Props) {
  const user = useStore((s) => s.user);
  const navigate = useNavigate();
  const [list, setList] = useState<QuickList>(() => getQuickList(listId));
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setList(getQuickList(listId));
  }, [listId]);

  const addItem = () => {
    const text = draft.trim();
    if (!text) return;
    setList(addQuickListItem(listId, text));
    setDraft('');
  };

  const saveAsProject = async () => {
    if (!user) {
      setMessage('Logga in för att spara som projekt.');
      return;
    }
    const itemsToSave = openItems(list);
    if (itemsToSave.length === 0) {
      setMessage('Lägg till minst en punkt först.');
      return;
    }
    const title =
      window.prompt('Projektnamn:', list.title)?.trim() ?? list.title;
    if (!title) return;

    setSaving(true);
    setMessage(null);
    try {
      const projectId = await createProject(user.uid, {
        title,
        primaryBlockType: 'list',
      });
      await Promise.all(
        itemsToSave.map((item, order) =>
          createProjectBlock(user.uid, {
            projectId,
            type: 'list',
            title: item.text,
            order,
          }),
        ),
      );
      navigate(`/admin/projects/${projectId}`);
    } catch (err) {
      setMessage(resolveProjectSaveError(err, 'project'));
    } finally {
      setSaving(false);
    }
  };

  const open = useMemo(() => openItems(list), [list]);
  const done = useMemo(() => list.items.filter((i) => i.done), [list.items]);

  return (
    <div className="planering-quicklist">
      <p className="planering-quicklist__hint">
        Skriv och tryck +. Bocka av i affären — ingen kanban här.
      </p>

      <div className="planering-quicklist__add">
        <input
          className="input-glass flex-1"
          placeholder="t.ex. mjölk, bröd, kaffe..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <Button type="button" variant="secondary" className="shrink-0" onClick={addItem}>
          <Plus className="h-4 w-4" />
          Lägg till
        </Button>
      </div>

      <ul className="planering-quicklist__items" aria-label={list.title}>
        {open.map((item) => (
          <li key={item.id} className="planering-quicklist__row">
            <button
              type="button"
              className="planering-quicklist__check"
              aria-label={`Markera klar: ${item.text}`}
              onClick={() => setList(toggleQuickListItem(listId, item.id))}
            >
              <span className="planering-quicklist__check-ring" />
            </button>
            <span className="planering-quicklist__text">{item.text}</span>
            <button
              type="button"
              className="planering-quicklist__remove"
              aria-label={`Ta bort ${item.text}`}
              onClick={() => setList(removeQuickListItem(listId, item.id))}
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      {open.length === 0 && (
        <EmptyState message="Inga punkter än. Lägg till något ovan för att bygga listan i lugn takt." />
      )}

      {done.length > 0 && (
        <div className="planering-quicklist__done-block">
          <p className="planering-quicklist__done-label">Klart ({done.length})</p>
          <ul>
            {done.map((item) => (
              <li key={item.id} className="planering-quicklist__row planering-quicklist__row--done">
                <button
                  type="button"
                  className="planering-quicklist__check planering-quicklist__check--on"
                  aria-label={`Ångra: ${item.text}`}
                  onClick={() => setList(toggleQuickListItem(listId, item.id))}
                >
                  <Check className="h-4 w-4" />
                </button>
                <span className="planering-quicklist__text">{item.text}</span>
                <button
                  type="button"
                  className="planering-quicklist__remove"
                  aria-label={`Ta bort ${item.text}`}
                  onClick={() => setList(removeQuickListItem(listId, item.id))}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 w-full"
            onClick={() => setList(clearDoneQuickListItems(listId))}
          >
            Rensa klara
          </Button>
        </div>
      )}

      <div className="planering-quicklist__actions">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={saving}
          onClick={() => void saveAsProject()}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Spara som projekt
        </Button>
      </div>

      <PlaneringModulePinPanel
        title={list.title}
        content={{ kind: 'list', listId }}
        onPinned={() => {
          onHomePinChange?.();
          refresh();
        }}
      />

      {message && <p className="text-center text-xs text-accent">{message}</p>}

      <p className="text-center text-xs text-text-dim">
        Vill du bygga mer?{' '}
        <Link to="/admin/projects/ny" className="text-accent hover:underline">
          Starta eget projekt
        </Link>
        {' · '}
        <button type="button" className="text-accent hover:underline" onClick={refresh}>
          Uppdatera
        </button>
      </p>
    </div>
  );
}

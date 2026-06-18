import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Loader2, Plus, Trash2, X } from 'lucide-react';
import { useStore } from '@/core/store';
import { createProject } from '../../projects/api/projectsApi';
import { createProjectBlock } from '../../projects/api/projectBlocksApi';
import { PlaneringModulePinPanel } from './PlaneringModulePinPanel';
import {
  addQuickListItem,
  clearDoneQuickListItems,
  getQuickList,
  removeQuickListItem,
  toggleQuickListItem,
} from '../quickListStorage';
import type { QuickList } from '../types';

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
    const openItems = list.items.filter((i) => !i.done);
    if (openItems.length === 0) {
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
        openItems.map((item, order) =>
          createProjectBlock(user.uid, {
            projectId,
            type: 'list',
            title: item.text,
            order,
          }),
        ),
      );
      navigate(`/admin/projects/${projectId}`);
    } catch {
      setMessage('Kunde inte skapa projekt.');
    } finally {
      setSaving(false);
    }
  };

  const open = list.items.filter((i) => !i.done);
  const done = list.items.filter((i) => i.done);

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
        <button type="button" className="btn-pill--secondary shrink-0" onClick={addItem}>
          <Plus className="h-4 w-4" />
          Lägg till
        </button>
      </div>

      <ul className="planering-quicklist__items" aria-label={list.title}>
        {open.length === 0 && (
          <li className="planering-quicklist__empty">Inga punkter än — lägg till ovan.</li>
        )}
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
                  onClick={() => setList(removeQuickListItem(listId, item.id))}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn-pill--ghost mt-2 w-full text-xs"
            onClick={() => setList(clearDoneQuickListItems(listId))}
          >
            Rensa klara
          </button>
        </div>
      )}

      <div className="planering-quicklist__actions">
        <button
          type="button"
          className="btn-pill--secondary w-full"
          disabled={saving}
          onClick={() => void saveAsProject()}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Spara som projekt
        </button>
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

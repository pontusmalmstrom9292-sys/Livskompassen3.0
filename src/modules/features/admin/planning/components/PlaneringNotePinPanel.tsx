import { useState } from 'react';
import { Input, TextArea } from '@/design-system';
import { PlaneringModulePinPanel } from './PlaneringModulePinPanel';

/** Skapa anteckning och fäst på valfri skärm. */
export function PlaneringNotePinPanel() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <div className="planering-note-pin space-y-4">
      <p className="text-sm text-text-muted">
        Skriv en anteckning — fäst den under t.ex. Kaspers Barnfokus, Valv-arkiv eller Ekonomi.
      </p>
      <Input
        className="input-glass w-full rounded-xl px-3 py-2 text-sm"
        placeholder="Rubrik (t.ex. Simschema v.24)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea
        className="input-glass neu-inset w-full resize-none rounded-xl px-3 py-2 text-sm"
        rows={4}
        placeholder="Anteckning …"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <PlaneringModulePinPanel
        title={title.trim() || 'Anteckning'}
        content={{ kind: 'note', body }}
      />
    </div>
  );
}

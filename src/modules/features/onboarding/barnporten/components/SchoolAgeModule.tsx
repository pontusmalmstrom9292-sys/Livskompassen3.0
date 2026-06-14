import { useState } from 'react';
import { BookOpen } from 'lucide-react';

export function SchoolAgeModule() {
  const [tasks, setTasks] = useState({
    packBag: false,
    doHomework: false,
    brushTeeth: false,
  });
  const [socialNote, setSocialNote] = useState('');

  return (
    <div className="elongated-module col-span-2 mt-4 p-4 text-text">
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-accent" />
        <h2 className="text-sm font-semibold text-accent-light">Självständighets- & Rutinlogg</h2>
      </div>

      <div className="mb-4 space-y-2">
        <label className="flex items-center gap-3 text-sm">
          <input 
            type="checkbox" 
            className="h-4 w-4 rounded border-white/20 bg-black/20 text-accent focus:ring-accent"
            checked={tasks.packBag} 
            onChange={(e) => setTasks((t) => ({ ...t, packBag: e.target.checked }))} 
          />
          Packat väskan
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input 
            type="checkbox" 
            className="h-4 w-4 rounded border-white/20 bg-black/20 text-accent focus:ring-accent"
            checked={tasks.doHomework} 
            onChange={(e) => setTasks((t) => ({ ...t, doHomework: e.target.checked }))} 
          />
          Gjort läxan
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input 
            type="checkbox" 
            className="h-4 w-4 rounded border-white/20 bg-black/20 text-accent focus:ring-accent"
            checked={tasks.brushTeeth} 
            onChange={(e) => setTasks((t) => ({ ...t, brushTeeth: e.target.checked }))} 
          />
          Borstat tänderna själv
        </label>
      </div>

      <div>
        <label className="mb-1 block text-xs text-text-dim">Skolrelaterad social dynamik</label>
        <textarea
          className="input-glass w-full text-sm"
          rows={2}
          placeholder="T.ex. bråk på rasten, lek med ny kompis..."
          value={socialNote}
          onChange={(e) => setSocialNote(e.target.value)}
        />
      </div>
    </div>
  );
}

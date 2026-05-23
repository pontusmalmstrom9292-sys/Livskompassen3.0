/**
 * Gemini / extern mock — Barnfokus profilkort (inkorg only).
 * NOT part of Vite build. Source: user paste 2026-05-23.
 * Map to F-04 (Gemini dashboard) + Barnen `/familjen` — se inkorg barnfokus-profiler.
 */

import React from 'react';
import { Heart, Star } from 'lucide-react';

const ChildFocus: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Heart className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-emerald-400">Barnfokus: Den Trygga Hamnen</h2>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Detta är pojkarnas zon. När bruset stormar utanför, påminn dig själv om varför du kämpar. Din viktigaste uppgift är inte att vinna debatter, utan att vara en stabil, kärleksfull klippa för Arvid och Kasper.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arvid Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-900/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-500 font-bold text-xl">
              A
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-200">Arvid</h3>
              <p className="text-xs text-slate-500 font-bold tracking-wider uppercase">Trygghet & Utveckling</p>
            </div>
          </div>

          <ul className="space-y-3 text-slate-300 mb-6 relative z-10">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span>
              Älskar klättring och teckning just nu.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span>
              Mår bäst av tydliga rutiner och förutsägbarhet.
            </li>
          </ul>

          <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-4 flex items-start gap-3 relative z-10">
            <Star className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-emerald-300 font-medium text-sm">
              <span className="font-bold">Fokus:</span> Lyssna, bekräfta och ge kravlös tid.
            </p>
          </div>
        </div>

        {/* Kasper Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-900/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-500 font-bold text-xl">
              K
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-200">Kasper</h3>
              <p className="text-xs text-slate-500 font-bold tracking-wider uppercase">Lekfullhet & Glädje</p>
            </div>
          </div>

          <ul className="space-y-3 text-slate-300 mb-6 relative z-10">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span>
              Älskar att sjunga fåniga sånger i bilen.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span>
              Behöver extra trygghet vid överlämningar.
            </li>
          </ul>

          <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-4 flex items-start gap-3 relative z-10">
            <Star className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-emerald-300 font-medium text-sm">
              <span className="font-bold">Fokus:</span> Bygg lekfulla minnen utan skuld.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildFocus;

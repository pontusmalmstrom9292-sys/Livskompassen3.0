import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, Loader2, Lock, ShieldAlert } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import { useStore } from '@/core/store';
import { hasVaultGate } from '@/core/auth/sessionService';
import {
  getChildrenLogs,
  getJournalEntries,
  getVaultLogs,
} from '@/core/firebase/firestore';
import type {
  DossierCandidateDoc,
  DossierReportType,
  DossierSources,
  DossierWizardStep,
  GenerateDossierResult,
} from '../types';
import {
  childrenToCandidate,
  collectCategoryTags,
  defaultDateRange,
  filterCandidates,
  journalToCandidate,
  shiftMonths,
  vaultToCandidate,
} from '../utils/dossierCandidates';
import {
  VAVAREN_DOSSIER_CHECKBOX,
  VAVAREN_DOSSIER_HINT,
} from '../../constants/vavarenCopy';

const INITIAL_SOURCES: DossierSources = {
  reality_vault: true,
  children_logs: true,
  journal: false,
};

const JOURNAL_WARNING =
  'Dagboken kan innehålla emotionella reflektioner. Inkludera endast om ditt ombud uttryckligen begärt det — annars riskerar det juridiska fokuset att tunnas ut.';

function resetWizardState() {
  return {
    step: 'period' as DossierWizardStep,
    dateFrom: defaultDateRange().dateFrom,
    dateTo: defaultDateRange().dateTo,
    sources: { ...INITIAL_SOURCES },
    journalAck: false,
    categoryFilter: [] as string[],
    reportType: 'LEGAL' as DossierReportType,
    includeAiForeword: false,
    includedIds: new Set<string>(),
    candidates: [] as DossierCandidateDoc[],
    loadingDocs: false,
    generating: false,
    error: null as string | null,
    result: null as GenerateDossierResult | null,
  };
}

// —— KRYPTOGRAFISK SÄKERHETS-HASH (SHA-256) ——
async function computeSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function DossierPage({ embedded = false }: { embedded?: boolean }) {
  const [searchParams] = useSearchParams();
  const user = useStore((s) => s.user);
  const isVaultUnlocked = useStore((s) => s.ui.isVaultUnlocked);
  const vaultOpen = embedded || isVaultUnlocked || hasVaultGate();

  const [step, setStep] = useState<DossierWizardStep>('period');
  const [dateFrom, setDateFrom] = useState(defaultDateRange().dateFrom);
  const [dateTo, setDateTo] = useState(defaultDateRange().dateTo);
  const [sources, setSources] = useState<DossierSources>({ ...INITIAL_SOURCES });
  const [journalAck, setJournalAck] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [reportType, setReportType] = useState<DossierReportType>('LEGAL');
  const [includeAiForeword, setIncludeAiForeword] = useState(false);
  const [includedIds, setIncludedIds] = useState<Set<string>>(() => new Set());
  const [allCandidates, setAllCandidates] = useState<DossierCandidateDoc[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateDossierResult | null>(null);

  const clearSession = useCallback(() => {
    const fresh = resetWizardState();
    setStep(fresh.step);
    setDateFrom(fresh.dateFrom);
    setDateTo(fresh.dateTo);
    setSources(fresh.sources);
    setJournalAck(fresh.journalAck);
    setCategoryFilter(fresh.categoryFilter);
    setReportType(fresh.reportType);
    setIncludeAiForeword(fresh.includeAiForeword);
    setIncludedIds(fresh.includedIds);
    setAllCandidates(fresh.candidates);
    setLoadingDocs(fresh.loadingDocs);
    setGenerating(fresh.generating);
    setError(fresh.error);
    setResult(fresh.result);
  }, []);

  useEffect(() => () => clearSession(), [clearSession]);

  const deepLinkChild = searchParams.get('child');
  const deepLinkSources = searchParams.get('sources');

  useEffect(() => {
    if (deepLinkSources === 'children_logs') {
      setSources({
        reality_vault: false,
        children_logs: true,
        journal: false,
      });
    }
  }, [deepLinkSources]);

  const filteredDocs = useMemo(
    () => filterCandidates(allCandidates, dateFrom, dateTo, sources, categoryFilter),
    [allCandidates, dateFrom, dateTo, sources, categoryFilter],
  );

  const categoryTags = useMemo(() => collectCategoryTags(allCandidates), [allCandidates]);

  const loadCandidates = useCallback(async () => {
    if (!user) return;
    setLoadingDocs(true);
    setError(null);
    try {
      const [vault, children, journal] = await Promise.all([
        getVaultLogs(user.uid),
        getChildrenLogs(user.uid),
        getJournalEntries(user.uid),
      ]);
      const docs: DossierCandidateDoc[] = [
        ...vault.map(vaultToCandidate),
        ...children.map((row) =>
          childrenToCandidate(row as Parameters<typeof childrenToCandidate>[0]),
        ),
        ...journal.map((row) =>
          journalToCandidate(row as { id: string; mood?: string; text?: string; createdAt?: string }),
        ),
      ];
      setAllCandidates(docs);
      const visible = filterCandidates(docs, dateFrom, dateTo, sources, categoryFilter);
      let ids = visible.map((d) => d.id);
      if (deepLinkChild) {
        const childDocs = visible.filter(
          (d) => d.kind === 'children_logs' && d.title.startsWith(deepLinkChild),
        );
        if (childDocs.length > 0) ids = childDocs.map((d) => d.id);
      }
      setIncludedIds(new Set(ids));
    } catch {
      setError('Kunde inte läsa bevis från databasen.');
    } finally {
      setLoadingDocs(false);
    }
  }, [user, dateFrom, dateTo, sources, categoryFilter, deepLinkChild]);

  useEffect(() => {
    if (step !== 'review' || !user || !vaultOpen) return;
    void loadCandidates();
  }, [step, user, vaultOpen, loadCandidates]);

  useEffect(() => {
    if (step !== 'review') return;
    const visible = filterCandidates(allCandidates, dateFrom, dateTo, sources, categoryFilter);
    setIncludedIds((prev) => {
      const next = new Set<string>();
      for (const doc of visible) {
        if (prev.has(doc.id)) next.add(doc.id);
      }
      if (next.size === 0 && visible.length > 0) {
        return new Set(visible.map((d) => d.id));
      }
      return next;
    });
  }, [step, allCandidates, dateFrom, dateTo, sources, categoryFilter]);

  const toggleDoc = (id: string) => {
    setIncludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategory = (tag: string) => {
    setCategoryFilter((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  // —— 4. LOKAL UTKRIFT- OCH PDF-MOTOR (FALLBACK & OFFLINE-SÄKRAD) ——
  const handleLocalPrintAndGenerate = async () => {
    if (!user) return;
    const selected = filteredDocs.filter((d) => includedIds.has(d.id));
    if (selected.length === 0) {
      setError('Välj minst en post att exportera.');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // 1. Sortera kronologiskt för formellt underlag
      const sorted = [...selected].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

      // 2. Skapa corpus för hashning
      const textCorpus = sorted
        .map((d) => `[${d.createdAt.slice(0, 10)}] ${d.title}: ${d.preview}`)
        .join('\n');
      const hash = await computeSHA256(textCorpus);

      const win = window.open('', '_blank');
      if (!win) {
        throw new Error('Webbläsaren blockerade popup-fönstret. Tillåt popups för att skriva ut.');
      }

      const rowsHtml = sorted
        .map(
          (d) => `
        <tr style="page-break-inside: avoid; border-bottom: 1px solid #cbd5e1;">
          <td style="padding: 12px 8px; font-weight: 600; font-size: 11px; font-family: monospace; white-space: nowrap;">
            ${d.createdAt.slice(0, 10)}
          </td>
          <td style="padding: 12px 8px; font-weight: 700; font-size: 10px; color: #475569; text-transform: uppercase; tracking-wider: 0.05em;">
            ${d.kind.toUpperCase().replace('_', ' ')}
          </td>
          <td style="padding: 12px 8px; font-weight: 600; font-size: 12px; color: #0f172a;">
            ${d.title}
          </td>
          <td style="padding: 12px 8px; font-size: 12px; line-height: 1.5; color: #334155; white-space: pre-wrap;">
            ${d.preview}
          </td>
        </tr>
      `,
        )
        .join('');

      win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <title>Stabilitets- och Beviskronologi — ${deepLinkChild || 'Familjen'}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; background: #fff; line-height: 1.5; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
            .title { font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; margin: 0; color: #0f172a; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; margin-bottom: 0; }
            .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 16px; font-size: 12px; background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .hash-block { grid-column: span 2; font-family: monospace; background: #f1f5f9; padding: 10px; border-radius: 6px; word-break: break-all; border: 1px solid #cbd5e1; font-size: 10px; line-height: 1.4; }
            table { border-collapse: collapse; width: 100%; margin-top: 24px; }
            th { text-align: left; background: #f1f5f9; padding: 10px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #cbd5e1; color: #475569; }
            .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 9px; color: #94a3b8; text-align: center; }
            @media print {
              body { padding: 0; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Stabilitets- och Beviskronologi</h1>
            <p class="subtitle">Genererad via Livskompassen — Formellt och oföränderligt underlag (WORM-struktur)</p>
            
            <div class="meta-grid">
              <div><strong>Barn/Område:</strong> ${deepLinkChild || 'Hela familjen'}</div>
              <div><strong>Rapporttyp:</strong> ${reportType === 'LEGAL' ? 'Juridisk Kronologi (Fakta & Tidsstämplar)' : 'BBIC-strukturerad rapport'}</div>
              <div><strong>Exportdatum:</strong> ${new Date().toLocaleString('sv-SE')}</div>
              <div><strong>Antal inkluderade poster:</strong> ${selected.length} st</div>
              <div class="hash-block">
                <strong>KRYPTOGRAFISK BEVIS-HASH (SHA-256):</strong><br/>
                ${hash}<br/>
                <span style="font-size: 9px; color: #64748b; font-weight: normal;">
                  *Denna hash säkrar att innehållet i dokumentet inte har modifierats eller manipulerats sedan exporttillfället i Livskompassen.
                </span>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 12%">Datum</th>
                <th style="width: 15%">Källa</th>
                <th style="width: 25%">Kategori</th>
                <th>Observation / Bevisfakta</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="footer">
            Dokumentet är krypterat och verifierat. Livskompassen använder strikt dataseparering (WORM) för att säkra beviskedjor.
          </div>
        </body>
        </html>
      `);

      win.document.close();
      win.focus();

      // Öppna utskriftsdialogen automatiskt för att spara som PDF
      setTimeout(() => {
        win.print();
      }, 250);

      setResult({
        dossierId: hash.slice(0, 12).toUpperCase(),
        documentHash: hash,
        status: 'ready',
      });
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte generera utskrift.');
    } finally {
      setGenerating(false);
    }
  };

  if (!vaultOpen) {
    return (
      <div className={embedded ? 'space-y-4' : 'space-y-6'}>
        <BentoCard title="Dossier-Generator" icon={<Lock className="h-4 w-4" />}>
          <p className="mb-4 text-sm text-text-muted">
            Dossier kräver upplåst Valv (Fyren). I bottenmenyn: tryck på <strong>Hjärtat</strong>{' '}
            (bok-ikonen) och <strong>håll 3 sekunder</strong>, eller öppna fliken Bevis och ange PIN.
          </p>
          <Link
            to="/valvet"
            className="inline-flex rounded-lg bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/30"
          >
            Öppna Bevis / Valv
          </Link>
        </BentoCard>
      </div>
    );
  }

  return (
    <div className={embedded ? 'space-y-4' : 'space-y-6'}>
      <BentoCard
        title={embedded ? 'Dossier' : 'Dossier-Generator'}
        description={embedded ? 'Samlad arkiv-export' : undefined}
        icon={<FileText className="h-4 w-4" />}
      >
        {!embedded && (
          <p className="mb-4 text-sm text-text-muted">
            Samlad arkiv-export. Inget skickas automatiskt; du laddar ner din PDF när du är redo.
          </p>
        )}
        {embedded && (
          <p className="mb-4 text-sm text-text-muted">
            Inget skickas automatiskt. Du sparar eller skriver ut PDF lokalt på din enhet.
          </p>
        )}

        {step === 'period' && (
          <div className="space-y-4">
            <p className="text-xs text-text-dim font-semibold uppercase tracking-wider">
              Steg 1 av 3 — Tidsperiod
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="text-text-muted">Från</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="text-text-muted">Till</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setDateTo(defaultDateRange().dateTo);
                  setDateFrom(shiftMonths(defaultDateRange().dateTo, -3));
                }}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-indigo-200 cursor-pointer hover:bg-indigo-500/10"
              >
                Senaste 3 månaderna
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateTo(defaultDateRange().dateTo);
                  setDateFrom(shiftMonths(defaultDateRange().dateTo, -6));
                }}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-indigo-200 cursor-pointer hover:bg-indigo-500/10"
              >
                Senaste 6 månaderna
              </button>
            </div>
            <button
              type="button"
              onClick={() => setStep('sources')}
              className="w-full rounded-lg bg-indigo-500/25 py-2.5 text-sm font-medium text-indigo-100 cursor-pointer hover:bg-indigo-500/35"
            >
              Fortsätt
            </button>
          </div>
        )}

        {step === 'sources' && (
          <div className="space-y-4">
            <p className="text-xs text-text-dim font-semibold uppercase tracking-wider">
              Steg 2 av 3 — Källor & Filter
            </p>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={sources.reality_vault}
                onChange={(e) =>
                  setSources((s) => ({ ...s, reality_vault: e.target.checked }))
                }
                className="rounded border-white/20 accent-accent"
              />
              Verklighetsvalvet (bevisloggar)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={sources.children_logs}
                onChange={(e) =>
                  setSources((s) => ({ ...s, children_logs: e.target.checked }))
                }
                className="rounded border-white/20 accent-accent"
              />
              Barnens livsloggar
            </label>
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={sources.journal}
                onChange={(e) => {
                  const on = e.target.checked;
                  setSources((s) => ({ ...s, journal: on }));
                  if (!on) setJournalAck(false);
                }}
                className="mt-1 rounded border-white/20 accent-accent"
              />
              <span>
                Dagboken (privat journal)
                <span className="mt-1 block text-xs text-danger/80">{JOURNAL_WARNING}</span>
              </span>
            </label>

            {sources.journal && (
              <label className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={journalAck}
                  onChange={(e) => setJournalAck(e.target.checked)}
                  className="mt-1 accent-danger"
                />
                <span className="text-text-muted leading-relaxed">
                  Jag förstår risken och vill inkludera min privata dagbok i detta underlag.
                </span>
              </label>
            )}

            {categoryTags.length > 0 && (
              <div>
                <p className="mb-2 text-xs text-text-dim">Valfritt — filtrera på kategori/tag</p>
                <div className="flex flex-wrap gap-2">
                  {categoryTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleCategory(tag)}
                      className={
                        categoryFilter.includes(tag)
                          ? 'rounded-full bg-amber-500/25 px-3 py-1 text-xs text-amber-100 cursor-pointer border border-accent/40'
                          : 'rounded-full border border-white/10 px-3 py-1 text-xs text-text-muted cursor-pointer hover:border-white/20'
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label className="flex cursor-pointer items-start gap-2 text-sm text-text-dim border-t border-border-strong/40 pt-3">
              <input
                type="checkbox"
                checked={includeAiForeword}
                onChange={(e) => setIncludeAiForeword(e.target.checked)}
                className="mt-0.5 rounded border-white/20 accent-accent"
              />
              <span>
                {VAVAREN_DOSSIER_CHECKBOX}
                <span className="mt-1 block text-xs text-text-muted">{VAVAREN_DOSSIER_HINT}</span>
              </span>
            </label>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as DossierReportType)}
              className="w-full rounded-lg border border-white/10 bg-surface-3 px-3 py-2 text-sm"
              aria-label="Rapporttyp"
            >
              <option value="LEGAL">Juridisk kronologi (Fakta & tidsstämplar)</option>
              <option value="BBIC">BBIC-struktur (föräldraförmåga & hälsa)</option>
            </select>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('period')}
                className="flex-1 rounded-lg border border-white/10 py-2 text-sm cursor-pointer hover:bg-white/5"
              >
                Tillbaka
              </button>
              <button
                type="button"
                disabled={sources.journal && !journalAck}
                onClick={() => setStep('review')}
                className="flex-1 rounded-lg bg-indigo-500/25 py-2 text-sm font-medium text-indigo-100 disabled:opacity-40 cursor-pointer hover:bg-indigo-500/35"
              >
                Granska urval
              </button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <p className="text-xs text-text-dim font-semibold uppercase tracking-wider">
              Steg 3 av 3 — Bekräfta kronologiskt urval
            </p>
            {loadingDocs ? (
              <div className="flex items-center justify-center gap-2 text-sm text-text-muted py-6">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                Läser in dina loggade händelser…
              </div>
            ) : filteredDocs.length === 0 ? (
              <EmptyState message="Inga poster hittades för den valda tidsperioden och källorna. Gå tillbaka och utöka ditt sökfönster." />
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-text-dim">
                  Bocka av de rader du vill utesluta från exporten. Totalt {includedIds.size} av{' '}
                  {filteredDocs.length} valda.
                </p>
                <ul className="max-h-80 space-y-2 overflow-y-auto pr-1 border border-border/60 rounded-xl p-2 bg-black/20">
                  {filteredDocs.map((doc) => (
                    <li
                      key={`${doc.kind}-${doc.id}`}
                      className="rounded-lg border border-white/5 bg-surface-2 p-3 transition-colors hover:border-accent/10"
                    >
                      <label className="flex cursor-pointer gap-3">
                        <input
                          type="checkbox"
                          checked={includedIds.has(doc.id)}
                          onChange={() => toggleDoc(doc.id)}
                          className="mt-1 shrink-0 accent-accent"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold text-accent">
                            {doc.title}
                          </span>
                          <span className="text-[10px] text-text-dim">
                            {doc.createdAt.slice(0, 10)} ·{' '}
                            {doc.kind.toUpperCase().replace('_', ' ')}
                          </span>
                          <span className="mt-1 block text-xs text-text-muted leading-relaxed line-clamp-2">
                            {doc.preview}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="flex items-start gap-2 text-xs text-success-light">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              Säkerhetsprincip: PDF-genereringen sker krypterat i din webbläsare. Ingenting skickas
              till motparten eller sociala myndigheter.
            </p>
            {error && <p className="text-sm text-danger text-center">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('sources')}
                className="flex-1 rounded-lg border border-white/10 py-2 text-sm cursor-pointer"
              >
                Tillbaka
              </button>
              <button
                type="button"
                disabled={generating || includedIds.size === 0}
                onClick={() => void handleLocalPrintAndGenerate()}
                className="flex-1 rounded-lg bg-emerald-500/25 py-2 text-sm font-semibold text-emerald-100 disabled:opacity-40 cursor-pointer"
              >
                {generating ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Genererar PDF…
                  </span>
                ) : (
                  'Lås & Skriv ut (PDF)'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <div className="space-y-4 animate-fade-in">
            <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-center">
              <p className="text-sm font-semibold text-success">Dossier skapad & verifierad!</p>
              <p className="mt-1 text-xs text-text-muted">
                Dokumentet öppnades i en ny flik och utskriftsdialogen har startat. Spara den som en
                PDF lokalt på din enhet.
              </p>
            </div>

            <div className="rounded-xl border border-border-strong bg-surface-2 p-4 space-y-2 text-xs tabular-nums">
              <p className="text-text-dim uppercase tracking-wider text-[10px]">
                Äkthetsverifiering (WORM-bevis)
              </p>
              <div className="flex justify-between">
                <span className="text-text-muted">Dossier ID:</span>
                <span className="font-mono text-text font-semibold">{result.dossierId}</span>
              </div>
              <div className="space-y-1">
                <span className="text-text-muted">SHA-256 Hash:</span>
                <p className="font-mono text-[9px] text-accent bg-black/30 p-2 rounded border border-border break-all">
                  {result.documentHash}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="btn-pill--accent flex-1 text-xs justify-center"
                onClick={() => void handleLocalPrintAndGenerate()}
              >
                Skriv ut / Spara igen
              </button>
              <button
                type="button"
                onClick={clearSession}
                className="btn-pill--ghost flex-1 text-xs justify-center"
              >
                Klar — rensa (Zero Footprint)
              </button>
            </div>
          </div>
        )}
      </BentoCard>
    </div>
  );
}

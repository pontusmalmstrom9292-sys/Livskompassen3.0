import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, Loader2, Lock, ShieldAlert } from 'lucide-react';
import { BentoCard } from '../../../../core/ui/BentoCard';
import { EmptyState } from '../../../../core/ui/EmptyState';
import { useStore } from '../../../../core/store';
import { hasVaultGate } from '../../../../core/auth/sessionService';
import {
  getChildrenLogs,
  getJournalEntries,
  getVaultLogs,
} from '../../../../core/firebase/firestore';
import { generateDossier } from '../api/dossierService';
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
  groupIncludedIds,
  journalToCandidate,
  shiftMonths,
  vaultToCandidate,
} from '../utils/dossierCandidates';

const INITIAL_SOURCES: DossierSources = {
  reality_vault: true,
  children_logs: true,
  journal: false,
};

const JOURNAL_WARNING =
  'Dagbok kan innehålla emotionell reflektion. Inkludera endast om ombud begärt det — annars riskerar juridiskt fokus att tunnas ut.';

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

type DossierPageProps = {
  /** Inbäddad i Verklighetsvalvet — Fyren/PIN redan uppfylld av förälder. */
  embedded?: boolean;
};

export function DossierPage({ embedded = false }: DossierPageProps) {
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

  const handleGenerate = async () => {
    if (!user) return;
    const selected = filteredDocs.filter((d) => includedIds.has(d.id));
    if (selected.length === 0) {
      setError('Välj minst ett dokument att inkludera.');
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const payload = {
        dateFrom,
        dateTo,
        sources,
        reportType,
        includeAiForeword,
        categoryFilter: categoryFilter.length ? categoryFilter : undefined,
        includedDocIds: groupIncludedIds(filteredDocs, includedIds),
      };
      const data = await generateDossier(payload);
      setResult(data);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generering misslyckades.');
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
            to="/dagbok?tab=bevis"
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
        description={embedded ? 'Samlad WORM-export' : undefined}
        icon={<FileText className="h-4 w-4" />}
      >
        {!embedded && (
          <p className="mb-4 text-sm text-text-muted">
            Sacred Feature — samlad WORM-export. Inget skickas automatiskt; du laddar ner när du är
            redo.
          </p>
        )}
        {embedded && (
          <p className="mb-4 text-sm text-text-muted">
            Inget skickas automatiskt. Du laddar ner PDF lokalt när den är klar.
          </p>
        )}

        {step === 'period' && (
          <div className="space-y-4">
            <p className="text-xs text-text-dim">Steg 1 av 3 — tidsperiod</p>
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
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-indigo-200"
              >
                Senaste 3 månaderna
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateTo(defaultDateRange().dateTo);
                  setDateFrom(shiftMonths(defaultDateRange().dateTo, -6));
                }}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-indigo-200"
              >
                Senaste 6 månaderna
              </button>
            </div>
            <button
              type="button"
              onClick={() => setStep('sources')}
              className="w-full rounded-lg bg-indigo-500/25 py-2.5 text-sm font-medium text-indigo-100"
            >
              Fortsätt
            </button>
          </div>
        )}

        {step === 'sources' && (
          <div className="space-y-4">
            <p className="text-xs text-text-dim">Steg 2 av 3 — källor</p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sources.reality_vault}
                onChange={(e) =>
                  setSources((s) => ({ ...s, reality_vault: e.target.checked }))
                }
                className="rounded border-white/20"
              />
              Verklighetsvalvet (bevis)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sources.children_logs}
                onChange={(e) =>
                  setSources((s) => ({ ...s, children_logs: e.target.checked }))
                }
                className="rounded border-white/20"
              />
              Barnens livsloggar
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={sources.journal}
                onChange={(e) => {
                  const on = e.target.checked;
                  setSources((s) => ({ ...s, journal: on }));
                  if (!on) setJournalAck(false);
                }}
                className="mt-1 rounded border-white/20"
              />
              <span>
                Dagbok (journal)
                <span className="mt-1 block text-xs text-amber-200/90">{JOURNAL_WARNING}</span>
              </span>
            </label>
            {sources.journal && (
              <label className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={journalAck}
                  onChange={(e) => setJournalAck(e.target.checked)}
                  className="mt-1"
                />
                <span>Jag förstår risken och vill inkludera dagbok i urvalet.</span>
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
                          ? 'rounded-full bg-amber-500/25 px-3 py-1 text-xs text-amber-100'
                          : 'rounded-full border border-white/10 px-3 py-1 text-xs text-text-muted'
                      }
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <label className="flex items-center gap-2 text-sm text-text-dim">
              <input
                type="checkbox"
                checked={includeAiForeword}
                onChange={(e) => setIncludeAiForeword(e.target.checked)}
                className="rounded border-white/20"
              />
              Valfritt AI-försätt (Vävaren) — bevisdelen förblir ordagrant WORM
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as DossierReportType)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
              aria-label="Rapporttyp"
            >
              <option value="LEGAL">Juridisk kronologi (MVP)</option>
              <option value="BBIC" disabled>
                BBIC-struktur (fas 2)
              </option>
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('period')}
                className="flex-1 rounded-lg border border-white/10 py-2 text-sm"
              >
                Tillbaka
              </button>
              <button
                type="button"
                disabled={sources.journal && !journalAck}
                onClick={() => setStep('review')}
                className="flex-1 rounded-lg bg-indigo-500/25 py-2 text-sm font-medium text-indigo-100 disabled:opacity-40"
              >
                Fortsätt till granskning
              </button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <p className="text-xs text-text-dim">
              Steg 3 av 3 — hela dokument (avmarkera det som inte ska med)
            </p>
            {loadingDocs ? (
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Läser bevis…
              </div>
            ) : filteredDocs.length === 0 ? (
              <EmptyState message="Inga poster i vald period och källor. Ändra period eller källor." />
            ) : (
              <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {filteredDocs.map((doc) => (
                  <li
                    key={`${doc.kind}-${doc.id}`}
                    className="rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <label className="flex cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        checked={includedIds.has(doc.id)}
                        onChange={() => toggleDoc(doc.id)}
                        className="mt-1 shrink-0"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-amber-100/90">
                          {doc.title}
                        </span>
                        <span className="text-xs text-text-dim">
                          {doc.createdAt.slice(0, 10)} · {doc.kind.replace('_', ' ')}
                        </span>
                        <span className="mt-1 block text-xs text-text-muted">{doc.preview}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <p className="flex items-start gap-2 text-xs text-emerald-200/80">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Dokumentet skickas inte till någon. Du laddar ner lokalt när backend är kopplad.
            </p>
            {error && <p className="text-sm text-red-300/90">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('sources')}
                className="flex-1 rounded-lg border border-white/10 py-2 text-sm"
              >
                Tillbaka
              </button>
              <button
                type="button"
                disabled={generating || includedIds.size === 0}
                onClick={() => void handleGenerate()}
                className="flex-1 rounded-lg bg-amber-500/25 py-2 text-sm font-medium text-amber-100 disabled:opacity-40"
              >
                {generating ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Genererar…
                  </span>
                ) : (
                  'Generera låst dossier'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-4">
            {result?.status === 'ready' && (result.downloadUrl || result.pdfBase64) ? (
              <>
                <p className="text-sm text-emerald-200/90">
                  Dossier skapad. Inget har skickats externt.
                </p>
                {result.dossierId && (
                  <p className="text-xs text-text-dim">
                    ID: <span className="font-mono text-text-muted">{result.dossierId}</span>
                  </p>
                )}
                <p className="text-sm text-text-muted">
                  Hash (SHA-256):{' '}
                  <code className="break-all text-xs text-amber-100/90">{result.documentHash}</code>
                </p>
                <p className="text-xs text-text-dim">
                  {result.downloadUrl
                    ? 'Nedladdningslänk gäller ca 24 timmar (Zero Footprint i molnet).'
                    : 'PDF levereras direkt (signed URL ej tillgänglig i projektet).'}
                </p>
                <a
                  href={
                    result.downloadUrl ??
                    `data:application/pdf;base64,${result.pdfBase64 ?? ''}`
                  }
                  download={result.dossierId ? `dossier-${result.dossierId}.pdf` : 'dossier.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-emerald-500/25 py-2.5 text-center text-sm font-medium text-emerald-100"
                >
                  Ladda ner PDF
                </a>
              </>
            ) : (
              <EmptyState
                message={
                  result?.jobId
                    ? `Generering pågår (job ${result.jobId}). Poll kommer i nästa fas.`
                    : error || 'Generering slutfördes utan nedladdningslänk. Försök igen.'
                }
              />
            )}
            <p className="text-xs text-text-dim">
              Inget har skickats till ombud, socialtjänst eller motpart.
            </p>
            <button
              type="button"
              onClick={clearSession}
              className="w-full rounded-lg border border-white/10 py-2 text-sm"
            >
              Klar — rensa urval (Zero Footprint)
            </button>
          </div>
        )}
      </BentoCard>
    </div>
  );
}

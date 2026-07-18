import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Loader2, Lock, ShieldAlert } from 'lucide-react';
import { Button, ButtonLink } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { EmptyState } from '@/core/ui/EmptyState';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { StepIndicator } from '@/core/ui/StepIndicator';
import { useStore } from '@/core/store';
import { hasVaultGate } from '@/core/auth/sessionService';
import {
  getChildrenLogs,
  getJournalEntries,
  getAllVaultLogs,
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
  collectTechniqueTags,
  defaultDateRange,
  filterCandidates,
  groupIncludedIds,
  journalToCandidate,
  shiftMonths,
  vaultToCandidate,
} from '../utils/dossierCandidates';
import { generateDossier } from '../api/dossierService';
import { downloadViaNativeAndroid } from '@/shared/utils/nativeSecureDownload';
import {
  buildTechniquesByLogId,
  fetchPatternScanMetadata,
} from '../../api/patternScanMetadataApi';
import {
  VAVAREN_DOSSIER_CHECKBOX,
  VAVAREN_DOSSIER_HINT,
} from '../../constants/vavarenCopy';
import { printDossierFallback } from '../utils/exportDossierPrint';

const INITIAL_SOURCES: DossierSources = {
  reality_vault: true,
  children_logs: true,
  journal: false,
};

const JOURNAL_WARNING =
  'Dagboken kan innehålla emotionella reflektioner. Inkludera endast om ditt ombud uttryckligen begärt det — annars riskerar det juridiska fokuset att tunnas ut.';

const DOSSIER_WIZARD_STEPS = [
  { key: 'period', label: 'Period' },
  { key: 'sources', label: 'Källor' },
  { key: 'review', label: 'Granska' },
] as const;

function resetWizardState() {
  return {
    step: 'period' as DossierWizardStep,
    dateFrom: defaultDateRange().dateFrom,
    dateTo: defaultDateRange().dateTo,
    sources: { ...INITIAL_SOURCES },
    journalAck: false,
    categoryFilter: [] as string[],
    techniqueFilter: [] as string[],
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
  const [techniqueFilter, setTechniqueFilter] = useState<string[]>([]);
  const [techniquesByVaultId, setTechniquesByVaultId] = useState<Map<string, string[]>>(
    () => new Map(),
  );
  const [reportType, setReportType] = useState<DossierReportType>('LEGAL');
  const [includeAiForeword, setIncludeAiForeword] = useState(false);
  const [showTimelinePreview, setShowTimelinePreview] = useState(true);
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
    setTechniqueFilter(fresh.techniqueFilter);
    setTechniquesByVaultId(new Map());
    setReportType(fresh.reportType);
    setIncludeAiForeword(fresh.includeAiForeword);
    setShowTimelinePreview(true);
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
    if (!user || !vaultOpen) return;
    void fetchPatternScanMetadata(user.uid).then((rows) => {
      setTechniquesByVaultId(buildTechniquesByLogId(rows));
    });
  }, [user, vaultOpen]);

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
    () =>
      filterCandidates(
        allCandidates,
        dateFrom,
        dateTo,
        sources,
        categoryFilter,
        techniqueFilter,
        techniquesByVaultId,
      ),
    [allCandidates, dateFrom, dateTo, sources, categoryFilter, techniqueFilter, techniquesByVaultId],
  );

  const categoryTags = useMemo(() => collectCategoryTags(allCandidates), [allCandidates]);
  const techniqueTags = useMemo(
    () => collectTechniqueTags(techniquesByVaultId),
    [techniquesByVaultId],
  );

  const loadCandidates = useCallback(async () => {
    if (!user) return;
    setLoadingDocs(true);
    setError(null);
    try {
      const [vault, children, journal, patternRows] = await Promise.all([
        getAllVaultLogs(user.uid),
        getChildrenLogs(user.uid),
        getJournalEntries(user.uid),
        fetchPatternScanMetadata(user.uid),
      ]);
      setTechniquesByVaultId(buildTechniquesByLogId(patternRows));
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
      const visible = filterCandidates(
        docs,
        dateFrom,
        dateTo,
        sources,
        categoryFilter,
        techniqueFilter,
        buildTechniquesByLogId(patternRows),
      );
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
  }, [user, dateFrom, dateTo, sources, categoryFilter, techniqueFilter, deepLinkChild]);

  useEffect(() => {
    if (step !== 'review' || !user || !vaultOpen) return;
    void loadCandidates();
  }, [step, user, vaultOpen, loadCandidates]);

  useEffect(() => {
    if (step !== 'review') return;
    const visible = filterCandidates(
      allCandidates,
      dateFrom,
      dateTo,
      sources,
      categoryFilter,
      techniqueFilter,
      techniquesByVaultId,
    );
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
  }, [step, allCandidates, dateFrom, dateTo, sources, categoryFilter, techniqueFilter, techniquesByVaultId]);

  const toggleDoc = (id: string) => {
    setIncludedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleTechnique = (tag: string) => {
    setTechniqueFilter((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const toggleCategory = (tag: string) => {
    setCategoryFilter((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const downloadFromResult = (gen: GenerateDossierResult) => {
    const fileName = `dossier-${new Date().toISOString().slice(0, 10)}.pdf`;
    if (
      downloadViaNativeAndroid({
        downloadUrl: gen.downloadUrl,
        pdfBase64: gen.pdfBase64,
        fileName,
        mimeType: 'application/pdf',
      })
    ) {
      return;
    }
    if (gen.downloadUrl) {
      window.open(gen.downloadUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (gen.pdfBase64) {
      const win = window.open('', '_blank');
      if (!win) throw new Error('Webbläsaren blockerade popup-fönstret.');
      win.location.href = `data:application/pdf;base64,${gen.pdfBase64}`;
      win.focus();
    }
  };

  const handleGenerateDossier = async () => {
    if (!user) return;
    const selected = filteredDocs.filter((d) => includedIds.has(d.id));
    if (selected.length === 0) {
      setError('Välj minst en post att exportera.');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const gen = await generateDossier({
        dateFrom,
        dateTo,
        sources,
        reportType,
        includeAiForeword,
        categoryFilter: categoryFilter.length > 0 ? categoryFilter : undefined,
        techniqueFilter: techniqueFilter.length > 0 ? techniqueFilter : undefined,
        includedDocIds: groupIncludedIds(selected, includedIds),
      });
      downloadFromResult(gen);
      setResult(gen);
      setStep('result');
    } catch (backendErr) {
      const message = backendErr instanceof Error ? backendErr.message : 'Generering misslyckades.';
      if (!message.includes('inte deployad')) {
        setError(message);
        setGenerating(false);
        return;
      }
      await handleLocalPrintFallback(selected);
      return;
    } finally {
      setGenerating(false);
    }
  };

  // —— Lokal utskrift (fallback när callable saknas) ——
  const handleLocalPrintFallback = async (selected: DossierCandidateDoc[]) => {
    setGenerating(true);
    setError(null);

    try {
      const hash = await printDossierFallback({
        selected,
        reportType,
        includeAiForeword,
        childLabel: deepLinkChild || 'Hela familjen',
      });

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
      <div className={`valv-zone-stack ${embedded ? 'space-y-4' : 'space-y-6'}`}>
        <BentoCard title="Dossier-Generator" icon={<Lock className="h-4 w-4" />}>
          <p className="mb-4 text-sm text-text-muted">
            Dossier kräver upplåst Valv (Fyren). I bottenmenyn: tryck på <strong>Hjärtat</strong>{' '}
            (bok-ikonen) och <strong>håll 3 sekunder</strong>, eller öppna Valvet och tryck <strong>Lås upp Valvet (biometri)</strong>.
          </p>
          <ButtonLink to="/valvet" variant="secondary" size="sm" className="inline-flex">
            Öppna Arkiv
          </ButtonLink>
        </BentoCard>
      </div>
    );
  }

  return (
    <div className={`valv-zone-stack ${embedded ? 'space-y-4' : 'space-y-6'}`}>
      <BentoCard
        title={embedded ? 'Dossier' : 'Dossier-Generator'}
        description={embedded ? 'Samlad arkiv-export' : undefined}
        icon={<FileText className="h-4 w-4" />}
        glow="blue"
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

        {step !== 'result' ? (
          <StepIndicator steps={[...DOSSIER_WIZARD_STEPS]} currentKey={step} />
        ) : null}

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
                  className="input-glass mt-1 w-full rounded-lg px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="text-text-muted">Till</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="input-glass mt-1 w-full rounded-lg px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDateTo(defaultDateRange().dateTo);
                  setDateFrom(shiftMonths(defaultDateRange().dateTo, -3));
                }}
              >
                Senaste 3 månaderna
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDateTo(defaultDateRange().dateTo);
                  setDateFrom(shiftMonths(defaultDateRange().dateTo, -6));
                }}
              >
                Senaste 6 månaderna
              </Button>
            </div>
            <Button type="button" variant="accent" className="w-full" onClick={() => setStep('sources')}>
              Fortsätt
            </Button>
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
                className="rounded border-border accent-accent"
              />
              Arkiv (bevisloggar)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={sources.children_logs}
                onChange={(e) =>
                  setSources((s) => ({ ...s, children_logs: e.target.checked }))
                }
                className="rounded border-border accent-accent"
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
                className="mt-1 rounded border-border accent-accent"
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

            <CalmCollapsible title="Valfria filter" meta="Taktik & kategori" defaultOpen={false} glow="blue">
              {techniqueTags.length > 0 ? (
                <div className="mb-3">
                  <p className="mb-2 text-xs text-text-dim">
                    Filtrera valv på taktik (sidecar-metadata)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {techniqueTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTechnique(tag)}
                        className={
                          techniqueFilter.includes(tag)
                            ? 'rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs text-accent cursor-pointer'
                            : 'rounded-full border border-border px-3 py-1 text-xs text-text-muted cursor-pointer hover:border-accent/25'
                        }
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-dim">Inga taktik-taggar i sidecar ännu.</p>
              )}

              {categoryTags.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs text-text-dim">Filtrera på kategori/tag</p>
                  <div className="flex flex-wrap gap-2">
                    {categoryTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleCategory(tag)}
                        className={
                          categoryFilter.includes(tag)
                            ? 'rounded-full bg-amber-500/25 px-3 py-1 text-xs text-amber-100 cursor-pointer border border-accent/40'
                            : 'rounded-full border border-border px-3 py-1 text-xs text-text-muted cursor-pointer hover:border-accent/25'
                        }
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </CalmCollapsible>

            <CalmCollapsible title="AI-förord & tidslinje" meta="Valfritt" defaultOpen={false} glow="blue">
              <label className="flex cursor-pointer items-start gap-2 text-sm text-text-dim">
                <input
                  type="checkbox"
                  checked={includeAiForeword}
                  onChange={(e) => {
                    setIncludeAiForeword(e.target.checked);
                    if (!e.target.checked) setShowTimelinePreview(false);
                  }}
                  className="mt-0.5 rounded border-border accent-accent"
                />
                <span>
                  {VAVAREN_DOSSIER_CHECKBOX}
                  <span className="mt-1 block text-xs text-text-muted">{VAVAREN_DOSSIER_HINT}</span>
                </span>
              </label>

              {includeAiForeword ? (
                <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm text-text-dim pl-1">
                  <input
                    type="checkbox"
                    checked={showTimelinePreview}
                    onChange={(e) => setShowTimelinePreview(e.target.checked)}
                    className="mt-0.5 rounded border-border accent-accent"
                  />
                  <span>
                    Visa AI-tidslinje i förhandsgranskning
                    <span className="mt-1 block text-xs text-text-muted">
                      Efter export — sammanfattning utanför WORM-hash.
                    </span>
                  </span>
                </label>
              ) : null}
            </CalmCollapsible>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as DossierReportType)}
              className="input-glass w-full rounded-lg px-3 py-2 text-sm"
              aria-label="Rapporttyp"
            >
              <option value="LEGAL">Juridisk kronologi (Fakta & tidsstämplar)</option>
              <option value="BBIC">BBIC-struktur (föräldraförmåga & hälsa)</option>
            </select>

            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={() => setStep('period')}>
                Tillbaka
              </Button>
              <Button
                type="button"
                variant="accent"
                size="sm"
                className="flex-1"
                disabled={sources.journal && !journalAck}
                onClick={() => setStep('review')}
              >
                Granska urval
              </Button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <p className="text-xs text-text-dim font-semibold uppercase tracking-wider">
              Steg 3 av 3 — Bekräfta kronologiskt urval
            </p>
            {loadingDocs ? (
              <HubPanelSkeleton label="Läser in dina loggade händelser…" lines={5} />
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
                      className="rounded-lg border border-border bg-surface-2 p-3 transition-colors hover:border-accent/20"
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
              <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={() => setStep('sources')}>
                Tillbaka
              </Button>
              <button
                type="button"
                disabled={generating || includedIds.size === 0}
                onClick={() => {
                  const isSure = window.confirm(
                    "Är du helt säker på att du vill skapa och ladda ner denna känsliga Dossier?\n\nDetta skapar ett permanent och låst spår i valvet."
                  );
                  if (isSure) {
                    void handleGenerateDossier();
                  }
                }}
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
                Äkthetsverifiering (låst post)
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

            {includeAiForeword &&
              showTimelinePreview &&
              result.aiForeword &&
              result.aiForeword.timeline.length > 0 && (
                <div className="rounded-xl border border-accent-secondary/25 bg-accent-secondary/5 p-4 space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-secondary/90">
                    AI-tidslinje (förhandsgranskning)
                  </p>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-6">
                    {result.aiForeword.foreword}
                  </p>
                  <ul className="max-h-48 space-y-2 overflow-y-auto pr-1">
                    {result.aiForeword.timeline.map((row, idx) => (
                      <li
                        key={`${row.date}-${idx}`}
                        className="rounded-lg border border-border bg-surface-2/80 px-3 py-2 text-xs"
                      >
                        <span className="font-mono text-accent">{row.date}</span>
                        <span className="mt-0.5 block text-text-muted">{row.fact}</span>
                        {row.sourceRef && (
                          <span className="mt-1 block font-mono text-[10px] text-text-dim">
                            ref: {row.sourceRef}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-text-dim">
                    Sammanfattning — bevisdelen i PDF är ordagrant WORM.
                  </p>
                </div>
              )}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="accent"
                size="sm"
                className="flex-1 justify-center"
                onClick={() => void handleGenerateDossier()}
              >
                Skriv ut / Spara igen
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex-1 justify-center"
                onClick={clearSession}
              >
                Klar — rensa från enheten
              </Button>
            </div>
          </div>
        )}
      </BentoCard>
    </div>
  );
}

/**
 * @locked MOD-CORE-UTV — låst modul; unlock via docs/evaluations/*-unlock-MOD-CORE-UTV.md
 * Utvecklingskort — fällbar spontan Bento-mix (Hem + MåBra).
 * 6→12–16 självblandade kort; Klar → bankId aldrig igen; packs + egna kategorier.
 * Ingen cross-RAG, ingen runtime-AI-fakta.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Layers, Package, Plus, Share2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Skeleton, TextArea } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useNativeHaptics } from '@/shared/utils/nativeHaptics';
import { getLivskompassenNative } from '@/shared/utils/nativeSecureDownload';
import { ensureVitHub, listVitEntries, saveVitEntry } from '@/core/firebase/vitHubFirestore';
import { getRecentCheckIns, getJournalEntries } from '@/core/firebase/firestore';
import { shouldRedirectMabraCoachToSpeglar } from '@/features/dailyLife/wellbeing/mabra/lib/mabraCoachGuard';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { useStore } from '../store';
import { useEvolutionStore } from '../store/useEvolutionStore';
import { useCapacityScore, useListenToCapacityState } from '../store/useCapacityGate';
import { useLifeHubPreset } from '../lifeOs/useLifeHubPreset';
import { isLowHomeCapacity } from './homeCapacityGate';
import {
  buildHomeSignalSnapshot,
  filterCheckInsToday,
} from './dev/homeSignalSnapshot';
import { buildDevMix, refillDevMixSlot } from './dev/buildDevMix';
import {
  DEV_MIX_TARGET_DEFAULT,
  DEV_MIX_TARGET_LOW_CAPACITY,
  DEV_MIX_VISIBLE_INITIAL,
  type CustomCategory,
  type DevMixCard,
} from './dev/contentPackTypes';
import { FetchContentPacksFlow } from './dev/FetchContentPacksFlow';
import { CustomCategoryFlow } from './dev/CustomCategoryFlow';

type Props = {
  refreshKey?: number;
  /** Dölj yttre Bento-titel när host redan har collapsible-rubrik. */
  embedded?: boolean;
};

export function DevelopmentBentoWidget({ refreshKey = 0, embedded = false }: Props) {
  const user = useStore((s) => s.user);
  const evolutionDoc = useEvolutionStore((s) => s.doc);
  const listenToEvolutionHub = useEvolutionStore((s) => s.listenToEvolutionHub);
  const getChildBracket = useEvolutionStore((s) => s.getChildBracket);
  const capacityScore = useCapacityScore();
  const listenToCapacityState = useListenToCapacityState();
  const { presetId } = useLifeHubPreset();
  const { success: triggerSuccess, tick: triggerTick } = useNativeHaptics();
  const [searchParams] = useSearchParams();

  const unlockedPacks = evolutionDoc?.unlockedPacks ?? [];
  const customCategories = useMemo(
    () => (evolutionDoc?.customDevCategories ?? []) as CustomCategory[],
    [evolutionDoc?.customDevCategories],
  );
  const lowCapacity = isLowHomeCapacity(evolutionDoc, capacityScore);

  const [completedBankIds, setCompletedBankIds] = useState<Set<string>>(new Set());
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [journalExistsToday, setJournalExistsToday] = useState(false);
  const [compassOptionsToday, setCompassOptionsToday] = useState<string[]>([]);
  const [mix, setMix] = useState<DevMixCard[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveHint, setSaveHint] = useState<string | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState<Set<string>>(new Set());
  const [speglarHint, setSpeglarHint] = useState(false);
  const [packOpen, setPackOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [mixNonce, setMixNonce] = useState(0);

  // Pull-to-Refresh State
  const [pullY, setPullY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(0);
  const PULL_THRESHOLD = 80;

  const unlockedPacksMemo = useMemo(() => unlockedPacks.join(','), [unlockedPacks]);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubEvolution = listenToEvolutionHub(user.uid);
    const unsubCapacity = listenToCapacityState(user.uid);
    return () => {
      unsubEvolution();
      unsubCapacity();
    };
  }, [user?.uid, listenToEvolutionHub, listenToCapacityState]);

  useEffect(() => {
    if (!user?.uid) return;
    let active = true;
    setLoadingCompleted(true);
    Promise.all([
      listVitEntries(user.uid, { limit: 200 }),
      getJournalEntries(user.uid).catch(() => []),
      getRecentCheckIns(user.uid, 24).catch(() => []),
    ])
      .then(([entries, journals, checkIns]) => {
        if (!active) return;
        const done = new Set<string>();
        for (const e of entries) {
          if (e.bankId) done.add(e.bankId);
        }
        setCompletedBankIds(done);

        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const hasJournal = journals.some((j) => {
          const raw = j.createdAt as unknown;
          const d =
            raw instanceof Date
              ? raw
              : typeof raw === 'object' &&
                  raw &&
                  'toDate' in raw &&
                  typeof (raw as { toDate: () => Date }).toDate === 'function'
                ? (raw as { toDate: () => Date }).toDate()
                : new Date(String(raw ?? ''));
          if (Number.isNaN(d.getTime())) return false;
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          return key === todayKey;
        });
        setJournalExistsToday(hasJournal);

        const todayCheckIns = filterCheckInsToday(
          checkIns.map((c) => ({
            optionSelected: c.optionSelected,
            createdAt: c.createdAt,
          })),
        );
        setCompassOptionsToday(
          todayCheckIns
            .map((c) => c.optionSelected)
            .filter((v): v is string => typeof v === 'string' && v.length > 0),
        );
      })
      .catch(() => {
        if (active) setCompletedBankIds(new Set());
      })
      .finally(() => {
        if (active) setLoadingCompleted(false);
      });
    return () => {
      active = false;
    };
  }, [user?.uid, refreshKey]);

  useEffect(() => {
    if (lowCapacity) {
      setShowAll(false);
      setSelectedSlot(null);
      setResponseText('');
      setSaveHint(null);
    }
  }, [lowCapacity, refreshKey]);

  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchParams.get('tab') === 'mer' || searchParams.get('expand_dev') === 'true') {
      setShowAll(true);
      if (widgetRef.current) {
        widgetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [searchParams]);

  const excludeSet = useMemo(() => {
    const merged = new Set(completedBankIds);
    for (const id of sessionCompleted) merged.add(id);
    return merged;
  }, [completedBankIds, sessionCompleted]);

  const childBracket = useMemo(() => {
    if (!evolutionDoc?.childrenAgeState) return undefined;
    try {
      return getChildBracket('kasper') || getChildBracket('arvid') || undefined;
    } catch {
      return undefined;
    }
  }, [evolutionDoc, getChildBracket]);

  const signals = useMemo(
    () =>
      buildHomeSignalSnapshot({
        presetId,
        evolutionDoc,
        capacityScore,
        journalExistsToday,
        checkInsToday: compassOptionsToday.map((optionSelected) => ({ optionSelected })),
        childBracket,
      }),
    [presetId, evolutionDoc, capacityScore, journalExistsToday, compassOptionsToday, childBracket],
  );

  const targetCount = lowCapacity ? DEV_MIX_TARGET_LOW_CAPACITY : DEV_MIX_TARGET_DEFAULT;

  useEffect(() => {
    const next = buildDevMix({
      uid: user?.uid,
      hubUnlockedPacks: unlockedPacks,
      customCategories,
      excludeIds: excludeSet,
      signals,
      targetCount,
    });
    setMix(next);
    setSelectedSlot(null);

    // Sync to Native Widget & Shortcuts
    if (next[0] && user?.uid) {
      const native = getLivskompassenNative();
      native?.setWidgetData?.('utv_kort_body', next[0].body_sv);
      native?.updateUtvecklingskortShortcut?.(next[0].body_sv);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps -- signals/excludeSet intentionally via mixNonce + primitives
  }, [
    user?.uid,
    unlockedPacksMemo,
    customCategories,
    completedBankIds.size,
    sessionCompleted.size,
    targetCount,
    refreshKey,
    mixNonce,
    signals.lowCapacity,
    signals.presetId,
    signals.journalExistsToday,
  ]);

  const visibleCount = lowCapacity
    ? mix.length
    : showAll
      ? mix.length
      : Math.min(DEV_MIX_VISIBLE_INITIAL, mix.length);
  const visibleMix = mix.slice(0, visibleCount);
  const selected = mix.find((c) => c.slotKey === selectedSlot) ?? null;

  const markCompletedLocally = useCallback((bankId: string) => {
    if (!bankId) return;
    setSessionCompleted((prev) => new Set(prev).add(bankId));
    setCompletedBankIds((prev) => new Set(prev).add(bankId));
  }, []);

  const handleSelect = useCallback((card: DevMixCard) => {
    setSelectedSlot(card.slotKey);
    setResponseText('');
    setSaveError(null);
    setSaveHint(null);
    setSpeglarHint(false);
  }, []);

  const handleSave = useCallback(
    async (mode: 'answer' | 'done') => {
      if (!user?.uid || !selected || !selected.bankId || selected.exhausted) return;
      if (excludeSet.has(selected.bankId)) {
        setSaveHint('Redan klar — den frågan återkommer inte.');
        setSelectedSlot(null);
        setResponseText('');
        return;
      }

      const text =
        mode === 'done' ? responseText.trim() || 'Klar' : responseText.trim();
      if (mode === 'answer' && !text) {
        setSaveError('Skriv en rad eller markera klar.');
        return;
      }

      if (text && text !== 'Klar' && shouldRedirectMabraCoachToSpeglar(text)) {
        setSpeglarHint(true);
      }

      setSaving(true);
      setSaveError(null);
      setSaveHint(null);
      try {
        await ensureVitHub(user.uid, selected.projectId);
        const payload: Parameters<typeof saveVitEntry>[1] = {
          projectId: selected.projectId,
          kind: 'card',
          bankId: selected.bankId.slice(0, 32),
          content_class: selected.content_class,
          responseText: text || undefined,
          cardDateKey: new Date().toISOString().slice(0, 10),
          inputMode: 'kompass_discovery',
          zone: 'mabra',
        };
        // Custom: utelämna categoryId (rules allowlist). Pack KEEP: utelämna också —
        // mix har categoryKey som hint, inte alltid Discovery-id.
        if (
          selected.source === 'pack' &&
          [
            'ha_kul',
            'lar_ny',
            'utveckling',
            'varderingar',
            'sjalvkansla',
            'kropp',
            'lek_paus',
            'kanslor',
            'lugn',
            'identitet',
            'nar_det_knar',
            'min_uppgift',
          ].includes(selected.categoryKey)
        ) {
          payload.categoryId = selected.categoryKey;
        }

        await saveVitEntry(user.uid, payload);
        triggerSuccess();
        markCompletedLocally(selected.bankId);

        const slotIndex = mix.findIndex((c) => c.slotKey === selected.slotKey);
        const nextExclude = new Set(excludeSet);
        nextExclude.add(selected.bankId);
        const refill =
          slotIndex >= 0
            ? refillDevMixSlot({
                uid: user.uid,
                hubUnlockedPacks: unlockedPacks,
                customCategories,
                excludeIds: nextExclude,
                signals,
                currentMix: mix,
                slotIndex,
              })
            : null;

        setMix((prev) => {
          if (slotIndex < 0) return prev.filter((c) => c.bankId !== selected.bankId);
          const copy = [...prev];
          if (refill) copy[slotIndex] = refill;
          else copy.splice(slotIndex, 1);
          return copy;
        });

        setSaveHint(
          mode === 'done' ? 'Markerad som klar — den frågan återkommer inte.' : 'Sparat.',
        );
        setResponseText('');
        setSelectedSlot(null);
      } catch {
        setSaveError('Kunde inte spara. Kontrollera nätverk.');
      } finally {
        setSaving(false);
      }
    },
    [
      user?.uid,
      selected,
      responseText,
      markCompletedLocally,
      excludeSet,
      mix,
      unlockedPacks,
      customCategories,
      signals,
      triggerSuccess,
    ],
  );

  const handleShare = useCallback(() => {
    if (!selected || selected.source !== 'custom' || !selected.body_sv) return;
    const native = getLivskompassenNative();
    if (native?.shareVaultFile) {
      native.shareVaultFile(
        selected.body_sv,
        `mikrosteg-${selected.bankId.slice(0, 8)}.txt`,
        'text/plain',
      );
    } else if (navigator.share) {
      void navigator.share({
        title: selected.title_sv ?? 'Livskompassen Mikrosteg',
        text: selected.body_sv,
      });
    }
  }, [selected]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY > 10) return; // Only at top
    touchStartY.current = e.touches[0].clientY;
    setIsPulling(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    const currentY = e.touches[0].clientY;
    const delta = currentY - touchStartY.current;
    if (delta > 0) {
      setPullY(Math.min(delta * 0.5, PULL_THRESHOLD + 20));
      if (delta % 15 < 5) triggerTick(); // Premium drag feedback
    }
  };

  const onTouchEnd = () => {
    if (pullY >= PULL_THRESHOLD) {
      setMixNonce((n) => n + 1);
      triggerSuccess();
    }
    setPullY(0);
    setIsPulling(false);
  };

  if (!user) return null;

  const body = (
    <div
      ref={widgetRef}
      className="relative space-y-3 transition-transform duration-200"
      aria-label="Utvecklingskort"
      style={{ transform: `translateY(${pullY}px)` }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Pull Indicator */}
      {pullY > 10 && (
        <div
          className="absolute -top-8 left-1/2 flex -translate-x-1/2 items-center justify-center transition-opacity"
          style={{ opacity: pullY / PULL_THRESHOLD }}
        >
          <div
            className="h-6 w-6 rounded-full border-2 border-accent/40 bg-accent/10 transition-transform"
            style={{
              transform: `scale(${Math.min(pullY / PULL_THRESHOLD, 1.2)}) rotate(${pullY * 2}deg)`,
              borderColor: pullY >= PULL_THRESHOLD ? 'var(--accent)' : 'var(--accent-glow)',
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="ghost"
          className="min-h-[44px] flex-1 text-[10px] font-semibold uppercase tracking-widest"
          onClick={() => setPackOpen(true)}
        >
          <Package className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          Hämta nya kort
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="min-h-[44px] flex-1 text-[10px] font-semibold uppercase tracking-widest"
          onClick={() => setCustomOpen(true)}
          disabled={customCategories.length >= 8}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          Lägg till kategori
        </Button>
      </div>

      <p className="text-xs text-text-muted">
        {lowCapacity
          ? 'Låg kapacitet — färre lugna mikrosteg. Ett kort i taget.'
          : 'Blandade mikrosteg — klara frågor upprepas inte.'}
      </p>

      {loadingCompleted ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Array.from({ length: lowCapacity ? 1 : 6 }).map((_, i) => (
            <Skeleton key={i} variant="block" className="min-h-[72px] rounded-xl bg-accent/5" />
          ))}
        </div>
      ) : null}

      {!loadingCompleted && mix.length === 0 ? (
        <p className="text-xs text-text-muted">
          Inga kort just nu. Hämta ett faktapack eller skapa en egen kategori.
        </p>
      ) : (
        <div
          className="grid grid-cols-2 gap-2 sm:grid-cols-3"
          aria-label={`${visibleMix.length} utvecklingskort`}
        >
          {visibleMix.map((card) => (
            <button
              key={card.slotKey}
              type="button"
              onClick={() => handleSelect(card)}
              className={
                selectedSlot === card.slotKey
                  ? 'min-h-[72px] rounded-xl border border-accent/40 bg-surface-3/60 px-2.5 py-2.5 text-left shadow-[0_0_20px_-8px_rgba(212,175,55,0.35)]'
                  : 'min-h-[72px] rounded-xl border border-border/30 bg-surface-2/60 px-2.5 py-2.5 text-left transition-colors hover:border-accent/35 hover:bg-surface-3/50'
              }
            >
              {card.title_sv ? (
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-dim">
                  {card.title_sv}
                </span>
              ) : null}
              <span className="mt-0.5 line-clamp-3 block text-[11px] leading-snug text-text-muted">
                {card.body_sv}
              </span>
            </button>
          ))}
        </div>
      )}

      {!lowCapacity && mix.length > DEV_MIX_VISIBLE_INITIAL ? (
        <button
          type="button"
          className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-border/30 bg-surface-2/50 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted transition-colors hover:border-accent/30"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? 'Visa färre' : `Visa fler (${mix.length - DEV_MIX_VISIBLE_INITIAL})`}
        </button>
      ) : null}

      {selected ? (
        <article className="space-y-3 rounded-xl border border-accent/20 bg-surface-2/60 px-4 py-3">
          <p className="text-sm leading-relaxed text-text-muted">{selected.body_sv}</p>
          <p className="text-[10px] uppercase tracking-widest text-text-dim">
            {selected.title_sv ?? 'Mikrosteg'} ·{' '}
            {selected.content_class === 'PLAY' ? 'Lek' : 'Reflektion'}
          </p>
          <TextArea
            value={responseText}
            onChange={(e) => {
              setResponseText(e.target.value);
              setSpeglarHint(false);
            }}
            placeholder="En rad räcker — valfritt"
            rows={2}
            className="w-full text-sm"
            aria-label="Svar på utvecklingsfråga"
          />
          {speglarHint ? (
            <p className="text-xs text-text-muted">
              Det här låter mer som Speglar-läge.{' '}
              <Link
                to={{ pathname: NAV_PATHS.HJARTAT, search: '?tab=speglar' }}
                className="text-accent underline-offset-2 hover:underline"
              >
                Öppna Speglar
              </Link>
            </p>
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="secondary"
              className="min-h-[44px] flex-1"
              disabled={saving}
              onClick={() => void handleSave('answer')}
            >
              {saving ? 'Sparar …' : 'Spara svar'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="min-h-[44px] flex-1"
              disabled={saving}
              onClick={() => void handleSave('done')}
            >
              <Check className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Markera klar
            </Button>
            {selected.source === 'custom' ? (
              <Button
                type="button"
                variant="ghost"
                className="min-h-[44px] flex-none"
                onClick={handleShare}
                aria-label="Dela mikrosteg"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
          {saveError ? <p className="text-xs text-red-400">{saveError}</p> : null}
        </article>
      ) : null}

      {saveHint && !selected ? (
        <p className="text-xs text-accent" role="status">
          {saveHint}
        </p>
      ) : null}

      {user.uid ? (
        <>
          <FetchContentPacksFlow
            open={packOpen}
            onClose={() => setPackOpen(false)}
            userId={user.uid}
            onActivated={() => setMixNonce((n) => n + 1)}
            onRequestCustomCategory={() => setCustomOpen(true)}
          />
          <CustomCategoryFlow
            open={customOpen}
            onClose={() => setCustomOpen(false)}
            userId={user.uid}
            onSaved={() => setMixNonce((n) => n + 1)}
          />
        </>
      ) : null}
    </div>
  );

  if (embedded) {
    return body;
  }

  return (
    <BentoCard
      title="Utvecklingskort"
      icon={<Layers className="h-4 w-4" aria-hidden />}
      glow="gold"
      depth
      interactive={false}
      className="hem-v3-dev-rail"
    >
      {body}
    </BentoCard>
  );
}

/** Bakåtkompatibel export — smoke:design-modules förväntar HemV3DevelopmentRail. */
export { DevelopmentBentoWidget as HemV3DevelopmentRail };

/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
import { useCallback, useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import { Button, TextArea } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  fetchRecoveryProfile,
  upsertRecoveryProfile,
} from '../api/recoveryProfileService';
import { PLAN_COPY } from '../content/aterfallContent';
import {
  loadRecoveryPlanLocal,
  parseTagList,
  saveRecoveryPlanLocal,
  type RecoveryPlanLocal,
} from '../lib/recoveryPlanLocal';
import { pushKpiEvent } from '../lib/recoveryKpiLocal';

type Props = {
  uid?: string;
};

export function RecoveryPlanPanel({ uid }: Props) {
  const [coreWhy, setCoreWhy] = useState('');
  const [supportHint, setSupportHint] = useState('');
  const [plan, setPlan] = useState<RecoveryPlanLocal>(() => loadRecoveryPlanLocal(uid));
  const [peopleRaw, setPeopleRaw] = useState('');
  const [placesRaw, setPlacesRaw] = useState('');
  const [thingsRaw, setThingsRaw] = useState('');
  const [valuesRaw, setValuesRaw] = useState('');
  const [consequenceRaw, setConsequenceRaw] = useState('');
  const [savedHint, setSavedHint] = useState(false);
  const [loading, setLoading] = useState(Boolean(uid));

  useEffect(() => {
    const local = loadRecoveryPlanLocal(uid);
    setPlan(local);
    setPeopleRaw(local.riskMap.people.join(', '));
    setPlacesRaw(local.riskMap.places.join(', '));
    setThingsRaw(local.riskMap.things.join(', '));
    setValuesRaw(local.values.join(', '));
    setConsequenceRaw(local.consequenceCards.join('\n'));
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      const profile = await fetchRecoveryProfile(uid);
      if (cancelled) return;
      if (profile?.coreWhy) setCoreWhy(profile.coreWhy);
      if (profile?.supportContactHint) setSupportHint(profile.supportContactHint);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const save = useCallback(async () => {
    const next: RecoveryPlanLocal = {
      ifThen: plan.ifThen.map((row) => ({
        ifText: row.ifText.trim().slice(0, 120),
        thenText: row.thenText.trim().slice(0, 120),
      })),
      riskMap: {
        people: parseTagList(peopleRaw),
        places: parseTagList(placesRaw),
        things: parseTagList(thingsRaw),
      },
      values: parseTagList(valuesRaw).slice(0, 5),
      consequenceCards: consequenceRaw
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5),
    };
    saveRecoveryPlanLocal(next, uid);
    setPlan(next);
    pushKpiEvent({ type: 'plan_saved', at: Date.now() }, uid);

    const tags = [
      ...next.riskMap.people.map((t) => `p:${t}`.slice(0, 24)),
      ...next.riskMap.places.map((t) => `pl:${t}`.slice(0, 24)),
      ...next.riskMap.things.map((t) => `th:${t}`.slice(0, 24)),
    ].slice(0, 8);

    if (uid) {
      await upsertRecoveryProfile(uid, {
        coreWhy: coreWhy.trim().slice(0, 500) || undefined,
        supportContactHint: supportHint.trim().slice(0, 80) || undefined,
        triggerTags: tags.length ? tags : undefined,
      });
    }
    setSavedHint(true);
    window.setTimeout(() => setSavedHint(false), 2000);
  }, [plan.ifThen, peopleRaw, placesRaw, thingsRaw, valuesRaw, consequenceRaw, uid, coreWhy, supportHint]);

  if (loading) {
    return (
      <BentoCard title="Min plan" icon={<Shield className="h-4 w-4" />} glow="green">
        <p className="text-sm text-text-muted">Laddar…</p>
      </BentoCard>
    );
  }

  return (
    <BentoCard title="Min plan" icon={<Shield className="h-4 w-4" />} glow="green">
      <p className="mb-3 text-xs text-text-muted">
        If–Then och riskkarta sparas på enheten. Varför/kontakt synkas till din profil när du är inloggad.
      </p>

      <label className="block text-xs text-text-muted">
        {PLAN_COPY.coreWhyLabel}
        <TextArea
          value={coreWhy}
          onChange={(e) => setCoreWhy(e.target.value)}
          rows={2}
          maxLength={500}
          placeholder={PLAN_COPY.coreWhyHint}
          className="mt-1"
        />
      </label>

      <p className={`mt-4 text-xs uppercase tracking-[0.14em] text-text-muted`}>{PLAN_COPY.ifThenTitle}</p>
      <div className="mt-2 space-y-3">
        {plan.ifThen.map((row, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-2">
            <input
              value={row.ifText}
              onChange={(e) => {
                const ifText = e.target.value;
                setPlan((prev) => {
                  const ifThen = [...prev.ifThen];
                  ifThen[i] = { ...ifThen[i]!, ifText };
                  return { ...prev, ifThen };
                });
              }}
              placeholder={PLAN_COPY.ifPlaceholder}
              className="min-h-[44px] rounded-xl border-[0.5px] border-border bg-surface/40 px-3 text-sm text-text"
              maxLength={120}
            />
            <input
              value={row.thenText}
              onChange={(e) => {
                const thenText = e.target.value;
                setPlan((prev) => {
                  const ifThen = [...prev.ifThen];
                  ifThen[i] = { ...ifThen[i]!, thenText };
                  return { ...prev, ifThen };
                });
              }}
              placeholder={PLAN_COPY.thenPlaceholder}
              className="min-h-[44px] rounded-xl border-[0.5px] border-border bg-surface/40 px-3 text-sm text-text"
              maxLength={120}
            />
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs uppercase tracking-[0.14em] text-text-muted">{PLAN_COPY.pptTitle}</p>
      <label className="mt-2 block text-xs text-text-muted">
        {PLAN_COPY.peopleHint}
        <input
          value={peopleRaw}
          onChange={(e) => setPeopleRaw(e.target.value)}
          className="mt-1 min-h-[44px] w-full rounded-xl border-[0.5px] border-border bg-surface/40 px-3 text-sm"
          placeholder="kommaseparerat"
        />
      </label>
      <label className="mt-2 block text-xs text-text-muted">
        {PLAN_COPY.placesHint}
        <input
          value={placesRaw}
          onChange={(e) => setPlacesRaw(e.target.value)}
          className="mt-1 min-h-[44px] w-full rounded-xl border-[0.5px] border-border bg-surface/40 px-3 text-sm"
          placeholder="kommaseparerat"
        />
      </label>
      <label className="mt-2 block text-xs text-text-muted">
        {PLAN_COPY.thingsHint}
        <input
          value={thingsRaw}
          onChange={(e) => setThingsRaw(e.target.value)}
          className="mt-1 min-h-[44px] w-full rounded-xl border-[0.5px] border-border bg-surface/40 px-3 text-sm"
          placeholder="kommaseparerat"
        />
      </label>

      <label className="mt-4 block text-xs text-text-muted">
        {PLAN_COPY.supportLabel}
        <input
          value={supportHint}
          onChange={(e) => setSupportHint(e.target.value)}
          maxLength={80}
          className="mt-1 min-h-[44px] w-full rounded-xl border-[0.5px] border-border bg-surface/40 px-3 text-sm"
          placeholder={PLAN_COPY.supportHint}
        />
      </label>

      <label className="mt-4 block text-xs text-text-muted">
        {PLAN_COPY.valuesTitle}
        <input
          value={valuesRaw}
          onChange={(e) => setValuesRaw(e.target.value)}
          className="mt-1 min-h-[44px] w-full rounded-xl border-[0.5px] border-border bg-surface/40 px-3 text-sm"
          placeholder="pappa, klarhet, hälsa…"
        />
      </label>

      <label className="mt-4 block text-xs text-text-muted">
        {PLAN_COPY.consequenceTitle}
        <TextArea
          value={consequenceRaw}
          onChange={(e) => setConsequenceRaw(e.target.value)}
          rows={3}
          className="mt-1"
          placeholder="En mening per rad — dina egna, utan skräckpropaganda"
        />
      </label>

      <Button type="button" variant="secondary" onClick={() => void save()} className="mt-4 w-full min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
        {PLAN_COPY.save}
      </Button>
      {savedHint ? <p className="mt-2 text-center text-xs text-accent">{PLAN_COPY.saved}</p> : null}
    </BentoCard>
  );
}

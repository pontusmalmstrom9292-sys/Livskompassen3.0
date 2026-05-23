import { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useStore } from '../../core/store';
import { getChildrenLogs } from '../../core/firebase/firestore';
import { CHILD_PROFILE_SEEDS } from '../constants/childProfiles';
import type { ChildrenLogEntry } from '../types';
import { profileObservationsFromLogs } from '../utils/profileFromLogs';

/** F-04 / F-B12 — profilkort med seed + senaste livsloggar. */
export function ChildProfileCards() {
  const user = useStore((s) => s.user);
  const [logs, setLogs] = useState<ChildrenLogEntry[]>([]);

  const refresh = useCallback(async () => {
    if (!user) return;
    const data = await getChildrenLogs(user.uid);
    setLogs(data as ChildrenLogEntry[]);
  }, [user]);

  useEffect(() => {
    refresh().catch(() => setLogs([]));
  }, [refresh]);

  return (
    <div className="child-profile-grid" aria-label="Barnprofiler">
      {CHILD_PROFILE_SEEDS.map((profile) => {
        const [obs1, obs2] = profileObservationsFromLogs(profile.alias, logs);
        return (
          <article key={profile.alias} className="child-profile-card glass-card p-4">
            <div className="flex items-center gap-3">
              <span className="child-profile-card__initial" aria-hidden>
                {profile.initial}
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-text">{profile.alias}</h3>
                <p className="text-xs text-text-dim">{profile.subtitle}</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-text-muted">
              {[obs1, obs2].map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-text-dim">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-start gap-2 text-sm text-accent">
              <Star className="h-3.5 w-3.5 shrink-0 mt-0.5" strokeWidth={1.75} />
              <span>
                <span className="text-[10px] uppercase tracking-widest text-text-dim block mb-0.5">
                  Fokus
                </span>
                {profile.focus}
              </span>
            </p>
          </article>
        );
      })}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useStore } from '@/core/store';
import { listenAllProjects, listenProjects } from '../api/projectsApi';
import type { Project } from '../types';

export function useActiveProjects() {
  const user = useStore((s) => s.user);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = listenProjects(user.uid, 'active', (rows) => {
      setProjects(rows);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  return { user, projects, loading };
}

/** Alla projekt (alla statusar) — för hub med filter och statusräknare. */
export function useAllProjects() {
  const user = useStore((s) => s.user);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = listenAllProjects(user.uid, (rows) => {
      setProjects(rows);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  return { user, projects, loading };
}

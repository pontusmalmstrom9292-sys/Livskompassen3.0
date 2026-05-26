import { useEffect, useState } from 'react';
import { useStore } from '../../core/store';
import { listenProjects } from '../api/projectsApi';
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

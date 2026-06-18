import { useEffect, type ReactNode } from 'react';
import { initDesignSandbox } from './designSandbox';

export function SandboxAuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initDesignSandbox();
  }, []);

  return <>{children}</>;
}

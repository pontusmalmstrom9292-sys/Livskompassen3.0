import React, { Suspense } from 'react';
import { AuthGate } from '../../modules/core/auth/AuthGate';
import { PageSkeleton } from './PageSkeleton';

interface ProtectedModuleProps {
  children: React.ReactNode;
}

export function ProtectedModule({ children }: ProtectedModuleProps) {
  return (
    <AuthGate>
      <Suspense fallback={<PageSkeleton />}>
        {children}
      </Suspense>
    </AuthGate>
  );
}

import React, { Suspense } from 'react';
import { AuthGate } from '../../modules/core/auth/AuthGate';
import { PageSkeleton } from './PageSkeleton';
import { HubErrorBoundary } from '../../modules/shared/ui/HubErrorBoundary';

interface ProtectedModuleProps {
  children: React.ReactNode;
}

export function ProtectedModule({ children }: ProtectedModuleProps) {
  return (
    <AuthGate>
      <HubErrorBoundary>
        <Suspense fallback={<PageSkeleton />}>
          {children}
        </Suspense>
      </HubErrorBoundary>
    </AuthGate>
  );
}

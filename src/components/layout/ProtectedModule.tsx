import React, { Suspense } from 'react';
import { AuthGate } from '../../modules/core/auth/AuthGate';
import { PageSkeleton } from './PageSkeleton';
import { HubErrorBoundary } from '../../modules/shared/ui/HubErrorBoundary';

interface ProtectedModuleProps {
  children: React.ReactNode;
  title?: string;
  logTag?: string;
}

export function ProtectedModule({ children, title, logTag }: ProtectedModuleProps) {
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

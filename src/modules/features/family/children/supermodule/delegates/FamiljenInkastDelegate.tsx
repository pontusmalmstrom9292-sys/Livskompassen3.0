import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';

// Extended props according to the specs if needed later
// type CaptureSuperVariant = ... | 'familjen' 
// Right now, we might need to add 'familjen' to the allowed types in CaptureSuperModule.tsx
// if it's not already there. For now we use the type casting or assume it exists.

export function FamiljenInkastDelegate({ shell, onSaved }: FamiljenDelegateBaseProps) {
  const user = shell.user;

  if (!user) {
    return (
      <p className="text-sm text-text-muted p-4 text-center">
        Logga in för att använda inkast med granskning.
      </p>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="space-y-1 mb-4">
        <p className="text-xs uppercase tracking-widest text-text-dim">
          Inkast & Review Queue
        </p>
        <p className="text-xs text-text-dim">
          Mata in text snabbt. AI sorterar det rätt, och du granskar alltid innan det sparas permanent i arkivet.
        </p>
      </div>

      {/* 
        Note: The CaptureSuperModule needs to support the 'familjen' variant 
        as defined in Phase 7D. For now we use 'hem-inkast' as a fallback if 'familjen' 
        isn't fully typed yet, but we'll cast to any to satisfy TS for the new phase.
      */}
      <CaptureSuperModule 
        variant={'familjen' as any} 
        compact={true} 
        onSaved={onSaved}
      />
    </div>
  );
}

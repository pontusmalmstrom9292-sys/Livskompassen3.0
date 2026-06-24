import { EyeOff } from 'lucide-react';
import { useToastStore } from '@/core/store/toastStore';

export function GhostModeToggle() {
  const { isGhostMode, toggleGhostMode } = useToastStore();
  return (
    <label className="flex cursor-pointer items-start gap-3 border-t border-border pt-4">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
        checked={isGhostMode}
        onChange={toggleGhostMode}
        aria-label="Ghost Mode"
      />
      <span className="text-sm leading-relaxed text-text-muted">
        <span className="flex items-center gap-2 font-medium text-text">
          <EyeOff className="h-3.5 w-3.5" />
          Tysta notiser (Ghost Mode)
        </span>
        Döljer info- och framgångsnotiser. Bara fel och varningar syns. (Plausible deniability)
      </span>
    </label>
  );
}

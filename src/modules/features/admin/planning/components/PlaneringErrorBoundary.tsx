import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { NAV_PATHS } from '@/core/navigation/navTruth';

type Props = { children: ReactNode };
type State = { error: Error | null };

/** Fångar render-fel i Planering så hela appen inte vit-skärmar (t.ex. WebView på Android). */
export class PlaneringErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[PlaneringErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="calm-card glow-bottom-gold space-y-3 rounded-2xl border border-border/30 p-4">
          <p className="text-sm font-medium text-text">Handling kunde inte laddas</p>
          <p className="text-xs text-text-muted">
            Ett tekniskt fel stoppade vyn. Prova igen — dina uppgifter i molnet påverkas inte.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-pill--accent text-xs"
              onClick={() => this.setState({ error: null })}
            >
              Försök igen
            </button>
            <Link to={NAV_PATHS.VARDAGEN} className="btn-pill--ghost text-xs">
              Till Liv och göra
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

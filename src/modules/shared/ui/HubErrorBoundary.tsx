import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { NAV_PATHS } from '@/core/navigation/navTruth';

type Glow = 'gold' | 'blue' | 'green';

type Props = {
  children: ReactNode;
  title: string;
  glow?: Glow;
  backTo?: string;
  backLabel?: string;
  logTag: string;
  errorBody?: string;
};

type State = { error: Error | null };

const GLOW_CLASS: Record<Glow, string> = {
  gold: 'glow-bottom-gold',
  blue: 'glow-bottom-blue',
  green: 'glow-bottom-green',
};

/** Fångar render-fel i hub-vyer — vit skärm → återställning utan att tappa session. */
export class HubErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.logTag}]`, error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      const glow = GLOW_CLASS[this.props.glow ?? 'gold'];
      return (
        <div className={`calm-card ${glow} space-y-3 rounded-2xl border border-border/30 p-4`}>
          <p className="text-sm font-medium text-text">{this.props.title}</p>
          <p className="text-xs text-text-muted">
            {this.props.errorBody ??
              'Ett tekniskt fel stoppade vyn. Prova igen — dina sparade data påverkas inte.'}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-pill--accent text-xs"
              onClick={() => this.setState({ error: null })}
            >
              Försök igen
            </button>
            <Link
              to={this.props.backTo ?? NAV_PATHS.HOME}
              className="btn-pill--ghost text-xs"
            >
              {this.props.backLabel ?? 'Till Hem'}
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

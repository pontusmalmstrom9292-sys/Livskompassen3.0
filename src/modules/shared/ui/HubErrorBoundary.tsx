import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorFallback, type ErrorFallbackGlow } from '@/design-system';
import { NAV_PATHS } from '@/core/navigation/navTruth';

type Props = {
  children: ReactNode;
  title: string;
  glow?: ErrorFallbackGlow;
  backTo?: string;
  backLabel?: string;
  logTag: string;
  errorBody?: string;
};

type State = { error: Error | null };

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
      return (
        <ErrorFallback
          title={this.props.title}
          body={this.props.errorBody}
          glow={this.props.glow ?? 'gold'}
          onRetry={() => this.setState({ error: null })}
          backTo={this.props.backTo ?? NAV_PATHS.HOME}
          backLabel={this.props.backLabel ?? 'Till Hem'}
        />
      );
    }
    return this.props.children;
  }
}

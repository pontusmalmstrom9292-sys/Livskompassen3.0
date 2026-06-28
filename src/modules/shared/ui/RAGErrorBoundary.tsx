import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorFallback } from '@/design-system';
import { BentoCard } from '@/modules/shared/ui/BentoCard';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class RAGErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Ett oväntat fel inträffade vid hämtning av data.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RAG Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <BentoCard>
          <ErrorFallback
            title={this.props.fallbackTitle || 'Något gick fel'}
            body={this.state.errorMessage}
            glow="danger"
            onRetry={() => this.setState({ hasError: false, errorMessage: '' })}
            className="border-0 bg-transparent p-0 shadow-none"
          />
        </BentoCard>
      );
    }
    return this.props.children;
  }
}

import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
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
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'Ett oväntat fel inträffade vid hämtning av data.' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('RAG Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <BentoCard>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertTriangle className="mb-3 h-8 w-8 text-danger" />
            <h3 className="font-display text-lg font-semibold text-danger">
              {this.props.fallbackTitle || 'Något gick fel'}
            </h3>
            <p className="mt-2 max-w-xs text-sm text-text-muted">
              {this.state.errorMessage}
            </p>
            <button
              onClick={this.handleReset}
              className="btn-pill--secondary mt-4 inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Försök igen
            </button>
          </div>
        </BentoCard>
      );
    }

    return this.props.children;
  }
}

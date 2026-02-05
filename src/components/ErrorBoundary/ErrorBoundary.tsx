import React from 'react';
import type { ErrorBoundaryProps, ErrorBoundaryState } from '../../types';

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="flex items-center justify-center min-h-[400px] p-8 bg-navy-mid rounded-lg border border-danger/30"
          role="alert"
        >
          <div className="max-w-md text-center">
            <div className="flex justify-center mb-6" aria-hidden="true">
              <svg viewBox="0 0 56 56" fill="none" width="56" height="56">
                <circle cx="28" cy="28" r="24" stroke="#d93025" strokeWidth="2.5"/>
                <path d="M28 16v16M28 36v4" stroke="#d93025" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-text mb-3">Something went wrong</h2>

            <p className="text-text-muted mb-6">
              {this.props.friendlyMessage ||
                'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.'}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-navy-dark/50 rounded p-4 border border-navy-lite">
                <summary className="cursor-pointer text-warning font-medium mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-text-muted overflow-auto max-h-48 whitespace-pre-wrap">
                  <strong className="text-danger">Error:</strong> {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      <strong className="text-danger">Component Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                className="btn btn-primary"
                onClick={this.handleReset}
                aria-label="Try to recover from error"
              >
                Try Again
              </button>
              <button
                className="btn btn-outline"
                onClick={() => window.location.reload()}
                aria-label="Refresh the page"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

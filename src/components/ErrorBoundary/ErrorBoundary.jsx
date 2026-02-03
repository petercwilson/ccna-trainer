import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console (could be sent to an error reporting service)
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // You could send to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or use the provided one
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-fallback" role="alert">
          <div className="error-boundary-content">
            <div className="error-icon" aria-hidden="true">
              <svg viewBox="0 0 56 56" fill="none" width="56" height="56">
                <circle cx="28" cy="28" r="24" stroke="#d93025" strokeWidth="2.5"/>
                <path d="M28 16v16M28 36v4" stroke="#d93025" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <h2>Something went wrong</h2>
            <p className="error-message">
              {this.props.friendlyMessage || 'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.'}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  <strong>Error:</strong> {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button
                className="btn btn-gold"
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

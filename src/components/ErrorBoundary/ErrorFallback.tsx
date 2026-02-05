import type { ErrorFallbackProps, InlineErrorFallbackProps } from '../../types';

export const ErrorFallback = ({ title, message, onReset }: ErrorFallbackProps) => {
  return (
    <div className="card" role="alert">
      <div className="card-body">
        <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
          <div className="mb-4" aria-hidden="true">
            <svg viewBox="0 0 56 56" fill="none" width="56" height="56">
              <circle cx="28" cy="28" r="24" stroke="#e8a012" strokeWidth="2.5"/>
              <path d="M28 16v16M28 36v4" stroke="#e8a012" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-text mb-2">
            {title || 'Something went wrong'}
          </h3>

          <p className="text-text-muted mb-5">
            {message || 'Unable to load this section. Please try again.'}
          </p>

          {onReset && (
            <button
              className="btn btn-outline"
              onClick={onReset}
              aria-label="Try to reload this section"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const InlineErrorFallback = ({ message }: InlineErrorFallbackProps) => {
  return (
    <div
      className="px-4 py-3 bg-red-bg border border-danger rounded mb-4 text-text"
      role="alert"
    >
      <strong className="text-danger">⚠ Error:</strong>{' '}
      {message || 'Failed to load this content'}
    </div>
  );
};

import React from 'react';

// Lightweight fallback component for specific sections
export const ErrorFallback = ({ title, message, onReset }) => {
  return (
    <div className="card error-fallback" role="alert">
      <div className="card-body">
        <div className="centered" style={{ padding: '40px 20px' }}>
          <div className="c-icon" aria-hidden="true">
            <svg viewBox="0 0 56 56" fill="none" width="56" height="56">
              <circle cx="28" cy="28" r="24" stroke="#e8a012" strokeWidth="2.5"/>
              <path d="M28 16v16M28 36v4" stroke="#e8a012" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 style={{ marginTop: '16px', marginBottom: '8px' }}>
            {title || 'Something went wrong'}
          </h3>
          <p style={{ marginBottom: '20px', color: 'var(--muted)' }}>
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

// Inline fallback for smaller components
export const InlineErrorFallback = ({ message }) => {
  return (
    <div
      className="inline-error"
      role="alert"
      style={{
        padding: '16px',
        background: 'var(--red-bg)',
        border: '1px solid var(--red)',
        borderRadius: '4px',
        color: 'var(--off-white)',
        marginBottom: '16px'
      }}
    >
      <strong style={{ color: 'var(--red)' }}>⚠ Error:</strong> {message || 'Failed to load this content'}
    </div>
  );
};

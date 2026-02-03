import React, { useState } from 'react';

/**
 * Test component to demonstrate Error Boundary functionality
 * This component is for development/testing purposes only
 *
 * To test error boundaries:
 * 1. Import this component in App.jsx
 * 2. Add it to a tab panel wrapped in an ErrorBoundary
 * 3. Click "Trigger Error" to see the error boundary in action
 */
export const ErrorTest = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    // This will be caught by the nearest ErrorBoundary
    throw new Error('This is a test error to demonstrate error boundary functionality!');
  }

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div className="card-head">
        <h3>Error Boundary Test (Development Only)</h3>
      </div>
      <div className="card-body">
        <p style={{ marginBottom: '20px', color: 'var(--muted)' }}>
          Click the button below to trigger an error and see how the error boundary catches it
          and displays a fallback UI instead of crashing the entire application.
        </p>
        <button
          className="btn btn-outline"
          onClick={() => setShouldError(true)}
          aria-label="Trigger test error"
        >
          Trigger Error
        </button>
      </div>
    </div>
  );
};

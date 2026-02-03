import { useState, useEffect } from 'react';

/**
 * Custom hook for persisted state with validation
 * Similar to useState but automatically syncs with localStorage
 *
 * @param {function} getter - Function to get initial value from storage
 * @param {function} setter - Function to save value to storage
 * @returns {[any, function]} - [state, setState] tuple
 */
export const usePersistedState = (getter, setter) => {
  const [state, setState] = useState(() => getter());

  useEffect(() => {
    setter(state);
  }, [state, setter]);

  return [state, setState];
};

/**
 * Example usage:
 *
 * const [progress, setProgress] = usePersistedState(
 *   getProgress,
 *   setProgress
 * );
 *
 * // Use like normal useState:
 * setProgress({ ...progress, newData: 'value' });
 */

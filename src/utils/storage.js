/**
 * Safe localStorage utilities with validation and error handling
 */

// Storage keys
export const STORAGE_KEYS = {
  PROGRESS: 'ccna-progress',
  TOPIC_ANSWERS: 'ccna-topic-answers',
  TOPIC_SHOWN: 'ccna-topic-shown',
};

// Current schema version for migration support
const SCHEMA_VERSION = 1;

/**
 * Validates progress data structure
 * @param {any} data - Data to validate
 * @returns {boolean} - True if valid
 */
export const isValidProgressData = (data) => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // If exams exist, validate structure
  if (data.exams) {
    if (!Array.isArray(data.exams)) {
      return false;
    }

    // Validate each exam entry
    for (const exam of data.exams) {
      if (
        typeof exam.date !== 'string' ||
        typeof exam.score !== 'number' ||
        typeof exam.total !== 'number' ||
        typeof exam.percentage !== 'number'
      ) {
        return false;
      }

      // Validate score ranges
      if (exam.score < 0 || exam.total < 0 || exam.percentage < 0 || exam.percentage > 100) {
        return false;
      }

      // Validate date format
      if (isNaN(Date.parse(exam.date))) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Validates answers data structure
 * @param {any} data - Data to validate
 * @returns {boolean} - True if valid
 */
export const isValidAnswersData = (data) => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // All keys should be numeric strings (question indices)
  // All values should be numbers (answer indices)
  for (const [key, value] of Object.entries(data)) {
    if (isNaN(parseInt(key)) || typeof value !== 'number') {
      return false;
    }
  }

  return true;
};

/**
 * Get default progress data
 * @returns {object} - Default progress structure
 */
export const getDefaultProgress = () => ({
  version: SCHEMA_VERSION,
  exams: [],
  lastUpdated: new Date().toISOString(),
});

/**
 * Get default answers data
 * @returns {object} - Default answers structure
 */
export const getDefaultAnswers = () => ({});

/**
 * Safely get data from localStorage with validation
 * @param {string} key - Storage key
 * @param {function} validator - Validation function
 * @param {function} getDefault - Function to get default value
 * @returns {any} - Parsed and validated data or default
 */
const safeGetItem = (key, validator, getDefault) => {
  try {
    const item = localStorage.getItem(key);

    if (!item) {
      return getDefault();
    }

    const parsed = JSON.parse(item);

    if (!validator(parsed)) {
      console.warn(`Invalid data structure in localStorage key: ${key}. Resetting to default.`);
      return getDefault();
    }

    return parsed;
  } catch (error) {
    console.error(`Error reading from localStorage key: ${key}`, error);
    return getDefault();
  }
};

/**
 * Safely set data to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} - True if successful
 */
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key: ${key}`, error);

    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Consider clearing old data.');
    }

    return false;
  }
};

/**
 * Get progress data from localStorage
 * @returns {object} - Progress data
 */
export const getProgress = () => {
  return safeGetItem(
    STORAGE_KEYS.PROGRESS,
    isValidProgressData,
    getDefaultProgress
  );
};

/**
 * Set progress data to localStorage
 * @param {object} progress - Progress data
 * @returns {boolean} - True if successful
 */
export const setProgress = (progress) => {
  // Validate before saving
  if (!isValidProgressData(progress)) {
    console.error('Attempted to save invalid progress data');
    return false;
  }

  // Add version and timestamp
  const dataToSave = {
    ...progress,
    version: SCHEMA_VERSION,
    lastUpdated: new Date().toISOString(),
  };

  return safeSetItem(STORAGE_KEYS.PROGRESS, dataToSave);
};

/**
 * Get topic answers from localStorage
 * @returns {object} - Answers data
 */
export const getTopicAnswers = () => {
  return safeGetItem(
    STORAGE_KEYS.TOPIC_ANSWERS,
    isValidAnswersData,
    getDefaultAnswers
  );
};

/**
 * Set topic answers to localStorage
 * @param {object} answers - Answers data
 * @returns {boolean} - True if successful
 */
export const setTopicAnswers = (answers) => {
  // Validate before saving
  if (!isValidAnswersData(answers)) {
    console.error('Attempted to save invalid answers data');
    return false;
  }

  return safeSetItem(STORAGE_KEYS.TOPIC_ANSWERS, answers);
};

/**
 * Get topic shown state from localStorage
 * @returns {object} - Shown state data
 */
export const getTopicShown = () => {
  return safeGetItem(
    STORAGE_KEYS.TOPIC_SHOWN,
    isValidAnswersData, // Same structure as answers
    getDefaultAnswers
  );
};

/**
 * Set topic shown state to localStorage
 * @param {object} shown - Shown state data
 * @returns {boolean} - True if successful
 */
export const setTopicShown = (shown) => {
  if (!isValidAnswersData(shown)) {
    console.error('Attempted to save invalid shown state data');
    return false;
  }

  return safeSetItem(STORAGE_KEYS.TOPIC_SHOWN, shown);
};

/**
 * Clear all CCNA Trainer data from localStorage
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('All CCNA Trainer data cleared from localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get storage usage info
 * @returns {object} - Storage info
 */
export const getStorageInfo = () => {
  const info = {};

  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    try {
      const item = localStorage.getItem(key);
      info[name] = {
        exists: !!item,
        size: item ? new Blob([item]).size : 0,
        sizeKB: item ? (new Blob([item]).size / 1024).toFixed(2) : 0,
      };
    } catch (error) {
      info[name] = { error: error.message };
    }
  });

  return info;
};

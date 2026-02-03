/**
 * Test utilities for storage validation
 * Run these in browser console to test storage functionality
 */

import {
  getProgress,
  setProgress,
  getTopicAnswers,
  setTopicAnswers,
  isValidProgressData,
  isValidAnswersData,
  getDefaultProgress,
  clearAllData,
  getStorageInfo,
} from './storage';

// Test 1: Valid progress data
export const testValidProgress = () => {
  console.log('Test 1: Valid progress data');
  const validData = {
    exams: [
      {
        date: '2024-02-03T10:00:00.000Z',
        score: 10,
        total: 12,
        percentage: 83,
      },
    ],
  };

  console.log('Valid:', isValidProgressData(validData));
  console.assert(isValidProgressData(validData) === true, 'Should be valid');
};

// Test 2: Invalid progress data (wrong types)
export const testInvalidProgress = () => {
  console.log('\nTest 2: Invalid progress data');
  const invalidData = {
    exams: [
      {
        date: '2024-02-03',
        score: '10', // Should be number
        total: 12,
        percentage: 83,
      },
    ],
  };

  console.log('Valid:', isValidProgressData(invalidData));
  console.assert(isValidProgressData(invalidData) === false, 'Should be invalid');
};

// Test 3: Invalid progress data (out of range)
export const testInvalidProgressRange = () => {
  console.log('\nTest 3: Invalid progress data (out of range)');
  const invalidData = {
    exams: [
      {
        date: '2024-02-03T10:00:00.000Z',
        score: 10,
        total: 12,
        percentage: 150, // Invalid: >100
      },
    ],
  };

  console.log('Valid:', isValidProgressData(invalidData));
  console.assert(isValidProgressData(invalidData) === false, 'Should be invalid');
};

// Test 4: Valid answers data
export const testValidAnswers = () => {
  console.log('\nTest 4: Valid answers data');
  const validData = {
    '0': 2,
    '1': 1,
    '5': 3,
  };

  console.log('Valid:', isValidAnswersData(validData));
  console.assert(isValidAnswersData(validData) === true, 'Should be valid');
};

// Test 5: Invalid answers data
export const testInvalidAnswers = () => {
  console.log('\nTest 5: Invalid answers data');
  const invalidData = {
    'abc': 2, // Key should be numeric
    '1': 1,
  };

  console.log('Valid:', isValidAnswersData(invalidData));
  console.assert(isValidAnswersData(invalidData) === false, 'Should be invalid');
};

// Test 6: Set and get progress
export const testSetGetProgress = () => {
  console.log('\nTest 6: Set and get progress');
  const testData = {
    exams: [
      {
        date: new Date().toISOString(),
        score: 11,
        total: 12,
        percentage: 92,
      },
    ],
  };

  console.log('Setting progress...');
  const success = setProgress(testData);
  console.log('Set success:', success);

  console.log('Getting progress...');
  const retrieved = getProgress();
  console.log('Retrieved:', retrieved);

  console.assert(retrieved.exams.length === 1, 'Should have 1 exam');
  console.assert(retrieved.exams[0].score === 11, 'Score should be 11');
};

// Test 7: Corrupted data recovery
export const testCorruptedDataRecovery = () => {
  console.log('\nTest 7: Corrupted data recovery');

  // Manually corrupt the data
  localStorage.setItem('ccna-progress', 'invalid json {{{');

  // Should return default instead of crashing
  const retrieved = getProgress();
  console.log('Retrieved after corruption:', retrieved);

  console.assert(Array.isArray(retrieved.exams), 'Should return default structure');
  console.assert(retrieved.exams.length === 0, 'Should be empty default');
};

// Test 8: Storage info
export const testStorageInfo = () => {
  console.log('\nTest 8: Storage info');
  const info = getStorageInfo();
  console.log('Storage info:', info);

  console.assert(typeof info === 'object', 'Should return object');
  console.assert('PROGRESS' in info, 'Should have PROGRESS key');
};

// Run all tests
export const runAllTests = () => {
  console.log('=== Running Storage Validation Tests ===\n');

  try {
    testValidProgress();
    testInvalidProgress();
    testInvalidProgressRange();
    testValidAnswers();
    testInvalidAnswers();
    testSetGetProgress();
    testCorruptedDataRecovery();
    testStorageInfo();

    console.log('\n=== All Tests Passed! ===');
  } catch (error) {
    console.error('\n=== Test Failed ===');
    console.error(error);
  } finally {
    // Clean up
    console.log('\nCleaning up test data...');
    clearAllData();
  }
};

// Instructions for manual testing
console.log(`
Storage Validation Tests Available:

Import in browser console:
  import { runAllTests } from './utils/storage.test.js';

Run all tests:
  runAllTests()

Or run individual tests:
  testValidProgress()
  testInvalidProgress()
  testInvalidProgressRange()
  testValidAnswers()
  testInvalidAnswers()
  testSetGetProgress()
  testCorruptedDataRecovery()
  testStorageInfo()
`);

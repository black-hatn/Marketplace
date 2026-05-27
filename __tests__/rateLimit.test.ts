import { checkRateLimit } from '../lib/rateLimit';

describe('checkRateLimit', () => {
  beforeEach(() => {
    // Clear the store between tests if needed (or use different keys)
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should allow requests under the limit', () => {
    const key = 'test-ip-1';
    expect(checkRateLimit(key, 3, 1000)).toBe(true);
    expect(checkRateLimit(key, 3, 1000)).toBe(true);
    expect(checkRateLimit(key, 3, 1000)).toBe(true);
  });

  test('should reject requests exceeding the limit', () => {
    const key = 'test-ip-2';
    checkRateLimit(key, 2, 1000);
    checkRateLimit(key, 2, 1000);
    expect(checkRateLimit(key, 2, 1000)).toBe(false);
  });

  test('should reset rate limit after window time has passed', () => {
    const key = 'test-ip-3';
    checkRateLimit(key, 1, 1000);
    expect(checkRateLimit(key, 1, 1000)).toBe(false);

    // Fast-forward time by 1001ms
    jest.advanceTimersByTime(1001);

    expect(checkRateLimit(key, 1, 1000)).toBe(true);
  });
});

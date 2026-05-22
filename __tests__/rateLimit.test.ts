import { checkRateLimit } from '@/lib/rateLimit';

describe('checkRateLimit', () => {
  it('allows first request', () => {
    expect(checkRateLimit('test:1', 3, 60_000)).toBe(true);
  });

  it('allows up to max requests', () => {
    const key = 'test:2';
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
  });

  it('blocks when limit exceeded', () => {
    const key = 'test:3';
    checkRateLimit(key, 2, 60_000);
    checkRateLimit(key, 2, 60_000);
    expect(checkRateLimit(key, 2, 60_000)).toBe(false);
  });

  it('resets after window expires', () => {
    jest.useFakeTimers();
    const key = 'test:4';
    checkRateLimit(key, 1, 1_000);
    expect(checkRateLimit(key, 1, 1_000)).toBe(false);
    jest.advanceTimersByTime(1_001);
    expect(checkRateLimit(key, 1, 1_000)).toBe(true);
    jest.useRealTimers();
  });

  it('tracks keys independently', () => {
    const a = 'test:5a';
    const b = 'test:5b';
    checkRateLimit(a, 1, 60_000);
    expect(checkRateLimit(a, 1, 60_000)).toBe(false);
    expect(checkRateLimit(b, 1, 60_000)).toBe(true);
  });
});

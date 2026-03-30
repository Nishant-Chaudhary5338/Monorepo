import { describe, it, expect, vi } from 'vitest';
import { createRetryPolicy, withErrorHandling } from './retry';

describe('createRetryPolicy', () => {
  it('succeeds on first try', async () => {
    const policy = createRetryPolicy();
    const result = await policy.execute(async () => 'success');
    expect(result).toBe('success');
  });
  it('retries on failure', async () => {
    const policy = createRetryPolicy({ maxRetries: 3, baseDelay: 1 });
    let attempts = 0;
    const result = await policy.execute(async () => {
      attempts++;
      if (attempts < 3) throw new Error('fail');
      return 'success';
    });
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });
  it('throws after max retries', async () => {
    const policy = createRetryPolicy({ maxRetries: 2, baseDelay: 1 });
    await expect(policy.execute(async () => { throw new Error('always fail'); })).rejects.toThrow('always fail');
  });
  it('calls onRetry callback', async () => {
    const onRetry = vi.fn();
    const policy = createRetryPolicy({ maxRetries: 2, baseDelay: 1, onRetry });
    try { await policy.execute(async () => { throw new Error('fail'); }); } catch {}
    expect(onRetry).toHaveBeenCalled();
  });
  it('respects retryCondition', async () => {
    const policy = createRetryPolicy({
      maxRetries: 3,
      baseDelay: 1,
      retryCondition: (err) => (err as Error).message === 'retryable',
    });
    await expect(policy.execute(async () => { throw new Error('not retryable'); })).rejects.toThrow('not retryable');
  });
});

describe('withErrorHandling', () => {
  it('wraps async function', async () => {
    const fn = withErrorHandling(async (x: number) => x * 2);
    const result = await fn(5);
    expect(result).toBe(10);
  });
  it('retries on failure', async () => {
    let attempts = 0;
    const fn = withErrorHandling(async () => {
      attempts++;
      if (attempts < 2) throw new Error('fail');
      return 'ok';
    }, { retry: 2, retryDelay: 1 });
    const result = await fn();
    expect(result).toBe('ok');
  });
});

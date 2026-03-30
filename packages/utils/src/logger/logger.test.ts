import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLogger, Logger } from './logger';

describe('Logger', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('creates logger with default config', () => {
    const logger = createLogger();
    expect(logger).toBeInstanceOf(Logger);
  });

  it('creates logger with custom config', () => {
    const logger = createLogger({ level: 'debug', prefix: 'App' });
    expect(logger).toBeInstanceOf(Logger);
  });

  it('logs info messages when level allows', () => {
    const logger = createLogger({ level: 'info', format: 'json' });
    logger.info('test message');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('does not log debug when level is info', () => {
    const logger = createLogger({ level: 'info', format: 'json' });
    logger.debug('should not appear');
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('logs error with error console method', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logger = createLogger({ level: 'debug', format: 'json' });
    logger.error('error message');
    expect(errorSpy).toHaveBeenCalled();
  });

  it('creates child logger with merged config', () => {
    const parent = createLogger({ level: 'debug', prefix: 'Parent' });
    const child = parent.child({ prefix: 'Child' });
    expect(child).toBeInstanceOf(Logger);
  });

  it('logs with data payload', () => {
    const logger = createLogger({ level: 'info', format: 'json' });
    logger.info('test', { key: 'value' });
    expect(consoleSpy).toHaveBeenCalled();
  });
});

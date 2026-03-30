import type { LoggerConfig, LogLevel, LogEntry } from './types';

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

const STYLES: Record<LogLevel, string> = {
  error: 'color: #ef4444; font-weight: bold',
  warn: 'color: #f59e0b; font-weight: bold',
  info: 'color: #3b82f6',
  debug: 'color: #8b5cf6',
  trace: 'color: #6b7280',
};

export class Logger {
  private config: Required<LoggerConfig>;

  constructor(config: LoggerConfig = {}) {
    this.config = {
      level: config.level ?? 'info',
      prefix: config.prefix ?? '',
      format: config.format ?? 'text',
      transports: config.transports ?? ['console'],
      timestampFormat: config.timestampFormat ?? 'iso',
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.config.level];
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatEntry(entry: LogEntry): string {
    if (this.config.format === 'json') {
      return JSON.stringify(entry);
    }
    const prefix = entry.prefix ? `[${entry.prefix}]` : '';
    const data = entry.data ? ` ${JSON.stringify(entry.data)}` : '';
    return `${entry.timestamp} ${entry.level.toUpperCase()} ${prefix} ${entry.message}${data}`;
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: this.getTimestamp(),
      prefix: this.config.prefix || undefined,
      data,
    };

    const formatted = this.formatEntry(entry);

    if (this.config.transports.includes('console')) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      if (this.config.format === 'text') {
        console[consoleMethod](`%c${formatted}`, STYLES[level]);
      } else {
        console[consoleMethod](formatted);
      }
    }
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  trace(message: string, data?: unknown): void {
    this.log('trace', message, data);
  }

  child(config: Partial<LoggerConfig>): Logger {
    return new Logger({
      ...this.config,
      ...config,
      prefix: config.prefix
        ? `${this.config.prefix ? this.config.prefix + ':' : ''}${config.prefix}`
        : this.config.prefix,
    });
  }
}

export function createLogger(config?: LoggerConfig): Logger {
  return new Logger(config);
}

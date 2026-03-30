export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface LoggerConfig {
  level?: LogLevel;
  prefix?: string;
  format?: 'json' | 'text';
  transports?: ('console')[];
  timestampFormat?: string;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  prefix?: string;
  data?: unknown;
}

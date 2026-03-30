// ============================================================================
// LOGGER MODULE GENERATOR
// ============================================================================

export function generateLoggerModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// LOGGER MODULE - Structured logging with levels and transports
// ============================================================================

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
  context?: string;
}

export interface LoggerOptions {
  level?: LogLevel;
  context?: string;
  transports?: LogTransport[];
}

export type LogTransport = (entry: LogEntry) => void;

/**
 * Formats a log entry to a string
 * @param entry - Log entry to format
 * @returns Formatted log string
 * @example formatLog({ level: LogLevel.INFO, message: 'Hello', timestamp: new Date().toISOString() })
 */
export function formatLog(entry: LogEntry): string {
  const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
  const levelName = levelNames[entry.level] || 'UNKNOWN';
  const context = entry.context ? \`[\${entry.context}]\` : '';
  const data = entry.data ? \` \${JSON.stringify(entry.data)}\` : '';
  return \`\${entry.timestamp} \${levelName}\${context} \${entry.message}\${data}\`;
}

/**
 * Creates a console transport for logging
 * @returns Console transport function
 */
export function consoleTransport(): LogTransport {
  return (entry: LogEntry) => {
    const formatted = formatLog(entry);
    switch (entry.level) {
      case LogLevel.DEBUG: console.debug(formatted); break;
      case LogLevel.INFO: console.info(formatted); break;
      case LogLevel.WARN: console.warn(formatted); break;
      case LogLevel.ERROR: console.error(formatted); break;
    }
  };
}

/**
 * Creates a composite logger that sends to multiple transports
 * @param transports - Array of transport functions
 * @returns Composite transport
 */
export function createCompositeTransport(transports: LogTransport[]): LogTransport {
  return (entry: LogEntry) => {
    for (const transport of transports) {
      try {
        transport(entry);
      } catch {}
    }
  };
}

/**
 * Creates a logger instance
 * @param options - Logger options
 * @returns Logger instance
 * @example const log = createLogger({ context: 'API', level: LogLevel.INFO })
 */
export function createLogger(options: LoggerOptions = {}) {
  const { level = LogLevel.DEBUG, context, transports = [consoleTransport()] } = options;
  const compositeTransport = createCompositeTransport(transports);

  function log(logLevel: LogLevel, message: string, data?: unknown) {
    if (logLevel < level) return;
    const entry: LogEntry = {
      level: logLevel,
      message,
      timestamp: new Date().toISOString(),
      data,
      context,
    };
    compositeTransport(entry);
  }

  return {
    debug: (message: string, data?: unknown) => log(LogLevel.DEBUG, message, data),
    info: (message: string, data?: unknown) => log(LogLevel.INFO, message, data),
    warn: (message: string, data?: unknown) => log(LogLevel.WARN, message, data),
    error: (message: string, data?: unknown) => log(LogLevel.ERROR, message, data),
    child: (childContext: string) =>
      createLogger({
        level,
        context: context ? \`\${context}:\${childContext}\` : childContext,
        transports,
      }),
    setLevel: (newLevel: LogLevel) => {
      // Returns new logger with updated level
      return createLogger({ level: newLevel, context, transports });
    },
  };
}

/**
 * Creates a buffer transport that stores logs in memory
 * @param maxSize - Maximum entries to store
 * @returns Buffer transport with flush method
 */
export function createBufferTransport(maxSize = 1000): LogTransport & { flush: () => LogEntry[] } {
  const buffer: LogEntry[] = [];

  const transport: LogTransport & { flush: () => LogEntry[] } = ((entry: LogEntry) => {
    buffer.push(entry);
    if (buffer.length > maxSize) buffer.shift();
  }) as LogTransport & { flush: () => LogEntry[] };

  transport.flush = () => {
    const entries = [...buffer];
    buffer.length = 0;
    return entries;
  };

  return transport;
}
`,
    'logger.test.ts': `import { describe, it, expect } from 'vitest'
import { createLogger, LogLevel, formatLog, createBufferTransport } from './index'

describe('Logger Module', () => {
  describe('createLogger', () => {
    it('creates logger with methods', () => {
      const log = createLogger({ level: LogLevel.SILENT })
      expect(typeof log.debug).toBe('function')
      expect(typeof log.info).toBe('function')
      expect(typeof log.warn).toBe('function')
      expect(typeof log.error).toBe('function')
    })

    it('creates child logger with nested context', () => {
      const log = createLogger({ context: 'App' })
      const child = log.child('API')
      expect(typeof child.info).toBe('function')
    })
  })

  describe('formatLog', () => {
    it('formats log entry', () => {
      const entry = {
        level: LogLevel.INFO,
        message: 'Test',
        timestamp: '2024-01-01T00:00:00.000Z',
      }
      const formatted = formatLog(entry)
      expect(formatted).toContain('INFO')
      expect(formatted).toContain('Test')
    })
  })

  describe('createBufferTransport', () => {
    it('stores entries in buffer', () => {
      const transport = createBufferTransport()
      transport({ level: LogLevel.INFO, message: 'Test', timestamp: new Date().toISOString() })
      const entries = transport.flush()
      expect(entries).toHaveLength(1)
    })

    it('flushes and clears buffer', () => {
      const transport = createBufferTransport()
      transport({ level: LogLevel.INFO, message: 'Test', timestamp: new Date().toISOString() })
      const first = transport.flush()
      const second = transport.flush()
      expect(first).toHaveLength(1)
      expect(second).toHaveLength(0)
    })
  })
})
`,
  };
}
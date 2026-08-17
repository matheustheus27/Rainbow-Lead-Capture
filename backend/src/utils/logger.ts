export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  level: LogLevel;
  timestamp: string;
  context: string;
  message: string;
  data?: Record<string, any>;
  error?: {
    name?: string;
    message?: string;
    stack?: string;
  };
}

/**
 * Lightweight, production-grade structured JSON logger for containerized cloud observability.
 * Emits single-line standard JSON objects to stdout / stderr for automated parsing by ELK, Datadog, etc.
 */
class Logger {
  private formatLog(
    level: LogLevel,
    context: string,
    message: string,
    data?: Record<string, any>,
    errorObj?: Error | any
  ): string {
    const entry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      context,
      message,
    };

    if (data && Object.keys(data).length > 0) {
      entry.data = data;
    }

    if (errorObj) {
      if (errorObj instanceof Error) {
        entry.error = {
          name: errorObj.name,
          message: errorObj.message,
          stack: errorObj.stack,
        };
      } else {
        entry.error = {
          message: String(errorObj),
        };
      }
    }

    return JSON.stringify(entry);
  }

  info(context: string, message: string, data?: Record<string, any>): void {
    const logString = this.formatLog('info', context, message, data);
    process.stdout.write(`${logString}\n`);
  }

  warn(context: string, message: string, data?: Record<string, any>): void {
    const logString = this.formatLog('warn', context, message, data);
    process.stdout.write(`${logString}\n`);
  }

  error(
    context: string,
    message: string,
    data?: Record<string, any>,
    errorObj?: Error | any
  ): void {
    const logString = this.formatLog('error', context, message, data, errorObj);
    process.stderr.write(`${logString}\n`);
  }

  debug(context: string, message: string, data?: Record<string, any>): void {
    if (process.env.NODE_ENV !== 'production') {
      const logString = this.formatLog('debug', context, message, data);
      process.stdout.write(`${logString}\n`);
    }
  }
}

export const logger = new Logger();
export default logger;

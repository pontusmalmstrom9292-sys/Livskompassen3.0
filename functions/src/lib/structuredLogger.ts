/**
 * Structured Logging Framework
 * JSON-baserade logs med kontext för bättre debugging
 */

export interface LogContext {
  userId?: string;
  requestId?: string;
  callable?: string;
  silo?: string;
  duration?: number;
  [key: string]: unknown;
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export class StructuredLogger {
  private context: LogContext = {};

  setContext(ctx: Partial<LogContext>): void {
    this.context = { ...this.context, ...ctx };
  }

  private formatLog(level: LogLevel, message: string, ctx?: LogContext) {
    return {
      level,
      message,
      context: { ...this.context, ...ctx, timestamp: Date.now() },
    };
  }

  debug(message: string, ctx?: LogContext): void {
    const log = this.formatLog(LogLevel.DEBUG, message, ctx);
    console.debug(JSON.stringify(log));
  }

  info(message: string, ctx?: LogContext): void {
    const log = this.formatLog(LogLevel.INFO, message, ctx);
    console.info(JSON.stringify(log));
  }

  warn(message: string, ctx?: LogContext): void {
    const log = this.formatLog(LogLevel.WARN, message, ctx);
    console.warn(JSON.stringify(log));
  }

  error(message: string, error?: Error, ctx?: LogContext): void {
    const log = this.formatLog(LogLevel.ERROR, message, ctx);
    if (error) {
      (log as any).error = error.message;
      (log as any).stack = error.stack;
    }
    console.error(JSON.stringify(log));
  }

  critical(message: string, error?: Error, ctx?: LogContext): void {
    const log = this.formatLog(LogLevel.CRITICAL, message, ctx);
    if (error) {
      (log as any).error = error.message;
      (log as any).stack = error.stack;
    }
    console.error(JSON.stringify(log));
  }
}

export const structuredLogger = new StructuredLogger();

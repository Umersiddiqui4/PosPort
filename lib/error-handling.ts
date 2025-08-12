import type { ApiError } from '@/types';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  status?: number;
  originalError?: unknown;
  timestamp: Date;
  context?: Record<string, unknown> | undefined;
}

// Error messages for different scenarios
export const ERROR_MESSAGES = {
  [ErrorType.NETWORK]: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
  },
  [ErrorType.AUTHENTICATION]: {
    title: 'Authentication Error',
    message: 'Your session has expired. Please log in again.',
  },
  [ErrorType.AUTHORIZATION]: {
    title: 'Access Denied',
    message: 'You do not have permission to perform this action.',
  },
  [ErrorType.VALIDATION]: {
    title: 'Invalid Input',
    message: 'Please check your input and try again.',
  },
  [ErrorType.NOT_FOUND]: {
    title: 'Not Found',
    message: 'The requested resource was not found.',
  },
  [ErrorType.SERVER]: {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
  },
  [ErrorType.UNKNOWN]: {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try again.',
  },
} as const;

// Error logger interface
export interface ErrorLogger {
  log(error: AppError): void;
  logError(error: unknown, context?: Record<string, unknown>): void;
}

// Console error logger (for development)
export class ConsoleErrorLogger implements ErrorLogger {
  log(error: AppError): void {
    console.group(`🚨 ${error.type} Error`);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Status:', error.status);
    console.error('Timestamp:', error.timestamp);
    if (error.context) {
      console.error('Context:', error.context);
    }
    if (error.originalError) {
      console.error('Original Error:', error.originalError);
    }
    console.groupEnd();
  }

  logError(error: unknown, context?: Record<string, unknown>): void {
    const appError = this.normalizeError(error, context);
    this.log(appError);
  }

  private normalizeError(error: unknown, context?: Record<string, unknown>): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    if (this.isApiError(error)) {
      return {
        type: this.getErrorTypeFromStatus(error.status),
        message: error.message,
        status: error.status,
        originalError: error,
        timestamp: new Date(),
        context,
      };
    }

    if (error instanceof Error) {
      return {
        type: ErrorType.UNKNOWN,
        message: error.message,
        originalError: error,
        timestamp: new Date(),
        context,
      };
    }

    return {
      type: ErrorType.UNKNOWN,
      message: String(error),
      originalError: error,
      timestamp: new Date(),
      context,
    };
  }

  private isAppError(error: unknown): error is AppError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      'message' in error &&
      'timestamp' in error
    );
  }

  private isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      'status' in error
    );
  }

  private getErrorTypeFromStatus(status: number): ErrorType {
    switch (status) {
      case 401:
        return ErrorType.AUTHENTICATION;
      case 403:
        return ErrorType.AUTHORIZATION;
      case 404:
        return ErrorType.NOT_FOUND;
      case 422:
        return ErrorType.VALIDATION;
      case 500:
      case 502:
      case 503:
      case 504:
        return ErrorType.SERVER;
      default:
        return ErrorType.UNKNOWN;
    }
  }
}

// Production error logger (placeholder for Sentry or similar)
export class ProductionErrorLogger implements ErrorLogger {
  log(error: AppError): void {
    // In production, send to error tracking service
    // Example: Sentry.captureException(error.originalError || error);
    console.error('Production Error:', error);
  }

  logError(error: unknown, context?: Record<string, unknown>): void {
    const appError = this.normalizeError(error, context);
    this.log(appError);
  }

  private normalizeError(error: unknown, context?: Record<string, unknown>): AppError {
    // Similar to ConsoleErrorLogger but with production-specific handling
    if (error instanceof Error) {
      return {
        type: ErrorType.UNKNOWN,
        message: error.message,
        originalError: error,
        timestamp: new Date(),
        context,
      };
    }

    return {
      type: ErrorType.UNKNOWN,
      message: String(error),
      originalError: error,
      timestamp: new Date(),
      context,
    };
  }
}

// Error handler singleton
class ErrorHandler {
  private logger: ErrorLogger;

  constructor() {
    this.logger = process.env.NODE_ENV === 'production' 
      ? new ProductionErrorLogger() 
      : new ConsoleErrorLogger();
  }

  handle(error: unknown, context?: Record<string, unknown>): AppError {
    const appError = this.normalizeError(error, context);
    this.logger.log(appError);
    return appError;
  }

  handleAsync<T>(promise: Promise<T>, context?: Record<string, unknown>): Promise<T> {
    return promise.catch((error) => {
      this.handle(error, context);
      throw error;
    });
  }

  private normalizeError(error: unknown, context?: Record<string, unknown>): AppError {
    if (error instanceof Error) {
      return {
        type: ErrorType.UNKNOWN,
        message: error.message,
        originalError: error,
        timestamp: new Date(),
        context,
      };
    }

    return {
      type: ErrorType.UNKNOWN,
      message: String(error),
      originalError: error,
      timestamp: new Date(),
      context,
    };
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler();

// Utility functions
export const createError = (
  type: ErrorType,
  message: string,
  originalError?: unknown,
  context?: Record<string, unknown>
): AppError => ({
  type,
  message,
  originalError,
  timestamp: new Date(),
  context,
});

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.name === 'NetworkError' || error.message.includes('network');
  }
  return false;
};

export const isAuthError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'status' in error) {
    return error.status === 401;
  }
  return false;
};

export const getErrorMessage = (error: AppError): string => {
  return ERROR_MESSAGES[error.type]?.message || error.message;
};

export const getErrorTitle = (error: AppError): string => {
  return ERROR_MESSAGES[error.type]?.title || 'Error';
};

import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  componentRenderTime: number;
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  networkRequests: number;
  errors: Error[];
}

interface PerformanceOptions {
  trackMemory?: boolean;
  trackNetwork?: boolean;
  trackErrors?: boolean;
  sampleRate?: number; // 0-1, percentage of sessions to track
}

export const usePerformance = (
  componentName: string,
  options: PerformanceOptions = {}
) => {
  const {
    trackMemory = true,
    trackNetwork = true,
    trackErrors = true,
    sampleRate = 1.0
  } = options;

  const startTime = useRef<number>(performance.now());
  const metrics = useRef<PerformanceMetrics>({
    pageLoadTime: 0,
    componentRenderTime: 0,
    networkRequests: 0,
    errors: []
  });

  const shouldTrack = useCallback(() => {
    return Math.random() < sampleRate;
  }, [sampleRate]);

  const trackRenderTime = useCallback(() => {
    if (!shouldTrack()) return;

    const renderTime = performance.now() - startTime.current;
    metrics.current.componentRenderTime = renderTime;

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} render time: ${renderTime.toFixed(2)}ms`);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to analytics service
      console.log(`[Performance] ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  }, [componentName, shouldTrack]);

  const trackMemoryUsage = useCallback(() => {
    if (!trackMemory || !shouldTrack()) return;

    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.current.memoryUsage = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
  }, [trackMemory, shouldTrack]);

  const trackNetworkRequest = useCallback(() => {
    if (!trackNetwork || !shouldTrack()) return;

    metrics.current.networkRequests++;
  }, [trackNetwork, shouldTrack]);

  const trackError = useCallback((error: Error) => {
    if (!trackErrors || !shouldTrack()) return;

    metrics.current.errors.push(error);
  }, [trackErrors, shouldTrack]);

  // Track page load time
  useEffect(() => {
    if (!shouldTrack()) return undefined;

    const handleLoad = () => {
      const loadTime = performance.now() - startTime.current;
      metrics.current.pageLoadTime = loadTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] Page load time: ${loadTime.toFixed(2)}ms`);
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
      return undefined;
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [shouldTrack]);

  // Track component render time
  useEffect(() => {
    trackRenderTime();
    trackMemoryUsage();
  }, [trackRenderTime, trackMemoryUsage]);

  return {
    metrics: metrics.current,
    trackNetworkRequest,
    trackError,
    getMetrics: () => metrics.current
  };
};

// Hook for tracking specific operations
export const useOperationTimer = (operationName: string) => {
  const startTime = useRef<number>(0);
  const isRunning = useRef<boolean>(false);

  const start = useCallback(() => {
    startTime.current = performance.now();
    isRunning.current = true;
  }, []);

  const stop = useCallback(() => {
    if (!isRunning.current) return 0;

    const duration = performance.now() - startTime.current;
    isRunning.current = false;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${operationName}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }, [operationName]);

  return { start, stop, isRunning: isRunning.current };
};

// Hook for tracking API call performance
export const useApiPerformance = () => {
  const { trackNetworkRequest } = usePerformance('API', { trackNetwork: true });

  const trackApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    const timer = useOperationTimer(`API: ${endpoint}`);
    
    try {
      timer.start();
      trackNetworkRequest();
      
      const result = await apiCall();
      
      timer.stop();
      return result;
    } catch (error) {
      timer.stop();
      throw error;
    }
  }, [trackNetworkRequest]);

  return { trackApiCall };
};

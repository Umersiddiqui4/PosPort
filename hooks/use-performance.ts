import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  mountTime: number;
  updateCount: number;
  lastUpdate: number;
}

interface UsePerformanceOptions {
  componentName?: string;
  enabled?: boolean;
  logToConsole?: boolean;
  onMetrics?: (metrics: PerformanceMetrics) => void;
}

export const usePerformance = (options: UsePerformanceOptions = {}) => {
  const {
    componentName = 'Unknown Component',
    enabled = process.env.NODE_ENV === 'development',
    logToConsole = true,
    onMetrics,
  } = options;

  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    mountTime: 0,
    updateCount: 0,
    lastUpdate: 0,
  });

  const startTimeRef = useRef<number>(0);
  const isFirstRenderRef = useRef<boolean>(true);

  const logMetrics = useCallback((metrics: PerformanceMetrics) => {
    if (!enabled) return;

    if (logToConsole) {
      console.group(`📊 Performance: ${componentName}`);
      console.log('Render Time:', `${metrics.renderTime.toFixed(2)}ms`);
      console.log('Mount Time:', `${metrics.mountTime.toFixed(2)}ms`);
      console.log('Update Count:', metrics.updateCount);
      console.log('Last Update:', new Date(metrics.lastUpdate).toLocaleTimeString());
      console.groupEnd();
    }

    onMetrics?.(metrics);
  }, [componentName, enabled, logToConsole, onMetrics]);

  // Track render start
  useEffect(() => {
    if (!enabled) return;

    startTimeRef.current = performance.now();
  });

  // Track render end and calculate metrics
  useEffect(() => {
    if (!enabled) return;

    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;

    if (isFirstRenderRef.current) {
      metricsRef.current.mountTime = renderTime;
      isFirstRenderRef.current = false;
    } else {
      metricsRef.current.updateCount++;
    }

    metricsRef.current.renderTime = renderTime;
    metricsRef.current.lastUpdate = Date.now();

    logMetrics(metricsRef.current);
  });

  // Track component unmount
  useEffect(() => {
    if (!enabled) return;

    return () => {
      if (logToConsole) {
        console.log(`🔚 Component unmounted: ${componentName}`);
      }
    };
  }, [componentName, enabled, logToConsole]);

  return {
    metrics: metricsRef.current,
    resetMetrics: () => {
      metricsRef.current = {
        renderTime: 0,
        mountTime: 0,
        updateCount: 0,
        lastUpdate: 0,
      };
    },
  };
};

// Hook for tracking specific operations
export const useOperationTimer = (operationName: string) => {
  const startTimeRef = useRef<number>(0);

  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const endTimer = useCallback(() => {
    const endTime = performance.now();
    const duration = endTime - startTimeRef.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }, [operationName]);

  return { startTimer, endTimer };
};

// Hook for tracking memory usage
export const useMemoryTracker = (componentName?: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || !('memory' in performance)) {
      return;
    }

    const logMemoryUsage = () => {
      const memory = (performance as any).memory;
      console.log(`🧠 Memory Usage (${componentName || 'Unknown'}):`, {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      });
    };

    // Log initial memory usage
    logMemoryUsage();

    // Log memory usage every 30 seconds
    const interval = setInterval(logMemoryUsage, 30000);

    return () => clearInterval(interval);
  }, [componentName]);
};

// Hook for tracking network requests
export const useNetworkTracker = () => {
  const trackRequest = useCallback((url: string, method: string, duration: number, status: number) => {
    if (process.env.NODE_ENV === 'development') {
      const statusColor = status >= 200 && status < 300 ? '🟢' : '🔴';
      console.log(`${statusColor} ${method} ${url}: ${duration.toFixed(2)}ms (${status})`);
    }
  }, []);

  return { trackRequest };
};

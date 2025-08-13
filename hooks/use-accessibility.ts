import { useEffect, useRef, useCallback, useState } from 'react';

interface AccessibilityOptions {
  enableKeyboardNavigation?: boolean;
  enableScreenReader?: boolean;
  enableFocusManagement?: boolean;
  enableHighContrast?: boolean;
  enableReducedMotion?: boolean;
}

interface FocusTrapOptions {
  returnFocus?: boolean;
  preventScroll?: boolean;
}

export const useAccessibility = (options: AccessibilityOptions = {}) => {
  const {
    enableKeyboardNavigation = true,
    enableScreenReader = true,
    enableHighContrast = true,
    enableReducedMotion = true
  } = options;

  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  // Detect keyboard users
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleKeyDown = () => setIsKeyboardUser(true);
    const handleMouseDown = () => setIsKeyboardUser(false);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [enableKeyboardNavigation]);

  // Detect screen reader
  useEffect(() => {
    if (!enableScreenReader) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const checkScreenReader = () => {
      // Basic screen reader detection
      const hasScreenReader = 
        'speechSynthesis' in window ||
        'webkitSpeechSynthesis' in window ||
        document.querySelector('[aria-live]') !== null;
      
      setIsScreenReaderActive(hasScreenReader);
    };

    checkScreenReader();
    mediaQuery.addEventListener('change', checkScreenReader);

    return () => mediaQuery.removeEventListener('change', checkScreenReader);
  }, [enableScreenReader]);

  // Detect user preferences
  useEffect(() => {
    if (!enableReducedMotion || !enableHighContrast) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    const updatePreferences = () => {
      setPrefersReducedMotion(motionQuery.matches);
      setPrefersHighContrast(contrastQuery.matches);
    };

    updatePreferences();
    motionQuery.addEventListener('change', updatePreferences);
    contrastQuery.addEventListener('change', updatePreferences);

    return () => {
      motionQuery.removeEventListener('change', updatePreferences);
      contrastQuery.removeEventListener('change', updatePreferences);
    };
  }, [enableReducedMotion, enableHighContrast]);

  return {
    isKeyboardUser,
    isScreenReaderActive,
    prefersReducedMotion,
    prefersHighContrast
  };
};

// Hook for focus management
export const useFocusManagement = () => {
  const focusableElements = useRef<HTMLElement[]>([]);
  const currentFocusIndex = useRef<number>(-1);

  const getFocusableElements = useCallback((container: HTMLElement) => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];

    return Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors.join(', '))
    ).filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }, []);

  const focusFirstElement = useCallback((container: HTMLElement) => {
    const elements = getFocusableElements(container);
    if (elements.length > 0) {
      elements[0].focus();
      currentFocusIndex.current = 0;
      focusableElements.current = elements;
    }
  }, [getFocusableElements]);

  const focusLastElement = useCallback((container: HTMLElement) => {
    const elements = getFocusableElements(container);
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
      currentFocusIndex.current = elements.length - 1;
      focusableElements.current = elements;
    }
  }, [getFocusableElements]);

  const focusNextElement = useCallback(() => {
    if (focusableElements.current.length === 0) return;

    currentFocusIndex.current = (currentFocusIndex.current + 1) % focusableElements.current.length;
    focusableElements.current[currentFocusIndex.current].focus();
  }, []);

  const focusPreviousElement = useCallback(() => {
    if (focusableElements.current.length === 0) return;

    currentFocusIndex.current = currentFocusIndex.current <= 0 
      ? focusableElements.current.length - 1 
      : currentFocusIndex.current - 1;
    focusableElements.current[currentFocusIndex.current].focus();
  }, []);

  return {
    focusFirstElement,
    focusLastElement,
    focusNextElement,
    focusPreviousElement,
    getFocusableElements
  };
};

// Hook for focus trap
export const useFocusTrap = (options: FocusTrapOptions = {}) => {
  const { returnFocus = true } = options;
  const containerRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { focusFirstElement } = useFocusManagement();

  const activateFocusTrap = useCallback((container: HTMLElement) => {
    containerRef.current = container;
    
    if (returnFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Focus first element
    focusFirstElement(container);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current) return;

      if (event.key === 'Tab') {
        event.preventDefault();
        
        if (event.shiftKey) {
          // Shift + Tab: focus previous
          const elements = Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(
              'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
            )
          );

          const currentIndex = elements.indexOf(document.activeElement as HTMLElement);
          const previousIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
          elements[previousIndex]?.focus();
        } else {
          // Tab: focus next
          const elements = Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(
              'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
            )
          );

          const currentIndex = elements.indexOf(document.activeElement as HTMLElement);
          const nextIndex = currentIndex >= elements.length - 1 ? 0 : currentIndex + 1;
          elements[nextIndex]?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [focusFirstElement, returnFocus]);

  const deactivateFocusTrap = useCallback(() => {
    if (returnFocus && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
    containerRef.current = null;
  }, [returnFocus]);

  return {
    activateFocusTrap,
    deactivateFocusTrap
  };
};

// Hook for screen reader announcements
export const useScreenReader = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  const announcePageTitle = useCallback((title: string) => {
    document.title = title;
    announce(`Page loaded: ${title}`);
  }, [announce]);

  const announceError = useCallback((error: string) => {
    announce(`Error: ${error}`, 'assertive');
  }, [announce]);

  const announceSuccess = useCallback((message: string) => {
    announce(`Success: ${message}`);
  }, [announce]);

  return {
    announce,
    announcePageTitle,
    announceError,
    announceSuccess
  };
};

// Hook for keyboard shortcuts
export const useKeyboardShortcuts = () => {
  const shortcuts = useRef<Map<string, () => void>>(new Map());

  const registerShortcut = useCallback((key: string, callback: () => void) => {
    shortcuts.current.set(key, callback);
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    shortcuts.current.delete(key);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = [
        event.ctrlKey && 'Ctrl',
        event.altKey && 'Alt',
        event.shiftKey && 'Shift',
        event.metaKey && 'Meta',
        event.key.toUpperCase()
      ].filter(Boolean).join('+');

      const callback = shortcuts.current.get(key);
      if (callback) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    registerShortcut,
    unregisterShortcut
  };
};

// Utility for ARIA attributes
export const useAriaAttributes = () => {
  const getButtonAttributes = useCallback((options: {
    pressed?: boolean;
    expanded?: boolean;
    disabled?: boolean;
    describedBy?: string;
  } = {}) => {
    const { pressed, expanded, disabled, describedBy } = options;
    
    return {
      role: 'button',
      tabIndex: disabled ? -1 : 0,
      'aria-pressed': pressed,
      'aria-expanded': expanded,
      'aria-disabled': disabled,
      'aria-describedby': describedBy,
      ...(disabled && { 'aria-hidden': true })
    };
  }, []);

  const getDialogAttributes = useCallback((options: {
    modal?: boolean;
    describedBy?: string;
    labelledBy?: string;
  } = {}) => {
    const { modal = true, describedBy, labelledBy } = options;
    
    return {
      role: 'dialog',
      'aria-modal': modal,
      'aria-describedby': describedBy,
      'aria-labelledby': labelledBy
    };
  }, []);

  const getListAttributes = useCallback((options: {
    multiSelect?: boolean;
    orientation?: 'horizontal' | 'vertical';
  } = {}) => {
    const { multiSelect, orientation } = options;
    
    return {
      role: multiSelect ? 'listbox' : 'list',
      'aria-multiselectable': multiSelect,
      'aria-orientation': orientation
    };
  }, []);

  return {
    getButtonAttributes,
    getDialogAttributes,
    getListAttributes
  };
};

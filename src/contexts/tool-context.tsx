/**
 * React context provider for tool execution context
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { ToolContext } from '@/types/tools';
import { ToolContextManager, ToolContextUtils } from '@/lib/tools/tool-context';

/**
 * Tool context provider props
 */
interface ToolContextProviderProps {
  children: ReactNode;
  initialContext?: Partial<ToolContext>;
}

/**
 * Tool context value interface
 */
interface ToolContextValue {
  /** Current tool context */
  context: ToolContext;
  /** Update context */
  updateContext: (updates: Partial<ToolContext>) => void;
  /** Set current page */
  setCurrentPage: (page: string, section?: string) => void;
  /** Set theme */
  setTheme: (theme: 'light' | 'dark') => void;
  /** Context manager instance */
  contextManager: ToolContextManager;
  /** Whether context is ready */
  isReady: boolean;
}

/**
 * Tool context React context
 */
const ToolContextContext = createContext<ToolContextValue | null>(null);

/**
 * Tool context provider component
 */
export function ToolContextProvider({ children, initialContext = {} }: ToolContextProviderProps) {
  const router = useRouter();
  const { theme, systemTheme } = useTheme();
  
  // Initialize context manager
  const [contextManager] = useState(() => {
    const browserContext = typeof window !== 'undefined' 
      ? ToolContextUtils.createBrowserContext(initialContext)
      : ToolContextUtils.createServerContext('home', initialContext);
    
    return new ToolContextManager(browserContext);
  });

  const [context, setContext] = useState<ToolContext>(contextManager.getContext());
  const [isReady, setIsReady] = useState(false);

  // Update context when router changes
  useEffect(() => {
    const { page, section } = ToolContextUtils.extractPageFromPath(router.asPath);
    contextManager.setCurrentPage(page, section);
  }, [router.asPath, contextManager]);

  // Update context when theme changes
  useEffect(() => {
    const currentTheme = (theme === 'system' ? systemTheme : theme) as 'light' | 'dark';
    if (currentTheme && ['light', 'dark'].includes(currentTheme)) {
      contextManager.setTheme(currentTheme);
    }
  }, [theme, systemTheme, contextManager]);

  // Subscribe to context changes
  useEffect(() => {
    const unsubscribe = contextManager.subscribe((newContext) => {
      setContext(newContext);
    });

    // Mark as ready after initial setup
    setIsReady(true);

    return unsubscribe;
  }, [contextManager]);

  // Update user agent on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.userAgent) {
      contextManager.setUserAgent(navigator.userAgent);
    }
  }, [contextManager]);

  // Memoized update functions
  const updateContext = useCallback((updates: Partial<ToolContext>) => {
    contextManager.updateContext(updates);
  }, [contextManager]);

  const setCurrentPage = useCallback((page: string, section?: string) => {
    contextManager.setCurrentPage(page, section);
  }, [contextManager]);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    contextManager.setTheme(newTheme);
  }, [contextManager]);

  const value: ToolContextValue = {
    context,
    updateContext,
    setCurrentPage,
    setTheme,
    contextManager,
    isReady
  };

  return (
    <ToolContextContext.Provider value={value}>
      {children}
    </ToolContextContext.Provider>
  );
}

/**
 * Hook to use tool context
 */
export function useToolContext(): ToolContextValue {
  const context = useContext(ToolContextContext);
  
  if (!context) {
    throw new Error('useToolContext must be used within a ToolContextProvider');
  }
  
  return context;
}

/**
 * Hook to get current tool context data
 */
export function useCurrentContext(): ToolContext {
  const { context } = useToolContext();
  return context;
}

/**
 * Hook to update tool context
 */
export function useContextUpdater() {
  const { updateContext, setCurrentPage, setTheme } = useToolContext();
  
  return {
    updateContext,
    setCurrentPage,
    setTheme
  };
}

/**
 * Hook to check if context is ready
 */
export function useContextReady(): boolean {
  const { isReady } = useToolContext();
  return isReady;
}

/**
 * Higher-order component to provide tool context
 */
export function withToolContext<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & { initialContext?: Partial<ToolContext> }> {
  return function WrappedComponent({ initialContext, ...props }: P & { initialContext?: Partial<ToolContext> }) {
    return (
      <ToolContextProvider initialContext={initialContext}>
        <Component {...(props as P)} />
      </ToolContextProvider>
    );
  };
}

/**
 * Context debugging utilities (development only)
 */
export const ToolContextDebug = {
  /**
   * Log current context to console
   */
  logContext: (context: ToolContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔧 Tool Context Debug');
      console.log('Current Page:', context.currentPage);
      console.log('Current Section:', context.currentSection);
      console.log('Theme:', context.theme);
      console.log('Session ID:', context.sessionId);
      console.log('User Agent:', context.userAgent);
      console.groupEnd();
    }
  },

  /**
   * Validate context and log any issues
   */
  validateAndLog: (context: ToolContext) => {
    if (process.env.NODE_ENV === 'development') {
      const { ToolContextValidator } = require('@/lib/tools/tool-context');
      const validation = ToolContextValidator.validate(context);
      
      if (!validation.valid) {
        console.warn('🚨 Tool Context Validation Errors:', validation.errors);
      } else {
        console.log('✅ Tool Context is valid');
      }
    }
  }
};
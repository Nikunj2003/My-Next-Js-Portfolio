import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Download, Palette, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { classNames } from '@/utility/classNames';

export interface NavigationAction {
  id: string;
  type: 'navigate' | 'download' | 'theme' | 'modal' | 'scroll';
  target: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  message?: string;
  timestamp: Date;
}

interface NavigationIndicatorProps {
  actions: NavigationAction[];
  onDismiss?: (actionId: string) => void;
}

export default function NavigationIndicator({ actions, onDismiss }: NavigationIndicatorProps) {
  const activeActions = actions.filter(action => 
    action.status === 'pending' || action.status === 'in-progress'
  );

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'navigate': return Navigation;
      case 'download': return Download;
      case 'theme': return Palette;
      case 'modal': return ExternalLink;
      case 'scroll': return Navigation;
      default: return Navigation;
    }
  };

  const getActionMessage = (action: NavigationAction) => {
    if (action.message) return action.message;
    
    switch (action.type) {
      case 'navigate':
        return action.status === 'in-progress' 
          ? `Navigating to ${action.target}...`
          : `Navigate to ${action.target}`;
      case 'download':
        return action.status === 'in-progress'
          ? `Downloading ${action.target}...`
          : `Download ${action.target}`;
      case 'theme':
        return action.status === 'in-progress'
          ? `Switching to ${action.target} theme...`
          : `Switch to ${action.target} theme`;
      case 'modal':
        return action.status === 'in-progress'
          ? `Opening ${action.target}...`
          : `Open ${action.target}`;
      case 'scroll':
        return action.status === 'in-progress'
          ? `Scrolling to ${action.target}...`
          : `Scroll to ${action.target}`;
      default:
        return 'Processing action...';
    }
  };

  const getStatusColor = (status: NavigationAction['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      case 'in-progress': return 'text-blue-600 dark:text-blue-400';
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'failed': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: NavigationAction['status']) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'failed': return AlertCircle;
      default: return null;
    }
  };

  if (activeActions.length === 0) return null;

  return (
    <motion.div
      className="fixed top-4 right-4 z-50 space-y-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <AnimatePresence mode="popLayout">
        {activeActions.map((action) => {
          const ActionIcon = getActionIcon(action.type);
          const StatusIcon = getStatusIcon(action.status);
          
          return (
            <motion.div
              key={action.id}
              className={classNames(
                "flex items-center gap-3 rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg",
                "min-w-[280px] max-w-[400px]",
                action.status === 'in-progress' 
                  ? "border-blue-200 dark:border-blue-800" 
                  : "border-border"
              )}
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              layout
            >
              {/* Action Icon */}
              <motion.div
                className={classNames(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  action.status === 'in-progress' 
                    ? "bg-blue-100 dark:bg-blue-900" 
                    : "bg-muted"
                )}
                animate={action.status === 'in-progress' ? { rotate: 360 } : {}}
                transition={action.status === 'in-progress' ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                } : {}}
              >
                <ActionIcon 
                  size={16} 
                  className={classNames(
                    action.status === 'in-progress' 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-muted-foreground"
                  )}
                />
              </motion.div>

              {/* Action Details */}
              <div className="flex-1 min-w-0">
                <motion.p 
                  className={classNames(
                    "text-sm font-medium truncate",
                    getStatusColor(action.status)
                  )}
                  layout
                >
                  {getActionMessage(action)}
                </motion.p>
                
                {/* Progress Bar for In-Progress Actions */}
                {action.status === 'in-progress' && (
                  <motion.div
                    className="mt-2 h-1 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full rounded-full bg-blue-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Status Icon */}
              {StatusIcon && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <StatusIcon 
                    size={16} 
                    className={getStatusColor(action.status)}
                  />
                </motion.div>
              )}

              {/* Dismiss Button */}
              {onDismiss && action.status !== 'in-progress' && (
                <motion.button
                  onClick={() => onDismiss(action.id)}
                  className="ml-2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Dismiss notification"
                >
                  ×
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

// Hook for managing navigation actions
export function useNavigationActions() {
  const [actions, setActions] = React.useState<NavigationAction[]>([]);

  const addAction = React.useCallback((
    type: NavigationAction['type'],
    target: string,
    message?: string
  ) => {
    const action: NavigationAction = {
      id: `${type}-${target}-${Date.now()}`,
      type,
      target,
      status: 'pending',
      message,
      timestamp: new Date(),
    };
    
    setActions(prev => [...prev, action]);
    return action.id;
  }, []);

  const updateActionStatus = React.useCallback((
    actionId: string,
    status: NavigationAction['status'],
    message?: string
  ) => {
    setActions(prev => prev.map(action => 
      action.id === actionId 
        ? { ...action, status, message: message || action.message }
        : action
    ));
  }, []);

  const removeAction = React.useCallback((actionId: string) => {
    setActions(prev => prev.filter(action => action.id !== actionId));
  }, []);

  const clearCompletedActions = React.useCallback(() => {
    setActions(prev => prev.filter(action => 
      action.status === 'pending' || action.status === 'in-progress'
    ));
  }, []);

  return {
    actions,
    addAction,
    updateActionStatus,
    removeAction,
    clearCompletedActions,
  };
}
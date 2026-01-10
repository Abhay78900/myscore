import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Loader2 } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
  isEnabled?: boolean;
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  className = '',
  isEnabled = true 
}: PullToRefreshProps) {
  const { 
    containerRef, 
    isPulling, 
    isRefreshing, 
    pullDistance, 
    pullProgress 
  } = usePullToRefresh({ onRefresh, isEnabled });

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-auto ${className}`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Pull indicator */}
      <AnimatePresence>
        {(isPulling || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ 
              opacity: 1, 
              y: Math.max(pullDistance - 40, 0)
            }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute top-0 left-0 right-0 flex justify-center z-50 pointer-events-none"
          >
            <div className="bg-background border shadow-lg rounded-full p-3">
              {isRefreshing ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <motion.div
                  animate={{ rotate: pullProgress * 180 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <RefreshCw 
                    className={`w-5 h-5 transition-colors ${
                      pullProgress >= 1 ? 'text-primary' : 'text-muted-foreground'
                    }`} 
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        animate={{
          y: isPulling ? pullDistance * 0.3 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

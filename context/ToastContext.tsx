'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // in milliseconds, 0 = no auto-dismiss
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load toast from localStorage on mount
  useEffect(() => {
    try {
      const storedToast = localStorage.getItem('persistentToast');
      if (storedToast) {
        const toast = JSON.parse(storedToast);
        setToasts([toast]);
        localStorage.removeItem('persistentToast');
        
        // Auto-dismiss after 2 seconds
        const timer = setTimeout(() => {
          setToasts([]);
        }, 2000);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error loading toast from storage:', error);
    }
  }, []);

  const addToast = useCallback((type: ToastType, message: string, duration: number = 2000) => {
    const id = crypto.randomUUID();
    const newToast: Toast = { id, type, message, duration };

    setToasts((prev) => [...prev, newToast]);

    // If duration is 0, store in localStorage for persistence across page reloads
    if (duration === 0) {
      try {
        localStorage.setItem('persistentToast', JSON.stringify(newToast));
      } catch (error) {
        console.error('Error storing toast:', error);
      }
      return id;
    }

    if (duration > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);

      return id;
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    try {
      localStorage.removeItem('persistentToast');
    } catch (error) {
      console.error('Error removing toast from storage:', error);
    }
  }, []);

  const value = useMemo<ToastContextType>(
    () => ({
      toasts,
      addToast,
      removeToast,
    }),
    [toasts, addToast, removeToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

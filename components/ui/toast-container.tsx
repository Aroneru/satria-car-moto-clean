'use client';

import { useToast } from '@/context/ToastContext';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-4 px-6 py-4 rounded-lg shadow-lg border-2 min-w-[300px] animate-in slide-in-from-right-full duration-300 ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-300 text-green-800'
              : toast.type === 'info'
              ? 'bg-blue-50 border-blue-300 text-blue-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : toast.type === 'info' ? (
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className={`flex-shrink-0 p-1 hover:bg-opacity-20 transition-colors rounded ${
              toast.type === 'success'
                ? 'hover:bg-green-600 text-green-600'
                : toast.type === 'info'
                ? 'hover:bg-blue-600 text-blue-600'
                : 'hover:bg-red-600 text-red-600'
            }`}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

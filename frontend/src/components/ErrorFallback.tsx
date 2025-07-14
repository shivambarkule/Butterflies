import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export const ErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-glass-100/20 backdrop-blur-xl rounded-2xl border border-glass-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Oops! Something went wrong
          </h1>
          
          <p className="text-gray-300 mb-6">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="text-sm text-gray-400 cursor-pointer mb-2">
                Error Details
              </summary>
              <pre className="text-xs text-red-300 bg-red-900/20 p-3 rounded-lg overflow-auto">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetErrorBoundary}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-400 to-purple-400 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-brand-400/25 transition-all duration-300 flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 px-4 py-2 bg-glass-100/20 backdrop-blur-md rounded-lg border border-glass-200 text-white font-medium hover:bg-glass-200/30 transition-all duration-300 flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
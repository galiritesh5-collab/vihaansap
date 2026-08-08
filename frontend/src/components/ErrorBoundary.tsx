import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Global Error Boundary
 * Catches any uncaught React render errors anywhere in the component tree.
 * Displays a graceful fallback screen instead of a blank white page.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    // In production, you could send this to a logging service like Sentry
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Navigate home as a safe fallback
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
          <div className="max-w-md w-full">
            <img
              src="/web-logo.png"
              alt="Sri Vihaan Logo"
              className="h-16 w-auto object-contain mx-auto mb-8 opacity-70"
            />
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h1>
              <p className="text-slate-500 text-sm mb-6">
                An unexpected error occurred. Our team has been notified. Please try refreshing the
                page or go back to the home page.
              </p>
              {process.env.NODE_ENV !== 'production' && this.state.error && (
                <details className="text-left bg-red-50 rounded-lg p-3 mb-6 text-xs text-red-700 overflow-auto max-h-32">
                  <summary className="font-semibold cursor-pointer">Error Details (dev only)</summary>
                  <pre className="mt-2 whitespace-pre-wrap">{this.state.error.toString()}</pre>
                </details>
              )}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Refresh Page
                </button>
                <button
                  onClick={this.handleReset}
                  className="px-5 py-2.5 bg-[#1763b6] text-white font-semibold text-sm rounded-xl hover:bg-[#145096] transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-6">
              Sri Vihaan SAP Consulting &bull; support@vihaansapconsultancy.com
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

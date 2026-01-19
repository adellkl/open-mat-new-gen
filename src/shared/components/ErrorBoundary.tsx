import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Composant Error Boundary pour capturer les erreurs React
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center border border-white/10 p-12">
            <AlertTriangle className="h-12 w-12 text-red-500/80 mx-auto mb-8" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
              Erreur Système
            </h2>
            <p className="text-sm text-white/40 mb-8 font-medium leading-relaxed">
              Une erreur inattendue s'est produite. Veuillez actualiser la page ou réessayer plus tard.
            </p>
            {this.state.error && (
              <div className="mb-8 p-4 bg-red-500/5 border border-red-500/10 text-left">
                <p className="text-xs font-mono text-red-500/60 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all"
            >
              <RefreshCcw className="h-4 w-4" />
              Réinitialiser
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

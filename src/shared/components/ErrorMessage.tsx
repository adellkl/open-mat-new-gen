import React from 'react';
import { AlertTriangle, RefreshCw, XCircle } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: 'error' | 'warning' | 'info';
  compact?: boolean;
}

/**
 * Composant réutilisable pour afficher les messages d'erreur
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Erreur',
  message,
  onRetry,
  variant = 'error',
  compact = false
}) => {
  const icons = {
    error: XCircle,
    warning: AlertTriangle,
    info: AlertTriangle
  };

  const colors = {
    error: {
      icon: 'text-red-500/80',
      border: 'border-red-500/20',
      bg: 'bg-red-500/5',
      text: 'text-red-500/90'
    },
    warning: {
      icon: 'text-yellow-500/80',
      border: 'border-yellow-500/20',
      bg: 'bg-yellow-500/5',
      text: 'text-yellow-500/90'
    },
    info: {
      icon: 'text-blue-500/80',
      border: 'border-blue-500/20',
      bg: 'bg-blue-500/5',
      text: 'text-blue-500/90'
    }
  };

  const Icon = icons[variant];
  const colorScheme = colors[variant];

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-4 border ${colorScheme.border} ${colorScheme.bg} rounded`} role="alert">
        <Icon className={`h-4 w-4 ${colorScheme.icon} flex-shrink-0`} aria-hidden="true" />
        <p className={`text-xs font-medium ${colorScheme.text} flex-grow`}>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white/30`}
            aria-label="Réessayer"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`border ${colorScheme.border} ${colorScheme.bg} p-8 sm:p-12 text-center`}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`h-10 w-10 sm:h-12 sm:w-12 ${colorScheme.icon} mx-auto mb-6`} aria-hidden="true" />
      <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mb-3">
        {title}
      </h3>
      <p className={`text-sm ${colorScheme.text} mb-8 font-medium leading-relaxed max-w-md mx-auto`}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Réessayer
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

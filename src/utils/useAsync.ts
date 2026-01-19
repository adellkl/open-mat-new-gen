import { useState, useEffect, useCallback } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * Hook personnalisé pour gérer les opérations asynchrones
 * Avec gestion automatique du loading, erreurs et retry
 */
export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseAsyncOptions = {}
) => {
  const { immediate = true, retryCount = 0, retryDelay = 1000 } = options;
  
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null
  });

  const execute = useCallback(
    async (attempt = 0): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await asyncFunction();
        setState({ data: response, loading: false, error: null });
        return response;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Une erreur est survenue');
        
        // Retry logic
        if (attempt < retryCount) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
          return execute(attempt + 1);
        }
        
        setState({ data: null, loading: false, error: err });
        return null;
      }
    },
    [...dependencies, retryCount, retryDelay]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, loading: false, error: null })
  };
};

/**
 * Hook pour gérer plusieurs requêtes en parallèle
 */
export const useAsyncBatch = <T>(
  asyncFunctions: (() => Promise<T>)[],
  dependencies: any[] = []
) => {
  const [state, setState] = useState<UseAsyncState<T[]>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const execute = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const results = await Promise.all(asyncFunctions.map(fn => fn()));
        setState({ data: results, loading: false, error: null });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Une erreur est survenue');
        setState({ data: null, loading: false, error: err });
      }
    };

    execute();
  }, dependencies);

  return state;
};

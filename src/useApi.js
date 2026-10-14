import { useCallback, useEffect, useState } from 'react';
import { api } from './api';

// Loads data from the backend and lets a page reload it after a change
export function useApi(path) {
  const [state, setState] = useState({ data: null, error: '' });

  const load = useCallback(() => {
    return api(path)
      .then((data) => setState({ data, error: '' }))
      .catch((err) => setState({ data: null, error: err.message }));
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}

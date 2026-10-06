import { useEffect, useState } from 'react';
import type { Scenario } from '@/types/scenario';
import { fetchScenario, fetchScenarios } from '@/api/scenarios';

interface State<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

export function useScenarios(): State<Scenario[]> {
  const [state, setState] = useState<State<Scenario[]>>({ data: [], loading: true, error: null });
  useEffect(() => {
    let alive = true;
    fetchScenarios()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((e: Error) => alive && setState({ data: [], loading: false, error: e.message }));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

export function useScenario(id: string | undefined): State<Scenario | null> {
  const [state, setState] = useState<State<Scenario | null>>({ data: null, loading: true, error: null });
  useEffect(() => {
    if (!id) return;
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    fetchScenario(id)
      .then((data) => alive && setState({ data, loading: false, error: data ? null : 'Scenario not found' }))
      .catch((e: Error) => alive && setState({ data: null, loading: false, error: e.message }));
    return () => {
      alive = false;
    };
  }, [id]);
  return state;
}

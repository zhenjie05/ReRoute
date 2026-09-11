import { useCallback, useSyncExternalStore } from 'react';
import type { Dispatch, SetStateAction } from 'react';

const values = new Map<string, unknown>();
const listeners = new Set<() => void>();
function subscribe(callback: () => void) { listeners.add(callback); return () => { listeners.delete(callback); }; }
// Frontend-only session state, isolated by room and collection.
export function useRoomSessionState<T>(roomId: string, collection: string, initial: () => T): [T, Dispatch<SetStateAction<T>>] {
  const key = `${roomId}:${collection}`;
  const snapshot = () => { if (!values.has(key)) values.set(key, initial()); return values.get(key) as T; };
  const value = useSyncExternalStore(subscribe, snapshot, snapshot);
  const setValue = useCallback<Dispatch<SetStateAction<T>>>((update) => {
    const previous = values.get(key) as T;
    values.set(key, typeof update === 'function' ? (update as (value: T) => T)(previous) : update);
    listeners.forEach(callback => callback());
  }, [key]);
  return [value, setValue];
}

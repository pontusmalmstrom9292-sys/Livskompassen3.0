import { useCallback, useSyncExternalStore } from 'react';
import {
  disconnectPlaneringInboxProvider,
  preparePlaneringInboxConnection,
  readPlaneringInboxConnections,
  type PlaneringInboxConnectionsState,
  type PlaneringInboxProvider,
} from '../planeringInboxConnections';

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((l) => l());
}

function getSnapshot(): PlaneringInboxConnectionsState {
  return readPlaneringInboxConnections();
}

export function usePlaneringInboxConnections() {
  const connections = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const prepare = useCallback((provider: PlaneringInboxProvider, accountHint: string) => {
    preparePlaneringInboxConnection(provider, accountHint);
    emit();
  }, []);

  const disconnect = useCallback((provider: PlaneringInboxProvider) => {
    disconnectPlaneringInboxProvider(provider);
    emit();
  }, []);

  const bothPrepared =
    connections.gmail.phase === 'prepared' &&
    connections.google_calendar.phase === 'prepared';

  return { connections, prepare, disconnect, bothPrepared };
}

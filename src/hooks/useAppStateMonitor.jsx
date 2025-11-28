import {useRef, useEffect} from 'react';
import {AppState} from 'react-native';
import useTimerStore from '../store';

export const useAppStateMonitor = () => {
  const appStateRef = useRef(AppState.currentState);
  const syncAllTimers = useTimerStore(state => state.syncAllTimers);
  const restartIntervals = useTimerStore(state => state.restartIntervals);
  const clearAllIntervals = useTimerStore(state => state.clearAllIntervals);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appStateRef.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        clearAllIntervals();
      }

      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        syncAllTimers();
        setTimeout(() => {
          restartIntervals();
        }, 100);
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [syncAllTimers, restartIntervals, clearAllIntervals]);
};

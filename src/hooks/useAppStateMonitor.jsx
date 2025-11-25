import {useRef, useEffect} from 'react';
import {AppState} from 'react-native';
import useTimerStore from '../store';

export const useAppStateMonitor = () => {
  const appStateRef = useRef(AppState.currentState);
  const syncAllTimers = useTimerStore(state => state.syncAllTimers);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        syncAllTimers();
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [syncAllTimers]);
};

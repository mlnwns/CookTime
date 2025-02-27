import {useRef, useEffect} from 'react';
import {AppState} from 'react-native';
import {useBackgroundTask} from './useBackgroundTask';

export const useAppStateMonitor = () => {
  const appStateRef = useRef(AppState.currentState);
  const {startBackgroundTask, stopBackgroundTask} = useBackgroundTask();

  useEffect(() => {
    if (appStateRef.current === 'active') {
      stopBackgroundTask();
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // console.log('App has come to the foreground!');
        stopBackgroundTask();
      }

      if (
        appStateRef.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        // console.log('App has gone to the background!');
        startBackgroundTask();
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
      stopBackgroundTask();
    };
  }, []);
};

import {useBackgroundAudio} from './useBackgroundSound';
import {useRef, useEffect} from 'react';
import {AppState} from 'react-native';

export const useAppStateMonitor = () => {
  const appStateRef = useRef(AppState.currentState);
  const {startSilentAudio, stopSilentAudio} = useBackgroundAudio();

  useEffect(() => {
    if (appStateRef.current === 'active') {
      stopSilentAudio();
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // console.log('🔄 Foreground: Stopping silent audio');
        stopSilentAudio();
      }

      if (
        appStateRef.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        // console.log('🎵 Background: Starting silent audio');
        startSilentAudio();
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
      stopSilentAudio();
    };
  }, []);
};

import {useRef} from 'react';
import Sound from 'react-native-sound';

export const useBackgroundAudio = () => {
  const soundRef = useRef(null);

  const startSilentAudio = () => {
    try {
      if (!soundRef.current) {
        Sound.setCategory('Playback');

        // mp3 무한 루프 재생
        soundRef.current = new Sound(
          'silentSound.mp3',
          Sound.MAIN_BUNDLE,
          error => {
            if (error) {
              console.error('Failed to load sound', error);
              return;
            }

            soundRef.current.setNumberOfLoops(-1); // 무한 반복
            soundRef.current.play(success => {
              if (!success) {
                console.error('Playback failed due to audio decoding errors');
              }
            });
          },
        );
      } else {
        soundRef.current.play();
      }
    } catch (error) {
      console.error('Error starting silent audio:', error);
    }
  };

  const stopSilentAudio = () => {
    try {
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current.release(); // 오디오 리소스 해제
          soundRef.current = null; // 메모리 정리
        });
      }
    } catch (error) {
      console.error('Error stopping silent audio:', error);
    }
  };

  return {startSilentAudio, stopSilentAudio};
};

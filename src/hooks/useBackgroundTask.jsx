import BackgroundService from 'react-native-background-actions';

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const veryIntensiveTask = async ({delay}) => {
  while (BackgroundService.isRunning()) {
    await sleep(delay);
  }
};

const options = {
  parameters: {
    delay: 1000,
  },
};

export const useBackgroundTask = () => {
  const startBackgroundTask = async () => {
    try {
      if (!BackgroundService.isRunning()) {
        await BackgroundService.start(veryIntensiveTask, options);
        return true;
      }
    } catch (error) {
      console.error('Error starting background service:', error);
      return false;
    }
    return false;
  };

  const stopBackgroundTask = async () => {
    try {
      if (BackgroundService.isRunning()) {
        await BackgroundService.stop();
        return true;
      }
    } catch (error) {
      console.error('Error stopping background service:', error);
      return false;
    }
    return false;
  };

  return {startBackgroundTask, stopBackgroundTask};
};

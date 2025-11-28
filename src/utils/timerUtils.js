export const calculateTotalSeconds = detailTimerData => {
  return detailTimerData.reduce(
    (total, step) =>
      total + (parseInt(step.minutes) * 60 + parseInt(step.seconds)),
    0,
  );
};

export const calculateCurrentStep = (detailTimerData, elapsed) => {
  let accumulatedTime = 0;
  let currentStepIndex = 0;
  let currentStepRemaining = 0;

  for (let i = 0; i < detailTimerData.length; i++) {
    const stepDuration =
      parseInt(detailTimerData[i].minutes) * 60 +
      parseInt(detailTimerData[i].seconds);

    if (elapsed < accumulatedTime + stepDuration) {
      currentStepIndex = i;
      currentStepRemaining = accumulatedTime + stepDuration - elapsed;
      break;
    }

    accumulatedTime += stepDuration;
  }

  return {currentStepIndex, currentStepRemaining};
};

export const createTimerIntervalCallback = (timerId, getIntervalId, set) => {
  return () => {
    set(state => {
      const currentTimer = state.timers[timerId];
      if (!currentTimer || !currentTimer.isRunning) {
        const intervalId =
          typeof getIntervalId === 'function' ? getIntervalId() : getIntervalId;
        clearInterval(intervalId);
        return state;
      }

      const initialTotalSeconds = calculateTotalSeconds(
        currentTimer.detailTimerData,
      );

      const elapsed = Math.floor((Date.now() - currentTimer.startTime) / 1000);
      const newRemainingTotalSeconds = Math.max(
        initialTotalSeconds - elapsed,
        0,
      );

      const {currentStepIndex, currentStepRemaining} = calculateCurrentStep(
        currentTimer.detailTimerData,
        elapsed,
      );

      if (newRemainingTotalSeconds === 0) {
        const intervalId =
          typeof getIntervalId === 'function' ? getIntervalId() : getIntervalId;
        clearInterval(intervalId);

        return {
          timers: {
            ...state.timers,
            [timerId]: {
              ...currentTimer,
              isRunning: false,
              intervalId: null,
              currentStepIndex: 0,
              time: {
                minutes: parseInt(currentTimer.detailTimerData[0].minutes),
                seconds: parseInt(currentTimer.detailTimerData[0].seconds),
              },
              remainingTotalSeconds: initialTotalSeconds,
              totalTime: {
                minutes: Math.floor(initialTotalSeconds / 60),
                seconds: initialTotalSeconds % 60,
              },
              startTime: null,
              pausedAt: null,
              pausedRemaining: null,
            },
          },
        };
      }

      const minutes = Math.floor(currentStepRemaining / 60);
      const seconds = currentStepRemaining % 60;

      return {
        timers: {
          ...state.timers,
          [timerId]: {
            ...currentTimer,
            currentStepIndex,
            time: {minutes, seconds},
            remainingTotalSeconds: newRemainingTotalSeconds,
            totalTime: {
              minutes: Math.floor(newRemainingTotalSeconds / 60),
              seconds: newRemainingTotalSeconds % 60,
            },
            startTime: currentTimer.startTime,
          },
        },
      };
    });
  };
};

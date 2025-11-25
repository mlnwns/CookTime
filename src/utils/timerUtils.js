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

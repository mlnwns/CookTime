import {create} from 'zustand';
import {Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {
  calculateTotalSeconds,
  calculateCurrentStep,
  createTimerIntervalCallback,
} from './utils/timerUtils';

const useTimerStore = create(set => ({
  timers: {},

  initTimer: (
    timerId,
    initialMinutes,
    initialSeconds,
    detailTimerData,
    timerName,
  ) => {
    set(state => {
      // 이미 실행 중인 타이머는 건드리지 않음
      if (state.timers[timerId]?.isRunning) {
        return state;
      }

      // 이미 존재하는 타이머의 경우, 중지된 상태라면 시간만 업데이트
      if (state.timers[timerId]) {
        return {
          timers: {
            ...state.timers,
            [timerId]: {
              ...state.timers[timerId],
              detailTimerData: detailTimerData,
              time: {
                minutes: parseInt(detailTimerData[0].minutes),
                seconds: parseInt(detailTimerData[0].seconds),
              },
              totalTime: {
                minutes: parseInt(initialMinutes),
                seconds: parseInt(initialSeconds),
              },
              remainingTotalSeconds:
                parseInt(initialMinutes) * 60 + parseInt(initialSeconds),
            },
          },
        };
      }

      const defaultTimer = {
        minutes: initialMinutes,
        seconds: initialSeconds,
        fireData: '중불',
      };

      const timerData =
        detailTimerData && detailTimerData.length > 0
          ? detailTimerData[0]
          : defaultTimer;

      const totalSeconds =
        parseInt(initialMinutes) * 60 + parseInt(initialSeconds);

      return {
        timers: {
          ...state.timers,
          [timerId]: {
            time: {
              minutes: parseInt(timerData.minutes),
              seconds: parseInt(timerData.seconds),
            },
            timerName: timerName,
            currentStepIndex: 0,
            detailTimerData: detailTimerData || [defaultTimer],
            isRunning: false,
            intervalId: null,
            remainingTotalSeconds: totalSeconds,
            totalTime: {
              minutes: parseInt(initialMinutes),
              seconds: parseInt(initialSeconds),
            },
            startTime: null,
            pausedAt: null,
            pausedRemaining: null,
          },
        },
      };
    });
  },

  startTimer: timerId => {
    set(state => {
      const timer = state.timers[timerId];
      if (!timer || (timer.isRunning && timer.intervalId)) return state;

      const initialTotalSeconds = calculateTotalSeconds(timer.detailTimerData);

      const now = Date.now();
      const startTime = timer.pausedRemaining
        ? now - (initialTotalSeconds - timer.pausedRemaining) * 1000
        : now;

      const elapsedBeforePause = timer.pausedRemaining
        ? initialTotalSeconds - timer.pausedRemaining
        : 0;

      let accumulatedSeconds = 0;
      timer.detailTimerData.forEach((step, index) => {
        const stepDuration =
          parseInt(step.minutes) * 60 + parseInt(step.seconds);
        accumulatedSeconds += stepDuration;

        if (accumulatedSeconds > elapsedBeforePause) {
          const notificationTime = new Date(
            startTime + accumulatedSeconds * 1000,
          );

          if (Platform.OS === 'ios') {
            PushNotificationIOS.addNotificationRequest({
              id: `timer-${timerId}-step-${index}`,
              title: 'COOKTIME',
              body: `${timer.timerName}의 ${
                index + 1
              }번째 타이머가 완료되었습니다!`,
              fireDate: notificationTime,
              sound: 'cook_alarm.mp3',
            });
          } else if (Platform.OS === 'android') {
            PushNotification.localNotificationSchedule({
              channelId: 'default',
              id: `timer-${timerId}-step-${index}`,
              title: 'COOKTIME',
              message: `${timer.timerName}의 ${
                index + 1
              }번째 타이머가 완료되었습니다!`,
              date: notificationTime,
              soundName: 'default',
              allowWhileIdle: true,
            });
          }
        }
      });

      let intervalId;
      const intervalCallback = createTimerIntervalCallback(timerId, () => intervalId, set);
      intervalId = setInterval(intervalCallback, 1000);

      return {
        timers: {
          ...state.timers,
          [timerId]: {
            ...timer,
            isRunning: true,
            intervalId,
            startTime,
            pausedAt: null,
            pausedRemaining: null,
          },
        },
      };
    });
  },

  stopTimer: timerId => {
    set(state => {
      const timer = state.timers[timerId];
      if (!timer) return state;

      if (timer?.intervalId) {
        clearInterval(timer.intervalId);
      }

      timer.detailTimerData.forEach((_, index) => {
        if (Platform.OS === 'ios') {
          PushNotificationIOS.removePendingNotificationRequests([
            `timer-${timerId}-step-${index}`,
          ]);
        } else if (Platform.OS === 'android') {
          PushNotification.cancelLocalNotification(
            `timer-${timerId}-step-${index}`,
          );
        }
      });

      // 현재 타이머의 상태를 유지하면서 실행만 중지
      return {
        timers: {
          ...state.timers,
          [timerId]: {
            ...timer,
            isRunning: false,
            intervalId: null,
            pausedAt: Date.now(),
            pausedRemaining: timer.remainingTotalSeconds,
            time: timer.time,
            remainingTotalSeconds: timer.remainingTotalSeconds,
            currentStepIndex: timer.currentStepIndex,
          },
        },
      };
    });
  },

  resetTimer: (timerId, initialMinutes, initialSeconds) => {
    set(state => {
      const timer = state.timers[timerId];
      if (timer?.intervalId) {
        clearInterval(timer.intervalId);
      }

      if (timer?.detailTimerData) {
        timer.detailTimerData.forEach((_, index) => {
          if (Platform.OS === 'ios') {
            PushNotificationIOS.removePendingNotificationRequests([
              `timer-${timerId}-step-${index}`,
            ]);
          } else if (Platform.OS === 'android') {
            PushNotification.cancelLocalNotification(
              `timer-${timerId}-step-${index}`,
            );
          }
        });
      }

      const firstStep = timer?.detailTimerData[0] || {
        minutes: initialMinutes,
        seconds: initialSeconds,
      };

      const totalSeconds =
        parseInt(initialMinutes) * 60 + parseInt(initialSeconds);

      return {
        timers: {
          ...state.timers,
          [timerId]: {
            ...timer,
            currentStepIndex: 0,
            time: {
              minutes: parseInt(firstStep.minutes),
              seconds: parseInt(firstStep.seconds),
            },
            isRunning: false,
            intervalId: null,
            remainingTotalSeconds: totalSeconds,
            totalTime: {
              minutes: parseInt(initialMinutes),
              seconds: parseInt(initialSeconds),
            },
            startTime: null,
            pausedAt: null,
            pausedRemaining: null,
          },
        },
      };
    });
  },

  syncAllTimers: () => {
    set(state => {
      const updatedTimers = {...state.timers};

      Object.keys(updatedTimers).forEach(timerId => {
        const timer = updatedTimers[timerId];

        if (timer.isRunning && timer.startTime) {
          const initialTotalSeconds = calculateTotalSeconds(
            timer.detailTimerData,
          );

          const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
          const newRemainingTotalSeconds = Math.max(
            initialTotalSeconds - elapsed,
            0,
          );

          if (newRemainingTotalSeconds === 0) {
            if (timer.intervalId) {
              clearInterval(timer.intervalId);
            }

            updatedTimers[timerId] = {
              ...timer,
              isRunning: false,
              intervalId: null,
              currentStepIndex: 0,
              time: {
                minutes: parseInt(timer.detailTimerData[0].minutes),
                seconds: parseInt(timer.detailTimerData[0].seconds),
              },
              remainingTotalSeconds: initialTotalSeconds,
              totalTime: {
                minutes: Math.floor(initialTotalSeconds / 60),
                seconds: initialTotalSeconds % 60,
              },
              startTime: null,
              pausedAt: null,
              pausedRemaining: null,
            };
          } else {
            const {currentStepIndex, currentStepRemaining} =
              calculateCurrentStep(timer.detailTimerData, elapsed);

            updatedTimers[timerId] = {
              ...timer,
              currentStepIndex,
              time: {
                minutes: Math.floor(currentStepRemaining / 60),
                seconds: currentStepRemaining % 60,
              },
              remainingTotalSeconds: newRemainingTotalSeconds,
              totalTime: {
                minutes: Math.floor(newRemainingTotalSeconds / 60),
                seconds: newRemainingTotalSeconds % 60,
              },
            };
          }
        }
      });

      return {timers: updatedTimers};
    });
  },

  restartIntervals: () => {
    set(state => {
      const updatedTimers = {...state.timers};

      Object.keys(updatedTimers).forEach(timerId => {
        const timer = updatedTimers[timerId];

        if (timer.isRunning && timer.startTime && !timer.intervalId) {
          let intervalId;
          const intervalCallback = createTimerIntervalCallback(timerId, () => intervalId, set);
          intervalId = setInterval(intervalCallback, 1000);

          updatedTimers[timerId] = {
            ...timer,
            intervalId,
          };
        }
      });

      return {timers: updatedTimers};
    });
  },

  clearAllIntervals: () => {
    set(state => {
      const updatedTimers = {...state.timers};

      Object.keys(updatedTimers).forEach(timerId => {
        const timer = updatedTimers[timerId];
        if (timer.intervalId) {
          clearInterval(timer.intervalId);
          updatedTimers[timerId] = {
            ...timer,
            intervalId: null,
          };
        }
      });

      return {timers: updatedTimers};
    });
  },
}));

export default useTimerStore;

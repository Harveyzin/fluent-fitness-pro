import { useState, useEffect, useCallback } from 'react';

interface TimerState {
  isRunning: boolean;
  timeElapsed: number;
  restTime: number;
  isResting: boolean;
}

export const useTimer = () => {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    timeElapsed: 0,
    restTime: 0,
    isResting: false,
  });

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    setState({
      isRunning: false,
      timeElapsed: 0,
      restTime: 0,
      isResting: false,
    });
  }, []);

  const startRest = useCallback((duration: number) => {
    setState(prev => ({
      ...prev,
      isResting: true,
      restTime: duration,
      isRunning: true,
    }));
  }, []);

  const skipRest = useCallback(() => {
    setState(prev => ({
      ...prev,
      isResting: false,
      restTime: 0,
    }));
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const playSound = useCallback((type: 'start' | 'rest' | 'finish') => {
    // Create simple beep sounds using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different events
    switch (type) {
      case 'start':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
      case 'rest':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        break;
      case 'finish':
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        break;
    }

    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, []);

  useEffect(() => {
    if (state.isRunning) {
      const id = setInterval(() => {
        setState(prev => {
          if (prev.isResting && prev.restTime > 0) {
            const newRestTime = prev.restTime - 1;
            if (newRestTime === 0) {
              playSound('finish');
              return {
                ...prev,
                restTime: 0,
                isResting: false,
              };
            }
            return { ...prev, restTime: newRestTime };
          } else if (!prev.isResting) {
            return { ...prev, timeElapsed: prev.timeElapsed + 1 };
          }
          return prev;
        });
      }, 1000);
      setIntervalId(id);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [state.isRunning, intervalId, playSound]);

  return {
    ...state,
    startTimer,
    pauseTimer,
    resetTimer,
    startRest,
    skipRest,
    formatTime,
    playSound,
  };
};
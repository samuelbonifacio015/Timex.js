import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface StopwatchConfig {
  showMicroseconds: boolean;
  autoSave: boolean;
  soundEnabled: boolean;
}

interface PomodoroConfig {
  workTime: number;
  shortBreak: number;
  longBreak: number;
  pomodoroSound: boolean;
  autoStartBreaks: boolean;
}

interface ConfigContextType {
  stopwatchConfig: StopwatchConfig;
  pomodoroConfig: PomodoroConfig;
  updateStopwatchConfig: (config: Partial<StopwatchConfig>) => void;
  updatePomodoroConfig: (config: Partial<PomodoroConfig>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'timex-config';

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [stopwatchConfig, setStopwatchConfig] = useState<StopwatchConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.stopwatchConfig || {
          showMicroseconds: true,
          autoSave: false,
          soundEnabled: true,
        };
      } catch {
        return {
          showMicroseconds: true,
          autoSave: false,
          soundEnabled: true,
        };
      }
    }
    return {
      showMicroseconds: true,
      autoSave: false,
      soundEnabled: true,
    };
  });

  const [pomodoroConfig, setPomodoroConfig] = useState<PomodoroConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.pomodoroConfig || {
          workTime: 25,
          shortBreak: 5,
          longBreak: 15,
          pomodoroSound: true,
          autoStartBreaks: false,
        };
      } catch {
        return {
          workTime: 25,
          shortBreak: 5,
          longBreak: 15,
          pomodoroSound: true,
          autoStartBreaks: false,
        };
      }
    }
    return {
      workTime: 25,
      shortBreak: 5,
      longBreak: 15,
      pomodoroSound: true,
      autoStartBreaks: false,
    };
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        stopwatchConfig,
        pomodoroConfig,
      })
    );
  }, [stopwatchConfig, pomodoroConfig]);

  const updateStopwatchConfig = (config: Partial<StopwatchConfig>) => {
    setStopwatchConfig(prev => ({ ...prev, ...config }));
  };

  const updatePomodoroConfig = (config: Partial<PomodoroConfig>) => {
    setPomodoroConfig(prev => ({ ...prev, ...config }));
  };

  return (
    <ConfigContext.Provider
      value={{
        stopwatchConfig,
        pomodoroConfig,
        updateStopwatchConfig,
        updatePomodoroConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

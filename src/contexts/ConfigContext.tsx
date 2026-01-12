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

interface RelojConfig {
  enableScreenshotExport: boolean;
  customMessage: string;
}

export interface StopwatchSession {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  lapsCount: number;
  date: string;
}

interface ConfigContextType {
  stopwatchConfig: StopwatchConfig;
  pomodoroConfig: PomodoroConfig;
  relojConfig: RelojConfig;
  stopwatchHistory: StopwatchSession[];
  updateStopwatchConfig: (config: Partial<StopwatchConfig>) => void;
  updatePomodoroConfig: (config: Partial<PomodoroConfig>) => void;
  updateRelojConfig: (config: Partial<RelojConfig>) => void;
  addStopwatchSession: (session: StopwatchSession) => void;
  deleteStopwatchSession: (id: string) => void;
  clearStopwatchHistory: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'timex-config';
const HISTORY_KEY = 'timex-stopwatch-history';

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

  const [relojConfig, setRelojConfig] = useState<RelojConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.relojConfig || {
          enableScreenshotExport: false,
          customMessage: 'Hola son las',
        };
      } catch {
        return {
          enableScreenshotExport: false,
          customMessage: 'Hola son las',
        };
      }
    }
    return {
      enableScreenshotExport: false,
      customMessage: 'Hola son las',
    };
  });

  const [stopwatchHistory, setStopwatchHistory] = useState<StopwatchSession[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        stopwatchConfig,
        pomodoroConfig,
        relojConfig,
      })
    );
  }, [stopwatchConfig, pomodoroConfig, relojConfig]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(stopwatchHistory));
  }, [stopwatchHistory]);

  const updateStopwatchConfig = (config: Partial<StopwatchConfig>) => {
    setStopwatchConfig(prev => ({ ...prev, ...config }));
  };

  const updatePomodoroConfig = (config: Partial<PomodoroConfig>) => {
    setPomodoroConfig(prev => ({ ...prev, ...config }));
  };

  const updateRelojConfig = (config: Partial<RelojConfig>) => {
    setRelojConfig(prev => ({ ...prev, ...config }));
  };

  const addStopwatchSession = (session: StopwatchSession) => {
    setStopwatchHistory(prev => [session, ...prev]);
  };

  const deleteStopwatchSession = (id: string) => {
    setStopwatchHistory(prev => prev.filter(session => session.id !== id));
  };

  const clearStopwatchHistory = () => {
    setStopwatchHistory([]);
  };

  return (
    <ConfigContext.Provider
      value={{
        stopwatchConfig,
        pomodoroConfig,
        relojConfig,
        stopwatchHistory,
        updateStopwatchConfig,
        updatePomodoroConfig,
        updateRelojConfig,
        addStopwatchSession,
        deleteStopwatchSession,
        clearStopwatchHistory,
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

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'stopwatch' | 'pomodoro' | 'general';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

interface AchievementToast {
  achievement: Achievement;
  id: string;
}

interface AchievementsContextType {
  achievements: Achievement[];
  unlockedCount: number;
  totalCount: number;
  unlockedAchievements: Achievement[];
  lockedAchievements: Achievement[];
  unlockAchievement: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  toasts: AchievementToast[];
  addToast: (achievement: Achievement) => void;
  removeToast: (id: string) => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

const STORAGE_KEY = 'timex-achievements';

const defaultAchievements: Achievement[] = [
  // Stopwatch achievements
  {
    id: 'first-lap',
    name: 'Primera Vuelta',
    description: 'Registra tu primera vuelta en el cronómetro',
    icon: '⏱️',
    category: 'stopwatch',
    unlocked: false,
  },
  {
    id: 'marathoner',
    name: 'Maratonista',
    description: 'Mantén el cronómetro activo por más de 1 hora',
    icon: '🏃',
    category: 'stopwatch',
    unlocked: false,
    progress: 0,
    target: 3600000, // 1 hour in ms
  },
  {
    id: 'infinite-laps',
    name: 'Vueltas Infinitas',
    description: 'Registra 10 vueltas en una sola sesión',
    icon: '🔄',
    category: 'stopwatch',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'export-pro',
    name: 'Exportador Pro',
    description: 'Exporta todas tus vueltas en un archivo ZIP',
    icon: '📦',
    category: 'stopwatch',
    unlocked: false,
  },
  {
    id: 'precision',
    name: 'Precisión Total',
    description: 'Exporta una vuelta individual en formato JSON',
    icon: '🎯',
    category: 'stopwatch',
    unlocked: false,
  },
  // Pomodoro achievements
  {
    id: 'first-pomodoro',
    name: 'Primer Pomodoro',
    description: 'Completa tu primer ciclo de trabajo',
    icon: '🍅',
    category: 'pomodoro',
    unlocked: false,
  },
  {
    id: 'streak-4',
    name: 'Racha de 4',
    description: 'Completa 4 pomodoros seguidos',
    icon: '🔥',
    category: 'pomodoro',
    unlocked: false,
    progress: 0,
    target: 4,
  },
  {
    id: 'productivity-master',
    name: 'Productividad Máxima',
    description: 'Completa 8 pomodoros en un día',
    icon: '💪',
    category: 'pomodoro',
    unlocked: false,
    progress: 0,
    target: 8,
  },
  {
    id: 'rest-master',
    name: 'Maestro del Descanso',
    description: 'Alcanza un descanso largo después de 4 pomodoros',
    icon: '😌',
    category: 'pomodoro',
    unlocked: false,
  },
  {
    id: 'auto-flow',
    name: 'Flujo Continuo',
    description: 'Activa el inicio automático de descansos',
    icon: '⚡',
    category: 'pomodoro',
    unlocked: false,
  },
  // General achievements
  {
    id: 'first-use',
    name: 'Bienvenido',
    description: 'Abre Timex por primera vez',
    icon: '🎉',
    category: 'general',
    unlocked: false,
  },
  {
    id: 'productive-day',
    name: 'Día Productivo',
    description: 'Acumula 30+ minutos de tiempo enfocado en un día',
    icon: '📈',
    category: 'general',
    unlocked: false,
    progress: 0,
    target: 1800, // 30 minutes in seconds
  },
  {
    id: 'consistent',
    name: 'Constante',
    description: 'Usa la app por 7 días consecutivos',
    icon: '🏆',
    category: 'general',
    unlocked: false,
    progress: 0,
    target: 7,
  },
  {
    id: 'customizer',
    name: 'Personalizador',
    description: 'Modifica la configuración por primera vez',
    icon: '🎨',
    category: 'general',
    unlocked: false,
  },
  {
    id: 'export-all-laps',
    name: 'Coleccionista',
    description: 'Exporta 3 sesiones diferentes de cronómetro',
    icon: '📚',
    category: 'general',
    unlocked: false,
    progress: 0,
    target: 3,
  },
];

export const AchievementsProvider = ({ children }: { children: ReactNode }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved achievements with default ones (in case we add new ones)
        return defaultAchievements.map(defaultAch => {
          const savedAch = parsed.find((a: Achievement) => a.id === defaultAch.id);
          return savedAch ? { ...defaultAch, ...savedAch } : defaultAch;
        });
      } catch {
        return defaultAchievements;
      }
    }
    return defaultAchievements;
  });

  const [toasts, setToasts] = useState<AchievementToast[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  }, [achievements]);

  // Check first use on mount
  useEffect(() => {
    const hasVisited = localStorage.getItem('timex-visited');
    if (!hasVisited) {
      localStorage.setItem('timex-visited', 'true');
      setTimeout(() => {
        unlockAchievement('first-use');
      }, 1000);
    }
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === id);
      if (achievement && !achievement.unlocked) {
        // Add toast
        const toastId = `${id}-${Date.now()}`;
        setToasts(toasts => [...toasts, { achievement: { ...achievement, unlocked: true }, id: toastId }]);

        return prev.map(a =>
          a.id === id
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
            : a
        );
      }
      return prev;
    });
  }, []);

  const updateProgress = useCallback((id: string, progress: number) => {
    setAchievements(prev =>
      prev.map(a => {
        if (a.id === id && !a.unlocked && a.target !== undefined) {
          const newProgress = Math.min(progress, a.target);
          if (newProgress >= a.target) {
            // Unlock the achievement
            setTimeout(() => unlockAchievement(id), 0);
          }
          return { ...a, progress: newProgress };
        }
        return a;
      })
    );
  }, [unlockAchievement]);

  const addToast = useCallback((achievement: Achievement) => {
    const toastId = `${achievement.id}-${Date.now()}`;
    setToasts(prev => [...prev, { achievement, id: toastId }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <AchievementsContext.Provider
      value={{
        achievements,
        unlockedCount,
        totalCount,
        unlockedAchievements,
        lockedAchievements,
        unlockAchievement,
        updateProgress,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};

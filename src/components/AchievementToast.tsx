import { useEffect } from 'react';
import { useAchievements } from '../contexts/AchievementsContext';

interface AchievementToastItem {
  id: string;
  achievement: {
    icon: string;
    name: string;
    description: string;
  };
}

const AchievementToast = ({ toast }: { toast: AchievementToastItem }) => {
  const { removeToast } = useAchievements();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const handleClose = () => {
    removeToast(toast.id);
  };

  return (
    <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px] max-w-sm animate-slide-in">
      <div className="text-3xl">{toast.achievement.icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">¡Logro Desbloqueado!</span>
          <button
            onClick={handleClose}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <h4 className="font-semibold text-gray-900 mt-1">{toast.achievement.name}</h4>
        <p className="text-sm text-gray-600 mt-0.5">{toast.achievement.description}</p>
      </div>
    </div>
  );
};

export const AchievementToasts = () => {
  const { toasts } = useAchievements();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <AchievementToast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default AchievementToast;

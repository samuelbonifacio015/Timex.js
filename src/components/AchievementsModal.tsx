import { useAchievements } from '../contexts/AchievementsContext';

interface AchievementsModalProps {
  onClose: () => void;
}

type CategoryFilter = 'all' | 'stopwatch' | 'pomodoro' | 'general';

const AchievementsModal = ({ onClose }: AchievementsModalProps) => {
  const {
    achievements,
    unlockedCount,
    totalCount,
  } = useAchievements();

  const categoryLabels: Record<CategoryFilter, string> = {
    all: 'Todos',
    stopwatch: 'Cronómetro',
    pomodoro: 'Pomodoro',
    general: 'General',
  };

  const categoryIcons: Record<string, string> = {
    stopwatch: '⏱️',
    pomodoro: '🍅',
    general: '🌟',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">🏆 Logros</h2>
              <p className="text-purple-100 mt-1">
                {unlockedCount} de {totalCount} desbloqueados
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-6">
          {achievements.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay logros disponibles</p>
          ) : (
            <div className="space-y-6">
              {/* Group by category */}
              {(['stopwatch', 'pomodoro', 'general'] as CategoryFilter[]).map(category => {
                const categoryAchievements = achievements.filter(a => a.category === category);
                if (categoryAchievements.length === 0) return null;

                return (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span>{categoryIcons[category]}</span>
                      {categoryLabels[category]}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoryAchievements.map(achievement => (
                        <div
                          key={achievement.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            achievement.unlocked
                              ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
                              : 'bg-gray-50 border-gray-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`text-2xl ${!achievement.unlocked && 'grayscale'}`}>
                              {achievement.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-semibold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                                {achievement.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-0.5">
                                {achievement.description}
                              </p>

                              {/* Progress bar for trackable achievements */}
                              {achievement.progress !== undefined && achievement.target !== undefined && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                    <span>Progreso</span>
                                    <span>{achievement.progress} / {achievement.target}</span>
                                  </div>
                                  <div className="bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-purple-600 h-1.5 rounded-full transition-all"
                                      style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Unlocked badge */}
                              {achievement.unlocked && achievement.unlockedAt && (
                                <span className="inline-block mt-2 text-xs text-purple-600 font-medium">
                                  ✓ Desbloqueado el {new Date(achievement.unlockedAt).toLocaleDateString('es-ES')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;

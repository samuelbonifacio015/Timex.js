import { useMemo } from 'react'

interface ActiveTimerWidgetProps {
  activeTab: 'reloj' | 'pomodoro' | 'cronometro'
  stopwatchTime: number
  stopwatchIsRunning: boolean
  pomodoroTime: number
  pomodoroIsRunning: boolean
  pomodoroPhase: string
  onTabClick: (tab: 'reloj' | 'pomodoro' | 'cronometro') => void
}

const ActiveTimerWidget = ({
  activeTab,
  stopwatchTime,
  stopwatchIsRunning,
  pomodoroTime,
  pomodoroIsRunning,
  pomodoroPhase,
  onTabClick
}: ActiveTimerWidgetProps) => {
  const showWidget = useMemo(() => {
    if (activeTab === 'cronometro' && pomodoroIsRunning) return true
    if (activeTab === 'pomodoro' && stopwatchIsRunning) return true
    if (activeTab === 'reloj' && (stopwatchIsRunning || pomodoroIsRunning)) return true
    return false
  }, [activeTab, stopwatchIsRunning, pomodoroIsRunning])

  const formattedStopwatchTime = useMemo(() => {
    const totalSeconds = Math.floor(stopwatchTime / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [stopwatchTime])

  const formattedPomodoroTime = useMemo(() => {
    const minutes = Math.floor(pomodoroTime / 60)
    const remainingSeconds = pomodoroTime % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [pomodoroTime])

  if (!showWidget) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-200">
      <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
        {/* Stopwatch */}
        {activeTab !== 'cronometro' && stopwatchIsRunning && (
          <button
            onClick={() => onTabClick('cronometro')}
            className="w-full text-left hover:bg-gray-50 transition-colors duration-150 px-3 py-2 border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="min-w-0">
                  <div className="text-[10px] font-inter font-semibold text-gray-500 uppercase tracking-wide">
                    Cronómetro
                  </div>
                  <div className="text-base font-roboto-mono font-bold text-green-600 tabular-nums">
                    {formattedStopwatchTime}
                  </div>
                </div>
              </div>
            </div>
          </button>
        )}
        
        {/* Pomodoro */}
        {activeTab !== 'pomodoro' && pomodoroIsRunning && (
          <button
            onClick={() => onTabClick('pomodoro')}
            className="w-full text-left hover:bg-gray-50 transition-colors duration-150 px-3 py-2 border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="min-w-0">
                  <div className="text-[10px] font-inter font-semibold text-gray-500 uppercase tracking-wide truncate">
                    {pomodoroPhase}
                  </div>
                  <div className="text-base font-roboto-mono font-bold text-red-600 tabular-nums">
                    {formattedPomodoroTime}
                  </div>
                </div>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

export default ActiveTimerWidget

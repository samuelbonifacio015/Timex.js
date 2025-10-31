import { useEffect, useState } from 'react'

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
  const [showWidget, setShowWidget] = useState(false)

  useEffect(() => {
    if (activeTab === 'cronometro' && pomodoroIsRunning) {
      setShowWidget(true)
    } else if (activeTab === 'pomodoro' && stopwatchIsRunning) {
      setShowWidget(true)
    } else if (activeTab === 'reloj' && (stopwatchIsRunning || pomodoroIsRunning)) {
      setShowWidget(true)
    } else {
      setShowWidget(false)
    }
  }, [activeTab, stopwatchIsRunning, pomodoroIsRunning])

  const formatStopwatchTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const formatPomodoroTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!showWidget) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-white shadow-2xl rounded-2xl border-2 border-gray-200 p-4 min-w-[200px]">
        {activeTab !== 'cronometro' && stopwatchIsRunning && (
          <button
            onClick={() => onTabClick('cronometro')}
            className="w-full text-left hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200 mb-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-inter font-semibold text-gray-500 mb-1">
                  CRONÓMETRO ACTIVO
                </div>
                <div className="text-xl font-roboto-mono font-bold text-green-600">
                  {formatStopwatchTime(stopwatchTime)}
                </div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </button>
        )}
        
        {activeTab !== 'pomodoro' && pomodoroIsRunning && (
          <button
            onClick={() => onTabClick('pomodoro')}
            className="w-full text-left hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-inter font-semibold text-gray-500 mb-1">
                  POMODORO - {pomodoroPhase.toUpperCase()}
                </div>
                <div className="text-xl font-roboto-mono font-bold text-red-600">
                  {formatPomodoroTime(pomodoroTime)}
                </div>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

export default ActiveTimerWidget

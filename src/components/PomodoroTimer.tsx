import { useState, useEffect, useRef } from 'react'
import { useConfig } from '../contexts/ConfigContext'

type PomodoroPhase = 'trabajo' | 'descanso-corto' | 'descanso-largo'

interface PomodoroTimerProps {
  onToggleUI: () => void
  hideControls: boolean
  onTimeUpdate?: (time: number) => void
  onRunningUpdate?: (isRunning: boolean) => void
  onPhaseUpdate?: (phase: string) => void
}

const PomodoroTimer = ({ onToggleUI, hideControls, onTimeUpdate, onRunningUpdate, onPhaseUpdate }: PomodoroTimerProps) => {
  const { pomodoroConfig } = useConfig();
  const [timeLeft, setTimeLeft] = useState(pomodoroConfig.workTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<PomodoroPhase>('trabajo')
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const intervalRef = useRef<number | null>(null)

  const phaseDurations = {
    'trabajo': pomodoroConfig.workTime * 60,
    'descanso-corto': pomodoroConfig.shortBreak * 60,
    'descanso-largo': pomodoroConfig.longBreak * 60
  }

  const phaseLabels = {
    'trabajo': 'Tiempo de Trabajo',
    'descanso-corto': 'Descanso Corto',
    'descanso-largo': 'Descanso Largo'
  }

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000) 
    } else if (timeLeft === 0) {
      handlePhaseComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(timeLeft)
    }
  }, [timeLeft, onTimeUpdate])

  useEffect(() => {
    if (onRunningUpdate) {
      onRunningUpdate(isRunning)
    }
  }, [isRunning, onRunningUpdate])

  useEffect(() => {
    if (onPhaseUpdate) {
      onPhaseUpdate(phaseLabels[phase])
    }
  }, [phase, onPhaseUpdate])

  const handlePhaseComplete = () => {
    if (pomodoroConfig.pomodoroSound) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCuBzvLZiTYIG2m98OScTgwOUrDj7Rade');
      audio.play().catch(() => {});
    }

    setIsRunning(false)
    
    if (phase === 'trabajo') {
      const newCompletedPomodoros = completedPomodoros + 1
      setCompletedPomodoros(newCompletedPomodoros)
      
      if (newCompletedPomodoros % 4 === 0) {
        setPhase('descanso-largo')
        setTimeLeft(phaseDurations['descanso-largo'])
      } else {
        setPhase('descanso-corto')
        setTimeLeft(phaseDurations['descanso-corto'])
      }
      
      if (pomodoroConfig.autoStartBreaks) {
        setTimeout(() => setIsRunning(true), 500);
      }
    } else {
      setPhase('trabajo')
      setTimeLeft(phaseDurations['trabajo'])
    }
  }

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(phaseDurations[phase])
  }

  const resetAll = () => {
    setIsRunning(false)
    setPhase('trabajo')
    setTimeLeft(phaseDurations['trabajo'])
    setCompletedPomodoros(0)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      {/* Indicador de Fase */}
      {!hideControls && (
        <div className="mb-6 sm:mb-8 md:mb-10 transition-opacity duration-500 ease-in-out">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-inter font-semibold text-[#222] mb-2 sm:mb-3 md:mb-4">
            {phaseLabels[phase]}
          </h2>
          <div className="text-sm xs:text-base sm:text-lg md:text-xl font-inter text-gray-600">
            Pomodoros completados: {completedPomodoros}
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <div 
          className={`font-inter font-black text-[#222] tracking-tighter cursor-pointer transition-all duration-700 ease-in-out ${
            hideControls ? 'text-[22vw]' : 'text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem]'
          }`}
          onClick={onToggleUI}
        >
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Controles */}
      {!hideControls && (
        <>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 transition-opacity duration-500 ease-in-out">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="bg-green-600 hover:bg-green-700 text-white font-inter font-semibold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl transition-colors duration-200 min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
              >
                Iniciar
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-inter font-semibold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl transition-colors duration-200 min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
              >
                Pausar
              </button>
            )}
            
            <button
              onClick={resetTimer}
              className="bg-gray-600 hover:bg-gray-700 text-white font-inter font-semibold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl transition-colors duration-200 min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
            >
              Reiniciar
            </button>
            
            <button
              onClick={resetAll}
              className="bg-red-600 hover:bg-red-700 text-white font-inter font-semibold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl transition-colors duration-200 min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
            >
              Reset Total
            </button>
          </div>

          {/* Indicador de progreso */}
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl transition-opacity duration-500 ease-in-out">
            <div className="bg-gray-200 rounded-full h-2 sm:h-3 md:h-4 mb-4 sm:mb-5 md:mb-6">
              <div 
                className={`h-2 sm:h-3 md:h-4 rounded-full transition-all duration-1000 ${
                  phase === 'trabajo' ? 'bg-blue-600' : 'bg-green-600'
                }`}
                style={{
                  width: `${((phaseDurations[phase] - timeLeft) / phaseDurations[phase]) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PomodoroTimer
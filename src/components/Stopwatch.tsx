import { useState, useEffect, useRef } from 'react'
import { useConfig } from '../contexts/ConfigContext'

interface LapTime {
  id: number
  time: number
  lapTime: number
  name?: string
}

interface StopwatchProps {
  onToggleUI: () => void
  hideControls: boolean
  onTimeUpdate?: (time: number) => void
  onRunningUpdate?: (isRunning: boolean) => void
}

const Stopwatch = ({ onToggleUI, hideControls, onTimeUpdate, onRunningUpdate }: StopwatchProps) => {
  const { stopwatchConfig, addStopwatchSession } = useConfig();
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<LapTime[]>([])
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - pausedTimeRef.current
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current)
      }, 10)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(time)
    }
  }, [time, onTimeUpdate])

  useEffect(() => {
    if (onRunningUpdate) {
      onRunningUpdate(isRunning)
    }
  }, [isRunning, onRunningUpdate])

  const startStopwatch = () => {
    if (stopwatchConfig.soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCuBzvLZiTYIG2m98OScTgwOUrDj7Lade');
      audio.play().catch(() => {});
    }
    if (!sessionStartTime) {
      setSessionStartTime(new Date())
    }
    setIsRunning(true)
  }

  const stopStopwatch = () => {
    if (stopwatchConfig.soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCuBzvLZiTYIG2m98OScTgwOUrDj7Lade');
      audio.play().catch(() => {});
    }
    setIsRunning(false)
    pausedTimeRef.current = time
    
    // Guardar la sesión en el historial si hubo tiempo registrado
    if (time > 0 && sessionStartTime) {
      const endTime = new Date()
      const session = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        startTime: sessionStartTime.toLocaleTimeString('es-ES'),
        endTime: endTime.toLocaleTimeString('es-ES'),
        duration: time,
        lapsCount: laps.length,
        date: sessionStartTime.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
      addStopwatchSession(session)
    }
  }

  const resetStopwatch = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
    setSessionStartTime(null)
    pausedTimeRef.current = 0
    startTimeRef.current = 0
  }

  const addLap = () => {
    if (time > 0) {
      const lapTime = laps.length > 0 ? time - laps[laps.length - 1].time : time
      const newLap: LapTime = {
        id: laps.length + 1,
        time: time,
        lapTime: lapTime,
        name: `Vuelta ${laps.length + 1}`
      }
      setLaps(prev => [...prev, newLap])
      
      if (stopwatchConfig.autoSave) {
        exportLapJSON(newLap)
      }
    }
  }

  const exportLapJSON = (lap: LapTime) => {
    const now = new Date()
    const lapData = {
      vuelta: lap.id,
      nombre: lap.name,
      fecha: now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      hora: now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      duracionVuelta: formatTime(lap.lapTime),
      tiempoTotal: formatTime(lap.time)
    }
    
    const blob = new Blob([JSON.stringify(lapData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vuelta_${lap.id}_${now.getTime()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const ms = Math.floor((milliseconds % 1000) / 10)
    
    if (hours > 0) {
      if (stopwatchConfig.showMicroseconds) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`
      } else {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }
    } else {
      if (stopwatchConfig.showMicroseconds) {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`
      } else {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      {/*Reloj*/}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <div 
          className={`font-inter font-black text-[#222] tracking-tighter cursor-pointer transition-all duration-700 ease-in-out ${
            hideControls 
              ? 'text-[22vw]' 
              : Math.floor(time / 1000) >= 3600
                ? 'text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[9rem]'
                : 'text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem]'
          }`}
          onClick={onToggleUI}
        >
          {formatTime(time)}
        </div>
      </div>

      {!hideControls && (
        <>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12 transition-opacity duration-500 ease-in-out">
            {!isRunning ? (
              <button
                onClick={startStopwatch}
                className="bg-green-600 hover:bg-green-700 text-white font-inter font-semibold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl transition-colors duration-200 min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
              >
                Iniciar
              </button>
            ) : (
              <button
                onClick={stopStopwatch}
                className="bg-red-600 hover:bg-red-700 text-white font-inter font-semibold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl transition-colors duration-200 min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
              >
                Detener
              </button>
            )}
            
            <button
              onClick={resetStopwatch}
              className="bg-gray-600 hover:bg-gray-700 text-white font-inter font-semibold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl transition-colors duration-200 min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
            >
              Reiniciar
            </button>
            
            <button
              onClick={addLap}
              disabled={time === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-inter font-semibold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl transition-colors duration-200 min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
            >
              Vuelta
            </button>
          </div>

          {/*Vueltas*/}
          {laps.length > 0 && (
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl transition-opacity duration-500 ease-in-out">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-inter font-semibold text-gray-800 text-center flex-1">
                  Tiempos de Vuelta
                </h3>
                <button
                  onClick={() => {
                    laps.forEach(lap => exportLapJSON(lap))
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-inter font-semibold py-2 px-4 rounded-lg text-xs sm:text-sm md:text-base transition-colors duration-200"
                >
                  Exportar Todo
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto">
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  {laps.slice().reverse().map((lap) => (
                    <div 
                      key={lap.id} 
                      className="flex justify-between items-center py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-5 bg-white rounded border border-gray-200"
                    >
                      <span className="font-inter font-semibold text-gray-700 text-sm xs:text-base sm:text-lg md:text-xl">
                        Vuelta {lap.id}
                      </span>
                      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                        <div className="flex space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8 text-right">
                          <span className="font-roboto-mono text-gray-600 min-w-[80px] xs:min-w-[90px] sm:min-w-[100px] md:min-w-[110px] lg:min-w-[125px] text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">
                            +{formatTime(lap.lapTime)}
                          </span>
                          <span className="font-roboto-mono text-gray-800 min-w-[80px] xs:min-w-[90px] sm:min-w-[100px] md:min-w-[110px] lg:min-w-[125px] text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">
                            {formatTime(lap.time)}
                          </span>
                        </div>
                        <button
                          onClick={() => exportLapJSON(lap)}
                          className="bg-green-600 hover:bg-green-700 text-white font-inter font-semibold py-1 px-2 sm:py-1.5 sm:px-3 rounded text-xs transition-colors duration-200"
                          title="Exportar esta vuelta"
                        >
                          JSON
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Stopwatch
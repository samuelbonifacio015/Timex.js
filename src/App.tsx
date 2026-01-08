import { useState, useEffect, useRef } from 'react'
import TimeDisplay from './components/TimeDisplay'
import PomodoroTimer from './components/PomodoroTimer'
import Stopwatch from './components/Stopwatch'
import Tabs from './components/Tabs'
import Config from './components/Config'
import ActiveTimerWidget from './components/ActiveTimerWidget'

type TabType = 'reloj' | 'pomodoro' | 'cronometro'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('reloj')
  const [hideUI, setHideUI] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchIsRunning, setStopwatchIsRunning] = useState(false)
  const [pomodoroTime, setPomodoroTime] = useState(0)
  const [pomodoroIsRunning, setPomodoroIsRunning] = useState(false)
  const [pomodoroPhase, setPomodoroPhase] = useState('trabajo')

  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  const [timeDisplayHidden, setTimeDisplayHidden] = useState(false)
  const toggleTimeDisplay = () => setTimeDisplayHidden(prev => !prev)

  const prevPomodoroRunningRef = useRef(false)
  const prevStopwatchRunningRef = useRef(false)
  const originalTitleRef = useRef<string>(document.title)

  const toggleUI = () => {
    setHideUI(!hideUI)
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  // Auto-switch: cuando un timer pasa a "running" (transición),
  //  seleccionar su pestaña
  useEffect(() => {
    if (pomodoroIsRunning && !prevPomodoroRunningRef.current) {
      setActiveTab('pomodoro')
    } else if (stopwatchIsRunning && !prevStopwatchRunningRef.current) {
      if (!pomodoroIsRunning) {
        setActiveTab('cronometro')
      }
    }

    prevPomodoroRunningRef.current = pomodoroIsRunning
    prevStopwatchRunningRef.current = stopwatchIsRunning
  }, [pomodoroIsRunning, stopwatchIsRunning])

  const formatPomodoroTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const formatStopwatchTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const formatClockTime = (date: Date) => {
    const h = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Actualiza el titulo de la página según la pestaña activa
  useEffect(() => {
    const original = originalTitleRef.current || document.title

    if (activeTab === 'reloj') {
      document.title = `${formatClockTime(currentTime)} — Reloj`
    } else if (activeTab === 'pomodoro') {
      document.title = `${formatPomodoroTime(pomodoroTime)} — Pomodoro`
    } else if (activeTab === 'cronometro') {
      document.title = `${formatStopwatchTime(stopwatchTime)} — Cronómetro`
    } else {
      document.title = original
    }

    return () => {
      document.title = original
    }
  }, [activeTab, currentTime, pomodoroTime, stopwatchTime])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black">
      <div className="w-full max-w-7xl mx-auto">
        {!hideUI && (
          <div className="relative">
            <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
            <button
              aria-label="Configuración"
              onClick={() => setShowConfig(!showConfig)}
              className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-100"
            >
              <img src="\public\config.svg" 
                alt="config"
                width={26}
                height={26}
             />
            </button>
          </div>
        )}
        <div className="mt-6 sm:mt-8 md:mt-10">
          {showConfig && <Config activeTab={activeTab} />}

          {!showConfig && (
            <>
                <div style={{ display: activeTab === 'reloj' ? 'block' : 'none' }}>
                  <TimeDisplay onToggleUI={toggleUI} hideDate={hideUI} onTimeUpdate={setCurrentTime} />
                </div>

              <div style={{ display: activeTab === 'pomodoro' ? 'block' : 'none' }}>
                <PomodoroTimer 
                  onToggleUI={toggleUI} 
                  hideControls={hideUI}
                  onTimeUpdate={setPomodoroTime}
                  onRunningUpdate={setPomodoroIsRunning}
                  onPhaseUpdate={setPomodoroPhase}
                />
              </div>

              <div style={{ display: activeTab === 'cronometro' ? 'block' : 'none' }}>
                <Stopwatch 
                  onToggleUI={toggleUI} 
                  hideControls={hideUI}
                  onTimeUpdate={setStopwatchTime}
                  onRunningUpdate={setStopwatchIsRunning}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Widget */}
      <ActiveTimerWidget
        activeTab={activeTab}
        stopwatchTime={stopwatchTime}
        stopwatchIsRunning={stopwatchIsRunning}
        pomodoroTime={pomodoroTime}
        pomodoroIsRunning={pomodoroIsRunning}
        pomodoroPhase={pomodoroPhase}
        onTabClick={handleTabChange}
      />
    </div>
  )
}

export default App
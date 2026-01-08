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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.074-.04.147-.083.22-.127.332-.183.582-.495.645-.87l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
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
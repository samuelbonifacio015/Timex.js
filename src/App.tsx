import { useState } from 'react'
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

  const toggleUI = () => {
    setHideUI(!hideUI)
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

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
              {/* SVG from https://www.svgrepo.com/svg/390488/configuration-gear-options-preferences-settings-system */}
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
                <TimeDisplay onToggleUI={toggleUI} hideDate={hideUI} />
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

      {/* Widget flotante */}
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
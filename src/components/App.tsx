import { useState } from 'react'
import TimeDisplay from './TimeDisplay'
import PomodoroTimer from './PomodoroTimer'
import Stopwatch from './Stopwatch'
import Tabs from './Tabs'
import ActiveTimerWidget from './ActiveTimerWidget'

type TabType = 'reloj' | 'pomodoro' | 'cronometro'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('reloj')
  const [hideUI, setHideUI] = useState(false)
  
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchIsRunning, setStopwatchIsRunning] = useState(false)
  
  const [pomodoroTime, setPomodoroTime] = useState(0)
  const [pomodoroIsRunning, setPomodoroIsRunning] = useState(false)
  const [pomodoroPhase, setPomodoroPhase] = useState('trabajo')

  const toggleUI = () => {
    setHideUI(!hideUI)
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'reloj':
        return <TimeDisplay onToggleUI={toggleUI} hideDate={hideUI} />
      case 'pomodoro':
        return (
          <PomodoroTimer 
            onToggleUI={toggleUI} 
            hideControls={hideUI}
            onTimeUpdate={setPomodoroTime}
            onRunningUpdate={setPomodoroIsRunning}
            onPhaseUpdate={setPomodoroPhase}
          />
        )
      case 'cronometro':
        return (
          <Stopwatch 
            onToggleUI={toggleUI} 
            hideControls={hideUI}
            onTimeUpdate={setStopwatchTime}
            onRunningUpdate={setStopwatchIsRunning}
          />
        )
      default:
        return <TimeDisplay onToggleUI={toggleUI} hideDate={hideUI} />
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black">
      <div className="w-full max-w-7xl mx-auto">
        {!hideUI && <Tabs activeTab={activeTab} onTabChange={setActiveTab} />}
        <div className={hideUI ? "mt-0" : "mt-6 sm:mt-8 md:mt-10"}>
          {renderActiveComponent()}
        </div>
      </div>
      
      <ActiveTimerWidget
        activeTab={activeTab}
        stopwatchTime={stopwatchTime}
        stopwatchIsRunning={stopwatchIsRunning}
        pomodoroTime={pomodoroTime}
        pomodoroIsRunning={pomodoroIsRunning}
        pomodoroPhase={pomodoroPhase}
        onTabClick={setActiveTab}
      />
    </div>
  )
}

export default App 
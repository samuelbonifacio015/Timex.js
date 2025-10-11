import { useState } from 'react'
import TimeDisplay from './components/TimeDisplay'
import PomodoroTimer from './components/PomodoroTimer'
import Stopwatch from './components/Stopwatch'
import Tabs from './components/Tabs'

type TabType = 'reloj' | 'pomodoro' | 'cronometro'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('reloj')
  const [hideUI, setHideUI] = useState(false)

  const toggleUI = () => {
    setHideUI(!hideUI)
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'reloj':
        return <TimeDisplay onToggleUI={toggleUI} hideDate={hideUI} />
      case 'pomodoro':
        return <PomodoroTimer onToggleUI={toggleUI} hideControls={hideUI} />
      case 'cronometro':
        return <Stopwatch onToggleUI={toggleUI} hideControls={hideUI} />
      default:
        return <TimeDisplay onToggleUI={toggleUI} hideDate={hideUI} />
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black">
      <div className="w-full max-w-7xl mx-auto">
        {!hideUI && <Tabs activeTab={activeTab} onTabChange={setActiveTab} />}
        <div className="mt-6 sm:mt-8 md:mt-10">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  )
}

export default App
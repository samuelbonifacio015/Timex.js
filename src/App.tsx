import { useState } from 'react'
import TimeDisplay from './components/TimeDisplay'
import PomodoroTimer from './components/PomodoroTimer'
import Stopwatch from './components/Stopwatch'
import Tabs from './components/Tabs'
import Config from './components/Config'

type TabType = 'reloj' | 'pomodoro' | 'cronometro'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('reloj')
  const [hideUI, setHideUI] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  const toggleUI = () => {
    setHideUI(!hideUI)
  }

  const renderActiveComponent = () => {
    if (showConfig) {
      return <Config />
    }
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
        {!hideUI && (
          <div className="relative">
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
            <button
              aria-label="Configuración"
              onClick={() => setShowConfig(!showConfig)}
              className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-100"
            >
              {/* SVG from svgrepo.com/svg/165202/settings-tool */}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M22 13.341v-2.683l-2.019-.337a7.963 7.963 0 0 0-.492-1.186l1.151-1.729-1.896-1.896-1.729 1.151a7.963 7.963 0 0 0-1.186-.492L13.341 2h-2.683l-.337 2.019a7.963 7.963 0 0 0-1.186.492l-1.729-1.151-1.896 1.896 1.151 1.729a7.963 7.963 0 0 0-.492 1.186L2 10.659v2.683l2.019.337c.13.414.293.814.492 1.186l-1.151 1.729 1.896 1.896 1.729-1.151c.372.199.772.362 1.186.492L10.659 22h2.683l.337-2.019c.414-.13.814-.293 1.186-.492l1.729 1.151 1.896-1.896-1.151-1.729c.199-.372.362-.772.492-1.186L22 13.341zm-10 2.159a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" fill="#374151"/>
              </svg>
            </button>
          </div>
        )}
        <div className="mt-6 sm:mt-8 md:mt-10">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  )
}

export default App
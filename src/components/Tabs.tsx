interface TabsProps {
  activeTab: 'reloj' | 'pomodoro' | 'cronometro'
  onTabChange: (tab: 'reloj' | 'pomodoro' | 'cronometro') => void
}

const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const tabs = [
    { id: 'reloj' as const, label: 'Reloj' },
    { id: 'pomodoro' as const, label: 'Pomodoro' },
    { id: 'cronometro' as const, label: 'Cronómetro' }
  ]

  return (
    <div className="flex justify-center px-4">
      <nav className="flex space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 lg:px-8 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-inter font-semibold transition-colors duration-200
              ${activeTab === tab.id 
                ? 'text-black border-b-2 sm:border-b-3 border-black' 
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Tabs 
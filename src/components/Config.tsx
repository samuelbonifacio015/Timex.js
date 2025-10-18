import { useState } from "react";
import Tabs from "./Tabs";

type TabType = 'reloj' | 'pomodoro' | 'cronometro'

interface ConfigProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

/**
 * Config Component
 * Permite configurar opciones específicas para cada componente.
 */
const Config = ({ activeTab, onTabChange }: ConfigProps) => {
  // Configuraciones del cronómetro
  const [showMicroseconds, setShowMicroseconds] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Configuraciones del pomodoro
  const [workTime, setWorkTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [pomodoroSound, setPomodoroSound] = useState(true);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);

  const ToggleSwitch = ({ 
    id, 
    checked, 
    onChange, 
    label, 
    description 
  }: { 
    id: string; 
    checked: boolean; 
    onChange: (value: boolean) => void; 
    label: string; 
    description: string; 
  }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <label htmlFor={id} className="text-lg font-medium text-gray-700">{label}</label>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          aria-describedby={`${id}-description`}
        />
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
            checked ? 'bg-blue-600' : 'bg-gray-300'
          }`}
          role="switch"
          aria-checked={checked}
          aria-labelledby={id}
          aria-label={label}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-0.5'
            } mt-0.5`}
          />
        </button>
      </div>
    </div>
  );

  const renderStopwatchConfig = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración de Cronómetro</h2>
      
      <ToggleSwitch
        id="microseconds-toggle"
        checked={showMicroseconds}
        onChange={setShowMicroseconds}
        label="Mostrar Microsegundos"
        description="Mostrar centésimas de segundo en el display"
      />

      <ToggleSwitch
        id="auto-save-toggle"
        checked={autoSave}
        onChange={setAutoSave}
        label="Guardado Automático"
        description="Guardar automáticamente las vueltas"
      />

      <ToggleSwitch
        id="sound-toggle"
        checked={soundEnabled}
        onChange={setSoundEnabled}
        label="Sonidos"
        description="Reproducir sonidos al iniciar/detener"
      />
    </div>
  );

  const renderPomodoroConfig = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración de Pomodoro</h2>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <label htmlFor="work-time" className="block text-lg font-medium text-gray-700 mb-3">
          Tiempo de Trabajo (minutos)
        </label>
        <input
          id="work-time"
          type="number"
          min="1"
          max="60"
          value={workTime}
          onChange={(e) => setWorkTime(parseInt(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg text-lg"
          aria-label="Tiempo de trabajo en minutos"
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <label htmlFor="short-break" className="block text-lg font-medium text-gray-700 mb-3">
          Descanso Corto (minutos)
        </label>
        <input
          id="short-break"
          type="number"
          min="1"
          max="30"
          value={shortBreak}
          onChange={(e) => setShortBreak(parseInt(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg text-lg"
          aria-label="Descanso corto en minutos"
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <label htmlFor="long-break" className="block text-lg font-medium text-gray-700 mb-3">
          Descanso Largo (minutos)
        </label>
        <input
          id="long-break"
          type="number"
          min="1"
          max="60"
          value={longBreak}
          onChange={(e) => setLongBreak(parseInt(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg text-lg"
          aria-label="Descanso largo en minutos"
        />
      </div>

      <ToggleSwitch
        id="pomodoro-sound-toggle"
        checked={pomodoroSound}
        onChange={setPomodoroSound}
        label="Sonidos de Notificación"
        description="Reproducir sonido al completar sesiones"
      />

      <ToggleSwitch
        id="auto-start-breaks-toggle"
        checked={autoStartBreaks}
        onChange={setAutoStartBreaks}
        label="Inicio Automático de Descansos"
        description="Iniciar automáticamente los descansos"
      />
    </div>
  );

  const renderRelojConfig = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración de Reloj</h2>
      
      <div className="p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-lg text-gray-600">
          El reloj no tiene configuraciones disponibles.
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <Tabs activeTab={activeTab} onTabChange={onTabChange} />
      
      <div className="mt-8">
        {activeTab === 'reloj' && renderRelojConfig()}
        {activeTab === 'pomodoro' && renderPomodoroConfig()}
        {activeTab === 'cronometro' && renderStopwatchConfig()}
      </div>
    </div>
  );
}

export default Config;
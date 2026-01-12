import { useState, useEffect } from "react";
import { useConfig } from '../contexts/ConfigContext';
import StopwatchHistoryModal from './StopwatchHistoryModal';

type TabType = 'reloj' | 'pomodoro' | 'cronometro'

interface ConfigProps {
  activeTab: TabType
}

const Config = ({ activeTab }: ConfigProps) => {
  const { 
    stopwatchConfig, 
    pomodoroConfig, 
    relojConfig,
    stopwatchHistory,
    updateStopwatchConfig, 
    updatePomodoroConfig,
    updateRelojConfig
  } = useConfig();
  
  const [showMicroseconds, setShowMicroseconds] = useState(stopwatchConfig.showMicroseconds);
  const [autoSave, setAutoSave] = useState(stopwatchConfig.autoSave);
  const [soundEnabled, setSoundEnabled] = useState(stopwatchConfig.soundEnabled);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  const [workTime, setWorkTime] = useState(pomodoroConfig.workTime);
  const [shortBreak, setShortBreak] = useState(pomodoroConfig.shortBreak);
  const [longBreak, setLongBreak] = useState(pomodoroConfig.longBreak);
  const [pomodoroSound, setPomodoroSound] = useState(pomodoroConfig.pomodoroSound);
  const [autoStartBreaks, setAutoStartBreaks] = useState(pomodoroConfig.autoStartBreaks);
  
  const [enableScreenshotExport, setEnableScreenshotExport] = useState(relojConfig.enableScreenshotExport);
  const [customMessage, setCustomMessage] = useState(relojConfig.customMessage);
  
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setShowMicroseconds(stopwatchConfig.showMicroseconds);
    setAutoSave(stopwatchConfig.autoSave);
    setSoundEnabled(stopwatchConfig.soundEnabled);
  }, [stopwatchConfig]);

  useEffect(() => {
    setWorkTime(pomodoroConfig.workTime);
    setShortBreak(pomodoroConfig.shortBreak);
    setLongBreak(pomodoroConfig.longBreak);
    setPomodoroSound(pomodoroConfig.pomodoroSound);
    setAutoStartBreaks(pomodoroConfig.autoStartBreaks);
  }, [pomodoroConfig]);

  useEffect(() => {
    setEnableScreenshotExport(relojConfig.enableScreenshotExport);
    setCustomMessage(relojConfig.customMessage);
  }, [relojConfig]);

  useEffect(() => {
    const stopwatchChanged = 
      showMicroseconds !== stopwatchConfig.showMicroseconds ||
      autoSave !== stopwatchConfig.autoSave ||
      soundEnabled !== stopwatchConfig.soundEnabled;

    const pomodoroChanged =
      workTime !== pomodoroConfig.workTime ||
      shortBreak !== pomodoroConfig.shortBreak ||
      longBreak !== pomodoroConfig.longBreak ||
      pomodoroSound !== pomodoroConfig.pomodoroSound ||
      autoStartBreaks !== pomodoroConfig.autoStartBreaks;

    const relojChanged =
      enableScreenshotExport !== relojConfig.enableScreenshotExport ||
      customMessage !== relojConfig.customMessage;

    setHasChanges(stopwatchChanged || pomodoroChanged || relojChanged);
  }, [showMicroseconds, autoSave, soundEnabled, workTime, shortBreak, longBreak, pomodoroSound, autoStartBreaks, enableScreenshotExport, customMessage, stopwatchConfig, pomodoroConfig, relojConfig]);

  const handleSaveChanges = () => {
    updateStopwatchConfig({
      showMicroseconds,
      autoSave,
      soundEnabled,
    });

    updatePomodoroConfig({
      workTime,
      shortBreak,
      longBreak,
      pomodoroSound,
      autoStartBreaks,
    });

    updateRelojConfig({
      enableScreenshotExport,
      customMessage,
    });

    setHasChanges(false);
  };

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
        <div
          onClick={() => onChange(!checked)}
          className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${
            checked ? 'bg-blue-600' : 'bg-gray-300'
          }`}
          role="switch"
          aria-checked={checked ? "true" : "false"}
          aria-labelledby={id}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onChange(!checked);
            }
          }}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-0.5'
            } mt-0.5`}
          />
        </div>
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

      {/* Botón para abrir el historial */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Historial de Sesiones</h3>
              <p className="text-sm text-gray-600 mb-1">
                {stopwatchHistory.length === 0 
                  ? 'No hay sesiones guardadas aún' 
                  : `${stopwatchHistory.length} ${stopwatchHistory.length === 1 ? 'sesión guardada' : 'sesiones guardadas'}`
                }
              </p>
              <p className="text-xs text-gray-500">
                Ver, exportar y administrar tus cronometrajes
              </p>
            </div>
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-inter font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ver Historial
            </button>
          </div>
        </div>
      </div>
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
      
      <ToggleSwitch
        id="screenshot-export-toggle"
        checked={enableScreenshotExport}
        onChange={setEnableScreenshotExport}
        label="Exportar Captura de Pantalla"
        description="Permite capturar la pantalla con un mensaje personalizado"
      />

      {enableScreenshotExport && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <label htmlFor="custom-message" className="block text-lg font-medium text-gray-700 mb-3">
            Mensaje Personalizado
          </label>
          <input
            id="custom-message"
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-lg"
            placeholder="Hola son las"
            aria-label="Mensaje personalizado para la captura de pantalla"
          />
          <p className="text-sm text-gray-500 mt-2">
            El mensaje se mostrará seguido de la hora actual.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="mt-8">
          {activeTab === 'reloj' && renderRelojConfig()}
          {activeTab === 'pomodoro' && renderPomodoroConfig()}
          {activeTab === 'cronometro' && renderStopwatchConfig()}
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSaveChanges}
            disabled={!hasChanges}
            className={`font-inter font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-200 ${
              hasChanges
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {hasChanges ? 'Guardar Cambios' : 'Sin Cambios'}
          </button>
        </div>
      </div>

      {/* Modal del historial */}
      <StopwatchHistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
      />
    </>
  );
}

export default Config;
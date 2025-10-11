import { useState, useEffect } from 'react'

interface TimeDisplayProps {
  onToggleUI: () => void
  hideDate: boolean
}

/**
 * TimeDisplay Component
 * Muestra la hora actual, fecha y ubicación.
 */
const TimeDisplay = ({ onToggleUI, hideDate }: TimeDisplayProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000) // Actualizar cada segundo para mostrar HH:MM:SS

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return date.toLocaleDateString('es-ES', options)
  }

  /**
   * Renderizado del componente
   */
  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      {/* Reloj Principal - Tamaño unificado */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <div 
          className={`font-bold text-[#222] tracking-tight leading-none cursor-pointer transition-all duration-700 ease-in-out ${
            hideDate ? 'text-[22vw]' : 'text-[12vw]'
          }`}
          onClick={onToggleUI}
        >
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Información de Fecha y Ubicación - Responsive mejorado */}
      {!hideDate && (
        <div className="text-gray-700 space-y-2 sm:space-y-3 md:space-y-4 transition-opacity duration-500 ease-in-out">
          <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-inter font-light capitalize">
            {formatDate(currentTime)}
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeDisplay
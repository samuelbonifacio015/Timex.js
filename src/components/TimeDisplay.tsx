import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import { useConfig } from '../contexts/ConfigContext'

interface TimeDisplayProps {
  onToggleUI: () => void
  hideDate: boolean
  onTimeUpdate?: (date: Date) => void
}

/**
 * TimeDisplay Component
 * Muestra la hora actual, fecha y ubicación.
 */
const TimeDisplay = ({ onToggleUI, hideDate, onTimeUpdate }: TimeDisplayProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { relojConfig } = useConfig()
  const displayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      if (onTimeUpdate) onTimeUpdate(now)
    }, 1000) // Actualizar cada segundo para mostrar HH:MM:SS

    // enviar el primer valor inmediatamente
    if (onTimeUpdate) onTimeUpdate(currentTime)

    return () => clearInterval(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleExportScreenshot = async () => {
    if (!relojConfig.enableScreenshotExport || !displayRef.current) return

    try {
      const canvas = await html2canvas(document.body, {
        backgroundColor: '#ffffff',
        scale: 2,
      })

      const link = document.createElement('a')
      link.download = `captura-${formatTime(currentTime).replace(/:/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Error al capturar la pantalla:', error)
    }
  }

  const handleClick = () => {
    if (relojConfig.enableScreenshotExport) {
      handleExportScreenshot()
    } else {
      onToggleUI()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      {/* Reloj */}
      <div className="mb-8 sm:mb-10 md:mb-12" ref={displayRef}>
        <div 
          className={`font-inter font-bold text-[#222] tracking-tight leading-none cursor-pointer transition-all duration-700 ease-in-out ${
            hideDate ? 'text-[22vw]' : 'text-[12vw]'
          } ${relojConfig.enableScreenshotExport ? 'hover:opacity-80' : ''}`}
          onClick={handleClick}
          title={relojConfig.enableScreenshotExport ? `Capturar pantalla con mensaje: "${relojConfig.customMessage}"` : ''}
        >
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Info */}
      {!hideDate && (
        <div className="text-gray-700 space-y-2 sm:space-y-3 md:space-y-4 transition-opacity duration-500 ease-in-out">
          <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-inter font-light capitalize">
            {formatDate(currentTime)}
          </div>
        </div>
      )}

      {/* Mensaje personalizado */}
      {relojConfig.enableScreenshotExport && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-100 px-4 py-2 rounded-lg shadow-md">
          <p className="text-sm text-gray-600">
            {relojConfig.customMessage} {formatTime(currentTime)}
          </p>
        </div>
      )}
    </div>
  )
}

export default TimeDisplay
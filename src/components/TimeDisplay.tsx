import { useState, useEffect } from 'react'

const TimeDisplay = () => {
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

  const getLocationText = () => {
    return "Lima, Perú"
  }

  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      {/* Reloj Principal - Tamaño unificado */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <div className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-roboto-mono font-black text-black tracking-tighter">
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Información de Fecha y Ubicación - Responsive mejorado */}
      <div className="text-gray-700 space-y-2 sm:space-y-3 md:space-y-4">
        <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-inter font-medium capitalize">
          {formatDate(currentTime)}
        </div>
        <div className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-inter font-normal text-gray-600">
          {getLocationText()}
        </div>
      </div>
    </div>
  )
}

export default TimeDisplay 
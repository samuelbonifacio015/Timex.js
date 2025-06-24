# Time.js - Clon de Time.is con Funcionalidades Adicionales

Un clon funcional y estilizado de la página time.is con funcionalidades adicionales de productividad como temporizador Pomodoro y cronómetro.

## 🚀 Características

- **Reloj en Tiempo Real**: Réplica visual de time.is con hora actualizada cada segundo
- **Temporizador Pomodoro**: Técnica de productividad con ciclos de 25 minutos de trabajo y descansos
- **Cronómetro**: Cronómetro de alta precisión con funcionalidad de vueltas (lap times)
- **Diseño Responsive**: Interfaz adaptable a diferentes tamaños de pantalla
- **Tipografía Profesional**: Fuentes Roboto Mono e Inter de Google Fonts

## 🛠️ Stack Tecnológico

- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **Google Fonts** (Roboto Mono e Inter)

## 📦 Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🎯 Uso

### Reloj Principal

- Muestra la hora actual actualizada cada segundo
- Formato 24 horas (HH:MM:SS)
- Información de fecha y ubicación

### Temporizador Pomodoro

- Ciclos de trabajo: 25 minutos
- Descansos cortos: 5 minutos
- Descanso largo: 15 minutos (cada 4 pomodoros)
- Controles: Iniciar, Pausar, Reiniciar, Reset Total
- Indicador visual de progreso

### Cronómetro

- Precisión de centésimas de segundo
- Controles: Iniciar, Detener, Reiniciar, Vuelta
- Lista de tiempos de vuelta
- Formato MM:SS.ms

## 🎨 Diseño

El diseño replica la simplicidad y minimalismo de time.is:

- Fondo blanco puro
- Tipografía clara y legible
- Navegación por pestañas intuitiva
- Elementos centrados y jerarquía visual clara

## 📱 Responsive

La aplicación se adapta a diferentes tamaños de pantalla:

- **Desktop**: Texto extra grande para máxima legibilidad
- **Tablet**: Tamaños intermedios manteniendo proporciones
- **Mobile**: Interfaz optimizada para dispositivos móviles

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Vista previa de la construcción
npm run preview

# Linting
npm run lint
```

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

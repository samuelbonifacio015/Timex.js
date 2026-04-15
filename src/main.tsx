import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConfigProvider } from './contexts/ConfigContext'
import { AchievementsProvider } from './contexts/AchievementsContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <AchievementsProvider>
        <App />
      </AchievementsProvider>
    </ConfigProvider>
  </React.StrictMode>,
) 
import React from 'react'
import { createRoot } from 'react-dom/client'
import WeatherApp from './WeatherApp.jsx'
import './styles/App.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <WeatherApp />
  </React.StrictMode>
)

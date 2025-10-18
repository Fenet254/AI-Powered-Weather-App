import React from 'react'
import { createRoot } from 'react-dom/client'
import WeatherApp from './WeatherApp.jsx'
import './styles/App.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <div className="app-container">
      <header className="app-header">
        <h1><i className="fas fa-cloud-sun"></i> AI-Powered Weather App</h1>
        <p>Get accurate weather forecasts with AI predictions</p>
      </header>
      <main>
        <WeatherApp />
      </main>
      <footer className="app-footer">
        <p>Powered by OpenMeteo API & Machine Learning</p>
      </footer>
    </div>
  </React.StrictMode>
)

import React, { useState } from 'react';
import WeatherApp from '../frontend/WeatherApp.jsx';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI-Powered Weather App</h1>
      </header>
      <main>
        <WeatherApp />
      </main>
    </div>
  );
}

export default App;

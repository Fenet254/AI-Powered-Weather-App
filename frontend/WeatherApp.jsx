import React, { useState } from 'react';

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCoordinates = async (city) => {
    // Simple geocoding using a free API (you might want to use a proper geocoding service)
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    throw new Error('Location not found');
  };

  const fetchWeather = async () => {
    if (!location) return;
    setLoading(true);
    setError('');
    try {
      const coords = await getCoordinates(location);
      const response = await fetch('http://localhost:8000/current-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coords),
      });
      if (!response.ok) throw new Error('Failed to fetch weather');
      const data = await response.json();
      setWeather(data);

      // Fetch prediction
      const predResponse = await fetch('http://localhost:8000/predict-temperature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coords),
      });
      if (predResponse.ok) {
        const predData = await predResponse.json();
        setPrediction(predData.predicted_temperature);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-app">
      <h2>Weather Forecast</h2>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={fetchWeather} disabled={loading}>
        {loading ? 'Loading...' : 'Get Weather'}
      </button>
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="weather-info">
          <h3>Current Weather in {location}</h3>
          <p>Temperature: {weather.current.temperature_2m}°C</p>
          <p>Humidity: {weather.current.relative_humidity_2m}%</p>
          <p>Wind Speed: {weather.current.wind_speed_10m} km/h</p>
          {prediction && <p>Predicted Next Hour Temperature: {prediction.toFixed(1)}°C</p>}
        </div>
      )}
    </div>
  );
}

export default WeatherApp;

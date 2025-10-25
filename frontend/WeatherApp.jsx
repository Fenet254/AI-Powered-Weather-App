import React, { useState, useEffect } from 'react';

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const getCoordinates = async (city) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}&limit=1`);
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), name: data[0].display_name.split(',')[0] };
    }
    throw new Error('Location not found');
  };


  const getWeatherIcon = (temp) => {
    if (temp >= 30) return 'fas fa-sun';
    if (temp >= 20) return 'fas fa-cloud-sun';
    if (temp >= 10) return 'fas fa-cloud';
    return 'fas fa-snowflake';
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lon: longitude });
          await fetchWeatherByCoords(latitude, longitude, 'Current Location');
        },
        (error) => {
          setError('Unable to retrieve your location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  const fetchWeatherByCoords = async (lat, lon, locName = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/current-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lon }),
      });
      if (!response.ok) throw new Error('Failed to fetch weather');
      const data = await response.json();
      setWeather(data);
      setLocation(locName || data.location || 'Unknown');

      // Extract hourly forecast (next 6 hours)
      if (data.hourly) {
        const hourly = data.hourly.temperature_2m.slice(0, 6).map((temp, index) => ({
          time: new Date(Date.now() + index * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperature: temp
        }));
        setHourlyForecast(hourly);
      }

      // Fetch prediction
      const predResponse = await fetch('http://localhost:8000/predict-temperature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lon }),
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

  const fetchWeather = async () => {
    if (!location.trim()) return;
    try {
      const coords = await getCoordinates(location.trim());
      await fetchWeatherByCoords(coords.lat, coords.lon, coords.name);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div className="weather-app">
      <div className="search-section">
        <div className="search-input-container">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name..."
            className="search-input"
          />
          <button onClick={fetchWeather} disabled={loading} className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <button onClick={getCurrentLocation} disabled={loading} className="location-btn">
          <i className="fas fa-map-marker-alt"></i> Use My Location
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Fetching weather data...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
        </div>
      )}

      {weather && (
        <div className="weather-display">
          <div className="current-weather">
            <div className="weather-icon">
              <i className={getWeatherIcon(weather.current.temperature_2m)}></i>
            </div>
            <div className="weather-details">
              <h2>{location}</h2>
              <div className="temperature">
                <span className="temp-value">{weather.current.temperature_2m}</span>
                <span className="temp-unit">°C</span>
              </div>
              <div className="weather-stats">
                <div className="stat">
                  <i className="fas fa-tint"></i>
                  <span>{weather.current.relative_humidity_2m}% Humidity</span>
                </div>
                <div className="stat">
                  <i className="fas fa-wind"></i>
                  <span>{weather.current.wind_speed_10m} km/h Wind</span>
                </div>
              </div>
            </div>
          </div>

          {prediction && (
            <div className="prediction-card">
              <h3><i className="fas fa-brain"></i> AI Prediction</h3>
              <p>Next hour temperature: <strong>{prediction.toFixed(1)}°C</strong></p>
            </div>
          )}

          {hourlyForecast.length > 0 && (
            <div className="hourly-forecast">
              <h3><i className="fas fa-clock"></i> Hourly Forecast</h3>
              <div className="forecast-list">
                {hourlyForecast.map((hour, index) => (
                  <div key={index} className="forecast-item">
                    <span className="time">{hour.time}</span>
                    <i className={getWeatherIcon(hour.temperature)}></i>
                    <span className="temp">{hour.temperature}°C</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WeatherApp;

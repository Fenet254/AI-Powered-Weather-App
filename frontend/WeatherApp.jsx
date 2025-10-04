cat > (jsx / WeatherApp.jsx) << "EOF";
import React, { useState } from "react";
import "../css/home.css";

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const getWeather = async (cityName = city) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:3000/api/weather?city=${encodeURIComponent(cityName)}`
      );
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
      } else {
        setError(data.error || "Failed to fetch weather data");
      }
    } catch (err) {
      setError("Failed to connect to weather service");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoords(latitude, longitude);
        },
        (error) => {
          setError("Unable to retrieve your location");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  const getWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/weather?lat=${lat}&lon=${lon}`
      );
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
        setCity(data.name);
      } else {
        setError(data.error || "Failed to fetch weather data");
      }
    } catch (err) {
      setError("Failed to connect to weather service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-app">
      <div className="app-header">
        <div className="location-container">
          <h1>🌤 AI Weather App</h1>
        </div>
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Get Weather"}
          </button>
          <button type="button" id="voice-btn">
            🎤
          </button>
          <button type="button" onClick={getCurrentLocation}>
            📍 My Location
          </button>
        </form>
      </div>

      <div className="main-content">
        {error && (
          <div className="weather-card error">
            <p>Error: {error}</p>
          </div>
        )}

        {weather && !loading && (
          <>
            <div className="weather-card current-weather">
              <div className="weather-primary">
                <div className="temperature-section">
                  <h2 className="temperature">{weather.name}</h2>
                  <p className="condition">{weather.weather[0].description}</p>
                </div>
                <div className="weather-icon">
                  {getWeatherIcon(weather.weather[0].main)}
                </div>
              </div>

              <div className="weather-details">
                <div className="detail-item">
                  <p className="detail-label">Temperature</p>
                  <p className="detail-value">
                    {Math.round(weather.main.temp)}°C
                  </p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Humidity</p>
                  <p className="detail-value">{weather.main.humidity}%</p>
                </div>
                <div className="detail-item">
                  <p className="detail-label">Wind</p>
                  <p className="detail-value">{weather.wind.speed} km/h</p>
                </div>
              </div>
            </div>

            {weather.aiAnalysis && (
              <div className="weather-card ai-forecast">
                <div className="forecast-content">
                  <div className="forecast-icon">🤖</div>
                  <div>
                    <h3 className="forecast-title">AI Analysis</h3>
                    <p className="forecast-text">
                      {weather.aiAnalysis.analysis}
                    </p>
                    <div>
                      <strong>Recommendations:</strong>
                      <ul>
                        {weather.aiAnalysis.recommendations.map(
                          (rec, index) => (
                            <li key={index}>{rec}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
  };
  return icons[condition] || "🌤️";
}

export default WeatherApp;
EOF;

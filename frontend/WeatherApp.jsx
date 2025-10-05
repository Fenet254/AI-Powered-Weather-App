"use client";
import React, { useState, useEffect } from "react";
import "../css/home.css";
import { Line } from "react-chartjs-2";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

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
        fetchForecast(cityName);
      } else {
        setError(data.error || "Weather data not found");
      }
    } catch (err) {
      setError("Failed to connect to weather service");
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (cityName) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/forecast?city=${encodeURIComponent(cityName)}`
      );
      const data = await res.json();
      if (res.ok) setForecast(data.list.slice(0, 6)); // first 6 time slots
    } catch {
      console.warn("Forecast unavailable");
    }
  };

  const handleVoiceSearch = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = (event) => {
      const voiceCity = event.results[0][0].transcript;
      setCity(voiceCity);
      getWeather(voiceCity);
    };
  };

  const getWeatherIcon = (condition) => {
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
  };

  return (
    <div className={`weather-app ${weather ? weather.weather[0].main.toLowerCase() : ""}`}>
      <header className="app-header">
        <h1>🌤 AI Weather App</h1>
        <div className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "🌙" : "☀️"}
        </div>
      </header>

      <form className="search-form" onSubmit={(e) => { e.preventDefault(); getWeather(); }}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
        />
        <button disabled={loading}>{loading ? "⏳" : "🔍"}</button>
        <button type="button" onClick={handleVoiceSearch}>🎤</button>
      </form>

      {error && <div className="error-msg">⚠️ {error}</div>}

      {weather && !loading && (
        <div className="weather-card glass">
          <h2>{weather.name}</h2>
          <div className="temp">{Math.round(weather.main.temp)}°C</div>
          <div className="condition">
            {getWeatherIcon(weather.weather[0].main)} {weather.weather[0].description}
          </div>
          <div className="details">
            <p>💧 {weather.main.humidity}%</p>
            <p>🌬️ {weather.wind.speed} km/h</p>
          </div>

          {forecast.length > 0 && (
            <div className="chart-container">
              <Line
                data={{
                  labels: forecast.map((f) => f.dt_txt.split(" ")[1].slice(0, 5)),
                  datasets: [
                    {
                      label: "Temp (°C)",
                      data: forecast.map((f) => f.main.temp),
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{ responsive: true, scales: { y: { beginAtZero: false } } }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
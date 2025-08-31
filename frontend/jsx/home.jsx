import React, { useState, useEffect } from "react";
import "./WeatherApp.css";

const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 14,
    condition: "Mostly Clear",
    humidity: 75,
    wind: 15,
    feelsLike: 12,
    city: "San Francisco",
    country: "USA",
  });

  const [forecast, setForecast] = useState([
    { day: "Monday", icon: "sunny", low: 10, high: 16 },
    { day: "Tuesday", icon: "partly-cloudy", low: 11, high: 18 },
    { day: "Wednesday", icon: "cloudy", low: 12, high: 17 },
    { day: "Thursday", icon: "rainy", low: 9, high: 15 },
    { day: "Friday", icon: "sunny", low: 13, high: 19 },
  ]);

  const [unit, setUnit] = useState("celsius");
  const [activeTab, setActiveTab] = useState("home");
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle between Celsius and Fahrenheit
  const toggleUnit = () => {
    setUnit(unit === "celsius" ? "fahrenheit" : "celsius");
  };

  // Convert temperature based on selected unit
  const convertTemp = (temp) => {
    if (unit === "fahrenheit") {
      return Math.round((temp * 9) / 5 + 32);
    }
    return temp;
  };

  // Handle city search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would call a weather API
      setCurrentWeather({
        ...currentWeather,
        city: searchQuery,
      });
      setSearchQuery("");
      setSearchVisible(false);
    }
  };

  // Simulate loading data
  useEffect(() => {
    // In a real app, this would fetch data from a weather API
    const timer = setTimeout(() => {
      console.log("Data would be fetched from API here");
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentWeather.city]);

  return (
    <div className="weather-app">
      <header className="app-header">
        <div className="location-container">
          <h1>
            {currentWeather.city},{" "}
            <span className="country">{currentWeather.country}</span>
          </h1>
          <button
            className="icon-button"
            onClick={() => setSearchVisible(!searchVisible)}
            aria-label="Search city"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>

        {searchVisible && (
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter city name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        )}
      </header>

      <main className="main-content">
        <div className="weather-card current-weather">
          <div className="weather-primary">
            <div className="temperature-section">
              <p className="temperature" onClick={toggleUnit}>
                {convertTemp(currentWeather.temperature)}°
                <span className="unit">{unit === "celsius" ? "C" : "F"}</span>
              </p>
              <p className="condition">{currentWeather.condition}</p>
            </div>
            <img
              className="weather-icon"
              src={`https://lh3.googleusercontent.com/aida-public/AB6AXuCeKMevDKKpV-7F15X9MUg5CvzFPiBFJN2XFsyelqLkZX_rAKaFi9IClBIuoTr8OiPwxIwOOnwFkcBF0XVS83DnFMZ-LM2X_nSl6i22xn1PjqKMZEqM9Oe5IA6Kl1VeGr7DOCBi5WRLqBXX_QyZ-z9lT0bSKizddHXANJVDwbsLh2-DLW-Mb3JouSNWvID3o-TCAtv_MolB0n5J-Fi5VFsooRUI5rkpM2vnqIM7dY_KxN91PSvmBpgWWpercqBz21u7DeO6lIRCTI8`}
              alt="Weather condition"
            />
          </div>

          <div className="weather-details">
            <div className="detail-item">
              <p className="detail-label">Humidity</p>
              <p className="detail-value">{currentWeather.humidity}%</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Wind</p>
              <p className="detail-value">{currentWeather.wind} km/h</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Feels like</p>
              <p className="detail-value">
                {convertTemp(currentWeather.feelsLike)}°
              </p>
            </div>
          </div>
        </div>

        <div className="weather-card ai-forecast">
          <div className="forecast-content">
            <span className="material-symbols-outlined forecast-icon">
              model_training
            </span>
            <div>
              <p className="forecast-title">AI Forecast</p>
              <p className="forecast-text">
                Tomorrow will be sunny with a high of{" "}
                {unit === "celsius" ? "20°C" : "68°F"}.
              </p>
            </div>
          </div>
        </div>

        <div className="forecast-section">
          <h2>5-Day Forecast</h2>
          <div className="forecast-list">
            {forecast.map((dayForecast, index) => (
              <div key={index} className="forecast-item">
                <p className="day">{dayForecast.day}</p>
                <img
                  className="forecast-icon-small"
                  src={`https://lh3.googleusercontent.com/aida-public/AB6AXuBCOSxbSN6JSOTmE7CfcHUIC9ppEKTunB46R62vr73rVOzhP1KyaFzMkZRYGkMJ40XuJ3g7yP5ZfMQsxMWvo26IT4hwHdrdzTiwNM5MOIwBMV5pzZDaMWUR24L_dxiNC0_3gGPYyfI0_9ik-I0AzhXpaWdjuVVY_DG34z-k4Oiwet0R3eVfZUe0LQj7ptGdOFBQbXLigeP0Nms1rEMxgpnbK3EQDbqtlXfilj_YzmVLn9UzSGxq-Cb-GZcLXo1pz4LyVGMrQJCdIf0`}
                  alt={dayForecast.icon}
                />
                <p className="temperature-range">
                  {convertTemp(dayForecast.low)}° /{" "}
                  {convertTemp(dayForecast.high)}°
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <nav className="bottom-nav">
          <button
            className={`nav-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <span className="material-symbols-outlined">home</span>
            <span className="nav-label">Home</span>
          </button>
          <button
            className={`nav-item ${activeTab === "search" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("search");
              setSearchVisible(true);
            }}
          >
            <span className="material-symbols-outlined">search</span>
            <span className="nav-label">Search</span>
          </button>
          <button
            className={`nav-item ${activeTab === "maps" ? "active" : ""}`}
            onClick={() => setActiveTab("maps")}
          >
            <span className="material-symbols-outlined">map</span>
            <span className="nav-label">Maps</span>
          </button>
          <button
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="nav-label">Settings</span>
          </button>
        </nav>
      </footer>
    </div>
  );
};

export default WeatherApp;

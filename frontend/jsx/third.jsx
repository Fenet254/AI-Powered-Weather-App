import React, { useState, useEffect } from "react";
import "./WeatherAdmin.css";

const WeatherAdmin = () => {
  const [cities, setCities] = useState([
    { id: 1, name: "New York", temp: 25, updated: "2h ago", forecast: "Sunny" },
    {
      id: 2,
      name: "Los Angeles",
      temp: 28,
      updated: "1h ago",
      forecast: "Clear",
    },
    { id: 3, name: "Chicago", temp: 22, updated: "3h ago", forecast: "Cloudy" },
    {
      id: 4,
      name: "Houston",
      temp: 27,
      updated: "4h ago",
      forecast: "Partly Cloudy",
    },
    { id: 5, name: "Phoenix", temp: 24, updated: "2h ago", forecast: "Sunny" },
    {
      id: 6,
      name: "Philadelphia",
      temp: 26,
      updated: "1h ago",
      forecast: "Rainy",
    },
  ]);

  const [stats, setStats] = useState({
    citiesTracked: 150,
    apiCalls: 12345,
    uptime: 99.9,
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "error",
      message: "API Error: Rate limit exceeded",
      time: "10 minutes ago",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");
  const [apiKey, setApiKey] = useState("••••••••••••••••");
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");

  // Simulate data refresh
  const refreshData = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedCities = cities.map((city) => ({
        ...city,
        temp: Math.floor(Math.random() * 15) + 20, // Random temp between 20-35
        updated: "Just now",
      }));

      setCities(updatedCities);
      setStats({
        ...stats,
        apiCalls: stats.apiCalls + 1,
      });
      setIsLoading(false);
    }, 1500);
  };

  // Toggle temperature unit
  const toggleTemperatureUnit = () => {
    setTemperatureUnit((prevUnit) =>
      prevUnit === "celsius" ? "fahrenheit" : "celsius"
    );
  };

  // Convert temperature based on selected unit
  const convertTemperature = (temp) => {
    if (temperatureUnit === "fahrenheit") {
      return Math.round((temp * 9) / 5 + 32);
    }
    return temp;
  };

  // Handle API key update
  const handleApiKeyUpdate = (e) => {
    e.preventDefault();
    if (newApiKey.trim()) {
      setApiKey(newApiKey);
      setNewApiKey("");
      setShowApiKeyForm(false);

      // Add success notification
      setNotifications([
        ...notifications,
        {
          id: Date.now(),
          type: "success",
          message: "API Key updated successfully",
          time: "Just now",
        },
      ]);
    }
  };

  // Format temperature display
  const formatTemperature = (temp) => {
    return `${convertTemperature(temp)}°${
      temperatureUnit === "celsius" ? "C" : "F"
    }`;
  };

  // Calculate time ago
  const getTimeAgo = (timeString) => {
    if (timeString === "Just now") return timeString;

    // In a real app, this would calculate from actual timestamps
    return timeString;
  };

  return (
    <div className="weather-admin">
      <header className="admin-header">
        <div className="header-content">
          <button className="menu-button">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="header-title">Weather Admin</h1>
          <div className="header-placeholder"></div>
        </div>
      </header>

      <main className="admin-main">
        <section className="overview-section">
          <h2 className="section-title">Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Cities Tracked</p>
              <p className="stat-value">{stats.citiesTracked}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total API Calls</p>
              <p className="stat-value">{stats.apiCalls.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Uptime</p>
              <p className="stat-value">{stats.uptime}%</p>
            </div>
          </div>
        </section>

        <section className="city-data-section">
          <div className="section-header">
            <h2 className="section-title">City Data</h2>
            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={refreshData}
                disabled={isLoading}
              >
                <span className="material-symbols-outlined">
                  {isLoading ? "refresh" : "refresh"}
                </span>
                <span>{isLoading ? "Refreshing..." : "Refresh Data"}</span>
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowApiKeyForm(!showApiKeyForm)}
              >
                <span className="material-symbols-outlined">key</span>
                <span>Update API Key</span>
              </button>
            </div>
          </div>

          {showApiKeyForm && (
            <div className="api-key-form">
              <form onSubmit={handleApiKeyUpdate}>
                <input
                  type="password"
                  placeholder="Enter new API key"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  className="api-key-input"
                />
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowApiKeyForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="table-container">
            <table className="cities-table">
              <thead>
                <tr>
                  <th>City</th>
                  <th>
                    <button
                      className="temp-header-btn"
                      onClick={toggleTemperatureUnit}
                    >
                      Temp. ({temperatureUnit === "celsius" ? "°C" : "°F"})
                    </button>
                  </th>
                  <th>Last Updated</th>
                  <th>AI Forecast</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.id} className="city-row">
                    <td className="city-name">{city.name}</td>
                    <td className="city-temp">
                      {formatTemperature(city.temp)}
                    </td>
                    <td className="city-updated">{getTimeAgo(city.updated)}</td>
                    <td className="city-forecast">
                      <span className="forecast-badge">{city.forecast}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="notifications-section">
          <h2 className="section-title">Notifications</h2>
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.type}`}
              >
                <div className="notification-icon">
                  <span className="material-symbols-outlined">
                    {notification.type === "error" ? "error" : "check_circle"}
                  </span>
                </div>
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-time">{notification.time}</p>
                </div>
                <div className="notification-arrow">
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="admin-footer">
        <nav className="footer-nav">
          <button
            className={`nav-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <span className="material-symbols-outlined">home</span>
            <span className="nav-label">Home</span>
          </button>
          <button
            className={`nav-item ${activeTab === "forecast" ? "active" : ""}`}
            onClick={() => setActiveTab("forecast")}
          >
            <span className="material-symbols-outlined">thermostat</span>
            <span className="nav-label">Forecast</span>
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

export default WeatherAdmin;

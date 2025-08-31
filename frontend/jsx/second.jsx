import React, { useState, useEffect } from "react";
import "./AIInsights.css";

const AIInsights = () => {
  const [temperatureData, setTemperatureData] = useState([
    { day: "Mon", value: 21 },
    { day: "Tue", value: 25 },
    { day: "Wed", value: 41 },
    { day: "Thu", value: 33 },
    { day: "Fri", value: 101 },
    { day: "Sat", value: 61 },
    { day: "Sun", value: 45 },
  ]);

  const [selectedDay, setSelectedDay] = useState(null);
  const [currentTemperature, setCurrentTemperature] = useState(25);
  const [temperatureUnit, setTemperatureUnit] = useState("celsius");
  const [activeTab, setActiveTab] = useState("insights");

  // Toggle between Celsius and Fahrenheit
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

  // Handle day selection from the chart
  const handleDaySelect = (dayIndex) => {
    setSelectedDay(dayIndex);
  };

  // Generate SVG path data from temperature values
  const generateChartPath = () => {
    const points = temperatureData.map((data, index) => {
      const x = index * (472 / (temperatureData.length - 1));
      // Scale the y value to fit within the chart height (0-148)
      const y = 148 - (data.value / 101) * 148;
      return `${x},${y}`;
    });

    return `M${points.join(" L")}`;
  };

  // Generate gradient area for the chart
  const generateAreaPath = () => {
    const points = temperatureData.map((data, index) => {
      const x = index * (472 / (temperatureData.length - 1));
      const y = 148 - (data.value / 101) * 148;
      return `${x},${y}`;
    });

    return `M${points.join(" L")} L472,149 L0,149 Z`;
  };

  // Format temperature with unit
  const formatTemperature = (temp) => {
    return `${convertTemperature(temp)}°${
      temperatureUnit === "celsius" ? "C" : "F"
    }`;
  };

  return (
    <div className="ai-insights-app">
      <header className="app-header">
        <div className="header-content">
          <button className="back-button">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="header-title">AI Insights</h2>
          <div className="header-placeholder"></div>
        </div>
      </header>

      <main className="main-content">
        <div className="temperature-card">
          <div className="temperature-header">
            <p className="temperature-label">Temperature Trend</p>
            <div className="temperature-display">
              <p
                className="current-temperature"
                onClick={toggleTemperatureUnit}
              >
                {formatTemperature(currentTemperature)}
              </p>
              <div className="temperature-change">
                <p className="time-range">Next 7 Days</p>
                <p className="change-value positive">
                  <span className="material-symbols-outlined">
                    arrow_drop_up
                  </span>
                  <span>2%</span>
                </p>
              </div>
            </div>
          </div>

          <div className="temperature-chart">
            <div className="chart-container">
              <svg
                className="chart"
                viewBox="0 0 472 150"
                preserveAspectRatio="none"
              >
                {/* Gradient area */}
                <path
                  d={generateAreaPath()}
                  fill="url(#chartGradient)"
                  className="chart-area"
                />

                {/* Line */}
                <path
                  d={generateChartPath()}
                  stroke="#F9F506"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="chart-line"
                />

                {/* Points */}
                {temperatureData.map((data, index) => {
                  const x = index * (472 / (temperatureData.length - 1));
                  const y = 148 - (data.value / 101) * 148;

                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#F9F506"
                      className={`chart-point ${
                        selectedDay === index ? "selected" : ""
                      }`}
                      onClick={() => handleDaySelect(index)}
                    />
                  );
                })}

                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#F9F506" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F9F506" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="chart-labels">
              {temperatureData.map((data, index) => (
                <p
                  key={index}
                  className={`chart-label ${
                    selectedDay === index ? "selected" : ""
                  }`}
                  onClick={() => handleDaySelect(index)}
                >
                  {data.day}
                </p>
              ))}
            </div>
          </div>

          {selectedDay !== null && (
            <div className="day-details">
              <p>
                {temperatureData[selectedDay].day}:{" "}
                {formatTemperature(temperatureData[selectedDay].value)}
              </p>
            </div>
          )}
        </div>

        <div className="forecast-section">
          <h2 className="section-title">Tomorrow's AI Forecast</h2>
          <p className="forecast-description">
            Our AI predicts a sunny day with a high of {formatTemperature(28)}{" "}
            and a low of {formatTemperature(18)}. Expect gentle breezes from the
            south. There's a 5% chance of light showers in the late afternoon.
          </p>
        </div>

        <div className="anomalies-section">
          <h2 className="section-title">Anomalies</h2>
          <div className="anomalies-list">
            <div className="anomaly-card">
              <div className="anomaly-icon heatwave">
                <span className="material-symbols-outlined">thermostat</span>
              </div>
              <div className="anomaly-details">
                <p className="anomaly-title">Heatwave Alert</p>
                <p className="anomaly-date">July 15 - July 20</p>
              </div>
            </div>

            <div className="anomaly-card">
              <div className="anomaly-icon rainstorm">
                <span className="material-symbols-outlined">thunderstorm</span>
              </div>
              <div className="anomaly-details">
                <p className="anomaly-title">Rainstorm Warning</p>
                <p className="anomaly-date">August 5 - August 7</p>
              </div>
            </div>
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
            className={`nav-item ${activeTab === "insights" ? "active" : ""}`}
            onClick={() => setActiveTab("insights")}
          >
            <span className="material-symbols-outlined">insights</span>
            <span className="nav-label">Insights</span>
          </button>

          <button
            className={`nav-item ${activeTab === "filters" ? "active" : ""}`}
            onClick={() => setActiveTab("filters")}
          >
            <span className="material-symbols-outlined">filter_list</span>
            <span className="nav-label">Filters</span>
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

export default AIInsights;

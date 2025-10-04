import React, { useState } from "react";
import "../styles/Analysis.css";

function Analysis({ navigate }) {
  const [analysisData, setAnalysisData] = useState(null);
  const [city, setCity] = useState("");

  const getAnalysis = async (cityName = city) => {
    if (!cityName.trim()) return;

    try {
      const apiKey = "demo_key";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();

      if (data.cod === 200) {
        const aiAnalysis = generateAIAnalysis(data);
        setAnalysisData({ ...data, aiAnalysis });
      }
    } catch (err) {
      const mockData = getMockWeatherData(cityName);
      setAnalysisData(mockData);
    }
  };

  const getComfortLevel = (index) => {
    if (index >= 80) return { level: "Excellent", color: "#10b981" };
    if (index >= 60) return { level: "Good", color: "#3b82f6" };
    if (index >= 40) return { level: "Fair", color: "#f59e0b" };
    if (index >= 20) return { level: "Poor", color: "#ef4444" };
    return { level: "Very Poor", color: "#dc2626" };
  };

  const generateAIAnalysis = (weatherData) => {
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const wind = weatherData.wind.speed;
    const condition = weatherData.weather[0].main;

    let comfortIndex = 70;

    if (temp >= 18 && temp <= 24) comfortIndex += 20;
    else if (temp >= 15 && temp <= 27) comfortIndex += 10;
    else if (temp < 5 || temp > 32) comfortIndex -= 20;
    else if (temp < 10 || temp > 28) comfortIndex -= 10;

    if (humidity >= 40 && humidity <= 60) comfortIndex += 10;
    else if (humidity < 20 || humidity > 80) comfortIndex -= 10;

    if (wind > 10) comfortIndex -= 5;

    if (condition === "Clear") comfortIndex += 5;
    else if (condition === "Rain" || condition === "Snow") comfortIndex -= 15;

    comfortIndex = Math.max(0, Math.min(100, comfortIndex));

    let analysis = "";
    if (comfortIndex >= 80) {
      analysis =
        "Excellent weather conditions today! It's a perfect day for outdoor activities.";
    } else if (comfortIndex >= 60) {
      analysis =
        "Good weather conditions. Generally comfortable for most activities.";
    } else if (comfortIndex >= 40) {
      analysis =
        "Fair weather conditions. Some aspects may be less than ideal.";
    } else if (comfortIndex >= 20) {
      analysis = "Poor weather conditions. Consider limiting outdoor exposure.";
    } else {
      analysis = "Very poor weather conditions. Stay indoors if possible.";
    }

    const recommendations = [];
    if (temp < 10)
      recommendations.push("Dress in warm layers to stay comfortable.");
    if (temp > 28)
      recommendations.push("Stay hydrated and avoid prolonged sun exposure.");
    if (humidity < 30)
      recommendations.push("The air is dry, consider using moisturizer.");
    if (humidity > 70)
      recommendations.push(
        "High humidity may make it feel warmer than actual temperature."
      );
    if (wind > 8)
      recommendations.push("Windy conditions, secure loose objects outdoors.");
    if (condition === "Rain")
      recommendations.push("Carry an umbrella or wear waterproof clothing.");
    if (condition === "Snow")
      recommendations.push(
        "Wear appropriate footwear for slippery conditions."
      );

    if (recommendations.length === 0) {
      recommendations.push(
        "No special recommendations needed. Enjoy the pleasant weather!"
      );
    }

    return {
      comfortIndex,
      analysis,
      recommendations,
    };
  };

  const getMockWeatherData = (cityName = "New York") => {
    const mockData = {
      name: cityName,
      main: {
        temp: 22,
        humidity: 65,
        pressure: 1013,
      },
      weather: [{ main: "Clear", description: "clear sky" }],
      wind: { speed: 3.5 },
    };

    const aiAnalysis = generateAIAnalysis(mockData);
    return { ...mockData, aiAnalysis, cod: 200 };
  };

  return (
    <div className="app-container analysis-container">
      <header className="app-header">
        <h1>📊 Weather Analysis</h1>
        <p>Detailed weather insights and comfort analysis</p>
      </header>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name for analysis..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && getAnalysis()}
          />
          <button onClick={() => getAnalysis()}>
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {analysisData && analysisData.aiAnalysis && (
        <div className="analysis-content">
          <h2>{analysisData.name} Weather Analysis</h2>

          <div className="comfort-card">
            <h3>Comfort Analysis</h3>
            <div className="comfort-meter">
              <div className="meter-background">
                <div
                  className="meter-fill"
                  style={{ width: `${analysisData.aiAnalysis.comfortIndex}%` }}
                ></div>
              </div>
              <div className="comfort-info">
                <span
                  className="comfort-level"
                  style={{
                    color: getComfortLevel(analysisData.aiAnalysis.comfortIndex)
                      .color,
                  }}
                >
                  {getComfortLevel(analysisData.aiAnalysis.comfortIndex).level}
                </span>
                <span className="comfort-score">
                  {analysisData.aiAnalysis.comfortIndex}/100
                </span>
              </div>
            </div>
          </div>

          <div className="factors-grid">
            <div className="factor-card">
              <h4>🌡️ Temperature</h4>
              <p>{Math.round(analysisData.main.temp)}°C</p>
              <p className="factor-desc">
                {analysisData.main.temp < 10
                  ? "Cold"
                  : analysisData.main.temp < 20
                  ? "Cool"
                  : analysisData.main.temp < 30
                  ? "Warm"
                  : "Hot"}
              </p>
            </div>
            <div className="factor-card">
              <h4>💧 Humidity</h4>
              <p>{analysisData.main.humidity}%</p>
              <p className="factor-desc">
                {analysisData.main.humidity < 30
                  ? "Dry"
                  : analysisData.main.humidity < 60
                  ? "Comfortable"
                  : "Humid"}
              </p>
            </div>
            <div className="factor-card">
              <h4>💨 Wind</h4>
              <p>{analysisData.wind.speed} m/s</p>
              <p className="factor-desc">
                {analysisData.wind.speed < 3
                  ? "Calm"
                  : analysisData.wind.speed < 7
                  ? "Breezy"
                  : "Windy"}
              </p>
            </div>
            <div className="factor-card">
              <h4>☁️ Conditions</h4>
              <p>{analysisData.weather[0].main}</p>
              <p className="factor-desc">
                {analysisData.weather[0].description}
              </p>
            </div>
          </div>

          <div className="ai-insights">
            <h3>🤖 AI Insights</h3>
            <p className="insight-text">{analysisData.aiAnalysis.analysis}</p>

            <div className="recommendations-section">
              <h4>Recommended Actions</h4>
              <ul>
                {analysisData.aiAnalysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <a
          href="/"
          className="nav-item"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <i className="fas fa-home"></i>
          <span>Current</span>
        </a>
        <a
          href="/forecast"
          className="nav-item"
          onClick={(e) => {
            e.preventDefault();
            navigate("/forecast");
          }}
        >
          <i className="fas fa-chart-line"></i>
          <span>Forecast</span>
        </a>
        <a
          href="/analysis"
          className="nav-item active"
          onClick={(e) => {
            e.preventDefault();
            navigate("/analysis");
          }}
        >
          <i className="fas fa-chart-bar"></i>
          <span>Analysis</span>
        </a>
      </nav>
    </div>
  );
}

export default Analysis;

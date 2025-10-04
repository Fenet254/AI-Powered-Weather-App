import React, { useState } from "react";
import "../styles/Home.css";

function Home({ navigate }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const getWeather = async (cityName = city) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError("");
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
        setWeather({ ...data, aiAnalysis });
      } else {
        setError(data.message || "City not found");
      }
    } catch (err) {
      const mockData = getMockWeatherData(cityName);
      setWeather(mockData);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const apiKey = "demo_key";
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            );
            const data = await response.json();
            if (data.cod === 200) {
              const aiAnalysis = generateAIAnalysis(data);
              setWeather({ ...data, aiAnalysis });
              setCity(data.name);
            }
          } catch (err) {
            const mockData = getMockWeatherData();
            setWeather(mockData);
            setCity(mockData.name);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError("Location access denied");
          setLoading(false);
        }
      );
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      Clear: "fa-sun",
      Clouds: "fa-cloud",
      Rain: "fa-cloud-rain",
      Drizzle: "fa-cloud-drizzle",
      Thunderstorm: "fa-bolt",
      Snow: "fa-snowflake",
      Mist: "fa-smog",
      Smoke: "fa-smog",
      Haze: "fa-smog",
      Dust: "fa-smog",
      Fog: "fa-smog",
      Sand: "fa-smog",
      Ash: "fa-smog",
      Squall: "fa-wind",
      Tornado: "fa-tornado",
    };
    return icons[condition] || "fa-cloud";
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
      sys: { country: "US" },
      main: {
        temp: 22,
        feels_like: 24,
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
    <div className="app-container">
      <header className="app-header">
        <h1>🌤️ AI Weather App</h1>
        <p>Get intelligent weather insights and recommendations</p>
      </header>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && getWeather()}
          />
          <button onClick={() => getWeather()}>
            <i className="fas fa-search"></i>
          </button>
          <button
            className="location-btn"
            onClick={getLocationWeather}
            title="Use current location"
          >
            <i className="fas fa-location-arrow"></i>
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Loading weather data...
        </div>
      )}

      {error && (
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i> {error}
        </div>
      )}

      {weather && (
        <div className="weather-card">
          <div className="weather-header">
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="weather-main">
            <div className="temperature-section">
              <i
                className={`fas ${getWeatherIcon(
                  weather.weather[0].main
                )} weather-icon`}
              ></i>
              <div className="temp">{Math.round(weather.main.temp)}°C</div>
            </div>
            <div className="weather-info">
              <p className="description">{weather.weather[0].description}</p>
              <div className="details">
                <div className="detail-item">
                  <i className="fas fa-temperature-low"></i>
                  Feels like: {Math.round(weather.main.feels_like)}°C
                </div>
                <div className="detail-item">
                  <i className="fas fa-tint"></i>
                  Humidity: {weather.main.humidity}%
                </div>
                <div className="detail-item">
                  <i className="fas fa-wind"></i>
                  Wind: {weather.wind.speed} m/s
                </div>
                <div className="detail-item">
                  <i className="fas fa-compress-arrows-alt"></i>
                  Pressure: {weather.main.pressure} hPa
                </div>
              </div>
            </div>
          </div>

          {weather.aiAnalysis && (
            <div className="ai-analysis">
              <h3>
                <i className="fas fa-robot"></i> AI Analysis
              </h3>
              <div className="comfort-index">
                Comfort Index:{" "}
                <span
                  className={`index-${Math.floor(
                    weather.aiAnalysis.comfortIndex / 25
                  )}`}
                >
                  {weather.aiAnalysis.comfortIndex}/100
                </span>
              </div>
              <p className="analysis-text">{weather.aiAnalysis.analysis}</p>
              <div className="recommendations">
                <h4>Recommendations:</h4>
                <ul>
                  {weather.aiAnalysis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <nav className="bottom-nav">
        <a
          href="/"
          className="nav-item active"
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
          className="nav-item"
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

export default Home;

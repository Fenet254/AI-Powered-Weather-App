const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const WEATHER_API_KEY = "your_openweather_api_key"; // Replace with your API key
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";


function analyzeWeather(data) {
  const temp = data.main.temp;
  const conditions = data.weather[0].main.toLowerCase();
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  let aiAnalysis = "";
  let recommendations = [];

  // Temperature analysis
  if (temp < 273) {
    aiAnalysis += "Very cold weather. ";
    recommendations.push("Wear heavy winter clothing");
    recommendations.push("Be cautious of icy conditions");
  } else if (temp < 283) {
    aiAnalysis += "Cold weather. ";
    recommendations.push("Wear a jacket");
  } else if (temp < 293) {
    aiAnalysis += "Pleasant weather. ";
    recommendations.push("Perfect for outdoor activities");
  } else if (temp < 303) {
    aiAnalysis += "Warm weather. ";
    recommendations.push("Wear light clothing");
    recommendations.push("Stay hydrated");
  } else {
    aiAnalysis += "Hot weather. ";
    recommendations.push("Avoid prolonged sun exposure");
    recommendations.push("Drink plenty of water");
  }

  // Condition analysis
  if (conditions.includes("rain")) {
    aiAnalysis += "Rainy conditions expected. ";
    recommendations.push("Carry an umbrella");
    recommendations.push("Drive carefully");
  } else if (conditions.includes("snow")) {
    aiAnalysis += "Snowfall expected. ";
    recommendations.push("Wear waterproof boots");
    recommendations.push("Check road conditions");
  } else if (conditions.includes("cloud")) {
    aiAnalysis += "Cloudy skies. ";
    recommendations.push("Good day for photography");
  } else {
    aiAnalysis += "Clear skies. ";
    recommendations.push("Perfect for outdoor plans");
  }

  // Humidity analysis
  if (humidity > 80) {
    aiAnalysis += "High humidity may make it feel warmer. ";
    recommendations.push("Wear breathable fabrics");
  } else if (humidity < 30) {
    aiAnalysis += "Low humidity, might feel dry. ";
    recommendations.push("Use moisturizer");
    recommendations.push("Stay hydrated");
  }

  return {
    analysis: aiAnalysis,
    recommendations: recommendations,
    comfortIndex: calculateComfortIndex(temp, humidity, windSpeed),
  };
}

function calculateComfortIndex(temp, humidity, windSpeed) {
  // Simple comfort index calculation
  let comfort = 100;

  // Temperature penalty
  const idealTemp = 295; // 22°C in Kelvin
  const tempDiff = Math.abs(temp - idealTemp);
  comfort -= tempDiff * 2;

  // Humidity penalty
  if (humidity > 80 || humidity < 30) {
    comfort -= 20;
  }

  // Wind bonus/penalty
  if (windSpeed > 10) {
    comfort -= 15;
  } else if (windSpeed > 5) {
    comfort += 10; // Light breeze is pleasant
  }

  return Math.max(0, Math.min(100, Math.round(comfort)));
}

// Routes
app.get("/api/weather", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    let url;
    if (lat && lon) {
      url = `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    } else {
      url = `${WEATHER_BASE_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    }

    const response = await axios.get(url);
    const weatherData = response.data;

    // Add AI analysis
    const aiAnalysis = analyzeWeather(weatherData);
    weatherData.aiAnalysis = aiAnalysis;

    res.json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch weather data",
      details: error.response?.data?.message || "Unknown error",
    });
  }
});

app.get("/api/forecast", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    let url;
    if (lat && lon) {
      url = `${WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    } else {
      url = `${WEATHER_BASE_URL}/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    }

    const response = await axios.get(url);
    const forecastData = response.data;

    // Add AI analysis to each forecast entry
    forecastData.list.forEach((item) => {
      item.aiAnalysis = analyzeWeather(item);
    });

    res.json(forecastData);
  } catch (error) {
    console.error("Forecast API error:", error);
    res.status(500).json({
      error: "Failed to fetch forecast data",
      details: error.response?.data?.message || "Unknown error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the app at: http://localhost:${PORT}`);
});

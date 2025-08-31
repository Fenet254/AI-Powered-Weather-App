// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so frontend (HTML/JS) can call backend
app.use(cors());

// Route: Get weather by city
app.get("/api/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(404).json({ error: "City not found" });
    }

    // Add simulated AI forecast (backend logic)
    const aiForecast = simulateAI(
      data.main.temp,
      data.main.humidity,
      data.wind.speed
    );

    res.json({
      city: data.name,
      country: data.sys.country,
      description: data.weather[0].description,
      temp: data.main.temp,
      humidity: data.main.humidity,
      wind: (data.wind.speed * 3.6).toFixed(1), // km/h
      aiForecast,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

// AI Forecast logic (backend)
function simulateAI(temp, humidity, wind) {
  const tomorrowTemp = (parseFloat(temp) + Math.random() * 3 - 1.5).toFixed(1);
  const condition =
    tomorrowTemp > 30
      ? "Sunny & Hot"
      : tomorrowTemp > 20
      ? "Warm & Breezy"
      : tomorrowTemp > 10
      ? "Cool & Cloudy"
      : "Chilly or Rainy";

  return `${tomorrowTemp}°C - Likely ${condition}`;
}

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

// allow frontend (browser) to call backend
app.use(cors());

// put your OpenWeatherMap API key here
const API_KEY = "YOUR_API_KEY";

// API endpoint: GET /weather?city=London
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    const data = response.data;

    // simple AI simulation logic
    const tomorrowTemp = (
      parseFloat(data.main.temp) +
      Math.random() * 3 -
      1.5
    ).toFixed(1);
    const condition =
      tomorrowTemp > 30
        ? "Sunny & Hot"
        : tomorrowTemp > 20
        ? "Warm & Breezy"
        : tomorrowTemp > 10
        ? "Cool & Cloudy"
        : "Chilly or Rainy";

    const aiForecast = `${tomorrowTemp}°C - Likely ${condition}`;

    // send clean JSON response
    res.json({
      city: data.name,
      country: data.sys.country,
      description: data.weather[0].description,
      temp: data.main.temp.toFixed(1),
      humidity: data.main.humidity,
      wind: (data.wind.speed * 3.6).toFixed(1), // m/s → km/h
      aiForecast,
    });
  } catch (err) {
    res.status(500).json({ error: "City not found or API error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

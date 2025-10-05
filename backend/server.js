import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import morgan from "morgan";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 🌤 Weather API Configuration
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

// 🧠 Cache (5 min TTL)
const cache = new NodeCache({ stdTTL: 300 });

// ⚙️ Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/css", express.static(path.join(__dirname, "../frontend/css")));

// 🧩 Utility: Comfort & AI Weather Insights
function analyzeWeather(data) {
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const conditions = data.weather[0].main.toLowerCase();

  let analysis = [];
  let recs = [];

  // 🌡 Temperature logic
  if (temp <= 0) {
    analysis.push("Freezing cold!");
    recs.push("Wear thermal clothes", "Avoid staying outdoors too long");
  } else if (temp < 10) {
    analysis.push("Chilly weather");
    recs.push("Jacket recommended");
  } else if (temp < 25) {
    analysis.push("Comfortable temperature");
    recs.push("Ideal for outdoor activities");
  } else if (temp < 35) {
    analysis.push("Warm and sunny");
    recs.push("Stay hydrated", "Wear light clothes");
  } else {
    analysis.push("Very hot conditions");
    recs.push("Avoid direct sunlight", "Stay indoors if possible");
  }

  // 🌧 Condition logic
  if (conditions.includes("rain")) {
    analysis.push("Rain expected");
    recs.push("Carry an umbrella", "Drive safely");
  } else if (conditions.includes("snow")) {
    analysis.push("Snowfall expected");
    recs.push("Wear waterproof boots", "Be careful on roads");
  } else if (conditions.includes("cloud")) {
    analysis.push("Cloudy skies");
  } else {
    analysis.push("Clear skies");
  }

  // 💧 Humidity impact
  if (humidity > 80) recs.push("High humidity — might feel sticky");
  else if (humidity < 30) recs.push("Low humidity — drink water, use moisturizer");

  // 💨 Wind factor
  if (wind > 20) recs.push("Strong winds — secure loose items outside");

  // 🧮 Comfort Index (0–100)
  const comfort = calculateComfortIndex(temp, humidity, wind);

  return {
    analysis: analysis.join(". "),
    recommendations: [...new Set(recs)], // unique
    comfortIndex: comfort,
  };
}

function calculateComfortIndex(temp, humidity, wind) {
  let comfort = 100;
  const idealTemp = 22;
  comfort -= Math.abs(temp - idealTemp) * 2;

  if (humidity > 80 || humidity < 30) comfort -= 10;
  if (wind > 20) comfort -= 10;
  if (wind > 5 && wind < 15) comfort += 5;

  return Math.max(0, Math.min(100, Math.round(comfort)));
}

// 🕒 Helper: Fetch Local Time
async function getLocalTime(lat, lon) {
  try {
    const resp = await axios.get(
      `https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`
    );
    return resp.data.time;
  } catch {
    return "Unknown";
  }
}

// 🧭 Route: Current Weather
app.get("/api/weather", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const cacheKey = city || `${lat},${lon}`;
    if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

    let url = lat && lon
      ? `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      : `${WEATHER_BASE_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;

    const { data } = await axios.get(url);

    const ai = analyzeWeather(data);
    const localTime = await getLocalTime(data.coord.lat, data.coord.lon);

    const enriched = {
      ...data,
      aiAnalysis: ai,
      localTime,
      fetchedAt: new Date().toISOString(),
    };

    cache.set(cacheKey, enriched);
    res.json(enriched);
  } catch (err) {
    console.error("Weather API error:", err.message);
    res.status(500).json({
      error: "Failed to fetch weather data",
      details: err.response?.data?.message || err.message,
    });
  }
});

// 🌦 Route: Forecast
app.get("/api/forecast", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const cacheKey = `forecast-${city || `${lat},${lon}`}`;
    if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

    let url = lat && lon
      ? `${WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      : `${WEATHER_BASE_URL}/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;

    const { data } = await axios.get(url);

    data.list = data.list.map((item) => ({
      ...item,
      aiAnalysis: analyzeWeather(item),
    }));

    cache.set(cacheKey, data);
    res.json(data);
  } catch (err) {
    console.error("Forecast API error:", err.message);
    res.status(500).json({
      error: "Failed to fetch forecast data",
      details: err.response?.data?.message || err.message,
    });
  }
});

// 🏡 Root Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 🧩 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// 🧱 Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
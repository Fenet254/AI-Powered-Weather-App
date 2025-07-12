// script.js
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const weatherInfo = document.querySelector(".weather-info");

const cityName = document.getElementById("city-name");
const description = document.getElementById("description");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const aiForecast = document.getElementById("ai-forecast");

// Insert your OpenWeatherMap API Key here
const API_KEY = "YOUR_API_KEY";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === 200) {
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        description.textContent = data.weather[0].description;
        temp.textContent = data.main.temp.toFixed(1);
        humidity.textContent = data.main.humidity;
        wind.textContent = (data.wind.speed * 3.6).toFixed(1); // m/s to km/h

        const forecast = simulateAI(
          data.main.temp,
          data.main.humidity,
          data.wind.speed
        );
        aiForecast.textContent = forecast;

        weatherInfo.classList.remove("hidden");
      } else {
        alert("City not found. Try again.");
      }
    })
    .catch(() => {
      alert("Error fetching data. Try again.");
    });
}

// Simulated AI forecast logic
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

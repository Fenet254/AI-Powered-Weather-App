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
  const url = `http://localhost:5000/weather?city=${city}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert("City not found. Try again.");
        return;
      }

      cityName.textContent = `${data.city}, ${data.country}`;
      description.textContent = data.description;
      temp.textContent = data.temp;
      humidity.textContent = data.humidity;
      wind.textContent = data.wind;
      aiForecast.textContent = data.aiForecast;

      weatherInfo.classList.remove("hidden");
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

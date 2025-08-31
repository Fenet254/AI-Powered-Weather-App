function fetchWeather(city) {
  const url = `http://localhost:5000/api/weather?city=${city}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }

      cityName.textContent = `${data.city}, ${data.country}`;
      description.textContent = data.description;
      temp.textContent = data.temp.toFixed(1);
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

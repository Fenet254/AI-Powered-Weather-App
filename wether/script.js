function fetchWeather(city) {
  // Point to your PHP backend instead of Node.js
  const url = `http://localhost/weather.php?city=${encodeURIComponent(city)}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }

      // Update DOM with weather info
      cityName.textContent = `${data.city}, ${data.country}`;
      description.textContent = data.description;
      temp.textContent = data.temp.toFixed(1);
      humidity.textContent = data.humidity;
      wind.textContent = data.wind;
      aiForecast.textContent = data.aiForecast;

      weatherInfo.classList.remove("hidden");
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      alert("Error fetching data. Try again.");
    });
}

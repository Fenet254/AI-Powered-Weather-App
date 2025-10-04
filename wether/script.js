
document
  .getElementById("weather-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = document.getElementById("city-input").value;
    await getWeather(city);
  });

async function getWeather(city) {
  const submitBtn = document.querySelector(
    '#weather-form button[type="submit"]'
  );
  const originalText = submitBtn.textContent;

  try {
    // Show loading state
    submitBtn.textContent = "Loading...";
    submitBtn.disabled = true;

    const response = await fetch(
      `http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`
    );
    const data = await response.json();

    if (response.ok) {
      displayWeather(data);
    } else {
      showError("Error: " + (data.error || "Failed to fetch weather"));
    }
  } catch (err) {
    showError("Error: Failed to connect to weather service");
  } finally {
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

function displayWeather(data) {
  document.getElementById("city-name").textContent = data.name;
  document.getElementById("temp").textContent = Math.round(data.main.temp);
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("wind").textContent = data.wind.speed;
  document.getElementById("description").textContent =
    data.weather[0].description;

  // Update weather icon
  const weatherIcon = document.querySelector(".weather-icon");
  weatherIcon.textContent = getWeatherIcon(data.weather[0].main);

  if (data.aiAnalysis) {
    document.getElementById("ai-forecast").textContent =
      data.aiAnalysis.analysis;
  }

  // Show the weather result
  document.getElementById("weather-result").classList.remove("hidden");
  document.querySelector(".ai-forecast").classList.remove("hidden");
}

function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
  };
  return icons[condition] || "🌤️";
}

function showError(message) {
  alert(message);
}

// Location button
document.getElementById("location-btn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (response.ok) {
            displayWeather(data);
            document.getElementById("city-input").value = data.name;
          }
        } catch (err) {
          showError("Error getting location weather");
        }
      },
      (error) => {
        showError("Unable to get your location");
      }
    );
  } else {
    showError("Geolocation not supported");
  }
});


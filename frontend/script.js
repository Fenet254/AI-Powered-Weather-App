

document
  .getElementById("weather-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = document.getElementById("city-input").value;
    await getWeather(city);
  });



async function getWeather(city) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`
    );
    const data = await response.json();

    if (response.ok) {
      displayWeather(data);
    } else {
      alert("Error: " + (data.error || "Failed to fetch weather"));
    }
  } catch (err) {
    alert("Error: Failed to connect to weather service");
  }
}



function displayWeather(data) {
  document.getElementById("city-name").textContent = data.name;
  document.getElementById("temp").textContent = Math.round(data.main.temp);
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("wind").textContent = data.wind.speed;
  document.getElementById("description").textContent =
    data.weather[0].description;

  if (data.aiAnalysis) {
    document.getElementById("ai-forecast").textContent =
      data.aiAnalysis.analysis;
  }

  
  document.getElementById("weather-result").classList.remove("hidden");
  document.querySelector(".ai-forecast").classList.remove("hidden");
}


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
          }
        } catch (err) {
          alert("Error getting location weather");
        }
      },
      (error) => {
        alert("Unable to get your location");
      }
    );
  } else {
    alert("Geolocation not supported");
  }
});
EOF;

const { useState, useEffect } = React;

function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const getWeather = async (cityName = city) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:3000/api/weather?city=${encodeURIComponent(cityName)}`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
      } else {
        setError(data.message || "City not found");
      }
    } catch (err) {
      setError("Failed to fetch weather data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            if (data.cod === 200) {
              setWeather(data);
              setCity(data.name);
            }
          } catch (err) {
            setError("Failed to fetch location weather");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError("Location access denied");
          setLoading(false);
        }
      );
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      Clear: "fa-sun",
      Clouds: "fa-cloud",
      Rain: "fa-cloud-rain",
      Drizzle: "fa-cloud-drizzle",
      Thunderstorm: "fa-bolt",
      Snow: "fa-snowflake",
      Mist: "fa-smog",
      Smoke: "fa-smog",
      Haze: "fa-smog",
      Dust: "fa-smog",
      Fog: "fa-smog",
      Sand: "fa-smog",
      Ash: "fa-smog",
      Squall: "fa-wind",
      Tornado: "fa-tornado",
    };
    return icons[condition] || "fa-cloud";
  };

  return React.createElement(
    "div",
    { className: "home-container" },
    React.createElement(
      "header",
      { className: "app-header" },
      React.createElement("h1", null, "🌤️ AI Weather App"),
      React.createElement(
        "p",
        null,
        "Get intelligent weather insights and recommendations"
      )
    ),

    React.createElement(
      "div",
      { className: "search-section" },
      React.createElement(
        "div",
        { className: "search-box" },
        React.createElement("input", {
          type: "text",
          placeholder: "Enter city name...",
          value: city,
          onChange: (e) => setCity(e.target.value),
          onKeyPress: (e) => e.key === "Enter" && getWeather(),
        }),
        React.createElement(
          "button",
          { onClick: () => getWeather() },
          React.createElement("i", { className: "fas fa-search" })
        ),
        React.createElement(
          "button",
          {
            className: "location-btn",
            onClick: getLocationWeather,
            title: "Use current location",
          },
          React.createElement("i", { className: "fas fa-location-arrow" })
        )
      )
    ),

    loading &&
      React.createElement(
        "div",
        { className: "loading" },
        React.createElement("i", { className: "fas fa-spinner fa-spin" }),
        " Loading weather data..."
      ),

    error &&
      React.createElement(
        "div",
        { className: "error" },
        React.createElement("i", { className: "fas fa-exclamation-triangle" }),
        " ",
        error
      ),

    weather &&
      React.createElement(
        "div",
        { className: "weather-card" },
        React.createElement(
          "div",
          { className: "weather-header" },
          React.createElement(
            "h2",
            null,
            weather.name,
            ", ",
            weather.sys.country
          ),
          React.createElement(
            "p",
            { className: "date" },
            new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          )
        ),

        React.createElement(
          "div",
          { className: "weather-main" },
          React.createElement(
            "div",
            { className: "temperature-section" },
            React.createElement("i", {
              className: `fas ${getWeatherIcon(
                weather.weather[0].main
              )} weather-icon`,
            }),
            React.createElement(
              "div",
              { className: "temp" },
              Math.round(weather.main.temp),
              "°C"
            )
          ),
          React.createElement(
            "div",
            { className: "weather-info" },
            React.createElement(
              "p",
              { className: "description" },
              weather.weather[0].description
            ),
            React.createElement(
              "div",
              { className: "details" },
              React.createElement(
                "div",
                { className: "detail-item" },
                React.createElement("i", {
                  className: "fas fa-temperature-low",
                }),
                " Feels like: ",
                Math.round(weather.main.feels_like),
                "°C"
              ),
              React.createElement(
                "div",
                { className: "detail-item" },
                React.createElement("i", { className: "fas fa-tint" }),
                " Humidity: ",
                weather.main.humidity,
                "%"
              ),
              React.createElement(
                "div",
                { className: "detail-item" },
                React.createElement("i", { className: "fas fa-wind" }),
                " Wind: ",
                weather.wind.speed,
                " m/s"
              ),
              React.createElement(
                "div",
                { className: "detail-item" },
                React.createElement("i", {
                  className: "fas fa-compress-arrows-alt",
                }),
                " Pressure: ",
                weather.main.pressure,
                " hPa"
              )
            )
          )
        ),

        weather.aiAnalysis &&
          React.createElement(
            "div",
            { className: "ai-analysis" },
            React.createElement(
              "h3",
              null,
              React.createElement("i", { className: "fas fa-robot" }),
              " AI Analysis"
            ),
            React.createElement(
              "div",
              { className: "comfort-index" },
              "Comfort Index: ",
              React.createElement(
                "span",
                {
                  className: `index-${Math.floor(
                    weather.aiAnalysis.comfortIndex / 25
                  )}`,
                },
                weather.aiAnalysis.comfortIndex,
                "/100"
              )
            ),
            React.createElement(
              "p",
              { className: "analysis-text" },
              weather.aiAnalysis.analysis
            ),
            React.createElement(
              "div",
              { className: "recommendations" },
              React.createElement("h4", null, "Recommendations:"),
              React.createElement(
                "ul",
                null,
                weather.aiAnalysis.recommendations.map((rec, index) =>
                  React.createElement("li", { key: index }, rec)
                )
              )
            )
          )
      ),

    React.createElement(
      "nav",
      { className: "bottom-nav" },
      React.createElement(
        "a",
        { href: "/", className: "nav-item active" },
        React.createElement("i", { className: "fas fa-home" }),
        React.createElement("span", null, "Current")
      ),
      React.createElement(
        "a",
        { href: "/forecast", className: "nav-item" },
        React.createElement("i", { className: "fas fa-chart-line" }),
        React.createElement("span", null, "Forecast")
      ),
      React.createElement(
        "a",
        { href: "/analysis", className: "nav-item" },
        React.createElement("i", { className: "fas fa-chart-bar" }),
        React.createElement("span", null, "Analysis")
      )
    )
  );
}

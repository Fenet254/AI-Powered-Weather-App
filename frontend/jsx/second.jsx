const { useState, useEffect } = React;

function Second() {
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const getForecast = async (cityName = city) => {
    if (!cityName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/forecast?city=${encodeURIComponent(
          cityName
        )}`
      );
      const data = await response.json();

      if (data.cod === "200") {
        setForecast(data);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Group forecast by day
  const groupForecastByDay = (list) => {
    const grouped = {};
    list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
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
    };
    return icons[condition] || "fa-cloud";
  };

  useEffect(() => {
    if (city) {
      getForecast();
    }
  }, []);

  return React.createElement(
    "div",
    { className: "forecast-container" },
    React.createElement(
      "header",
      { className: "app-header" },
      React.createElement("h1", null, "📅 5-Day Forecast"),
      React.createElement(
        "p",
        null,
        "Extended weather predictions with AI insights"
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
          placeholder: "Enter city name for forecast...",
          value: city,
          onChange: (e) => setCity(e.target.value),
          onKeyPress: (e) => e.key === "Enter" && getForecast(),
        }),
        React.createElement(
          "button",
          { onClick: () => getForecast() },
          React.createElement("i", { className: "fas fa-search" })
        )
      )
    ),

    loading &&
      React.createElement(
        "div",
        { className: "loading" },
        "Loading forecast..."
      ),

    forecast &&
      React.createElement(
        "div",
        { className: "forecast-content" },
        React.createElement(
          "h2",
          null,
          forecast.city.name,
          ", ",
          forecast.city.country
        ),

        React.createElement(
          "div",
          { className: "forecast-days" },
          Object.entries(groupForecastByDay(forecast.list))
            .slice(0, 5)
            .map(([date, dayData]) =>
              React.createElement(
                "div",
                { key: date, className: "forecast-day" },
                React.createElement(
                  "h3",
                  null,
                  new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })
                ),

                dayData
                  .filter((_, index) => index % 4 === 0)
                  .slice(0, 3)
                  .map((item, index) =>
                    React.createElement(
                      "div",
                      { key: index, className: "forecast-item" },
                      React.createElement(
                        "p",
                        { className: "time" },
                        new Date(item.dt * 1000).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          hour12: true,
                        })
                      ),
                      React.createElement("i", {
                        className: `fas ${getWeatherIcon(
                          item.weather[0].main
                        )}`,
                      }),
                      React.createElement(
                        "p",
                        { className: "temp" },
                        Math.round(item.main.temp),
                        "°C"
                      ),
                      React.createElement(
                        "p",
                        { className: "desc" },
                        item.weather[0].description
                      )
                    )
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
        { href: "/", className: "nav-item" },
        React.createElement("i", { className: "fas fa-home" }),
        React.createElement("span", null, "Current")
      ),
      React.createElement(
        "a",
        { href: "/forecast", className: "nav-item active" },
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

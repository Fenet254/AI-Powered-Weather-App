const { useState, useEffect } = React;

function Third() {
  const [analysisData, setAnalysisData] = useState(null);
  const [city, setCity] = useState("");

  const getAnalysis = async (cityName = city) => {
    if (!cityName.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/weather?city=${encodeURIComponent(cityName)}`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setAnalysisData(data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const getComfortLevel = (index) => {
    if (index >= 80) return { level: "Excellent", color: "#10b981" };
    if (index >= 60) return { level: "Good", color: "#3b82f6" };
    if (index >= 40) return { level: "Fair", color: "#f59e0b" };
    if (index >= 20) return { level: "Poor", color: "#ef4444" };
    return { level: "Very Poor", color: "#dc2626" };
  };

  return React.createElement(
    "div",
    { className: "analysis-container" },
    React.createElement(
      "header",
      { className: "app-header" },
      React.createElement("h1", null, "📊 Weather Analysis"),
      React.createElement(
        "p",
        null,
        "Detailed weather insights and comfort analysis"
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
          placeholder: "Enter city name for analysis...",
          value: city,
          onChange: (e) => setCity(e.target.value),
          onKeyPress: (e) => e.key === "Enter" && getAnalysis(),
        }),
        React.createElement(
          "button",
          { onClick: () => getAnalysis() },
          React.createElement("i", { className: "fas fa-search" })
        )
      )
    ),

    analysisData &&
      analysisData.aiAnalysis &&
      React.createElement(
        "div",
        { className: "analysis-content" },
        React.createElement("h2", null, analysisData.name, " Weather Analysis"),

        React.createElement(
          "div",
          { className: "comfort-card" },
          React.createElement("h3", null, "Comfort Analysis"),
          React.createElement(
            "div",
            { className: "comfort-meter" },
            React.createElement(
              "div",
              { className: "meter-background" },
              React.createElement("div", {
                className: "meter-fill",
                style: { width: `${analysisData.aiAnalysis.comfortIndex}%` },
              })
            ),
            React.createElement(
              "div",
              { className: "comfort-info" },
              React.createElement(
                "span",
                {
                  className: "comfort-level",
                  style: {
                    color: getComfortLevel(analysisData.aiAnalysis.comfortIndex)
                      .color,
                  },
                },
                getComfortLevel(analysisData.aiAnalysis.comfortIndex).level
              ),
              React.createElement(
                "span",
                { className: "comfort-score" },
                analysisData.aiAnalysis.comfortIndex,
                "/100"
              )
            )
          )
        ),

        React.createElement(
          "div",
          { className: "factors-grid" },
          React.createElement(
            "div",
            { className: "factor-card" },
            React.createElement("h4", null, "🌡️ Temperature"),
            React.createElement(
              "p",
              null,
              Math.round(analysisData.main.temp),
              "°C"
            ),
            React.createElement(
              "p",
              { className: "factor-desc" },
              analysisData.main.temp < 10
                ? "Cold"
                : analysisData.main.temp < 20
                ? "Cool"
                : analysisData.main.temp < 30
                ? "Warm"
                : "Hot"
            )
          ),
          React.createElement(
            "div",
            { className: "factor-card" },
            React.createElement("h4", null, "💧 Humidity"),
            React.createElement("p", null, analysisData.main.humidity, "%"),
            React.createElement(
              "p",
              { className: "factor-desc" },
              analysisData.main.humidity < 30
                ? "Dry"
                : analysisData.main.humidity < 60
                ? "Comfortable"
                : "Humid"
            )
          ),
          React.createElement(
            "div",
            { className: "factor-card" },
            React.createElement("h4", null, "💨 Wind"),
            React.createElement("p", null, analysisData.wind.speed, " m/s"),
            React.createElement(
              "p",
              { className: "factor-desc" },
              analysisData.wind.speed < 3
                ? "Calm"
                : analysisData.wind.speed < 7
                ? "Breezy"
                : "Windy"
            )
          ),
          React.createElement(
            "div",
            { className: "factor-card" },
            React.createElement("h4", null, "☁️ Conditions"),
            React.createElement("p", null, analysisData.weather[0].main),
            React.createElement(
              "p",
              { className: "factor-desc" },
              analysisData.weather[0].description
            )
          )
        ),

        React.createElement(
          "div",
          { className: "ai-insights" },
          React.createElement("h3", null, "🤖 AI Insights"),
          React.createElement(
            "p",
            { className: "insight-text" },
            analysisData.aiAnalysis.analysis
          ),

          React.createElement(
            "div",
            { className: "recommendations-section" },
            React.createElement("h4", null, "Recommended Actions"),
            React.createElement(
              "ul",
              null,
              analysisData.aiAnalysis.recommendations.map((rec, index) =>
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
        { href: "/", className: "nav-item" },
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
        { href: "/analysis", className: "nav-item active" },
        React.createElement("i", { className: "fas fa-chart-bar" }),
        React.createElement("span", null, "Analysis")
      )
    )
  );
}

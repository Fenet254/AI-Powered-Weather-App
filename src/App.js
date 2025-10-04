import React, { useState, useEffect } from "react";
import Home from "./Home";
import Forecast from "./Forecast";
import Analysis from "./Analysis";
import "../styles/App.css";

function App() {
  const [currentView, setCurrentView] = useState("home");

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path === "/forecast") {
        setCurrentView("forecast");
      } else if (path === "/analysis") {
        setCurrentView("analysis");
      } else {
        setCurrentView("home");
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    handleRouteChange();

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentView(path === "/" ? "home" : path.substring(1));
  };

  const renderComponent = () => {
    switch (currentView) {
      case "forecast":
        return <Forecast navigate={navigate} />;
      case "analysis":
        return <Analysis navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return <div className="app">{renderComponent()}</div>;
}

export default App;

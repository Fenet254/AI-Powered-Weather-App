<?php
header("Content-Type: application/json");

// Get city from query string
$city = isset($_GET['city']) ? htmlspecialchars($_GET['city']) : null;

if (!$city) {
    echo json_encode(["error" => "City is required"]);
    exit;
}

// ---- Simulated Weather Data ----
// Normally, you'd call a real API like OpenWeatherMap here.
$weatherData = [
    "city" => $city,
    "country" => "ET", // Example: Ethiopia
    "description" => "Partly Cloudy",
    "temp" => rand(10, 35) + (rand(0, 9) / 10), // random temp with decimals
    "humidity" => rand(40, 90),
    "wind" => rand(1, 15)
];

// ---- Simulated AI Forecast ----
function simulateAI($temp, $humidity, $wind) {
    $tomorrowTemp = round($temp + (mt_rand(-15, 15) / 10), 1); // +/- 1.5 variation

    if ($tomorrowTemp > 30) {
        $condition = "Sunny & Hot";
    } elseif ($tomorrowTemp > 20) {
        $condition = "Warm & Breezy";
    } elseif ($tomorrowTemp > 10) {
        $condition = "Cool & Cloudy";
    } else {
        $condition = "Chilly or Rainy";
    }

    return "{$tomorrowTemp}°C - Likely {$condition}";
}

$weatherData["aiForecast"] = simulateAI($weatherData["temp"], $weatherData["humidity"], $weatherData["wind"]);

// Return JSON
echo json_encode($weatherData, JSON_PRETTY_PRINT);

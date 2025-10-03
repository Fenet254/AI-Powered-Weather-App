<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $city = $_GET['city'] ?? '';
    $lat = $_GET['lat'] ?? '';
    $lon = $_GET['lon'] ?? '';
    
    $apiKey = 'your_openweather_api_key';
    
    if (!empty($lat) && !empty($lon)) {
        $url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$apiKey&units=metric";
    } else if (!empty($city)) {
        $url = "https://api.openweathermap.org/data/2.5/weather?q=$city&appid=$apiKey&units=metric";
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'City or coordinates required']);
        exit;
    }
    
    $response = file_get_contents($url);
    
    if ($response === FALSE) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch weather data']);
    } else {
        echo $response;
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>



from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import joblib

import numpy as np





from pydantic import BaseModel



app = FastAPI()




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL

    allow_credentials=True,
    allow_methods=["*"],


    allow_headers=["*"],

)


WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

class WeatherRequest(BaseModel):
    latitude: float
    longitude: float




@app.get("/")
def read_root():
    return {"message": "AI-Powered Weather App Backend"}

@app.post("/current-weather")
def get_current_weather(request: WeatherRequest):
    params = {
        "latitude": request.latitude,
        "longitude": request.longitude,
        "current": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m"],
        "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m"],
        "timezone": "auto"
    }


    response = requests.get(WEATHER_URL, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch weather data")
    return response.json()

@app.post("/predict-weather")
def predict_weather(request: WeatherRequest):
    try:
        model = joblib.load("backend/model.pkl")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Model not trained yet. Please run train.py first.")

    # Get current weather data
    current_weather = get_current_weather(request)
    current_temp = current_weather["current"]["temperature_2m"]
    current_humidity = current_weather["current"]["relative_humidity_2m"]
    current_wind = current_weather["current"]["wind_speed_10m"]

    # Predict next hour temperature, humidity, and wind speed
    input_features = np.array([[current_temp, current_humidity, current_wind]])
    prediction = model.predict(input_features)[0]
    return {
        "predicted_temperature": prediction[0],
        "predicted_humidity": prediction[1],
        "predicted_wind_speed": prediction[2]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

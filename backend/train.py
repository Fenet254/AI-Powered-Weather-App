import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
import requests
import pandas as pd
from datetime import datetime, timedelta
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Function to fetch historical weather data (simulated for demo)
def fetch_historical_weather(lat, lon, days=30):
    


    dates = [datetime.now() - timedelta(days=i) for i in range(days)]
    temperatures = np.random.normal(20, 5, days)  # Mean 20°C, std 5°C
    humidities = np.random.normal(60, 10, days)  # Mean 60%, std 10%
    wind_speeds = np.random.normal(10, 3, days)  # Mean 10 km/h, std 3 km/h
    return pd.DataFrame({"date": dates, "temperature": temperatures, "humidity": humidities, "wind_speed": wind_speeds})

# Train a RandomForest model multiple times
# Predict next hour temperature, humidity, and wind speed based on current values
def train_model(num_iterations=10):
    for iteration in range(1, num_iterations + 1):
        logger.info(f"Starting training iteration {iteration}")

        # Generate synthetic training data with multiple features
        num_samples = 1000
        current_temp = np.random.rand(num_samples) * 40  # 0-40°C
        current_humidity = np.random.rand(num_samples) * 100  # 0-100%
        current_wind = np.random.rand(num_samples) * 30  # 0-30 km/h

        # Next hour values (slightly different)
        next_temp = current_temp + np.random.normal(0, 2, num_samples)
        next_humidity = current_humidity + np.random.normal(0, 5, num_samples)
        next_wind = current_wind + np.random.normal(0, 1, num_samples)

        # Features: current temp, humidity, wind
        X = np.column_stack((current_temp, current_humidity, current_wind))
        # Targets: next temp, humidity, wind
        y = np.column_stack((next_temp, next_humidity, next_wind))

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        # Evaluate on test set (R² for each target)
        y_pred = model.predict(X_test)
        r2_scores = [np.corrcoef(y_test[:, i], y_pred[:, i])[0, 1]**2 for i in range(3)]
        logger.info(f"Iteration {iteration} - R² scores: Temp: {r2_scores[0]:.2f}, Humidity: {r2_scores[1]:.2f}, Wind: {r2_scores[2]:.2f}")

    # Save the final model after all iterations
    joblib.dump(model, "backend/model.pkl")
    logger.info("Final model saved to backend/model.pkl")

if __name__ == "__main__":
    train_model()

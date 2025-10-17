import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import joblib
import requests
import pandas as pd
from datetime import datetime, timedelta

# Function to fetch historical weather data (simulated for demo)
def fetch_historical_weather(lat, lon, days=30):
    # In a real scenario, use OpenMeteo historical API or another source
    # For demo, generate synthetic data
    dates = [datetime.now() - timedelta(days=i) for i in range(days)]
    temperatures = np.random.normal(20, 5, days)  # Mean 20°C, std 5°C
    return pd.DataFrame({"date": dates, "temperature": temperatures})

# Train a simple linear regression model
# For demo, predict next hour temperature based on current
def train_model():
    # Generate synthetic training data
    X = np.random.rand(1000, 1) * 40  # Current temperatures 0-40°C
    y = X.flatten() + np.random.normal(0, 2, 1000)  # Next hour slightly different

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LinearRegression()
    model.fit(X_train, y_train)

    print(f"Model trained. R² score: {model.score(X_test, y_test):.2f}")

    # Save the model
    joblib.dump(model, "backend/model.pkl")
    print("Model saved to backend/model.pkl")

if __name__ == "__main__":
    train_model()

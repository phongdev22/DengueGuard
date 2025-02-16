import torch
import random
import requests
import numpy as np
import pandas as pd

API_URL_TEMPLATE = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{lat},{lon}/monthtodate?unitGroup=metric&include=days&key={API_KEY}&contentType=json"

def fetch_weather_data(lat, lon, api_key = "63WGNDCDAQMKHMDA785VFD3EP"):
    url = API_URL_TEMPLATE.format(lat=lat, lon=lon, API_KEY=api_key)
    print()
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if "days" in data:
            return data["days"] 
    return None

def transform_input(data: list[dict]):
    # Convert data to DataFrame
    df = pd.DataFrame(data)

    # Ensure the date column is in datetime format
    df["date"] = pd.to_datetime(df["datetime"])

    # Extract month (assuming all rows belong to the same month)
    month = df["date"].dt.month.iloc[0]  

    # Compute cyclical month features
    month_sin = np.sin(2 * np.pi * month / 12)
    month_cos = np.cos(2 * np.pi * month / 12)

    # Extract required features
    total_rainfall = df["precip"].sum()
    num_rainy_days = (df["precip"] > 0).sum()
    avg_temp = df["temp"].mean()
    min_humidity = df["humidity"].min()

    # Convert solar energy (avoid NaN issues)
    total_sunshine_hours = df["solarenergy"].fillna(0).sum() / 3.6  

    return {
        "Total_Rainfall": round(total_rainfall, 2),
        "n_raining_days": num_rainy_days,
        "Average_temperature": round(avg_temp, 2),
        "Min_Humidity": round(min_humidity, 2),  # Sửa lỗi typo: "Min_Humudity" ➝ "Min_Humidity"
        "n_hours_sunshine": round(total_sunshine_hours, 2),
        "Month_Sin": round(month_sin, 4),
        "Month_Cos": round(month_cos, 4)
    }

def make_prediction(model, transformed_data, dengue_fever_rate, scaler):
    numerical_features = pd.DataFrame([{
        "Total_Rainfall": transformed_data["Total_Rainfall"],
        "n_raining_days": transformed_data["n_raining_days"],
        "Average_temperature": transformed_data["Average_temperature"],
        "Min_Humudity": transformed_data["Min_Humudity"],
        "n_hours_sunshine": transformed_data["n_hours_sunshine"]
    }])

    month_sin_cos = np.array([
        transformed_data["Month_Sin"],
        transformed_data["Month_Cos"]
    ]).reshape(1, -1)  # Shape: (1, 2)

    # Scale numerical features
    scaled_numerical = scaler.transform(numerical_features)  

    # Concatenate scaled numerical features with unscaled cyclical features
    final_features = np.hstack((scaled_numerical, month_sin_cos))  # Shape: (1, 7)

    # Convert to PyTorch tensor
    input_tensor = torch.tensor(final_features, dtype=torch.float32)

    # Reshape to match model expectation: (batch_size, sequence_length, features)
    sequence_length = 3  # Ensure it matches model's training setup
    input_tensor = input_tensor.unsqueeze(0).repeat(1, sequence_length, 1)  # Shape: (1, 3, 7)

    # Create a placeholder tensor for x_dengue
    x_dengue = torch.full((1, sequence_length, 1), dengue_fever_rate, dtype=torch.float32)


    with torch.no_grad():
        prediction = model(input_tensor, x_dengue)  # Ensure both inputs match expected shapes

    return prediction.item()

def predict_helper(model, scaler, lat, lon) -> float:
    # xử lí call API để lấy data về dự đoán
    weather_data = fetch_weather_data(lat, lon)
    input_data = transform_input(weather_data)
    dengue_fever_rate = random.uniform(0, 500)
    result = make_prediction(model=model, transformed_data=input_data, dengue_fever_rate=dengue_fever_rate, scaler=scaler)
    return result
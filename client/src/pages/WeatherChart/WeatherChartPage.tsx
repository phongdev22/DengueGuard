import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Box } from "zmp-ui";
import PageLayout from "@components/layout/PageLayout";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";
import moment from "moment";
import { useStore } from "@store";

// Đăng ký các thành phần cần thiết cho Chart.js
Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
);
const API_KEY = "10a1fac577550d7bf175224cc6bad8ea";

const convertToCelsius = kelvin => (kelvin - 273.15).toFixed(2);

const calculateStats = (data, key) => {
    if (!data.length) return { min: 0, max: 0, avg: 0 };
    const values = data.map(item => item[key]);
    return {
        min: Math.min(...values).toFixed(2),
        max: Math.max(...values).toFixed(2),
        avg: (
            values.reduce((sum, val) => sum + val, 0) / values.length
        ).toFixed(2),
    };
};

const CustomChart = ({ data, label, color, unit }) => {
    const labels = data.map(item => moment.unix(item.dt).format("HH:mm"));

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: label,
                data: data.map(item => item.value),
                borderColor: color,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 0.5,
                pointRadius: 2,
                pointBackgroundColor: color,
                tension: 0.4, // Làm đường mượt hơn
                pointHoverRadius: 2,
            },
        ],
    };

    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" }, // TypeScript sẽ hiểu đúng kiểu
            tooltip: {
                callbacks: { label: context => `${context.raw} ${unit}` },
            },
        },
        scales: {
            x: { title: { display: true, text: "Time (HH:mm)" } },
            y: { title: { display: true, text: unit } },
        },
    };

    return <Line data={chartData} options={chartOptions} />;
};

const WeatherCard = ({ title, min, max, avg, chart }) => {
    return (
        <div className="bg-gray-200 rounded-lg p-4 shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex items-center justify-between">
                <div className="w-3/5">{chart}</div>
                <div className="text-sm">
                    <p>
                        📉 Min: <b>{min}</b>
                    </p>
                    <p>
                        🔥 Max: <b>{max}</b>
                    </p>
                    <p>
                        📊 Avg: <b>{avg}</b>
                    </p>
                </div>
            </div>
        </div>
    );
};

const WeatherChartPage = () => {
    const [weatherData, setWeatherData] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedLocation }: any = useStore();

    useEffect(() => {
        const fetchWeatherData = async (lat: number, lon: number) => {
            try {
                const response = await axios.get(
                    `https://history.openweathermap.org/data/2.5/history/city?lat=${lat}&lon=${lon}&type=hour&appid=${API_KEY}`,
                );
                if (response.data.list) {
                    const formattedData = response.data.list.map(item => ({
                        dt: item.dt,
                        temp: parseFloat(convertToCelsius(item.main.temp)),
                        humidity: item.main.humidity,
                        windSpeed: item.wind.speed,
                    }));
                    setWeatherData(formattedData);
                }
            } catch (err) {
                console.error("Error fetching weather data:", err);
                setError("Failed to load weather data.");
            } finally {
                setLoading(false);
            }
        };
        if (selectedLocation) {
            const { lat, lon, label } = selectedLocation;
            fetchWeatherData(lat, lon); // Đà Nẵng
        }
    }, []);

    const tempStats = useMemo(
        () => calculateStats(weatherData, "temp"),
        [weatherData],
    );
    const humidityStats = useMemo(
        () => calculateStats(weatherData, "humidity"),
        [weatherData],
    );
    const windStats = useMemo(
        () => calculateStats(weatherData, "windSpeed"),
        [weatherData],
    );
    return (
        <PageLayout className="!flex flex-col items-center">
            <Box className="!mt-2 !font-bold text-2xl">Weather Factors</Box>
            {loading ? (
                <p className="text-gray-600 mt-4">Loading weather data...</p>
            ) : error ? (
                <p className="text-red-600 mt-4">{error}</p>
            ) : (
                <>
                    <Box className="text-center text-gray-600 text-sm">
                        City: {selectedLocation?.label || "N/A"}
                        {"  "}Date:{" "}
                        {moment(weatherData[0]?.dt * 1000).format("DD/MM/YYYY")}
                    </Box>
                    <WeatherCard
                        title="Temperature (°C)"
                        min={tempStats.min}
                        max={tempStats.max}
                        avg={tempStats.avg}
                        chart={
                            <CustomChart
                                data={weatherData.map((d: any) => ({
                                    dt: d.dt,
                                    value: d.temp,
                                }))}
                                label="Temperature (°C)"
                                color="#ff6384"
                                unit="°C"
                            />
                        }
                    />

                    <WeatherCard
                        title="Humidity (%)"
                        min={humidityStats.min}
                        max={humidityStats.max}
                        avg={humidityStats.avg}
                        chart={
                            <CustomChart
                                data={weatherData.map((d: any) => ({
                                    dt: d.dt,
                                    value: d.humidity,
                                }))}
                                label="Humidity (%)"
                                color="#36a2eb"
                                unit="%"
                            />
                        }
                    />

                    <WeatherCard
                        title="Wind Speed (m/s)"
                        min={windStats.min}
                        max={windStats.max}
                        avg={windStats.avg}
                        chart={
                            <CustomChart
                                data={weatherData.map((d: any) => ({
                                    dt: d.dt,
                                    value: d.windSpeed,
                                }))}
                                label="Wind Speed (m/s)"
                                color="#ffce56"
                                unit="m/s"
                            />
                        }
                    />
                </>
            )}
        </PageLayout>
    );
};

export default WeatherChartPage;

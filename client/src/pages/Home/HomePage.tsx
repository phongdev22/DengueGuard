import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { HomeHeader } from "@components";
import PageLayout from "@components/layout/PageLayout";
import { Select, Modal, Box, Button, Text, Icon } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import { useStore } from "@store";

const processWeatherData = (data: any) => {
    let totalRainfall = 0;
    let nRainingDays = 0;
    let minHumidity = Infinity;
    let totalTemp = 0;
    let tempMin = Infinity;
    let tempMax = -Infinity;
    let windSpeeds = [];

    data.list.forEach((day: any) => {
        // Nhiệt độ
        totalTemp += (day.temp.min + day.temp.max) / 2;
        tempMin = Math.min(tempMin, day.temp.min);
        tempMax = Math.max(tempMax, day.temp.max);

        // Độ ẩm
        minHumidity = Math.min(minHumidity, day.humidity);

        // Gió
        // windSpeeds.push(day.speed);

        // Mưa
        if (day.rain) {
            totalRainfall += day.rain;
            nRainingDays += 1;
        }
    });

    return {
        totalRainfall,
        nRainingDays,
        averageTemperature: totalTemp / data.list.length,
        minHumidity,
        windSpeeds,
        tempMin,
        tempMax,
    };
};

const API_KEY = "10a1fac577550d7bf175224cc6bad8ea";
const locations = {
    "Miền Bắc": [
        { value: "hanoi", label: "Hà Nội", lat: 21.0285, lon: 105.8542 },
        { value: "haiphong", label: "Hải Phòng", lat: 20.8648, lon: 106.6831 },
    ],
    "Miền Trung": [
        { value: "danang", label: "Đà Nẵng", lat: 16.0544, lon: 108.2022 },
        { value: "khanhhoa", label: "Khánh Hòa", lat: 12.2388, lon: 109.1966 },
    ],
    "Tây Nguyên": [
        { value: "daklak", label: "Đắk Lắk", lat: 12.6663, lon: 108.0382 },
    ],
    "Miền Nam": [
        {
            value: "hochiminh",
            label: "TP. Hồ Chí Minh",
            lat: 10.7769,
            lon: 106.7009,
        },
        { value: "dongnai", label: "Đồng Nai", lat: 10.9453, lon: 107.4563 },
    ],
    "Đồng bằng sông Cửu Long": [
        { value: "cantho", label: "Cần Thơ", lat: 10.0452, lon: 105.7469 },
        { value: "tiengiang", label: "Tiền Giang", lat: 10.36, lon: 106.36 },
    ],
};

const weatherIcons = {
    "01d": "☀️", // Trời nắng
    "01n": "🌙",
    "02d": "⛅", // Ít mây
    "02n": "☁️",
    "03d": "☁️", // Mây rải rác
    "03n": "☁️",
    "04d": "☁️", // Nhiều mây
    "04n": "☁️",
    "09d": "🌧️", // Mưa rào
    "09n": "🌧️",
    "10d": "🌦️", // Mưa nhẹ
    "10n": "🌦️",
    "11d": "⛈️", // Dông
    "11n": "⛈️",
    "13d": "❄️", // Tuyết
    "13n": "❄️",
    "50d": "🌫️", // Sương mù
    "50n": "🌫️",
};

const Wrapper = styled.div`
    ${tw`flex flex-col p-1 mb-2`};
    width: 100%;
    &:not(:nth-child(2n)) {
        // margin-right: 12px;
    }
`;

const IconWrapper = styled.div`
    ${tw`rounded-2xl relative`};
    width: 100%;
    display: inline-flex;
    justify-content: start;
    align-items: center;
    padding: 15px 0;
    font-size: 20px;
    font-weight: bold;
    margin: 10px 20px;
`;

interface Forecast {
    day: string; // Tên ngày (Monday, Tuesday, ...)
    date: string; // Ngày + tháng (Oct 23)
    temp: string; // Nhiệt độ (20°C - 28°C)
    condition: string; // Mô tả thời tiết (Sunny with scattered clouds)
    icon: string; // Icon (⛅, ☀️, 🌧️, etc.)
}

interface Location {
    value: string;
    label: string;
    lat: number;
    lon: number;
}

const getWeatherDataByLocation = async (lat: number, long: number) => {
    console.log("Fetching weather data...");
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${long}&appid=${API_KEY}`,
        );
        const dailyForecasts = response.data.list.map(day => {
            const dateObj = new Date(day.dt * 1000);
            return {
                day: dateObj.toLocaleDateString("en-US", { weekday: "long" }), // Thứ trong tuần (Monday, Tuesday,...)
                date: dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }), // Ngày + tháng (Oct 23)
                temp: `${Math.round(day.temp.min - 273.15)}°C - ${Math.round(
                    day.temp.max - 273.15,
                )}°C`, // Nhiệt độ (Celsius)
                condition: day.weather[0].description, // Mô tả thời tiết
                icon: weatherIcons[day.weather[0].icon] || "🌡️", // Icon thời tiết phù hợp
            };
        });

        return dailyForecasts;
    } catch (error) {
        return [];
    }
};

const HomePage: React.FunctionComponent = () => {
    const { OtpGroup, Option } = Select;

    const { selectedLocation, setSelectedLocation }: any = useStore();
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupWeather, setPopupWeather] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<string>(
        selectedLocation?.value ?? "",
    );
    const [forecastData, setForecastData] = useState<Forecast[]>([]);
    const [prediction, setPrediction] = useState<string>("");

    const handleOpenModal = () => {
        setPopupVisible(!popupVisible);
    };

    const location = useMemo(
        () => Object.values(locations).flat(),
        [locations],
    );

    const currentLocation: Location | undefined = useMemo(() => {
        return location.find(({ value }) => value === selectedProvince);
    }, [location, selectedProvince]);

    const handleOpenModalMore = async () => {
        setPopupWeather(!popupWeather);
    };

    useEffect(() => {
        if (!currentLocation) {
            return;
        }

        const { lat, lon } = currentLocation;
        setSelectedLocation(currentLocation);
        getWeatherDataByLocation(lat, lon).then(forecast => {
            setForecastData(forecast);
        });
    }, [selectedProvince]);

    return (
        <PageLayout
            id="home-page"
            customHeader={<HomeHeader title="Dự đoán sốt xuất huyết" name="" />}
            className="!m-auto !px-5 !overflow-y-scroll !pb-[4rem]"
        >
            <Box className="!flex flex-col !p-5 items-center">
                <Box
                    style={{
                        marginBottom: "16px",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                    }}
                >
                    Hello, Welcome back!
                </Box>
                <Button
                    onClick={handleOpenModal}
                    style={{
                        marginBottom: "16px",
                    }}
                >
                    Choose your location?
                </Button>

                <Box className="!mb-3 !font-bold">
                    Location: {selectedLocation?.label}
                </Box>
            </Box>

            {/* Block current weahter and prediction */}
            <Wrapper className="!flex flex-col !p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <Box
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                    }}
                >
                    <Box className="!text-xl !font-bold">Weather Forecast</Box>
                    <Text
                        className="bg-green-500 text-white font-bold px-4 py-2 rounded shadow-md transition-all duration-300 ease-in- hover:bg-green-600 active:bg-green-700 focus:outline-none"
                        onClick={handleOpenModalMore}
                    >
                        More
                    </Text>
                </Box>

                <Box>
                    <IconWrapper>
                        <Box style={{ fontSize: "20px" }}>
                            {(forecastData[0] && forecastData[0].icon) ?? "🌡️"}
                        </Box>
                        <Box style={{ marginLeft: "30px" }}>
                            {(forecastData[0] && forecastData[0].temp) ??
                                "No data"}
                        </Box>
                    </IconWrapper>
                </Box>
                <Box>
                    The weather is expected to be clear and sunny throughout the
                    day with mild temperatures.
                </Box>
            </Wrapper>

            <Wrapper className="!flex flex-col !p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <Box
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                    }}
                >
                    <Box className="!text-2xl !font-bold">
                        Pandemic outbreak prediction
                    </Box>
                </Box>

                <Box>
                    <IconWrapper>
                        <Box style={{ fontSize: "20px" }}>{"🦠"}</Box>
                        <Box style={{ marginLeft: "30px" }}>{"No data"}</Box>
                    </IconWrapper>
                </Box>
                <Box>
                    Current predictions show a stable trend in pandemic cases
                    with no significant outbreaks expected.
                </Box>
            </Wrapper>

            {/* Modal choose location */}
            <Modal
                visible={popupVisible}
                title="Please choose your location"
                onClose={() => {
                    setPopupVisible(false);
                }}
                verticalActions
            >
                <Box p={3}>
                    <Select
                        label="Please choose your location"
                        helperText="Please choose your city/province"
                        placeholder="Select..."
                        closeOnSelect
                        onChange={option => {
                            setSelectedProvince(option?.toString() || "");
                        }}
                    >
                        {Object.entries(locations).map(
                            ([region, provinces]) => (
                                <OtpGroup key={region} label={region}>
                                    {provinces.map(({ value, label }) => (
                                        <Option
                                            key={value}
                                            value={value}
                                            title={label}
                                        />
                                    ))}
                                </OtpGroup>
                            ),
                        )}
                    </Select>
                </Box>

                <Box p={3}>
                    <Button
                        onClick={() => {
                            setPopupVisible(false);
                        }}
                        fullWidth
                    >
                        Confirm
                    </Button>
                </Box>
            </Modal>

            {/* popup more weather */}
            <Modal
                visible={popupWeather}
                title="More weather"
                onClose={() => {
                    setPopupWeather(false);
                }}
                verticalActions
            >
                {forecastData.map((day, index) => (
                    <div
                        key={index}
                        className="flex items-center bg-gray-100 p-3 rounded-lg mb-2"
                    >
                        <span className="text-3xl mr-4">{day.icon}</span>
                        <div>
                            <h3 className="font-medium">
                                {day.day}, {day.date}
                            </h3>
                            <p className="text-gray-600">{day.temp}</p>
                            <p className="text-gray-500 text-sm">
                                {day.condition}
                            </p>
                        </div>
                    </div>
                ))}

                <Box className="mt-[40p]">
                    <Button
                        onClick={() => {
                            setPopupWeather(false);
                        }}
                        fullWidth
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </PageLayout>
    );
};

export default HomePage;

import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { HomeHeader } from "@components";
import PageLayout from "@components/layout/PageLayout";
import { Select, Modal, Box, Button, Text, Icon } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";
import { useStore } from "@store";

const API_KEY = "10a1fac577550d7bf175224cc6bad8ea";

const locations = {
    "Miền Bắc": [
        { value: "hanoi", label: "Hà Nội", lat: 21.0285, lon: 105.8542 },
        {
            value: "quangninh",
            label: "Quảng Ninh",
            lat: 20.9475,
            lon: 107.0734,
        },
    ],
    "Miền Trung": [
        { value: "quangnam", label: "Quảng Nam", lat: 15.5736, lon: 108.474 },
        { value: "ninhthuan", label: "Ninh Thuận", lat: 11.6231, lon: 108.862 },
    ],
    "Miền Nam": [
        { value: "cantho", label: "Cần Thơ", lat: 10.0452, lon: 105.7469 },
        { value: "angiang", label: "An Giang", lat: 10.5216, lon: 105.1259 },
        { value: "baclieu", label: "Bạc Liêu", lat: 9.2941, lon: 105.7278 },
    ],
};
const locationFlat = Object.values(locations).flat();

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

const getHeatmapColor = value => {
    let hue;
    if (value <= 50) {
        // Xanh lá (120) → Vàng (60)
        hue = 120 - (value / 50) * 60;
    } else {
        // Vàng (60) → Đỏ (0)
        hue = 60 - ((value - 50) / 50) * 60;
    }
    return `hsl(${hue}, 100%, 50%)`;
};

const getWeatherDataByLocation = async (lat: number, lon: number) => {
    console.log("Fetching weather data...");
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
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

const processPredict = async (code: string, lat: number, lon: number) => {
    try {
        const response = await axios.post("http://localhost:8000/predict", {
            code,
            lat,
            lon,
        });
        console.log("Response data:", response.data);
        return response.data?.prediction ?? 0;
    } catch (error: any) {
        console.log("Error:", error.message);
        return 0;
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
    const [prediction, setPrediction] = useState<number | null>(0);

    const handleOpenModal = () => {
        setPopupVisible(!popupVisible);
    };

    const handleOpenModalMore = async () => {
        setPopupWeather(!popupWeather);
    };

    const currentLocation: Location | undefined = useMemo(() => {
        return locationFlat.find(({ value }) => value === selectedProvince);
    }, [selectedProvince]);

    useEffect(() => {
        if (!currentLocation) {
            return;
        }

        const { value, lat, lon } = currentLocation;
        setSelectedLocation(currentLocation);
        getWeatherDataByLocation(lat, lon).then(forecast => {
            setForecastData(forecast);
        });
        processPredict(value, lat, lon).then(prediction => {
            setPrediction(prediction);
        });
        return () => {};
    }, [currentLocation]);

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
                        <Box style={{ fontSize: "30px" }}>
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
                    <Box className="!text-xl !font-bold">
                        Pandemic outbreak prediction
                    </Box>
                </Box>
                <Box>
                    <IconWrapper className="!p-0">
                        <Box style={{ fontSize: "30px" }}>{"🦠"}</Box>
                        <Box
                            style={{
                                marginLeft: "30px",
                                backgroundColor: getHeatmapColor(prediction), // Màu dịu hơn
                                borderRadius: "50%", // Làm thành vòng tròn
                                width: "60px", // Kích thước hình tròn
                                height: "60px",
                                display: "flex", // Dùng Flexbox để căn giữa
                                alignItems: "center", // Căn giữa theo chiều dọc
                                justifyContent: "center", // Căn giữa theo chiều ngang
                                fontWeight: "bold",
                                fontSize: "20px",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Thêm bóng mờ nhẹ
                                textAlign: "center", // Đảm bảo chữ luôn giữa
                            }}
                        >
                            {`${prediction}%`}
                        </Box>
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

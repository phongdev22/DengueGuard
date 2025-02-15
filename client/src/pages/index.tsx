import React, { useState } from "react";
import { Route } from "react-router-dom";
import { AnimationRoutes, ZMPRouter, BottomNavigation, Icon } from "zmp-ui";
import { HomePage } from "./Home";
import { ProfilePage } from "./Profile";
import { WeatherChartPage } from "./WeatherChart";

const Routes: React.FC = () => {
    const [activeTab, setActiveTab] = useState("home");

    return (
        <ZMPRouter>
            <AnimationRoutes>
                <Route path="/" element={<HomePage />} />
                <Route path="/weather-chart" element={<WeatherChartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </AnimationRoutes>

            <BottomNavigation
                fixed
                activeKey={activeTab}
                onChange={key => setActiveTab(key)}
            >
                <BottomNavigation.Item
                    key="chat"
                    label="Home"
                    icon={<Icon icon="zi-home" />}
                    linkTo="/"
                />
                <BottomNavigation.Item
                    key="weather"
                    label="Weather"
                    icon={<Icon icon="zi-location-solid" />}
                    linkTo="/weather-chart"
                />
                <BottomNavigation.Item
                    key="profile"
                    label="Profile"
                    icon={<Icon icon="zi-user-circle" />}
                    linkTo="/profile"
                />
            </BottomNavigation>
        </ZMPRouter>
    );
};

export default Routes;

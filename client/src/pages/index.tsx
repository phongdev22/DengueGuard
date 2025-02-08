import React, { useState } from "react";
import { Route } from "react-router-dom";
import { AnimationRoutes, ZMPRouter, BottomNavigation, Icon } from "zmp-ui";

import {
    FeedbackPage,
    FeedbackDetailPage,
    CreateFeedbackPage,
} from "./Feedback";
import { GuidelinesPage } from "./Guidelines";
import { HomePage } from "./Home";
import { InformationGuidePage } from "./InformationGuide";
import { CreateScheduleAppointmentPage } from "./CreateScheduleAppointment";
import { AppointmentScheduleResultPage } from "./AppointmentScheduleResult";
import { SearchPage } from "./Search";
import { ProfilePage } from "./Profile";

const Routes: React.FC = () => {
    const [activeTab, setActiveTab] = useState("home");

    return (
        <ZMPRouter>
            <AnimationRoutes>
                <Route path="/" element={<HomePage />} />
                <Route path="/guidelines" element={<GuidelinesPage />} />

                <Route path="/feedbacks" element={<FeedbackPage />} />
                <Route path="/feedbacks/:id" element={<FeedbackDetailPage />} />
                <Route
                    path="/create-feedback"
                    element={<CreateFeedbackPage />}
                />
                <Route
                    path="/create-schedule-appointment"
                    element={<CreateScheduleAppointmentPage />}
                />
                <Route
                    path="/schedule-appointment-result"
                    element={<AppointmentScheduleResultPage />}
                />
                <Route
                    path="/information-guide"
                    element={<InformationGuidePage />}
                />
                <Route path="/search" element={<SearchPage />} />
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
                    linkTo="/weather"
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

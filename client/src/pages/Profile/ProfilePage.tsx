import PageLayout from "@components/layout/PageLayout";
import React, { FC, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "zmp-ui";
import { useStore } from "@store";
import ProfileInfo from "./ProfileInfo";

const ProfilePage: FC = () => {
    // const { profile, getProfile } = useStore();
    // const [searchParams] = useSearchParams();
    // const id = searchParams.get("id");
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (!id) {
    //         navigate("/", { animate: false, replace: true });
    //     } else {
    //         getProfile({ id });
    //     }
    // }, [id]);

    const profile = {
        id: "8745632",
        name: "Alex Johson",
        avatar: "https://i.pinimg.com/550x/bc/17/4e/bc174e193f9b0fa89655adcbdd6bb5f1.jpg",
    };

    return (
        <PageLayout bg="white" title="Profile">
            {profile && <ProfileInfo profile={profile} />}
        </PageLayout>
    );
};

export default ProfilePage;

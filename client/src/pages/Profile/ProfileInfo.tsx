import React, { FC } from "react";
import { Profile } from "@dts";
import { Box, Page, Avatar, Text } from "zmp-ui";

export type ProfileInfoProps = {
    profile: Profile;
};

const ProfileInfo: FC<ProfileInfoProps> = props => {
    const { profile } = props;
    const { id, name, recentLocation, avatar } = profile;
    return (
        <Page>
            {/* Thông tin cá nhân */}
            <Box className="!flex flex-col justify-center items-center !p-3">
                <Avatar src={avatar} size={80} />
                <Text className="!text-xl !font-bold !my-2 !text-[24px]">
                    {name}
                </Text>
                <Text className="!text-gray-500 !font-bold">ID: {id}</Text>
            </Box>

            {/* Danh sách thông tin */}
            {/* Activity Overview */}
            <Box className="!p-3 !mt-6 !mb-4 !bg-blue-100 !rounded-lg !mx-5 !shadow-xl">
                <Text size="large" className="!text-[16px] !font-bold">
                    Activity Overview
                </Text>
                <Box className="!mt-2">
                    <Text size="small" className="!text-gray-700 !font-bold">
                        Recent Locations Checked:
                    </Text>
                    <Text size="small" className="!text-gray-700 !font-bold">
                        No recent locations
                    </Text>
                </Box>
            </Box>

            {/* Privacy Policy */}
            <Box className="!p-3 !mt-4 !bg-indigo-100 !rounded-lg !mx-5 !shadow-xl">
                <Text size="large" className="!text-[16px] !font-bold">
                    Privacy Policy
                </Text>
                <Box className="!mt-2">
                    <Text size="small" className="!text-gray-700 !font-bold">
                        Our app respects your privacy. We do not store any
                        personal data without your consent. For more details,
                        please review our full policy.
                    </Text>
                </Box>
            </Box>
        </Page>
    );
};

export default ProfileInfo;

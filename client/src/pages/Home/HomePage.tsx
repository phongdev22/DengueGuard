import React, { useState } from "react";
import { HomeHeader, Utinities, ListOA, NewsSection } from "@components";
import PageLayout from "@components/layout/PageLayout";
import { APP_UTINITIES } from "@constants/utinities";
import { useStore } from "@store";
import { Text, Select, Modal, Box, Button } from "zmp-ui";
import Contacts from "./Contacts";
import Procedures from "./Procedures";

const locations = {
    "Miền Bắc": [
        { value: "hanoi", label: "Hà Nội" },
        { value: "haiphong", label: "Hải Phòng" },
    ],
    "Miền Trung": [
        { value: "danang", label: "Đà Nẵng" },
        { value: "khanhhoa", label: "Khánh Hòa" },
    ],
    "Tây Nguyên": [{ value: "daklak", label: "Đắk Lắk" }],
    "Miền Nam": [
        { value: "hochiminh", label: "TP. Hồ Chí Minh" },
        { value: "dongnai", label: "Đồng Nai" },
    ],
    "Đồng bằng sông Cửu Long": [
        { value: "cantho", label: "Cần Thơ" },
        { value: "tiengiang", label: "Tiền Giang" },
    ],
};

const HomePage: React.FunctionComponent = () => {
    const [organization] = useStore(state => [
        state.organization,
        state.getOrganization,
    ]);

    const { OtpGroup, Option } = Select;
    const [popupVisible, setPopupVisible] = useState(true);
    const [selectedProvince, setSelectedProvince] = useState("");

    return (
        <PageLayout
            id="home-page"
            customHeader={
                <HomeHeader
                    title="Dự đoán sốt xuất huyết"
                    name={organization?.name || ""}
                />
            }
            style={{
                margin: "0 auto",
            }}
        >
            <Utinities utinities={APP_UTINITIES} />
            {/* <ListOA /> */}
            {/* <Contacts /> */}
            {/* <Procedures /> */}
            {/* <NewsSection /> */}

            <Modal
                visible={popupVisible}
                title="Please choose your location"
                onClose={() => {
                    setPopupVisible(false);
                }}
                verticalActions
                // description="This is a very long message that can be displayed in 3 lines"
            >
                <Box p={3}>
                    <Select
                        label="Please choose your location"
                        helperText="Please choose your city/province"
                        placeholder="Select..."
                        defaultValue={[]}
                        closeOnSelect
                        onChange={value => {
                            setSelectedProvince(value?.toString() || "");
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
                        Xác nhận
                    </Button>
                </Box>
            </Modal>
        </PageLayout>
    );
};

export default HomePage;

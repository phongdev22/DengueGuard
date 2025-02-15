import React, { FunctionComponent } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Background from "@assets/background.png";
import UtinityItem, { UtinityItemProps } from "./UtilityItem";
import { Box, Button } from "zmp-ui";
interface UtinitiesProps {
    utinities: (UtinityItemProps & { key: string })[];
    openModal: any;
    currentLocation: any | null;
    currentWeather: any | null;
}

const UtinitiesWrapper = styled.div`
    ${tw`flex flex-row flex-wrap justify-between bg-ui_bg bg-center bg-no-repeat`};
    background-image: url(${Background});
    padding: 16px;
    padding-top: 24px;
`;
const Utinities: FunctionComponent<UtinitiesProps> = props => {
    const { utinities, openModal, currentLocation, currentWeather } = props;
    return (
        <UtinitiesWrapper
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "start",
                height: "100%",
            }}
        >
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
                onClick={openModal.modalLocation}
                style={{
                    marginBottom: "16px",
                }}
            >
                Choose your location?
            </Button>

            <Box className="!mb-3">
                Current location: {currentLocation["label"]}
            </Box>

            {utinities.map(item => {
                const { key, ...utinity } = item;
                return (
                    <UtinityItem
                        key={key}
                        {...utinity}
                        handleOpenMore={openModal.modalMore}
                    />
                );
            })}
        </UtinitiesWrapper>
    );
};

export default Utinities;

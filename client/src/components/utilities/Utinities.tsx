import React, { FunctionComponent } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import Background from "@assets/background.png";
import UtinityItem, { UtinityItemProps } from "./UtilityItem";

interface UtinitiesProps {
    utinities: UtinityItemProps & { key: string }[];
}

const UtinitiesWrapper = styled.div`
    ${tw`flex flex-row flex-wrap justify-between bg-ui_bg bg-center bg-no-repeat`};
    background-image: url(${Background});
    padding: 16px;
    padding-top: 24px;
`;
const Utinities: FunctionComponent<UtinitiesProps> = props => {
    const { utinities } = props;
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
            <div
                style={{
                    marginBottom: "16px",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                }}
            >
                Hello, Welcome back!
            </div>

            {utinities.map(item => {
                const { key, ...utinity } = item;
                return <UtinityItem key={key} {...utinity} />;
            })}
        </UtinitiesWrapper>
    );
};

export default Utinities;

/* eslint-disable react/no-unused-prop-types */
import React, { FunctionComponent } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { Text, Box, useNavigate } from "zmp-ui";

import WithItem from "./WithItemClick";

export interface UtinityItemProps {
    label?: string;
    icon?: React.ElementType<any>;
    icon_v2?: string;
    path?: string;
    onClick?: any;
    buttonMore?: boolean;
    inDevelopment?: boolean;
    phoneNumber?: string;
    link?: string;
    content?: string;
    description?: string;
    handleOpenMore?: () => void;
    handleClickUtinity?: ({
        inDevelopment,
        path,
        phoneNumber,
        link,
    }: {
        inDevelopment?: boolean | undefined;
        path?: string | undefined;
        phoneNumber?: string | undefined;
        link?: string | undefined;
    }) => void;
}

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
    height: 95px;
    margin: 0 20px;
`;

const UtinityItem: FunctionComponent<UtinityItemProps> = props => {
    const {
        icon: Icon,
        label,
        description,
        content,
        handleOpenMore,
        handleClickUtinity,
    } = props;

    const handleClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.preventDefault();
        // handleClickUtinity?.(props);
    };

    return (
        <Wrapper
            onClick={handleClick}
            style={{
                cursor: "pointer",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "16px",
                backgroundColor: "#fff",
            }}
        >
            <Box
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                }}
            >
                <span>{label}</span>
                {props.buttonMore && (
                    <Text
                        style={{
                            border: "none",
                            backgroundColor: "green",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.3s ease-in-out",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                            outline: "none",
                        }}
                        onClick={handleOpenMore}
                    >
                        More
                    </Text>
                )}
            </Box>
            {/* {Icon && (
                <IconWrapper>
                    <CenterIcon>
                        <Icon />
                    </CenterIcon>
                </IconWrapper>
            )} */}
            <Box>
                {Icon && (
                    <IconWrapper>
                        <div style={{ fontSize: "50px" }}>{props.icon_v2}</div>
                        <Box style={{ marginLeft: "30px" }}>{content}</Box>
                    </IconWrapper>
                )}
            </Box>
            <Box>{description}</Box>
        </Wrapper>
    );
};

export default WithItem(UtinityItem);

import React from "react";
import Header from "../components/header";
import { Button, Row, Container } from "react-bootstrap";
import { MdOndemandVideo } from "react-icons/md";
import { TbVideo } from "react-icons/tb";
import { FaPhotoVideo } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import HelpOutlineTwoToneIcon from "@mui/icons-material/HelpOutlineTwoTone";
import Modal from "./modal";

function ModeSelector(props) {
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const flag = "modeSelector";

    const iconStyle = {
        width: "50pt",
        height: "50pt",
        color: "#ffffff",
        marginTop: "30pt",
        marginBottom: "10pt",
    };

    const cardStyle = {
        height: "12rem",
        width: "16rem",
        marginLeft: "30pt",
        marginRight: "30pt",
        borderRadius: "10pt",
        fontSize: "15pt",
    };

    const containerStyle = {
        width: "100%",
        marginTop: "15rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const style = {
        buttonStyle: {
            position: "absolute",
            right: "10%",
            top: "10%",
        },
    };

    return (
        <>
            <Header />
            <Modal flag={flag} isShow={modalIsOpen} closeCallback={() => setIsOpen(false)} />

            <div>
                <IconButton
                    aria-label="delete"
                    size="large"
                    color="primary"
                    style={style.buttonStyle}
                    onClick={() => setIsOpen(true)}
                >
                    <HelpOutlineTwoToneIcon fontSize="inherit" />
                </IconButton>
                <Container style={containerStyle}>
                    <Row>
                        <Button style={cardStyle} href="/viewer">
                            <MdOndemandVideo style={iconStyle} />
                            <br />
                            실시간 영상 시청
                        </Button>

                        <Button style={cardStyle} href="/master">
                            <TbVideo style={iconStyle} />
                            <br />
                            웹캠 등록
                        </Button>

                        <Button style={cardStyle} href="/recorder">
                            <FaPhotoVideo style={iconStyle} />
                            <br />
                            녹화영상
                        </Button>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default ModeSelector;

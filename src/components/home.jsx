import React from "react";
import Header from "./header";
import { Button, Row, Container, Card } from "react-bootstrap";
import { getCookie } from "../lib/cookie";

function Home(props) {
    const buttonStyle = {
        // color:"black",
        // backgroundColor:"#00000000",
        borderColor: "#fff",
        marginLeft: "45%",
        marginTop: "10%",
    };

    const iconStyle = {
        width: "30pt",
        height: "30pt",
        marginTop: "15pt",
        marginLeft: "15pt",
    };

    const cardStyle = {
        width: "18rem",
        marginLeft: "30pt",
        backgroundColor: "#00000003",
        marginRight: "30pt",
        marginTop: "70pt",
        marginBottom: "-10pt",
    };

    const handleOnClickStart = () => {
        if (getCookie("access")) {
            window.location.href = "/login";
        } else {
            window.location.href = "/modeSelector";
        }
    };

    return (
        <>
            <Header />
            <img alt="main" src="img/home_main_picture.jpg" width="100%" />
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "30%",
                    transform: "translate(-50%,-50%)",
                    // textAlign:"center"
                }}
            >
                <h1>노트북 웹캠으로 반려견의 하루를 관찰하세요</h1>
                <Button style={buttonStyle} onClick={handleOnClickStart}>
                    시작하기
                </Button>
            </div>

            <div>
                <Container style={{ marginBottom: "170pt", width: "100%" }}>
                    <Row>
                        <Card style={cardStyle}>
                            <Card.Img variant="top" src="img/laptop.png" style={iconStyle} />
                            <Card.Body>
                                <Card.Title>노트북을 홈캠으로</Card.Title>
                                <Card.Text>
                                    노트북에 내장된 웹카메라만 있다면 이젠 노트북을 홈 CCTV로 사용할 수 있습니다.
                                </Card.Text>
                            </Card.Body>
                        </Card>

                        <Card style={cardStyle}>
                            <Card.Img variant="top" src="img/globe.png" style={iconStyle} />
                            <Card.Body>
                                <Card.Title>간편한 웹 환경</Card.Title>
                                <Card.Text>
                                    별도의 어플리케이션이나 프로그램 설치 없이 웹으로 간편하게 시청할 수 있습니다.
                                </Card.Text>
                            </Card.Body>
                        </Card>

                        <Card style={cardStyle}>
                            <Card.Img variant="top" src="img/cloud-download-alt.png" style={iconStyle} />
                            <Card.Body>
                                <Card.Title>녹화된 영상 확인하기</Card.Title>
                                <Card.Text>자동으로 녹화된 반려동물의 영상을 편리하게 확인할 수 있습니다</Card.Text>
                            </Card.Body>
                        </Card>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default Home;

import React, { useEffect } from "react";
import { slide as Menu } from "react-burger-menu";
import Button from "react-bootstrap/Button";
import { getCookie, removeCookie } from "../lib/cookie";

function Header(props) {
    const currentCookie = getCookie("access");
    const currentCookie2 = getCookie("refresh");

    useEffect(() => {
        if (currentCookie)
            fetch(process.env.REACT_APP_PROXY_HOST + "/auth", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: currentCookie,
                    refresh: currentCookie2,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.statusCode !== 200) {
                        alert("로그인이 만료되었습니다. 다시 로그인해 주세요");
                        removeCookie("access");
                        removeCookie("refresh");
                        window.location.href = "/";
                    }
                })
                .catch((e) => console.log(e));
        // eslint-disable-next-line
    }, []);

    const menuStyle = {
        backgroundColor: "#0d6efd",
        border: "0pt",
        height: "60px",
        marginLeft: "20px",
        padding: "0",
    };

    const menuStyle1 = {
        backgroundColor: "#0d6efd",
        border: "0pt",
        float: "right",
        height: "60px",
        marginRight: "70px",
        cursor: "pointer",
        hover: {
            textDecoration: "underline",
        },
    };

    const menuStyle2 = {
        backgroundColor: "#0d6efd",
        border: "0",
        float: "right",
        height: "60px",
    };

    let loginButton;
    if (currentCookie) {
        loginButton = (
            <Button
                style={menuStyle1}
                onClick={() => {
                    removeCookie("access");
                    removeCookie("refresh");
                    window.location.href = "/";
                }}
            >
                로그아웃
            </Button>
        );
    } else {
        loginButton = (
            <Button
                style={menuStyle1}
                onClick={() => {
                    window.location.href = "/login";
                }}
            >
                로그인
            </Button>
        );
    }

    let registerButton;
    if (currentCookie !== "undefined") {
        registerButton = <></>;
    } else {
        registerButton = (
            <Button
                style={menuStyle2}
                onClick={() => {
                    window.location.href = "/register";
                }}
            >
                회원가입
            </Button>
        );
    }

    return (
        <div
            style={{
                width: "100%",
                height: "60px",
                top: "0%",
                backgroundColor: "#0d6efd",
                position: "fixed",
                zIndex: "100",
            }}
        >
            <div>
                <Button
                    style={menuStyle}
                    onClick={() => {
                        window.location.href = "/";
                    }}
                >
                    <img alt="logo" src="img/logo.png" style={{ height: "60px", top: "0px" }} />
                </Button>
                {loginButton}
                {registerButton}
            </div>
            <Menu right>
                <a id="home" className="menu-item" href="/">
                    홈
                </a>
                <a id="viewer" className="menu-item" href="/viewer">
                    실시간 영상 시청
                </a>
                <a id="webcam" className="menu-item" href="/master">
                    웹캠 등록
                </a>
                <a id="recoder" className="menu-item" href="/recorder">
                    녹화영상 확인
                </a>
            </Menu>
        </div>
    );
}

export default Header;

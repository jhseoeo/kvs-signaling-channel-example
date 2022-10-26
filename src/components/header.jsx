import React, { useState } from 'react'
import { slide as Menu } from 'react-burger-menu'
import Button from 'react-bootstrap/Button';


function Header(props) {
    const menuStyle = {
        backgroundColor:"#0055FF",
        border:"0pt",
        height:"60px",
        marginLeft:"50px",
    }

    const menuStyle1 = {
        backgroundColor:"#0055FF",
        border:"0pt",
        float:"right",
        height:"60px",
        marginRight:"70px",
    }

    const menuStyle2 = {
        backgroundColor:"#0055FF",
        border:"0",
        float:"right",
        height:"60px",
    }

    return (
        <div style={{
            width:"100%",
            height:"60px",
            top:"0%",
            backgroundColor:"#0055FF",
            position:"fixed",
            zIndex:"100"
        }}>
            <div>
                <Button style={menuStyle} onClick={() => {window.location.href = "/";}}>Home</Button>
                <Button style={menuStyle1} onClick={() => {window.location.href = "/login";}}>로그인</Button>
                <Button style={menuStyle2} onClick={() => {window.location.href = "/register";}}>회원가입</Button>
            </div>
            <Menu right>
                <a id="home" className="menu-item" href="/">홈</a>
                <a id="viewer" className="menu-item" href="/viewer/channel-button">실시간 영상 시청</a>
                <a id="webcam" className="menu-item" href="/recorder">웹캠으로 설정</a>
                <a id="recoder" className="menu-item" href="/recorder">녹화영상 확인</a>
            </Menu>
        </div>
    )
}

export default Header;

import React, { useState } from 'react'
import Header from "../components/header"
import { Button, Row, Container, Card } from "react-bootstrap";
import { MdOndemandVideo } from "react-icons/md"
import { TbVideo } from "react-icons/tb"
import { FaPhotoVideo } from "react-icons/fa"

function ModeSelector(props) {
    const iconStyle = {
        width:"50pt",
        height:"50pt",
        color:"#ffffff",
        marginTop:"30pt",
        marginBottom:"10pt"
    }

    const cardStyle = {
        height:"12rem",
        width: '16rem',
        marginLeft:"30pt", 
        marginRight:"30pt",
        borderRadius:"10pt",
        fontSize:"15pt"
    }

    const containerStyle = {
        width:"100%",
        marginTop:"15rem",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const titleStyle = {
        color:"#ffffff"
    }


    return (
        <>
            <Header/>
            <div>
                <Container style={containerStyle}>
                    <Row>
                        <Button style={cardStyle} href="/viewer">
                        <MdOndemandVideo style={iconStyle}/><br/>실시간 영상 시청하기
                        </Button>
                        
                        <Button style={cardStyle} href="/master">
                            <TbVideo style={iconStyle} /><br/>웹캠 설정하기
                        </Button>

                        <Button style={cardStyle} href="/recorder">
                            <FaPhotoVideo style={iconStyle} /><br/>녹화영상 확인하기
                        </Button>
                </Row>
            </Container>
                

            </div>
        </>
    )
}

export default ModeSelector;

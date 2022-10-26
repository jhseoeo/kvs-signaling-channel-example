import React, { useState } from 'react'
import Header from "../components/header"

function ModeSelector(props) {
    return (
        <>
            <Header/>
            <div style={{
                position:"absolute",
                top:"50%",
                right:"50%",
                transform:"translate(50%, -50%)"
            }}>
                <button
                    className="mode-button"
                    type="button"
                    onClick={() => {
                        window.location.href = "/viewer/channel-button";
                    }}
                >
                    실시간 영상 시청하기                
                </button>
                <br />
                <button
                    className="mode-button"
                    type="button"
                    onClick={() => {
                        window.location.href = "/recorder";
                    }}
                >                
                    웹캠으로 설정하기
                </button>
                <br />
                <button
                    className="mode-button"
                    type="button"
                    onClick={() => {
                        window.location.href = "/recorder";
                    }}
                >
                    녹화영상 확인하기
                </button>            
            </div>
        </>
    )
}

export default ModeSelector;

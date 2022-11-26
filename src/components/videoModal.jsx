import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from "react";
import React from 'react'
import ReactPlayer from 'react-player'

export default function VideoModal(props) {
    const styleSheets = {
        
    }

    useEffect(() => {
        if (props.clipId && props.recordId) {
            // getclips() 호출 
            fetch(props.url, { method: 'GET' })
            .then(res => {
                console.log(res)
                return res.blob();
            })
            .catch(err => console.log(err))
        }
        
    })

    return (
        <Modal
            show={props.showModal}
            onHide={props.handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton />
            <Modal.Body>
                <ReactPlayer url={props.url} />
            </Modal.Body>
        </Modal>
    );
}


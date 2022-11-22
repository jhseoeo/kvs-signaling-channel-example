import CloseButton from 'react-bootstrap/CloseButton';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect } from "react";

export default function MyVerticallyCenteredModal(props) {
    const styleSheets = {
        footerStyle: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }

    
    const [showModal, setShowModal] = useState(false);
    const VISITED = localStorage.getItem(`visited_${props.flag}`);

    const handleClose = () => {
        setShowModal(false)
        props.closeCallback()
    }

    useEffect(() => {
        const handleShowModal = () => {
            if (VISITED) {
                return;
            }

            if (!VISITED) {
                setShowModal(true);
                console.log(`props.key ${props.flag} ${props.isShow}`)
                localStorage.setItem(`visited_${props.flag}`, NaN);
            }
        };

        handleShowModal()
    }, [VISITED]);

    return (
        <Modal
            // {...props}
            show={showModal || props.isShow}
            onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Modal title
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Carousel variant="dark" slide={false}>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src='img/home_main_picture.jpg'
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src='img/home_main_picture.jpg'
                            alt="Second slide"
                        />

                        <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src='img/home_main_picture.jpg'
                            alt="Third slide"
                        />

                        <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </Modal.Body>
        </Modal>
    );
}


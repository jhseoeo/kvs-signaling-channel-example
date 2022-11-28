import CloseButton from 'react-bootstrap/CloseButton';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect } from "react";
import { modalClasses } from '@mui/material';

export default function MyVerticallyCenteredModal(props) {
    const styleSheets = {
        footerStyle: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }


    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState([{
        contentTitle: "",
        mainContent:"",
        img:"",
    }]);
    const VISITED = localStorage.getItem(`visited_${props.flag}`);

    const handleClose = () => {
        console.log(modalContent)
        setShowModal(false)
        props.closeCallback()
    }

    

    useEffect(() => {

        const handleShowModal = () => {
            if (VISITED) {
                console.log(`dtoList1 ${props.dtoList}`)
                return;
            }

            if (!VISITED) {
                console.log(`dtoList ${props.dtoList}`)
                setModalContent(props.dtoList)
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
                <Modal.Title id="contained-modal-title-vcenter"/>
            </Modal.Header>
            <Modal.Body>
                <Carousel variant="dark" slide={false}>              
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src='img/puppy1.jpeg'
                            style={{marginBottom:"160px", width:"10rem", height:"24rem"}}
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h3>웹캠을 등록하세요!</h3>
                            <p>"웹캠 등록"에서 카메라를 먼저 설정해야 합니다</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src='img/laptop1.jpeg'
                            style={{marginBottom:"160px", width:"10rem", height:"24rem"}}
                            alt="First slide"
                        />

                        <Carousel.Caption>
                            <h3>노트북을 설치해주세요!</h3>
                            <p>카메라가 잘 찍을 수 있게 노트북을 고정해주세요</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src='img/puppy2.jpeg'
                            style={{marginBottom:"160px", width:"10rem", height:"24rem"}}
                            alt="First slide"
                        />

                        <Carousel.Caption>
                            <h3>이제 시작할 수 있어요!</h3>
                            <p>
                                실시간 영상 시청이 가능합니다
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </Modal.Body>
        </Modal>
    );
}


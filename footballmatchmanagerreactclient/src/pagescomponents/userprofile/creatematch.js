import "./../../css/creatematch.css"
import { Form, Modal, ModalFooter, Row } from "react-bootstrap";

export default function CreateMatch(props) {

    function createMatch() {

    }

    return (
        <Modal show={props.show}
            onHide={props.onHide}
            centered>

            <Modal.Header closeButton>
                <Modal.Title>
                    Создать матч
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={createMatch}>
                    <Row className="input-container">
                        <input className="input-style"
                            type="text"
                            placeholder="Введите название матча" />
                    </Row>
                    <Row className="input-container">
                        <input className="input-style"
                            type="text"
                            placeholder="Введите дату матча" />
                    </Row>
                    <Row className="input-container">
                        <input className="input-style"
                            type="text"
                            placeholder="Введите формат матча" />
                    </Row>
                    <Row className="input-container w-100">
                        <input className="input-style"
                            type="text"
                            placeholder="Введите адрес матча" />
                    </Row>
                    <Row className="w-100">
                        <input className="input-button-style" type="button" value="Создать" />
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
}
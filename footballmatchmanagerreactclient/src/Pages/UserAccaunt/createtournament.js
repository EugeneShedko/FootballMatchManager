import "./../../css/CreateGame.css"
import { Form, Modal, ModalFooter, Row } from "react-bootstrap";

export default function CreateTournament(props) {
    return (
        <Modal show={props.show}
            onHide={props.onHide}
            centered>

            <Modal.Header closeButton>
                <Modal.Title>
                    Создать турнир
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="input-container">
                        <input className="input-style" 
                               type="text" 
                               placeholder="Введите название турнира" />
                    </Row>
                    <Row className="input-container">
                        <input className="input-style" 
                               type="text" 
                               placeholder="Введите дату турнира" />
                    </Row>
                    <Row className="input-container">
                        <input className="input-style" 
                               type="text" 
                               placeholder="Введите формат матчей" />
                    </Row>
                    <Row className="input-container w-100">
                        <input className="input-style" 
                               type="text" 
                               placeholder="Введите адрес турнира" />
                    </Row>
                    <Row className="input-container w-100">
                        <input className="input-style" 
                               type="text" 
                               placeholder="Введите количество участников" />
                    </Row>
                </Form>
            </Modal.Body>
            <ModalFooter>
                <Row className="w-100">
                    <input className="input-button-style" type="button" value="Создать" />
                </Row>
            </ModalFooter>
        </Modal>
    );
}
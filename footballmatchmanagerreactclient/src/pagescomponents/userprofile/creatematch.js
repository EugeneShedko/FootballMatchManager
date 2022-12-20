import "./../../css/creatematch.css"
import { Modal, Row } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {Context} from "./../../index"

export default function CreateMatch(props) {

    const {user} = useContext(Context);

    const [matchState, setMatchState] = useState({
        userId: 0,
        gameName: "",
        gameAdress: "",
        gameDate: new Date(),
        gameFormat: ""
    }
    );

    function createMatch() {

        const match = {
            UserId  : user.getUserId,
            GameName: matchState.gameName,
            GameAdress: matchState.gameAdress,
            GameDate: matchState.gameDate,
            GameFormat: matchState.gameFormat
        }

        axios.post('https://localhost:7277/api/profile/creatematch', match, { withCredentials: true })
            .then((response) => {
                toast.success(response.data, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                })
                props.onHide(false);
            })
            .then(() => {
                axios.get('https://localhost:7277/api/profile/allmatches', { withCredentials: true })
                .then((response) => {
                    props.setAllMatches(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        toast.error("Ошибка получения матчей",
                            {
                                position: toast.POSITION.TOP_CENTER,
                                autoClose: 2000,
                                pauseOnFocusLoss: false
                            });
                    }
                });
            })
            .catch(userError => {
                if (userError.response) {
                   toast.error("Ошибка создания матча", 
                      {
                      position: toast.POSITION.TOP_CENTER,
                      autoClose: 2000,
                      pauseOnFocusLoss: false
                   });
                }
             });    
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
                    <Row className="input-container">
                        <input className="input-style"
                            type="text"
                            placeholder="Введите название матча"
                            onChange={(name) => { setMatchState({ ...matchState, gameName: name.target.value }) }}
                        />
                    </Row>
                    <Row className="input-container">
                        <ReactDatePicker className="input-style"
                            type="text"
                            selected={matchState.gameDate}
                            placeholder="Введите дату матча"
                            onChange={(date: Date) => { setMatchState({ ...matchState, gameDate: date }) }}
                        />
                    </Row>
                    {/*Здесь должен быть выбор, задать пока что статически*/}
                    <Row className="input-container">
                        <select className="input-style"
                            onChange={(format) => { setMatchState({ ...matchState, gameFormat: format.target.value }) }}
                        >
                            <option selected>Укажите формат матча</option>
                            <option>5x5</option>
                            <option>9x9</option>
                            <option>11x11</option>
                        </select>
                    </Row>
                    <Row className="input-container w-100">
                        <input className="input-style"
                            type="text"
                            placeholder="Введите адрес матча"
                            onChange={(adress) => { setMatchState({ ...matchState, gameAdress: adress.target.value }) }}
                        />
                    </Row>
                    <Row className="w-100">
                        <input className="input-button-style" type="button" value="Создать" onClick={createMatch} />
                    </Row>
            </Modal.Body>
        </Modal>
    );
}
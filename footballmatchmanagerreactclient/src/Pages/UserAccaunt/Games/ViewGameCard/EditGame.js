import { Modal, Row } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../../../index";

import "./../../../../css/CreateGame.css";
import { useLocation, useNavigate } from "react-router-dom";
import { TO_GAME_CARD } from "../../../../Utilts/Consts";

export default function EditGame(props) {

    const {userContext} = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const [gameInfo, setGameInfo] = useState({
        gameId: location.state.gameId,
        gameName: location.state.gameName,
        gameDate: location.state.gameDate,
        gameFormat: location.state.gameFormat,
        gameAdress: location.state.gameAdress
    });

    function saveChanges()
    {

        const match = {
            UserId: userContext.userId,
            GameId: gameInfo.gameId,
            GameName: gameInfo.gameName,
            GameAdress: gameInfo.gameAdress,
            GameDate: gameInfo.gameDate,
            GameFormat: gameInfo.gameFormat,
            GameType: ""
        }

        axios.post('http://localhost:5004/api/profile/edit-game', match, { withCredentials: true })
        .then((response) => {
            toast.success(response.data.message,
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });

            navigate(TO_GAME_CARD + '/' + gameInfo.gameId);    
            /* Убрать запрос на сервере для получения инфы матча!!!! */ 
        })
        .catch(userError => {
            if (userError.response) {
                toast.error(userError.response.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });  
            }
        });
    }

    // ------------------------------------------------------------------------------------------ //

    return (
        <Modal show={props.show}
            onHide={() => navigate(TO_GAME_CARD + '/' + gameInfo.gameId)}
            centered>

            <Modal.Header closeButton>
                <Modal.Title>
                    Редактирование матча
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="input-container">
                    <input className="input-style"
                        type="text"
                        placeholder="Нименование матча"
                        value={gameInfo.gameName}
                        onChange={(e) => {setGameInfo({ ...gameInfo, gameName: e.target.value }) }}
                    />
                </Row>
                <Row className="input-container">
                    <ReactDatePicker className="input-style"
                        selected={gameInfo.gameDate}
                        onChange={(date: Date) => {setGameInfo({ ...gameInfo, gameDate: date }) }}
                    />
                </Row>
                {/*Здесь должен быть выбор, задать пока что статически*/}
                <Row className="input-container">
                    <select className="input-style"
                        value={gameInfo.gameFormat}
                        onChange={(e) => {setGameInfo({ ...gameInfo, gameFormat: e.target.value }) }}
                    >
                        <option>5x5</option>
                        <option>9x9</option>
                        <option>11x11</option>
                    </select>
                </Row>
                <Row className="input-container w-100">
                    <input className="input-style"
                        type="text"
                        placeholder="email"
                        value={gameInfo.gameAdress}
                        onChange={(e) => {setGameInfo({...gameInfo, gameAdress: e.target.value }) }}
                    />
                </Row>
                <Row className="w-100">
                    <input className="input-button-style" 
                           type="button" 
                           value="Сохранить" 
                           onClick={saveChanges} />
                </Row>
            </Modal.Body>
        </Modal>
    );
}
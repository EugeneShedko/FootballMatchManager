import { Modal, Row } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../../index";
import { useLocation, useNavigate } from "react-router-dom";
import DateTime from 'react-datetime';
//import 'react-datetime/css/react-datetime.css';

import "react-datepicker/dist/react-datepicker.css";
import "./../../../css/CreateGame.css"
import { TO_GAMES } from "../../../Utilts/Consts";

export default function CreateMatch(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const { userContext } = useContext(Context);
    const [isValid, setIsValid] = useState(false);

    const [matchState, setMatchState] = useState({
        userId: 0,
        gameName: "",
        gameAdress: "",
        gameDate: new Date(),
        gameFormat: "",
        gameType: ""
    }
    );

    const [inputDirty, setInputDirty] = useState({
        gameNameDirty: false,
        gameFormatDirty: false,
        gameAdressDirty: false,
        gameTypeDirty: false,
    });

    const [inputError, setInputError] = useState({
        gameNameError: "Наименованием матча не может быть пустым",
        gameFormatError: "Формат матча не может быть пустым",
        gameAdressError: "Адрес матча не может быть пустым",
        gameTypeError: "Формат матча не может быть пустым"
    });

    // ------------------------------------------------------------------------------------------ //

    useEffect(() => {
        if (inputError.gameNameError || inputError.gameFormatError || inputError.gameAdressError) {
            setIsValid(false);
        }
        else {
            setIsValid(true);
        }
    }, [inputError])

    // ------------------------------------------------------------------------------------------ //

    const blurHandler = (e) => {
        switch (e.target.name) {
            case "gameName":
                setInputDirty({ ...inputDirty, gameNameDirty: true });
                break;
            case "gameFormat":
                setInputDirty({ ...inputDirty, gameFormatDirty: true });
                break;
            case "gameAdress":
                setInputDirty({ ...inputDirty, gameAdressDirty: true });
                break;
        }
    }

    // ------------------------------------------------------------------------------------------ //

    function gameNameHandler(e) {
        console.log("name");
        setMatchState({ ...matchState, gameName: e.target.value })
        if (e.target.value !== '') {
            setInputError({ ...inputError, gameNameError: "" });
        }
        else {
            setInputError({ ...inputError, gameNameError: "Наименованием матча не может быть пустым" });
        }
    }

    // ------------------------------------------------------------------------------------------ //

    function gameFormatHandler(e) {
        setMatchState({ ...matchState, gameFormat: e.target.value })
        if (e.target.value !== 'Укажите формат матча') {
            setInputError({ ...inputError, gameFormatError: "" })
        }
        else {
            setInputError({ ...inputError, gameFormatError: "Формат матча не может быть пустым" })
        }

    }

    // ------------------------------------------------------------------------------------------ //

    function gameTypeHandler(e) {
        setMatchState({ ...matchState, gameType: e.target.value })
        if (e.target.value !== 'Укажите тип матча') {
            setInputError({ ...inputError, gameTypeError: "" })
        }
        else {
            setInputError({ ...inputError, gameTypeError: "Формат матча не может быть пустым" })
        }

    }

    // ------------------------------------------------------------------------------------------ //

    function gameAdressHandler(e) {
        console.log("adress");
        setMatchState({ ...matchState, gameAdress: e.target.value })
        if (e.target.value !== '') {
            setInputError({ ...inputError, gameAdressError: "" })
        }
        else {
            setInputError({ ...inputError, gameAdressError: "Адрес матча не может быть пустым" })
        }
    }

    // ------------------------------------------------------------------------------------------ //

    function createMatch() {

        const match = {
            UserId: userContext.userId,
            GameName: matchState.gameName,
            GameAdress: matchState.gameAdress,
            GameDate: matchState.gameDate,
            GameFormat: matchState.gameFormat,
            GameType: matchState.gameType
        }

        console.log('MATCHINFO');
        console.log(match);

        axios.post('http://localhost:5004/api/profile/create-game', match, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.reqmess, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });

                navigate(location.pathname.replace("/creategame", ""), { state: { refresh: true } });
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

    // ------------------------------------------------------------------------------------------ //

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
    
        return currentDate.getTime() < selectedDate.getTime();
      };

    // ------------------------------------------------------------------------------------------ //

    return (
        <Modal show={props.show}
            onHide={() => navigate(location.pathname.replace("/creategame", ""))}
            centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Создать матч
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row m-0 p-0">
                    <div className="col input-elem-cont">
                        <div className="row input-containerr">
                            {(inputDirty.gameNameDirty && inputError.gameNameError) && <div style={{ color: 'red', marginTop: '-5%' }}>{inputError.gameNameError}</div>}
                            <input name="gameName"
                                className="input-stylee"
                                type="text"
                                placeholder="Введите название матча"
                                onBlur={e => blurHandler(e)}
                                onChange={e => gameNameHandler(e)}
                            />
                        </div>
                        <div className="row input-containerr">
                            <div className="row m-0 p-0">
                                Дата матча
                            </div>
                            {/*
                            <DateTime className="datetime-picker"
                                dateFormat="YYYY-MM-DD" 
                                timeFormat="HH:mm:ss"
                                onChange={dateTimeHandler}
                                minDate={new Date().getDate() - 1}
                            />
                            */}
                            <ReactDatePicker
                                className="input-stylee"
                                //type="text"
                                selected={matchState.gameDate}
                                //selected={new Date()}
                                placeholder="Введите дату матча"
                                onChange={(date: Date) => { setMatchState({ ...matchState, gameDate: date }) }}
                                showTimeSelect={true}
                                timeIntervals={15}
                                timeFormat="HH:mm"
                                timeCaption="Time"
                                dateFormat="yyyy-MM-dd HH:mm"
                                minDate={new Date()}
                                filterTime={filterPassedTime}
                            />
                        </div>
                        <div className="row input-containerr">
                            {(inputDirty.gameFormatDirty && inputError.gameFormatError) && <div style={{ color: 'red', marginTop: '-5%' }}>{inputError.gameFormatError}</div>}
                            <select name="gameFormat"
                                className="input-stylee"
                                onBlur={e => blurHandler(e)}
                                onChange={e => gameFormatHandler(e)}
                            >
                                <option selected>Укажите формат матча</option>
                                <option>5x5</option>
                                <option>9x9</option>
                                <option>11x11</option>
                            </select>
                        </div>
                        <div className="row input-containerr">
                            {(inputDirty.gameTypeDirty && inputError.gameTypeError) && <div style={{ color: 'red', marginTop: '-5%' }}>{inputError.gameTypeError}</div>}
                            <select name="gameFormat"
                                className="input-stylee"
                                onBlur={e => blurHandler(e)}
                                onChange={e => gameTypeHandler(e)}
                            >
                                <option selected>Укажите тип матча</option>
                                <option>Публичный</option>
                                <option>Закрытый</option>
                            </select>
                        </div>
                        <div className="row input-containerr">
                            {(inputDirty.gameAdressDirty && inputError.gameAdressError) && <div style={{ color: 'red', marginTop: '-5%' }}>{inputError.gameAdressError}</div>}
                            <input name="gameAdress"
                                className="input-stylee"
                                type="text"
                                placeholder="Введите адрес матча"
                                onBlur={e => blurHandler(e)}
                                onChange={e => gameAdressHandler(e)}
                            />
                        </div>
                        <div className="row input-containerr">
                            <input className="input-button-style"
                                type="button"
                                value="Создать"
                                disabled={!isValid}
                                onClick={createMatch} />
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
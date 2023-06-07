import { Modal, Row } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../../index";
import { useLocation, useNavigate } from "react-router-dom";

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

    axios.get('https://overpass-api.de/api/interpreter', {
        params: {
            data: '[out:json];area["ISO3166-1"="BY"]->.a;(node(area.a)["place"="city"];);out body;'
        }
    })
        .then(response => {
            const cities = response.data.elements.map(city => city.tags.name);
            console.log(cities);
        })
        .catch(error => {
            console.error('Ошибка при получении списка городов:', error);
        });    
        
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
                            <ReactDatePicker
                                className="input-stylee"
                                selected={matchState.gameDate}
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
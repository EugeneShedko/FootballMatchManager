import { Modal, Row } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {Context} from "../../../index";
import { useLocation, useNavigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import "./../../../css/TeamsGames/CreateTeamGame.css";
import { TO_GAMES } from "../../../Utilts/Consts";

export default function CreateTeamGame(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const {userContext} = useContext(Context);
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
        if(inputError.gameNameError || inputError.gameFormatError || inputError.gameAdressError)
        {
            setIsValid(false);
        }
        else
        {
           setIsValid(true);
        }
     }, [inputError])

     // ------------------------------------------------------------------------------------------ //

     const blurHandler = (e) => {
        switch(e.target.name)
        {
           case "gameName": 
              setInputDirty({...inputDirty, gameNameDirty:true});
              break;
           case "gameFormat": 
              setInputDirty({...inputDirty, gameFormatDirty:true}); 
              break;
           case "gameAdress": 
              setInputDirty({...inputDirty, gameAdressDirty:true}); 
              break;
        }
     }

    // ------------------------------------------------------------------------------------------ //

     function gameFormatHandler(e)
     {
        setMatchState({ ...matchState, gameFormat: e.target.value })
        if(e.target.value !== 'Укажите формат матча')
        {
            setInputError({...inputError, gameFormatError: ""})
        }
        else
        {
            setInputError({...inputError, gameFormatError: "Формат матча не может быть пустым"})            
        }

     }

     // ------------------------------------------------------------------------------------------ //

     function gameAdressHandler(e)
     {
        console.log("adress");
        setMatchState({ ...matchState, gameAdress: e.target.value })
        if(e.target.value !== '')
        {
            setInputError({...inputError, gameAdressError: ""})
        }
        else
        {
            setInputError({...inputError, gameAdressError: "Адрес матча не может быть пустым"})            
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

                navigate(location.pathname.replace("/creategame", ""), {state:{refresh:true}});

                /* Убрать вычитывание всех матчей на сервере */
                //props.setAllMatches(response.data.allgames);
                //props.onHide(false);
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

    return (
        <Modal show={props.show}
            onHide={() => navigate(location.pathname.replace("/creategame", ""))}
            centered>

            <Modal.Header closeButton>
                <Modal.Title>
                    Создать командный матч
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Row className="input-container">
                        <ReactDatePicker 
                            className="input-style"
                            type="text"
                            selected={matchState.gameDate}
                            placeholder="Введите дату матча"
                            onChange={(date: Date) => { setMatchState({ ...matchState, gameDate: date }) }}
                        />
                    </Row>
                    <Row className="input-container">
                    {(inputDirty.gameFormatDirty && inputError.gameFormatError) && <div style={{color:'red', marginTop: '-5%'}}>{inputError.gameFormatError}</div>}
                        <select name="gameFormat"
                                className="input-style"
                                onBlur={e => blurHandler(e)}
                                onChange={e => gameFormatHandler(e)}
                        >
                            <option selected>Укажите формат матча</option>
                            <option>5x5</option>
                            <option>9x9</option>
                            <option>11x11</option>
                        </select>
                    </Row>
                    <Row className="input-container w-100">
                    {(inputDirty.gameAdressDirty && inputError.gameAdressError) && <div style={{color:'red', marginTop: '-5%'}}>{inputError.gameAdressError}</div>}
                        <input name="gameAdress" 
                            className="input-style"
                            type="text"
                            placeholder="Введите адрес матча"
                            onBlur={e => blurHandler(e)}
                            onChange={e => gameAdressHandler(e)}
                        />
                    </Row>
                    <Row className="w-100">
                        <input className="input-button-style" 
                               type="button" 
                               value="Создать" 
                               disabled={!isValid}
                               onClick={createMatch} />
                    </Row>
            </Modal.Body>
        </Modal>
    );
}
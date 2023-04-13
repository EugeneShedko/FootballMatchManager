import "./../../../css/CreateGame.css"
import { Modal, Row } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {Context} from "../../../index"

export default function CreateMatch(props) {

    const {user} = useContext(Context);
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

     function gameNameHandler(e)
     {
        console.log("name");
        setMatchState({ ...matchState, gameName: e.target.value })
        if(e.target.value !== '')
        {
            setInputError({...inputError, gameNameError:""});
        }
        else
        {
            setInputError({...inputError, gameNameError: "Наименованием матча не может быть пустым"});
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

     function gameTypeHandler(e)
     {
        setMatchState({ ...matchState, gameType: e.target.value })
        if(e.target.value !== 'Укажите тип матча')
        {
            setInputError({...inputError, gameTypeError: ""})
        }
        else
        {
            setInputError({...inputError, gameTypeError: "Формат матча не может быть пустым"})            
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

        {/* Здесь нужно добавить еще параметр */}
        const match = {
            UserId  : user.getUserId,
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
                props.setAllMatches(response.data.allgames);
                props.onHide(false);
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
            onHide={props.onHide}
            centered>

            <Modal.Header closeButton>
                <Modal.Title>
                    Создать матч
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Row className="input-container">
                    {(inputDirty.gameNameDirty && inputError.gameNameError ) && <div style={{color:'red', marginTop: '-5%'}}>{inputError.gameNameError}</div>}
                        <input name="gameName" 
                            className="input-style"
                            type="text"
                            placeholder="Введите название матча"
                            onBlur={e => blurHandler(e)}
                            onChange={e => gameNameHandler(e)}
                        />
                    </Row>
                    <Row className="input-container">
                        <ReactDatePicker 
                            className="input-style"
                            type="text"
                            selected={matchState.gameDate}
                            placeholder="Введите дату матча"
                            onChange={(date: Date) => { setMatchState({ ...matchState, gameDate: date }) }}
                        />
                    </Row>
                    {/*Здесь должен быть выбор, задать пока что статически*/}
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
                    <Row className="input-container">
                    {(inputDirty.gameTypeDirty && inputError.gameTypeError) && <div style={{color:'red', marginTop: '-5%'}}>{inputError.gameTypeError}</div> }
                        <select name="gameFormat"
                                className="input-style"
                                onBlur={e => blurHandler(e)}
                                onChange={e => gameTypeHandler(e)}
                        >
                            <option selected>Укажите тип матча</option>
                            <option>Публичный</option>
                            <option>Закрытый</option>
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
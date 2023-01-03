import "./../../css/creatematch.css"
import { Modal, Row } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "./../../index"

export default function EditGame(props) {

    function saveChanges()
    {
        /*Изменить*/
        const data = {
            "GameId": props.info.gameId,
            "GameName": props.info.gameName,
            "GameAdress": props.info.gameAdress,
            "GameDate": props.info.gameDate,
            "GameFormat": props.info.gameFormat,
        };
        
        axios.post('http://localhost:5000/api/profile/editgame', data,{ withCredentials: true })
        .then((response) => {
            toast.success(response.data.message,
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });    
            props.setGame(response.data.askdata);
            props.onHide(false);    
        })
        .catch(userError => {
            if (userError.response) {
                toast.error(userError.response.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
                props.onHide(false);    
            }
        });
    }

    return (
        <Modal show={props.show}
            onHide={props.onHide}
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
                        value={props.info.gameName}
                        onChange={(e) => {props.setInfo({ ...props.info, gameName: e.target.value }) }}
                    />
                </Row>
                <Row className="input-container">
                    <ReactDatePicker className="input-style"
                        selected={props.info.gameDate}
                        onChange={(date: Date) => {props.setInfo({ ...props.info, gameDate: date }) }}
                    />
                </Row>
                {/*Здесь должен быть выбор, задать пока что статически*/}
                <Row className="input-container">
                    <select className="input-style"
                        value={props.info.gameFormat}
                        onChange={(e) => {props.setInfo({ ...props.info, gameFormat: e.target.value }) }}
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
                        value={props.info.gameAdress}
                        onChange={(e) => {props.setInfo({  ...props.info, gameAdress: e.target.value }) }}
                    />
                </Row>
                <Row className="w-100">
                    <input className="input-button-style" type="button" value="Сохранить" onClick={saveChanges} />
                </Row>
            </Modal.Body>
        </Modal>
    );
}
import "./../../css/CreateGame.css"
import { Modal, Row } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "./../../index"

export default function EditProfile(props) {

    const {user} = useContext(Context);

    /*Поробоавть использовать короткий класс для изменений*/
    function saveChanges()
    {
        const data = {
            "UserId": user.getUserId,
            "UserEmail": props.info.userEmail,
            "UserPassword": "",
            "UserLastName": props.info.userLastName,
            "UserName": props.info.userFirstName,
            "UserSex": "",
            "UserBirthDay": props.info.userDateBirth,
            "UserPosition": props.info.userPosition    
        };
        

        axios.post('http://localhost:5004/api/profile/editprofile', data,{ withCredentials: true })
        .then((response) => {
            props.setProfileInfo(response.data.askdata);
            toast.success(response.data.message,
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });
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
                    Редактировать
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="input-container">
                    <input className="input-style"
                        type="text"
                        placeholder="Имя"
                        value={props.info.userFirstName}
                        onChange={(e) => {props.setInfo({ ...props.info, userFirstName: e.target.value }) }}
                    />
                </Row>
                <Row className="input-container">
                    <input className="input-style"
                        type="text"
                        placeholder="Фамилия"
                        value={props.info.userLastName}
                        onChange={(e) => {props.setInfo({ ...props.info, userLastName: e.target.value }) }}
                    />
                </Row>
                <Row className="input-container">
                    <ReactDatePicker className="input-style"
                        selected={props.info.userDateBirth}
                        onChange={(date: Date) => {props.setInfo({ ...props.info, userDateBirth: date }) }}
                    />
                </Row>
                {/*Здесь должен быть выбор, задать пока что статически*/}
                <Row className="input-container">
                    <select className="input-style"
                        value={props.info.userPosition}
                        onChange={(e) => {props.setInfo({ ...props.info, userPosition: e.target.value }) }}
                    >
                        <option>Нападающий</option>
                        <option>Левый полузащитник</option>
                        <option>Правый полузащитник</option>
                        <option>Атакующий полузащитник</option>
                        <option>Центральный полузащитник</option>
                        <option>Опорный полузащитник</option>
                        <option>Левый защитник</option>
                        <option>Правый защитник</option>
                        <option>Центральный защитник</option>
                        <option>Вратарь</option>
                    </select>
                </Row>
                <Row className="input-container w-100">
                    <input className="input-style"
                        type="text"
                        placeholder="email"
                        value={props.info.userEmail}
                        onChange={(e) => {props.setInfo({  ...props.info, userEmail: e.target.value }) }}
                    />
                </Row>
                <Row className="w-100">
                    <input className="input-button-style" type="button" value="Сохранить" onClick={saveChanges} />
                </Row>
            </Modal.Body>
        </Modal>
    );
}
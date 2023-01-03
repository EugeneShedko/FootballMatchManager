import "./../../css/creatematch.css"
import { Modal, Row } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {Context} from "./../../index"

export default function CreateTeam(props) {

    const {user} = useContext(Context);

    const [teamState, setTeamState] = useState({
        userId: 0,
        teamName: "",
    }
    );

    function createTeam() {

        const data = new FormData();
        data.append("userId", user.getUserId); 
        data.append("teamName", teamState.teamName); 

        axios.post('http://localhost:5000/api/profile/createteam', data, { withCredentials: true })
            .then((response) => {
                toast.success(response.data, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                })
                props.onHide(false);
            })
            .then(() => {
                axios.get('http://localhost:5000/api/profile/allteams', { withCredentials: true })
                .then((response) => {
                    props.setAllTeams(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        toast.error("Ошибка получения команд",
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
                   toast.error("Ошибка создания команды", 
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
                            placeholder="Введите название команды"
                            onChange={(name) => { setTeamState({ ...teamState, teamName: name.target.value }) }}
                        />
                    </Row>
                    <Row className="w-100">
                        <input className="input-button-style" 
                               type="button" 
                               value="Создать" 
                               onClick={createTeam} />
                    </Row>
            </Modal.Body>
        </Modal>
    );
}
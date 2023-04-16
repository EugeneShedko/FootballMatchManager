import { Modal, Row } from "react-bootstrap";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../../../index"

import "./../../../../css/Teams/CreateTeam.css"
import { useNavigate } from "react-router-dom";
import { TO_TEAMS } from "../../../../Utilts/Consts";

export default function CreateTeam(props) {

    const navigate = useNavigate();
    /* Можно было бы не создавать, а хранить в переменной, тогда по другому обработку на сервере нужно картинки */
    const [image, setImage] = useState("http://localhost:5004/teams/default-team-logo.png");

    const [teamState, setTeamState] = useState({
        teamName: "",
        teamDesk: "",
        teamImage: ""
    });

    // ---------------------------------------------------------------------------------------------------- //

    function createTeam() {
        
        const data = new FormData();
        data.append("teamName",  teamState.teamName);
        data.append("teamDesk",  teamState.teamDesk);
        data.append("teamImage", teamState.teamImage);

        axios.post('http://localhost:5004/api/team/create-team', data, { withCredentials: true })
            .then((response) => {              
                toast.success(response.data, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                })
                /* Передать рефреш, как с играми */
                navigate(TO_TEAMS, {state:{refresh:true}});
                /* Убрать вычет всех команд на сервере */
                //props.setAllTeams(response.data);  
                //props.onHide(false);
            })
            .catch(userError => {
                if (userError.response) {
                    toast.error(userError.response.data,
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });
    }

    // ---------------------------------------------------------------------------------------------------- //

    const handleChangeFile = (event) => {
        var file = event.target.files[0];
        setTeamState({...teamState, teamImage: file});
        convertFileToImage(file);
    }

    // ---------------------------------------------------------------------------------------------------- //

    const convertFileToImage = (file) => {

        var reader = new FileReader();

        reader.onload = function(event)
        {
            setImage(event.target.result);
        }

        reader.readAsDataURL(file);
    }

    // ---------------------------------------------------------------------------------------------------- //

    return (
        <Modal show={props.show}
            onHide={() => navigate(TO_TEAMS)}
            centered>

            <Modal.Header closeButton>
                <Modal.Title>
                    Создать команду
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
                <Row className="input-container">
                    <textarea className="input-style text-area-style"
                        type="text"
                        placeholder="Добавьте описание команды..."
                        onChange={(desk) => { setTeamState({ ...teamState, teamDesk: desk.target.value }) }}
                    />
                </Row>
                <Row className="input-container">
                    <div className="col team-logo-container">
                        <div>
                            <img className="team-logo-style"
                                src={image}
                                alt=""
                            />
                        </div>
                        <div>
                            <input type="file"
                                aria-describedby="basic-addon1"
                                onChange={handleChangeFile} 
                                />
                        </div>
                    </div>
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
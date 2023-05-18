import { Modal, div } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../../index";

import "./../../../css/Teams/CreateTeam.css"
import { useLocation, useNavigate } from "react-router-dom";
import { TO_EDIT_TEAM, TO_TEAMS } from "../../../Utilts/Consts";

/* Сначала нужно сюда передать информацию! */

export default function EditTeam(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const [image, setImage] = useState("http://localhost:5004/" + location.state.teamImage);
    /* Можно было бы не создавать, а хранить в переменной, тогда по другому обработку на сервере нужно картинки */
    //const [image, setImage] = useState("http://localhost:5004/teams/default-team-logo.png");

    const [teamInfo, setTeamInfo] = useState({
        teamId: location.state.teamId,
        teamName: location.state.teamName,
        teamDesk: location.state.teamDesc,
        teamImageFile: "",
    });

    // ---------------------------------------------------------------------------------------------------- //

    function editTeam() {

        const data = new FormData();
        data.append("teamId", teamInfo.teamId);
        data.append("teamName", teamInfo.teamName);
        data.append("teamDesk", teamInfo.teamDesk);
        data.append("teamImage", teamInfo.teamImageFile);

        axios.post('http://localhost:5004/api/team/edit-team', data, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                })

                navigate(location.pathname.replace(TO_EDIT_TEAM, ""))
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
        setTeamInfo({ ...teamInfo, teamImageFile: file });
        convertFileToImage(file);
    }

    // ---------------------------------------------------------------------------------------------------- //

    const convertFileToImage = (file) => {

        var reader = new FileReader();

        reader.onload = function (event) {
            setImage(event.target.result);
        }

        reader.readAsDataURL(file);
    }

    // ---------------------------------------------------------------------------------------------------- //

    return (
        <Modal show={props.show}
            onHide={() => navigate(location.pathname.replace(TO_EDIT_TEAM, ""))}
            centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Редактировать команду
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="div m-0 p-0">
                    <div className="col crt-matin-cont">
                        <div className="input-container">
                            <input className="crt-input-style"
                                type="text"
                                placeholder="Введите название команды"
                                value={teamInfo.teamName}
                                onChange={(name) => { setTeamInfo({ ...teamInfo, teamName: name.target.value }) }}
                            />
                        </div>
                        <div className="input-container">
                            <textarea className="crt-input-style text-area-style"
                                type="text"
                                value={teamInfo.teamDesk}
                                placeholder="Добавьте описание команды..."
                                onChange={(desk) => { setTeamInfo({ ...teamInfo, teamDesk: desk.target.value }) }}
                            />
                        </div>
                        <div className="input-container">
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
                        </div>
                        <div className="input-container">
                            <input className="input-button-style"
                                type="button"
                                value="Сохранить"
                                onClick={editTeam} />

                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
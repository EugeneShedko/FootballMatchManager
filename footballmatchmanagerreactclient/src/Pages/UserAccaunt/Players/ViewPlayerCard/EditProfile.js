import "./../../../../css/CreateGame.css"
import { Modal, Row } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../../../index"
import { useLocation, useNavigate } from "react-router-dom";
import { TO_PLAYER_CARD, TO_PROFILE } from "../../../../Utilts/Consts";

export default function EditProfile(props) {

    const location = useLocation();
    const navigate = useNavigate();
    const { userContext, setUserContext } = useContext(Context);
    const [userInfo, setUserInfo] = useState({
        userId: userContext.userId,
        userEmail: location.state.userEmail,
        userPassword: "",
        userLastName: location.state.userLastName,
        userFirstName: location.state.userFirstName,
        userSex: "",
        userBirthDay: location.state.userDateBirth,
        userPosition: location.state.userPosition
    });

    function saveChanges() {
        const data = {
            UserId: userInfo.userId,
            UserEmail: userInfo.userEmail,
            UserPassword: "",
            UserLastName: userInfo.userLastName,
            UserName: userInfo.userFirstName,
            UserSex: "",
            UserBirthDay: userInfo.userBirthDay,
            UserPosition: userInfo.userPosition
        };

        axios.post('http://localhost:5004/api/profile/editprofile', data, { withCredentials: true })
            .then((response) => {
                setUserContext({ ...userContext, userName: response.data.askdata.firstName + ' ' + response.data.askdata.lastName });
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
                navigate(TO_PLAYER_CARD + '/' + userContext.userId);
                //Пока что, так убрать вычитывание информации о пользователе на сервере 
                //props.setProfileInfo(response.data.askdata);
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
            onHide={() => navigate(TO_PLAYER_CARD + '/' + userContext.userId)}
            centered>

            <Modal.Header closeButton>
                <Modal.Title>
                    Редактировать
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row m-0 p-0">
                    <div className="col input-elem-cont">
                        <div className="row input-containerr">
                            <input className="input-stylee"
                                type="text"
                                placeholder="Имя"
                                value={userInfo.userFirstName}
                                onChange={(e) => { setUserInfo({ ...userInfo, userFirstName: e.target.value }) }}
                            />

                        </div>
                        <div className="row input-containerr">
                            <input className="input-stylee"
                                type="text"
                                placeholder="Фамилия"
                                value={userInfo.userLastName}
                                onChange={(e) => { setUserInfo({ ...userInfo, userLastName: e.target.value }) }}
                            />
                        </div>
                        <div className="row input-containerr">
                            <div className="row m-0 p-0">Дата рождения</div>
                            <ReactDatePicker className="input-stylee"
                                selected={userInfo.userBirthDay}
                                onChange={(date: Date) => { setUserInfo({ ...userInfo, userBirthDay: date }) }}
                            />
                        </div>
                        <div className="row input-containerr">
                            <select className="input-stylee"
                                value={userInfo.userPosition}
                                onChange={(e) => { setUserInfo({ ...userInfo, userPosition: e.target.value }) }}
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
                        </div>
                        <div className="row input-containerr">
                            <input className="input-button-style" type="button" value="Сохранить" onClick={saveChanges} />
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
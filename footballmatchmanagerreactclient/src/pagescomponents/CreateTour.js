import "./../css/creatematch.css";
import { Modal, Row } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {Context} from "./../index";

export default function CreateTour(props) {

    const { user } = useContext(Context);

    const [tourState, setTourState] = useState({
        userId: 0,
        tourName: "",
        tourStartDate: new Date(),
        tourEndDate: new Date(),
        tourCount: "",
        tourPrize: ""
    }
    );

    function createTour() {

        const data = new FormData();

            data.append("UserCreator", user.getUserId);
            data.append("TourName",  tourState.tourName);
            data.append("TourStartDate", tourState.tourStartDate);
            data.append("TourEndDate", tourState.tourEndDate);
            data.append("TeamNumbers", tourState.tourCount);
            data.append("TourPrizeFound", tourState.tourPrize);

        axios.post('http://localhost:5000/api/profile/createtour', data, { withCredentials: true })
            .then((response) => {
                toast.success(response.data, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                })
                props.onHide(false);
            })
            .then(() => {
                axios.get('http://localhost:5000/api/profile/allmatches', { withCredentials: true })
                    .then((response) => {
                        props.setAllMatches(response.data);
                    })
                    .catch(userError => {
                        if (userError.response) {
                            toast.error("Ошибка получения матчей",
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
                    toast.error("Ошибка создания матча",
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
                        placeholder="Введите название турнира"
                        onChange={(name) => { setTourState({ ...tourState, tourName: name.target.value }) }}
                    />
                </Row>
                <Row className="input-container">
                    <ReactDatePicker className="input-style"
                        type="text"
                        selected={tourState.tourStartDate}
                        placeholder="Введите дату начала турнира"
                        onChange={(date: Date) => { setTourState({ ...tourState, tourStartDate: date }) }}
                    />
                </Row>
                <Row className="input-container">
                    <ReactDatePicker className="input-style"
                        type="text"
                        selected={tourState.tourEndDate}
                        placeholder="Введите дату окончания"
                        onChange={(date: Date) => { setTourState({ ...tourState, tourEndDate: date }) }}
                    />
                </Row>
                <Row className="input-container w-100">
                    <input className="input-style"
                        type="text"
                        placeholder="Введите количество участников"
                        onChange={(adress) => { setTourState({ ...tourState, tourCount: adress.target.value }) }}
                    />
                    <Row className="input-container w-100">
                        <input className="input-style"
                            type="text"
                            placeholder="Введите призовой фонд"
                            onChange={(adress) => { setTourState({ ...tourState, tourPrize: adress.target.value }) }}
                        />
                    </Row>
                    <Row className="w-100">
                        <input className="input-button-style" type="button" value="Создать" onClick={createTour} />
                    </Row>
                </Row>    
            </Modal.Body>
        </Modal>
    );
}
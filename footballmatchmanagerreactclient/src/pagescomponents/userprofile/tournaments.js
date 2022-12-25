import "./../../css/tournamentspage.css"
import TournamentBlock from "../tournamentblock";
import CreateTournament from "./createtournament";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TourGenerator from "../TourGenerator";
import CreateTour from "../CreateTour";

export default function Tournaments(props) {

    const[createTournamentVisible, setCreateTournamentVisible] = useState(false);
    const [tours, setTours] = useState([]);
    const [searchString, setSearchString] = useState("");

    useEffect(
        () => {
            axios.get('https://localhost:7277/api/profile/alltour', { withCredentials: true })
                .then((response) => {
                    setTours(response.data);
                    console.log(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        toast.error(userError.response.message,
                            {
                                position: toast.POSITION.TOP_CENTER,
                                autoClose: 2000,
                                pauseOnFocusLoss: false
                            });
                    }
                });
            ;
        }, []
    );


    return (
        <div className="row tptournaments-main-container">
            <div className="col-9 tptournaments-container">
                <div className="row tptournaments-absolute-container">
                <TourGenerator tours={tours}
                               setTours={setTours}
                               searchString={searchString}
                               setContState={props.setContState}
                                />
                </div>
            </div>
            <div className="col-3 tplefcol">
                <div className="tp-fixed-container">
                    <div className="row tplcrow">
                        <input className="tpbutton-style"
                            type="button"
                            value="Создать турнир" 
                            onClick={() => setCreateTournamentVisible(true)}/>
                    </div>
                    <div className="row tplcrow">
                        <input id="search-tournament-element"
                               type="text"
                               placeholder="Введите название турнира" 
                               value={searchString}
                               onChange={(e) => setSearchString(e.target.value)} 
                               />
                    </div>
                    {/*Возможно форматы выводит, сделав запрос, пока что напишу текстом*/}
                    <div className="row filter-tournament-container">
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            Сегодня
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            Завтра
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            5x5
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            9x9
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            11x11
                        </label>
                        <input className="tpbutton-style" type="button" value="Применить" />
                    </div>
                </div>
            </div>
            <CreateTour show={createTournamentVisible} 
                              onHide={setCreateTournamentVisible}
                              setAllTours={setTours} />
        </div>
    );
}  
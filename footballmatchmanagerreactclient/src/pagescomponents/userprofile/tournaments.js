import "./../../css/tournamentspage.css"
import MatchBlock from "../matchblock";
import TournamentBlock from "../tournamentblock";

export default function Tournaments(props) {

    const someTournamentInfo = [
        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"
        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },
    ]

    return (
        <div className="row tptournaments-main-container">
            <div className="col-9 tptournaments-container">
                <div className="row tptournaments-absolute-container">
                    {someTournamentInfo.map((tournament) => (
                        <div className="tpinfo-block">
                            <TournamentBlock info         = {tournament} 
                                             setContState = {props.setContState}/>
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-3 tplefcol">
                <div className="tp-fixed-container">
                    <div className="row tplcrow">
                        <input className="tpbutton-style"
                            type="button"
                            value="Создать турнир" />
                    </div>
                    <div className="row tplcrow">
                        <input id="search-tournament-element"
                            type="text"
                            placeholder="Введите название турнира" />
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
        </div>
    );
}  
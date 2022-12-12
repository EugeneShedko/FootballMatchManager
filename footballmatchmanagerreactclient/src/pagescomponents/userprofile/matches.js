import "./../../css/matchespage.css"
import MatchBlock from "../matchblock";

export default function Matches(props) {
    const someMatchInfo = [

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

    //Плохо работае наведение на послдений блок матчей(не знаю, почему)
    return (
        <div className="row mpmatches-main-container">
            <div className="col-9 mpmatches-container">
                <div className="row mpmatches-absolute-container">
                    {someMatchInfo.map((match) => (
                        <div className="mpinfo-block">
                            <MatchBlock info         = {match} 
                                        setContState = {props.setContState}/>
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-3 mplefcol">
                <div className="mp-fixed-container">
                    <div className="row mplcrow">
                        <input className="mpbutton-style" type="button" value="Создать матч" />
                    </div>
                    <div className="row mplcrow">
                        <input id="search-match-element" type="text" placeholder="Введите название матча" />
                    </div>
                    {/*Возможно форматы выводит, сделав запрос, пока что напишу текстом*/}
                    <div className="row filter-match-container">
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
                            9:00 - 12:00
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            12:00 - 15:00
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            15:00 - 18:00
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            18:00 - 21:00
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
                        <input className="mpbutton-style" type="button" value="Применить" />
                    </div>
                </div>
            </div>
        </div>
    );
}  
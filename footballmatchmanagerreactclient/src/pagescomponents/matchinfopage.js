/*Инфу скорее всего получать через props*/ 
/*Получился двойной props, не факт, что получиться передать*/ 

import "./../css/matchinfopage.css"
import PlayerBlock from "./playerblock";

export default function MatchInfoPage(props) {

    const somePlayerInfo = [

        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Манчестер Юнайтед"
        },
        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Нет комманды"
        },
        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Манчестер Юнайтед"
        },
        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Манчестер Юнайтед"
        },
        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Манчестер Юнайтед"
        },
        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Манчестер Юнайтед"
        },
        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Манчестер Юнайтед"
        },
    ]


    return (
        <div className="row justify-content-center match-info-main-container">
            <div className="col-7 match-info-container">
                <div className="row m-0 h-100">
                    <div className="col-6 match-info-text-container">
                        <div className="row match-info-title">
                            {props.info.info.matchName}
                        </div>
                        <div className="row match-info-header">
                            Время матча
                        </div>
                        <div className="row match-info-text">
                            {props.info.info.matchTime}
                        </div>
                        <div className="row match-info-header">
                            Формат матча
                        </div>
                        <div className="row match-info-text">
                            {props.info.info.matchFormat}
                        </div>
                        <div className="row match-info-header">
                            Адрес
                        </div>
                        <div className="row match-info-text">
                            {props.info.info.matchAdress}
                        </div>
                        <div className="row match-info-header">
                            Текущее количество игроков
                        </div>
                        <div className="row match-info-text">
                            {props.info.info.playersCount}
                        </div>
                        <div className="row match-join-button-container">
                            <input className="match-join-button" type="button" value="Присоединиться"/>
                        </div>
                    </div>
                    <div className="col-6 match-info-user-container">
                        <div className="match-info-user-absolute-container">
                            {somePlayerInfo.map((player) => (
                                <div className="row m-0">
                                    <PlayerBlock info={player} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
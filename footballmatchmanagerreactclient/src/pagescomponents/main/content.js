import React from "react";
import PlayerBlock from "../playerblock";
import MatchBlock from "./../matchblock";
import TornamentBlock from "./../tournamentblock";

export default function Content() {

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
    ]

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
    ]

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

        <div id="body-content" className="row justify-content-center m-0">
            <div className="col-3 p-0">
                <div className="search-block">
                    <input className="serach-element" type="text" placeholder="Введите для поиска матча ..." />
                </div>
                {
                    someMatchInfo.map((match) => (
                        <div className="row info-block">
                            <MatchBlock info={match} />
                        </div>
                    ))
                }
            </div>
            <div className="col-3 p-0">
                <div className="search-block">
                    <input className="serach-element" type="text" placeholder="Введите для поиска турнира ..." />
                </div>
                {
                    someTournamentInfo.map((tournament) => (
                        <div className="row info-block">
                            <TornamentBlock info={tournament} />
                        </div>
                    ))
                }
            </div>
            <div className="col-3 p-0">
                <div className="search-block">
                    <input className="serach-element" type="text" placeholder="Введите для поиска игрока ..." />
                </div>
                {
                    somePlayerInfo.map((player) => (
                        <div className="row info-block">
                            <PlayerBlock info={player} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
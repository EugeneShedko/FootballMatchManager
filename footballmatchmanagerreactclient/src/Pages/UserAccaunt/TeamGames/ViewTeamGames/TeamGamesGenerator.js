import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TeamBlock from "./TeamBlock";


export default function TeamGameGenerator(props) {

    const searchGamse = props.games.filter(searchingGames => {
        return String(searchingGames.name).toLowerCase().includes(props.searchString.toLowerCase().trim())
    })

    return (
        <div className="row teams-absolute-container">
            {(searchGamse.length === 0 && props.searchString != '') && <div>Пользователей нет</div>}
            {/*
                searchGamse?.map((match) => (
                    <div className="mpinfo-block">
                        <TeamBlock  info={match}
                                    setGames={props.setGames}
                                    setContState={props.setContState} />
                    </div>
                ))
                */}
            <div className="team-info-block">
                <TeamBlock //info={match}
                           //setGames={props.setGames}
                    />
            </div>

        </div>
    );
}
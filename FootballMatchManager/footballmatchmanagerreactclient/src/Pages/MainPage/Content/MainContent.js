import axios from "axios";
import { useEffect, useState } from "react";
import GameGenerator from "../../UserAccaunt/Games/ViewGames/GameGenerator";
import PlayerGenerator from "./../../UserAccaunt/Players/ViewPlayers/PlayerGenerator";
import TeamGameGenerator from "../../UserAccaunt/TeamGames/ViewTeamGames/TeamGamesGenerator";
import TeamGenerator from "../../UserAccaunt/Teams/ViewTeams/TeamsGenerator";

export default function MainContent() {

    const [players, setPlayers] = useState([]);
    const [games, setGames] = useState([]);
    const [teamGames, setTeamGamse] = useState([]);
    const [teams, setTeams] = useState([]);

    // ------------------------------------------------------------------------------------ //

    useEffect(
        () => {

            /* Игроки */
            axios.get('http://localhost:5004/api/profile/all-players/active', { withCredentials: true })
                .then((response) => {
                    setPlayers(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        console.log('Главная страница - ошибка получения пользователей');
                    }
                });

            /* Индивидуальные матчи */
            axios.get('http://localhost:5004/api/profile/get-all-games/1', { withCredentials: true })
                .then((response) => {
                    setGames(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        console.log('Главная страница - ошибка получения индивидуальных матчей');
                    }
                });

            /* Командные матчи */
            axios.get('http://localhost:5004/api/teamgame/less-team-games/1', { withCredentials: true })
                .then((response) => {
                    setTeamGamse(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        console.log('Главная страница - ошибка получения командных матчей');
                    }
                });

            /* Команды */
            axios.get('http://localhost:5004/api/team/get-all-tems', { withCredentials: true })
                .then((response) => {
                    setTeams(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        console.log("Ошибка получения команд");
                    }
                });


        }, []);

    // ------------------------------------------------------------------------------------ //

    return (
        <div className="row justify-content-center m-0 p-0">
            <div className="col-3 map-el-container">
                <div className="search-block">Команды</div>
                <TeamGenerator teams={teams}
                    setGames={setTeams}
                    searchString=""
                />
            </div>
            <div className="col-3 map-el-container">
                <div className="search-block">Персональные матчи</div>
                <GameGenerator games={games}
                    searchString="" />
            </div>
            <div className="col-3 map-el-container">
                <div className="search-block">Игроки</div>
                <PlayerGenerator players={players}
                    searchString="" />
            </div>
            <div className="col-3 map-el-container">
                <div className="search-block">Командные матчи</div>
                <TeamGameGenerator games={teamGames}
                    searchString=""
                />
            </div>
        </div>
    );
}
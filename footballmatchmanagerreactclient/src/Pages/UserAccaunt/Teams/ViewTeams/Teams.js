import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import TeamGenerator from "./TeamsGenerator";
import CreateTeam from "./CreateTeam";

import "./../../../../css/Teams/TeamsView.css"

export default function Teams(props) {

    const [createTeamVisible, setCreateTeamVisible] = useState(false);
    const [teams, setTeams] = useState([]);
    const [searchString, setSearchString] = useState("");

    // ---------------------------------------------------------------------------------------------- //

    useEffect(
        () => {
            axios.get('http://localhost:5004/api/team/get-all-tems', { withCredentials: true })
                .then((response) => {
                    setTeams(response.data);
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
        }, [props]
    );

    // ---------------------------------------------------------------------------------------------- //

    return (
        <div className="row teams-main-container">
            <div className="col-9 tems-container">
                {

                    <TeamGenerator teams={teams}
                        setGames={setTeams}
                        searchString={searchString}
                        setContState={props.setContState} />

                }
            </div>
            <div className="col-3 team-create-block">
                <div className="row team-create-block-row">
                    <input className="team-button-style"
                        type="button"
                        value="Создать команду"
                        onClick={() => setCreateTeamVisible(true)} />
                </div>
                <div className="row team-create-block-row">
                    <input id="search-team-element"
                        type="text"
                        placeholder="Введите название команды"
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                    />
                </div>

            </div>
            { createTeamVisible ?
                <CreateTeam show={createTeamVisible}
                    onHide={setCreateTeamVisible}
                    setAllTeams={setTeams}
                />
                :
                null
            }
        </div>
    );
}
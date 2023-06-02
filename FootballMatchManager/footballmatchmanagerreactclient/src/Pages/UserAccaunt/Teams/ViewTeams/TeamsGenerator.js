import { useState } from "react";
import TeamBlock from "./TeamBlock";
import { useLocation } from "react-router-dom";
import { TO_TEAM_GAME_INVITE_CARD } from "../../../../Utilts/Consts";


export default function TeamGenerator(props) {

    const [isInvite, setIsInvite] = useState(useLocation().pathname.includes(TO_TEAM_GAME_INVITE_CARD) ? true : false);

    // --------------------------------------------------------------------------------------------- //

    const searchTeams = props.teams.filter(searchingTeams => {
        return String(searchingTeams.name).toLowerCase().includes(props.searchString.toLowerCase().trim())
    })

    // --------------------------------------------------------------------------------------------- //

    return (
        <div className="row mpmatches-absolute-container">
            {
                isInvite ?
                    searchTeams?.map((team) =>
                        <div className="mpinfo-block-no-hover">
                            <TeamBlock info={team}
                                isVisable={!props.notifiTeams?.some(notifiTeam => notifiTeam.pkId === team.pkId)}
                                sendInviteToAddTeamGame={props.sendInviteToAddTeamGame}
                            />
                        </div>
                    )
                    :
                    searchTeams?.map((team) =>
                        <div className="mpinfo-block">
                            <TeamBlock info={team} />
                        </div>
                    )
            }
        </div>
    );
}
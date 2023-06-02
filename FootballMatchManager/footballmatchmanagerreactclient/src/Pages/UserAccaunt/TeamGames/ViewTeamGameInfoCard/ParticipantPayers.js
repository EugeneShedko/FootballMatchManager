import PlayerBlock from "../../Players/ViewPlayers/PlayerBlock";

export default function ParticipantPlayers(props) {
    return (
        <>
            <div className="col-6 m-0 p-0">
                <div className="row curr-team-user-cont">
                    <div className="tg-info-user-absolute-container">
                        {
                            props.firstTeamUsers?.map((player) => (
                                <div className="row m-0 p-0">
                                    <PlayerBlock info={player} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="col-6 m-0 p-0">
                <div className="row curr-team-user-cont">
                    <div className="tg-info-user-absolute-container">
                        {
                            props.secondTeamUsers?.map((player) => (
                                <div className="row m-0 p-0">
                                    <PlayerBlock info={player} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

        </>
    );
}
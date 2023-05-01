import "./../../../../../css/TeamsGames/GameEventBlock.css";

export default function Card(props) {

    const data = props.mode === 'view' ? {
        eventText: props.event1.gameType.text,
        eventIcon: props.event1.gameType.image,
        eventTime: props.event1.time,
        playerImage: props.event1.player.image,
        eventPlayer: props.event1.player.firstName + ' ' + props.event1.player.lastName,
        eventTeam: props.event1.eventTeam.name
    }
        :
        {
            eventText: props.event2.type,
            eventIcon: props.event2.typeImage,
            eventTime: props.event2.time,
            eventPlayer: props.event2.player,
            playerImage: props.event2.playerImage,
            eventTeam: props.event2.team
        }

    // ------------------------------------------------------------------------- //

    return (
        <div className={"game-event-cont " + props.align}>
            <div className="game-event-back-block" />
            <div className="row m-0 p-0">
                <div className="col m-0 p-0">
                    <div className="row game-event-row">
                        <div className="col-1 p-0 m-0">
                            <img className={props.cardtype === 'red' ? "event-icon-card-red" : "event-icon-card-yellow"}
                                src={"http://localhost:5004/" + data.eventIcon}
                                alt="" />
                        </div>
                        <div className="col-9 p-0 m-0">
                            {data.eventText}
                        </div>
                        <div className="col-2 p-0 m-0">
                            {data.eventTime}'
                        </div>
                    </div>
                    <div className="row user-info-row">
                        <div className="col-3 user-icon-cont">
                            <img src={"http://localhost:5004/" + data.playerImage}
                                className="user-icon"
                                alt="" />
                        </div>
                        <div className="col-9 user-info">
                            <div className="row m-0 p-0">
                                <div className="col m-0 p-0">
                                    {data.eventPlayer}
                                </div>
                            </div>
                            <div className="row m-0 p-0">
                                <div className="col m-0 p-0">
                                    {data.eventTeam}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {props.mode === 'create' ?
                <div className="row m-0 p-0">
                    <input className="delete-button"
                        type="button"
                        value="Удалить"
                        onClick={() => props.deleteTeamGameEvent(props.index)}
                    />
                </div>
                : null}
        </div>
    );
}
import "./../../../../../css/TeamsGames/GameEventBlock.css";

export default function Change(props) {
    return (
        <div className="game-event-cont">
            <div className="game-event-back-block" />
            <div className="row m-0 p-0">
                <div className="col m-0 p-0">
                    <div className="row game-event-row">
                        <div className="col-10 p-0 m-0">
                            {props.event.type}
                        </div>
                        <div className="col-2 p-0 m-0">
                            {props.event.time}'
                        </div>
                    </div>
                    <div className="row user-info-row">
                        <div className="row change-info"> Выходит на поле </div>
                        <div className="col-3 user-icon-cont">
                            <img src={"http://localhost:5004/" + props.event.entityId1Image}
                                className="user-icon"
                                alt="" />
                        </div>
                        <div className="col-9 user-info">
                            <div className="row m-0 p-0">
                                <div className="col m-0 p-0">
                                    {props.event.entityId1}
                                </div>
                            </div>
                            <div className="row m-0 p-0">
                                <div className="col m-0 p-0">
                                    {props.event.team}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row user-info-row">
                        <div className="row change-info"> Уходит с поля </div>
                        <div className="col-3 user-icon-cont">
                            <img src={"http://localhost:5004/" + props.event.entityId2Image}
                                className="user-icon"
                                alt="" />
                        </div>
                        <div className="col-9 user-info">
                            <div className="row m-0 p-0">
                                <div className="col m-0 p-0">
                                    {props.event.entityId2}
                                </div>
                            </div>
                            <div className="row m-0 p-0">
                                <div className="col m-0 p-0">
                                    {props.event.team}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
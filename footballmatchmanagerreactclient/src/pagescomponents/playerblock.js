import "./../css/player.css"

export default function PlayerBlock(props) {
    return (
        <div className="player-container">
            <div className="player-back-block" />
            <div className="row player-block-content">
                <div className="col-5">
                    <img id="profile-image" src="/image/default-profile-icon.jpg" alt="" />
                </div>
                <div className="col-7 player-block-column">
                    <div className="row m-0">
                        {props.info.playerName}
                    </div>
                    <div className="row m-0">
                        {props.info.playerBithDate}
                    </div>
                    <div className="row m-0">
                        {props.info.playerPosition}
                    </div>
                    <div className="row m-0">
                        {props.info.playerTeam}
                    </div>
                </div>
            </div>
        </div>
    );
}
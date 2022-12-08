import "./../css/match.css";

export default function MatchBlock(props) {
    return (
        <div className="match-container">
            <div className="match-back-block" />
            <div className="row match-block-content">
                <div className="col-5 match-block-column">
                    <div className="row m-0">
                        {props.info.matchName}
                    </div>
                </div>
                <div className="col-7 match-block-column">
                    <div className="row m-0">
                        {props.info.matchTime}
                    </div>
                    <div className="row m-0">
                        {props.info.matchFormat}
                    </div>
                    <div className="row m-0">
                        {props.info.matchAdress}
                    </div>
                    <div className="row m-0">
                        {props.info.playersCount}
                    </div>
                </div>
            </div>
        </div>
    );
}
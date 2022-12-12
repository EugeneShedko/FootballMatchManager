import "./../css/tournament.css";
import TournamentInfoPage from "./tournamentinfopage";

{/*Можно переписать разметку как в файде playerblock*/ }
export default function TournamentBlock(props) {

    function setTournamentInfoPage()
    {
        props.setContState(<TournamentInfoPage info={props} />);
    }

    return (
        <div className="tournament-container" onClick={setTournamentInfoPage}>
            <div className="tournament-back-block" />
            <div className="row tournament-block-content">
                <div className="col-5 tournament-block-column">
                    <div className="row m-0">
                        {props.info.matchName}
                    </div>
                </div>
                <div className="col-7 tournament-block-column">
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

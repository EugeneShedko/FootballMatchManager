import "./../css/match.css";
import TeamInfoPage from "./TeamInfoPage";

export default function TeamBlock(props) {

    function setTeamInfoPage() {
        props.setContState(<TeamInfoPage teamId={props.info.teamId}
            setGames={props.setTeams}
            setContState={props.setContState} />);
    }

    return (
        <div className="match-container" onClick={setTeamInfoPage}>
            <div className="match-back-block" />
            <div className="row match-block-content">
                <div className="col-5 match-block-column">
                    <div className="row m-0">
                        <img id="profile-image" src="/image/default-profile-icon.jpg" alt="" />
                    </div>
                </div>
                <div className="col-7 match-block-column">
                    <div className="row m-0">
                        {props.info.teamName}
                    </div>
                    <div className="row m-0">
                        {(new Date(props.info.createDate)).toLocaleString().substring(0, (new Date(props.info.createDate)).toLocaleString().length - 3)}
                    </div>
                    <div className="row m-0">
                    </div>
                    <div className="row m-0">
                    </div>
                </div>
            </div>
        </div>
    );
}
import "./../../../../css/Player.css"
import Profile from "../ViewPlayerCard/PlayerCard";

export default function PlayerBlock(props) {

    function setPlayerInfoPage()
    {
        props.setContState(<Profile apUserId={props.info.pkId}
                                    setContState={props.setContState}/>);
    }

    // ----------------------------------------------------------------------------- //

    return (
        <div className="player-container" onClick={setPlayerInfoPage}>
            <div className="player-back-block" />
            <div className="row player-block-content">
                <div className="col-5">
                    <img id="profile-image" 
                         src={"http://localhost:5004/" + props.info.image}  
                         alt="" />
                </div>
                <div className="col-7 player-block-column">
                    <div className="row m-0">
                        {props.info.firstName + ' ' + props.info.lastName}
                    </div>
                    <div className="row m-0">
                        {(new Date(props.info.birth)).toLocaleString().substring(0, (new Date(props.info.birth)).toLocaleString().length - 3)}
                    </div>
                    <div className="row m-0">
                        {props.info.position}
                    </div>
                    {/*Выводить сюда не команду, а email -> потом выводить комманду*/}
                    <div className="row m-0">
                        {props.info.email}
                    </div>
                </div>
            </div>
        </div>
    );
}
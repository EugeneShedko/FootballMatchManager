import "./../css/player.css"
import Profile from "./userprofile/profile";

export default function PlayerBlock(props) {

    function setPlayerInfoPage()
    {
        {/*Получается страничка не совсем профиль, а карточка пользователя что-то типо этого*/}
        console.log("pred" + props.info.apUserId);
        props.setContState(<Profile apUserId={props.info.apUserId}
                                    setContState={props.setContState}/>);
    }

    return (
        <div className="player-container" onClick={setPlayerInfoPage}>
            <div className="player-back-block" />
            <div className="row player-block-content">
                <div className="col-5">
                    <img id="profile-image" src="/image/default-profile-icon.jpg" alt="" />
                </div>
                <div className="col-7 player-block-column">
                    <div className="row m-0">
                        {props.info.userFirstName + ' ' + props.info.userLastName}
                    </div>
                    <div className="row m-0">
                        {(new Date(props.info.userDateOfBirth)).toLocaleString().substring(0, (new Date(props.info.userDateOfBirth)).toLocaleString().length - 3)}
                    </div>
                    <div className="row m-0">
                        {props.info.userPosition}
                    </div>
                    {/*Выводить сюда не команду, а email -> потом выводить комманду*/}
                    <div className="row m-0">
                        {props.info.userEmail}
                    </div>
                </div>
            </div>
        </div>
    );
}
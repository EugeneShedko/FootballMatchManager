import { useContext } from "react";
import { Context } from "../../../..";

export default function ParticipanButtons(props) {

    const {userContext} = useContext(Context);

    // ---------------------------------------------------------- //

    function JoinButton() {
        return (
            <input className="team-join-button"
                type="button"
                value="Запрос на участие"
                onClick={props.sendReqForTeamGamePart}
            />
        );
    }

    // ---------------------------------------------------------- //

    function LeavButton() {
        return (
            <input className="team-join-button"
                type="button"
                value="Покинуть"
                onClick={props.leavFromTeamGame}
            />
        );
    }

    // ---------------------------------------------------------- //

    return (
        <div className="col tg-button-cont-2">
            {/* Здесь тоже проверяется на статус, это хорошо */}
            {/* Обазятельно изменить на статус */}            
            {
               props.game.status === 0 ?
               <JoinButton /> : 
               props.secTeamCreatorId === userContext.userId ?               
               <LeavButton />               
               :
               null} 
        </div>
    );
}
import { useContext } from "react";
import { Context } from "../../../..";

export default function ParticipanButtons(props) {

    const { userContext } = useContext(Context);

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

    function selectButtons(gameStatus) {
        switch (gameStatus) {
            case 0: return <JoinButton />;
            case 1: return props.secTeamCreatorId === userContext.userId ? <LeavButton /> : null;
            case 2: return <></>;
            case 3: return <></>;
        }
    }

    // ---------------------------------------------------------- //
    return (
        <>
            {selectButtons(props.game.status)}
        </>
    );
}
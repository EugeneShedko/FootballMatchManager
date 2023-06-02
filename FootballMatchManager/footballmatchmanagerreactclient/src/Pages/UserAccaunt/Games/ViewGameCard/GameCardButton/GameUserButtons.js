import CreatorButton from "./CreatorButtons";
import ParticipantButton from "./ParticipantButtons";

export default function GameUserButtons(props) {
    return (
        <>
            {props.isCreat ? <CreatorButton gameStatus={props.game.status}
                editGame={props.editGame}
                deleteMatch={props.deleteMatch} />
                :
                <ParticipantButton game={props.game}
                    isPart={props.isPart}
                    leaveMatch={props.leaveMatch}
                    sendRequestForPart={props.sendRequestForPart}
                    addToMatch={props.addToMatch}
                />}

        </>
    );
}
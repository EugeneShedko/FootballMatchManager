import "./../../../../css/TeamsGames/GameEventsContainer.css";
import Card from "./GameEventBlocks/Card";
import Change from "./GameEventBlocks/Change";
import Corner from "./GameEventBlocks/Corner";
import FreeKick from "./GameEventBlocks/FreeKick";
import Goal from "./GameEventBlocks/Goal";
import Penalty from "./GameEventBlocks/Penalty";


export default function GameEventsContainer(props)
{
    // -------------------------------------------------------- //

    /* Посмотреть, что я записываю в тип */
    /* Записываю я айди, что очень хреново */
    function getEventComponent(event)
    {

        /* ПРОПСЫ! */

        switch (event.eventTypeId) {
            case "goal": return <Goal event={event} />;
            case "yellowcard": return <Card event={event} />;
            case "redcard": return <Card event={event} />;
            case "penalty": return <Penalty event={event} />;
            case "freekick": return <FreeKick event={event} />;
            case "corner": return <Corner event={event} />;
            case "change": return <Change event={event} />;
            default: return null;
        }
    }

    // -------------------------------------------------------- //

    return(
        <div className="ge-info-cont">
            <div className="ge-info-absolute-cont">
                {props.events?.map((event) => getEventComponent(event))}
            </div>
        </div>
    )
}
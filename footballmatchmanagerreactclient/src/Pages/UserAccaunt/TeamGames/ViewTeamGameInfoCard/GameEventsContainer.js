import { useEffect, useRef } from "react";
import "./../../../../css/TeamsGames/GameEventsContainer.css";
import Card from "./GameEventBlocks/Card";
import Change from "./GameEventBlocks/Change";
import Corner from "./GameEventBlocks/Corner";
import FreeKick from "./GameEventBlocks/FreeKick";
import Goal from "./GameEventBlocks/Goal";
import Penalty from "./GameEventBlocks/Penalty";
import Assist from "./GameEventBlocks/Assist";


export default function GameEventsContainer(props) {

    const eventsCont = useRef(null);

    // -------------------------------------------------------- //

    function getEventComponent(event, index) {

        let type;
        let align;

        if (props.mode === 'view') {
            type = event.gameType.eventTypeId;
            align = event.eventTeam.pkId === props.teamId ? "event-left" : "event-right";
        }
        else {
            type = event.eventTypeId;
            align = event.teamId === props.teamId ? "event-left" : "event-right";
        }

        switch (type) {
            case "goal": return <Goal mode={props.mode}
                align={align}
                event1={event}
                event2={event}
                index={index}
                deleteTeamGameEvent={props.deleteTeamGameEvent}
            />;
            case "assist": return <Assist mode={props.mode}
                align={align}
                event1={event}
                event2={event}
                index={index}
                deleteTeamGameEvent={props.deleteTeamGameEvent}
            />;
            case "yellowcard": return <Card mode={props.mode}
                align={align}
                event1={event}
                event2={event}
                cardtype="yellow"
                index={index}
                deleteTeamGameEvent={props.deleteTeamGameEvent}
            />;
            case "redcard": return <Card mode={props.mode}
                teamId={props.teamId}
                align={align}
                event1={event}
                event2={event}
                cardtype="red"
                index={index}
                deleteTeamGameEvent={props.deleteTeamGameEvent}
            />;
            case "penalty": return <Penalty mode={props.mode}
                teamId={props.teamId}
                align={align}
                event1={event}
                event2={event}
                index={index}
                deleteTeamGameEvent={props.deleteTeamGameEvent}
            />;
            case "freekick": return <FreeKick mode={props.mode}
                teamId={props.teamId}
                align={align}
                event1={event}
                event2={event}
                index={index}
                deleteTeamGameEvent={props.deleteTeamGameEvent}
                
            />;
            case "corner": return <Corner mode={props.mode}
                teamId={props.teamId}
                align={align}
                event1={event}
                event2={event}
                index={index}
                deleteTeamGameEvent={props.deleteTeamGameEvent}
            />;
            case "change": return <Change mode={props.mode}
                teamId={props.teamId}
                align={align}
                event1={event}
                event2={event}
                index={index}
                deleteTeamGameEvent={props.deleteTeamGameEvent}
            />;
            default: return null;
        }
    }

    // ---------------- Скролл сообщений ------------------- //

    useEffect(() => {
        if (props.mode === 'create')
            eventsCont.current.scrollTop = eventsCont.current.scrollHeight;
    }, [props.events]);

    // -------------------------------------------------------- //

    return (
        <div className="ge-info-cont" ref={eventsCont}>
            <div className="ge-info-absolute-cont">
                {props.events?.sort((event1, event2) => parseInt(event1.time) - parseInt(event2.time))
                              .map((event, index) => getEventComponent(event, index))}
            </div>
        </div>
    )
}
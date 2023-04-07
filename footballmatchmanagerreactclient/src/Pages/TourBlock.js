/*Нужно чтобы страница матча и турнира отображалась корректно на главной страница
  и на странице в профиле пользователя, так как контейнеры имеют разные размеры*/
import { useState } from "react";
import "./../css/Game.css";
import TourInfoPage from "./TourInfoPage";

export default function TourBlock(props) {

    function setTourInfoPage() {
        props.setContState(<TourInfoPage tourId={props.info.tournamentId}
            setTours={props.setTours}
            setContState={props.setContState} />);
    }

    return (
        <div className="match-container" onClick={setTourInfoPage}>
            <div className="match-back-block" />
            <div className="row match-block-content">
                <div className="col-5 match-block-column">
                    <div className="row m-0">
                        {props.info.tournamentName}
                    </div>
                </div>
                <div className="col-7 match-block-column">
                    <div className="row m-0">
                        {(new Date(props.info.tournamentStartDate)).toLocaleString().substring(0, (new Date(props.info.tournamentStartDate)).toLocaleString().length - 3)}
                    </div>
                    <div className="row m-0">
                        {(new Date(props.info.tournamentEndDate)).toLocaleString().substring(0, (new Date(props.info.tournamentEndDate)).toLocaleString().length - 3)}
                    </div>
                    <div className="row m-0">
                        {props.info.tournamentPrizeFund}
                    </div>
                    <div className="row m-0">
                        {props.info.teamsNumber}
                    </div>
                </div>
            </div>
        </div>
    );
}
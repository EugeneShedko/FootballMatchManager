import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MatchBlock from "./matchblock";
import TourBlock from "./TourBlock";


export default function TourGenerator(props) {

    const searchTours = props.tours.filter(searchingTours =>{ 
    return String(searchingTours.tournamentName).toLowerCase().includes(props.searchString.toLowerCase().trim())
    })
    
    return (
        <div className="row mpmatches-absolute-container">
            {(searchTours.length === 0 && props.searchString != '') && <div>Пользователей нет</div>}
            {
                searchTours?.map((tour) => (
                    <div className="mpinfo-block">
                        <TourBlock  info={tour}
                                    setGames={props.setTours}
                                    setContState={props.setContState} />
                    </div>
                ))
            }
        </div>
    );
}
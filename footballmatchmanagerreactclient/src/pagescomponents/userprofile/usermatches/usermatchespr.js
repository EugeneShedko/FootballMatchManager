import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import MatchBlock from "../../matchblock";
import {Context} from "../../../index"


export default function UserMatchesCr(props) {

    const {user} = useContext(Context);

    const [userMatchPr, setUserMatchPr] = useState([]);

    useEffect(
        () => {

            const data = new FormData();
            data.append("userId", user.getUserId);

            axios.post('https://localhost:7277/api/profile/userpartmatch', data ,{ withCredentials: true })
                .then((response) => {
                    setUserMatchPr(response.data);
                    console.log("creator" + response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        toast.error("Ошибка получения матчей",
                            {
                                position: toast.POSITION.TOP_CENTER,
                                autoClose: 2000,
                                pauseOnFocusLoss: false
                            });
                    }
                });
            ;
        }, []
    );

    return (
        <div className="row mpmatches-main-container">
            <div className="col-12 mpmatches-container">
                <div className="row mpmatches-absolute-container">
                    {
                        userMatchPr.map((match) => (
                            <div className="mpinfo-block">
                                <MatchBlock info={match}
                                setContState={props.setContState}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

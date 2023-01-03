import axios from "axios";
import { toast } from "react-toastify";
import "./../../css/player.css"
import Profile from "../../pagescomponents/userprofile/Profile";
import AdminPlayerProfile from "./adminPlayerProfile";

export default function AdminPlayerBlock(props) {

    function setPlayerInfoPage(e) {

        if(e.target.id !== 'delete')
        {
        props.setContState(<AdminPlayerProfile apUserId={props.info.apUserId}
            setContState={props.setContState}
            setPlayers={props.setPlayers} />);
        }
    }

    function removeFromMatch() {
        //Хорошо бы вынести в константы
        axios.delete('http://localhost:5000/api/admin/profile/rmusfromgame/' + props.gameId + '/' + props.info.apUserId, { withCredentials: true })
        .then((response) => {
            toast.success(response.data.message,
                {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });
                props.setGame(response.data.currgame);
                props.setPlayers(response.data.users);
        })
        .catch((error) => {
            if (error.response) {
                toast.error(error.response.data.message,
                    {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
            }
        });

    }

    return (
        <div id="container" className="player-container" onClick={setPlayerInfoPage}>
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
                    {
                        props.isMatch ? <div className="row m-0">
                                    <input id="delete" 
                                           type="button" 
                                           value="Удалить" 
                                           className="pl-danger-button" 
                                           onClick={removeFromMatch} />
                                  </div> : null
                    }
                </div>
            </div>
        </div>
    );
}
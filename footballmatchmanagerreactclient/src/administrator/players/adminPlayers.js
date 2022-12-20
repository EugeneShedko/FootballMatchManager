import "./../../css/playerspage.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminPlayerBlock from "./adminPlayerBlock";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import AdminPlayerGenerator from "./AdminPlayerGenerator";


const AdminPlayers = observer((props) => {

    const [players, setPlayers] = useState([]);
    const [searchString, setSearchString] = useState("");

    useEffect(
        () => {
            axios.get('https://localhost:7277/api/admin/profile/allusers', { withCredentials: true })
                .then((response) => {
                    setPlayers(response.data);
                    console.log("allplayers" + response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        toast.error(userError.response.message,
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
        <div className="row ppplayers-main-container">
            <div className="col-9 ppplayers-container">
                <AdminPlayerGenerator players={players}
                                      searchString={searchString}
                                      setContState={props.setContState}
                                      setPlayers={setPlayers} />  
            </div>
            <div className="col-3 pplefcol">
                <div className="pp-fixed-container">
                    <div className="row pplcrow">
                        <input id="search-player-element" 
                               type="text" 
                               placeholder="Введите имя игрока" 
                               value={searchString}
                               onChange={(e) => setSearchString(e.target.value)} 
                               />
                    </div>
                    {/*Возможно форматы выводит, сделав запрос, пока что напишу текстом*/}
                    {/*чек боксам скорее всего нужно будет имена задать, что бы потом их можно было найти*/}
                    <div className="row filter-player-container">
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            НП
                        </label>
                        <label>

                            <input type="checkbox" className="checkbox-style" />
                            ЛПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            ППЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            АПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            ЦПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            ОПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            ЛЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            ПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            ЦЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" />
                            В
                        </label>
                        <input className="ppbutton-style" type="button" value="Применить" />
                    </div>
                </div>
            </div>
        </div>
    );
}  

)

export default AdminPlayers;
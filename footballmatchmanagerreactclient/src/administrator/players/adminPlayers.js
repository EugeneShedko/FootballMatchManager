import "./../../css/playerspage.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminPlayerBlock from "./adminPlayerBlock";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import AdminPlayerGenerator from "./AdminPlayerGenerator";


const AdminPlayers = observer((props) => {

    const [initPlayers, setInitPlayers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [searchString, setSearchString] = useState("");

    useEffect(
        () => {
            axios.get('https://localhost:7277/api/admin/profile/allusers', { withCredentials: true })
                .then((response) => {
                    setPlayers(response.data);
                    setInitPlayers(response.data);
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

    function filter()
    {
        var resultPlayers = [];
        var tempPlayers = [];
        var checkList = document.getElementsByName("aallplayers");

        for(var i = 0; i < checkList.length; i++)
        {
            if(checkList[i].checked)
            {
                tempPlayers = initPlayers.filter(player => {
                    return String(player.userPosition).toLowerCase().includes(checkList[i].value.toLowerCase().trim());
                })
                resultPlayers = resultPlayers.concat(tempPlayers);
            }
        }

        if(resultPlayers.length > 0)
        {
            setPlayers(resultPlayers);
        }
    }

    function reset()
    {
        setPlayers(initPlayers);
        var checkList = document.getElementsByName("aallplayers");
        for(var i = 0; i < checkList.length; i++)
        {
            checkList[i].checked = false;
        }
    }

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
                            <input type="checkbox" className="checkbox-style"  name="aallplayers" value="Нападающий"/>
                            НП
                        </label>
                        <label>

                            <input type="checkbox" className="checkbox-style" name="aallplayers" value="Левый полузащитник" />
                            ЛПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="aallplayers" value="Правый полузащитник" />
                            ППЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="aallplayers" value="Атакующий полузащитник" />
                            АПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="aallplayers" value="Центральный полузащитник" />
                            ЦПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="aallplayers" value="Опорный полузащитник" />
                            ОПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="aallplayers" value="Левый защитник" />
                            ЛЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="aallplayers" value="Правый защитник" />
                            ПЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="aallplayers" value="Центральный защитник" />
                            ЦЗ
                        </label>
                        <label>
                            <input type="checkbox" className="checkbox-style" name="aallplayers" value="Вратарь" />
                            В
                        </label>
                        <input className="ppbutton-style" 
                               type="button" 
                               value="Применить"
                               onClick={filter} />
                        <input className="ppbutton-style" 
                               type="button" 
                               value="Сбросить"
                               onClick={reset}/>
                    </div>
                </div>
            </div>
        </div>
    );
}  

)

export default AdminPlayers;
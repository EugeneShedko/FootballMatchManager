import "./../../css/playerspage.css"
import PlayerBlock from "../playerblock";

export default function Players() {

    const somePlayerInfo = [

        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Манчестер Юнайтед"
        },
        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Нет комманды"
        },
        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Манчестер Юнайтед"
        },
        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Манчестер Юнайтед"
        },
        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Манчестер Юнайтед"
        },
        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Манчестер Юнайтед"
        },
        {
            playerName: "Евгений Шедько",
            playerBithDate: "18.05.2002",
            playerPosition: "НП",
            playerTeam: "Манчестер Юнайтед"
        },
    ]

    return (
        <div className="row ppplayers-main-container">
            <div className="col-9 ppplayers-container">
                <div className="row ppplayers-absolute-container">
                    {somePlayerInfo.map((player) => (
                        <div className="ppinfo-block">
                            <PlayerBlock info={player} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-3 pplefcol">
                <div className="pp-fixed-container">
                    <div className="row pplcrow">
                        <input id="search-player-element" type="text" placeholder="Введите имя игрока" />
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
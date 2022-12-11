import MatchBlock from "../../matchblock";

{/*Можно через пропс передавить параметр, чтобы понимать, какую выборку делать*/ }

export default function UserTournaments() {

    const someTournamentsInfo = [

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"
        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },
        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },

        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },
        
        {
            matchName: "Четкие перцы!",
            matchTime: "18.10.2022 15:00",
            matchFormat: "11x11",
            matchAdress: "Минская обл,г.Минск,2-й пер.Шевченко 25A",
            playersCount: "10/22"

        },
    ]

    return (
        <div className="row mpmatches-main-container">
            <div className="col-12 mpmatches-container">
                <div className="row mpmatches-absolute-container">
                    {someTournamentsInfo.map((tournament) => (
                        <div className="mpinfo-block">
                            <MatchBlock info={tournament} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

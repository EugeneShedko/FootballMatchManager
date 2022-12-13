import React, { useState } from "react";
import MainContent from "./MainContent";

export default function ContentContainer() {

    /*Нужно вываливаться при клике на логона главную страницу -> потом это сделать, нет времени сейчас, но обязательно*/
    const [contentContainerState, setContentContainerState] = useState({
        component: <MainContent setContState={wrapSetContentContainerState} />
    });

    function wrapSetContentContainerState(com) {
        setContentContainerState({
            component: com
        });
    }

    return (
        <div id="body-content" className="row m-0 h-100">
            {contentContainerState.component}
        </div>
    );
}
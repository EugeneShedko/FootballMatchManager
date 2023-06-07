import React, { useState } from "react";
import MainContent from "./MainContent";
import { Outlet } from "react-router-dom";

export default function ContentContainer() {

    return (
        <div id="body-content" className="row m-0 h-100">
            <Outlet />
            <MainContent />
        </div>
    );
}
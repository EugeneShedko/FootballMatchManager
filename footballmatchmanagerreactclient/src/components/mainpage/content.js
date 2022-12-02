import React, { useState } from "react";
export default function Content() {
    return (
        <div id="body-content" className="row justify-content-center">
            <div className="col-3 p-0 m-0">
                <div className="search-block">
                    <input className="serach-element" type="text" placeholder="Введите для поиска матча ..." />
                </div>
                {/*Вот это должно автоматически заполнятся из запроса*/}
                <div className="row info-block">
                    <div className="back-block info-block-back" />
                    <div className="info-block-content">
                        <div className="row info-block-row">
                            <div className="info-block-column info-block-column-left">
                                Четкие перцы!
                            </div>
                            <div className="info-block-column info-block-column-right">
                                18.10.2022 15:00
                            </div>
                        </div>
                        <div className="row info-block-row">
                            <div className="info-block-column info-block-column-left" />
                            <div className="info-block-column info-block-column-right">
                                11x11
                            </div>
                        </div>
                        <div className="row info-block-row">
                            <div className="info-block-column info-block-column-left" />
                            <div className="info-block-column info-block-column-right">
                                Минская обл,г.Минск,2-й пер.Шевченко 25A
                            </div>
                        </div>
                        <div className="row info-block-row">
                            <div className="info-block-column info-block-column-left" />
                            <div className="info-block-column info-block-column-right">
                                10/22
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-3 p-0 m-0">
                <div className="search-block">
                    <input className="serach-element" type="text" placeholder="Введите для поиска турнира ..." />
                </div>
                {/*Вот это должно автоматически заполнятся из запроса*/}
                <div className="row info-block">
                    <div className="back-block info-block-back" />
                    <div className="info-block-content">
                        <div className="row info-block-row">
                            <div className="info-block-column info-block-column-left">
                                Четкие перцы!
                            </div>
                            <div className="info-block-column info-block-column-right">
                                18.10.2022 15:00
                            </div>
                        </div>
                        <div className="row info-block-row">
                            <div className="info-block-column info-block-column-left" />
                            <div className="info-block-column info-block-column-right">
                                11x11
                            </div>
                        </div>
                        <div className="row info-block-row">
                            <div className="info-block-column info-block-column-left" />
                            <div className="info-block-column info-block-column-right">
                                Минская обл,г.Минск,2-й пер.Шевченко 25A
                            </div>
                        </div>
                        <div className="row info-block-row">
                            <div className="info-block-column info-block-column-left" />
                            <div className="info-block-column info-block-column-right">
                                10/22
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
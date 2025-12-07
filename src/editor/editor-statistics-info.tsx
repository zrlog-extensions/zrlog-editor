import {FunctionComponent} from "react";
import {getBorder} from "./editor-helpers";
import RubbishText from "./RubbishText";
import {getEditorRes} from "./lang/editor-lang";

export type EditorStatisticsInfo = {
    contentWordsLength: number;
    contentLinesLength: number;
};

export type EditorStatisticsInfoProps = {
    data: EditorStatisticsInfo;
    fullScreen?: boolean;
    offline: boolean;
    rubbish: boolean;
    lastUpdateDate: number;
    dark: boolean;
};

const EditorStatistics: FunctionComponent<EditorStatisticsInfoProps> = ({
                                                                            data,
                                                                            fullScreen,
                                                                            offline,
                                                                            rubbish,
                                                                            lastUpdateDate,
                                                                            dark
                                                                        }) => {
    return (
        <div
            style={{
                position: fullScreen ? "fixed" : "absolute",
                borderTop: getBorder(dark),
                left: 0,
                width: "100%",
                height: 30,
                boxSizing: "content-box",
                display: "flex",
                alignItems: "center",
                fontSize: 14,
                bottom: 0,
                userSelect: "none",
                background: dark ? "#141414" : "white",
                justifyContent: "space-around",
            }}
        >
            <div style={{display: "flex", flex: 1}}>
                <span style={{padding: 16, paddingLeft: 40, whiteSpace: "nowrap"}}>
                    {getEditorRes("wordsCount")}
                    <span style={{paddingRight: 4, paddingLeft: 4}}>:</span>
                    <b style={{marginLeft: 18, width: 60}}>{data.contentWordsLength}</b>
                </span>
                <span style={{padding: 16, whiteSpace: "nowrap"}}>
                    {getEditorRes("linesCount")}
                    <span style={{paddingRight: 4, paddingLeft: 4}}>:</span>
                    <b style={{marginLeft: 18, width: 60}}>{data.contentLinesLength}</b>
                </span>
            </div>
            <div style={{paddingRight: 8}}>
                <RubbishText
                    offline={offline}
                    rubbish={rubbish}
                    lastUpdateDate={lastUpdateDate}
                    fullScreen={fullScreen ? fullScreen : false}
                />
            </div>
        </div>
    );
};

export default EditorStatistics;

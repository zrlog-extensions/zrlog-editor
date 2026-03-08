import {FunctionComponent} from "react";
import RubbishText from "./RubbishText";
import {getEditorRes} from "./lang/editor-lang";
import {Divider} from "antd";

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
                                                                        }) => {
    return (
        <div style={{
            position: fullScreen ? "fixed" : "absolute",
            left: 0,
            width: "100%",
            bottom: 0,
        }}>
            <Divider style={{margin: 0, padding: 0}}/>
            <div
                style={{
                    height: 29,
                    display: "flex",
                    alignItems: "center",
                    fontSize: 14,
                    userSelect: "none",
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
        </div>
    );
};

export default EditorStatistics;

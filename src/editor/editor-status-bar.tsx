import {FunctionComponent, ReactNode} from "react";
import RubbishText from "./RubbishText";
import {getEditorRes} from "./lang/editor-lang";
import {Divider} from "antd";

export type EditorStatusBarInfo = {
    contentWordsLength: number;
    contentLinesLength: number;
};

export type EditorStatusBarExtraPlacement = "left" | "center" | "right";

export type EditorStatusBarProps = {
    data: EditorStatusBarInfo;
    fullScreen?: boolean;
    offline: boolean;
    rubbish: boolean;
    lastUpdateDate: number;
    dark: boolean;
    extra?: ReactNode;
    extraPlacement?: EditorStatusBarExtraPlacement;
};

const EditorStatusBar: FunctionComponent<EditorStatusBarProps> = ({
                                                                      data,
                                                                      fullScreen,
                                                                      offline,
                                                                      rubbish,
                                                                      lastUpdateDate,
                                                                      extra,
                                                                      extraPlacement = "right",
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
                    justifyContent: "space-between",
                }}
            >
                <div style={{display: "flex", flex: 1, alignItems: "center", minWidth: 0}}>
                    {extraPlacement === "left" && <span style={{paddingLeft: 8}}>{extra}</span>}
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
                {extraPlacement === "center" && <div>{extra}</div>}
                <div style={{display: "flex", alignItems: "center", gap: 8, paddingRight: 8}}>
                    {extraPlacement === "right" && extra}
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

export default EditorStatusBar;

import React from "react";
import EditorIcon from "./editor-icon";
import AIIcon from "../ai/AIIcon";
import AIButton from "../ai/AIButton";
import {getBgColor} from "./editor-helpers";
import {EditorToolBarDivider} from "./editor-tool-bar";
import {AIConfig} from "./editor.types";
import {AxiosInstance} from "axios";

export interface SelectionToolbarProps {
    visible: boolean;
    top: number;
    left: number;
    onBold: () => void;
    onItalic: () => void;
    onStrikethrough: () => void;
    selectedText: string;
    getContainer?: () => HTMLElement;
    dark: boolean;
    aiConfig?: AIConfig;
    onAi?: () => void;
    axiosInstance?: AxiosInstance;
}

export const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
                                                                      visible,
                                                                      top,
                                                                      left,
                                                                      onBold,
                                                                      onStrikethrough,
                                                                      selectedText,
                                                                      onItalic,
                                                                      getContainer,
                                                                      dark,
                                                                      aiConfig,
                                                                      onAi,
                                                                      axiosInstance

                                                                  }) => {
    if (!visible) return null;

    return (
        <div
            style={{
                position: "fixed",
                top,
                left,
                padding: 4,
                borderRadius: 4,
                display: "flex",
                gap: 8,
                zIndex: 1,
                alignItems: "center",
                background: getBgColor(dark),
            }}
            // 避免点击时让编辑器失焦 / 选区消失
            onMouseDown={(e) => e.preventDefault()}
        >
            <EditorIcon name={"bold"} onClick={onBold}/>
            <EditorIcon name={"strikethrough"} onClick={onStrikethrough}/>
            <EditorIcon name={"italic"} onClick={onItalic}/>
            <EditorToolBarDivider dark={dark}/>
            {aiConfig && <AIButton
                drawerWidth={aiConfig.drawerWidth}
                dark={dark}
                axiosInstance={axiosInstance}
                input={selectedText}
                onSizeChange={aiConfig.onSizeChange}
                subject={aiConfig.subject}
                sessionId={aiConfig.sessionId}
                apiUri={aiConfig.aiApiUri}
                configUrl={aiConfig.configUrl}
                aiProvider={aiConfig.aiProvider}
                getContainer={getContainer}
                user={aiConfig.user}
                aiMessages={aiConfig.aiMessages}
                onAiMessagesChange={aiConfig.onAiMessagesChange}
                onOpen={() => {
                    if (onAi) {
                        onAi();
                    }
                }}
            >
                <div
                    className={"editor-icon"}
                    style={{
                        cursor: "pointer",
                        minWidth: 34,
                        display: "flex",
                        alignItems: "center",
                        color: "rgb(119, 119, 119)",
                        fontSize: 16,
                        height: 38,
                        borderRadius: 6,
                        justifyContent: "center",
                    }}
                >
                    <AIIcon name={aiConfig.aiProvider}/>
                </div>
            </AIButton>}
        </div>
    );
};

export default SelectionToolbar;

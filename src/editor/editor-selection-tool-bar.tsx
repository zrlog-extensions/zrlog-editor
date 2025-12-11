import React from "react";
import EditorIcon from "./editor-icon";
import AIIcon from "../ai/AIIcon";
import AIButton from "../ai/AIButton";
import {getBgColor} from "./editor-helpers";
import {EditorToolBarDivider} from "./editor-tool-bar";
import {AIConfig} from "./editor.types";
import {AxiosInstance} from "axios";
import {Fa7SolidBold} from "./icons/Fa7SolidBold";
import {Fa7SolidStrikethrough} from "./icons/Fa7SolidStrikethrough";
import {Fa7SolidItalic} from "./icons/Fa7SolidItalic";

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
            <EditorIcon onClick={onBold}>
                <Fa7SolidBold/>
            </EditorIcon>
            <EditorIcon onClick={onStrikethrough}>
                <Fa7SolidStrikethrough/>
            </EditorIcon>
            <EditorIcon onClick={onItalic}>
                <Fa7SolidItalic/>
            </EditorIcon>
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
                <EditorIcon>
                    <AIIcon name={aiConfig.aiProvider}/>
                </EditorIcon>
            </AIButton>}
        </div>
    );
};

export default SelectionToolbar;

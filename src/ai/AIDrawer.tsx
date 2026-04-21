import {Drawer} from "antd";
import {FunctionComponent, useEffect, useRef, useState} from "react";
import {InfoCircleOutlined} from "@ant-design/icons";
import {AIProviderType, EditorUser} from "../type";
import AIIcon from "./AIIcon";
import {AIContent} from "./AIContentItem";
import {Content} from "antd/es/layout/layout";
import AIChatContentPanel from "./AIChatContentPanel";
import {getEditorRes} from "../editor/lang/editor-lang";
import {AxiosInstance} from "axios";
import AIInput from "./AIInput";

type AIDrawerProps = {
    input: string;
    sessionId: number;
    apiUri: string;
    onClose?: () => void;
    hide: boolean;
    aiProvider: AIProviderType;
    getContainer?: () => HTMLElement;
    subject?: string;
    aiMessages?: AIContent[];
    onAiMessagesChange?: (messages: AIContent[]) => void;
    axiosInstance?: AxiosInstance;
    defaultWidth?: number | "large" | "default";
    dark: boolean;
    user?: EditorUser;
    onSizeChange?: (size: number) => void;
};

type AIDrawerState = {
    open: boolean;
    contents: AIContent[];
};

const cacheKey = "aiDrawerOpen";

export const getAiDrawerOpen = (): boolean => {
    return window[cacheKey] === true;
}


const AIDrawer: FunctionComponent<AIDrawerProps> = ({
                                                        sessionId,
                                                        input,
                                                        onClose,
                                                        getContainer,
                                                        apiUri,
                                                        hide,
                                                        aiProvider,
                                                        subject,
                                                        aiMessages = [],
                                                        onAiMessagesChange = () => {
                                                            //ignore
                                                        },
                                                        axiosInstance,
                                                        defaultWidth,
                                                        dark,
                                                        user,
                                                        onSizeChange
                                                    }) => {


    const [size, setSize] = useState<string | number>(defaultWidth ? defaultWidth : "large");

    const [state, setState] = useState<AIDrawerState>({
        open: !hide,
        contents: aiMessages
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const realHide = useRef<boolean>(hide);


    useEffect(() => {
        setState((prevState) => {
            return {
                ...prevState,
                open: !hide,
            };
        });
        realHide.current = hide;
        window[cacheKey] = !hide;
    }, [hide]);

    useEffect(() => {
        window[cacheKey] = state.open;
    }, [state.open]);


    return (
        <Drawer
            title={
                <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                    <AIIcon name={aiProvider}/>
                    <span>{getEditorRes("ai").ai} </span>
                    <span>{subject && subject.length > 0 ? "[ " + subject + " ]" : ""}</span>
                </div>
            }
            resizable={{
                onResize: (n) => {
                    if (n <= 378) {
                        setSize("default");
                    } else {
                        setSize(n);
                    }
                    if (onSizeChange) {
                        onSizeChange(n)
                    }
                },
            }}
            placement="right"
            size={size as number}
            closable={{placement: "end"}}
            keyboard={true}
            autoFocus={false}
            onClose={() => {
                setState((prevState) => {
                    return {
                        ...prevState,
                        open: false,
                    };
                });
                if (onClose) {
                    onClose();
                }
            }}
            styles={{
                header: {
                    padding: 12,
                },
                body: {
                    padding: 12,
                    overflowX: "hidden",
                },
            }}
            open={state.open}
            getContainer={getContainer}
        >
            <Content>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        overflow: "auto",
                        width: "100%",
                    }}
                >
                    {state.open &&
                        <div style={{display: "flex", width: "100%", flexDirection: "column", alignItems: "center"}}>
                            <AIChatContentPanel user={user} dark={dark} contents={state.contents}
                                                aiProvider={aiProvider}/>
                            <div ref={messagesEndRef} style={{height: 2}}/>
                        </div>
                    }
                    <AIInput aiMessages={state.contents} onAiMessagesChange={(messages) => {
                        setState((prevState) => {
                            return {
                                ...prevState,
                                contents: messages,
                            }
                        })
                        if (onAiMessagesChange) {
                            onAiMessagesChange(messages)
                        }
                    }} axiosInstance={axiosInstance} defaultInput={input} apiUri={apiUri} sessionId={sessionId}/>
                    {state.contents.length > 0 && (
                        <span style={{position: "absolute", bottom: 6, fontSize: 12}}>
                            <InfoCircleOutlined style={{paddingRight: 4}}/> {getEditorRes("ai").contentTips}
                        </span>
                    )}
                </div>
            </Content>
        </Drawer>
    );
};

export default AIDrawer;

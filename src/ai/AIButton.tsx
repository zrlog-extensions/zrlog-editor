import AIDrawer from "./AIDrawer";
import {Link} from "react-router-dom";
import {AIProviderType, EditorUser} from "../type";
import {FunctionComponent, PropsWithChildren, useState} from "react";
import Popconfirm from "antd/es/popconfirm";
import {AIContent} from "./AIContentItem";
import {getEditorRes} from "../editor/lang/editor-lang";
import {AxiosInstance} from "axios";

type AIButtonProps = PropsWithChildren & {
    input: string;
    sessionId: number;
    apiUri: string;
    onClose?: () => void;
    onOpen?: () => void;
    aiProvider: AIProviderType;
    getContainer?: () => HTMLElement;
    subject?: string;
    aiMessages?: AIContent[];
    onAiMessagesChange?: (messages: AIContent[]) => void;
    configUrl?: string;
    dark: boolean;
    user?: EditorUser;
    drawerWidth?: number | "default" | "large";
    axiosInstance?: AxiosInstance;
    onSizeChange?: (newSize: number) => void;
};

const AIButton: FunctionComponent<AIButtonProps> = ({
                                                        input,
                                                        subject,
                                                        aiProvider,
                                                        sessionId,
                                                        getContainer,
                                                        children,
                                                        onClose,
                                                        onOpen,
                                                        aiMessages,
                                                        onAiMessagesChange,
                                                        configUrl,
                                                        dark,
                                                        user,
                                                        apiUri,
                                                        drawerWidth,
                                                        axiosInstance,
                                                        onSizeChange
                                                    }) => {
    const needConfig = (aiProvider as string) === "" || aiProvider === null || aiProvider === undefined;
    const [aiOpen, setAiOpen] = useState<boolean>(false);

    return (
        <>
            <AIDrawer
                dark={dark}
                aiProvider={aiProvider}
                hide={!aiOpen}
                apiUri={apiUri}
                input={input}
                subject={subject}
                sessionId={sessionId}
                onClose={() => {
                    setAiOpen(false);
                    if (onClose) {
                        onClose();
                    }
                }}
                user={user}
                defaultWidth={drawerWidth}
                onAiMessagesChange={onAiMessagesChange}
                aiMessages={aiMessages}
                getContainer={getContainer}
                axiosInstance={axiosInstance}
                onSizeChange={onSizeChange}
            />
            <Popconfirm
                disabled={!needConfig}
                title={getEditorRes("ai").askConfig}
                okText={<Link to={configUrl ? configUrl : "#miss"}>{getEditorRes("setting")}</Link>}
            >
                <div
                    onClick={() => {
                        if (needConfig) {
                            return;
                        }
                        setAiOpen(true);
                        if (onOpen) {
                            onOpen();
                        }
                    }}
                >
                    {children}
                </div>
            </Popconfirm>
        </>
    );
};

export default AIButton;

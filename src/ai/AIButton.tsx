import AIDrawer, {getAiDrawerOpen} from "./AIDrawer";
import {Link} from "react-router-dom";
import {AIProviderType, EditorUser} from "../type";
import {CSSProperties, FunctionComponent, PropsWithChildren, ReactNode, RefObject, useState} from "react";
import Popconfirm from "antd/es/popconfirm";
import AIContentItem, {AIContent} from "./AIContentItem";
import {getEditorRes} from "../editor/lang/editor-lang";
import {AxiosInstance} from "axios";
import {Button, theme} from "antd";
import AIIcon from "./AIIcon";

export type AIButtonRenderMessageOptions = {
    content: AIContent;
    index: number;
    defaultNode: ReactNode;
};

type AIButtonProps = PropsWithChildren & {
    input?: string;
    sessionId?: number;
    apiUri?: string;
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

    messages?: AIContent[];
    onOpenChange?: (open: boolean) => void;
    onContentScroll?: () => void;
    contentScrollRef?: RefObject<HTMLDivElement>;
    contentEndRef?: RefObject<HTMLDivElement>;
    contentMaxWidth?: number;
    disabled?: boolean;
    triggerClassName?: string;
    triggerLabel?: ReactNode;
    triggerStyle?: CSSProperties;
    triggerTitle?: string;
    renderMessage?: (options: AIButtonRenderMessageOptions) => ReactNode;
    footer?: ReactNode;
    overlays?: ReactNode;
    open?: boolean;
};

const DEFAULT_CONTENT_MAX_WIDTH = 768;

export const getAIButtonDrawerOpen = getAiDrawerOpen;

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
                                                        onSizeChange,
                                                        messages,
                                                        onOpenChange,
                                                        onContentScroll,
                                                        contentScrollRef,
                                                        contentEndRef,
                                                        contentMaxWidth = DEFAULT_CONTENT_MAX_WIDTH,
                                                        disabled,
                                                        triggerClassName,
                                                        triggerLabel,
                                                        triggerStyle,
                                                        triggerTitle,
                                                        renderMessage,
                                                        footer,
                                                        overlays,
                                                        open: controlledOpen,
                                                    }) => {
    const needConfig = (aiProvider as string) === "" || aiProvider === null || aiProvider === undefined;
    const [aiOpen, setAiOpen] = useState<boolean>(false);
    const {token} = theme.useToken();
    const extensibleMode = messages !== undefined || renderMessage !== undefined || footer !== undefined;
    const realOpen = controlledOpen === undefined ? aiOpen : controlledOpen;

    const changeOpen = (nextOpen: boolean) => {
        if (controlledOpen === undefined) {
            setAiOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
        if (nextOpen) {
            onOpen?.();
        } else {
            onClose?.();
        }
    };

    const close = () => {
        onContentScroll?.();
        changeOpen(false);
    };

    const renderDefaultMessage = (content: AIContent) => (
        <AIContentItem content={content} aiProvider={aiProvider} user={user} dark={dark}/>
    );

    const renderExtensibleDrawer = () => (
        <AIDrawer
            dark={dark}
            aiProvider={aiProvider}
            open={realOpen}
            subject={subject}
            onClose={close}
            user={user}
            defaultWidth={drawerWidth}
            getContainer={getContainer}
            onSizeChange={onSizeChange}
        >
            <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                <div
                    ref={contentScrollRef}
                    style={{flex: 1, overflowY: "auto", padding: 12}}
                    onScroll={onContentScroll}
                >
                    <div style={{maxWidth: contentMaxWidth, margin: "0 auto", width: "100%"}}>
                        {(messages ?? []).map((content, index) => {
                            const defaultNode = renderDefaultMessage(content);
                            return (
                                <div key={index} style={{paddingBottom: 12}}>
                                    {renderMessage ? renderMessage({content, index, defaultNode}) : defaultNode}
                                </div>
                            );
                        })}
                        <div ref={contentEndRef}/>
                    </div>
                </div>
                {footer && (
                    <div
                        style={{
                            borderTop: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
                            padding: 12,
                        }}
                    >
                        <div style={{maxWidth: contentMaxWidth, margin: "0 auto", width: "100%"}}>{footer}</div>
                    </div>
                )}
            </div>
            {overlays}
        </AIDrawer>
    );

    const renderTrigger = () => {
        if (children) {
            return (
                <div
                    onClick={() => {
                        if (needConfig) {
                            return;
                        }
                        changeOpen(true);
                    }}
                >
                    {children}
                </div>
            );
        }
        return (
            <Button
                className={triggerClassName}
                type={"primary"}
                icon={<AIIcon name={aiProvider}/>}
                disabled={disabled}
                style={triggerStyle}
                title={triggerTitle}
                onClick={() => changeOpen(true)}
            >
                {triggerLabel}
            </Button>
        );
    };

    return (
        <>
            {extensibleMode ? (
                renderExtensibleDrawer()
            ) : (
                <AIDrawer
                    dark={dark}
                    aiProvider={aiProvider}
                    hide={!aiOpen}
                    apiUri={apiUri}
                    input={input}
                    subject={subject}
                    sessionId={sessionId}
                    onClose={() => changeOpen(false)}
                    user={user}
                    defaultWidth={drawerWidth}
                    onAiMessagesChange={onAiMessagesChange}
                    aiMessages={aiMessages}
                    getContainer={getContainer}
                    axiosInstance={axiosInstance}
                    onSizeChange={onSizeChange}
                />
            )}
            <Popconfirm
                disabled={!needConfig}
                title={getEditorRes("ai").askConfig}
                okText={<Link to={configUrl ? configUrl : "#miss"}>{getEditorRes("setting")}</Link>}
            >
                {renderTrigger()}
            </Popconfirm>
        </>
    );
};

export default AIButton;

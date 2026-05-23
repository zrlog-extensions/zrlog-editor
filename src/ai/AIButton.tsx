import AIDrawer, {getAiDrawerOpen} from "./AIDrawer";
import {Link} from "react-router-dom";
import {AIProviderType, EditorUser} from "../type";
import {
    CSSProperties,
    FunctionComponent,
    MutableRefObject,
    PropsWithChildren,
    ReactNode,
    RefObject,
    useEffect,
    useRef,
    useState
} from "react";
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

export type AIButtonScrollCache = {
    key: string;
    read: (key: string) => number | undefined;
    write: (key: string, scrollTop: number) => void;
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
    scrollCache?: AIButtonScrollCache;
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
                                                        scrollCache,
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
    const internalContentScrollRef = useRef<HTMLDivElement | null>(null);
    const internalContentEndRef = useRef<HTMLDivElement | null>(null);
    const restoredScrollCacheKeyRef = useRef<string>();
    const scrollWriteFrameRef = useRef<number>();
    const lastMessageLengthRef = useRef(0);

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
        saveScrollTop();
        changeOpen(false);
    };

    const setContentScrollElement = (el: HTMLDivElement | null) => {
        internalContentScrollRef.current = el;
        if (contentScrollRef) {
            (contentScrollRef as MutableRefObject<HTMLDivElement | null>).current = el;
        }
    };

    const setContentEndElement = (el: HTMLDivElement | null) => {
        internalContentEndRef.current = el;
        if (contentEndRef) {
            (contentEndRef as MutableRefObject<HTMLDivElement | null>).current = el;
        }
    };

    const saveScrollTop = () => {
        const scrollElement = internalContentScrollRef.current;
        if (!scrollElement || !scrollCache) {
            onContentScroll?.();
            return;
        }
        if (scrollWriteFrameRef.current) {
            cancelAnimationFrame(scrollWriteFrameRef.current);
        }
        scrollWriteFrameRef.current = requestAnimationFrame(() => {
            scrollCache.write(scrollCache.key, scrollElement.scrollTop);
            scrollWriteFrameRef.current = undefined;
        });
        onContentScroll?.();
    };

    useEffect(() => {
        if (!realOpen || !scrollCache) {
            return;
        }
        const scrollElement = internalContentScrollRef.current;
        if (!scrollElement) {
            return;
        }
        if (restoredScrollCacheKeyRef.current !== scrollCache.key) {
            restoredScrollCacheKeyRef.current = scrollCache.key;
            const cachedScrollTop = scrollCache.read(scrollCache.key);
            const restoreScroll = () => {
                if (typeof cachedScrollTop === "number") {
                    scrollElement.scrollTop = cachedScrollTop;
                    return;
                }
                scrollElement.scrollTop = scrollElement.scrollHeight;
            };
            requestAnimationFrame(restoreScroll);
            window.setTimeout(restoreScroll, 120);
            lastMessageLengthRef.current = (messages ?? []).length;
            return;
        }
        if ((messages ?? []).length > lastMessageLengthRef.current) {
            internalContentEndRef.current?.scrollIntoView({block: "end"});
        }
        lastMessageLengthRef.current = (messages ?? []).length;
    }, [messages, realOpen, scrollCache]);

    useEffect(() => {
        return () => {
            if (scrollWriteFrameRef.current) {
                cancelAnimationFrame(scrollWriteFrameRef.current);
            }
        };
    }, []);

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
                    ref={setContentScrollElement}
                    style={{flex: 1, overflowY: "auto", padding: 12}}
                    onScroll={saveScrollTop}
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
                        <div ref={setContentEndElement}/>
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

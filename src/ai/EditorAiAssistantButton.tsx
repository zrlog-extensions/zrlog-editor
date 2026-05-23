import {Button, Drawer, Grid, Space, theme} from "antd";
import {CSSProperties, FunctionComponent, ReactNode, RefObject, useEffect, useState} from "react";
import AIIcon from "./AIIcon";
import AIContentItem, {AIContent} from "./AIContentItem";
import {AIProviderType, EditorUser} from "../type";
import {getEditorRes} from "../editor/lang/editor-lang";

export type EditorAiAssistantRenderMessageOptions = {
    content: AIContent;
    index: number;
    defaultNode: ReactNode;
};

export type EditorAiAssistantButtonProps = {
    aiProvider: AIProviderType;
    dark: boolean;
    messages: AIContent[];
    user?: EditorUser;
    subject?: string;
    getContainer?: () => HTMLElement;
    drawerWidth?: number | "default" | "large";
    onDrawerSizeChange?: (newSize: number) => void;
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
    renderMessage?: (options: EditorAiAssistantRenderMessageOptions) => ReactNode;
    footer?: ReactNode;
    overlays?: ReactNode;
    open?: boolean;
};

const DEFAULT_CONTENT_MAX_WIDTH = 768;

let editorAiAssistantDrawerOpen = false;

export const getEditorAiAssistantDrawerOpen = () => editorAiAssistantDrawerOpen;

const resolveDrawerWidth = (width?: number | "default" | "large") => {
    if (typeof width === "number") {
        return width;
    }
    if (width === "default") {
        return 378;
    }
    return 560;
};

const EditorAiAssistantButton: FunctionComponent<EditorAiAssistantButtonProps> = ({
                                                                                      aiProvider,
                                                                                      dark,
                                                                                      messages,
                                                                                      user,
                                                                                      subject,
                                                                                      getContainer,
                                                                                      drawerWidth,
                                                                                      onDrawerSizeChange,
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
    const [open, setOpen] = useState(false);
    const [size, setSize] = useState(resolveDrawerWidth(drawerWidth));
    const screens = Grid.useBreakpoint();
    const {token} = theme.useToken();
    const realOpen = controlledOpen === undefined ? open : controlledOpen;

    const changeOpen = (nextOpen: boolean) => {
        if (controlledOpen === undefined) {
            setOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
    };

    useEffect(() => {
        editorAiAssistantDrawerOpen = realOpen;
        return () => {
            editorAiAssistantDrawerOpen = false;
        };
    }, [realOpen]);

    useEffect(() => {
        setSize(resolveDrawerWidth(drawerWidth));
    }, [drawerWidth]);

    const close = () => {
        onContentScroll?.();
        changeOpen(false);
    };

    const renderDefaultMessage = (content: AIContent) => (
        <AIContentItem content={content} aiProvider={aiProvider} user={user} dark={dark}/>
    );

    return (
        <>
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
            <Drawer
                title={
                    <Space>
                        <AIIcon name={aiProvider}/>
                        <span>{getEditorRes("ai").ai}</span>
                        <span>{subject && subject.length > 0 ? `[ ${subject} ]` : ""}</span>
                    </Space>
                }
                placement="right"
                size={screens.sm ? size : "100%"}
                resizable={
                    screens.sm
                        ? {
                            onResize: (nextWidth) => {
                                setSize(nextWidth);
                                onDrawerSizeChange?.(nextWidth);
                            },
                        }
                        : false
                }
                open={realOpen}
                autoFocus={false}
                keyboard={true}
                onClose={close}
                getContainer={getContainer}
                styles={{
                    header: {
                        padding: 12,
                    },
                    body: {
                        padding: 0,
                        overflow: "hidden",
                    },
                }}
            >
                <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                    <div
                        ref={contentScrollRef}
                        style={{flex: 1, overflowY: "auto", padding: 12}}
                        onScroll={onContentScroll}
                    >
                        <div style={{maxWidth: contentMaxWidth, margin: "0 auto", width: "100%"}}>
                            {messages.map((content, index) => {
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
            </Drawer>
        </>
    );
};

export default EditorAiAssistantButton;

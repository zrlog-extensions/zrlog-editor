import {Button, theme} from "antd";
import {CSSProperties, FunctionComponent, ReactNode, RefObject, useState} from "react";
import AIIcon from "./AIIcon";
import AIContentItem, {AIContent} from "./AIContentItem";
import {AIProviderType, EditorUser} from "../type";
import AIDrawer, {getAiDrawerOpen} from "./AIDrawer";

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

export const getEditorAiAssistantDrawerOpen = getAiDrawerOpen;

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
    const {token} = theme.useToken();
    const realOpen = controlledOpen === undefined ? open : controlledOpen;

    const changeOpen = (nextOpen: boolean) => {
        if (controlledOpen === undefined) {
            setOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
    };

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
            <AIDrawer
                aiProvider={aiProvider}
                open={realOpen}
                onClose={close}
                defaultWidth={drawerWidth}
                onSizeChange={onDrawerSizeChange}
                getContainer={getContainer}
                subject={subject}
                dark={dark}
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
            </AIDrawer>
        </>
    );
};

export default EditorAiAssistantButton;

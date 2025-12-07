import {Button, Drawer} from "antd";
import {FunctionComponent, useEffect, useRef, useState} from "react";
import Form from "antd/es/form";
import {ArrowUpOutlined, InfoCircleOutlined} from "@ant-design/icons";
import useMessage from "antd/es/message/useMessage";
import {AIProviderType, EditorUser} from "../type";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import AIIcon from "./AIIcon";
import {AIContent} from "./AIContentItem";
import {Content} from "antd/es/layout/layout";
import AIChatContentPanel from "./AIChatContentPanel";
import {getEditorRes} from "../editor/lang/editor-lang";
import {AxiosInstance} from "axios";

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
    input: string;
    sending: boolean;
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
                                                        aiMessages,
                                                        onAiMessagesChange,
                                                        axiosInstance,
                                                        defaultWidth,
                                                        dark,
                                                        user,
                                                        onSizeChange
                                                    }) => {

    const enterBtnRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);


    const [size, setSize] = useState<string | number>(defaultWidth ? defaultWidth : "large");

    const [state, setState] = useState<AIDrawerState>({
        open: !hide,
        input: input,
        contents: aiMessages ? aiMessages : [],
        sending: false,
    });
    const [messageApi, contextHolder] = useMessage({maxCount: 3, getContainer: getContainer});

    const [form] = Form.useForm();
    const realHide = useRef<boolean>(hide);

    const onSubmit = async () => {
        const newContents = state.contents;
        newContents.push({
            role: "user",
            content: state.input,
            thinking: false,
        });
        const aiReplyContent: AIContent = {
            role: "assistant",
            content: "",
            thinking: true,
        };
        setState((prevState) => {
            return {
                ...prevState,
                contents: [...newContents, aiReplyContent],
                sending: true,
            };
        });
        if (axiosInstance) {
            try {
                const {data} = await axiosInstance.post(
                    apiUri + "?id=" + (sessionId ? sessionId : 0) + `&input=${encodeURIComponent(state.input)}`
                );
                if (data.error) {
                    messageApi.error(data.message);
                    setState((prevState) => {
                        return {
                            ...prevState,
                            sending: false,
                        };
                    });
                    return;
                }
                form.setFieldsValue({input: ""});
                const contents: AIContent[] = [...newContents, ...data.data];
                setState((prevState) => {
                    return {
                        ...prevState,
                        sending: false,
                        input: "",
                        contents: contents,
                    };
                });
                if (onAiMessagesChange) {
                    onAiMessagesChange(contents);
                }
            } catch (e) {
                messageApi.error("Unknown error");
            }
        }
    }

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

    useEffect(() => {
        setState((prevState) => {
            return {
                ...prevState,
                input: input,
            };
        });
        form.setFieldValue("input", input);
    }, [input]);

    useEffect(() => {
        setState((prevState) => {
            return {
                ...prevState,
                contents: aiMessages ? aiMessages : []
            }
        })
    }, [aiMessages])

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // 检查是否是 macOS 系统
            const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);

            // 检查按键组合
            if (
                (isMac && event.metaKey && event.key === "Enter") ||
                (!isMac && event.ctrlKey && event.key === "Enter")
            ) {
                // 处理 Ctrl + Enter 或 Cmd + Enter 的逻辑
                //console.log('Ctrl + Enter 或 Cmd + Enter 按下');
                if (enterBtnRef.current && getAiDrawerOpen()) {
                    enterBtnRef.current.click();
                }
            }
        };

        // 绑定键盘事件
        window.addEventListener("keydown", handleKeyPress);

        // 在组件卸载时移除事件监听
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

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
                    padding: 0,
                    overflowX: "hidden",
                },
            }}
            open={state.open}
            getContainer={getContainer}
        >
            {contextHolder}
            <Content>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        overflow: "auto",
                    }}
                >
                    {state.open &&
                        <AIChatContentPanel user={user} dark={dark} contents={state.contents} aiProvider={aiProvider}/>}
                    <Form
                        form={form}
                        initialValues={state}
                        style={{
                            position: "absolute",
                            width: "80%",
                            maxWidth: 768,
                            bottom: state.contents.length == 0 ? "45%" : 32,
                            justifyContent: "center",
                        }}
                        onValuesChange={(v) => {
                            setState((prevState) => {
                                return {
                                    ...prevState,
                                    input: v["input"],
                                };
                            });
                        }}
                    >
                        {state.contents.length === 0 && (
                            <Title level={3} style={{textAlign: "center", lineHeight: 2}}>
                                {getEditorRes("ai").title}
                            </Title>
                        )}
                        <Form.Item name={"input"} style={{flex: 1, marginBottom: 0}}>
                            <TextArea
                                autoFocus={true}
                                size={"large"}
                                disabled={state.sending}
                                style={{minHeight: 48, maxHeight: 72, resize: "none"}}
                                placeholder={getEditorRes("ai").inputTips}
                            />
                        </Form.Item>
                        <Button
                            ref={enterBtnRef}
                            htmlType={"submit"}
                            size={"large"}
                            type={"dashed"}
                            disabled={state.input.length === 0}
                            style={{
                                position: "absolute",
                                right: 1,
                                bottom: 1,
                                border: "none",
                                boxShadow: "none",
                                background: "inherit",
                            }}
                            loading={state.sending}
                            onClick={async () => {
                                await onSubmit();
                            }}
                        >
                            {!state.sending && <ArrowUpOutlined/>}
                        </Button>
                    </Form>
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

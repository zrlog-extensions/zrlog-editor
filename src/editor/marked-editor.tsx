import CodeMirror, {EditorSelection, EditorState, EditorView, ViewUpdate} from "@uiw/react-codemirror";
import {FunctionComponent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {MarkdownEditorProps} from "./editor.types";
import {StyledEditor} from "./styles/styled-editor";
import EditorToolBar from "./editor-tool-bar";
import useMessage from "antd/es/message/useMessage";
import {getBorder} from "./editor-helpers";
import {languages} from "@codemirror/language-data";
import {markdown} from "@codemirror/lang-markdown";

import PasteUpload from "./paste-upload";
import ScrollSync from "./scroll-sync";
import HtmlPreviewPanel from "./html-preview-panel";
import {markdownToHtml} from "./utils/marked-utils";
import SelectionToolbar from "./editor-selection-tool-bar";
import {copyToClipboard} from "./utils/editor-utils";
import {getEditorRes, setEditorLang} from "./lang/editor-lang";


type MarkdownEditorState = {
    initValue: string;
    content: string;
    preview: boolean;
    imageUploading: boolean;
};

type SelectionToolbarState = {
    visible: boolean;
    top: number;
    left: number;
    text: string;
};

const MarkedEditor: FunctionComponent<MarkdownEditorProps> = ({
                                                                  height,
                                                                  value,
                                                                  onChange,
                                                                  content,
                                                                  loadSuccess,
                                                                  getContainer,
                                                                  placeholder,
                                                                  config,
                                                                  axiosInstance,
                                                              }) => {

    const [state, setState] = useState<MarkdownEditorState>({
        initValue: value ? value : "",
        //默认开启
        preview: config.preview,
        content: content,
        imageUploading: false,
    });

    const [toolbar, setToolbar] = useState<SelectionToolbarState>({
        visible: false,
        top: 0,
        left: 0,
        text: "",
    });

    const getSelectedText = (view: EditorView) => {
        const {from, to} = view.state.selection.main;
        if (from === to) return "";
        return view.state.doc.sliceString(from, to);
    };

    const updateToolbarPosition = useCallback((view: EditorView) => {
        const state = view.state;
        const {from, to} = state.selection.main;

        if (from === to) {
            setToolbar((prev) => ({...prev, visible: false}));
            return;
        }

        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);

        if (!start || !end) {
            setToolbar((prev) => ({...prev, visible: false}));
            return;
        }

        const middleX = (start.left + end.right) / 2;
        const top = Math.min(start.top, end.top) - 48; // 上方 40px

        setToolbar({
            visible: true,
            top,
            left: middleX,
            text: getSelectedText(view),
        });
    }, []);

    const [guttersWidth, setGuttersWidth] = useState<number>(27);

    const editorRef = useRef<EditorView | null>(null);
    const previewRef = useRef<HTMLDivElement | null>(null);

    const [messageApi, contextHolder] = useMessage({maxCount: 3, getContainer: getContainer});

    const insertTextAtCursor = (text: string, cursorPosition: number) => {
        const view = editorRef.current;
        if (!view) return;

        const pos = view.state.selection.main.head; // 当前光标位置

        view.dispatch({
            changes: {from: pos, insert: text},
            selection: EditorSelection.cursor(pos + cursorPosition),
            scrollIntoView: true,
        });
        view.focus(); // 确保光标可见
    };

    const doCopy = async () => {
        copyToClipboard('<div class="markdown-body" style="padding:0">' + state.content + "</div>");
        messageApi.info(getEditorRes("copPreviewHtmlToClipboardSuccess"));
    };

    useEffect(() => {
        if (loadSuccess) {
            loadSuccess(null);
        }
    }, []);

    const onViewChange = () => {
        if (editorRef.current && editorRef.current.dom) {
            const gutters = editorRef.current.dom.querySelector(".cm-gutters-before") as HTMLElement;
            if (gutters) {
                const newWidth = gutters.offsetWidth;
                console.log("当前行号宽度:", newWidth);
                if (guttersWidth == newWidth) {
                    return;
                }
                setGuttersWidth(gutters.offsetWidth);
            }
        }
    };

    const handleUpdate = useCallback(
        (vu: ViewUpdate) => {
            // 选区变化 或 文本变化时重新计算
            if (vu.selectionSet || vu.docChanged) {
                updateToolbarPosition(vu.view);
            }
        },
        [updateToolbarPosition]
    );

    // 通用封装：用 wrap 函数处理选中内容
    const wrapSelection = useCallback(
        (wrap: (text: string) => string) => {
            const view = editorRef.current;
            if (!view) return;

            const state = view.state;
            const {from, to} = state.selection.main;
            if (from === to) return;

            const selectedText = getSelectedText(view);

            view.dispatch({
                changes: {
                    from,
                    to,
                    insert: wrap(selectedText),
                },
            });

            // 改完之后再更新一次位置（选区仍然存在）
            updateToolbarPosition(view);
        },
        [updateToolbarPosition]
    );

    const handleBold = () => {
        wrapSelection((text: string) => `**${text}**`);
    };

    const handleStrikethrough = () => {
        wrapSelection((text: string) => `~${text}~`);
    };

    const handleItalic = () => {
        wrapSelection((text: string) => `*${text}*`);
    };

    if (config.lang) {
        setEditorLang(config.lang);
    } else {
        setEditorLang("zh_CN");
    }

    const extensions = useMemo(() => {
        const extArr = [];
        if (config.lang) {
            setEditorLang(config.lang);
        }
        extArr.push(markdown({codeLanguages: languages}) as never);
        extArr.push(EditorView.lineWrapping as never);
        // 中文翻译对象
        extArr.push(EditorState.phrases.of(getEditorRes("findDialog")) as never);
        return extArr;
    }, [config.lang]);

    const clearSelection = () => {
        const view = editorRef.current;
        if (!view) return;

        /*// 你想让光标停在 from 还是 to 都行
        const cursorPos = sel.to; // 或 sel.from

        view.dispatch({
            selection: EditorSelection.cursor(cursorPos),
        });*/
        view.state.replaceSelection("");

        // 顺便关掉浮动 toolbar
        //setToolbar((prev) => ({ ...prev, visible: false }));
    };

    return (
        <StyledEditor mainColor={config.colorPrimary ? config.colorPrimary : ""} dark={config.dark}
                      style={{paddingBottom: 30}}>
            {editorRef.current && (
                <PasteUpload
                    uploadFormName={config.uploadConfig.formName}
                    onUploading={() => {
                        setState((prevState) => {
                            return {
                                ...prevState,
                                imageUploading: true,
                            };
                        });
                    }}
                    onUploadFailure={() => {
                        setState((prevState) => {
                            return {
                                ...prevState,
                                imageUploading: false,
                            };
                        });
                    }}
                    onUploadSuccess={(imgUrl) => {
                        const content = "![](" + imgUrl + ")\n";
                        insertTextAtCursor(content, content.length);
                        setState((prevState) => {
                            return {
                                ...prevState,
                                imageUploading: false,
                            };
                        });
                    }}
                    editorView={editorRef.current.contentDOM as HTMLElement}
                />
            )}
            <div className={config.dark ? "editor-dark" : "editor-light"} style={{overflow: "hidden"}}>
                {contextHolder}
                <EditorToolBar
                    uploadConfig={config.uploadConfig}
                    axiosInstance={axiosInstance}
                    dark={config.dark}
                    imageUploading={state.imageUploading}
                    onChange={(mdStr, cursorPosition) => {
                        insertTextAtCursor(mdStr, cursorPosition);
                    }}
                    onCopy={async () => {
                        await doCopy();
                    }}
                    onEditorModeChange={(preview) => {
                        setState((prevState) => {
                            if (config.onPreviewChange) {
                                config.onPreviewChange(preview)
                            }
                            return {
                                ...prevState,
                                preview: preview,
                            };
                        });
                    }}
                    preview={state.preview}
                />
                <div style={{height: height, display: "flex", width: "100%"}}>
                    <SelectionToolbar
                        axiosInstance={axiosInstance}
                        dark={config.dark}
                        visible={toolbar.visible}
                        top={toolbar.top}
                        left={toolbar.left}
                        onBold={handleBold}
                        onStrikethrough={handleStrikethrough}
                        onItalic={handleItalic}
                        selectedText={toolbar.text}
                        getContainer={getContainer}
                        onAi={() => {
                            clearSelection();
                        }}
                        aiConfig={config.aiConfig}
                    />
                    <CodeMirror
                        basicSetup={{searchKeymap: true}}
                        placeholder={placeholder}
                        value={state.initValue}
                        height={height}
                        width={"100%"}
                        onUpdate={(viewUpdate) => {
                            if (viewUpdate.viewportChanged) {
                                onViewChange();
                            }
                            handleUpdate(viewUpdate);
                        }}
                        theme={config.dark ? "dark" : "light"}
                        extensions={extensions}
                        onCreateEditor={(view) => {
                            editorRef.current = view;
                            onViewChange();
                        }}
                        onChange={async (md) => {
                            const html = await markdownToHtml(md);
                            //console.info(html + "=..");

                            const changeValues = {
                                content: html,
                                markdown: md,
                            };
                            setState((prevState) => {
                                return {
                                    ...prevState,
                                    ...changeValues,
                                };
                            });
                            onChange(changeValues);
                        }}
                        style={{
                            minWidth: state.preview ? `calc((50% + ${guttersWidth / 2}px)` : "100%",
                            width: state.preview ? `calc((50% + ${guttersWidth / 2}px)` : "100%",
                            overflow: "auto",
                        }}
                    />
                    <HtmlPreviewPanel
                        dark={config.dark}
                        previewRef={previewRef}
                        style={{
                            display: state.preview ? "block" : "none",
                            minWidth: `calc((100% - ${guttersWidth}px) / 2)`,
                            width: `calc((100% - ${guttersWidth}px) / 2)`,
                            paddingTop: 4,
                            paddingBottom: 4,
                            paddingRight: 2,
                            paddingLeft: 5,
                            borderLeft: getBorder(config.dark),
                        }}
                        htmlContent={state.content}
                    />
                </div>
            </div>
            {editorRef.current && previewRef.current && editorRef.current.scrollDOM && (
                <ScrollSync mdKey={state.content} editorRef={editorRef} previewRef={previewRef}/>
            )}
        </StyledEditor>
    );
};

export default MarkedEditor;

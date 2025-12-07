import {FunctionComponent, useState} from "react";
import {EditorDialogState, UploadConfig} from "./editor.types";
import EditorDialog from "./dialog/editor-dialog";
import EditorIcon from "./editor-icon";
import {getBorder} from "./editor-helpers";
import Spin from "antd/es/spin";
import {CloudUploadOutlined} from "@ant-design/icons";
import {getEditorRes} from "./lang/editor-lang";
import {AxiosInstance} from "axios";

type EditorToolBarProps = {
    onChange: (val: string, cursorPosition: number) => void;
    onCopy?: () => void;
    preview: boolean;
    onEditorModeChange: (preview: boolean) => void;
    imageUploading?: boolean;
    dark: boolean;
    axiosInstance?: AxiosInstance;
    uploadConfig: UploadConfig
};

type EditorToolBarDividerProps = {
    dark: boolean;
}

export const EditorToolBarDivider: FunctionComponent<EditorToolBarDividerProps> = ({dark}) => {
    return (
        <span
            style={{
                borderRight: getBorder(dark),
                height: "65%",
                width: 1,
                userSelect: "none",
                display: "inline-block",
            }}
        >
            &nbsp;
        </span>
    );
};

const EditorToolBar: FunctionComponent<EditorToolBarProps> = ({
                                                                  onChange,
                                                                  onCopy,
                                                                  preview,
                                                                  onEditorModeChange,
                                                                  imageUploading,
                                                                  dark,
                                                                  uploadConfig
                                                              }) => {
    const [dialogState, setDialogState] = useState<EditorDialogState>({
        open: false,
        title: "",
        type: "image",
    });

    return (
        <>
            {dialogState.open && (
                <EditorDialog
                    uploadConfig={uploadConfig}
                    title={dialogState.title}
                    type={dialogState.type}
                    onOk={(mdStr) => {
                        setDialogState({
                            title: "",
                            type: "image",
                            open: false,
                        });
                        onChange(mdStr, mdStr.length);
                    }}
                    onClose={() => {
                        setDialogState({
                            title: "",
                            type: "image",
                            open: false,
                        });
                    }}
                />
            )}
            <div
                style={{
                    display: "flex",
                    gap: 2,
                    paddingRight: 8,
                    flexWrap: "wrap",
                    paddingLeft: 8,
                    alignItems: "center",
                    maxHeight: 79,
                    overflowY: "auto",
                    borderBottom: getBorder(dark),
                }}
            >
                <EditorIcon
                    name={"bold"}
                    onClick={() => {
                        onChange("****", 2);
                    }}
                />
                <EditorIcon
                    name={"strikethrough"}
                    onClick={() => {
                        onChange("~~~~", 2);
                    }}
                />
                <EditorIcon
                    name={"italic"}
                    onClick={() => {
                        onChange("**", 1);
                    }}
                />
                <EditorIcon
                    name={"quote-left"}
                    onClick={() => {
                        onChange("> ", 2);
                    }}
                />
                <EditorToolBarDivider dark={dark}/>
                <EditorIcon
                    name={"2"}
                    onClick={() => {
                        onChange("## ", 3);
                    }}
                />
                <EditorIcon
                    name={"3"}
                    onClick={() => {
                        onChange("### ", 4);
                    }}
                />
                <EditorIcon
                    name={"4"}
                    onClick={() => {
                        onChange("#### ", 5);
                    }}
                />
                <EditorToolBarDivider dark={dark}/>
                <EditorIcon
                    name={"list-ul"}
                    onClick={() => {
                        onChange("- ", 2);
                    }}
                />
                <EditorIcon
                    name={"list-ol"}
                    onClick={() => {
                        onChange("1. ", 3);
                    }}
                />

                <EditorIcon
                    name={"minus"}
                    onClick={() => {
                        const mdStr = "\n------------\n\n ";
                        onChange(mdStr, mdStr.length);
                    }}
                />
                <EditorToolBarDivider dark={dark}/>
                <EditorIcon
                    name={"link"}
                    title={getEditorRes("addLink")}
                    onClick={() => {
                        setDialogState({
                            open: true,
                            title: getEditorRes("addLink"),
                            type: "link",
                        });
                    }}
                />
                <Spin spinning={imageUploading} indicator={<CloudUploadOutlined/>}>
                    <EditorIcon
                        title={getEditorRes("addImage")}
                        name={"image"}
                        onClick={() => {
                            setDialogState({
                                open: true,
                                title: getEditorRes("addImage"),
                                type: "image",
                            });
                        }}
                    />
                </Spin>

                <EditorIcon
                    name={"file-video"}
                    title={getEditorRes("addVideo")}
                    onClick={() => {
                        setDialogState({
                            open: true,
                            title: getEditorRes("addVideo"),
                            type: "video",
                        });
                    }}
                />
                <EditorIcon
                    name={"paperclip"}
                    title={getEditorRes("addFile")}
                    onClick={() => {
                        setDialogState({
                            open: true,
                            title: getEditorRes("addFile"),
                            type: "file",
                        });
                    }}
                />
                <EditorToolBarDivider dark={dark}/>
                <EditorIcon
                    name={"file-code"}
                    title={getEditorRes("addCode")}
                    onClick={() => {
                        setDialogState({
                            open: true,
                            title: getEditorRes("addCode"),
                            type: "code",
                        });
                    }}
                />
                <EditorIcon
                    title={getEditorRes("addTable")}
                    name={"table"}
                    onClick={() => {
                        setDialogState({
                            open: true,
                            title: getEditorRes("addTable"),
                            type: "table",
                        });
                    }}
                />
                <EditorIcon title={getEditorRes("copPreviewHtmlToClipboard")} name={"clipboard"} onClick={onCopy}/>
                {preview ? (
                    <EditorIcon
                        title={getEditorRes("closePreview")}
                        key={preview + ""}
                        name={"eye-slash"}
                        onClick={() => {
                            onEditorModeChange(false);
                        }}
                    />
                ) : (
                    <EditorIcon
                        title={getEditorRes("openPreview")}
                        key={preview + ""}
                        name={"eye"}
                        onClick={() => {
                            onEditorModeChange(true);
                        }}
                    />
                )}
                <EditorToolBarDivider dark={dark}/>
                <EditorIcon
                    title={getEditorRes("help")}
                    name={"question-circle"}
                    onClick={() => {
                        setDialogState({
                            open: true,
                            title: getEditorRes("help"),
                            type: "help",
                        });
                    }}
                />
            </div>
        </>
    );
};

export default EditorToolBar;

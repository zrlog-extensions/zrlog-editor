import {FunctionComponent, useState} from "react";
import {EditorDialogState, UploadConfig} from "./editor.types";
import EditorDialog from "./dialog/editor-dialog";
import EditorIcon from "./editor-icon";
import {getBorder} from "./editor-helpers";
import Spin from "antd/es/spin";
import {CloudUploadOutlined} from "@ant-design/icons";
import {getEditorRes} from "./lang/editor-lang";
import {AxiosInstance} from "axios";
import {Fa7SolidBold} from "./icons/Fa7SolidBold";
import {Fa7SolidStrikethrough} from "./icons/Fa7SolidStrikethrough";
import {Fa7SolidItalic} from "./icons/Fa7SolidItalic";
import {Fa7SolidQuoteLeft} from "./icons/Fa7SolidQuoteLeft";
import {Fa7Solid2} from "./icons/Fa7Solid2";
import {Fa7Solid3} from "./icons/Fa7Solid3";
import {Fa7Solid4} from "./icons/Fa7Solid4";
import {Fa7SolidListUl} from "./icons/Fa7SolidListUl";
import {Fa7SolidListOl} from "./icons/Fa7SolidListOl";
import {Fa7SolidMinus} from "./icons/Fa7SolidMinus";
import {Fa7SolidLink} from "./icons/Fa7SolidLink";
import {Fa7SolidImage} from "./icons/Fa7SolidImage";
import {Fa7SolidFileVideo} from "./icons/Fa7SolidFileVideo";
import {Fa7SolidPaperclip} from "./icons/Fa7SolidPaperclip";
import {Fa7SolidFileCode} from "./icons/Fa7SolidFileCode";
import {Fa7SolidTable} from "./icons/Fa7SolidTable";
import {Fa7SolidClipboard} from "./icons/Fa7SolidClipboard";
import {Fa7SolidEyeSlash} from "./icons/Fa7SolidEyeSlash";
import {Fa7SolidEye} from "./icons/Fa7SolidEye";
import {Fa7SolidQuestionCircle} from "./icons/Fa7SolidQuestionCircle";

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
                    onClick={() => {
                        onChange("****", 2);
                    }}
                >
                    <Fa7SolidBold/>
                </EditorIcon>
                <EditorIcon
                    onClick={() => {
                        onChange("~~~~", 2);
                    }}
                >
                    <Fa7SolidStrikethrough/>
                </EditorIcon>
                <EditorIcon
                    onClick={() => {
                        onChange("**", 1);
                    }}
                >
                    <Fa7SolidItalic/>
                </EditorIcon>
                <EditorIcon
                    onClick={() => {
                        onChange("> ", 2);
                    }}
                >
                    <Fa7SolidQuoteLeft/>
                </EditorIcon>
                <EditorToolBarDivider dark={dark}/>
                <EditorIcon
                    onClick={() => {
                        onChange("## ", 3);
                    }}
                >
                    <Fa7Solid2/>
                </EditorIcon>
                <EditorIcon
                    onClick={() => {
                        onChange("### ", 4);
                    }}
                >
                    <Fa7Solid3/>
                </EditorIcon>
                <EditorIcon
                    onClick={() => {
                        onChange("#### ", 5);
                    }}
                >
                    <Fa7Solid4/>
                </EditorIcon>
                <EditorToolBarDivider dark={dark}/>
                <EditorIcon
                    onClick={() => {
                        onChange("- ", 2);
                    }}
                >
                    <Fa7SolidListUl/>
                </EditorIcon>
                <EditorIcon
                    onClick={() => {
                        onChange("1. ", 3);
                    }}
                >
                    <Fa7SolidListOl/>
                </EditorIcon>
                <EditorIcon
                    onClick={() => {
                        const mdStr = "\n------------\n\n ";
                        onChange(mdStr, mdStr.length);
                    }}
                >
                    <Fa7SolidMinus/>
                </EditorIcon>
                <EditorToolBarDivider dark={dark}/>
                <EditorIcon
                    title={getEditorRes("addLink")}
                    onClick={() => {
                        setDialogState({
                            open: true,
                            title: getEditorRes("addLink"),
                            type: "link",
                        });
                    }}
                >
                    <Fa7SolidLink/>
                </EditorIcon>
                <Spin spinning={imageUploading} indicator={<CloudUploadOutlined/>}>
                    <EditorIcon
                        title={getEditorRes("addImage")}
                        onClick={() => {
                            setDialogState({
                                open: true,
                                title: getEditorRes("addImage"),
                                type: "image",
                            });
                        }}
                    >
                        <Fa7SolidImage/>
                    </EditorIcon>
                </Spin>

                <EditorIcon
                    title={getEditorRes("addVideo")}
                    onClick={() => {
                        setDialogState({
                            open: true,
                            title: getEditorRes("addVideo"),
                            type: "video",
                        });
                    }}
                >
                    <Fa7SolidFileVideo/>
                </EditorIcon>
                <EditorIcon
                    title={getEditorRes("addFile")}
                    onClick={() => {
                        setDialogState({
                            open: true,
                            title: getEditorRes("addFile"),
                            type: "file",
                        });
                    }}
                >
                    <Fa7SolidPaperclip/>
                </EditorIcon>
                <EditorToolBarDivider dark={dark}/>
                <EditorIcon
                    title={getEditorRes("addCode")}
                    onClick={() => {
                        setDialogState({
                            open: true,
                            title: getEditorRes("addCode"),
                            type: "code",
                        });
                    }}
                >
                    <Fa7SolidFileCode/>
                </EditorIcon>
                <EditorIcon
                    title={getEditorRes("addTable")}
                    onClick={() => {
                        setDialogState({
                            open: true,
                            title: getEditorRes("addTable"),
                            type: "table",
                        });
                    }}
                >
                    <Fa7SolidTable/>
                </EditorIcon>
                <EditorIcon title={getEditorRes("copPreviewHtmlToClipboard")} onClick={onCopy}>
                    <Fa7SolidClipboard/>
                </EditorIcon>
                {preview ? (
                    <EditorIcon
                        title={getEditorRes("closePreview")}
                        key={preview + ""}
                        onClick={() => {
                            onEditorModeChange(false);
                        }}
                    >
                        <Fa7SolidEyeSlash/>
                    </EditorIcon>
                ) : (
                    <EditorIcon
                        title={getEditorRes("openPreview")}
                        key={preview + ""}
                        onClick={() => {
                            onEditorModeChange(true);
                        }}
                    >
                        <Fa7SolidEye/>
                    </EditorIcon>
                )}
                <EditorToolBarDivider dark={dark}/>
                <EditorIcon
                    title={getEditorRes("help")}
                    onClick={() => {
                        setDialogState({
                            open: true,
                            title: getEditorRes("help"),
                            type: "help",
                        });
                    }}
                >
                    <Fa7SolidQuestionCircle/>
                </EditorIcon>
            </div>
        </>
    );
};

export default EditorToolBar;

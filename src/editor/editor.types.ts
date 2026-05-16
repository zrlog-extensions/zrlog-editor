import {AIProviderType, EditorUser} from "../type";
import {AIContent} from "../ai/AIContentItem";
import {Locale} from "./lang/editor-lang";
import {AxiosInstance} from "axios";
import {EditorView} from "@uiw/react-codemirror";

export type ZrLogEditorProps = {
    height: any;
    onChange: (content: ChangedContent) => void;
    value?: string;
    loadSuccess?: (editor: EditorView) => void;
    getContainer?: () => HTMLElement;
    fullscreen: boolean;
    previewContent: string;
    placeholder?: string;
    config: EditorConfig;
    axiosInstance?: AxiosInstance;
};

export type ChangedContent = {
    previewContent: string;
    value: string;
}

export type AIConfig = {
    aiProvider: AIProviderType;
    sessionId: number;
    aiApiUri: string;
    configUrl?: string
    subject: string;
    aiMessages?: AIContent[];
    user?: EditorUser
    drawerWidth?: number | "large" | "default";
    onAiMessagesChange?: (aiMessages: AIContent[]) => void;
    onSizeChange?: (size: number) => void;
}

export type EditorDialogState = {
    open: boolean;
    title: string;
    type: DialogType;
};

export type UploadConfig = {
    buildUploadUrl: (type: string) => string;
    formName: string;
    axiosInstance: AxiosInstance;
    tryAppendBackendServerUrl?: (string: string) => string;
}

export enum EditorMode {
    MARKDOWN = "MARKDOWN",
    YML = "YML",
}

export type EditorConfig = {
    aiConfig?: AIConfig;
    colorPrimary?: string;
    dark: boolean;
    lang: Locale;
    disableToolbar?: boolean;
    disableStatistics?: boolean;
    preview: boolean;
    mode?: EditorMode;
    onPreviewChange?: (preview: boolean) => void;
    uploadConfig: UploadConfig;
    axiosInstance?: AxiosInstance;
};

export type DialogType = "image" | "video" | "file" | "link" | "code" | "table" | "help";

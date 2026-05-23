import {AIProviderType, EditorUser} from "../type";
import {AIContent} from "../ai/AIContentItem";
import {Locale} from "./lang/editor-lang";
import {AxiosInstance} from "axios";
import {EditorView} from "@uiw/react-codemirror";
import {AIStateCache} from "../ai/AIStateCache";
import {ReactNode} from "react";
import {AIButtonRenderMessageOptions} from "../ai/AIButton";

export type AIConfigFooterOptions = {
    selectedText?: string;
};

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

export type LinkPreviewData = {
    url: string;
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
    domain?: string;
    available?: boolean;
}

export type LinkPreviewConfig = {
    enabled?: boolean;
    apiUrl?: string;
    requestDelay?: number;
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
    stateCache?: AIStateCache;
    messages?: AIContent[];
    contentMaxWidth?: number;
    renderMessage?: (options: AIButtonRenderMessageOptions) => ReactNode;
    renderFooter?: (options: AIConfigFooterOptions) => ReactNode;
    overlays?: ReactNode;
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
    disableStatusBar?: boolean;
    /** @deprecated use disableStatusBar */
    disableStatistics?: boolean;
    preview: boolean;
    mode?: EditorMode;
    onPreviewChange?: (preview: boolean) => void;
    linkPreview?: boolean | LinkPreviewConfig;
    uploadConfig: UploadConfig;
    axiosInstance?: AxiosInstance;
};

export type DialogType = "image" | "video" | "file" | "link" | "code" | "table" | "help";

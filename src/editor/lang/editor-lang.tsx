// messages.ts
export const editorLang = {
    zh_CN: {
        addVideo: "添加视频",
        addImage: "添加图片",
        addFile: "添加文件",
        addLink: "添加链接",
        addTable: "添加表格",
        addCode: "添加代码块",
        help: "帮助",
        justNow: "刚刚",
        xMinutesAgo: "分钟前",
        xHourAgo: "小时前",
        currentDraft: "当前为草稿",
        update: "更新",
        lang: "语言",
        desc: "描述",
        address: "地址",
        col: "列",
        row: "行",
        right: "右",
        left: "左",
        center: "中",
        algin: "对齐",
        words: "字",
        findDialog: {
            Find: "查找",
            Replace: "替换",
            next: "下一个",
            previous: "上一个",
            replace: "替换",
            "replace all": "全部替换",
            "match case": "区分大小写",
            regexp: "正则表达式",
            "by word": "整词匹配",
            close: "关闭",
            all: "全部",
            "No matches": "没有匹配项",
            "replaced X matches": "替换了 $X 条匹配项",
        },
        wordsCount: "字数",
        linesCount: "行数",
        copPreviewHtmlToClipboardSuccess: "已成功拷贝预览 HTML 到粘贴板",
        copPreviewHtmlToClipboard: "拷贝预览 HTML 到粘贴板",
        closePreview: "关闭实时预览",
        openPreview: "打开实时预览",
        offlineArticleEditing: "已保存到本地",
        uploading: "上传中",
        localUpload: "本地上传",
        setting: "设置",
        ai: {
            askConfig: "请先完成 AI 助手设置",
            thinking: "思考中",
            ai: "AI 助手",
            inputTips: "询问任何问题",
            contentTips: "AI 也可能会犯错。请核查重要信息。",
            title: "我们先从哪里开始呢？"
        },

    },
    en_US: {
        addVideo: "Add Video",
        addImage: "Add Photo",
        addFile: "Add File",
        addLink: "Add Link",
        addTable: "Add Table",
        addCode: "Add Code Block",
        help: "Help",
        justNow: "Just Now ",
        xMinutesAgo: " Minutes Ago ",
        xHourAgo: " Hours Ago ",
        currentDraft: "Current Draft",
        update: "Update",
        lang: "Language",
        desc: "Desc",
        address: "Address",
        col: "Col",
        row: "Row",
        right: "Right",
        left: "Left",
        center: "Center",
        algin: "Algin",
        findDialog: {},
        wordsCount: "Words",
        linesCount: "Lines",
        copPreviewHtmlToClipboard: "Copy preview html to clipboard",
        copPreviewHtmlToClipboardSuccess: "Copy preview html to clipboard success",
        closePreview: "Close Preview",
        openPreview: "Open Preview",
        offlineArticleEditing: "Saved local storage",
        uploading: "Uploading",
        localUpload: "Local Upload",
        setting: "Setting",
        ai: {
            ai: "AI",
            askConfig: "Please config AI",
            thinking: "Thinking",
            inputTips: "Ask Anything",
            contentTips: "AI can make mistakes. Check important info.",
            title: "Where should we begin?"
        }

    },
} as const;

export type Locale = keyof typeof editorLang; // "en" | "zh"
export type MessageKey = keyof typeof editorLang["en_US"];
let editorCurrentLang: Locale = "zh_CN";

export const setEditorLang = (lang: Locale) => {
    editorCurrentLang = lang;
};

export function getEditorRes<K extends MessageKey>(key: K): typeof editorLang[Locale][K] {
    return editorLang[editorCurrentLang][key];
}

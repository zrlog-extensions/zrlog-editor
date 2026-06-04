import {AIProviderType} from "../type";
import Editor from "../editor";
import {lang} from "./ConfigProviderApp";
import {Card, Layout} from "antd";
import {marked} from "marked";
import EditorStatusBar from "../editor/editor-status-bar";
import {toStatisticsByMarkdown} from "../editor/utils/editor-utils";
import {FunctionComponent, useState} from "react";
import axios from "axios";
import Title from "antd/es/typography/Title";
import {EditorConfig} from "../editor/editor.types";
import Footer from "./Footer";

type TestMarkdownEditorProps = {
    dark: boolean
}

const markdown = "### Editor\n" +
    "\n" +
    "<div align=\"center\">\n" +
    "\n" +
    "一个支持编辑、预览和扩展集成的 Markdown 编辑器，基于 React + CodeMirror + Marked 构建。\n" +
    "\n" +
    "[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)\n" +
    "[![Node Version](https://img.shields.io/badge/node-%3E%3D18.9.0-brightgreen)](https://nodejs.org/)\n" +
    "[![React](https://img.shields.io/badge/react-18.3.1-61dafb)](https://reactjs.org/)\n" +
    "[![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue)](https://www.typescriptlang.org/)\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "## ✨ 特性\n" +
    "\n" +
    "- 📝 **实时预览** - 编辑时同步渲染 Markdown\n" +
    "- 🎨 **语法高亮** - 支持多种编程语言的代码高亮显示\n" +
    "- 🤖 **AI 辅助写作** - 可接入文章助手处理选中文本和上下文\n" +
    "- 📊 **数学公式** - 支持 KaTeX 数学公式渲染\n" +
    "- 🔄 **滚动同步** - 编辑器与预览面板同步滚动\n" +
    "- 📷 **图片上传** - 支持粘贴和拖拽上传图片及视频\n" +
    "- 🎯 **流程图支持** - 支持 flowchart.js 流程图和时序图\n" +
    "- 📱 **响应式设计** - 适配桌面和移动端\n" +
    "- 🌐 **国际化** - 支持多语言界面\n" +
    "- ⚡ **编辑响应** - 基于 CodeMirror 6 处理长文本编辑\n"

axios.defaults.headers.common['X-ZrLog-Admin-Token'] = "1#674369433734556B326D495464504453765073517143476F326C725656304C6D4C3348384871567A4238514C7341512F38757679705143786A646A65364B7867544C546B676C414A38584857414C71573951796B59317738684C7043434C547635484D34596F38726C336D6452586C335549533333496E6D584B64795249504F792F35552F445837783443547133387764314D5056773D3D";

const HomePage: FunctionComponent<TestMarkdownEditorProps> = ({dark}) => {

    const [value, setValue] = useState<string>(markdown);

    const editorConfig = {
        disableToolbar: false,
        disableStatusBar: false,
        dark: dark,
        preview: true,
        lang: lang,
        aiConfig: {
            drawerWidth: 1024,
            aiProvider: AIProviderType.GOOGLE_GEMINI,
            sessionId: 0,
            aiApiUri: "http://localhost:17080/sub/api/admin/article/ai",
            subject: "Markdown Editor",
            user: {
                avatarUrl: "https://www.zrlog.com/favicon.svg",
                nickname: "test"
            }
        },
        axiosInstance: axios.create({
            withCredentials: true
        }),
        linkPreview: {
            apiUrl: "http://localhost:17080/sub/api/admin/link-preview",
            enabled: true,
        },
        uploadConfig: {
            buildUploadUrl: (type) => {
                return `/api/${type}`;
            },
            axiosInstance: axios.create(),
            formName: "imgFile"
        }
    } as EditorConfig

    return <Layout style={{height: "100vh", padding: 16}}>
        <Title level={2} style={{textAlign: "center", paddingBottom: 32}}>Markdown Editor</Title>
        <Card title={""} styles={{
            body: {
                padding: 0
            }
        }}>
            <Editor height={518} onChange={(e) => {
                setValue(e.value)
            }} fullscreen={false} value={markdown}
                    axiosInstance={axios.create()}
                    previewContent={marked(markdown) as string}
                    config={editorConfig}

            />

            {!editorConfig.disableStatusBar && <EditorStatusBar data={
                toStatisticsByMarkdown(value)
            } offline={false} rubbish={false} lastUpdateDate={new Date().getTime()}
                                                                  dark={dark}/>
            }
        </Card>
        <Footer dark={dark}/>
    </Layout>
}
export default HomePage;

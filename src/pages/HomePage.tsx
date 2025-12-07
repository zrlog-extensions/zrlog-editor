import {AIProviderType} from "../type";
import MarkedEditor from "../editor/marked-editor";
import {lang} from "./ConfigProviderApp";
import {Card, Layout} from "antd";
import {marked} from "marked";
import EditorStatistics from "../editor/editor-statistics-info";
import {toStatisticsByMarkdown} from "../editor/utils/editor-utils";
import {FunctionComponent, useState} from "react";
import axios from "axios";
import Title from "antd/es/typography/Title";
import HtmlPreviewPanel from "../editor/html-preview-panel";

type TestMarkdownEditorProps = {
    dark: boolean
}

const markdown = "### Editor\n" +
    "\n" +
    "<div align=\"center\">\n" +
    "\n" +
    "一个功能强大、现代化的 Markdown 编辑器，基于 React + CodeMirror + Marked 构建。\n" +
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
    "- 📝 **实时预览** - 即时 Markdown 渲染，所见即所得\n" +
    "- 🎨 **语法高亮** - 支持多种编程语言的代码高亮显示\n" +
    "- 🤖 **AI 辅助写作** - 内置 AI 写作助手，提升创作效率\n" +
    "- 📊 **数学公式** - 支持 KaTeX 数学公式渲染\n" +
    "- 🔄 **滚动同步** - 编辑器与预览面板智能同步滚动\n" +
    "- 📷 **图片上传** - 支持粘贴和拖拽上传图片及视频\n" +
    "- 🎯 **流程图支持** - 支持 flowchart.js 流程图和时序图\n" +
    "- 📱 **响应式设计** - 完美适配桌面和移动设备\n" +
    "- 🌐 **国际化** - 支持多语言界面\n" +
    "- ⚡ **高性能** - 基于现代前端技术栈，运行流畅\n"

const HomePage: FunctionComponent<TestMarkdownEditorProps> = ({dark}) => {

    const [value, setValue] = useState<string>(markdown);

    return <Layout style={{height: "100vh", padding: 16}}>
        <Title level={2} style={{textAlign: "center", paddingBottom: 32}}>Markdown Editor</Title>
        <Card title={""} styles={{
            body: {
                padding: 0
            }
        }}>
            <MarkedEditor height={518} onChange={(e) => {
                setValue(e.markdown)
            }} fullscreen={false} value={markdown}
                          axiosInstance={axios.create()}
                          content={marked(markdown) as string}
                          config={{
                              dark: dark,
                              preview: true,
                              lang: lang,
                              aiConfig: {
                                  drawerWidth: 1024,
                                  aiProvider: AIProviderType.DEEP_SEEK,
                                  sessionId: 0,
                                  aiApiUri: "/api/ai",
                                  subject: "Markdown Editor",
                                  user: {
                                      avatarUrl: "https://www.zrlog.com/favicon.svg",
                                      nickname: "test"
                                  }
                              },
                              uploadConfig: {
                                  buildUploadUrl: (type) => {
                                      return `/api/${type}`;
                                  },
                                  axiosInstance: axios.create(),
                                  formName: "imgFile"
                              }
                          }}

            />

            <EditorStatistics data={
                toStatisticsByMarkdown(value)
            } offline={false} rubbish={false} lastUpdateDate={new Date().getTime()}
                              dark={dark}/>
        </Card>
        <div style={{textAlign: "center", paddingTop: 24}}>
            Made with ❤️ by ZrLog Team
            <HtmlPreviewPanel dark={dark}
                              style={{paddingTop: 12}}
                              htmlContent={marked(`[官网](https://www.zrlog.com) · [文档](https://www.zrlog.com/doc) · [演示](https://editor.zrlog.com)`) as string}/>
        </div>
    </Layout>
}
export default HomePage;
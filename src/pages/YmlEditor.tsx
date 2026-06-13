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
import {EditorConfig, EditorMode} from "../editor/editor.types";
import Footer from "./Footer";

type TestMarkdownEditorProps = {
    dark: boolean
}

const editorHeight = "clamp(320px, calc(100vh - 260px), 560px)";

const markdown = "- just: write some\n" +
    "- yaml: \n" +
    "  - [here, and]\n" +
    "  - {it: updates, in: real-time}\n"

const YmlEditor: FunctionComponent<TestMarkdownEditorProps> = ({dark}) => {

    const [value, setValue] = useState<string>(markdown);

    const editorConfig = {
        disableToolbar: true,
        disableStatusBar: true,
        dark: dark,
        preview: false,
        lang: lang,
        mode: EditorMode.YML,
        aiConfig: {
            drawerWidth: 1024,
            aiProvider: AIProviderType.DEEP_SEEK,
            sessionId: 0,
            aiApiUri: "/api/ai",
            subject: "Yml Editor",
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
    } as EditorConfig

    return <Layout style={{minHeight: "100vh", padding: 16, boxSizing: "border-box"}}>
        <Title level={2} style={{textAlign: "center", margin: 0, paddingBottom: 16}}>Yml Editor</Title>
        <Card title={""} styles={{
            body: {
                padding: 0,
                overflow: "hidden",
                position: "relative",
            }
        }}>
            <Editor height={editorHeight} onChange={(e) => {
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
        <Footer/>
    </Layout>
}
export default YmlEditor;

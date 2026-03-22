import HtmlPreviewPanel from "../editor/html-preview-panel";
import {marked} from "marked";
import {FunctionComponent} from "react";

type FooterProps = {
    dark: boolean
}

const Footer:FunctionComponent<FooterProps> = ({dark}) => {

    return <div style={{textAlign: "center", paddingTop: 24}}>
        Made with ❤️ by ZrLog Team
        <HtmlPreviewPanel dark={dark}
                          style={{paddingTop: 12}}
                          htmlContent={marked(`[官网](https://www.zrlog.com) · [文档](https://www.zrlog.com/doc) · [演示](https://editor.zrlog.com)`) as string}/>
    </div>
}

export default Footer;
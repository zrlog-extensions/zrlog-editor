import {FunctionComponent} from "react";

const Footer: FunctionComponent = () => {

    return <footer style={{textAlign: "center", paddingTop: 16, color: "var(--ant-color-text)"}}>
        Made with ❤️ by ZrLog Team
        <div style={{paddingTop: 8}}>
            <a href="https://www.zrlog.com">官网</a>
            <span style={{padding: "0 6px"}}>·</span>
            <a href="https://www.zrlog.com/doc">文档</a>
            <span style={{padding: "0 6px"}}>·</span>
            <a href="https://editor.zrlog.com">演示</a>
        </div>
    </footer>
}

export default Footer;

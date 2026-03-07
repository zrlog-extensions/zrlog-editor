import {FunctionComponent, PropsWithChildren} from "react";
import {Button} from "antd";
import {IconWrapperProps} from "antd/es/button/IconWrapper";

type EditorIconProps = PropsWithChildren & {
    onClick?: () => void;
    title?: string
}

const IconWrapper = ({children, ...props}: IconWrapperProps) => (
    <span
        role="img"
        className="anticon" // 关键：加入这个类名可以继承 Antd 的图标基础样式
        {...props}
    >
    {children}
  </span>
);

const EditorIcon: FunctionComponent<EditorIconProps> = ({onClick, title, children}) => {
    return (
        <Button
            title={title}
            icon={<IconWrapper prefixCls={""}>{children}</IconWrapper>}
            onClick={onClick}
            type={"text"}
            style={{
                minWidth: 34,
                display: "flex",
                alignItems: "center",
                fontSize: 20,
                border: "none",
                height: 38,
                color: "rgb(119,119,119)",
                borderRadius: 0,
                padding: 0,
                justifyContent: "center",
                background: "initial",
            }}
        >
        </Button>
    );
};
export default EditorIcon;

import {FunctionComponent, PropsWithChildren} from "react";
import {Button} from "antd";
import Icon from "@ant-design/icons";

type EditorIconProps = PropsWithChildren & {
    onClick?: () => void;
    title?: string
}

const EditorIcon: FunctionComponent<EditorIconProps> = ({onClick, title, children}) => {
    return (
        <Button
            title={title}
            icon={<Icon>{children}</Icon>}
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

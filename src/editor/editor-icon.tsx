import {FunctionComponent, PropsWithChildren} from "react";
import {Button} from "antd";

type EditorIconProps = PropsWithChildren & {
    onClick?: () => void;
    title?: string
}

const EditorIcon: FunctionComponent<EditorIconProps> = ({onClick, title, children}) => {
    return (
        <Button
            title={title}
            onClick={onClick}
            className={"editor-icon"}
            style={{
                minWidth: 34,
                display: "flex",
                alignItems: "center",
                fontSize: 20,
                border: "none",
                height: 38,
                borderRadius: 0,
                padding: 0,
                justifyContent: "center",
                background: "initial",
            }}
        >
            {children}
        </Button>
    );
};
export default EditorIcon;

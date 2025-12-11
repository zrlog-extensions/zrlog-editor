import {FunctionComponent, PropsWithChildren} from "react";

type EditorIconProps = PropsWithChildren & {
    onClick?: () => void;
    title?: string
}

const EditorIcon: FunctionComponent<EditorIconProps> = ({onClick, title, children}) => {
    return (
        <div
            title={title}
            onClick={onClick}
            className={"editor-icon"}
            style={{
                cursor: "pointer",
                minWidth: 34,
                display: "flex",
                alignItems: "center",
                color: "rgb(119, 119, 119)",
                fontSize: 20,
                height: 38,
                borderRadius: 6,
                justifyContent: "center",
            }}
        >
            {children}
        </div>
    );
};
export default EditorIcon;

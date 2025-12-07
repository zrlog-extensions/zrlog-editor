import {StyledHighlightDark} from "./highlight/styled-highlight-dark";
import {StyledHighlightDefault} from "./highlight/styled-highlight-default";
import {CSSProperties, FunctionComponent, MutableRefObject, useEffect, useRef} from "react";
import "katex/dist/katex.min.css";
import StyledPreview from "./styles/styled-preview";

export type EditorPreviewProps = {
    htmlContent: string;
    editable?: boolean;
    previewRef?: MutableRefObject<HTMLDivElement | null>;
    onContentChange?: (str: string) => void;
    style?: CSSProperties;
    dark: boolean;
};

const HtmlPreviewPanel: FunctionComponent<EditorPreviewProps> = ({
                                                                     htmlContent,
                                                                     previewRef,
                                                                     editable,
                                                                     onContentChange,
                                                                     style,
                                                                     dark
                                                                 }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && ref.current.innerHTML !== htmlContent) {
            ref.current.innerHTML = htmlContent;
        }
    }, [htmlContent]);

    const handleInput = () => {
        if (onContentChange && ref.current) {
            onContentChange(ref.current.innerHTML);
        }
    };

    const commonProps = {
        ref,
        autoFocus: false,
        contentEditable: editable,
        className: "markdown-body",
        onInput: handleInput,
        style: {
            outline: "none",
            boxShadow: "none",
        },
    };

    return (
        <StyledPreview
            dark={dark}
            ref={previewRef}
            style={{lineHeight: 1.4, overflowY: "auto", wordBreak: "break-word", boxSizing: "border-box", ...style}}
        >
            {dark ? (
                <StyledHighlightDark {...commonProps} />
            ) : (
                <StyledHighlightDefault {...commonProps} />
            )}
        </StyledPreview>
    );
};

export default HtmlPreviewPanel;

import styled from "styled-components";
import {getActiveLineBgColor, getBgColor, getBorderColor, getGutterBgColor, getTextColor} from "../editor-helpers";

export const StyledEditor = styled("div")<{ mainColor: string, dark: boolean }>(({mainColor, dark}) => {
    const bgColor = getBgColor(dark);
    const gutterBgColor = getGutterBgColor(dark);
    const activeLineBgColor = getActiveLineBgColor(dark);
    const textColor = getTextColor(dark);

    return {
        backgroundColor: bgColor,
        overflow: "hidden",
        color: textColor,
        ".editor-dark": {
            backgroundColor: bgColor,
            overflow: "hidden",
        },
        ".editor-dark > div": {
            backgroundColor: bgColor,
        },
        ".cm-editor.cm-focused": {
            outline: "none !important",
            boxShadow: "none !important",
        },
        ".editor-dark .cm-editor": {
            backgroundColor: bgColor,
        },
        ".preview": {
            overflow: "auto",
            fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        },
        ".cm-scroller": {
            fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            height: "100%",
        },
        ".cm-gutters": {
            userSelect: "none",
            alignSelf: "stretch",
            minHeight: "100%",
            backgroundColor: gutterBgColor,
            borderRight: `${getBorderColor(dark)} solid 1px`,
        },
        ".cm-gutter": {
            minHeight: "100%",
        },
        ".cm-panel.cm-search": {fontSize: "14px !important"},
        ".cm-panels.cm-panels-bottom": {borderTop: "none"},
        ".cm-panel": {
            borderTop: `${getBorderColor(dark)} solid 1px !important`,
        },
        ".cm-panel.cm-search .cm-button": {
            fontSize: "14px !important",
            background: mainColor,
            color: "white",
            borderRadius: 4,
            border: "none",
        },
        ".cm-panel input:hover": {
            border: `1px solid ${mainColor}`,
        },
        ".cm-panel.cm-search input[type=checkbox]": {
            accentColor: mainColor,
            height: 16,
            width: 16,
        },
        ".cm-panel label": {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "24px!important",
            boxSizing: "border-box",
        },
        ".cm-panel.cm-search > button": {cursor: "pointer"},
        '.cm-panel.cm-search [name="close"]': {
            fontSize: "22px !important",
            height: "32px !important",
            minWidth: "32px !important",
        },
        ".cm-panel.cm-search > label": {fontSize: "14px !important"},
        ".cm-panel.cm-search > input": {
            fontSize: "14px !important",
            height: 26,
            borderRadius: 4,
        },
        ".editor-dark .cm-scroller": {backgroundColor: `${bgColor} !important`},
        ".editor-dark .cm-gutters": {backgroundColor: `${gutterBgColor} !important`},
        ".editor-dark .cm-activeLine": {backgroundColor: activeLineBgColor},
        ".editor-dark .cm-activeLineGutter": {backgroundColor: activeLineBgColor},
        ".editor-dark .cm-panel": {
            backgroundColor: bgColor,
        },
        ".editor-dark .cm-panel.cm-search [name=close]": {
            color: "white",
        },
    };
});

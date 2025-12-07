import {EditorStatisticsInfo} from "../editor-statistics-info";

export function copyToClipboard(html: string) {
    const temp = document.createElement("input") as HTMLInputElement;
    document.body.append(temp);
    temp.value = html;
    temp.select();
    document.execCommand("copy", false);
    temp.remove();
}

export const toStatisticsByMarkdown = (markdownStr?: string): EditorStatisticsInfo => {
    return {
        contentWordsLength: markdownStr?.length ? markdownStr.length : 0,
        contentLinesLength: markdownStr?.length ? (markdownStr.length > 0 ? markdownStr.split("\n").length : 0) : 0,
    };
};

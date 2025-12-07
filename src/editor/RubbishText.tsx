import TimeAgo from "./TimeAgo";
import { FunctionComponent } from "react";
import { getEditorRes } from "./lang/editor-lang";

type RubbishTextProps = {
    offline: boolean;
    rubbish: boolean;
    lastUpdateDate?: number;
    fullScreen: boolean;
};

const RubbishText: FunctionComponent<RubbishTextProps> = ({ offline, rubbish, lastUpdateDate }) => {
    let tips;
    if (offline) {
        tips = getEditorRes("offlineArticleEditing");
    } else {
        if (!rubbish) {
            return <></>;
        }

        if (lastUpdateDate && lastUpdateDate > 0) {
            tips = (
                <>
                    <TimeAgo timestamp={lastUpdateDate} />
                    <span>{getEditorRes("update")}</span>
                </>
            );
        } else {
            tips = getEditorRes("currentDraft");
        }
    }
    return (
        <span
            style={{
                border: 0,
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                textAlign: "center",
                whiteSpace: "nowrap",
                paddingLeft: 8,
                paddingRight: 8,
                height: "auto",
                cursor: "auto",
                backgroundColor: "inherit",
            }}
        >
            {tips}
        </span>
    );
};

export default RubbishText;

import { Input } from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import { getEditorRes } from "../lang/editor-lang";

type LinkBodyState = {
    value: string;
    desc: string;
};

type LinkBodyProps = {
    onChange: (value: string) => void;
};

const LinkBody: FunctionComponent<LinkBodyProps> = ({ onChange }) => {
    const [state, setState] = useState<LinkBodyState>({
        value: "",
        desc: "",
    });

    useEffect(() => {
        if (state.value !== "") {
            onChange("[" + state.desc + "](" + state.value + ")");
        }
    }, [state]);

    return (
        <div style={{ display: "flex", flexFlow: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "flex-start", gap: 12, alignItems: "center" }}>
                <div style={{ display: "flex" }}>{getEditorRes("address")}</div>
                <Input
                    style={{ minHeight: 36, flex: 1, width: "100%", display: "flex" }}
                    value={state.value}
                    onChange={(e) => {
                        setState((prevState) => {
                            return {
                                ...prevState,
                                value: e.target.value,
                            };
                        });
                    }}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-start", gap: 12, alignItems: "center" }}>
                <div style={{ display: "flex" }}>{getEditorRes("desc")}</div>
                <Input
                    style={{ minHeight: 36, flex: 1, width: "100%", display: "flex" }}
                    value={state.desc}
                    onChange={(e) => {
                        setState((prevState) => {
                            return {
                                ...prevState,
                                desc: e.target.value,
                            };
                        });
                    }}
                ></Input>
            </div>
        </div>
    );
};

export default LinkBody;

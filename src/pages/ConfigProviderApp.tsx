import {App, ConfigProvider, Switch, Tooltip, theme} from "antd";
import zh_CN from "antd/es/locale/zh_CN";
import en_US from "antd/es/locale/en_US";
import {legacyLogicalPropertiesTransformer, StyleProvider} from "@ant-design/cssinjs";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./HomePage";
import YmlEditor from "./YmlEditor";
import {MoonOutlined, SunOutlined} from "@ant-design/icons";
import {useEffect, useMemo, useState} from "react";

const {darkAlgorithm, defaultAlgorithm} = theme;


export const lang = "zh_CN"

const getPreferredDarkMode = (): boolean => {
    if (window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
};

const ConfigProviderApp = () => {

    const [dark, setDark] = useState(getPreferredDarkMode);

    const themeAlgorithms = useMemo(() => {
        return [dark ? darkAlgorithm : defaultAlgorithm];
    }, [dark]);

    useEffect(() => {
        document.body.classList.toggle("dark", dark);
        document.body.classList.toggle("light", !dark);
    }, [dark]);

    return (
        <ConfigProvider
            locale={lang === "zh_CN" ? zh_CN : en_US}
            theme={{
                algorithm: themeAlgorithms,
            }}

        >
            <App>
                <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
                    <Tooltip title={dark ? "切换浅色模式" : "切换暗黑模式"}>
                        <Switch
                            checked={dark}
                            checkedChildren={<MoonOutlined/>}
                            unCheckedChildren={<SunOutlined/>}
                            onChange={setDark}
                            style={{position: "fixed", top: 16, right: 16, zIndex: 1000}}
                        />
                    </Tooltip>
                    <BrowserRouter
                        basename={"/"}
                        future={{
                            v7_relativeSplatPath: true,
                            v7_startTransition: true,
                        }}
                    >
                        <Routes>
                            <Route
                                path={"/yml"}
                                element={<YmlEditor dark={dark}/>}
                            />
                            <Route
                                path={"/*"}
                                element={<HomePage dark={dark}/>}
                            />
                        </Routes>
                    </BrowserRouter>
                </StyleProvider>
            </App>
        </ConfigProvider>
    );
};

export default ConfigProviderApp;

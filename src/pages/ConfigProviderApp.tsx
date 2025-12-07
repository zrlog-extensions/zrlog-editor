import {App, ConfigProvider, theme} from "antd";
import zh_CN from "antd/es/locale/zh_CN";
import en_US from "antd/es/locale/en_US";
import {legacyLogicalPropertiesTransformer, StyleProvider} from "@ant-design/cssinjs";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./HomePage";

const {darkAlgorithm, defaultAlgorithm} = theme;


export const lang = "zh_CN"

const ConfigProviderApp = () => {

    const getPreferredColorScheme = (): string => {
        if (window.matchMedia) {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                return "dark";
            } else {
                return "light";
            }
        }
        return "light";
    };

    const themeAlgorithms = [];

    if (getPreferredColorScheme() === "dark") {
        themeAlgorithms.push(darkAlgorithm as never);
    } else {
        themeAlgorithms.push(defaultAlgorithm as never);
    }

    return (
        <ConfigProvider
            locale={lang === "zh_CN" ? zh_CN : en_US}
            theme={{
                algorithm: themeAlgorithms,
            }}

        >
            <App>
                <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
                    <BrowserRouter
                        basename={"/"}
                        future={{
                            v7_relativeSplatPath: true,
                            v7_startTransition: true,
                        }}
                    >
                        <Routes>
                            <Route
                                path={"/*"}
                                element={<HomePage dark={getPreferredColorScheme() === "dark"}/>}
                            />
                        </Routes>
                    </BrowserRouter>
                </StyleProvider>
            </App>
        </ConfigProvider>
    );
};

export default ConfigProviderApp;

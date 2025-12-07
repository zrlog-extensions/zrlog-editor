import {createRoot} from "react-dom/client";
import ConfigProviderApp from "./pages/ConfigProviderApp";

const Index = () => {
    return (
        <ConfigProviderApp/>
    );
};

const container = document.getElementById("app");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<Index/>);
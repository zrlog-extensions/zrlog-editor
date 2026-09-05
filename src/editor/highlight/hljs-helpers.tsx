import {marked} from "marked";
import {createCodeRenderer} from "../../markdown/code-renderer";

export {getCodeLanguages} from "../../markdown/code-renderer";

marked.setOptions({
    gfm: true,
    breaks: true,
    renderer: createCodeRenderer("placeholder"),
});

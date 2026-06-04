import hljs from "highlight.js/lib/common";
import shell from "highlight.js/lib/languages/shell";
import {marked} from "marked";

const renderer = new marked.Renderer();

const createStableId = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
        hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return hash.toString(36);
};

hljs.registerLanguage("shell", shell);

export const getCodeLanguages = (): Record<string, string[]> => {
    const records: Record<string, string[]> = {};
    hljs.listLanguages().forEach((lang) => {
        const language = hljs.getLanguage(lang);
        if (language) {
            records[lang] = [language.name as string];
        }
    });
    return records;
};

renderer.code = function ({text, lang}) {
    const validLang = lang && hljs.getLanguage(lang) ? lang : "";
    if (validLang) {
        const highlighted = hljs.highlight(text, {language: validLang}).value;
        return `<div class="code-block-wrapper" data-code="${encodeURIComponent(text)}"><pre><code class="hljs language-${validLang}">${highlighted}</code></pre></div>`;
    } else if (lang === "flow") {
        const id = "flow_" + createStableId(text);
        // 返回占位 div
        return `<div id="${id}" data-code="${encodeURIComponent(text)}" class="flow"></div>`;
    } else if (lang === "seq") {
        const id = "seq_" + createStableId(text);
        // 返回占位 div
        return `<div id="${id}" data-code="${encodeURIComponent(text)}" class="seq"></div>`;
    } else if (lang === "katex") {
        const id = "katex_" + createStableId(text);
        // 返回占位 div
        return `<div id="${id}" data-code="${encodeURIComponent(text)}" class="katex"></div>`;
    } else if (lang === "latex") {
        const id = "latex_" + createStableId(text);
        // 返回占位 div
        return `<div id="${id}" data-code="${encodeURIComponent(text)}" class="katex"></div>`;
    } else if (lang === "math") {
        const id = "math_" + createStableId(text);
        // 返回占位 div
        return `<div id="${id}" data-code="${encodeURIComponent(text)}" class="katex"></div>`;
    }
    const highlighted = hljs.highlightAuto(text).value;
    return `<div class="code-block-wrapper" data-code="${encodeURIComponent(text)}"><pre><code class="hljs">${highlighted}</code></pre></div>`;
};

marked.setOptions({
    gfm: true,
    breaks: true,
    renderer,
}); // ✅ 这样确保类型对得上

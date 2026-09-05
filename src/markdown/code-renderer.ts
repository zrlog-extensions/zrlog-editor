import hljs from "highlight.js/lib/common";
import shell from "highlight.js/lib/languages/shell";
import katex from "katex";
import {Renderer} from "marked";

export type DiagramMode = "code" | "placeholder";

hljs.registerLanguage("shell", shell);

const createStableId = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
        hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return hash.toString(36);
};

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

export const createCodeRenderer = (diagrams: DiagramMode): Renderer => {
    const renderer = new Renderer();
    renderer.code = function ({text, lang}) {
        if (lang === "flow" || lang === "seq") {
            if (diagrams === "placeholder") {
                const id = lang + "_" + createStableId(text);
                return `<div id="${id}" data-code="${encodeURIComponent(text)}" class="${lang}"></div>`;
            }
            return `<div class="code-block-wrapper" data-code="${encodeURIComponent(text)}"><pre><code class="language-${lang}">${escapeHtml(text)}</code></pre></div>`;
        }
        if (lang === "katex" || lang === "latex" || lang === "math") {
            const id = lang + "_" + createStableId(text);
            const html = katex.renderToString(text, {displayMode: false, throwOnError: false});
            return `<div id="${id}">${html}</div>`;
        }
        const validLang = lang && hljs.getLanguage(lang) ? lang : "";
        const highlighted = validLang
            ? hljs.highlight(text, {language: validLang}).value
            : hljs.highlightAuto(text).value;
        const className = validLang ? `hljs language-${validLang}` : "hljs";
        return `<div class="code-block-wrapper" data-code="${encodeURIComponent(text)}"><pre><code class="${className}">${highlighted}</code></pre></div>`;
    };
    return renderer;
};

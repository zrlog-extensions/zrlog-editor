import katex from "katex";

// 块级：$$...$$
const texBlock = /\$\$([\s\S]+?)\$\$/g;

// 行内：$...$，但排除 $$...$$
const texInline = /(?<!\$)\$(.+?)\$(?!\$)/g;

export const renderTex = (text: string) => {
    const blocks: string[] = [];

    // 1. 先替换块级公式为占位符
    text = text.replace(texBlock, (_, expr) => {
        try {
            //console.info(expr);
            const html = katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false, output: "html" });
            blocks.push(html);
            return `__BLOCK_FORMULA_${blocks.length - 1}__`;
        } catch (e) {
            console.error("KaTeX block error:", e);
            return _;
        }
    });

    // 2. 再替换行内公式
    text = text.replace(texInline, (_, expr) => {
        try {
            return katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false, output: "html" });
        } catch (e) {
            console.error("KaTeX inline error:", e);
            return _;
        }
    });

    // 3. 回填块级公式
    blocks.forEach((html, i) => {
        text = text.replace(`__BLOCK_FORMULA_${i}__`, html);
    });

    return text;
};

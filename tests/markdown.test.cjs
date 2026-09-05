const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {test} = require("node:test");

const bundle = path.resolve(__dirname, "../dist/markdown/zrlog-markdown.umd.js");
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(bundle, "utf8"), context);
const {markdownToHtml} = context.ZrLogMarkdown;

test("loads and renders without browser, Node, network, or timer globals", () => {
    for (const name of ["window", "document", "self", "require", "process", "fetch", "setTimeout", "MutationObserver"]) {
        assert.equal(vm.runInContext(`typeof ${name}`, context), "undefined");
    }
    assert.equal(markdownToHtml("# Title"), "<h1>Title</h1>\n");
    assert.equal(typeof markdownToHtml("**bold**"), "string");
    assert.equal(markdownToHtml(null), "");
    assert.equal(markdownToHtml(undefined), "");
    assert.equal(markdownToHtml(""), "");
});

test("preserves GFM tables, tasks, strikethrough, and editor line breaks", () => {
    const html = markdownToHtml("first\nsecond\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n- [x] done\n\n~~removed~~");
    for (const fragment of ["first<br>second", "<table>", "<td>2</td>", 'type="checkbox"', "checked", "<del>removed</del>"]) {
        assert.ok(html.includes(fragment), fragment);
    }
});

test("preserves CJK strong punctuation without leaking boundary markers", () => {
    const html = markdownToHtml("\u4e2d**\u201c\u6587\u201d**\u5b57");
    assert.ok(html.includes("<strong>\u201c\u6587\u201d</strong>"));
    assert.ok(!html.includes("zrlog-cjk-strong"));
});

test("highlights registered code languages and retains copy source", () => {
    const code = 'const x = "<tag>";';
    const html = markdownToHtml("```javascript\n" + code + "\n```");
    assert.ok(html.includes("hljs-keyword"));
    assert.ok(html.includes("hljs language-javascript"));
    assert.ok(html.includes(`data-code="${encodeURIComponent(code)}"`));
    assert.ok(!html.includes("<tag>"));
    assert.ok(markdownToHtml("```shell\n$ echo hello\n```").includes("language-shell"));
    assert.ok(markdownToHtml("```unknown-language\nconst x = 1;\n```").includes('class="hljs"'));
});

test("renders inline, display, and fenced math synchronously", () => {
    assert.ok(markdownToHtml("$x^2$").includes("katex-html"));
    assert.ok(markdownToHtml("$$x^2$$").includes("katex-display"));
    for (const language of ["math", "latex", "katex"]) {
        const html = markdownToHtml("```" + language + "\nx^2\n```");
        assert.ok(html.includes("katex-html"), language);
        assert.ok(html.includes("katex-mathml"), language);
        assert.ok(!html.includes("data-code="), language);
    }
});

test("invalid formulas produce KaTeX error HTML without failing the article", () => {
    assert.ok(markdownToHtml("$x^{$").includes("katex-error"));
    assert.ok(markdownToHtml("```math\nx^{\n```").includes("katex-error"));
});

test("does not interpret math or CJK markup inside code", () => {
    const source = "$x$ **\u201c\u6587\u201d**";
    const html = markdownToHtml("`" + source + "`\n\n```plaintext\n" + source + "\n```");
    assert.ok(html.includes("<code>" + source + "</code>"));
    assert.ok(!html.includes("katex"));
    assert.ok(!html.includes("<strong>"));
    assert.ok(!html.includes("zrlog-cjk-strong"));
});

test("diagrams retain escaped source by default and hydrate only on request", () => {
    const code = 'A->B: <script>alert("x")</script>';
    for (const language of ["flow", "seq"]) {
        const source = "```" + language + "\n" + code + "\n```";
        const fallback = markdownToHtml(source);
        assert.ok(fallback.includes(`class="language-${language}"`));
        assert.ok(fallback.includes("&lt;script&gt;"));
        assert.ok(!fallback.includes("<script>"));
        const placeholder = markdownToHtml(source, {diagrams: "placeholder"});
        assert.ok(placeholder.includes(`class="${language}"></div>`));
        assert.ok(placeholder.includes(`data-code="${encodeURIComponent(code)}"`));
        assert.equal(markdownToHtml(source), fallback);
        assert.equal(markdownToHtml(source, {diagrams: "placeholder"}), placeholder);
    }
});

test("repeated renders do not retain math tokens or diagram options", () => {
    const source = "$x^2$\n\n```flow\nst=>start: Start\n```";
    const expected = markdownToHtml(source);
    for (let i = 0; i < 10; i++) {
        markdownToHtml("$$y^3$$", {diagrams: "placeholder"});
        assert.equal(markdownToHtml(source), expected);
        assert.equal(markdownToHtml("plain"), "<p>plain</p>\n");
    }
});

test("retains raw HTML and leaves link preview fetching to the caller", () => {
    const html = '<div class="custom">custom</div>';
    assert.ok(markdownToHtml(html).includes(html));
    assert.ok(markdownToHtml("https://example.com").includes('href="https://example.com"'));
    assert.ok(!markdownToHtml("https://example.com").includes("zrlog-link-preview-card"));
});

test("the same bundle supports CommonJS without external runtime dependencies", () => {
    const commonJsContext = vm.createContext({module: {exports: {}}, exports: {}});
    vm.runInContext(fs.readFileSync(bundle, "utf8"), commonJsContext);
    const render = commonJsContext.module.exports.markdownToHtml;
    assert.equal(render("# Title"), markdownToHtml("# Title"));
    assert.equal(require(bundle).markdownToHtml("$x^2$"), markdownToHtml("$x^2$"));
});

test("browser adapter preserves generated math through async and callback rendering", async () => {
    const ts = require("typescript");
    const {JSDOM} = require("jsdom");
    const dom = new JSDOM();
    const source = fs.readFileSync(path.resolve(__dirname, "../src/editor/utils/marked-utils.tsx"), "utf8");
    const compiled = ts.transpileModule(source, {
        compilerOptions: {target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX},
    }).outputText;
    const module = {exports: {}};
    const browserContext = vm.createContext({
        module, exports: module.exports, document: dom.window.document,
        require(name) {
            if (name === "../../markdown") return {markdownToHtml};
            // UI and diagram dependencies are unused in this math/code adapter regression.
            if (["flowchart.js", "react-sequence-diagram", "react-dom/client", "react/jsx-runtime", "antd", "../lang/editor-lang"].includes(name)) return {};
            throw new Error("Unexpected browser dependency: " + name);
        },
    });
    try {
        vm.runInContext(compiled, browserContext);
        const adapter = module.exports;
        const markdown = "$x^2$\n\n$$y^3$$\n\n```math\nz^4\n```\n\n```javascript\nconst x = 1;\n```";
        const asyncHtml = await adapter.markdownToHtml(markdown);
        const container = dom.window.document.createElement("div");
        container.innerHTML = asyncHtml;
        assert.equal(container.querySelectorAll(".katex-html").length, 3);
        for (const formula of container.querySelectorAll(".katex-html")) {
            assert.notEqual(formula.textContent, "");
        }
        assert.ok(container.querySelector(".katex-display"));
        assert.ok(container.querySelector(".hljs-keyword"));
        let immediateHtml;
        const callbackHtml = await new Promise(resolve => {
            immediateHtml = adapter.markdownToHtmlSyncWithCallback(markdown, resolve);
        });
        assert.equal(immediateHtml, asyncHtml);
        assert.equal(callbackHtml, asyncHtml);
    } finally {
        dom.window.close();
    }
});

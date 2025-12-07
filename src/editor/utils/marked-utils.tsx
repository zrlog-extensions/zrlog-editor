import { renderTex } from "./katex-helpers";
import { marked } from "marked";

import flowchart from "flowchart.js";

//@ts-ignore
import SequenceDiagram from "react-sequence-diagram";
import { createRoot, Root } from "react-dom/client";
import katex from "katex";

const renderMap = new Map<Element, Root>();

function renderDiagramReact(el: Element, content: JSX.Element) {
    let root = renderMap.get(el);
    if (!root) {
        root = createRoot(el);
        renderMap.set(el, root);
    }
    root.render(content);
}

const createHideElement = () => {
    const hiddenContainer = document.createElement("div");
    hiddenContainer.style.position = "absolute";
    hiddenContainer.style.left = "-9999px";
    hiddenContainer.style.top = "-9999px";
    hiddenContainer.style.visibility = "hidden";
    return hiddenContainer;
};

function renderSequenceWithObserver(el: Element, code: string): Promise<void> {
    return new Promise((resolve) => {
        const hiddenContainer = createHideElement();
        document.body.appendChild(hiddenContainer);

        renderDiagramReact(hiddenContainer, <SequenceDiagram input={code} options={{ theme: "simple" }} />);

        const observer = new MutationObserver(() => {
            el.innerHTML = hiddenContainer.innerHTML;
            observer.disconnect();
            resolve();
        });

        observer.observe(hiddenContainer, { childList: true, subtree: true });

        setTimeout(() => {
            observer.disconnect();
            resolve(); // fallback 超时，避免卡死
        }, 1000);
    });
}

const getCodeAndCleanUp = (div: Element) => {
    const code = decodeURIComponent((div as HTMLDivElement).dataset.code || "");
    (div as HTMLDivElement).dataset.code = "";
    return code;
};

async function hydrateCodeBlocks(virtualElement: HTMLElement) {
    virtualElement.querySelectorAll(".flow").forEach((div) => {
        const code = getCodeAndCleanUp(div);
        try {
            const hiddenContainer = createHideElement();
            document.body.appendChild(hiddenContainer);
            const chart = flowchart.parse(code);
            chart.drawSVG(hiddenContainer);
            div.innerHTML = hiddenContainer.innerHTML;
            document.body.removeChild(hiddenContainer);
        } catch (err) {
            div.innerHTML = `<pre style="color:red">${String(err)}</pre>`;
        }
    });

    const tasks: Promise<void>[] = [];
    virtualElement.querySelectorAll(".seq").forEach((div) => {
        const code = getCodeAndCleanUp(div);
        try {
            tasks.push(renderSequenceWithObserver(div, code));
        } catch (err) {
            div.innerHTML = `<pre style="color:red">${String(err)}</pre>`;
        }
    });

    virtualElement.querySelectorAll(".katex").forEach((div) => {
        const code = getCodeAndCleanUp(div);
        try {
            katex.render(code, div as HTMLElement, { displayMode: false, throwOnError: false });
        } catch (err) {
            div.innerHTML = `<pre style="color:red">${String(err)}</pre>`;
        }
    });
    await Promise.all(tasks);
}

const markdownRenderToDiv = (markdownValue: string) => {
    const text = marked(markdownValue) as string;
    // 创建离屏容器（不挂载到页面）
    const container = document.createElement("div");
    container.innerHTML = text;
    return container;
};

export const markdownToHtml = async (markdownValue: string) => {
    const container = markdownRenderToDiv(markdownValue);
    await hydrateCodeBlocks(container);
    return renderTex(container.innerHTML);
};

export const markdownToHtmlSyncWithCallback = (markdownValue: string, onSuccess: (realHtmlStr: string) => void) => {
    const container = markdownRenderToDiv(markdownValue);
    hydrateCodeBlocks(container).then(() => {
        onSuccess(renderTex(container.innerHTML));
    });
    return renderTex(container.innerHTML);
};

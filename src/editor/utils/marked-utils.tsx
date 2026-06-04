import { marked } from "marked";

import flowchart from "flowchart.js";

//@ts-ignore
import SequenceDiagram from "react-sequence-diagram";
import { createRoot, Root } from "react-dom/client";
import katex from "katex";
import { Typography } from "antd";
import { getEditorRes } from "../lang/editor-lang";
import {LinkPreviewConfig, LinkPreviewData} from "../editor.types";
import {AxiosInstance} from "axios";

const renderMap = new WeakMap<Element, Root>();
const standaloneUrlPattern = /^https?:\/\/[^\s<>"']+$/i;
const linkPreviewCache = new Map<string, Promise<LinkPreviewData | null | undefined>>();

export type MarkdownRenderOptions = {
    linkPreview?: boolean | LinkPreviewConfig;
    axiosInstance?: AxiosInstance;
    abortSignal?: AbortSignal;
}

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

export function hydrateReactComponents(virtualElement: HTMLElement) {
    virtualElement.querySelectorAll(".code-block-wrapper").forEach((div) => {
        const code = getCodeAndCleanUp(div);
        if (code) {
            const copyBtn = document.createElement("div");
            copyBtn.className = "copy-button";
            div.appendChild(copyBtn);
            renderDiagramReact(
                copyBtn,
                <Typography.Paragraph
                    copyable={{ text: code, tooltips: [getEditorRes("copy"), getEditorRes("copied")] }}
                    style={{ margin: 0 }}
                />,
            );
        }
    });
}

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

type MarkdownSegment = {
    value: string;
    locked: boolean;
};

type MarkdownMathToken = {
    placeholder: string;
    expression: string;
    displayMode: boolean;
};

const fencedCodeLinePattern = /^(```|~~~)/;
const inlineCodePattern = /(`+)([\s\S]*?)\1/g;
const texBlockPattern = /\$\$([\s\S]+?)\$\$/g;
const texInlinePattern = /(?<!\$)\$(.+?)\$(?!\$)/g;
const cjkStrongBoundaryMarker = "<!--zrlog-cjk-strong-->";
const cjkCharRange = "\\u3400-\\u4DBF\\u4E00-\\u9FFF\\uF900-\\uFAFF\\u3040-\\u30FF\\uAC00-\\uD7AF";

const escapeRegexCharClass = (value: string) => value.replace(/[\\\]\-\^]/g, "\\$&");
const cjkStrongBoundaryPunctuationClass = escapeRegexCharClass("'\"“”‘’「」『』（）()《》〈〉【】[]{}，。！？；：、,.!?;:");
const cjkStrongOpenBoundaryPattern = new RegExp(`([${cjkCharRange}])\\*\\*(?=[${cjkStrongBoundaryPunctuationClass}])`, "g");
const cjkStrongCloseBoundaryPattern = new RegExp(`([${cjkStrongBoundaryPunctuationClass}])\\*\\*(?=[${cjkCharRange}])`, "g");

const splitFencedCodeSegments = (markdownValue: string) => {
    const parts = markdownValue.split(/(\r?\n)/);
    const segments: MarkdownSegment[] = [];
    let buffer = "";
    let activeFence = "";
    let locked = false;

    const flush = () => {
        if (buffer) {
            segments.push({value: buffer, locked});
            buffer = "";
        }
    };

    parts.forEach((part) => {
        if (/^\r?\n$/.test(part)) {
            buffer += part;
            return;
        }
        const fenceMatch = part.trim().match(fencedCodeLinePattern);
        if (fenceMatch && (!activeFence || fenceMatch[1] === activeFence)) {
            if (!activeFence) {
                flush();
                activeFence = fenceMatch[1];
                locked = true;
                buffer = part;
                return;
            }
            buffer += part;
            flush();
            activeFence = "";
            locked = false;
            return;
        }
        buffer += part;
    });
    flush();
    return segments;
};

const transformOutsideInlineCode = (markdownValue: string, transform: (value: string) => string) => {
    let output = "";
    let lastIndex = 0;
    markdownValue.replace(inlineCodePattern, (match: string, _ticks: string, _code: string, offset: number) => {
        output += transform(markdownValue.slice(lastIndex, offset));
        output += match;
        lastIndex = offset + match.length;
        return match;
    });
    return output + transform(markdownValue.slice(lastIndex));
};

const transformOutsideMarkdownCode = (markdownValue: string, transform: (value: string) => string) => {
    return splitFencedCodeSegments(markdownValue)
        .map((segment) => segment.locked ? segment.value : transformOutsideInlineCode(segment.value, transform))
        .join("");
};

const escapeMathSource = (value: string) => {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

const createMathPlaceholder = (expression: string, displayMode: boolean, tokens: MarkdownMathToken[]) => {
    const attrName = displayMode ? "data-zrlog-math-block" : "data-zrlog-math-inline";
    const tagName = displayMode ? "div" : "span";
    const placeholder = `<${tagName} ${attrName}="${tokens.length}"></${tagName}>`;
    tokens.push({placeholder, expression, displayMode});
    return placeholder;
};

const extractMarkdownMath = (markdownValue: string) => {
    const tokens: MarkdownMathToken[] = [];
    const markdown = transformOutsideMarkdownCode(markdownValue, (value) => {
        const withBlockMath = value.replace(texBlockPattern, (_match, expression: string) => {
            return createMathPlaceholder(expression, true, tokens);
        });
        return withBlockMath.replace(texInlinePattern, (_match, expression: string) => {
            return createMathPlaceholder(expression, false, tokens);
        });
    });
    return {markdown, tokens};
};

const renderMathToken = (token: MarkdownMathToken) => {
    try {
        return katex.renderToString(token.expression, {
            displayMode: token.displayMode,
            throwOnError: false,
            output: "html",
        });
    } catch (e) {
        const source = token.displayMode ? `$$${token.expression}$$` : `$${token.expression}$`;
        return escapeMathSource(source);
    }
};

const restoreMarkdownMath = (html: string, tokens: MarkdownMathToken[]) => {
    return tokens.reduce((value, token) => {
        return value.split(token.placeholder).join(renderMathToken(token));
    }, html);
};

const addCjkStrongBoundaryMarkers = (markdownValue: string) => {
    return transformOutsideMarkdownCode(markdownValue, (value) => {
        return value
            .replace(cjkStrongOpenBoundaryPattern, `$1${cjkStrongBoundaryMarker}**`)
            .replace(cjkStrongCloseBoundaryPattern, `$1**${cjkStrongBoundaryMarker}`);
    });
};

const renderMarkdownToHtml = (markdownValue: string) => {
    const mathResult = extractMarkdownMath(markdownValue);
    const markdown = addCjkStrongBoundaryMarkers(mathResult.markdown);
    const html = marked(markdown) as string;
    return restoreMarkdownMath(html, mathResult.tokens).split(cjkStrongBoundaryMarker).join("");
};

const markdownRenderToDiv = (markdownValue: string) => {
    const text = renderMarkdownToHtml(markdownValue);
    // 创建离屏容器（不挂载到页面）
    const container = document.createElement("div");
    container.innerHTML = text;
    return container;
};

const isLinkPreviewEnabled = (linkPreview?: boolean | LinkPreviewConfig) => {
    if (linkPreview === undefined) {
        return false;
    }
    if (typeof linkPreview === "boolean") {
        return linkPreview;
    }
    return linkPreview.enabled !== false;
};

const getLinkPreviewApiUrl = (linkPreview?: boolean | LinkPreviewConfig) => {
    if (!linkPreview || typeof linkPreview === "boolean") {
        return "";
    }
    return linkPreview.apiUrl || "";
};

const getLinkPreviewRequestDelay = (linkPreview?: boolean | LinkPreviewConfig) => {
    if (!linkPreview || typeof linkPreview === "boolean") {
        return 500;
    }
    return linkPreview.requestDelay ?? 500;
};

const waitForRequestDelay = (delay: number, abortSignal?: AbortSignal) => {
    if (delay <= 0) {
        return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
        if (abortSignal?.aborted) {
            reject(new DOMException("Aborted", "AbortError"));
            return;
        }
        const timer = window.setTimeout(() => {
            abortSignal?.removeEventListener("abort", handleAbort);
            resolve();
        }, delay);
        const handleAbort = () => {
            window.clearTimeout(timer);
            reject(new DOMException("Aborted", "AbortError"));
        };
        abortSignal?.addEventListener("abort", handleAbort, {once: true});
    });
};

const isIpv4Host = (hostname: string) => /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);

const isIpv6Host = (hostname: string) => hostname.includes(":");

const isRequestableUrl = (value: string) => {
    try {
        const url = new URL(value);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return false;
        }
        const hostname = url.hostname.toLowerCase();
        if (!hostname || hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".")) {
            return false;
        }
        if (isIpv4Host(hostname) || isIpv6Host(hostname)) {
            return true;
        }
        if (!hostname.includes(".")) {
            return false;
        }
        const parts = hostname.split(".");
        const topLevelDomain = parts[parts.length - 1];
        return topLevelDomain.length >= 2;
    } catch (e) {
        return false;
    }
};

const escapeHtml = (value?: string) => {
    return (value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

const escapeAttr = escapeHtml;

const linkPreviewCardHtml = (preview: LinkPreviewData) => {
    const url = escapeAttr(preview.url);
    const title = escapeHtml(preview.title || preview.url);
    const description = escapeHtml(preview.description);
    const image = escapeAttr(preview.image);
    const meta = escapeHtml([preview.siteName, preview.domain].filter(Boolean).join(" · "));
    const imageHtml = image
        ? `<img src="${image}" alt="${title}" style="width:116px;min-height:96px;object-fit:cover;flex:0 0 116px;border:0" />`
        : "";
    const metaHtml = meta
        ? `<span style="color:inherit;opacity:.72;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${meta}</span>`
        : "";
    const descriptionHtml = description
        ? `<span style="color:inherit;opacity:.72;font-size:13px;line-height:1.45;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${description}</span>`
        : "";
    return `<div class="zrlog-link-preview-card" data-zrlog-link-preview-url="${url}" style="margin:0 0 1rem"><a href="${url}" target="_blank" rel="noreferrer" style="display:flex;gap:12px;color:inherit;text-decoration:none;border:1px solid rgba(127,127,127,.35);border-radius:10px;overflow:hidden">${imageHtml}<span style="min-width:0;padding:${image ? "12px 12px 12px 0" : "12px"};display:flex;flex-direction:column;gap:6px">${metaHtml}<strong style="color:inherit;font-size:15px;line-height:1.35;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${title}</strong>${descriptionHtml}</span></a></div>`;
};

const isCanceledRequest = (error: any) => {
    return error?.code === "ERR_CANCELED" || error?.name === "CanceledError" || error?.name === "AbortError";
};

const requestLinkPreview = (apiUrl: string, axiosInstance: AxiosInstance, url: string, abortSignal?: AbortSignal) => {
    return axiosInstance
        .get(apiUrl + (apiUrl.includes("?") ? "&" : "?") + "url=" + encodeURIComponent(url), {
            showError: false,
            signal: abortSignal,
        } as never)
        .then((response) => {
            const responseData = response.data;
            if (responseData && responseData.data) {
                return responseData.data as LinkPreviewData;
            }
            return responseData as LinkPreviewData;
        })
        .catch(() => null);
};

const withLinkPreviewCards = async (markdownValue: string, options?: MarkdownRenderOptions) => {
    if (!isLinkPreviewEnabled(options?.linkPreview)) {
        return markdownValue;
    }
    const apiUrl = getLinkPreviewApiUrl(options?.linkPreview);
    const axiosInstance = options?.axiosInstance;
    if (!apiUrl || !axiosInstance) {
        return markdownValue;
    }
    const lines = markdownValue.split(/\r?\n/);
    const replacements = new Map<number, string>();
    let fencedCode = false;
    const tasks: Promise<void>[] = [];
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (/^(```|~~~)/.test(trimmed)) {
            fencedCode = !fencedCode;
            return;
        }
        if (fencedCode || line !== trimmed || !standaloneUrlPattern.test(trimmed) || !isRequestableUrl(trimmed)) {
            return;
        }
        const cacheKey = apiUrl + "|" + trimmed;
        let request = linkPreviewCache.get(cacheKey);
        if (!request) {
            request = waitForRequestDelay(getLinkPreviewRequestDelay(options.linkPreview), options.abortSignal)
                .then(() => requestLinkPreview(apiUrl, axiosInstance, trimmed, options.abortSignal))
                .catch((error) => {
                if (isCanceledRequest(error)) {
                    linkPreviewCache.delete(cacheKey);
                }
                return null;
            });
            linkPreviewCache.set(cacheKey, request);
        }
        tasks.push(request.then((preview) => {
            if (!preview || preview.available === false) {
                return;
            }
            replacements.set(index, linkPreviewCardHtml({...preview, url: preview.url || trimmed}));
        }));
    });
    await Promise.all(tasks);
    if (replacements.size === 0) {
        return markdownValue;
    }
    return lines.map((line, index) => replacements.get(index) || line).join("\n");
};

export const markdownToHtml = async (markdownValue: string, options?: MarkdownRenderOptions) => {
    const container = markdownRenderToDiv(await withLinkPreviewCards(markdownValue, options));
    await hydrateCodeBlocks(container);
    return container.innerHTML;
};

export const markdownToHtmlSyncWithCallback = (markdownValue: string, onSuccess: (realHtmlStr: string) => void, options?: MarkdownRenderOptions) => {
    const container = markdownRenderToDiv(markdownValue);
    withLinkPreviewCards(markdownValue, options).then((value) => {
        const realContainer = markdownRenderToDiv(value);
        hydrateCodeBlocks(realContainer).then(() => {
            onSuccess(realContainer.innerHTML);
        });
    });
    return container.innerHTML;
};

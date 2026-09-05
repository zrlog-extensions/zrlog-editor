### Editor

<div align="center">

一个支持编辑、预览和扩展集成的 Markdown 编辑器，基于 React + CodeMirror + Marked 构建。

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.9.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.3.1-61dafb)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue)](https://www.typescriptlang.org/)

</div>


## 主页

[演示](https://editor.zrlog.com)

## ✨ 特性

- 📝 **实时预览** - 编辑时同步渲染 Markdown
- 🎨 **语法高亮** - 支持多种编程语言的代码高亮显示
- 🤖 **AI 辅助写作** - 可接入文章助手处理选中文本和上下文
- 📊 **数学公式** - 支持 KaTeX 数学公式渲染
- 🔄 **滚动同步** - 编辑器与预览面板同步滚动
- 📷 **图片上传** - 支持粘贴和拖拽上传图片及视频
- 🎯 **流程图支持** - 支持 flowchart.js 流程图和时序图
- 📱 **响应式设计** - 适配桌面和移动端
- 🌐 **国际化** - 支持多语言界面
- ⚡ **编辑响应** - 基于 CodeMirror 6 处理长文本编辑

## 🏗️ 架构

### 技术栈

```
前端框架：React 18.3.1
UI 组件：Ant Design 6.0.1
编辑器核心：CodeMirror 6
Markdown 解析：Marked 16.0.0
数学公式：KaTeX 0.16.22
代码高亮：Highlight.js 11.11.1
构建工具：Create React App + Craco
语言：TypeScript 5.8.3
```

## 📦 集成使用

### NPM 包方式

```bash
npm install zrlog-editor
```

```javascript
import { MarkedEditor } from 'zrlog-editor';
import { useState } from 'react';

function App() {
  const [markdown, setMarkdown] = useState('# Hello World');

  return (
    <MarkedEditor
      value={markdown}
      onChange={({ value }) => setMarkdown(value)}
    />
  );
}
```

### 独立 Markdown 渲染 bundle

```bash
yarn build:markdown
```

产物为 `dist/markdown/zrlog-markdown.umd.js`，同时生成 TypeScript 类型声明。
bundle 内置 Marked、Highlight.js 和 KaTeX，无需额外 JS 依赖。
`yarn build` 和 `shell/version.sh` 的发布打包流程也会构建此产物。

发布新版本时，`shell/version.sh` 会将同一次构建的压缩 bundle 单独保存到
`artifacts/zrlog-markdown-v<版本号>.min.js`，与 `artifacts/v<版本号>.tgz` 一起提交并通过现有
CDN 同步流程上传。例如发布 `2.1.32` 时，对应文件为 `artifacts/zrlog-markdown-v2.1.32.min.js`。

在 GraalJS / Polyglot 中加载后，通过全局对象同步调用：

```javascript
ZrLogMarkdown.markdownToHtml('# Hello\n\n$x^2$');
```

在 Node.js 中也可以直接加载同一个文件：

```javascript
const {markdownToHtml} = require('./dist/markdown/zrlog-markdown.umd.js');
const html = markdownToHtml('```javascript\nconst x = 1;\n```');
```

接口为 `markdownToHtml(markdown, options?): string`。`null`、`undefined` 和空字符串返回空字符串，
渲染不需要 `document`、`window`、Node.js 全局变量、定时器或网络访问。

支持 GFM、换行、中文加粗边界修正、代码高亮、行内/块级公式和 `math` / `latex` / `katex` 代码块。
`flow` / `seq` 默认输出保留源码的转义代码块；传入 `{diagrams: 'placeholder'}` 则生成带
`data-code` 的图表占位元素，供浏览器完成绘制。编辑器预览使用这个模式，共享同一套解析逻辑。
链接预览请求和复制按钮仍由浏览器层处理。

此入口只生成 HTML，不执行 HTML 清理，保留 Marked 对原始 HTML 的支持。
展示页面仍需加载 Markdown、Highlight.js 和 KaTeX 样式，以及 KaTeX 字体。

Java 17+、GraalJS 25.0.2 的调用示例：

```java
Source source = Source.newBuilder("js", new File("dist/markdown/zrlog-markdown.umd.js")).build();
try (Context context = Context.newBuilder("js")
        .allowHostAccess(HostAccess.NONE)
        .allowHostClassLookup(name -> false)
        .allowIO(IOAccess.NONE)
        .build()) {
    context.eval(source);
    Value render = context.getBindings("js")
            .getMember("ZrLogMarkdown").getMember("markdownToHtml");
    String html = render.execute("# Hello\n\n$x^2$").asString();
}
```

`Context` 不应被多个线程同时使用；服务端可以沿用共享 `Engine` / `Source`、每次渲染独立 `Context` 的方式。

验证无 DOM 渲染和 Polyglot 兼容性：

```bash
yarn test:markdown
# GRAALJS_CLASSPATH 指向 GraalJS 及其运行依赖，例如 /path/to/zrlog-main/lib/*
java -cp "$GRAALJS_CLASSPATH" tests/MarkdownPolyglotSmoke.java
```

## 📄 开源协议

本项目采用 **Apache License 2.0** 开源协议。


## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork 本仓库**
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **提交 Pull Request**

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 配置规则
- 使用 Prettier 格式化代码
- 提交前运行 `yarn lint` 确保代码质量

### 提交信息规范

```
<type>: <subject>

类型(type)：
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 构建/工具链更新
```

## 💬 反馈与支持

### 问题反馈

如果你在使用过程中遇到问题，欢迎通过以下方式反馈：

- 🐛 [提交 Issue](https://github.com/zrlog/zrlog-editor/issues/new) - 报告 bug 或提出新功能建议

## 📊 变更日志

查看 [editor-changelog.md](editor-changelog.md) 了解版本更新历史。

## ⭐ Star History

如果这个项目对你有帮助，请给我们一个 Star ⭐️

## 📜 致谢

感谢以下开源项目：

- [React](https://reactjs.org/) - 用户界面库
- [Ant Design](https://ant.design/) - UI 组件库
- [CodeMirror](https://codemirror.net/) - 代码编辑器
- [Marked](https://marked.js.org/) - Markdown 解析器
- [KaTeX](https://katex.org/) - 数学公式渲染
- [Highlight.js](https://highlightjs.org/) - 代码高亮

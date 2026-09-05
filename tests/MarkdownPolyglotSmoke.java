import java.io.File;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.HostAccess;
import org.graalvm.polyglot.PolyglotAccess;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.io.IOAccess;

class MarkdownPolyglotSmoke {
    public static void main(String[] args) throws Exception {
        File bundle = new File(args.length == 0 ? "dist/markdown/zrlog-markdown.umd.js" : args[0]);
        try (Context context = Context.newBuilder("js")
                .allowHostAccess(HostAccess.NONE)
                .allowHostClassLookup(name -> false)
                .allowPolyglotAccess(PolyglotAccess.NONE)
                .allowIO(IOAccess.NONE)
                .allowCreateThread(false)
                .allowNativeAccess(false)
                .option("engine.WarnInterpreterOnly", "false")
                .build()) {
            context.eval(Source.newBuilder("js", bundle).build());
            Value render = context.getBindings("js").getMember("ZrLogMarkdown").getMember("markdownToHtml");
            check("No browser or Node globals", context.eval("js",
                    "['document', 'window', 'self', 'require', 'process', 'fetch', 'setTimeout']"
                    + ".every(name => typeof globalThis[name] === 'undefined')").asBoolean());
            check("GFM table", render.execute("| A | B |\n| - | - |\n| 1 | 2 |").asString().contains("<table>"));
            check("Line breaks", render.execute("first\nsecond").asString().contains("first<br>second"));
            check("CJK strong", render.execute("\u4e2d**\u201c\u6587\u201d**\u5b57").asString()
                    .contains("<strong>\u201c\u6587\u201d</strong>"));
            check("Code highlighting", render.execute("```javascript\nconst x = 1;\n```").asString().contains("hljs-keyword"));
            check("Inline math", render.execute("$x^2$").asString().contains("katex-html"));
            check("Display math", render.execute("$$x^2$$").asString().contains("katex-display"));
            for (String language : new String[]{"math", "latex", "katex"}) {
                check("Fenced " + language, render.execute("```" + language + "\nx^2\n```").asString().contains("katex-html"));
            }
            check("Invalid math", render.execute("```math\nx^{\n```").asString().contains("katex-error"));
            check("Diagram fallback", render.execute("```flow\nst=>start: <Start>\n```").asString().contains("&lt;Start&gt;"));
            check("Empty input", render.execute((Object) null).asString().isEmpty());
            for (int i = 0; i < 10; i++) {
                render.execute("$x^2$");
                if (!render.execute("plain").asString().equals("<p>plain</p>\n")) {
                    throw new AssertionError("Repeated render isolation");
                }
            }
            check("Repeated render isolation", true);
        }
    }

    private static void check(String label, boolean passed) {
        if (!passed) {
            throw new AssertionError(label);
        }
        System.out.println("PASS " + label);
    }
}

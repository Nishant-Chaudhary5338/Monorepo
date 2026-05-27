import { motion } from "framer-motion";

const codeLines = [
  { text: "import { McpServerBase } from '@tools/shared';", type: "import" },
  { text: "import type { ToolResult } from '@tools/shared';", type: "import" },
  { text: "", type: "blank" },
  { text: "class WeatherServer extends McpServerBase {", type: "class" },
  { text: "  constructor() {", type: "method" },
  { text: "    super({ name: 'weather', version: '1.0.0' });", type: "body" },
  { text: "  }", type: "method" },
  { text: "", type: "blank" },
  { text: "  protected registerTools(): void {", type: "method" },
  { text: "    this.addTool(", type: "body" },
  { text: "      'get_weather',              // tool name", type: "arg" },
  { text: "      'Get current weather',      // description (AI reads this!)", type: "arg" },
  { text: "      {", type: "body" },
  { text: "        type: 'object',", type: "body" },
  { text: "        properties: { city: { type: 'string' } },", type: "body" },
  { text: "        required: ['city'],", type: "body" },
  { text: "      },", type: "body" },
  { text: "      this.handleGetWeather.bind(this)", type: "body" },
  { text: "    );", type: "body" },
  { text: "  }", type: "method" },
  { text: "", type: "blank" },
  { text: "  private async handleGetWeather(args: unknown): Promise<ToolResult> {", type: "method" },
  { text: "    const { city } = args as { city: string };", type: "body" },
  { text: "    return this.success({ temp: '22°C', city }); // ← done!", type: "return" },
  { text: "  }", type: "method" },
  { text: "}", type: "class" },
  { text: "", type: "blank" },
  { text: "new WeatherServer().run(); // stdio by default", type: "run" },
];

const typeColor: Record<string, string> = {
  import: "text-cyan-400/80",
  class: "text-violet-300/90",
  method: "text-amber-300/80",
  body: "text-white/60",
  arg: "text-emerald-300/75",
  return: "text-emerald-400/90",
  run: "text-violet-400/90",
  blank: "",
};

export function MCPBuildTS() {
  return (
    <div className="relative w-full h-full slide-bg-void flex flex-col items-center justify-center overflow-hidden px-12">
      <div className="absolute inset-0 pointer-events-none slide-bg-grid opacity-15" />

      <div className="flex items-start gap-8 w-full max-w-5xl">
        {/* Left: heading + key points */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 w-56 pt-4"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-violet-400/60 mb-3 font-medium">TypeScript</p>
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            Build an MCP server in <span className="gradient-text-violet">50 lines</span>
          </h2>

          <div className="space-y-3 mt-6">
            {[
              { c: "text-cyan-300", t: "addTool() — register once" },
              { c: "text-amber-300", t: "description — AI uses this to decide when to call" },
              { c: "text-emerald-400", t: "this.success() — typed response" },
              { c: "text-violet-300", t: ".run() — starts stdio server" },
            ].map((item) => (
              <div key={item.t} className="flex items-start gap-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${item.c}`} style={{ background: "currentColor" }} />
                <p className={`text-xs ${item.c} leading-snug`}>{item.t}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 px-3 py-2.5 rounded-xl border border-violet-500/20 bg-violet-500/8">
            <p className="text-xs text-violet-300/70 font-medium">
              McpServerBase handles <span className="text-violet-300">all JSON-RPC boilerplate</span> for you
            </p>
          </div>
        </motion.div>

        {/* Right: code block */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 rounded-2xl border border-white/8 bg-black/40 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-white/3">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
            <span className="ml-2 text-xs text-white/25 font-mono">weather-server/src/index.ts</span>
          </div>
          <pre className="p-5 text-[11px] font-mono leading-[1.7] overflow-auto" style={{ maxHeight: 520 }}>
            {codeLines.map((line, i) => (
              <div key={i} className={typeColor[line.type] ?? "text-white/60"}>
                {line.text || " "}
              </div>
            ))}
          </pre>
        </motion.div>
      </div>
    </div>
  );
}

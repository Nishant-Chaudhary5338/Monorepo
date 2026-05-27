import { motion } from "framer-motion";

const codeLines = [
  { text: "# pip install fastmcp", type: "comment" },
  { text: "from fastmcp import FastMCP", type: "import" },
  { text: "", type: "blank" },
  { text: "mcp = FastMCP('weather-server')", type: "init" },
  { text: "", type: "blank" },
  { text: "@mcp.tool()", type: "decorator" },
  { text: "def get_weather(city: str) -> str:", type: "def" },
  { text: '    """Get current weather for a city."""', type: "docstring" },
  { text: "    # Your logic here:", type: "comment" },
  { text: "    # - call an external API", type: "comment" },
  { text: "    # - query a database", type: "comment" },
  { text: "    # - read from a file", type: "comment" },
  { text: "    return f'22°C, sunny in {city}'", type: "return" },
  { text: "", type: "blank" },
  { text: "@mcp.tool()", type: "decorator" },
  { text: "def query_database(sql: str, db_url: str) -> dict:", type: "def" },
  { text: '    """Run a SQL query and return results."""', type: "docstring" },
  { text: "    import sqlalchemy", type: "body" },
  { text: "    engine = sqlalchemy.create_engine(db_url)", type: "body" },
  { text: "    with engine.connect() as conn:", type: "body" },
  { text: "        result = conn.execute(sqlalchemy.text(sql))", type: "body" },
  { text: "        return {'rows': result.fetchall()}", type: "return" },
  { text: "", type: "blank" },
  { text: "if __name__ == '__main__':", type: "main" },
  { text: "    mcp.run()  # stdio by default", type: "run" },
  { text: "    # mcp.run('http', host='0.0.0.0', port=8080)  # HTTP mode", type: "comment" },
];

const typeColor: Record<string, string> = {
  comment: "text-white/30 italic",
  import: "text-cyan-400/80",
  init: "text-white/70",
  decorator: "text-amber-400/90",
  def: "text-violet-300/90",
  docstring: "text-emerald-400/60 italic",
  body: "text-white/60",
  return: "text-emerald-300/80",
  main: "text-violet-300/70",
  run: "text-cyan-300/80",
  blank: "",
};

export function MCPBuildPython() {
  return (
    <div className="relative w-full h-full slide-bg-cosmos flex flex-col items-center justify-center overflow-hidden px-12">
      <div className="flex items-start gap-8 w-full max-w-5xl">
        {/* Left heading */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 w-56 pt-4"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-amber-400/60 mb-3 font-medium">Python</p>
          <h2 className="text-3xl font-black text-white mb-4 leading-tight">
            FastMCP — <span className="gradient-text-emerald">20 lines</span>
          </h2>

          <div className="space-y-3 mt-6">
            {[
              { c: "text-amber-300", t: "@mcp.tool() decorator — that's it!" },
              { c: "text-emerald-400", t: "Docstring = AI's description (auto-used)" },
              { c: "text-cyan-300", t: "Type hints = input schema (auto-generated)" },
              { c: "text-violet-300", t: "mcp.run() = stdio or HTTP" },
            ].map((item) => (
              <div key={item.t} className="flex items-start gap-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${item.c}`} style={{ background: "currentColor" }} />
                <p className={`text-xs ${item.c} leading-snug`}>{item.t}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <div className="px-3 py-2 rounded-xl border border-amber-500/20 bg-amber-500/8">
              <p className="text-xs text-amber-300/70 font-mono">pip install fastmcp</p>
            </div>
            <div className="px-3 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/8">
              <p className="text-xs text-cyan-300/70 font-mono">python server.py</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-white/25 leading-relaxed">
            Works in Cline exactly the same as TypeScript — just change{" "}
            <code className="text-white/40">"command": "python"</code>
          </p>
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
            <span className="ml-2 text-xs text-white/25 font-mono">server.py</span>
            <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold">Python</span>
          </div>
          <pre className="p-5 text-[11px] font-mono leading-[1.7] overflow-auto" style={{ maxHeight: 420 }}>
            {codeLines.map((line, i) => (
              <div key={i} className={typeColor[line.type] ?? "text-white/60"}>
                {line.text || " "}
              </div>
            ))}
          </pre>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";

const useCases = [
  {
    title: "Database Queries",
    icon: "🗄️",
    color: "border-cyan-500/30 bg-cyan-500/6 text-cyan-300",
    code: `@mcp.tool()
def query_db(sql: str, db_url: str) -> list:
    """Run SQL, return rows as JSON."""
    engine = create_engine(db_url)
    with engine.connect() as conn:
        return conn.execute(text(sql)).fetchall()`,
    prompt: '"Show me all users who signed up this week"',
  },
  {
    title: "REST API Wrapper",
    icon: "🌐",
    color: "border-violet-500/30 bg-violet-500/6 text-violet-300",
    code: `@mcp.tool()
def call_api(endpoint: str, method: str,
             payload: dict = {}) -> dict:
    """Call any REST API endpoint."""
    resp = requests.request(
        method, endpoint, json=payload,
        headers={"Authorization": f"Bearer {TOKEN}"})
    return resp.json()`,
    prompt: '"Create a new Jira ticket for the bug I described"',
  },
  {
    title: "Data Analysis",
    icon: "📊",
    color: "border-amber-500/30 bg-amber-500/6 text-amber-300",
    code: `@mcp.tool()
def analyse_csv(file_path: str,
                group_by: str) -> dict:
    """Load CSV and return group summary."""
    df = pd.read_csv(file_path)
    summary = df.groupby(group_by).agg(['mean','count'])
    return summary.to_dict()`,
    prompt: '"Analyse sales.csv and show revenue by region"',
  },
  {
    title: "File Processing",
    icon: "📁",
    color: "border-emerald-500/30 bg-emerald-500/6 text-emerald-300",
    code: `@mcp.tool()
def process_logs(log_dir: str,
                 pattern: str) -> list:
    """Search log files for pattern."""
    results = []
    for f in Path(log_dir).glob("*.log"):
        lines = [l for l in f.read_text()
                 .splitlines() if pattern in l]
        results.extend(lines)
    return results`,
    prompt: '"Find all ERROR lines in /var/log/ from today"',
  },
];

export function MCPBackend() {
  return (
    <div className="relative w-full h-full slide-bg-void flex flex-col items-center justify-center overflow-hidden px-10">
      <div className="absolute inset-0 pointer-events-none slide-bg-grid opacity-15" />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-7"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-amber-400/60 mb-3 font-medium">For Backend Engineers</p>
        <h2 className="text-4xl font-black text-white">
          🐍 MCP + Python = <span className="gradient-text-gold">AI-powered Backend</span>
        </h2>
        <p className="text-white/35 mt-2 text-sm">Your Python services become tools any AI model can call</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-6xl">
        {useCases.map((uc, i) => (
          <motion.div
            key={uc.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.12 }}
            className={`rounded-2xl border ${uc.color.split(" ").slice(0, 2).join(" ")} p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span>{uc.icon}</span>
              <h3 className={`text-sm font-bold ${uc.color.split(" ")[2]}`}>{uc.title}</h3>
            </div>
            <pre className="text-[10px] font-mono leading-relaxed text-white/55 bg-black/20 rounded-lg p-3 mb-2 overflow-hidden" style={{ maxHeight: 100 }}>
              {uc.code}
            </pre>
            <p className="text-xs text-white/35 italic">
              <span className="text-white/25">Ask Cline: </span>{uc.prompt}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-5 flex items-center gap-6 text-xs text-white/25"
      >
        <span>🔌 Connect to Cline via stdio or HTTP — same config</span>
        <span>·</span>
        <span>🐍 pip install fastmcp sqlalchemy pandas requests</span>
        <span>·</span>
        <span>⚡ No API layer needed — AI calls your function directly</span>
      </motion.div>
    </div>
  );
}

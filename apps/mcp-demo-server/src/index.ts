import express from 'express';
import cors from 'cors';
import toolsRouter from './routes/tools.js';
import callRouter from './routes/call.js';
import parallelRouter from './routes/parallel.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: ['http://localhost:5175', 'http://localhost:5173'] }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', port: PORT }));
app.use('/api/tools', toolsRouter);
app.use('/api/call', callRouter);
app.use('/api/parallel', parallelRouter);

app.listen(PORT, () => {
  console.log(`\n🚀 MCP Demo Server running at http://localhost:${PORT}`);
  console.log(`   GET  /api/tools        → list all MCP tools`);
  console.log(`   POST /api/call         → call a single tool`);
  console.log(`   POST /api/parallel     → call multiple tools in parallel\n`);
});

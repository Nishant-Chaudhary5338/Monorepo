import { Router } from 'express';
import { MCPClient, getServerPath } from '../mcp-client.js';

export interface ParallelCall {
  id: string;
  server: string;
  tool: string;
  args: Record<string, unknown>;
}

const router = Router();

router.post('/', async (req, res) => {
  const { calls } = req.body as { calls: ParallelCall[] };

  if (!Array.isArray(calls) || calls.length === 0) {
    res.status(400).json({ success: false, error: 'calls must be a non-empty array' });
    return;
  }

  const results = await Promise.all(
    calls.map(async ({ id, server, tool, args }) => {
      const start = Date.now();
      try {
        const serverPath = getServerPath(server);
        const client = new MCPClient(serverPath);
        const result = await client.callTool(tool, args ?? {});
        return { id, success: true, result, duration: Date.now() - start };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return { id, success: false, error: message, duration: Date.now() - start };
      }
    })
  );

  res.json({ results });
});

export default router;

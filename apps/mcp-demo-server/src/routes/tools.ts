import { Router } from 'express';
import { TOOLS_REGISTRY, CATEGORIES } from '../tools-registry.js';

const router = Router();

router.get('/', (_req, res) => {
  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    tools: TOOLS_REGISTRY.filter((t) => t.category === cat),
  }));
  res.json({
    total: TOOLS_REGISTRY.length,
    categories: grouped,
    all: TOOLS_REGISTRY,
  });
});

export default router;

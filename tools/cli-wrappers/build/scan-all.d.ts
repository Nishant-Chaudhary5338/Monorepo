#!/usr/bin/env node
/**
 * scan-all.ts — Parallel Review-Fix-ReReview Pipeline
 *
 * Usage:
 *   npx tsx scan-all.ts <path> [--concurrency=8]
 *   npx tsx scan-all.ts packages/ui/components
 *   npx tsx scan-all.ts packages/ui/components --concurrency=4
 *
 * What it does:
 *   1. Discovers all component directories under the given path
 *   2. Reviews ALL components in parallel
 *   3. Fixes ALL components in parallel (based on review results)
 *   4. Re-reviews ALL components in parallel (to verify fixes)
 *   5. Outputs consolidated report
 */
export {};
//# sourceMappingURL=scan-all.d.ts.map
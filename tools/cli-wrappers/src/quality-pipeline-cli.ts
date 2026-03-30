#!/usr/bin/env node
import { createCLIWrapper } from './mcp-client.js';

createCLIWrapper('quality-pipeline', 'run_full_pipeline');

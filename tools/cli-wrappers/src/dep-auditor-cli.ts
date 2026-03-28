#!/usr/bin/env node
import { createCLIWrapper } from './mcp-client.js';

createCLIWrapper('dep-auditor', 'audit_deps');
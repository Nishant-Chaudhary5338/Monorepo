---
description: Crystallise key decisions and context from the current session into memory.json for future Claude Code and Cline sessions.
---

Save the most important context from this session to the persistent knowledge graph in `memory.json`.

Steps:
1. Review what was built or decided in this session — ask the user to confirm the key points if unclear
2. For each significant item, choose the right memory action:
   - New component, tool, or package → `create_entities` with type matching its category
   - New fact about an existing entity → `add_observations` on that entity
   - Relationship between two things → `create_relations` (e.g. "nidhi-portfolio uses @repo/present")
   - Updated decision that supersedes old context → `add_observations` with the new fact
3. Use concise, factual language in observations — no prose, just short declarative statements
4. After saving, run `open_nodes` on the saved entities to confirm they were written correctly
5. Tell the user exactly what was saved and under which entity names

Common entity types used in this repo: `configuration`, `pattern`, `workflow`, `decision`, `implementation`, `infrastructure`, `gotcha`, `tool`, `project`.

---
name: MemPalace Reference Repo
description: External GitHub repo reviewed as reference for AI memory system design patterns
type: reference
---

# MemPalace

**Repo:** https://github.com/milla-jovovich/mempalace  
**Reviewed:** 2026-04-09  
**Verdict:** Good reference, not a dependency. Current memory system is already similar but lighter.

## What It Is
Local, open-source AI memory system. Stores verbatim conversations (no lossy summarization) and makes them searchable. Claims 96.6% recall on LongMemEval benchmarks, zero cloud dependencies.

## Architecture (Memory Palace metaphor)
- **Wings** — people / projects / topics
- **Rooms** — subjects within a wing (auth, billing, etc.)
- **Halls** — memory type (facts, events, preferences, advice)
- **Drawers** — verbatim original files
- **Tunnels** — cross-references between rooms/wings

## Tech Stack
- Python 3.9+
- ChromaDB (vector DB) + SQLite (knowledge graph)
- MCP-compatible (Claude, ChatGPT, Gemini, Cursor)
- 19 MCP tools exposed

## Notable Findings
- AAAK compression mode actually *hurts* recall (84.2% vs 96.6% raw) — authors admitted this April 2026
- Metadata filtering via wings/rooms gives +34% retrieval improvement
- ~$10/year self-hosted vs ~$507/year for LLM-based alternatives

## Parts Worth Borrowing (Future Projects)
- **Tunnels concept** — cross-references between memory topics (we don't have this yet)
- **Contradiction detection** — useful when memory scales up
- **MCP server pattern** — if we expose memory as MCP tools to other agents

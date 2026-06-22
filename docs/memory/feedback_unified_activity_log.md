---
name: unified-activity-log
description: Maintain docs/ACTIVITY_LOG.md as a combined Claude Code + Codex work history
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 608bf588-0df2-41c4-af03-3cd2b08ce44c
---

User wants a single running log of work done across both Claude Code and Codex, so they don't have to re-explain past work and so context carries over between tools.

**Why**: User works on the same real-world projects (client sites, SEO, WordPress themes) from both Claude Code and Codex sessions. Without a combined log, context gets lost when switching tools.

**How to apply**: `docs/ACTIVITY_LOG.md` in the workspace root holds this log, newest entries on top, grouped by date and source (`— Claude Code` or `— Codex`). At the end of a session with meaningful work done, add a dated entry summarizing it. For Codex entries, pull thread names from `~/.codex/session_index.jsonl` (see [[reference-codex-history]]) rather than asking the user to recount them.

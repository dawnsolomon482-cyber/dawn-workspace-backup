---
name: reference-codex-history
description: "Where to find the user's Codex CLI work history/session logs for project context"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 608bf588-0df2-41c4-af03-3cd2b08ce44c
---

The user also works in Codex (separate AI coding assistant) for many of the same real-world projects (SEO work, client websites like Lord Law, NextStaffRemote, CCI.com, etc). When a project or task being discussed here might already have prior work/context in Codex, check:

- `~/.codex/session_index.jsonl` — flat list of session threads with `thread_name` and `updated_at`. Read this first (e.g. `tail`/`grep`) to find sessions matching the current topic/client/site name.
- `~/.codex/sessions/` — likely holds the full session content for each thread id found in the index.
- `~/.codex/memories/` and `memories_1.sqlite` — Codex's own memory store, may have curated facts.

**Why**: User wants continuity across the two tools — instead of re-asking what was already done, look here first so work doesn't get duplicated or re-explained from scratch.

**How to apply**: Before starting a project the user mentions (especially client sites, SEO, or anything that sounds like ongoing work), check `session_index.jsonl` for a matching `thread_name`. If found, read the relevant session file in `sessions/` for details before asking the user to re-explain.

---
name: github-sync-routine
description: "Push workspace + memory snapshot to GitHub backup repo after meaningful work, so laptop stays current"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 608bf588-0df2-41c4-af03-3cd2b08ce44c
---

User wants the GitHub backup ([[github-backup-repo]]) to stay current with both workspace changes and Claude's memory, so switching to the laptop picks up everything without re-explaining.

**Why**: Memory files live outside the workspace folder (`~/.claude/projects/.../memory/`) and are per-machine — they don't sync via OneDrive or git automatically. A `docs/memory/` snapshot was added inside the workspace specifically so it travels with the GitHub repo.

**How to apply**: After a session with meaningful changes (new/updated memory files, workspace doc changes, ACTIVITY_LOG entries), do this before considering the work finished:
1. Re-copy current memory files into `docs/memory/` in the workspace (overwrite).
2. `git add`, commit with a short descriptive message, `git push` to the `dawn-workspace-backup` remote.
Don't ask permission each time for this specific push — it's an established routine — but do mention briefly that it was synced.

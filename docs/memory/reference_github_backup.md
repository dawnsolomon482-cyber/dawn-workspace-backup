---
name: github-backup-repo
description: "GitHub repo used to back up/sync the Claude Code workspace, plus account and exclusion notes"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 608bf588-0df2-41c4-af03-3cd2b08ce44c
---

Workspace is backed up to GitHub at `https://github.com/dawnsolomon482-cyber/dawn-workspace-backup` (private repo), pushed to `main`. Account used: `dawnsolomon482@gmail.com` (same as OneDrive).

**Why**: User wanted laptop access to this workspace via GitHub (laptop already has GitHub connected), as an alternative/complement to OneDrive sync.

**Excluded from this repo** (see workspace `.gitignore`):
- `.env` / `.env.*` files (real secrets found in `ghl-reactivation/`, `interactive-design-studio/`, `manopress/`)
- `node_modules/`
- `lord-law-website/`, `manopress/`, `interactive-design-studio/` — these have their own nested `.git` repos, skipped entirely to avoid broken submodule links. They are NOT in this backup at all; only on this PC.
- `memory.db`, logs, `reference/` (pre-existing excludes)

**Memory sync**: `docs/memory/` inside the workspace holds a snapshot copy of all files from `~/.claude/projects/.../memory/` (including this one and `MEMORY.md`), so Claude's memory travels with the GitHub repo to other devices. See [[github-sync-routine]] for keeping it current.

**How to apply**: If asked to push updates, sync, or check this backup again, use this remote — don't recreate it. If a `git push` fails with a 403/permission error, check `cmdkey /list` for a stale stored credential under a different GitHub account (this happened once with a leftover `techvablueprint` credential) and remove it via `cmdkey /delete:LegacyGeneric:target=git:https://github.com` before retrying.

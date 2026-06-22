# Claude Code Workspace Memory

## Workspace
- Path: `C:\Users\R Y Z E N\OneDrive\Desktop\Claude Code`
- Platform: Windows 10 Pro, bash shell (Unix syntax)
- Agent: Claude Sonnet 4.6

## User Preferences
- No auto-commits. Only commit when explicitly asked.
- No emojis unless asked.
- Concise, direct responses. No time estimates.
- Confirm before destructive/irreversible actions.
- Prefer dedicated tools (Read, Edit, Grep, Glob) over bash.

## Memory System (Built 2026-03-14)
Custom memory system modeled after openclaw's architecture:
- `soul.md` — Agent persona/identity (bootstrap, read-only)
- `user.md` — User profile and preferences
- `memory.md` — Curated long-term facts
- `agent.md` — Operational rules and tool instructions
- `memory/YYYY-MM-DD.md` — Daily session logs (append-only)
- `memory.db` — SQLite index (chunks, FTS5, embedding_cache, sessions, meta)

## Reference Repos
- `reference/openclaw` — Cloned openclaw repo (read-only reference, do not build)
- [MemPalace](reference_mempalace.md) — External repo for AI memory design patterns (tunnels, contradiction detection, MCP server pattern)

## WordPress Theme Building
- [WordPress Block Theme Structure](reference_wordpress_theme.md) — FSE theme file structure, theme.json patterns, install process, and block template syntax
- [Clone site → WordPress theme workflow](feedback_clone_to_wordpress_theme.md) — when user asks to clone a website design, always deliver it as a ready-to-upload WP theme zip, not just HTML/CSS

## agency-agents Repo
- Cloned at: `agency-agents/` — use relevant agents automatically for every project (no need to ask user)
- [Auto-select agents for projects](feedback_agency_agents.md) — scan and pick agents based on project type

## Process Rules
- [Sample first before full execution](feedback_sample_first.md) — 1 sample to boss for approval before bulk build/upload
- [Auto-open browser for previews](feedback_browser_auto_open.md) — Always open Chrome automatically after starting any local server

## Backup & Sync
- [GitHub backup repo](reference_github_backup.md) — dawn-workspace-backup (private), excludes .env/node_modules/lord-law-website/manopress/interactive-design-studio; watch for stale credential errors
- [GitHub sync routine](feedback_github_sync_routine.md) — after meaningful work, re-copy memory to docs/memory/ and push to GitHub without asking each time

## Cross-Tool Continuity
- [Codex work history](reference_codex_history.md) — check `~/.codex/session_index.jsonl` + `sessions/` for prior context before re-asking user about a project
- [Unified activity log](feedback_unified_activity_log.md) — maintain docs/ACTIVITY_LOG.md combining Claude Code + Codex session summaries

## SQLite Tools
- sqlite3.exe at: `C:\Users\R Y Z E N\AppData\Local\Temp\sqlite-tools\sqlite3.exe`
  (downloaded from sqlite.org — may need re-download if temp is cleared)

## Active Projects
- [Dawn Solomon Portfolio](project_dawn_solomon_portfolio.md) — Lovable portfolio, cinematic folder design pending implementation

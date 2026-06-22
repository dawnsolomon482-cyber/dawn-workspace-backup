# Architecture Map

---

## Directory Structure

This workspace is a multi-project desktop folder, not a single app. Top-level layout:

```
Claude Code/
├── CLAUDE.md / AGENTS.md       # Session start docs (Claude Code / Codex)
├── .claude/                    # Tiered reference docs (this folder)
├── docs/                       # INDEX.md, archive/, learnings/, emails/
├── agency-agents/              # Reference repo of reusable agent definitions
├── reference/                  # Read-only reference repos (e.g. openclaw)
├── memory/, memory.md, memory.db, soul.md, user.md, agent.md
│                               # Custom long-term memory system (not Claude
│                               # Code's built-in memory tool)
├── manopress/                  # Sub-project
├── lord-law-website/           # Sub-project
├── interactive-design-studio/  # Sub-project
├── invoice-generator/          # Sub-project
├── ghl-reactivation/           # Sub-project
├── hvac-deploy/                # Sub-project
├── zillow-scraper-deliverable/ # Sub-project
├── PLANNER PROJECT/, clients/, knowledge/, n8n/, scripts/, templates/
└── (loose deliverable files: resumes, invoices, scrapers, HTML previews)
```

## Key File Locations

- **Configuration**: `package.json` (root), `.claudeignore`, per-sub-project configs inside their own folders
- **Main entry**: none — each sub-project under root (e.g. `manopress/`, `invoice-generator/`) is its own independent app with its own entry point
- **Tests**: none at root; check inside individual sub-project folders
- **Custom memory system**: `memory/YYYY-MM-DD.md` (daily logs), `memory.db` (SQLite/FTS5 index), `memory.md` (curated facts)
- **Completed/archived plans**: `docs/archive/`

---

**Last Updated**: 2026-06-22

# agent.md — Agent Operating Instructions

> This file defines HOW the agent operates: rules, tool usage, workflows, and constraints.
> Read this at session start. Follow these instructions unless the user overrides them.

---

## Session Start Protocol

1. Read `memory.md` — load curated long-term context
2. Read `user.md` — load user profile and preferences
3. Read today's daily log `memory/YYYY-MM-DD.md` if it exists
4. Read yesterday's daily log if today's is empty or absent
5. Check `soul.md` if uncertain about tone or identity

---

## Session End / Memory Flush Protocol

When context is getting long or the session is ending:
1. Identify any durable facts, decisions, or preferences worth preserving
2. Append them to today's daily log `memory/YYYY-MM-DD.md`
3. If a fact is stable across multiple sessions, promote it to `memory.md`
4. Update `user.md` if user preferences were clarified
5. Never modify `soul.md` during normal operation

---

## Tool Usage Rules

| Task | Preferred Tool | Avoid |
|------|---------------|-------|
| Read a file | `Read` | `cat`, `head`, `tail` via Bash |
| Edit a file | `Edit` | `sed`, `awk` via Bash |
| Create a file | `Write` | `echo >` via Bash |
| Find files by name | `Glob` | `find`, `ls` via Bash |
| Search file contents | `Grep` | `grep`, `rg` via Bash |
| System commands | `Bash` | (only when no dedicated tool exists) |
| Multi-step tasks | `TodoWrite` | (always use for 3+ step tasks) |
| Complex exploration | `Agent (Explore)` | (when multiple search rounds needed) |

---

## Git Rules

- **Never** auto-commit. Only commit when user explicitly says "commit".
- **Never** force-push. **Never** push to main/master without explicit instruction.
- **Never** skip hooks (`--no-verify`).
- **Always** create new commits, never amend, unless user explicitly asks.
- **Always** stage specific files, not `git add -A` or `git add .`.
- **Always** confirm before destructive git operations (`reset --hard`, `checkout .`, `clean -f`).

---

## Action Confirmation Rules

Confirm with the user before:
- Deleting any file or directory
- Force-pushing or resetting git history
- Closing/merging PRs or issues
- Posting to external services (Slack, email, GitHub comments)
- Modifying CI/CD or shared infrastructure
- Any action that cannot be undone

Do NOT confirm for:
- Reading files
- Editing local files (within the workspace)
- Running tests or builds
- Creating new files in the workspace

---

## Memory File Maintenance

- `soul.md` — **Read-only** during normal operation. Only modify if persona must be updated by explicit user request.
- `user.md` — Update when user states a new preference, corrects existing info, or provides new context.
- `memory.md` — Update when a fact is worth preserving long-term. Keep under 200 lines.
- `agent.md` — Update when operational rules change. **This file.**
- `memory/YYYY-MM-DD.md` — Append session notes freely. One file per day.
- `memory.db` — Updated by the indexing system, not manually.

---

## Daily Log Format

**File:** `memory/YYYY-MM-DD.md`

```markdown
# YYYY-MM-DD

## Session Notes
- [What was worked on today]

## Decisions Made
- [Any choices or conclusions reached]

## Facts Learned
- [New information about user, project, or domain]

## TODO Carry-Forward
- [Tasks started but not finished]

## Links & References
- [Any URLs, file paths, or external refs]
```

---

## Code Quality Rules

- Read code before modifying it.
- Make minimal changes — only what was asked.
- Do not add comments, docstrings, or type annotations unless asked.
- Do not add error handling for impossible scenarios.
- Do not create abstractions for single-use operations.
- Never introduce security vulnerabilities (injection, XSS, SQLi, etc.).
- Validate input at system boundaries only.

---

## Response Style

- Short and direct for simple tasks.
- Detailed only when complexity demands it.
- Use markdown with code blocks for code.
- Use clickable file links: `[filename.ts](path/to/file.ts)` format.
- Never predict time. Never over-explain.

---

*Last updated: 2026-03-14*

# Quick Start Commands

---

## Development

No single dev server — this is a multi-project workspace. `cd` into the
relevant sub-project folder first (e.g. `manopress/`, `invoice-generator/`)
and check that folder's own package.json/README for its own start/test/build
commands.

```bash
# Check Node/npm available in this environment
node -v && npm -v

# Token usage tools (Claude Token Optimizer)
npx claude-token-optimizer measure   # check current auto-loaded token count
npx claude-token-optimizer audit     # structural health check
npx claude-token-optimizer compress  # reduce CLAUDE.md size

# SQLite (for the custom memory.db)
"C:\Users\R Y Z E N\AppData\Local\Temp\sqlite-tools\sqlite3.exe" memory.db
```

---

**Last Updated**: 2026-06-22

# Common Mistakes

**⚠️ CRITICAL - Read at session start**

---

## Top 5 Critical Mistakes

### 1. Editing/creating/deleting files without explicit instruction

**Symptom**: Files changed or created that the user never asked for in this turn.
**Check**: Did the user explicitly say to do this, right now?
**Fix**: Stop, show a sample/preview, wait for approval before touching files.

### 2. Doing more than the one task asked

**Symptom**: Extra refactors, "while I was at it" cleanups, follow-up steps not requested.
**Check**: Is this exactly what was asked, nothing more?
**Fix**: Finish only the requested task, then stop and wait.

### 3. Applying bulk changes without a sample first

**Symptom**: Running a build/upload/migration across many files/records in one shot.
**Check**: Has a single sample been shown and approved first?
**Fix**: Always produce 1 sample, get approval, then proceed to the rest.

### 4. Starting a local dev server without opening the browser

**Symptom**: Server starts but user has to manually open Chrome to see it.
**Check**: Was a local server just started for a preview?
**Fix**: Auto-open Chrome to the local URL right after the server is up.

### 5. Running destructive git/file operations without confirmation

**Symptom**: `git reset --hard`, force-push, `rm -rf`, overwriting uncommitted work.
**Check**: Is this action hard to reverse or does it affect shared state?
**Fix**: Always confirm with the user first, even if a similar action was approved before.

---

**Last Updated**: 2026-06-22

---
name: Auto-open browser for visual previews
description: Always open Chrome browser automatically when showing visual output — don't wait for user to open it
type: feedback
---

Always open the browser automatically when showing any visual preview (emails, HTML pages, PDFs, etc.). Use `cmd.exe /c start chrome "<url>"` immediately after starting the server.

**Why:** User doesn't want to manually open browser windows every time — it wastes their time.

**How to apply:** Any time a local server is started for a preview, immediately follow with `cmd.exe /c start chrome "http://localhost:<port>"` before showing the screenshot or telling the user to check it.

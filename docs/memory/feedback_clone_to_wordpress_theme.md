---
name: clone-to-wordpress-theme
description: Default workflow when user asks to clone/replicate a website design — always package it as a WordPress theme
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 608bf588-0df2-41c4-af03-3cd2b08ce44c
---

When the user asks to clone or replicate a website design they found/liked, the end deliverable should always be a ready-to-upload WordPress theme zip — not just static HTML/CSS files.

**Why**: User's actual goal is always to use the replicated design as their own WordPress site. They upload the theme zip themselves via Appearance → Themes → Add New → Upload Theme. Producing plain HTML/CSS leaves them with an extra manual conversion step they don't want to do.

**How to apply**: After replicating the visual design (layout, colors, typography, sections) from the reference site, convert it directly into the WordPress Block Theme (FSE) structure documented in [reference-wordpress-theme] — `style.css`, `functions.php`, `theme.json`, `parts/header.html` + `footer.html`, `templates/*.html`. Zip the theme folder as the final deliverable. Don't stop at an HTML preview unless the user explicitly asks for just a preview first.

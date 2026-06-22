---
name: project-dawn-solomon-portfolio
description: "Dawn Solomon's Lovable portfolio project — ongoing work, folder design, branding, and unfinished tasks"
metadata: 
  node_type: memory
  type: project
  originSessionId: 97639f10-4947-439d-bc53-9eaf1bed4798
---

Portfolio site for Dawn Solomon — GHL Automation Specialist.

**GitHub repo:** https://github.com/techvablueprint/dawnsolomon
**Live site:** https://dawnsolomon.vercel.app
**Built with:** Lovable (React + Vite + TypeScript + Tailwind + shadcn-ui + Supabase)

## Branding
- Background: dark navy `#0b1623`
- Primary accent: teal `#00d4aa`
- Hexagon pattern background, glassmorphism cards

## Logo / Favicon
- Shape: dark navy/black rounded square (like an app icon)
- Inner border: thin teal rounded square outline
- Text: "DS" in bold teal (`#00d4aa`) centered
- Style: clean, minimal, dark-on-dark with teal accent — matches site branding exactly

## Sections
- Hero, About, Workflow Automation (3 projects — working, images visible)
- Explore Live Websites (3 sites — iframe-based, currently empty/blank when opened)
- Custom Planner Projects (3 planners — images exist in `/src/assets/projects/`, cards visible)
- Live Dashboards (3 dashboards — images in `/public/projects/`, currently blank)
- Calendly booking, Contact

## In-Progress Work: Cinematic Folder Design
User wants each of these 3 sections to have a cinematic glassmorphism folder:
- **Explore Live Websites** — globe icon
- **Custom Planner Projects** — clipboard icon
- **Live Dashboards** — dashboard grid icon

Design style: glassmorphism dark navy + teal glow, peeking cards fan out on hover, floating animation, pulse dot, "Click to explore" label. NOT purple — must use teal branding.

User previewed the folder design and liked the look. **Next step: implement via Lovable using a `CinematicFolder` component to wrap each section's content.**

**Why:** User explicitly said "wag na kalimiutan" — this is ongoing work to resume next session.
**How to apply:** Give user the Lovable prompt to create `CinematicFolder.tsx` and replace existing empty wrappers in LiveWebsitesSection, PlannerProjectSection, LiveDashboardSection.

## History
- FolderReveal was added (May 14, 2:43 AM) but caused blank sections → reverted to "Fixed LinkedIn URL redirect" version
- The Planner section actually works and shows project cards with images
- Live Websites section uses iframes (may have X-Frame-Options issues)
- Live Dashboards images exist but section appears blank due to animation/inView issue

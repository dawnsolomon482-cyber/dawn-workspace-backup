---
name: awesome-skill-installer
description: Browse, explore, and install Claude skills from the ComposioHQ/awesome-claude-skills GitHub repository. Use this skill whenever the user wants to find new skills, install a skill from awesome-claude-skills, browse what skills are available, or asks about adding capabilities to Claude Code from the community repo. Trigger on phrases like "install skill", "browse skills", "anong available na skills", "magdagdag ng skill", "i-install ang skill", or any mention of awesome-claude-skills.
---

# Awesome Claude Skills Installer

This skill helps you browse and install skills from the [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) community repository.

## What this skill does

1. **Browse** — Fetch the list of available skills from the repo
2. **Inspect** — Show what a skill does before installing
3. **Install** — Fetch the SKILL.md and place it in the right location
4. **Register** — Update settings.json if needed

---

## Step 1: Fetch Available Skills

Always start by fetching the current list from GitHub:

```
GET https://api.github.com/repos/ComposioHQ/awesome-claude-skills/contents
```

Use WebFetch on that URL. Parse the response to list all top-level directories (those are the skills). Present them grouped by category (match against the README categories if possible).

## Step 2: Inspect a Skill

When the user picks a skill, fetch its SKILL.md:

```
https://raw.githubusercontent.com/ComposioHQ/awesome-claude-skills/main/{skill-folder}/SKILL.md
```

If no SKILL.md exists, try:
- `{skill-folder}/skills/{skill-name}/SKILL.md`
- `{skill-folder}/README.md` as fallback

Show the user:
- What the skill does (from the description frontmatter)
- When it triggers
- Any dependencies or tools needed

## Step 3: Install the Skill

### Option A — Install as a local skill (recommended for quick use)

Place the skill in the project's skills folder:

```
{project_dir}/skills/{skill-name}/SKILL.md
```

This makes it available for this project only.

### Option B — Install as a user-level skill

Place it in:
```
C:\Users\{username}\.claude\plugins\cache\local-skills\{skill-name}\SKILL.md
```

Then add to `~/.claude/settings.json` under `enabledPlugins`:
```json
"local-skills@local": true
```

### Install steps

1. Use WebFetch to get the raw SKILL.md content from GitHub
2. Write it to the target path using the Write tool
3. Confirm the file was created
4. Tell the user to restart Claude Code (or reload the window) for the skill to appear

## Step 4: Post-Install

After installing, always:
- Show the skill's name and trigger description
- Tell the user what phrase to say to invoke it
- Mention if a Claude Code restart is needed

---

## Available Skills Reference

Based on the awesome-claude-skills repo, categories include:

| Category | Skills |
|----------|--------|
| Document Processing | docx, pdf, pptx, xlsx, epub |
| Development | artifacts-builder, mcp-builder, changelog-generator, langsmith-fetch, webapp-testing |
| Data & Analysis | deep-research, postgres, root-cause-tracing, csv-summarizer |
| Business | brand-guidelines, lead-research, competitive-ads, domain-brainstormer |
| Communication | brainstorming, content-research-writer, meeting-insights |
| Creative | imagen, canvas-design, theme-factory, slack-gif-creator |
| Productivity | file-organizer, invoice-organizer, tailored-resume |
| Security | computer-forensics, threat-hunting, metadata-extraction |

---

## Error Handling

- If a SKILL.md is not found: tell the user clearly, offer to show the README instead
- If the skill has dependencies (MCP servers, API keys): list them before installing and ask if user has them set up
- If GitHub is unreachable: tell the user and suggest manually cloning the repo
- Never silently fail — always report what went wrong

---

## Example Flow

User: "i-install mo yung pdf skill"

1. Fetch `https://api.github.com/repos/ComposioHQ/awesome-claude-skills/contents/document-skills`
2. Find the pdf SKILL.md path
3. Show the user what it does, ask to confirm
4. Download and write to `skills/pdf/SKILL.md`
5. Confirm: "Na-install na ang pdf skill. I-restart mo ang Claude Code para ma-activate."

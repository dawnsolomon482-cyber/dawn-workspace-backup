# CLAUDE N8N — Project Instructions

## Purpose

This project exists to build n8n AI agents and automation workflows by prompting Claude. You have access to two primary tools:

1. **n8n MCP** — Direct API access to the n8n instance at `https://techvablueprint1-n8n-45w6.onrender.com` (create, read, update, delete workflows and credentials)
2. **n8n Skills** — Specialized skills for building specific workflow patterns, node configurations, and agent architectures

Use these together to translate natural language prompts into working n8n automations.

## How to Approach Workflow Requests

1. **Understand intent first** — Clarify the trigger, the goal, and the output before building. One short question is fine; a list of questions is not.
2. **Plan before building** — Sketch the node flow mentally (or state it briefly) before making MCP calls.
3. **Build iteratively** — Create the workflow, verify it looks correct, then activate or test as requested.
4. **Use MCP to deploy** — Always use the n8n MCP to push workflows directly to the user's n8n instance. Do not just output JSON unless explicitly asked.

## Workflow Design Principles

- Prefer simple, reliable node chains over clever but fragile ones
- Always set meaningful workflow and node names (not "Untitled Workflow" or "HTTP Request1")
- Add error handling (Error Trigger or try/catch via IF nodes) for any workflow that touches external APIs or data
- For AI agent workflows: use the AI Agent node with a clear system prompt, tool nodes, and memory where appropriate
- Credentials should already exist in the instance — reference them by name, don't recreate

## What "Done" Means

A workflow is done when:
- It exists in the n8n instance (confirmed via MCP)
- Node names and workflow name are descriptive
- It is either active (if trigger-based) or ready to test manually
- Any required credentials are connected

## Scope

This project covers:
- Webhook and scheduled automations
- AI agent workflows (LangChain-based n8n agents)
- Data transformation and routing pipelines
- Integrations with external services (email, Slack, Google, HTTP APIs, databases, etc.)
- Multi-step agentic workflows with memory and tools

## Constraints

- Do not modify or delete existing workflows without explicit confirmation
- Do not expose or log credentials
- Keep workflows in the user's own n8n instance — no external deployments
- If the MCP or a node type is unavailable, say so immediately rather than working around it silently

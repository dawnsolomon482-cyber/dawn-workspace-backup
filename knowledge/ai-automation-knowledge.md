# AI Automation Knowledge Base

## Tools & Platforms

### Workflow Automation
- **n8n** — self-hosted, best for custom AI workflows, connects to any API
- **Make (Integromat)** — visual workflow builder, great for business automation
- **Zapier** — easiest to use, best for non-technical clients
- **ActivePieces** — open-source Zapier alternative

### AI Models / APIs
- **Claude API (Anthropic)** — best for reasoning, writing, analysis tasks
- **OpenAI GPT-4o** — strong general purpose, good for client-facing tools
- **Perplexity API** — best for real-time web search automation
- **Groq** — fast inference, good for real-time workflows
- **Ollama** — run models locally, no API cost

### AI Agents & Frameworks
- **Claude Code** — agentic coding + task execution
- **LangChain / LangGraph** — build multi-step AI agent pipelines
- **CrewAI** — multi-agent coordination (one agent researches, another writes, etc.)
- **AutoGen (Microsoft)** — conversational multi-agent framework
- **Flowise** — visual LangChain builder, no-code agent creation

### Content & SEO Automation
- **Perplexity + Claude** — auto-research + auto-write blog posts
- **n8n + WordPress REST API** — auto-publish AI-written content
- **Google Sheets + Make** — bulk keyword processing pipeline
- **Airtable + AI** — content calendar automation

### Lead Generation Automation
- **Clay** — AI-enriched lead lists (LinkedIn + AI scoring)
- **Apollo.io + n8n** — auto-scrape + enrich + email leads
- **Phantombuster** — LinkedIn/social media scraping automation
- **Instantly.ai** — AI-powered cold email sequences

### Social Media Automation
- **Buffer / Hootsuite + AI** — schedule AI-generated posts
- **n8n + Facebook Graph API** — auto-post to Facebook Pages
- **Taplio** — LinkedIn content automation
- **Repurpose.io** — auto-repurpose one piece of content across platforms

### Business Process Automation
- **Gmail + Claude** — auto-classify and draft email replies
- **Notion + AI** — auto-populate databases, meeting notes, tasks
- **Slack + n8n** — internal team automation triggers
- **Google Sheets + Apps Script + Claude API** — spreadsheet AI workflows

---

## Common Workflow Templates

### 1. Auto SEO Content Pipeline
Trigger: New keyword added to Google Sheet
- Research keyword with Perplexity
- Generate outline with Claude
- Write full article with Claude
- Auto-publish to WordPress via REST API
- Notify via Telegram

### 2. Lead Enrichment Pipeline
Trigger: New lead added to CRM
- Scrape LinkedIn profile with Phantombuster
- Enrich with Clay (company size, tech stack, etc.)
- Score lead with Claude (hot/warm/cold)
- Auto-assign to sales rep in CRM
- Send personalized intro email via Instantly

### 3. Social Media Content Machine
Trigger: Daily schedule (7am)
- Pull trending topics from Google Trends API
- Pick best topic with Claude
- Write post for Facebook, LinkedIn, Instagram
- Schedule via Buffer API
- Log to Notion content calendar

### 4. Client Reporting Automation
Trigger: Weekly (every Monday 8am)
- Pull Google Search Console data via API
- Pull Google Analytics data via API
- Summarize with Claude (wins, losses, recommendations)
- Generate PDF report
- Email to client automatically

### 5. Competitor Monitoring
Trigger: Daily
- Scrape competitor blog with n8n
- Check for new posts
- Summarize new content with Claude
- Send alert to Telegram if competitor published something new

---

## Nate Herk Framework (Primary Reference)

### Who is Nate Herk
- Full name: Nate Herkelman
- YouTube: **@nateherk** — 581K subscribers, 356 videos — "AI Automation Made Easy"
- Background: Business Analytics + Marketing (Univ. of Iowa), ex-Goldman Sachs BI Analyst
- Left corporate November 2024 to build AI automation agency + education brand
- Founder of **Uppit AI** (uppitai.com) and **AI Automation Society** (skool.com/ai-automation-society-plus)
- Podcast: podcast.nateherk.com
- Latest: Build & Sell with Claude Code (10+ Hour Course, 125K+ views in 3 days)

### Nate Herk's Core Philosophy
- AI agents in n8n don't just respond — they TAKE ACTION (query APIs, update CRMs, send emails)
- Focus on helping small businesses: save time, cut costs, stay competitive
- No-code first — build powerful systems without writing code
- Start simple, then add AI at the right step (not AI everywhere)
- Land first client: choose a niche → craft a compelling offer → find prospects

### n8n Learning Path (Starter Kit 2025)
1. Understand nodes and how data flows in n8n
2. Learn data transformations (JSON, expressions, Set nodes)
3. Connect third-party integrations (APIs, webhooks)
4. Build your first AI agent node
5. Add memory and context to agents
6. Build multi-step autonomous workflows
7. Deploy and monetize as a service

### Key n8n Workflow Patterns

#### Pattern 1: Webhook → AI → CRM
Trigger: Form submission / webhook
- Receive data → validate required fields
- Create/update contact in CRM (HubSpot, GoHighLevel, Airtable)
- AI scores or classifies the lead
- Send personalized email
- Notify team on Slack/Telegram

#### Pattern 2: AI Voice Receptionist (Vapi + n8n MCP)
- Vapi handles the phone call
- n8n MCP (Model Context Protocol) processes the conversation
- Automatically: book appointments, transfer calls, log to CRM
- No human needed for inbound calls

#### Pattern 3: Client Onboarding System
Trigger: New client signs contract / pays
- Webhook captures signup data
- Create client record in Notion/Airtable/HubSpot
- Send welcome email with links
- Schedule onboarding call (Google Calendar hold)
- Send follow-up sequences (Day 1, Day 3, Week 1)
- Notify agency owner on Telegram
- Mirror record to backup CRM

#### Pattern 4: RAG Chatbot (for clients)
- Load client's knowledge base (PDFs, docs, website) into vector store
- n8n handles incoming questions
- Retrieves relevant context (RAG)
- Claude/GPT generates answer
- Deploy as widget on client's website

#### Pattern 5: LinkedIn Content + Lead Gen
- Scrape LinkedIn with Phantombuster
- Feed profiles to Clay for enrichment
- AI scores and personalizes outreach
- Auto-send connection requests + follow-up messages
- Log hot leads to CRM automatically

#### Pattern 6: Invoice / Document Processing
- Receive invoice via email
- n8n extracts attachments
- AI reads and extracts data (vendor, amount, due date)
- Auto-log to accounting spreadsheet or QuickBooks
- Flag anomalies for human review

### CRM Recommendations by Use Case
- **GoHighLevel (GHL)** — best for agencies, all-in-one (CRM + email + SMS + funnels)
- **HubSpot** — best for B2B, professional clients, strong API
- **Airtable** — best as a lightweight CRM with visual database
- **Notion** — best for internal ops + client management combined
- **n8n connects to all of these natively**

### Agency Business Model
- Pick a niche (e.g., real estate agents, dentists, local service businesses)
- Build 1 core automation workflow for that niche
- Offer as productized service ($500–$2,000 setup)
- Charge monthly retainer for maintenance + new workflows ($200–$500/mo)
- Use case studies from first client to land more

### n8n Best Practices
- Always use **Error Trigger** node to catch failed workflows
- Use **Set** nodes to clean and rename data between steps
- Store credentials properly in n8n Credentials (never hardcode)
- Use **Sub-workflows** to keep main workflows clean and reusable
- Test with **Execute Workflow** manually before going live
- Use **Wait** node for time-delayed sequences (Day 1, Day 3, etc.)
- Self-host n8n on Railway, Render, or VPS for full control (free or cheap)

*Last updated: 2026-03-16*

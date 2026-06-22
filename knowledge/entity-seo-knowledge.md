# Entity SEO Knowledge Base

> Advanced entity building, Knowledge Graph, Brand SERP, and Semantic SEO.
> Sources: Jason Barnard (Kalicube), Koray Tuğberk GÜBÜR, Dixon Jones, Google's guidelines.

---

## What is an Entity?

An entity is anything Google can uniquely identify — a person, business, place, product, concept.
Google doesn't just index pages anymore — it indexes **entities and their relationships**.

- Entity = a **thing**, not a string
- Google Knowledge Graph stores entities and how they relate to each other
- If your business is not an entity in Google's eyes → you are invisible in AI-powered search
- Entity recognition = Google "trusting" that your business is real, legitimate, and an authority

---

## Why Entity Matters (2025+)

- Google AI Overviews pull from trusted entities, not just ranked pages
- ChatGPT, Perplexity, Gemini all cite entities they recognize
- Businesses with strong entity signals rank better, get featured in AI answers, and show Knowledge Panels
- Entity = brand trust = conversions

---

## The 3 Pillars of Entity SEO (Jason Barnard / Kalicube Method)

### Pillar 1: Entity Home
The single page that DEFINES your entity to Google.

- Usually: your About page or Homepage
- Must clearly state: **Who you are, What you do, Who you serve, Where you are**
- Use first-person, factual language — like a Wikipedia article about yourself
- Include all key facts: founded, location, services, founder name, team
- This is the page Google uses to understand your entity

**Entity Home formula:**
```
[Business Name] is a [type of business] based in [location].
We [what you do] for [who you serve].
Founded in [year] by [founder name].
```

### Pillar 2: Corroboration (Proof)
Google needs to find the same facts about your entity across MULTIPLE sources.

- Social profiles: Facebook, LinkedIn, Instagram, Twitter/X, YouTube
- Directories: Google Business Profile, Yelp, Foursquare, Yellow Pages
- Industry directories: Clutch (agencies), Houzz (contractors), etc.
- Press mentions, guest posts, podcast appearances
- Every source must have the same NAP (Name, Address, Phone)

**The more sources say the same thing → the more Google trusts your entity**

### Pillar 3: Communication (sameAs Schema)
Tell Google explicitly where your entity exists on the web.

- Use Organization or LocalBusiness schema JSON-LD on your homepage
- Add `sameAs` array with all your official profiles
- This is machine-readable confirmation of Pillar 2

---

## Organization Schema (Entity Anchor)

Add this JSON-LD to the homepage `<head>`. Customize per client.

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://clientsite.com/#organization",
  "name": "Business Name",
  "url": "https://clientsite.com",
  "logo": "https://clientsite.com/logo.png",
  "description": "One sentence describing what you do and who you serve.",
  "foundingDate": "2020",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "Province",
    "postalCode": "1234",
    "addressCountry": "PH"
  },
  "telephone": "+63-912-345-6789",
  "email": "hello@clientsite.com",
  "sameAs": [
    "https://www.facebook.com/clientpage",
    "https://www.instagram.com/clienthandle",
    "https://www.linkedin.com/company/clientname",
    "https://twitter.com/clienthandle",
    "https://www.youtube.com/@clientchannel",
    "https://g.co/kgs/XXXXXX"
  ],
  "areaServed": {
    "@type": "City",
    "name": "Manila"
  },
  "priceRange": "$$"
}
```

---

## Entity Home Page — What to Include

### About Page (Entity Home)
- Business name, exact legal or brand name
- Founding year and story (brief)
- Mission / what you stand for
- Who you serve (ICP — ideal customer)
- Services or products offered
- Location (full address if local business)
- Team / founder bio with real name and photo
- Contact info
- Links to all social profiles
- Real photos (not stock)
- Embedded Google Map (for local)
- FAQs about the business

### Founder / Author Pages
- Real name
- Professional background
- Photo (real, professional)
- What they're expert in
- Social profiles linked
- This builds E-E-A-T — Google wants to know REAL people are behind the site

---

## Building the Knowledge Panel

Google Knowledge Panels appear when Google is confident about an entity's existence and importance.

**Steps to trigger a Knowledge Panel:**

1. Create Google Business Profile (local businesses) — verified
2. Add full Organization schema with sameAs on homepage
3. Claim all social profiles with consistent name/info
4. Create Wikidata entry (open, anyone can create — very powerful signal)
5. Get Wikipedia article (harder, needs notability — not always needed)
6. Get press mentions from reputable sites
7. Get listed in niche/industry directories
8. Build 20-30+ consistent citations (NAP) across directories

**Wikidata is the fastest path to Knowledge Panel for small businesses.**
- Free, open, anyone can create
- Google trusts Wikidata as an authoritative source
- Create entry: wikidata.org > Create a new item > fill in facts

---

## NAP Consistency — Non-Negotiable

NAP = Name, Address, Phone. Must be IDENTICAL everywhere.

- Same business name format (e.g., "Acme PH" everywhere — not "Acme Philippines" on some sites)
- Same address format (abbreviations consistent)
- Same phone number format

**Top directories for PH market:**
- Google Business Profile (most important)
- Facebook Business Page
- Yelp Philippines
- Foursquare
- LinkedIn Company Page
- Yellow Pages Philippines (yp.ph)
- BusinessList Philippines
- Clutch.co (for agencies/tech)
- Grab / FoodPanda (for food businesses)
- Any industry-specific directory

---

## Semantic SEO (Koray Method)

Semantic SEO = building content that covers a TOPIC COMPLETELY, not just keywords.

Google's natural language processing understands context. If your content only has the keyword but misses related concepts → Google doesn't see you as an authority.

### Semantic Content Requirements
- Cover ALL subtopics, related questions, and sub-entities around a topic
- Use natural language — write how people think and speak
- Answer questions that appear in "People Also Ask" — cover them in your content
- Include related terms: synonyms, related concepts, industry terms
- Link to authoritative external sources (signals you're citing real knowledge)

### Entity-Based Keyword Research
- Every keyword has **entities** behind it (people, places, things)
- Find the entities Google associates with your main topic (use Google's "Knowledge Panel" results, "Related searches", "People also search for")
- Make sure your content mentions and links to these entities where relevant
- Example: A page about "digital marketing agency Manila" should mention: Metro Manila, Philippines, GCash (local payment), brands common in PH, etc.

---

## Brand SERP (Jason Barnard)

Brand SERP = what appears when someone searches your brand name.

**Goal:** Control what Google shows for your brand. If Google is "confused" about your entity → bad Brand SERP → lost trust.

**Brand SERP checklist:**
- [ ] Your homepage ranks #1 for your brand name
- [ ] Knowledge Panel appears (right side on desktop)
- [ ] Correct social profiles appear in the results
- [ ] No negative content appears on page 1
- [ ] Google shows the right logo, description, and info
- [ ] Sitelinks appear (links to key pages under the main result)

**How to get sitelinks:**
- Clear site structure with proper navigation
- High-authority homepage
- Consistent entity signals
- Internal linking from homepage to key pages

---

## GEO — Generative Engine Optimization

Rank in: Google AI Overviews, ChatGPT, Perplexity, Gemini, Claude.

**Why it matters:** AI tools are becoming the first step in research — especially for professional services. If AI doesn't know your entity → you don't get recommended.

### How AI Engines Choose Sources
- Recognized entities (in Knowledge Graph) get cited more
- Sites with strong E-E-A-T signals get cited more
- Content with clear factual claims, citations, and structure gets cited more
- Structured data (schema) helps AI parse content accurately

### GEO Tactics
1. **Be an entity first** — AI can't recommend what it doesn't know
2. **Write citation-worthy content** — factual, specific, with data and expert quotes
3. **Use structured data** — FAQ, HowTo, Article schema helps AI read your content
4. **Get mentioned by trusted sources** — AI learns from authoritative sites
5. **Answer questions directly** — AI loves concise, direct answers (put the answer in the first paragraph)
6. **Create data / statistics pages** — original data gets cited heavily by AI
7. **FAQ pages** — frequently cited by AI Overviews

### AI Overview Optimization
- Target "featured snippet" style answers — short, direct, factual
- Use lists, tables, step-by-step formats
- Answer the question in the first 100 words of the page
- Include related questions as H2/H3 headers
- Cite sources in your content (shows depth and accuracy)

---

## E-E-A-T Signals for Entity SEO

E-E-A-T = Experience, Expertise, Authoritativeness, Trustworthiness

**Experience signals:**
- Real photos and videos (not stock)
- Case studies with actual results
- Before/after content
- Testimonials with real names and photos

**Expertise signals:**
- Author bio pages with credentials
- Detailed, accurate content
- Mention of certifications, awards, years of experience
- References to industry standards

**Authoritativeness signals:**
- Backlinks from industry sites
- Mentions in press / media
- Social proof (follower counts, engagement)
- Verified profiles (blue check, GBP verified)

**Trustworthiness signals:**
- HTTPS / SSL
- Privacy Policy and Terms pages
- Physical address visible
- Contact information easy to find
- Money-back guarantees or clear service terms

---

## Entity SEO Workflow for a New Client

### Week 1 — Entity Foundation
1. Audit current entity signals (search brand name — what appears?)
2. Create/optimize About page as Entity Home
3. Install and configure Organization schema with sameAs
4. Audit and fix NAP across all existing profiles
5. Claim and complete Google Business Profile

### Week 2 — Corroboration Layer
6. Create / update all major social profiles (Facebook, Instagram, LinkedIn, YouTube)
7. Submit to top 10-15 directories with consistent NAP
8. Create Wikidata entry
9. Add Founder/Author page with bio and credentials

### Week 3 — Content + Schema
10. Add FAQ schema to key service pages
11. Add Article schema to all blog posts
12. Optimize for featured snippets — answer questions directly
13. Create topic clusters for topical authority
14. Ensure all blog posts link to Entity Home

### Week 4 — Verification + Monitoring
15. Submit sitemap to Google Search Console
16. Request indexing of all key pages
17. Validate all schema in Google Rich Results Test
18. Check Brand SERP — is entity info showing correctly?
19. Set up GSC monitoring for impressions, clicks, CTR

---

## Entity Audit Checklist

Run this for every new client BEFORE starting work.

**Search Signals:**
- [ ] Search brand name — does their site rank #1?
- [ ] Does Knowledge Panel appear?
- [ ] Are social profiles showing?
- [ ] Any negative content on page 1?

**On-Site:**
- [ ] Is there a clear About page with full entity info?
- [ ] Does the homepage have Organization/LocalBusiness schema?
- [ ] Is there a founder/team page?
- [ ] Is NAP in the footer?
- [ ] Is there an FAQ section?

**Off-Site:**
- [ ] Is Google Business Profile claimed and complete?
- [ ] Are all social profiles claimed?
- [ ] Are there 15+ directory citations with consistent NAP?
- [ ] Is there a Wikidata entry?
- [ ] Are there any press/media mentions?

---

## Tools for Entity SEO

- **Google Rich Results Test** — validate schema markup
- **Schema.org** — reference for all schema types
- **Wikidata** — create entity entries (wikidata.org)
- **Google Business Profile** — manage local entity (business.google.com)
- **Kalicube Pro** — Brand SERP monitoring and entity tracking (paid)
- **Google Knowledge Graph Search API** — check if entity is indexed
- **Merkle Schema Markup Generator** — generate schema JSON-LD
- **Google Search Console** — monitor impressions, index coverage

---

## Sources

- Jason Barnard / Kalicube: https://kalicube.com — Entity Home, Knowledge Panel, Brand SERP
- Koray Tuğberk GÜBÜR: https://www.holisticseo.digital — Semantic SEO, entity-based content
- Dixon Jones: https://dixonjones.com — Entity SEO principles
- Google's Search Quality Rater Guidelines — E-E-A-T
- Schema.org — Official structured data vocabulary

---

*Last updated: 2026-04-05*

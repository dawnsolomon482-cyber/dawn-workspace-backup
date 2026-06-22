# Zillow Rental Scraper – Approach & Documentation

## 1. Script / Workflow Used

**Tool:** n8n (open-source workflow automation)
**File:** `zillow_workflow.json` — import directly into n8n

**Nodes used (all free):**
- Manual Trigger — starts the workflow on demand
- Set Parameters — configures search criteria (location, beds, price)
- HTTP Request — calls SerpAPI Zillow endpoint
- Code (JavaScript) — extracts and structures property fields
- Filter — enforces 4+ bedrooms and under $20,000/month
- Remove Duplicates — deduplicates by property URL
- Google Sheets — appends results to a spreadsheet

**API Used:** SerpAPI (Zillow engine)
- Free tier: 100 searches/month
- Endpoint: `https://serpapi.com/search.json?engine=zillow`
- Parameters: `search_type=rent`, `location`, `beds_min=4`, `price_max=20000`

---

## 2. Sample Output

See `sample_output.csv` for example results.

Fields returned per property:
| Field | Description |
|---|---|
| property_url | Direct link to Zillow listing |
| monthly_rent | Rent in USD |
| bedrooms | Number of bedrooms |
| bathrooms | Number of bathrooms |
| address | Full street address |
| sqft | Square footage |

---

## 3. Approach

1. SerpAPI is used to query Zillow's rental listings with pre-set filters (Fort Lauderdale FL 33301, 4+ beds, under $20k/month).
2. The raw API response is parsed in a JavaScript Code node to extract only the required fields.
3. A Filter node double-checks that all results meet the criteria (in case SerpAPI returns edge cases).
4. Duplicates are removed by comparing property URLs.
5. Final clean results are written to Google Sheets for review.

---

## 4. Scraping Limitations

- **Rate limits:** SerpAPI free tier allows 100 searches/month. For larger volumes, a paid plan is needed.
- **Zillow anti-scraping:** Direct scraping of Zillow's HTML is blocked by bot detection. SerpAPI handles this by acting as a proxy layer.
- **Data freshness:** Results depend on Zillow's listing index — newly posted listings may take time to appear.
- **Price format:** Zillow sometimes returns price as a string (e.g., "$3,500/mo") rather than a plain number. The Code node handles normalization.
- **Pagination:** SerpAPI returns up to 20 results per call by default. For more results, pagination via the `start` parameter is needed.

---

## 5. Feeding Data into an AI Agent

Once properties are saved to Google Sheets, the data can be fed into an AI agent in two ways:

**Option A – Direct AI node in n8n (Groq, free)**
- Add a Groq Chat Model node after Remove Duplicates
- Prompt: "Given these rental properties, summarize the top 3 best value options and explain why based on price per bedroom ratio and location."
- Output: AI-written summary appended to a separate Sheets tab

**Option B – Batch summarization**
- Export the CSV
- Feed into any LLM (ChatGPT, Claude, Groq) with the prompt:
  "You are a real estate analyst. Review these Fort Lauderdale rental listings and recommend the top options for a family of 4 based on value, space, and price."

**Decision-making use cases:**
- Flag properties under $1,000/bedroom as high value
- Score properties by sqft-to-price ratio
- Auto-email top 3 matches to a client

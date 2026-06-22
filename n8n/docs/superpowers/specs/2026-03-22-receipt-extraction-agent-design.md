# Receipt Extraction AI Agent — Design Spec
**Date:** 2026-03-22
**Platform:** n8n (self-hosted on Render)
**AI Model:** claude-sonnet-4-20250514 (Anthropic API)

---

## Overview

An n8n workflow that accepts receipt files (images or PDFs) via a browser-based form, uses Claude's vision/document capabilities to extract structured receipt data, and appends the result as a new row in a Google Sheet. Includes self-healing retry logic, low-confidence re-extraction, and error logging.

---

## Architecture

### Trigger
**n8n Form Trigger** — generates a public browser form with a file upload field. Supports JPEG, PNG, WEBP, GIF, and PDF. No external tooling required to submit receipts.

### Node Chain

```
[Form Trigger]
  → [Code: Prepare File]
  → [Loop Over Items] ─────────────────────────────────────────────┐
      → [HTTP Request: Claude API]                                  │
      → [Code: Parse + Check Result]                               │
          → if parse failed AND retries < 3: loop back ────────────┘
          → if parse succeeded: exit loop
  → [Code: Confidence Check + Re-prompt decision]
      → if confidenceScore < 50:
          → [Set: Store original result]
          → [HTTP Request: Claude API re-prompt]
          → [Code: Parse re-prompt response]
          → [Code: Compare + pick higher confidence]
  → [Code: Serialize lineItems + Attach metadata]
  → [Google Sheets: Read — Duplicate Check]
  → [Code: Check Duplicate]
  → [IF: Duplicate?]
      YES → [Set: Mark Skipped]
      NO  → [Google Sheets: Append Row]
  → [Form Response: Summary]

[Error Trigger]
  → [Code: Read file name from static data]
  → [Google Sheets: Append to Errors Tab]
```

---

## Node Specifications

### 1. Form Trigger
- Field: `receipt_file` (file upload, required)
- Accepted types: image/jpeg, image/png, image/webp, image/gif, application/pdf
- Workflow name: `Receipt Extraction Agent`

### 2. Code: Prepare File
- Reads binary data from Form Trigger output
- Extracts: `base64`, `mimeType`, `fileName`
- Determines content block type:
  - Images (`image/*`) → `contentBlockType: "image"`
  - PDFs (`application/pdf`) → `contentBlockType: "document"`
- Throws descriptive error for unsupported MIME types: `Unsupported file type: [type]. Supported: image/jpeg, image/png, image/webp, image/gif, application/pdf`
- Attaches `processedAt` ISO timestamp
- **Persists `fileName` to n8n workflow static data** using `$workflow.staticData.lastFileName = fileName` so the Error Trigger can retrieve it if the workflow fails downstream

### 3. Loop Over Items (Self-healing: JSON parse retry)
- Wraps nodes 4 and 5 (HTTP Request + Code: Parse)
- Initializes `retryCount = 0`, `parseSuccess = false`
- On each iteration:
  - Runs Claude HTTP Request
  - Runs Code: Parse
  - If parse succeeded (`parseSuccess = true`): exits loop
  - If parse failed AND `retryCount < 2`: increments counter, uses stricter prompt variant, continues loop
  - If `retryCount >= 2` AND still failing: throws error (caught by Error Trigger)
- **Stricter prompt variant** (used on retry): appends to system prompt — `"IMPORTANT: Your previous response could not be parsed as JSON. Return ONLY the raw JSON object. Absolutely no markdown, no code fences, no explanation text of any kind."`

### 4. HTTP Request: Claude API
- Endpoint: `https://api.anthropic.com/v1/messages`
- Method: POST
- Credential type: **Header Auth** (n8n credential type) — manually specify header name `x-api-key` and value from the stored credential
- Headers:
  - `x-api-key`: from Header Auth credential
  - `anthropic-version`: `2023-06-01`
  - `anthropic-beta`: `pdfs-2024-09-25` *(required for PDF support; harmless for image requests — include unconditionally)*
  - `content-type`: `application/json`
- Model: `claude-sonnet-4-20250514`
- **Max tokens: 2048** (1024 is insufficient for receipts with many line items)
- **n8n retry settings:** 3 retries, exponential backoff (for transient 5xx / rate limit errors)

**System prompt:**
```
You are a receipt data extraction assistant. Extract structured data from the provided receipt image or document and return ONLY a valid JSON object with no markdown, no explanation, no code fences.

Required JSON shape:
{
  "date": "YYYY-MM-DD or null",
  "vendor": "string or null",
  "totalAmount": number or null,
  "currency": "ISO 4217 code or null",
  "category": "Food & Dining | Transportation | Groceries | Utilities | Entertainment | Healthcare | Shopping | Travel | Other",
  "paymentMethod": "Cash | Credit Card | Debit Card | GCash | PayMaya | Bank Transfer | Unknown",
  "lineItems": [{ "name": "string", "qty": number, "price": number }],
  "confidenceScore": number between 0 and 100
}

Rules:
- totalAmount: numeric only, no currency symbols
- currency: infer from symbols or context ($ → USD, ₱ → PHP, € → EUR, etc.)
- category: infer from vendor name and line items
- paymentMethod: extract from receipt text; default to "Unknown" if not visible
- confidenceScore: your honest assessment of extraction accuracy (0-100)
- If a field cannot be determined, use null (not empty string)
- lineItems: empty array [] if no individual items are visible
```

**User message content block (images):**
```json
{
  "type": "image",
  "source": {
    "type": "base64",
    "media_type": "{{mimeType}}",
    "data": "{{base64}}"
  }
}
```

**User message content block (PDFs):**
```json
{
  "type": "document",
  "source": {
    "type": "base64",
    "media_type": "application/pdf",
    "data": "{{base64}}"
  }
}
```

### 5. Code: Parse + Check Result (inside Loop)
- Strips markdown fences (` ```json ``` `) from Claude response text
- Attempts `JSON.parse()`
- On success: sets `parseSuccess = true`, passes parsed object to next node
- On failure: sets `parseSuccess = false`, signals loop to retry or throw

### 6. Code: Confidence Check + Re-prompt Decision
- Checks `confidenceScore` from parsed result
- If `confidenceScore >= 50`: passes through directly
- If `confidenceScore < 50`:
  - Stores original result in a temporary variable `originalResult`
  - Triggers the re-prompt path

### 7. Set: Store Original Result
- Stores the first extraction result to a Set node so it remains available after the re-prompt HTTP Request returns a new item
- Used in step 9 for comparison

### 8. HTTP Request: Claude API Re-prompt
- Same configuration as node 4
- User message is a text block with the re-prompt:
  `"The previous extraction had low confidence. Please look more carefully at the receipt and focus specifically on the total amount, date, and vendor name. Return only the corrected JSON object."`
- Includes the same image/document content block as the original request

### 9. Code: Compare + Pick Higher Confidence
- Parses re-prompt response (same strip + JSON.parse as node 5)
- Compares `confidenceScore` of original result vs re-prompt result
- Returns whichever has the higher score

### 10. Code: Serialize lineItems + Attach Metadata
- Calls `JSON.stringify(parsed.lineItems)` to convert array to a string for Google Sheets column G
- Attaches `fileName` from Form Trigger
- Attaches `processedAt` ISO timestamp
- Detects null fields and passes `nullFields: string[]` for Form Response display

### 11. Google Sheets: Read — Duplicate Check
- Credential: Google Service Account
- Sheet ID: configured directly in node (hardcode or use n8n Variables — see Setup section)
- Reads all rows from the "Receipts" sheet
- Returns all rows as items

### 12. Code: Check Duplicate
- Iterates returned rows
- For each row: compares `row.Date`, `row.Vendor`, `row.TotalAmount` against current extraction
- Comparison is **case-insensitive and trimmed** to handle minor formatting differences
- Sets `isDuplicate: true` if match found, `isDuplicate: false` otherwise

### 13. IF: Duplicate?
- Condition: `{{ $json.isDuplicate }} === true`
- YES → Set node (step 14)
- NO → Google Sheets Append (step 15)

### 14. Set: Mark Skipped
- Sets response message: `⚠️ Duplicate skipped — this receipt already exists in the sheet.`
- Passes to Form Response

### 15. Google Sheets: Append Row
- Credential: Google Service Account
- Sheet: "Receipts" tab
- Appends to first empty row in columns A–J:

| Column | Field | Notes |
|--------|-------|-------|
| A | date | YYYY-MM-DD |
| B | vendor | string |
| C | totalAmount | numeric |
| D | currency | ISO 4217 |
| E | category | inferred |
| F | paymentMethod | string |
| G | lineItems | JSON.stringify'd array |
| H | confidenceScore | 0-100 |
| I | fileName | original filename |
| J | processedAt | ISO timestamp |

### 16. Form Response
- Always reached via the main workflow path (both duplicate and successful save branches converge here)
- Success (all fields): `✅ Saved! Vendor: [X], Total: [X], Date: [X]`
- Success with nulls: `✅ Saved with missing fields: [list of null fields]`
- Duplicate: `⚠️ Duplicate skipped — this receipt already exists in the sheet.`
- **Note:** If the Error Trigger intercepts an unhandled failure, the Form Trigger response is not sent — the user will see a generic form timeout. This is a known limitation.

### 17. Error Trigger + Errors Tab Logging
- Catches any unhandled workflow error
- Retrieves `fileName` from `$workflow.staticData.lastFileName` (set in node 2)
- Appends a row to the "Errors" tab in the same Google Sheet with:
  - `$now` — timestamp
  - `$workflow.staticData.lastFileName` — file name (if available, otherwise "unknown")
  - `$json.error.message` — error message
  - `$json.error.node.name` — node that failed

---

## Google Sheet Setup

### Main Sheet: "Receipts"
Headers in row 1:
`Date | Vendor | Total Amount | Currency | Category | Payment Method | Line Items | Confidence Score | File Name | Processed At`

### Errors Tab: "Errors"
Headers in row 1:
`Timestamp | File Name | Error Message | Failed Node`

### Sheet ID
The Sheet ID is the long alphanumeric string in the Google Sheets URL between `/d/` and `/edit`:
`https://docs.google.com/spreadsheets/d/`**`<SHEET_ID>`**`/edit`

Configure in n8n either by:
- **Hardcoding** directly in the Google Sheets node configuration, or
- **n8n Variables** (Settings > Variables > Add Variable: `GOOGLE_SHEET_ID`) and referencing as `{{ $vars.GOOGLE_SHEET_ID }}`

---

## Credentials Required in n8n

| Credential | Type | Notes |
|---|---|---|
| Anthropic API Key | Header Auth | Header name: `x-api-key` |
| Google Sheets | Service Account | JSON key from Google Cloud |

---

## Google Service Account Setup
1. Go to Google Cloud Console → Create or select a project
2. Enable **Google Sheets API**
3. Create a **Service Account** → Generate JSON key → save securely
4. Add the service account JSON to n8n as a Google Sheets (Service Account) credential
5. Create a Google Sheet → copy the Sheet ID from the URL (see Sheet ID section above)
6. **Share the sheet** with the service account email address (Editor access)
7. Add the Sheet ID to the workflow node configuration

---

## Self-Healing Summary

| Failure Mode | Recovery Strategy |
|---|---|
| Claude returns malformed JSON | Loop Over Items: retry up to 2x with stricter prompt |
| Claude API 5xx / rate limit | n8n built-in retry: 3 attempts, exponential backoff |
| Low confidence score (< 50) | Re-prompt with targeted extraction; pick higher-confidence result |
| Duplicate receipt | Skip save, return clear message to user via Form Response |
| Unhandled workflow error | Error Trigger logs to Errors tab; file name retrieved from static data |
| Partial extraction (null fields) | Save row anyway, flag null fields in Form Response |

---

## Out of Scope
- Batch folder processing (Form Trigger handles one file at a time; re-submit for multiple)
- Email trigger (can be added as a second trigger later)
- Authentication/access control on the form URL
- Form Response for Error Trigger path (n8n limitation — error path cannot reach Form Response node)

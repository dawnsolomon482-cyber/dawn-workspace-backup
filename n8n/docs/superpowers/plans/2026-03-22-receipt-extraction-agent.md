# Receipt Extraction AI Agent — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy an n8n workflow that accepts receipt image/PDF uploads via a browser form, extracts structured data via Claude's vision API, and saves results to Google Sheets with self-healing retry and duplicate detection.

**Architecture:** Single n8n workflow with 15 nodes — Form Trigger → binary preparation → Code: Call Claude with Retry (fetch + 3-attempt loop with stricter prompt on failure) → confidence check → optional re-prompt → serialize → Google Sheets duplicate check → save/skip branch → Form Response. A parallel Error Trigger path logs failures to an Errors tab.

**Tech Stack:** n8n (self-hosted on Render), Anthropic API (`claude-sonnet-4-20250514`), Google Sheets API v4 (Service Account auth), n8n MCP tools for all deployment steps.

> **Retry implementation note:** Rather than using a Loop Over Items node (which cannot break on condition in n8n), retry logic is implemented directly in the "Call Claude with Retry" Code node using `fetch()`. This node retries up to 3 times with a stricter system prompt on JSON parse failure and escalating wait on API errors — satisfying the spec's self-healing requirement while being more maintainable. The Anthropic API key is accessed via an n8n Variable (`ANTHROPIC_API_KEY`) rather than an HTTP Request credential, which is required for the retry pattern.

---

## Pre-requisites (human setup — must be done before Task 1)

**1 — Add n8n Variable for Anthropic API key**
- Go to n8n Settings → Variables → Add Variable
- Name: `ANTHROPIC_API_KEY`
- Value: your Anthropic API key (starts with `sk-ant-`)

**2 — Google Sheets Credential (Service Account)**
- Type: **Google API (Service Account)**
- Name: `Google Sheets Service Account`
- Upload the service account JSON key from Google Cloud Console

**3 — Google Sheet setup**
1. Create a new Google Sheet
2. Tab 1: rename to `Receipts` — add row 1 headers: `Date | Vendor | Total Amount | Currency | Category | Payment Method | Line Items | Confidence Score | File Name | Processed At`
3. Tab 2: rename to `Errors` — add row 1 headers: `Timestamp | File Name | Error Message | Failed Node`
4. Share the sheet with the service account email address (Editor access)
5. Copy the Sheet ID: the alphanumeric string between `/d/` and `/edit` in the sheet URL

---

## Node Architecture Reference

```
[1] Form Trigger                         ← response mode: "responseNode"
  → [2] Code: Prepare File
  → [3] Code: Call Claude with Retry     ← fetch() loop, up to 3 attempts
  → [4] IF: Confidence < 50?
      YES → [5] Code: Call Claude Re-prompt
      NO  → pass through
  → [6] Code: Serialize + Attach Metadata  ← both IF branches connect here
  → [7] Google Sheets: Read (Duplicate Check)
  → [8] Code: Check Duplicate
  → [9] IF: Duplicate?
      YES → [10] Set: Mark Skipped
      NO  → [11] Google Sheets: Append Row
  → [12] Respond to Webhook              ← both branches connect here

[13] Error Trigger
  → [14] Google Sheets: Append Errors Tab
```

---

## Task 1: Pre-flight Checks

**Goal:** Verify the n8n instance is healthy.

- [ ] **Step 1: Health check**

  Tool: `mcp__n8n-mcp__n8n_health_check`

  Expected: status OK. If the Render service is sleeping, wait 30 seconds and retry once.

- [ ] **Step 2: List existing workflows**

  Tool: `mcp__n8n-mcp__n8n_list_workflows`

  Expected: no workflow named `Receipt Extraction Agent` already exists.

- [ ] **Step 3: Confirm n8n Variable is set**

  In the n8n UI (Settings → Variables), confirm `ANTHROPIC_API_KEY` is present. If not, add it before proceeding — node 3's Code will throw a clear error if it's missing.

---

## Task 2: Build and Deploy the Workflow

**Goal:** Create the complete workflow in one deployment. Replace `YOUR_SHEET_ID` with the actual Sheet ID before deploying.

- [ ] **Step 1: Create the workflow**

  Tool: `mcp__n8n-mcp__n8n_create_workflow`

  Use this workflow JSON (replace `YOUR_SHEET_ID` in nodes 7, 11, and 14):

```json
{
  "name": "Receipt Extraction Agent",
  "active": false,
  "nodes": [
    {
      "id": "node-1",
      "name": "Form Trigger",
      "type": "n8n-nodes-base.formTrigger",
      "typeVersion": 2,
      "position": [0, 0],
      "parameters": {
        "formTitle": "Receipt Extractor",
        "formDescription": "Upload a receipt image or PDF to extract and save to Google Sheets.",
        "formFields": {
          "values": [
            {
              "fieldLabel": "Receipt File",
              "fieldType": "file",
              "requiredField": true,
              "acceptFileTypes": ".jpg,.jpeg,.png,.webp,.gif,.pdf",
              "fieldId": "receipt_file"
            }
          ]
        },
        "options": {
          "respondWith": "responseNode"
        }
      }
    },
    {
      "id": "node-2",
      "name": "Prepare File",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [220, 0],
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const item = $input.first();\nconst binaryData = item.binary?.receipt_file;\n\nif (!binaryData) {\n  throw new Error('No file uploaded. Please attach a receipt file.');\n}\n\nconst mimeType = binaryData.mimeType;\nconst fileName = binaryData.fileName || 'unknown';\n\nconst supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];\nif (!supportedTypes.includes(mimeType)) {\n  throw new Error(`Unsupported file type: ${mimeType}. Supported: ${supportedTypes.join(', ')}`);\n}\n\nconst contentBlockType = mimeType.startsWith('image/') ? 'image' : 'document';\n\n// Persist fileName so Error Trigger can log it even if workflow fails downstream\n$workflow.staticData.lastFileName = fileName;\n\nreturn [{\n  json: {\n    base64: binaryData.data,\n    mimeType,\n    fileName,\n    contentBlockType,\n    processedAt: new Date().toISOString()\n  }\n}];"
      }
    },
    {
      "id": "node-3",
      "name": "Call Claude with Retry",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [440, 0],
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const { base64, mimeType, contentBlockType, fileName, processedAt } = $input.first().json;\n\nconst apiKey = $vars.ANTHROPIC_API_KEY;\nif (!apiKey) {\n  throw new Error('n8n Variable ANTHROPIC_API_KEY is not set. Go to Settings > Variables and add it.');\n}\n\nconst systemPrompt = `You are a receipt data extraction assistant. Extract structured data from the provided receipt image or document and return ONLY a valid JSON object with no markdown, no explanation, no code fences.\n\nRequired JSON shape:\n{\n  \"date\": \"YYYY-MM-DD or null\",\n  \"vendor\": \"string or null\",\n  \"totalAmount\": number or null,\n  \"currency\": \"ISO 4217 code or null\",\n  \"category\": \"Food & Dining | Transportation | Groceries | Utilities | Entertainment | Healthcare | Shopping | Travel | Other\",\n  \"paymentMethod\": \"Cash | Credit Card | Debit Card | GCash | PayMaya | Bank Transfer | Unknown\",\n  \"lineItems\": [{ \"name\": \"string\", \"qty\": number, \"price\": number }],\n  \"confidenceScore\": number between 0 and 100\n}\n\nRules:\n- totalAmount: numeric only, no currency symbols\n- currency: infer from symbols or context ($ to USD, to PHP, to EUR, etc.)\n- category: infer from vendor name and line items\n- paymentMethod: extract from receipt text; default to Unknown if not visible\n- confidenceScore: your honest assessment of extraction accuracy (0-100)\n- If a field cannot be determined, use null (not empty string)\n- lineItems: empty array [] if no individual items are visible`;\n\nconst contentBlock = contentBlockType === 'image'\n  ? { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } }\n  : { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } };\n\nfunction stripFences(text) {\n  return text.replace(/```json\\n?/g, '').replace(/```\\n?/g, '').trim();\n}\n\nlet lastError = null;\nlet currentSystemPrompt = systemPrompt;\n\nfor (let attempt = 0; attempt < 3; attempt++) {\n  if (attempt > 0) {\n    currentSystemPrompt = systemPrompt + '\\n\\nIMPORTANT: Your previous response could not be parsed as JSON. Return ONLY the raw JSON object. Absolutely no markdown, no code fences, no explanation text of any kind.';\n  }\n\n  const response = await fetch('https://api.anthropic.com/v1/messages', {\n    method: 'POST',\n    headers: {\n      'x-api-key': apiKey,\n      'anthropic-version': '2023-06-01',\n      'anthropic-beta': 'pdfs-2024-09-25',\n      'content-type': 'application/json'\n    },\n    body: JSON.stringify({\n      model: 'claude-sonnet-4-20250514',\n      max_tokens: 2048,\n      system: currentSystemPrompt,\n      messages: [{ role: 'user', content: [contentBlock] }]\n    })\n  });\n\n  if (!response.ok) {\n    const errText = await response.text();\n    lastError = `API error ${response.status}: ${errText.substring(0, 200)}`;\n    // Only retry on rate limit (429) or server errors (5xx)\n    if (response.status !== 429 && response.status < 500) break;\n    await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));\n    continue;\n  }\n\n  const data = await response.json();\n  const rawText = data.content?.[0]?.text || '';\n\n  try {\n    const parsed = JSON.parse(stripFences(rawText));\n    return [{\n      json: {\n        ...parsed,\n        base64,\n        mimeType,\n        contentBlockType,\n        fileName,\n        processedAt\n      }\n    }];\n  } catch (e) {\n    lastError = `Attempt ${attempt + 1}: JSON parse failed. Raw: ${rawText.substring(0, 200)}`;\n  }\n}\n\nthrow new Error(`Claude extraction failed after 3 attempts. Last error: ${lastError}`);"
      }
    },
    {
      "id": "node-4",
      "name": "Confidence Check",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [660, 0],
      "parameters": {
        "conditions": {
          "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict" },
          "conditions": [
            {
              "id": "confidence-condition",
              "leftValue": "={{ $json.confidenceScore }}",
              "rightValue": 50,
              "operator": { "type": "number", "operation": "lt" }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      }
    },
    {
      "id": "node-5",
      "name": "Call Claude Re-prompt",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [880, -140],
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const original = $input.first().json;\nconst { base64, mimeType, contentBlockType } = original;\n\nconst apiKey = $vars.ANTHROPIC_API_KEY;\n\nconst contentBlock = contentBlockType === 'image'\n  ? { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } }\n  : { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } };\n\nfunction stripFences(text) {\n  return text.replace(/```json\\n?/g, '').replace(/```\\n?/g, '').trim();\n}\n\nconst response = await fetch('https://api.anthropic.com/v1/messages', {\n  method: 'POST',\n  headers: {\n    'x-api-key': apiKey,\n    'anthropic-version': '2023-06-01',\n    'anthropic-beta': 'pdfs-2024-09-25',\n    'content-type': 'application/json'\n  },\n  body: JSON.stringify({\n    model: 'claude-sonnet-4-20250514',\n    max_tokens: 2048,\n    system: 'You are a receipt data extraction assistant. The previous extraction had low confidence. Return ONLY a valid JSON object with no markdown, no code fences, no explanation. Shape: { \"date\": \"YYYY-MM-DD or null\", \"vendor\": string or null, \"totalAmount\": number or null, \"currency\": ISO4217 or null, \"category\": string, \"paymentMethod\": string, \"lineItems\": array, \"confidenceScore\": 0-100 }',\n    messages: [{\n      role: 'user',\n      content: [\n        contentBlock,\n        { type: 'text', text: 'Please look more carefully at this receipt, focusing on the total amount, date, and vendor name. Return only the corrected JSON.' }\n      ]\n    }]\n  })\n});\n\nif (!response.ok) {\n  // Re-prompt failed — fall back to original result\n  return [{ json: original }];\n}\n\nconst data = await response.json();\nconst rawText = data.content?.[0]?.text || '';\n\nlet repromptParsed;\ntry {\n  repromptParsed = JSON.parse(stripFences(rawText));\n} catch (e) {\n  // Parse failed — fall back to original\n  return [{ json: original }];\n}\n\n// Pick whichever result has higher confidence\nconst winner = (repromptParsed.confidenceScore ?? 0) > (original.confidenceScore ?? 0)\n  ? repromptParsed\n  : original;\n\nreturn [{\n  json: {\n    ...winner,\n    base64: original.base64,\n    mimeType: original.mimeType,\n    contentBlockType: original.contentBlockType,\n    fileName: original.fileName,\n    processedAt: original.processedAt\n  }\n}];"
      }
    },
    {
      "id": "node-6",
      "name": "Serialize and Attach Metadata",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1100, 0],
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const item = $input.first().json;\n\nconst lineItemsString = JSON.stringify(item.lineItems || []);\n\nconst trackableFields = ['date', 'vendor', 'totalAmount', 'currency', 'category', 'paymentMethod'];\nconst nullFields = trackableFields.filter(f => item[f] === null || item[f] === undefined);\n\nreturn [{\n  json: {\n    date: item.date,\n    vendor: item.vendor,\n    totalAmount: item.totalAmount,\n    currency: item.currency,\n    category: item.category,\n    paymentMethod: item.paymentMethod,\n    lineItems: lineItemsString,\n    confidenceScore: item.confidenceScore,\n    fileName: item.fileName,\n    processedAt: item.processedAt,\n    nullFields\n  }\n}];"
      }
    },
    {
      "id": "node-7",
      "name": "Sheets Read Duplicate Check",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [1320, 0],
      "parameters": {
        "operation": "read",
        "documentId": { "__rl": true, "value": "YOUR_SHEET_ID", "mode": "id" },
        "sheetName": { "__rl": true, "value": "Receipts", "mode": "name" },
        "filtersUI": {},
        "options": {}
      },
      "credentials": {
        "googleApi": {
          "id": "GOOGLE_CREDENTIAL_ID",
          "name": "Google Sheets Service Account"
        }
      }
    },
    {
      "id": "node-8",
      "name": "Check Duplicate",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1540, 0],
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const rows = $input.all();\nconst current = $('Serialize and Attach Metadata').first().json;\n\nconst normalize = (v) => String(v ?? '').trim().toLowerCase();\n\nconst isDuplicate = rows.some(row => {\n  return (\n    normalize(row.json['Date']) === normalize(current.date) &&\n    normalize(row.json['Vendor']) === normalize(current.vendor) &&\n    normalize(row.json['Total Amount']) === normalize(current.totalAmount)\n  );\n});\n\nreturn [{\n  json: {\n    ...current,\n    isDuplicate\n  }\n}];"
      }
    },
    {
      "id": "node-9",
      "name": "Is Duplicate",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [1760, 0],
      "parameters": {
        "conditions": {
          "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict" },
          "conditions": [
            {
              "id": "dup-condition",
              "leftValue": "={{ $json.isDuplicate }}",
              "rightValue": true,
              "operator": { "type": "boolean", "operation": "true" }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      }
    },
    {
      "id": "node-10",
      "name": "Mark Skipped",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "position": [1980, -140],
      "parameters": {
        "mode": "manual",
        "duplicateItem": false,
        "assignments": {
          "assignments": [
            {
              "id": "msg",
              "name": "responseMessage",
              "value": "⚠️ Duplicate skipped — this receipt already exists in the sheet.",
              "type": "string"
            }
          ]
        },
        "options": {}
      }
    },
    {
      "id": "node-11",
      "name": "Sheets Append Row",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [1980, 140],
      "parameters": {
        "operation": "append",
        "documentId": { "__rl": true, "value": "YOUR_SHEET_ID", "mode": "id" },
        "sheetName": { "__rl": true, "value": "Receipts", "mode": "name" },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Date": "={{ $json.date }}",
            "Vendor": "={{ $json.vendor }}",
            "Total Amount": "={{ $json.totalAmount }}",
            "Currency": "={{ $json.currency }}",
            "Category": "={{ $json.category }}",
            "Payment Method": "={{ $json.paymentMethod }}",
            "Line Items": "={{ $json.lineItems }}",
            "Confidence Score": "={{ $json.confidenceScore }}",
            "File Name": "={{ $json.fileName }}",
            "Processed At": "={{ $json.processedAt }}"
          },
          "matchingColumns": [],
          "schema": []
        },
        "options": {}
      },
      "credentials": {
        "googleApi": {
          "id": "GOOGLE_CREDENTIAL_ID",
          "name": "Google Sheets Service Account"
        }
      }
    },
    {
      "id": "node-12",
      "name": "Form Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [2200, 0],
      "parameters": {
        "respondWith": "text",
        "responseBody": "={{ $json.responseMessage || ($json.nullFields?.length > 0 ? '✅ Saved with missing fields: ' + $json.nullFields.join(', ') : '✅ Saved! Vendor: ' + ($json.vendor || 'Unknown') + ', Total: ' + ($json.currency || '') + ' ' + ($json.totalAmount || 'Unknown') + ', Date: ' + ($json.date || 'Unknown')) }}"
      }
    },
    {
      "id": "node-13",
      "name": "Error Trigger",
      "type": "n8n-nodes-base.errorTrigger",
      "typeVersion": 1,
      "position": [0, 340],
      "parameters": {}
    },
    {
      "id": "node-14",
      "name": "Sheets Log Error",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [220, 340],
      "parameters": {
        "operation": "append",
        "documentId": { "__rl": true, "value": "YOUR_SHEET_ID", "mode": "id" },
        "sheetName": { "__rl": true, "value": "Errors", "mode": "name" },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Timestamp": "={{ $now.toISO() }}",
            "File Name": "={{ $workflow.staticData.lastFileName || 'unknown' }}",
            "Error Message": "={{ $json.error?.message || 'Unknown error' }}",
            "Failed Node": "={{ $json.error?.node?.name || 'Unknown node' }}"
          },
          "matchingColumns": [],
          "schema": []
        },
        "options": {}
      },
      "credentials": {
        "googleApi": {
          "id": "GOOGLE_CREDENTIAL_ID",
          "name": "Google Sheets Service Account"
        }
      }
    }
  ],
  "connections": {
    "Form Trigger": {
      "main": [[{ "node": "Prepare File", "type": "main", "index": 0 }]]
    },
    "Prepare File": {
      "main": [[{ "node": "Call Claude with Retry", "type": "main", "index": 0 }]]
    },
    "Call Claude with Retry": {
      "main": [[{ "node": "Confidence Check", "type": "main", "index": 0 }]]
    },
    "Confidence Check": {
      "main": [
        [{ "node": "Call Claude Re-prompt", "type": "main", "index": 0 }],
        [{ "node": "Serialize and Attach Metadata", "type": "main", "index": 0 }]
      ]
    },
    "Call Claude Re-prompt": {
      "main": [[{ "node": "Serialize and Attach Metadata", "type": "main", "index": 0 }]]
    },
    "Serialize and Attach Metadata": {
      "main": [[{ "node": "Sheets Read Duplicate Check", "type": "main", "index": 0 }]]
    },
    "Sheets Read Duplicate Check": {
      "main": [[{ "node": "Check Duplicate", "type": "main", "index": 0 }]]
    },
    "Check Duplicate": {
      "main": [[{ "node": "Is Duplicate", "type": "main", "index": 0 }]]
    },
    "Is Duplicate": {
      "main": [
        [{ "node": "Mark Skipped", "type": "main", "index": 0 }],
        [{ "node": "Sheets Append Row", "type": "main", "index": 0 }]
      ]
    },
    "Mark Skipped": {
      "main": [[{ "node": "Form Response", "type": "main", "index": 0 }]]
    },
    "Sheets Append Row": {
      "main": [[{ "node": "Form Response", "type": "main", "index": 0 }]]
    },
    "Error Trigger": {
      "main": [[{ "node": "Sheets Log Error", "type": "main", "index": 0 }]]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
}
```

- [ ] **Step 2: Capture the returned workflow ID**

  The MCP response will include a workflow `id`. Save it — you'll need it for all subsequent calls.

- [ ] **Step 3: Update credential ID for Google Sheets**

  List the n8n credentials to get the actual credential IDs, then use `mcp__n8n-mcp__n8n_update_partial_workflow` to replace `GOOGLE_CREDENTIAL_ID` in nodes 7, 11, and 14.

- [ ] **Step 4: Replace Sheet IDs**

  Use `mcp__n8n-mcp__n8n_update_partial_workflow` to replace `YOUR_SHEET_ID` in nodes 7, 11, and 14 with the actual Google Sheet ID.

---

## Task 3: Validate the Workflow

- [ ] **Step 1: Run workflow validation**

  Tool: `mcp__n8n-mcp__n8n_validate_workflow` with the workflow ID.

  Expected: no errors. If errors are found, run `mcp__n8n-mcp__n8n_autofix_workflow` first, then re-validate.

- [ ] **Step 2: Re-validate after any autofix**

  Tool: `mcp__n8n-mcp__n8n_validate_workflow`

  Expected: clean validation pass before proceeding.

---

## Task 4: Test the Workflow

- [ ] **Step 1: Open the workflow in n8n UI and click "Test workflow"**

  The Form Trigger requires a browser-based form submission — it cannot be triggered via MCP directly. Open the n8n instance URL, navigate to the `Receipt Extraction Agent` workflow, click **Test workflow**, then submit a receipt image via the test form that appears.

- [ ] **Step 2: Verify Google Sheet has a new row**

  Open the Google Sheet "Receipts" tab. Confirm a row was appended with columns A–J populated (null values in some columns are acceptable).

- [ ] **Step 3: Test duplicate detection**

  Submit the exact same receipt again. Expected form response: `⚠️ Duplicate skipped — this receipt already exists in the sheet.`

- [ ] **Step 4: Test unsupported file type**

  Try submitting a `.txt` or `.bmp` file. Expected: error from node 2: `Unsupported file type: text/plain. Supported: ...`

- [ ] **Step 5: Test Error Trigger**

  Temporarily set a wrong Sheet ID in node 14 (Sheets Log Error), trigger a workflow error, confirm the "Errors" tab gets a row. Restore the correct Sheet ID after confirming.

---

## Task 5: Activate the Workflow

- [ ] **Step 1: Activate via MCP**

  Tool: `mcp__n8n-mcp__n8n_update_partial_workflow`

  Set `"active": true` on the workflow.

- [ ] **Step 2: Confirm the Production form URL**

  In the n8n UI, open the Form Trigger node. The **Production URL** is the shareable link for uploading receipts:
  `https://techvablueprint1-n8n-45w6.onrender.com/form/<uuid>`

- [ ] **Step 3: Final end-to-end test on the live workflow**

  Submit a receipt via the Production URL (not the test form). Confirm:
  - Form shows success or duplicate message
  - "Receipts" tab has the new row with all 10 columns
  - `confidenceScore` is a number 0–100

---

## Troubleshooting Reference

| Symptom | Likely cause | Fix |
|---|---|---|
| Form 404 | Workflow not active | Set `active: true` |
| `No file uploaded` | Binary field name mismatch | Verify Form Trigger field ID is `receipt_file` |
| `ANTHROPIC_API_KEY is not set` | n8n Variable missing | Settings → Variables → add `ANTHROPIC_API_KEY` |
| `Claude extraction failed after 3 attempts` | API key wrong or quota exceeded | Verify key, check Anthropic usage dashboard |
| Google Sheets 403 | Sheet not shared with service account | Share sheet with service account email (Editor) |
| Google Sheets credential error | Wrong credential type key | Confirm credential type in n8n is "Google API (Service Account)", key in JSON is `googleApi` |
| Duplicate check always false | Header name mismatch | Sheet headers must be exactly `Date`, `Vendor`, `Total Amount` — check for typos or extra spaces |
| `YOUR_SHEET_ID` literal error | Placeholder not replaced | Update nodes 7, 11, 14 with real Sheet ID |
| Errors tab not getting rows | Error Trigger disconnected | Verify Error Trigger → Sheets Log Error connection exists in workflow |
| Form response shows raw JSON | respondToWebhook incompatible with Form Trigger version | In Form Trigger node, confirm `options.respondWith` is set to `"responseNode"` |

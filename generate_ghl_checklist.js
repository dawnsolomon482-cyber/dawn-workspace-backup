const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUTPUT = 'C:\\Users\\R Y Z E N\\OneDrive\\Desktop\\Claude Code\\GHL_PlugAndPlay_Build_Checklist.pdf';

// ── Measurements (points; 1 inch = 72 pts) ──────────────────────────────────
const MARGIN    = 0.75 * 72;   // 54 pts
const PAGE_W    = 8.5 * 72;   // 612
const PAGE_H    = 11  * 72;   // 792
const CONTENT_W = PAGE_W - MARGIN * 2;

// ── Colors ───────────────────────────────────────────────────────────────────
const COLOR_BLACK    = '#000000';
const COLOR_PHASE_BG = '#E8E8E8';
const COLOR_GRAY     = '#555555';
const COLOR_RULE     = '#CCCCCC';

// ── Fonts ────────────────────────────────────────────────────────────────────
const F_REG  = 'Helvetica';
const F_BOLD = 'Helvetica-Bold';

// ── Font sizes ────────────────────────────────────────────────────────────────
const SZ_TITLE    = 16;
const SZ_SUBTITLE = 9;
const SZ_PHASE    = 10;
const SZ_SECTION  = 9;
const SZ_WORKFLOW = 9;
const SZ_ITEM     = 8.5;

// ── Checkbox geometry ─────────────────────────────────────────────────────────
const CB_SIZE     = 6;
const CB_GAP      = 5;
const ITEM_X      = MARGIN + CB_SIZE + CB_GAP;
const ITEM_W      = PAGE_W - ITEM_X - MARGIN;

// ── Vertical spacing ──────────────────────────────────────────────────────────
const GAP_ITEM_BELOW      = 2;
const GAP_PHASE_BELOW     = 4;
const GAP_SECTION_ABOVE   = 6;
const GAP_SECTION_BELOW   = 2;
const GAP_WORKFLOW_ABOVE  = 5;
const GAP_WORKFLOW_BELOW  = 2;
const BOTTOM_BOUND        = PAGE_H - MARGIN - 20; // leave room for page number

// ── Content data ──────────────────────────────────────────────────────────────
const CONTENT = [
  { t: 'phase',    s: 'PHASE 1 — Account Foundation' },
  { t: 'section',  s: 'Account Setup' },
  { t: 'item',     s: 'Configure business name, logo, address, timezone, currency' },
  { t: 'item',     s: 'Set business hours' },
  { t: 'item',     s: 'Secure admin login credentials and document access info' },
  { t: 'section',  s: 'Phone System' },
  { t: 'item',     s: 'Purchase local number via LC Phone' },
  { t: 'item',     s: 'Configure inbound call routing (owner / team / voicemail)' },
  { t: 'item',     s: 'Upload professional voicemail drop recording' },
  { t: 'item',     s: 'Enable missed-call text-back (within 60 seconds)' },
  { t: 'item',     s: 'Set up call recording' },
  { t: 'item',     s: 'Complete A2P 10DLC SMS registration' },
  { t: 'item',     s: 'Test inbound + outbound call and SMS' },
  { t: 'section',  s: 'Email Setup' },
  { t: 'item',     s: 'Verify custom sending domain (SPF / DKIM / DMARC)' },
  { t: 'item',     s: 'Set reply-to address' },
  { t: 'item',     s: 'Test email deliverability — confirm inbox, not spam' },
  { t: 'item',     s: 'Add CAN-SPAM compliant unsubscribe footer' },
  { t: 'section',  s: 'Team & Permissions' },
  { t: 'item',     s: 'Create user accounts for all team members' },
  { t: 'item',     s: 'Assign roles and permissions per user' },
  { t: 'item',     s: 'Set lead routing rules (assigned owner or round-robin)' },
  { t: 'item',     s: 'Configure notification preferences per user' },

  { t: 'phase',    s: 'PHASE 2 — CRM & Pipeline Build' },
  { t: 'section',  s: 'Custom Fields' },
  { t: 'item',     s: 'Map all data points needed from leads and clients' },
  { t: 'item',     s: 'Build contact-level custom fields (lead source, service type, budget, etc.)' },
  { t: 'item',     s: 'Build opportunity-level custom fields (deal value, proposal status, close date)' },
  { t: 'item',     s: 'Group fields logically for clean contact view' },
  { t: 'section',  s: 'Contact Import & Tagging' },
  { t: 'item',     s: 'Import existing contact list (CSV clean-up first)' },
  { t: 'item',     s: 'Map imported fields to GHL contact fields' },
  { t: 'item',     s: 'Apply tags: lead source, status, campaign, lifecycle stage' },
  { t: 'item',     s: 'Build smart lists: new leads, active clients, cold leads, referrals' },
  { t: 'section',  s: 'Pipelines (Sales Process)' },
  { t: 'item',     s: "Map client's exact sales stages (from discovery call notes)" },
  { t: 'item',     s: 'Build Sales Pipeline: Lead In → Contacted → Appointment Set → Proposal Sent → Won / Lost' },
  { t: 'item',     s: 'Build Fulfillment Pipeline (separate): Onboarding → Active → Completed → Referral Requested' },
  { t: 'item',     s: 'Set probability % per stage for reporting' },
  { t: 'item',     s: 'Test contact movement through all stages' },

  { t: 'phase',    s: 'PHASE 3 — Funnel & Lead Capture' },
  { t: 'section',  s: 'Funnel Build' },
  { t: 'item',     s: 'Build landing page with offer and lead capture form' },
  { t: 'item',     s: 'Connect custom domain (verify DNS)' },
  { t: 'item',     s: 'Mobile-optimize all pages' },
  { t: 'item',     s: 'Set up thank you page (with next step CTA)' },
  { t: 'section',  s: 'Lead Form' },
  { t: 'item',     s: 'Build form with fields: name, phone, email, service interest, how they heard' },
  { t: 'item',     s: 'Map all form fields to GHL contact fields' },
  { t: 'item',     s: 'Set form submission to trigger lead workflow' },
  { t: 'item',     s: 'Test form end-to-end on mobile and desktop' },

  { t: 'phase',    s: 'PHASE 4 — Modular Workflow Build' },
  { t: 'workflow', s: '[WORKFLOW 1] New Lead Handler' },
  { t: 'item',     s: 'Trigger: Form submission or manual lead entry' },
  { t: 'item',     s: 'Action: Create contact → assign owner → tag “New Lead”' },
  { t: 'item',     s: 'Action: Send internal notification to rep (SMS + email)' },
  { t: 'item',     s: 'Action: Add to Sales Pipeline → Stage: Lead In' },
  { t: 'item',     s: 'Action: Trigger Nurture Sequence workflow' },
  { t: 'workflow', s: '[WORKFLOW 2] Lead Nurture Sequence' },
  { t: 'item',     s: 'Day 0 — Immediate: confirmation SMS + email' },
  { t: 'item',     s: 'Day 1 — Value email (case study / FAQ / testimonial)' },
  { t: 'item',     s: 'Day 3 — Follow-up SMS' },
  { t: 'item',     s: 'Day 7 — Email with offer or urgency' },
  { t: 'item',     s: 'Day 14 — SMS check-in' },
  { t: 'item',     s: 'Day 30+ — Monthly long-term nurture' },
  { t: 'item',     s: 'STOP condition: booked, replied, opted out' },
  { t: 'workflow', s: '[WORKFLOW 3] Appointment Booking & Reminders' },
  { t: 'item',     s: 'Set up booking calendar (availability + buffer time)' },
  { t: 'item',     s: 'Add booking questions (name, phone, email, reason for call)' },
  { t: 'item',     s: 'Trigger: Appointment booked' },
  { t: 'item',     s: 'Confirmation: immediate SMS + email' },
  { t: 'item',     s: 'Reminder: 24 hours before (SMS + email)' },
  { t: 'item',     s: 'Reminder: 1 hour before (SMS only)' },
  { t: 'item',     s: 'Post-appointment: follow-up SMS + next step' },
  { t: 'workflow', s: '[WORKFLOW 4] No-Show Re-Engagement' },
  { t: 'item',     s: 'Trigger: Appointment status = No Show' },
  { t: 'item',     s: 'Action: Move to “No Show” stage in pipeline' },
  { t: 'item',     s: 'Day 0 — Re-book SMS' },
  { t: 'item',     s: 'Day 1 — Re-book email' },
  { t: 'item',     s: 'Day 3 — Final follow-up SMS' },
  { t: 'item',     s: 'After 3 attempts: tag “Cold Lead” → move to long-term nurture' },
  { t: 'workflow', s: '[WORKFLOW 5] Proposal & Post-Estimate Follow-Up' },
  { t: 'item',     s: 'Trigger: Stage moved to “Proposal Sent”' },
  { t: 'item',     s: 'Day 0 — Send proposal email + set rep task (follow up in 48hrs)' },
  { t: 'item',     s: 'Day 2 — Follow-up SMS' },
  { t: 'item',     s: 'Day 5 — Follow-up email with social proof or FAQ' },
  { t: 'item',     s: 'Day 10 — Final SMS before marking cold' },
  { t: 'item',     s: 'Won: trigger onboarding workflow' },
  { t: 'item',     s: 'Lost: tag “Lost” → enter re-engagement sequence' },
  { t: 'workflow', s: '[WORKFLOW 6] Won / Onboarding' },
  { t: 'item',     s: 'Trigger: Stage moved to “Won”' },
  { t: 'item',     s: 'Action: Send welcome email with next steps' },
  { t: 'item',     s: 'Action: Move to Fulfillment Pipeline' },
  { t: 'item',     s: 'Action: Assign onboarding task to team member' },
  { t: 'item',     s: 'Action: Schedule onboarding call (calendar link in email)' },
  { t: 'workflow', s: '[WORKFLOW 7] Long-Term Nurture & Referral' },
  { t: 'item',     s: 'Trigger: Stage = Completed / Active client tag' },
  { t: 'item',     s: 'Monthly value email (tips, updates, offers)' },
  { t: 'item',     s: '90-day referral request SMS' },
  { t: 'item',     s: 'Referral received: tag “Referral” → enter lead workflow automatically' },
  { t: 'item',     s: 'Annual check-in for past clients' },
  { t: 'workflow', s: '[WORKFLOW 8] Review Request' },
  { t: 'item',     s: 'Trigger: Service completed tag or fulfillment stage = Completed' },
  { t: 'item',     s: 'Day 0 — Review request SMS (Google or Facebook link)' },
  { t: 'item',     s: 'Day 2 — Follow-up email if no review yet' },
  { t: 'item',     s: 'Positive review: thank you SMS' },
  { t: 'item',     s: 'Negative review: internal alert to manager immediately' },

  { t: 'phase',    s: 'PHASE 5 — AI Assistant Setup' },
  { t: 'item',     s: 'Identify where AI fits: lead response, FAQ handling, appointment booking' },
  { t: 'item',     s: 'Build AI conversation flow (greeting → qualify → book or route)' },
  { t: 'item',     s: "Set fallback: if AI can't handle → escalate to live rep" },
  { t: 'item',     s: 'Test AI responses with real-scenario inputs' },
  { t: 'item',     s: 'Set business hours trigger (AI on after hours only, if preferred)' },

  { t: 'phase',    s: 'PHASE 6 — Integrations' },
  { t: 'item',     s: 'Facebook Lead Ads → map fields → confirm lead enters workflow' },
  { t: 'item',     s: 'Google Business Profile → review management connected' },
  { t: 'item',     s: 'Stripe → payment forms and invoices set up → test $1 transaction' },
  { t: 'item',     s: 'Conversion tracking → Pixel or GTM installed on funnel pages' },
  { t: 'item',     s: 'Zapier / Make → any non-native tool connections built and tested' },

  { t: 'phase',    s: 'PHASE 7 — Testing & QA' },
  { t: 'item',     s: 'Submit test lead → confirm contact created, workflow fires, rep notified' },
  { t: 'item',     s: 'Check email deliverability (Gmail + Outlook — inbox, not spam)' },
  { t: 'item',     s: 'Check SMS delivery and formatting' },
  { t: 'item',     s: 'Walk through all pipeline stages manually' },
  { t: 'item',     s: 'Book test appointment → confirm all reminders fire on schedule' },
  { t: 'item',     s: 'Trigger no-show → confirm re-booking sequence fires' },
  { t: 'item',     s: 'Trigger proposal sent → confirm follow-up sequence fires' },
  { t: 'item',     s: 'Move to Won → confirm onboarding workflow fires' },
  { t: 'item',     s: 'Test AI assistant with live inputs' },
  { t: 'item',     s: 'Confirm all workflows are Published (not Draft)' },
  { t: 'item',     s: 'Clean out all test contacts and dummy data' },
  { t: 'item',     s: 'Final pipeline check — $0, no junk data' },

  { t: 'phase',    s: 'PHASE 8 — Client Handoff' },
  { t: 'item',     s: 'Record Loom walkthrough: conversations, pipeline, calendar, contacts' },
  { t: 'item',     s: 'Write SOP: daily lead handling process for the team' },
  { t: 'item',     s: 'Document all workflows (trigger → what happens → stop condition)' },
  { t: 'item',     s: 'Schedule 60–90 min live handoff call' },
  { t: 'item',     s: 'Train team on: daily tasks, pipeline management, responding to leads' },
  { t: 'item',     s: 'Confirm client has Admin access' },
  { t: 'item',     s: 'Remove any builder/test user accounts' },
  { t: 'item',     s: 'Schedule 30-day post-launch check-in' },
];

// ── PDF setup ─────────────────────────────────────────────────────────────────
const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: MARGIN, bottom: MARGIN + 20, left: MARGIN, right: MARGIN },
  autoFirstPage: false,
  bufferPages: true,
  info: {
    Title:   'GoHighLevel Full System Build Checklist',
    Author:  'Plug-and-Play Client Delivery',
    Subject: 'Complete GHL Build Guide',
  },
});

const stream = fs.createWriteStream(OUTPUT);
doc.pipe(stream);

// ── State ─────────────────────────────────────────────────────────────────────
let pageNum = 0;
let y = MARGIN;

// ── Page helpers ──────────────────────────────────────────────────────────────
function stampPageNumber() {
  // page numbers removed
}

function startPage() {
  pageNum++;
  doc.addPage();
  y = MARGIN;
}

function ensureSpace(needed) {
  if (y + needed > BOTTOM_BOUND) {
    stampPageNumber();
    startPage();
  }
}

// ── Measure item height ───────────────────────────────────────────────────────
function itemHeight(text) {
  doc.font(F_REG).fontSize(SZ_ITEM);
  return doc.heightOfString(text, { width: ITEM_W });
}

// ── First page ────────────────────────────────────────────────────────────────
startPage();

// Title
doc.font(F_BOLD).fontSize(SZ_TITLE).fillColor(COLOR_BLACK)
   .text('GoHighLevel Full System Build Checklist', MARGIN, y, {
     width: CONTENT_W, align: 'left',
   });
y += doc.heightOfString('GoHighLevel Full System Build Checklist',
       { width: CONTENT_W }) + 5;

// Subtitle
doc.font(F_REG).fontSize(SZ_SUBTITLE).fillColor(COLOR_GRAY)
   .text('Plug-and-Play Client Delivery — Complete Build Guide', MARGIN, y, {
     width: CONTENT_W, align: 'left',
   });
y += SZ_SUBTITLE + 3;

// Rule
doc.moveTo(MARGIN, y + 5)
   .lineTo(MARGIN + CONTENT_W, y + 5)
   .lineWidth(0.6).strokeColor(COLOR_RULE).stroke();
y += 18;

// ── Render all content ────────────────────────────────────────────────────────
for (const entry of CONTENT) {

  if (entry.t === 'phase') {
    // Phase bar: always ensure at least ~50 pts below it for first section
    ensureSpace(28 + GAP_PHASE_BELOW + 30);
    // Gray background bar
    doc.rect(MARGIN, y, CONTENT_W, 15).fill(COLOR_PHASE_BG);
    doc.font(F_BOLD).fontSize(SZ_PHASE).fillColor(COLOR_BLACK)
       .text(entry.s, MARGIN + 6, y + 2.5, {
         width: CONTENT_W - 12, lineBreak: false,
       });
    y += 15 + GAP_PHASE_BELOW;

  } else if (entry.t === 'section') {
    ensureSpace(GAP_SECTION_ABOVE + SZ_SECTION + GAP_SECTION_BELOW + itemHeight('A'));
    y += GAP_SECTION_ABOVE;
    doc.font(F_BOLD).fontSize(SZ_SECTION).fillColor(COLOR_BLACK)
       .text(entry.s, MARGIN, y, { width: CONTENT_W });
    y += SZ_SECTION + 1 + GAP_SECTION_BELOW;

  } else if (entry.t === 'workflow') {
    ensureSpace(GAP_WORKFLOW_ABOVE + SZ_WORKFLOW + GAP_WORKFLOW_BELOW + itemHeight('A'));
    y += GAP_WORKFLOW_ABOVE;
    doc.font(F_BOLD).fontSize(SZ_WORKFLOW).fillColor(COLOR_BLACK)
       .text(entry.s, MARGIN + 4, y, { width: CONTENT_W - 4 });
    y += SZ_WORKFLOW + 1 + GAP_WORKFLOW_BELOW;

  } else if (entry.t === 'item') {
    const textH = itemHeight(entry.s);
    ensureSpace(textH + GAP_ITEM_BELOW);

    // Draw checkbox — vertically centered with cap-height of first text line
    const cbTop = y + (SZ_ITEM * 0.2);
    doc.rect(MARGIN, cbTop, CB_SIZE, CB_SIZE)
       .lineWidth(0.7).strokeColor(COLOR_BLACK).stroke();

    // Item text
    doc.font(F_REG).fontSize(SZ_ITEM).fillColor(COLOR_BLACK)
       .text(entry.s, ITEM_X, y, { width: ITEM_W, lineGap: 1.2 });

    y += textH + GAP_ITEM_BELOW;
  }
}

// Stamp last page number
stampPageNumber();

doc.end();

stream.on('finish', () => console.log('PDF saved: ' + OUTPUT));
stream.on('error', (err) => { console.error(err); process.exit(1); });

const PDFDocument = require('pdfkit');
const fs = require('fs');

const OUT = 'C:\\Users\\R Y Z E N\\OneDrive\\Desktop\\Claude Code\\GHL_Build_Checklist_v2.pdf';

const PAGE_W = 8.5 * 72;
const PAGE_H = 11 * 72;
const ML = 45;
const MR = 45;
const MT = 45;
const MB = 45;
const CW = PAGE_W - ML - MR;
const BOTTOM = PAGE_H - MB;

const CB = 6.5;
const GAP = 5;
const IX = ML + CB + GAP;
const IW = CW - CB - GAP;

const doc = new PDFDocument({ size: 'LETTER', autoFirstPage: true, margin: 0 });
doc.pipe(fs.createWriteStream(OUT));

let y = MT;

function newPage() {
  doc.addPage({ size: 'LETTER', margin: 0 });
  y = MT;
}

function need(h) {
  if (y + h > BOTTOM) newPage();
}

function phase(text) {
  need(17 + 16);
  y += 5;
  doc.rect(ML, y, CW, 17).fill('#E0E0E0');
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#000000')
     .text(text, ML + 6, y + 4, { width: CW - 10, lineBreak: false });
  y += 17 + 4;
}

function goal(text) {
  need(14);
  doc.font('Helvetica-Oblique').fontSize(8).fillColor('#444444')
     .text('Goal: ' + text, ML, y, { width: CW });
  y += 11 + 3;
}

function section(text) {
  need(14 + 12);
  y += 5;
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#111111')
     .text(text, ML, y, { width: CW });
  y += 11 + 2;
}

function workflow(text) {
  need(14 + 12);
  y += 4;
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#333333')
     .text(text, ML + 2, y, { width: CW - 2 });
  y += 10 + 2;
}

function item(text) {
  doc.font('Helvetica').fontSize(8.5);
  const h = doc.heightOfString(text, { width: IW, lineGap: 1 });
  need(h + 3);
  const cbY = y + (8.5 * 0.15);
  doc.rect(ML, cbY, CB, CB).lineWidth(0.6).strokeColor('#000').stroke();
  doc.font('Helvetica').fontSize(8.5).fillColor('#000000')
     .text(text, IX, y, { width: IW, lineGap: 1 });
  y += h + 2.5;
}

// ── TITLE ──────────────────────────────────────────────────────────────────────
doc.font('Helvetica-Bold').fontSize(17).fillColor('#000000')
   .text('GoHighLevel Full System Build Checklist', ML, y, { width: CW });
y += 22;
doc.moveTo(ML, y + 2).lineTo(ML + CW, y + 2).lineWidth(0.5).strokeColor('#BBBBBB').stroke();
y += 12;

// ── PHASE 0 ────────────────────────────────────────────────────────────────────
phase('PHASE 0 — Discovery & System Mapping');
goal('Understand the client\'s business before touching GHL — build the right system, not just a system.');
item('Join discovery call with boss and client');
item('Document client\'s current sales process (how leads come in, how they close)');
item('Identify all lead sources (Facebook ads, referrals, website, walk-ins, etc.)');
item('Map out client\'s exact pipeline stages in their own words');
item('Identify who\'s on the client\'s team and their roles');
item('Confirm what tools the client currently uses (CRM, calendar, email, payments)');
item('Identify where leads are currently falling through the cracks');
item('Confirm the client\'s offer and how they book appointments');
item('Document what "done" looks like — what the client should be able to do when they log in');
item('Build a simple system map (phases, workflows, integrations) before building anything');

// ── PHASE 1 ────────────────────────────────────────────────────────────────────
phase('PHASE 1 — Account Foundation');
goal('Get the account set up clean and ready to build on — no loose ends.');

section('Account & Branding');
item('Configure business name, logo, address, timezone, currency');
item('Set business hours (drives calendar and workflow logic)');
item('Secure admin credentials and document access info');

section('Phone System');
item('Purchase local number via LC Phone');
item('Configure inbound call routing (owner / team / voicemail)');
item('Upload professional voicemail drop recording');
item('Enable missed-call text-back (within 60 seconds)');
item('Set up call recording (confirm legal compliance with client)');
item('Complete A2P 10DLC SMS registration');
item('Test inbound + outbound call and SMS');

section('Email Setup');
item('Verify custom sending domain (SPF / DKIM / DMARC)');
item('Set reply-to email address');
item('Test email — confirm lands in inbox, not spam');
item('Add CAN-SPAM unsubscribe footer');

section('Team & Permissions');
item('Create user accounts for all team members');
item('Assign roles and permissions per user');
item('Set lead routing rules (assigned owner or round-robin)');
item('Configure notification preferences per user');

// ── PHASE 2 ────────────────────────────────────────────────────────────────────
phase('PHASE 2 — CRM & Pipeline Build');
goal('Build a CRM that mirrors how this client actually sells — not a generic template.');

section('Custom Fields');
item('Create contact-level custom fields based on discovery notes (lead source, service interest, budget, referral name, etc.)');
item('Create opportunity-level custom fields (deal value, proposal status, close date)');
item('Group fields logically so the contact view is clean');

section('Pipelines');
item('Build Sales Pipeline with stages from discovery call (use client\'s own language for stage names)');
item('Build Fulfillment Pipeline (separate): Onboarding → Active → Completed → Referral Requested');
item('Set probability % per stage for reporting accuracy');
item('Test moving a contact through every stage manually');

section('Contact Import & Tagging');
item('Clean CSV first — remove duplicates, fix formatting');
item('Import existing contact list and map fields to GHL contact fields');
item('Apply tags on import: lead source, status, lifecycle stage');
item('Build smart lists: New Leads, Active Clients, Cold Leads, No Shows, Referrals');

// ── PHASE 3 ────────────────────────────────────────────────────────────────────
phase('PHASE 3 — Funnel & Lead Capture');
goal('Every lead that comes in should land in GHL automatically — no manual entry.');

section('Funnel Build');
item('Build landing page with offer and lead capture form');
item('Connect custom domain (verify DNS propagation)');
item('Mobile-optimize all pages');
item('Set up thank you page with clear next step (book a call, check email, etc.)');

section('Lead Form');
item('Build form: name, phone, email, service interest, how they heard about us');
item('Map all form fields to GHL contact fields');
item('Set form submission to trigger the New Lead Handler workflow');
item('Test form on mobile and desktop — confirm contact created and workflow fires');

// ── PHASE 4 ────────────────────────────────────────────────────────────────────
phase('PHASE 4 — Modular Workflow Build');
goal('Every workflow does one job. Clean, labeled, and independently testable.');

workflow('[WORKFLOW 1] New Lead Handler');
item('Trigger: Form submission or manual lead entry');
item('Assign contact to owner + tag: "New Lead" + lead source');
item('Add to Sales Pipeline → Stage: Lead In');
item('Send internal notification to rep (SMS + email)');
item('Enroll in Nurture Sequence');

workflow('[WORKFLOW 2] Lead Nurture Sequence');
item('Day 0 — Immediate confirmation SMS + email');
item('Day 1 — Value email (case study / FAQ / testimonial)');
item('Day 3 — Follow-up SMS');
item('Day 7 — Email with offer or urgency');
item('Day 14 — SMS check-in');
item('Day 30+ — Monthly long-term nurture');
item('STOP condition: booked, replied, or opted out');

workflow('[WORKFLOW 3] Appointment Booking & Reminders');
item('Trigger: Appointment booked via calendar');
item('Confirmation: immediate SMS + email');
item('Reminder: 24 hours before (SMS + email)');
item('Reminder: 1 hour before (SMS only)');
item('Post-appointment: follow-up SMS + next step prompt');

workflow('[WORKFLOW 4] No-Show Re-Engagement');
item('Trigger: Appointment status = No Show');
item('Move contact to "No Show" pipeline stage');
item('Day 0 — Re-book SMS');
item('Day 1 — Re-book email');
item('Day 3 — Final follow-up SMS');
item('After 3 attempts: tag "Cold Lead" → enroll in long-term nurture');

workflow('[WORKFLOW 5] Proposal & Post-Estimate Follow-Up');
item('Trigger: Pipeline stage moved to "Proposal Sent"');
item('Day 0 — Send proposal email + create rep task (follow up in 48hrs)');
item('Day 2 — Follow-up SMS');
item('Day 5 — Follow-up email with social proof or FAQ');
item('Day 10 — Final SMS before marking cold');
item('If Won → trigger Onboarding workflow');
item('If Lost → tag "Lost" + enroll in 30-day re-engagement');

workflow('[WORKFLOW 6] Won / Onboarding');
item('Trigger: Pipeline stage moved to "Won"');
item('Send welcome email with next steps');
item('Move to Fulfillment Pipeline');
item('Assign onboarding task to team member');
item('Send calendar link to schedule onboarding call');

workflow('[WORKFLOW 7] Long-Term Nurture & Referral');
item('Trigger: Fulfillment stage = Completed');
item('Monthly value email (tips, updates, offers)');
item('90-day referral request SMS');
item('If referral comes in: tag "Referral" → enroll in New Lead Handler');
item('Annual check-in for past clients');

workflow('[WORKFLOW 8] Review Request');
item('Trigger: Service completed tag or fulfillment stage = Completed');
item('Day 0 — Review request SMS (Google or Facebook link)');
item('Day 2 — Follow-up email if no review yet');
item('Positive review: send thank you SMS');
item('Negative review: internal alert to manager immediately');

// ── PHASE 5 ────────────────────────────────────────────────────────────────────
phase('PHASE 5 — AI Assistant Setup');
goal('Let AI handle first response and basic qualification — free up the team for real conversations.');
item('Identify where AI fits based on client\'s volume and team size');
item('Build AI conversation flow: greeting → qualify → book or route to rep');
item('Set fallback: if AI can\'t handle it → escalate to live rep immediately');
item('Set business hours trigger (AI active after hours only, if preferred)');
item('Test AI with 5+ real-scenario inputs before going live');

// ── PHASE 6 ────────────────────────────────────────────────────────────────────
phase('PHASE 6 — Integrations');
goal('Connect every lead source — no lead should ever be entered manually.');
item('Facebook Lead Ads → map fields → confirm lead enters workflow automatically');
item('Google Business Profile → review management connected');
item('Stripe → build payment/invoice forms → test $1 transaction → confirm post-purchase workflow fires');
item('Conversion tracking → Pixel or GTM on all funnel pages');
item('Zapier / Make → build and test any non-native connections → document all Zaps');

// ── PHASE 7 ────────────────────────────────────────────────────────────────────
phase('PHASE 7 — Testing & QA');
goal('The client should never find a bug — you find it first.');
item('Submit test lead → confirm contact created, fields populated, workflow fires, rep notified');
item('Test email deliverability — Gmail AND Outlook (inbox, not spam)');
item('Test SMS delivery and formatting');
item('Walk through all pipeline stages — confirm automations fire at each stage');
item('Book test appointment → confirm confirmation + all reminders send on schedule');
item('Trigger no-show → confirm re-booking sequence fires');
item('Move to Proposal Sent → confirm follow-up sequence fires');
item('Move to Won → confirm onboarding workflow fires');
item('Test AI assistant with real scenario inputs');
item('Confirm all workflows are Published (not Draft)');
item('Confirm all workflow names are clean and properly labeled');
item('Clean all test contacts and dummy data from the system');
item('Final pipeline check — $0 value, no junk opportunities');
item('Check smart lists — confirm pulling accurate data');
item('Check contact view — confirm custom fields visible and populated correctly');

// ── PHASE 8 ────────────────────────────────────────────────────────────────────
phase('PHASE 8 — Client Handoff');
goal('Client logs in and knows exactly what they have, how it works, and what to do daily.');
item('Record Loom walkthrough: conversations, pipeline, calendar, contacts, workflows');
item('Write daily SOP: how to handle a new lead from notification to booked appointment');
item('Document all 8 workflows (trigger → what happens → stop condition)');
item('Schedule 60–90 min live handoff call');
item('Walk client and team through every part of the system');
item('Cover what NOT to touch (workflow triggers, integration settings, custom fields)');
item('Confirm client has Admin access');
item('Remove all builder/test user accounts');
item('Schedule 30-day post-launch check-in call');

doc.end();
console.log('Done: ' + OUT);

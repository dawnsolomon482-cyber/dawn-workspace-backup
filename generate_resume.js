'use strict';

const PDFDocument = require('pdfkit');
const fs = require('fs');

const OUTPUT = 'C:\\Users\\R Y Z E N\\OneDrive\\Desktop\\Claude Code\\Dawn_Solomon_Resume.pdf';

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  navy:      '#1A2B4A',
  teal:      '#0D8A8A',
  tealMid:   '#0A6F6F',
  tealLight: '#E4F4F4',
  white:     '#FFFFFF',
  offWhite:  '#F5F7FA',
  gray:      '#505A6A',
  lightGray: '#EAEEF3',
  text:      '#1C2333',
  sideText:  '#C0D4DC',
  sideFaint: '#A8C0C0',
};

const PAGE_W  = 595.28;
const PAGE_H  = 841.89;
const SIDE_W  = 188;   // left sidebar width
const RX      = SIDE_W + 22;   // right content start X
const RW      = PAGE_W - RX - 22; // right content width
const LX      = 16;   // left content start X
const LW      = SIDE_W - LX - 8; // left content width

// ── Document setup ─────────────────────────────────────────────────────────
const stream = fs.createWriteStream(OUTPUT);
const doc = new PDFDocument({
  size: [PAGE_W, PAGE_H],
  autoFirstPage: false,
  bufferPages: false,
  info: {
    Title:    'Dawn Solomon – GoHighLevel Automation Specialist',
    Author:   'Dawn Solomon',
    Subject:  'Professional Resume',
    Keywords: 'GoHighLevel GHL Automation CRM AI Zapier Make.com',
  },
});

doc.pipe(stream);
doc.addPage({ size: [PAGE_W, PAGE_H], margin: 0 });

// ── Backgrounds ────────────────────────────────────────────────────────────
// Full sidebar
doc.rect(0, 0, SIDE_W, PAGE_H).fill(C.navy);
// Header band (overrides both cols)
const HDR_H = 140;
doc.rect(0, 0, PAGE_W, HDR_H).fill(C.navy);
// Teal divider under header
doc.rect(0, HDR_H, PAGE_W, 3.5).fill(C.teal);

// ── Header text ────────────────────────────────────────────────────────────
doc.fillColor(C.white).font('Helvetica-Bold').fontSize(27)
   .text('DAWN SOLOMON', LX, 26, { lineBreak: false });

doc.moveDown(0.1);
doc.fillColor(C.teal).font('Helvetica').fontSize(10.5)
   .text('GoHighLevel Automation Specialist  ·  AI & Business Automation',
         LX, 62, { width: PAGE_W - LX - 20, lineBreak: false });

// thin rule
doc.rect(LX, 79, PAGE_W - LX - 20, 0.75).fill('#2B4870');

// contact info
doc.fillColor(C.sideFaint).font('Helvetica').fontSize(8.5);
const contactY = 89;
doc.text('dawnsolomon482@gmail.com', LX, contactY, { lineBreak: false });
doc.fillColor('#3E6080').text('  |  ', LX + 160, contactY, { lineBreak: false });
doc.fillColor(C.sideFaint).text('Laguna, Philippines', LX + 180, contactY, { lineBreak: false });
doc.fillColor('#3E6080').text('  |  ', LX + 280, contactY, { lineBreak: false });
doc.fillColor(C.sideFaint).text('dawnsolomon-automation.lovable.app', LX + 300, contactY, { lineBreak: false });

// ── Helpers ────────────────────────────────────────────────────────────────
function lHead(y, label) {
  doc.fillColor(C.teal).font('Helvetica-Bold').fontSize(7.5)
     .text(label.toUpperCase(), LX, y, { width: LW, characterSpacing: 0.9, lineBreak: false });
  y += 13;
  doc.rect(LX, y, LW, 0.8).fill(C.tealMid);
  return y + 6;
}

function lBullet(y, text) {
  const textW = LW - 9;
  doc.fillColor(C.teal).font('Helvetica-Bold').fontSize(8)
     .text('▸', LX, y + 0.5, { lineBreak: false });
  doc.fillColor(C.sideText).font('Helvetica').fontSize(8)
     .text(text, LX + 9, y, { width: textW });
  const h = doc.heightOfString(text, { width: textW });
  return y + Math.max(h, 10) + 3;
}

function rHead(y, label) {
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(9.5)
     .text(label.toUpperCase(), RX, y, { width: RW, characterSpacing: 0.5, lineBreak: false });
  y += 14;
  doc.rect(RX, y, RW, 1.5).fill(C.teal);
  return y + 8;
}

// ── LEFT SIDEBAR ───────────────────────────────────────────────────────────
let LY = HDR_H + 14;

LY = lHead(LY, 'GHL Expertise');
[
  'CRM Setup & Configuration',
  'Pipeline Management',
  'Funnels & Landing Pages',
  'Workflow Automations',
  'Snapshots & Templates',
  'Calendar & Booking Systems',
  'Trigger & Action Sequences',
  'Lead Nurturing Campaigns',
].forEach(s => { LY = lBullet(LY, s); });

LY += 9;
LY = lHead(LY, 'Automation & AI');
[
  'AI-Powered Integrations',
  'Multi-Platform Orchestration',
  'Lead-to-Booking Funnels',
].forEach(s => { LY = lBullet(LY, s); });

LY += 9;
LY = lHead(LY, 'SEO & Web');
[
  'Technical SEO Audits',
  'WordPress Optimization',
  'AI Visibility / GEO',
  'Site Performance Tuning',
].forEach(s => { LY = lBullet(LY, s); });

LY += 9;
LY = lHead(LY, 'Tools & Stack');

const toolDefs = [
  { label: 'GoHighLevel (GHL)', hi: true },
  { label: 'Make.com (Integromat)', hi: false },
  { label: 'Zapier', hi: false },
  { label: 'n8n', hi: false },
  { label: 'WordPress', hi: false },
  { label: 'ChatGPT / AI Tools', hi: false },
  { label: 'Claude Code', hi: false },
];
toolDefs.forEach(({ label, hi }) => {
  const bg  = hi ? C.teal : '#1E3558';
  const fg  = hi ? C.white : '#8AAEC0';
  const fnt = hi ? 'Helvetica-Bold' : 'Helvetica';
  doc.roundedRect(LX, LY, LW, 14, 3).fill(bg);
  doc.fillColor(fg).font(fnt).fontSize(7.5)
     .text(label, LX + 7, LY + 3.5, { width: LW - 14, lineBreak: false });
  LY += 18;
});

LY += 8;
LY = lHead(LY, 'Services Offered');
[
  ['01', 'AI Automation Engineering'],
  ['02', 'WordPress & SEO Optimization'],
  ['03', 'AI Visibility (GEO)'],
].forEach(([num, name]) => {
  doc.fillColor(C.teal).font('Helvetica-Bold').fontSize(8)
     .text(num, LX, LY, { lineBreak: false });
  doc.fillColor(C.sideText).font('Helvetica').fontSize(8)
     .text(name, LX + 20, LY, { width: LW - 20, lineBreak: false });
  LY += 15;
});

LY += 10;
// Vision box
doc.roundedRect(LX - 2, LY, LW + 4, 72, 5).fill('#0C1E38');
doc.fillColor(C.teal).font('Helvetica-Bold').fontSize(7.5)
   .text('VISION', LX + 4, LY + 8, { width: LW - 8, lineBreak: false });
doc.fillColor('#8AB4C4').font('Helvetica').fontSize(7.5)
   .text(
     '"A world where founders and creatives focus purely on creation while automated systems handle 80% of repetitive admin work."',
     LX + 4, LY + 22,
     { width: LW - 4, lineGap: 2 }
   );

// ── RIGHT COLUMN ───────────────────────────────────────────────────────────
let RY = HDR_H + 14;

// Summary
RY = rHead(RY, 'Professional Summary');
const summary =
  'Automation Engineer specializing in GoHighLevel (GHL) CRM, AI workflows, and business systems. ' +
  'Designs smart, reliable automation solutions using GoHighLevel, Zapier, Make.com, and n8n — ' +
  'seamlessly connecting marketing, CRM, and operations. Also skilled in Technical SEO and WordPress ' +
  'optimization. Helps business owners build self-running systems that multiply time, productivity, and revenue.';
doc.fillColor(C.gray).font('Helvetica').fontSize(9)
   .text(summary, RX, RY, { width: RW, align: 'justify', lineGap: 1.5 });
RY += doc.heightOfString(summary, { width: RW, lineGap: 1.5 }) + 14;

// Featured Projects
RY = rHead(RY, 'Featured Projects — GoHighLevel & Automation');

const projects = [
  {
    name: 'GHL HVAC Website',
    desc: 'Built and fully configured a GoHighLevel website for an HVAC business — funnels, CRM pipelines, booking automations, and triggers set up from scratch.',
    tags: ['Instant Setup', 'Zero Manual Follow-up'],
  },
  {
    name: 'Lead to Booking – HVAC 6PCS',
    desc: 'Automated lead-to-booking pipeline using GHL workflows, smart triggers, and calendar integrations for a 6-location HVAC operator.',
    tags: ['100% Booking Automation Rate'],
  },
  {
    name: '4-Quote Follow-Up Automation',
    desc: 'Designed a GHL follow-up sequence for quote leads across SMS, email, and voicemail — running 24/7 without human intervention.',
    tags: ['3× Conversion Improvement', '40+ Leads Handled', '24/7 Operation'],
  },
  {
    name: 'Fitness Brand Website',
    desc: 'Designed and built a fitness brand website with integrated lead capture, nurturing flows, and conversion-optimized landing pages.',
    tags: ['+67% Engagement', '+25% Conversions'],
  },
  {
    name: 'Auto Sort Gmail Attachments',
    desc: 'Built a Make.com automation that routes incoming Gmail attachments to the correct Google Drive folder — eliminating all manual file sorting.',
    tags: ['5 Min Saved / Document', '100% Accurate Sorting'],
  },
  {
    name: 'Mekpun Automation Dashboard',
    desc: 'Designed and deployed a centralized automation dashboard integrating multiple business workflows into a single always-on control layer.',
    tags: ['24/7 Uptime', 'Multi-System Orchestration'],
  },
];

projects.forEach((proj, idx) => {
  const textW = RW - 14;
  const descH = doc.heightOfString(proj.desc, { width: textW, fontSize: 8.5 });
  const cardH = 10 + 12 + 4 + descH + 8 + 15 + 8;

  const bg = idx % 2 === 0 ? C.offWhite : '#EDF1F7';
  doc.roundedRect(RX - 3, RY, RW + 6, cardH, 4).fill(bg);
  doc.rect(RX - 3, RY, 3, cardH).fill(C.teal);

  const numStr = String(idx + 1).padStart(2, '0');
  doc.fillColor(C.teal).font('Helvetica-Bold').fontSize(8)
     .text(numStr, RX + 6, RY + 9, { lineBreak: false });
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(9.5)
     .text(proj.name, RX + 22, RY + 8, { width: RW - 26, lineBreak: false });

  doc.fillColor(C.gray).font('Helvetica').fontSize(8.5)
     .text(proj.desc, RX + 6, RY + 24, { width: textW, lineGap: 1.5 });

  const tagY = RY + 24 + descH + 6;
  let tx = RX + 6;
  proj.tags.forEach(tagText => {
    const tw = doc.font('Helvetica-Bold').fontSize(7).widthOfString(tagText) + 14;
    doc.roundedRect(tx, tagY, tw, 13, 2.5).fill(C.teal);
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(7)
       .text(tagText, tx + 7, tagY + 3, { width: tw - 14, lineBreak: false });
    tx += tw + 6;
  });

  RY += cardH + 8;
});

// ── Footer ─────────────────────────────────────────────────────────────────
const FY = PAGE_H - 22;
doc.rect(0, FY, PAGE_W, 22).fill(C.navy);
doc.rect(0, FY, PAGE_W, 2).fill(C.teal);
doc.fillColor('#607A8A').font('Helvetica').fontSize(7.5)
   .text(
     'dawnsolomon482@gmail.com   ·   dawnsolomon-automation.lovable.app   ·   Laguna, Philippines',
     0, FY + 7,
     { width: PAGE_W, align: 'center', lineBreak: false }
   );

// ── End ────────────────────────────────────────────────────────────────────
stream.on('finish', () => {
  const stats = fs.statSync(OUTPUT);
  console.log(`PDF saved: ${OUTPUT}`);
  console.log(`File size: ${(stats.size / 1024).toFixed(1)} KB`);
});

doc.end();

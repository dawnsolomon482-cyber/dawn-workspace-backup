const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'docs', 'Review_Reactivation_System_Documentation.pdf');

const doc = new PDFDocument({ margin: 55, size: 'A4', bufferPages: true });
doc.pipe(fs.createWriteStream(outputPath));

const NAVY = '#0F094F';
const DARK = '#1A1A1A';
const GRAY = '#666666';
const LIGHT_GRAY = '#F4F4F4';
const BORDER = '#CCCCCC';
const BLUE_BG = '#EAF1F8';
const WHITE = '#FFFFFF';
const WARN_BG = '#FFF8E1';
const WARN_BORDER = '#F9A825';
const WARN_TEXT = '#B45309';
const PAGE_W = 595.28;
const MARGIN = 55;
const CONTENT_W = PAGE_W - MARGIN * 2;

function addFooter() {
  doc.fontSize(7.5).fillColor(GRAY).font('Helvetica')
    .text(
      'Review Reactivation System Documentation  |  Dawn Solomon, GHL Automation Specialist  |  May 2026',
      MARGIN, 810, { width: CONTENT_W, align: 'center' }
    );
}

function h1(text) {
  doc.moveDown(0.6);
  doc.fontSize(16).fillColor(NAVY).font('Helvetica-Bold').text(text);
  doc.moveTo(MARGIN, doc.y + 2).lineTo(MARGIN + CONTENT_W, doc.y + 2).strokeColor(NAVY).lineWidth(1).stroke();
  doc.moveDown(0.4);
}

function h2(text) {
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text(text);
  doc.moveDown(0.2);
}

function body(text) {
  doc.fontSize(10).fillColor(DARK).font('Helvetica').text(text);
}

function bullet(text) {
  doc.fontSize(10).fillColor(DARK).font('Helvetica').text(`•  ${text}`, { indent: 12 });
}

function drawTable(headers, rows, colWidths) {
  const startX = MARGIN;
  let y = doc.y + 4;
  const headerH = 22;

  // Header
  let x = startX;
  headers.forEach((h, i) => {
    doc.rect(x, y, colWidths[i], headerH).fillAndStroke(BLUE_BG, BORDER);
    doc.fontSize(9).fillColor(NAVY).font('Helvetica-Bold')
      .text(h, x + 6, y + 7, { width: colWidths[i] - 12, lineBreak: false });
    x += colWidths[i];
  });
  y += headerH;

  // Rows
  rows.forEach((row, ri) => {
    x = startX;
    const bg = ri % 2 === 0 ? WHITE : LIGHT_GRAY;

    // Estimate row height from longest cell
    let maxH = 18;
    row.forEach((cell, i) => {
      const est = Math.ceil(doc.widthOfString(cell) / (colWidths[i] - 12)) * 13;
      if (est > maxH) maxH = est;
    });
    const rowH = Math.max(18, maxH + 8);

    row.forEach((cell, i) => {
      doc.rect(x, y, colWidths[i], rowH).fillAndStroke(bg, BORDER);
      doc.fontSize(9).fillColor(DARK).font('Helvetica')
        .text(cell, x + 6, y + 5, { width: colWidths[i] - 12 });
      x += colWidths[i];
    });
    y += rowH;
  });

  doc.y = y + 10;
}

function codeBox(lines) {
  const lineH = 13;
  const padV = 8;
  const h = lines.length * lineH + padV * 2;
  const y = doc.y + 2;

  doc.rect(MARGIN, y, CONTENT_W, h).fillAndStroke(LIGHT_GRAY, BORDER);
  let ty = y + padV;
  lines.forEach(line => {
    doc.fontSize(8).fillColor(DARK).font('Courier')
      .text(line, MARGIN + 10, ty, { lineBreak: false });
    ty += lineH;
  });
  doc.y = y + h + 8;
}

function warnBox(lines) {
  const lineH = 14;
  const padV = 10;
  const h = lines.length * lineH + padV * 2 + 18;
  const y = doc.y + 4;

  doc.rect(MARGIN, y, CONTENT_W, h).fillAndStroke(WARN_BG, WARN_BORDER);
  doc.fontSize(10).fillColor(WARN_TEXT).font('Helvetica-Bold')
    .text('  IMPORTANT — Read Before Proceeding', MARGIN + 10, y + padV);
  let ty = y + padV + 18;
  lines.forEach(line => {
    doc.fontSize(9).fillColor(DARK).font('Helvetica')
      .text(`•  ${line}`, MARGIN + 15, ty, { width: CONTENT_W - 25 });
    ty += lineH;
  });
  doc.y = y + h + 8;
}

// ─── COVER PAGE ───────────────────────────────────────────────────────────────
doc.fontSize(9).fillColor(GRAY).font('Helvetica')
  .text('GHL AUTOMATION DOCUMENTATION', { align: 'center' });
doc.moveDown(3);
doc.fontSize(26).fillColor(NAVY).font('Helvetica-Bold')
  .text('Review Reactivation System', { align: 'center' });
doc.moveDown(0.4);
doc.fontSize(14).fillColor(GRAY).font('Helvetica')
  .text('System Documentation', { align: 'center' });
doc.moveDown(3);

const coverRows = [
  ['Prepared for', 'J-C Masithela'],
  ['Prepared by', 'Dawn Solomon, GHL Automation Specialist'],
  ['Date', 'May 12, 2026'],
  ['Status', 'Domain Warm-Up In Progress — Not Yet Live'],
];
drawTable(['Field', 'Detail'], coverRows, [160, CONTENT_W - 160]);

doc.moveDown(2);
doc.fontSize(9).fillColor(GRAY).font('Helvetica-Oblique')
  .text(
    'This document covers the full Review Reactivation system — pipeline stages, workflow logic, custom values, survey setup, and domain warm-up status. Do not publish the workflow or send to actual contacts until domain propagation is confirmed by GHL.',
    { align: 'center', width: CONTENT_W }
  );
addFooter();

// ─── PAGE 2 ───────────────────────────────────────────────────────────────────
doc.addPage();

h1('1. Overview');
body('The Review Reactivation System sends personalized email campaigns to past clients requesting a review. It uses a filtering system to route positive responses (4-5 stars) to Google Business Profile and negative responses (1-3 stars) to a private feedback form — preventing low-star reviews from appearing publicly on Google.');

h1('2. Full System Flow');
codeBox([
  '1. Contact is tagged "review reactivation"',
  '            |',
  '2. Workflow triggers automatically',
  '            |',
  '3. Contact moved to "Email Sent" stage in pipeline',
  '            |',
  '4. Personalized email sent (Nifty Images — customer name on whiteboard)',
  '            |',
  '5. Customer clicks link  -->  goes to Rating Survey page',
  '            |',
  '     1-3 stars (red/yellow)          4-5 stars (green)',
  '            |                                |',
  '6. Private feedback form shown      Google Business Profile opens',
  '            |                                |',
  '7. Moved to "Negative Feedback"     Moved to "Sent to Google" stage',
  '   pipeline stage                            |',
  '            |                       Auto-response sent when review posted',
  '8. Team notified of negative feedback',
]);

addFooter();

// ─── PAGE 3 ───────────────────────────────────────────────────────────────────
doc.addPage();

h1('3. Pipeline Stages — Reviews Reactivation');
drawTable(
  ['Stage', 'Description'],
  [
    ['To Contact', 'Fresh contacts not yet messaged'],
    ['Email Sent', 'Review request email has been sent to the contact'],
    ['Opened / No Response', 'Email opened but no action taken by the contact'],
    ['Responded', 'Contact clicked the rating link in the email'],
    ['Negative Feedback', '1-3 star rating — contact routed to private feedback form'],
    ['Sent to Google', '4-5 star rating — contact redirected to Google Business Profile'],
    ['Google Review Left', 'Contact successfully left a review on Google'],
    ['Auto-Response Sent', 'Automated reply sent to the posted Google review'],
  ],
  [185, CONTENT_W - 185]
);

h1('4. Workflow — Reviews Reactivation Campaign');
drawTable(
  ['Step', 'Action'],
  [
    ['Trigger', 'Contact Tag Added: "review reactivation"'],
    ['Step 1', 'Create/Update Opportunity → Move to "Email Sent" pipeline stage'],
    ['Step 2', 'Send Email: "We\'d love your feedback" with Nifty Images personalization'],
    ['Step 3', 'Wait: Trigger Link Clicked — Google Review Link (Timeout: 3 days)'],
    ['Step 4', 'If/Else branch based on survey star rating result'],
    ['Branch A — 4-5 stars', 'Move to "Sent to Google" stage → Send Google Review link'],
    ['Branch B — 1-3 stars', 'Move to "Negative Feedback" stage → Send private feedback form'],
    ['No Response (timeout)', 'Follow-up email sent after 3-day timeout expires'],
  ],
  [185, CONTENT_W - 185]
);

addFooter();

// ─── PAGE 4 ───────────────────────────────────────────────────────────────────
doc.addPage();

h1('5. Custom Values Used');
drawTable(
  ['Custom Value Name', 'GHL Key', 'Purpose'],
  [
    ['Google Review Link', '{{custom_values.google_review_link}}', 'Google Business Profile review URL'],
    ['Nifty Personalized Image', '{{custom_values.text_1_image_link}}', 'Personalized image — customer name on whiteboard'],
    ['Business Owner Name', '{{custom_values.business_owner_name}}', 'Used in email body copy'],
    ['Business Name', '{{custom_values.business_name}}', 'Used in email footer'],
    ['Email Sending Domain', '{{custom_values.9_email_sending_subdomain...}}', 'Warmed-up domain for email delivery'],
  ],
  [160, 185, CONTENT_W - 345]
);

h1('6. Rating Survey');
bullet('Location: Sites → Surveys → Review Rating Survey');
bullet('Question type: Star Rating (1 to 5 stars)');
bullet('Redirect logic based on rating:');
doc.fontSize(10).fillColor(DARK).font('Helvetica')
  .text('1-3 stars  →  Private feedback form (not sent to Google)', { indent: 28 });
doc.fontSize(10).fillColor(DARK).font('Helvetica')
  .text('4-5 stars  →  Google Business Profile review page', { indent: 28 });
doc.moveDown(0.3);
bullet('Survey link is the click target of the Nifty Images personalized image in the email');

h1('7. Email Template');
drawTable(
  ['Field', 'Value'],
  [
    ['Subject Line', '{{contact.first_name}}, we\'d love your feedback'],
    ['From Email', 'Warmed-up domain email (pending GHL propagation approval)'],
    ['Personalization', 'Nifty Images — customer first name displayed on whiteboard in image'],
    ['Call to Action', 'Customer clicks the Nifty image → redirected to Rating Survey'],
    ['Footer', '© {{right_now.year}} {{location.name}} — unsubscribe link included'],
  ],
  [160, CONTENT_W - 160]
);

addFooter();

// ─── PAGE 5 ───────────────────────────────────────────────────────────────────
doc.addPage();

h1('8. Domain Warm-Up Status');
drawTable(
  ['Item', 'Status'],
  [
    ['Warm-up workflow', 'Built and running'],
    ['Test emails', 'Active — sending to test addresses'],
    ['Domain propagation', 'Pending GHL approval'],
    ['Campaign launch', 'After domain is cleared by GHL'],
  ],
  [200, CONTENT_W - 200]
);

h1('9. How to Add Contacts to the Campaign');
body('To enroll a contact into the Review Reactivation campaign:');
doc.moveDown(0.3);
bullet('Go to Contacts in GHL');
bullet('Find the contact or import a new list via CSV');
bullet('Add the tag:  review reactivation');
bullet('The workflow triggers automatically — no additional manual steps needed');
doc.moveDown(0.3);
body('Note: During the warm-up phase, only add test contacts. Do not tag actual client contacts until domain propagation is confirmed.');

h1('10. Important Notes');
warnBox([
  'Do NOT publish the workflow until domain propagation is fully approved by GHL',
  'Do NOT send to actual client contacts during warm-up phase — test emails only',
  'The "06. Counting Review Requests in last 14 Days" workflow is DO NOT TOUCH',
  'All custom values are stored under the Google Review System folder in GHL',
  'The Nifty Images personalization requires the contact first name field to be populated',
]);

addFooter();

// ─── FLUSH ────────────────────────────────────────────────────────────────────
doc.flushPages();
doc.end();
console.log('PDF generated successfully:', outputPath);

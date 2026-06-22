const fs = require('fs');

const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/bookings/ai-free-strategy-consultation';

function buildEmail({ label, headline, subheadline, cardLabel, cardText, sectionTitle, sectionSubtitle, items, testimonial, ctaText }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body id="body" style="margin:0;padding:24px;background:#e8e8e8;font-family:'Segoe UI',Arial,sans-serif;">
<style>
  u + #body .cta-btn { color: #ffffff !important; text-decoration: none !important; }
  #MessageViewBody .cta-btn { color: #ffffff !important; text-decoration: none !important; }
  a.cta-btn { color: #ffffff !important; text-decoration: none !important; }
</style>
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
      <tr><td style="padding:20px 24px 0;">
        <p style="margin:0;font-size:16px;font-weight:800;color:#111;">Scalgent</p>
        <p style="margin:2px 0 0;font-size:12px;color:#999;">${label}</p>
      </td></tr>
      <tr><td style="padding:28px 24px 0;text-align:center;">
        <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111;">${headline}</p>
        <p style="margin:0 0 24px;font-size:13.5px;color:#666;line-height:1.5;">${subheadline}</p>
      </td></tr>
      <tr><td style="padding:0 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="background:#f7f7f7;border-radius:10px;padding:16px 18px;">
            <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.8px;">${cardLabel}</p>
            <p style="margin:0;font-size:14px;font-weight:700;color:#111;">${cardText}</p>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:0 24px 28px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td>
            <a href="${BOOKING_URL}" style="background-color:#111111;color:#ffffff;-webkit-text-fill-color:#ffffff;display:inline-block;padding:13px 24px;border-radius:8px;font-size:13px;font-weight:700;font-family:Arial,sans-serif;text-decoration:none;" target="_blank">${ctaText}</a>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:0 24px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
      <tr><td style="padding:22px 24px 4px;">
        <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#111;">${sectionTitle}</p>
        <p style="margin:0 0 16px;font-size:12px;color:#4caf50;font-weight:600;">${sectionSubtitle}</p>
      </td></tr>
      <tr><td style="padding:0 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${items.map((item, i) => `
          <tr><td style="padding:0 0 ${i < items.length-1 ? '14' : '6'}px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:top;width:38px;padding-top:2px;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td width="26" height="26" style="width:26px;height:26px;background:#111;border-radius:50%;text-align:center;font-size:12px;font-weight:700;color:#fff;line-height:26px;font-family:Arial,sans-serif;">${i+1}</td>
                </tr></table>
              </td>
              <td style="vertical-align:top;padding-top:4px;">
                <span style="font-size:13.5px;color:#111;font-weight:600;">${item.bold}</span>
                <span style="color:#888;font-size:13px;"> - ${item.desc}</span>
              </td>
            </tr></table>
          </td></tr>`).join('')}
        </table>
      </td></tr>
      <tr><td style="padding:0 24px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:16px 18px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.8px;">Word of the Day</p>
            <p style="margin:0 0 8px;font-size:13px;color:#555;line-height:1.6;font-style:italic;">"${testimonial.text}"</p>
            <p style="margin:0;font-size:12px;font-weight:700;color:#111;">— ${testimonial.ref}</p>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:0 24px 24px;">
        <hr style="border:none;border-top:1px solid #eee;margin:0 0 16px;">
        <p style="margin:0 0 2px;font-size:13px;color:#333;font-weight:600;">Kier Siquete</p>
        <p style="margin:0 0 12px;font-size:12px;color:#999;">Founder, Scalgent | scalgent.com</p>
        <p style="margin:0;font-size:11px;color:#bbb;line-height:1.6;">
          You are receiving this because you were identified as an HVAC business owner.<br>
          <a href="{{unsubscribe_link}}" style="color:#bbb;">Unsubscribe</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const emails = [
  {
    file: '01-day0.html',
    subject: "You're probably losing 5+ jobs a week without knowing it, {{contact.first_name}}",
    label: 'Revenue Tip - Day 1',
    headline: "You're losing jobs, {{contact.first_name}}.",
    subheadline: "Here's why - and what to do about it.",
    cardLabel: 'The Problem',
    cardText: 'Most HVAC businesses lose 5+ jobs weekly without ever knowing it happened.',
    ctaText: 'Join Meeting',
    sectionTitle: 'Why This Happens',
    sectionSubtitle: 'The 4 silent revenue killers in HVAC businesses',
    items: [
      { bold: 'Missed calls with no callback system', desc: 'leads go cold within minutes' },
      { bold: 'Slow response times', desc: '24+ hours to reply kills the deal' },
      { bold: 'No structured follow-up', desc: 'estimates sent, never followed through' },
      { bold: 'Zero review automation', desc: 'jobs done, reputation stays flat' }
    ],
    testimonial: { text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.', ref: 'Jeremiah 29:11' }
  },
  {
    file: '02-day1.html',
    subject: "The #1 reason HVAC companies miss revenue (it's not what you think), {{contact.first_name}}",
    label: 'Revenue Insight - Day 2',
    headline: "The #1 revenue leak in HVAC businesses.",
    subheadline: "It's not your pricing. It's not your team.",
    cardLabel: 'Root Cause',
    cardText: "It's your response time. 78% of customers go with the first business that responds - not the best one.",
    ctaText: 'See How We Fix It',
    sectionTitle: 'What Speed Means in HVAC',
    sectionSubtitle: 'Why the first response wins the job',
    items: [
      { bold: '5 minutes or less', desc: 'response time = 9x more likely to close' },
      { bold: 'After 30 minutes', desc: 'your lead has already called 2-3 competitors' },
      { bold: 'Automated follow-up', desc: 'responds instantly even when you are on the job' },
      { bold: 'Consistent messaging', desc: 'every lead gets the same quality response' }
    ],
    testimonial: { text: 'My people are destroyed for lack of knowledge.', ref: 'Hosea 4:6' }
  },
  {
    file: '03-day2.html',
    subject: "What happens when a lead doesn't hear back in 5 minutes, {{contact.first_name}}",
    label: 'Revenue Insight - Day 3',
    headline: "5 minutes. That's all you have.",
    subheadline: "After that, your lead is already talking to someone else.",
    cardLabel: 'The Reality',
    cardText: 'A lead that fills out a form at 9 PM needs a response. If your competitor responds and you do not - that is their job now.',
    ctaText: 'Join Meeting',
    sectionTitle: 'What Happens After a Lead Submits',
    sectionSubtitle: 'The timeline that decides who gets the job',
    items: [
      { bold: '0-5 minutes', desc: 'lead is still engaged and waiting' },
      { bold: '5-30 minutes', desc: 'lead starts looking at other options' },
      { bold: '30 min - 2 hours', desc: 'lead has already called a competitor' },
      { bold: 'After 24 hours', desc: 'job is gone - 100% of the time' }
    ],
    testimonial: { text: 'Whatever your hand finds to do, do it with all your might.', ref: 'Ecclesiastes 9:10' }
  },
  {
    file: '04-day3.html',
    subject: "How many calls went unanswered this week, {{contact.first_name}}?",
    label: 'Revenue Check - Day 4',
    headline: "How many calls went unanswered this week, {{contact.first_name}}?",
    subheadline: "Be honest. Every missed call is a missed job.",
    cardLabel: 'Quick Math',
    cardText: '5 missed calls/week x $800 avg job = $4,000 lost. Per month: $16,000. Per year: $192,000.',
    ctaText: 'Stop the Bleeding - Book a Call',
    sectionTitle: 'Where the Money Goes',
    sectionSubtitle: 'The real cost of missed and unmanaged calls',
    items: [
      { bold: 'Unanswered calls', desc: 'most callers do not leave voicemail - they just move on' },
      { bold: 'No callback system', desc: 'missed calls with no follow-up = permanent loss' },
      { bold: 'After-hours leads', desc: 'evenings and weekends go completely unhandled' },
      { bold: 'No tracking', desc: 'you do not even know how many you are missing' }
    ],
    testimonial: { text: 'For which of you, desiring to build a tower, does not first sit down and count the cost?', ref: 'Luke 14:28' }
  },
  {
    file: '05-day5.html',
    subject: "What other HVAC owners are saying about this, {{contact.first_name}}",
    label: 'Social Proof - Day 5',
    headline: "You're not the only one who's dealt with this.",
    subheadline: "Here's what HVAC owners said after fixing their revenue system.",
    cardLabel: 'Real Results',
    cardText: 'HVAC companies using a revenue operating system report 30-50% more booked jobs within the first 60 days.',
    ctaText: 'Join Meeting',
    sectionTitle: 'What Changes When You Fix the System',
    sectionSubtitle: 'Outcomes from HVAC businesses that made the switch',
    items: [
      { bold: 'More booked jobs', desc: 'from the same number of leads coming in' },
      { bold: 'Less admin work', desc: 'follow-ups and reminders run automatically' },
      { bold: 'More 5-star reviews', desc: 'automated review requests after every job' },
      { bold: 'Full visibility', desc: 'dashboard shows exactly where every lead stands' }
    ],
    testimonial: { text: 'Where there is no guidance, a people falls, but in an abundance of counselors there is safety.', ref: 'Proverbs 11:14' }
  },
  {
    file: '06-day7.html',
    subject: "Let's calculate exactly how much you're losing, {{contact.first_name}}",
    label: 'Revenue Calculator - Day 7',
    headline: "Let's do the math, {{contact.first_name}}.",
    subheadline: "Missed calls are not just annoying - they are expensive.",
    cardLabel: 'Your Revenue Leak Estimate',
    cardText: 'If you miss 5 leads/week at $800 avg - that is $192,000/year walking out the door. Most HVAC owners we talk to miss more than 5.',
    ctaText: 'Join Meeting',
    sectionTitle: 'The Full Picture',
    sectionSubtitle: 'All the places revenue leaks from an unmanaged HVAC business',
    items: [
      { bold: 'Missed calls', desc: 'no system to catch and follow up on them' },
      { bold: 'Slow estimates', desc: 'leads go cold while you are building the quote' },
      { bold: 'No follow-up after quote', desc: 'sent the estimate, heard nothing, moved on' },
      { bold: 'Lost reviews', desc: 'happy customers who never left a review' }
    ],
    testimonial: { text: 'The plans of the diligent lead surely to abundance, but everyone who is hasty comes only to poverty.', ref: 'Proverbs 21:5' }
  },
  {
    file: '07-day9.html',
    subject: "Your team isn't the problem, {{contact.first_name}} - the system is",
    label: 'Mindset Shift - Day 9',
    headline: "Your team is not the problem.",
    subheadline: "The system they are working in is.",
    cardLabel: 'The Real Issue',
    cardText: 'Good people in a broken system produce broken results. The HVAC Revenue Operating System fixes the system - not the people.',
    ctaText: 'Join Meeting',
    sectionTitle: 'What a Good System Does For Your Team',
    sectionSubtitle: 'How the right infrastructure changes everything',
    items: [
      { bold: 'Removes manual follow-up', desc: 'system handles it automatically' },
      { bold: 'Clears the inbox', desc: 'no more chasing leads by hand' },
      { bold: 'Sets clear processes', desc: 'everyone knows what happens next' },
      { bold: 'Makes your team 3x more efficient', desc: 'same staff, more output' }
    ],
    testimonial: { text: 'Commit your work to the Lord, and your plans will be established.', ref: 'Proverbs 16:3' }
  },
  {
    file: '08-day11.html',
    subject: "Here's exactly what the HVAC Revenue Operating System does, {{contact.first_name}}",
    label: 'Product Overview - Day 11',
    headline: "Here's what we actually build for you.",
    subheadline: "Not software. Not a CRM course. A complete operating system.",
    cardLabel: "What's Included",
    cardText: 'Setup: $3,999 - Monthly: $999. Everything installed, configured, and running in your business within days.',
    ctaText: 'Join Meeting',
    sectionTitle: 'What the System Covers',
    sectionSubtitle: 'Every piece of the HVAC Revenue Operating System',
    items: [
      { bold: 'Automated lead follow-up', desc: 'instant response to every new inquiry' },
      { bold: 'Booking and confirmation system', desc: 'no more back-and-forth scheduling' },
      { bold: 'Payment reminder automation', desc: 'invoices followed up automatically' },
      { bold: 'Review generation system', desc: 'Google reviews requested after every job' }
    ],
    testimonial: { text: 'Let us not grow weary of doing good, for in due season we will reap, if we do not give up.', ref: 'Galatians 6:9' }
  },
  {
    file: '09-day14.html',
    subject: "How review automation works (and why it matters for HVAC), {{contact.first_name}}",
    label: 'Feature Spotlight - Day 14',
    headline: "More 5-star reviews. Zero extra effort.",
    subheadline: "Here's how automated review generation works.",
    cardLabel: 'Why Reviews Matter',
    cardText: '88% of consumers trust online reviews as much as personal recommendations. In HVAC, reviews win jobs before you even answer the phone.',
    ctaText: 'Join Meeting',
    sectionTitle: 'How Review Automation Works',
    sectionSubtitle: 'What happens after every completed job',
    items: [
      { bold: 'Job marked complete', desc: 'system detects the job is done' },
      { bold: 'Review request sent', desc: 'automated message goes to the customer' },
      { bold: 'Direct link to Google', desc: 'one click - no friction for the customer' },
      { bold: 'Review collected', desc: 'your rating grows without lifting a finger' }
    ],
    testimonial: { text: 'A good name is more desirable than great riches; to be esteemed is better than silver or gold.', ref: 'Proverbs 22:1' }
  },
  {
    file: '10-day16.html',
    subject: "The WhatsApp AI agent - what it does for your HVAC business, {{contact.first_name}}",
    label: 'Feature Spotlight - Day 16',
    headline: "Your business. Available 24/7 on WhatsApp.",
    subheadline: "The AI agent that handles leads while you are on the job.",
    cardLabel: 'What It Does',
    cardText: 'The WhatsApp AI agent responds to inquiries, qualifies leads, and books appointments - automatically, at any hour.',
    ctaText: 'Join Meeting',
    sectionTitle: 'What the WhatsApp AI Agent Handles',
    sectionSubtitle: 'Conversations that used to require a human',
    items: [
      { bold: 'Instant lead response', desc: 'replies within seconds, any time of day' },
      { bold: 'Lead qualification', desc: 'asks the right questions before booking' },
      { bold: 'Appointment scheduling', desc: 'books directly into your calendar' },
      { bold: 'Follow-up reminders', desc: 'sends reminders so leads do not go cold' }
    ],
    testimonial: { text: 'The heart of the discerning acquires knowledge, for the ears of the wise seek it out.', ref: 'Proverbs 18:15' }
  },
  {
    file: '11-day18.html',
    subject: "Would 10 extra booked jobs a month justify the investment, {{contact.first_name}}?",
    label: 'Value Close - Day 18',
    headline: "10 extra jobs a month. Is that worth it?",
    subheadline: "Let's run the numbers on what the system actually costs vs. what it returns.",
    cardLabel: 'The ROI',
    cardText: '10 extra jobs x $800 avg = $8,000/month. The system costs $999/month. That is 8x return - from leads you already have.',
    ctaText: 'Join Meeting',
    sectionTitle: 'What You Get for $999/Month',
    sectionSubtitle: 'Everything that runs after the system is installed',
    items: [
      { bold: 'Automated lead follow-up', desc: 'never lose a lead to slow response again' },
      { bold: 'Review automation', desc: 'consistent 5-star growth every month' },
      { bold: 'WhatsApp AI agent', desc: '24/7 lead handling and booking' },
      { bold: 'Reporting dashboard', desc: 'see exactly what is working and what is not' }
    ],
    testimonial: { text: 'Honor the Lord with your wealth and with the firstfruits of all your produce; then your barns will be filled with plenty.', ref: 'Proverbs 3:9-10' }
  },
  {
    file: '12-day21.html',
    subject: "Here's everything included in the HVAC Revenue Operating System, {{contact.first_name}}",
    label: 'Full Breakdown - Day 21',
    headline: "Everything included. Nothing hidden.",
    subheadline: "Here is the complete breakdown of what you get.",
    cardLabel: 'Investment',
    cardText: 'Setup: $3,999 (one-time) + $999/month ongoing. No hidden fees. No long-term lock-in.',
    ctaText: 'Join Meeting',
    sectionTitle: "What's Included in the Setup",
    sectionSubtitle: 'Delivered and running within days of starting',
    items: [
      { bold: 'Landing page and lead capture', desc: 'optimized for HVAC inquiries' },
      { bold: 'Automated follow-up sequences', desc: 'email, SMS, and WhatsApp' },
      { bold: 'Booking and calendar system', desc: 'connected to your availability' },
      { bold: 'SOP audit and process setup', desc: 'your team knows exactly what to do' }
    ],
    testimonial: { text: 'Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us.', ref: 'Ephesians 3:20' }
  },
  {
    file: '13-day24.html',
    subject: "Already have software? Here's why that's not the same thing, {{contact.first_name}}",
    label: 'Common Question - Day 24',
    headline: '"I already have software."',
    subheadline: "We hear this all the time. Here is the honest answer.",
    cardLabel: 'The Difference',
    cardText: 'Having software and having a working system are two completely different things. Most HVAC owners have tools - but no system connecting them.',
    ctaText: 'Join Meeting',
    sectionTitle: 'Software vs. Operating System',
    sectionSubtitle: 'Why tools alone do not fix the revenue leak',
    items: [
      { bold: 'Software sits there', desc: 'a system is actively working for you 24/7' },
      { bold: 'Software needs manual input', desc: 'a system automates the whole flow' },
      { bold: 'Software is a tool', desc: 'a system is infrastructure - like plumbing' },
      { bold: 'We build on what you have', desc: 'no need to throw away existing tools' }
    ],
    testimonial: { text: 'No one pours new wine into old wineskins. Otherwise, the wine will burst the skins, and both the wine and the wineskins will be ruined.', ref: 'Mark 2:22' }
  },
  {
    file: '14-day27.html',
    subject: "We're limiting new clients per city - here's why, {{contact.first_name}}",
    label: 'Important Update - Day 27',
    headline: "We only work with one HVAC company per city.",
    subheadline: "That keeps the competitive advantage exclusive to you.",
    cardLabel: 'Why This Matters',
    cardText: 'Once we onboard an HVAC company in your area, we close the door to their direct competitors. Your slot may not be available next week.',
    ctaText: 'Check If Your City Is Available',
    sectionTitle: 'Why We Cap It',
    sectionSubtitle: 'The reason exclusivity is part of how this works',
    items: [
      { bold: 'Competitive advantage', desc: 'your rivals will not have the same system' },
      { bold: 'Local market focus', desc: 'we tailor the system to your specific area' },
      { bold: 'Limited onboarding slots', desc: 'we take quality over quantity, always' },
      { bold: 'Your window is open now', desc: 'but it will not stay open indefinitely' }
    ],
    testimonial: { text: 'The harvest is plentiful, but the laborers are few; therefore pray earnestly to the Lord of the harvest to send out laborers.', ref: 'Matthew 9:37-38' }
  },
  {
    file: '15-day30.html',
    subject: "Should we close your file, {{contact.first_name}}?",
    label: 'Final Message - Day 30',
    headline: "Should we close your file, {{contact.first_name}}?",
    subheadline: "No pressure. Just want to make sure you have what you need.",
    cardLabel: "Here's Where We're At",
    cardText: "We have shared a lot over the past 30 days. If any of it resonated - even a little - one conversation is all it takes to see if this is a fit.",
    ctaText: 'Book One Last Call',
    sectionTitle: "If You're Still On the Fence",
    sectionSubtitle: 'The three most common reasons people wait - and why they regret it',
    items: [
      { bold: '"Not the right time"', desc: 'there is never a perfect time - only a cost to waiting' },
      { bold: '"Too expensive"', desc: 'one extra job a week covers the monthly cost' },
      { bold: '"I will set it up myself"', desc: 'most people say this - very few actually do it' },
      { bold: '"Let me think about it"', desc: 'while you think, your competitor might not be' }
    ],
    testimonial: { text: 'I can do all things through Christ who strengthens me.', ref: 'Philippians 4:13' }
  }
];

emails.forEach(e => {
  const html = buildEmail(e);
  fs.writeFileSync(`${__dirname}/${e.file}`, html);
  console.log('Created: ' + e.file);
});

const subjects = emails.map((e, i) => ({ num: i+1, file: e.file, subject: e.subject }));
fs.writeFileSync(`${__dirname}/subjects.json`, JSON.stringify(subjects, null, 2));
console.log('Done! All 15 emails + subjects.json created.');

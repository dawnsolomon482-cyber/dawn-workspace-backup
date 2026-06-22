/* ══════════════════════════════════════════
   DAWN SOLOMON — SIMPLE INVOICE GENERATOR
══════════════════════════════════════════ */

const DS_SVG = `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" rx="12" fill="#111827"/><rect x="4" y="4" width="52" height="52" rx="9" fill="none" stroke="#00c9a7" stroke-width="2"/><text x="30" y="42" font-family="Georgia,serif" font-size="28" font-weight="bold" fill="#00c9a7" text-anchor="middle">DS</text></svg>`;
const DS_LOGO = 'data:image/svg+xml;base64,' + btoa(DS_SVG);
const SIG_DEFAULT = 'data:image/png;base64,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gACBXwXUECBAgAABAjsFJDI74XQjQIAAAQIErhAwJwECBP4tIJH5t4P/J0CAAAECBAgQIDCnwKSrkshMurGW9YtA/qayPx61uaY8bv0hQIAAAQIECBAYVUAiM+rOjRF3b1H+/gjot0fxhwABAgQIECBAYHABiczgGyh8AgRmE7AeAgQIECBAYIuARGaLkjYECBAgQIBAvwIiI0DglgISmVtuu0UTIECAAAECBAjcWWCGtUtkZthFayBAgAABAgQIECBwMwGJzM02/PrlioAAAQIECBAgQIDA5wISmc8NjUCAAIHvChidAAECBAgQ+EVAIvMLiQoCBAgQIEBgdAHxEyAwv4BEZv49tkICBAgQIECAAAECrwSGey6RGW7LBEyAAAECBAgQIECAgETGe+B6AREQIECAAAECBAgQeFNAIvMmmOYECBDoQUAMBAgQIEDg7gISmbu/A6yfAAECBAjcQ8AqCRCYTEAiM9mGWg4BAgQIECBAgACBYwT6HkUi0/f+iI4AAQIECBAgQIAAgQUBicwCiqrrBURAgAABAgQIECBAYE1AIrOm4xkBAgTGERApAQIECBC4lYBE5lbbbbEECBAgQIDA/wu4I0BgZAGJzMi7J3YCBAgQIECAAAECZwp0NJdEpqPNEAoBAgQIECBAgAABAtsEJDLbnLS6XkAEBAgQIECAAAECBP4WkMj8TeGGAAECswlYDwECBAgQmFdAIjPv3loZAQIECBAg8K6A9gQIDCMgkRlmqwRKgAABAgQIECBAoD+BqyKSyFwlb14CBAgQIECAAAECBHYLSGR20+l4vYAICBAgQIAAAQIE7iogkbnrzls3AQL3FLBqAgQIECAwiYBEZpKNtAwCBAgQIEDgOwJGJUCgTwGJTJ/7IioCBAgQIECAAAECowqcErdE5hRmkxAgQIAAAQIECBAgcKSAROZITWNdLyACAgQIECBAgACBWwhIZG6xzRZJgACB5wKeECBAgACBEQUkMiPumpgJECBAgACBKwXMTYBABwISmQ42QQgECBAgQIAAAQIE5hY4fnUSmeNNjUiAAAECBAgQIECAwJcFJDJfBjb89QIiIECAAAECBAgQmE9AIjPfnloRAQIEPhXQnwABAgQIdC8gkel+iwRIgAABAgQI9C8gQgIEzhb4XwAAAP//kohWdgAAAAZJREFUAwANNSCrsijKCgAAAABJRU5ErkJggg==';

const state = {
  logoSrc:   DS_LOGO,
  sigSrc:    SIG_DEFAULT,
  currency:  'USD',
  symbol:    '$',
  activeTab: 'wise',
};

/* ── UTILITIES ───────────────────────────── */
function $(id) { return document.getElementById(id); }

function esc(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmt(n) {
  const v = parseFloat(n) || 0;
  if (state.currency === 'JPY') return state.symbol + Math.round(v).toLocaleString();
  return state.symbol + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function fmtDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${M[+m - 1]} ${+day}, ${y}`;
}

function todayStr() { return new Date().toISOString().split('T')[0]; }
function plusDays(n) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

/* ── INVOICE ID ──────────────────────────── */
function genId() {
  const now = new Date();
  const yr  = now.getFullYear();
  const mo  = String(now.getMonth() + 1).padStart(2, '0');
  const rnd = String(Math.floor(Math.random() * 9000) + 1000);
  return `INV-${yr}${mo}-${rnd}`;
}

/* ── TOTALS ──────────────────────────────── */
function calcTotals() {
  const amount = parseFloat($('project-amount').value) || 0;

  $('s-amount').textContent = fmt(amount);

  $('amount-sym').textContent = state.symbol;
}

/* ── CURRENCY ────────────────────────────── */
function initCurrency() {
  $('currency').addEventListener('change', function () {
    const opt = this.options[this.selectedIndex];
    state.currency = this.value;
    state.symbol   = opt.dataset.sym || this.value + ' ';
    calcTotals();
  });
}

/* ── PAYMENT TABS ────────────────────────── */
function initPayTabs() {
  document.querySelectorAll('.ptab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.ppanel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      $(`panel-${btn.dataset.tab}`).classList.add('active');
      state.activeTab = btn.dataset.tab;
    });
  });
}

/* ── UPLOADS ─────────────────────────────── */
function initUploads() {
  /* pre-load DS logo */
  const li = $('logo-img');
  li.src = DS_LOGO;
  li.style.display = 'block';
  $('logo-empty').style.display = 'none';

  /* pre-load default signature */
  const si = $('sig-img');
  si.src = SIG_DEFAULT;
  si.style.display = 'block';
  $('sig-empty').style.display = 'none';

  $('logo-upload').addEventListener('change', function () {
    const f = this.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = e => {
      state.logoSrc = e.target.result;
      $('logo-img').src = e.target.result;
      $('logo-img').style.display = 'block';
      $('logo-empty').style.display = 'none';
    };
    r.readAsDataURL(f);
  });

  $('sig-upload').addEventListener('change', function () {
    const f = this.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = e => {
      state.sigSrc = e.target.result;
      $('sig-img').src = e.target.result;
      $('sig-img').style.display = 'block';
      $('sig-empty').style.display = 'none';
    };
    r.readAsDataURL(f);
  });

}

/* ── PAYMENT DETAILS ─────────────────────── */
function getPayRows() {
  const t = state.activeTab;
  const rows = [];
  const add = (k, id) => {
    const v = $(id) ? $(id).value.trim() : '';
    if (v) rows.push([k, v]);
  };

  if (t === 'wise') {
    rows.push(['Method', 'Wise']);
    add('Account Holder',    'wise-holder');
    add('Email / Username',  'wise-email');
    add('IBAN',              'wise-iban');
    add('SWIFT / BIC',       'wise-swift');
    add('Payment Reference', 'wise-ref');
    rows.push(['Pay via Wise', 'https://wise.com/pay/me/dawnbellos']);
  } else if (t === 'paypal') {
    rows.push(['Method', 'PayPal']);
    add('Account Holder',    'pp-holder');
    add('PayPal Email',      'pp-email');
    add('Payment Reference', 'pp-ref');
  } else if (t === 'bank') {
    rows.push(['Method', 'Bank Transfer']);
    add('Account Holder',    'bank-holder');
    add('Bank Name',         'bank-name');
    add('Account Number',    'bank-acct');
    add('SWIFT / BIC',       'bank-swift');
    add('IBAN',              'bank-iban');
    add('Payment Reference', 'bank-ref');
  } else if (t === 'maribank') {
    rows.push(['Method', 'MariBank']);
    add('Account Holder',    'mari-holder');
    add('Account / Phone',   'mari-acct');
    add('Payment Reference', 'mari-ref');
  }
  return rows;
}

/* ── BUILD INVOICE HTML ──────────────────── */
function buildInvoice() {
  const invNum  = $('invoice-num').value;
  const issue   = $('issue-date').value;
  const due     = $('due-date').value;
  const ccy     = state.currency;
  const project = $('project-name').value;
  const desc    = $('project-desc').value;
  const cName   = $('client-name').value;
  const cEmail  = $('client-email').value;

  const amount  = parseFloat($('project-amount').value) || 0;

  const payData = getPayRows();
  const payHTML = payData.map(([k,v]) =>
    `<tr><td class="pk">${esc(k)}</td><td class="pv">${v.startsWith('http') ? `<a href="${v}" style="color:#1D6FF0;">${v.replace('https://','')}</a>` : esc(v)}</td></tr>`
  ).join('');

  const logoHTML = state.logoSrc
    ? `<img class="inv-logo" src="${state.logoSrc}" alt="Logo" />`
    : `<div style="width:54px;height:54px;background:#111827;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#00c9a7">DS</div>`;

  const sigHTML = state.sigSrc
    ? `<img class="inv-sig-img" src="${state.sigSrc}" alt="Signature" />`
    : `<div class="inv-sig-ph"></div>`;

  return `
<div class="inv-page">

  <div class="inv-hdr">
    <div class="inv-hdr-l">
      ${logoHTML}
      <div>
        <div class="inv-from-name">Dawn Solomon</div><div class="inv-from-title">GHL Automation Specialist &amp; AI Systems Builder</div>
        <div class="inv-from-email">dawnsolomon482@gmail.com</div>
        <div class="inv-from-meta">WhatsApp: +63 963 859 9771</div><div class="inv-from-meta">Laguna, Philippines</div>
      </div>
    </div>
    <div class="inv-hdr-r">
      <div class="inv-title-w">INVOICE</div>
      <div class="inv-num">${esc(invNum)}</div>
    </div>
  </div>

  <div class="inv-meta">
    <div class="inv-bill-to">
      <div class="inv-slbl">Bill To</div>
      <div class="inv-cname">${esc(cName) || '—'}</div>
      ${cEmail ? `<div class="inv-cemail">${esc(cEmail)}</div>` : ''}
    </div>
    <div class="inv-details">
      <div class="inv-slbl">Invoice Details</div>
      <table class="inv-dtbl">
        <tr><td>Invoice #</td><td>${esc(invNum)}</td></tr>
        <tr><td>Issue Date</td><td>${fmtDate(issue)}</td></tr>
        <tr><td>Due Date</td><td>${fmtDate(due)}</td></tr>
        <tr><td>Currency</td><td>${ccy}</td></tr>
      </table>
    </div>
  </div>

  <div class="inv-project-block">
    <div class="inv-project-label">Project</div>
    <div class="inv-project-name">${esc(project) || 'Untitled Project'}</div>
    ${desc ? `<div class="inv-project-desc">${esc(desc)}</div>` : ''}
  </div>

  <div class="inv-totals-wrap">
    <table class="inv-totals">
      <tr class="inv-tr-grand"><td>Total Amount</td><td>${fmt(amount)}</td></tr>
    </table>
  </div>

  ${payHTML ? `
  <div class="inv-pay-section">
    <div class="inv-slbl">Payment Details</div>
    <table class="inv-pay-tbl">${payHTML}</table>
  </div>` : ''}


  <div class="inv-footer">
    <div class="inv-sig-block">
      ${sigHTML}
      <div class="inv-sig-line"></div>
      <div class="inv-sig-name">Dawn Solomon</div>
      <div class="inv-sig-role">Freelancer / Service Provider</div>
    </div>
    <div class="inv-thank">
      <div class="inv-thank-txt">Thank you for your business!</div>
    </div>
  </div>

</div>`;
}

/* ── PREVIEW ─────────────────────────────── */
function openPreview() {
  $('inv-wrap').innerHTML = buildInvoice();
  $('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePreview() {
  $('modal').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── PRINT / PDF ─────────────────────────── */
function doPrint() {
  const pz = $('print-zone');
  pz.innerHTML = `<div class="inv-wrap">${buildInvoice()}</div>`;
  setTimeout(() => {
    window.print();
    setTimeout(() => { pz.innerHTML = ''; }, 1500);
  }, 250);
}

/* ── RESET ───────────────────────────────── */
function resetForm() {
  if (!confirm('Reset all data? This cannot be undone.')) return;

  document.querySelectorAll('input:not([type="file"]):not([readonly]), textarea').forEach(el => { el.value = ''; });
  document.querySelectorAll('select').forEach(el => { el.selectedIndex = 0; });

  state.currency = 'USD';
  state.symbol   = '$';
  state.sigSrc   = SIG_DEFAULT;
  state.logoSrc  = DS_LOGO;

  const li = $('logo-img');
  li.src = DS_LOGO; li.style.display = 'block';
  $('logo-empty').style.display = 'none';
  const si = $('sig-img');
  si.src = SIG_DEFAULT; si.style.display = 'block';
  $('sig-empty').style.display = 'none';

  document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.ppanel').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-tab="wise"]').classList.add('active');
  $('panel-wise').classList.add('active');
  state.activeTab = 'wise';

  $('invoice-num').value = genId();
  $('issue-date').value  = todayStr();
  $('due-date').value    = plusDays(30);
  calcTotals();
}

/* ── INIT ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  $('invoice-num').value = genId();
  $('issue-date').value  = todayStr();
  $('due-date').value    = plusDays(30);

  initPayTabs();
  initUploads();
  initCurrency();
  calcTotals();

  function syncRefs() {
    const num = $('invoice-num').value;
    ['wise-ref','pp-ref','bank-ref','mari-ref'].forEach(id => { if ($(id)) $(id).value = num; });
  }
  syncRefs();

  $('btn-regen').addEventListener('click', () => { $('invoice-num').value = genId(); syncRefs(); });
  $('btn-preview').addEventListener('click',  openPreview);
  $('btn-download').addEventListener('click', doPrint);
  $('btn-reset').addEventListener('click',    resetForm);
  $('btn-modal-print').addEventListener('click', doPrint);
  $('btn-close-modal').addEventListener('click', closePreview);
  $('modal').addEventListener('click', e => { if (e.target === $('modal')) closePreview(); });

  $('project-amount').addEventListener('input', calcTotals);

  requestAnimationFrame(() => $('app').classList.add('loaded'));
});

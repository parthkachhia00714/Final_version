/* ============================================================
   SITEWARMING — PLATFORM v5 APP LOGIC
   Sections:
   1. View Router
   2. Domain Row Select (My Domains right panel)
   3. Acceleration Expand/Collapse (right panel)
   4. Domain Management — tab switcher
   5. Site Acceleration — bundle & boost logic
   6. Content Ops — cadence picker
   7. Activation Modal — multi-step wizard
   8. Helpers
============================================================ */

/* ── 1. VIEW ROUTER ── */
function V(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('on'));
  ['dash', 'domains', 'pricing', 'acceleration'].forEach(k => {
    const e = document.getElementById('sb-' + k);
    if (e) e.classList.remove('on');
  });
  document.getElementById('view-' + id).classList.add('on');
  const m = { dashboard: 'dash', mydomains: 'domains', domainmanage: 'domains', pricing: 'pricing', acceleration: 'acceleration' };
  const sb = document.getElementById('sb-' + m[id]);
  if (sb) sb.classList.add('on');
}

/* ── 2. DOMAIN ROW SELECT ── */
function selDom(row, name, status) {
  document.querySelectorAll('.dtbl tbody tr').forEach(r => r.classList.remove('sel'));
  row.classList.add('sel');
  document.getElementById('md-right').classList.add('on');
  document.getElementById('dr-n').textContent = name;

  const st = document.getElementById('dr-st');
  if (status === 'accelerating') { st.className = 'sp sp-ac'; st.textContent = '⚡ Accelerating'; }
  else if (status === 'active') { st.className = 'sp sp-a'; st.textContent = 'Active'; }
  else { st.className = 'sp sp-d'; st.textContent = 'Draft'; }

  const ar = document.getElementById('dr-acc-row');
  const aa = document.getElementById('dr-acc-active');
  if (status === 'accelerating') { ar.style.display = 'none'; aa.classList.add('on'); }
  else if (status === 'active') { ar.style.display = 'block'; ar.classList.remove('open'); aa.classList.remove('on'); }
  else { ar.style.display = 'none'; aa.classList.remove('on'); }

  document.querySelector('.dr-cfg').onclick = () => openDM(name, 'general');
}

/* ── 3. ACCELERATION EXPAND/COLLAPSE ── */
function toggleAcc() { document.getElementById('dr-acc-row').classList.toggle('open'); }
function collapseAcc() { document.getElementById('dr-acc-row').classList.remove('open'); }
function selBundle(el, type) {
  document.querySelectorAll('.bundle-cards .bcard').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
}

/* ── 4. DOMAIN MANAGEMENT TAB SWITCHER ── */
function openDM(name, tab) {
  V('domainmanage');
  document.getElementById('dm-ttl').textContent = 'Manage ' + name;
  switchTab(tab || 'general');
}

function switchTab(t) {
  const all = ['general', 'social', 'tech', 'intel', 'sa', 'co', 'sell', 'val', 'visit'];
  all.forEach(id => {
    const btn = document.getElementById('dmt-' + id);
    const body = document.getElementById('dtb-' + id);
    if (btn) btn.classList.toggle('on', id === t);
    if (body) {
      if (id === 'sa' || id === 'co') { body.style.display = id === t ? 'flex' : 'none'; }
      else { body.style.display = id === t ? 'block' : 'none'; }
    }
  });
}

/* ── 5. SITE ACCELERATION ── */
let saBundleActive = 'heat', saBundlePrice = 22, saBoostAmt = 29, saBoostLabel = 'Content Sprint';

function selSABundle(el, type, price) {
  document.querySelectorAll('#sa-bundle-grid .bplan').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  saBundleActive = type; saBundlePrice = price;

  ['warm', 'heat', 'blaze'].forEach(b => {
    const cta = document.getElementById('bpl-' + b + '-cta');
    if (!cta) return;
    if (b === type) {
      cta.className = 'bplan-cta bplan-cta-p';
      cta.textContent = `✓ ${type.charAt(0).toUpperCase() + type.slice(1)} — $${price}/mo`;
    } else {
      cta.className = 'bplan-cta bplan-cta-s';
      cta.textContent = `Select ${b.charAt(0).toUpperCase() + b.slice(1)}`;
    }
  });

  updateSAOrder();

  const ctx = {
    warm: 'Warm Bundle: 8 posts/month with a preset audience profile and 2 rotating voice profiles. Steady content momentum — expected 12% traffic growth in 60–90 days.',
    heat: 'Heat Bundle: 12 posts/month with custom audience DNA and 3 rotating voice profiles. Content will be highly targeted and varied in style — no uniform AI tone. Expected: 20% traffic growth in 60–90 days based on research data.',
    blaze: 'Blaze Bundle: 20 posts/month with full custom DNA, unlimited voice profiles, and one Authority Blitz (50 posts) per month free. Maximum authority building — expected 35%+ traffic growth in 90 days.'
  };
  const imp = {
    warm: ['8 (Warm)', 'Preset Profile', '2 rotating'],
    heat: ['12 (Heat)', 'Custom DNA', '3 rotating'],
    blaze: ['20 (Blaze)', 'Full DNA + Analytics', 'Unlimited']
  };
  const el2 = document.getElementById('ctx-txt'); if (el2) el2.textContent = ctx[type];
  const ip = document.getElementById('imp-posts'); if (ip) ip.textContent = imp[type][0];
  const ia = document.getElementById('imp-aud'); if (ia) ia.textContent = imp[type][1];
  const iv = document.getElementById('imp-voice'); if (iv) iv.textContent = imp[type][2];

  const saveBtn = document.getElementById('sa-save-btn');
  if (saveBtn) saveBtn.textContent = `💳 Activate ${type.charAt(0).toUpperCase() + type.slice(1)} Bundle — $${price}/mo`;
}

function selBoost(el, price, label, posts) {
  document.querySelectorAll('.boost-grid-sa .bst').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  saBoostAmt = price; saBoostLabel = label;
  updateSAOrder();
}

function updateSAOrder() {
  const bl = document.getElementById('sa-ol-bundle');
  if (bl) {
    bl.querySelector('.sa-ok').textContent = `Bundle: ${saBundleActive.charAt(0).toUpperCase() + saBundleActive.slice(1)}`;
    bl.querySelector('.sa-ov').textContent = `$${saBundlePrice}/mo`;
  }
  const bo = document.getElementById('sa-ol-boost');
  if (bo) {
    bo.querySelector('.sa-ok').textContent = `Boost: ${saBoostLabel}`;
    bo.querySelector('.sa-ov').textContent = `$${saBoostAmt} one-time`;
  }
  const tot = document.getElementById('sa-total');
  if (tot) tot.textContent = `$${saBundlePrice}/mo`;
}

function toggleSA() {
  const tog = document.getElementById('sa-tog');
  const lbl = document.getElementById('sa-tog-lbl');
  const desc = document.getElementById('sa-status-p');
  const badge = document.getElementById('dm-acbadge');
  tog.classList.toggle('on');
  if (tog.classList.contains('on')) {
    lbl.textContent = 'Premium Active'; lbl.style.color = 'var(--green)';
    desc.textContent = 'Acceleration is actively running premium content generation for this domain.';
    if (badge) badge.style.display = 'inline-flex';
    document.getElementById('dr-acc-row').style.display = 'none';
    document.getElementById('dr-acc-active').classList.add('on');
  } else {
    lbl.textContent = 'Premium Off'; lbl.style.color = 'var(--ink3)';
    desc.textContent = '1 blog/month active (free). Enable premium bundles below.';
    if (badge) badge.style.display = 'none';
    document.getElementById('dr-acc-row').style.display = 'block';
    document.getElementById('dr-acc-active').classList.remove('on');
  }
}

function saveSA() {
  toggleSA();
  const btn = document.getElementById('sa-save-btn');
  btn.textContent = '✓ Bundle Active — Saved';
  btn.style.background = 'var(--green)';
}

/* ── 6. CONTENT OPS ── */
function pickCadence(el, type, label, addlCost) {
  document.querySelectorAll('.co-cad-tog .copt:not(.locked)').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  const cadLbl = document.getElementById('co-cadence-label');
  if (cadLbl) cadLbl.textContent = label + ' cadence' + (addlCost ? ` (+$${addlCost}/mo)` : '');
  const schedDesc = document.getElementById('co-sched-desc');
  if (schedDesc) schedDesc.textContent = label + ' on the 15th between 12 PM – 3 PM (Asia/Calcutta)';
}

function showUpgradeNudge(el) {
  const hint = el.querySelector('.copt-lock');
  if (hint) {
    const bundle = hint.textContent.replace('🔒 ', '').replace(' bundle', '');
    alert('Upgrade to ' + bundle + ' bundle in Site Acceleration to unlock this cadence.');
  }
}

/* ── 7. ACTIVATION MODAL ── */
let mCur = 1;
let mMethod = 'ai';

function openModal() { document.getElementById('moverlay').classList.add('on'); mCur = 1; mMethod = 'ai'; renderM(1); }
function closeModal() { document.getElementById('moverlay').classList.remove('on'); }
function checkModalClose(e) { if (e.target === document.getElementById('moverlay')) closeModal(); }

function selectMethod(type) {
  mMethod = type;
  document.getElementById('mc-ai').classList.toggle('on', type === 'ai');
  document.getElementById('mc-man').classList.toggle('on', type === 'manual');
  document.getElementById('ai-pnl').style.display = type === 'ai' ? 'block' : 'none';
  document.getElementById('man-pnl').style.display = type === 'manual' ? 'block' : 'none';
}

function copyPrompt() {
  const txt = document.getElementById('ai-prompt-txt');
  navigator.clipboard.writeText(txt.value).then(() => {
    const btn = event.target;
    const orig = btn.textContent;
    btn.textContent = '✓ Copied';
    setTimeout(() => { btn.textContent = orig; }, 1800);
  });
}

function downloadPrompt() {
  const txt = document.getElementById('ai-prompt-txt').value;
  const dom = document.getElementById('dom-in').value || 'domain';
  const blob = new Blob([txt], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = dom.replace(/\./g, '_') + '_content_prompt.txt';
  a.click();
}

function toggleMktSig(el) {
  const grid = document.getElementById('mkt-grid');
  const selected = grid.querySelectorAll('.mkt-sig.on').length;
  if (el.classList.contains('on')) {
    el.classList.remove('on');
    grid.querySelectorAll('.mkt-sig').forEach(s => s.classList.remove('maxed'));
  } else {
    if (selected >= 5) return;
    el.classList.add('on');
    if (selected + 1 >= 5) grid.querySelectorAll('.mkt-sig:not(.on)').forEach(s => s.classList.add('maxed'));
  }
}

function renderM(n) {
  document.querySelectorAll('.ms').forEach((s, i) => s.classList.toggle('on', i + 1 === n));
  document.getElementById('m-pill').textContent = n <= 5 ? `Step ${n} of 5` : '';

  for (let i = 1; i <= 5; i++) {
    const d = document.getElementById('md' + i), l = document.getElementById('ml' + i), lb = document.getElementById('ml-' + i);
    if (!d) continue;
    d.className = 'mpd ' + (i < n ? 'done' : i === n ? 'active' : 'idle');
    d.textContent = i < n ? '✓' : i;
    if (l) l.className = 'mpl' + (i < n ? ' done' : '');
    if (lb) lb.className = 'mp-lbl' + (i < n ? ' done' : i === n ? ' active' : '');
  }

  const ft = document.getElementById('m-ft');
  if (n >= 6) { ft.style.display = 'none'; return; } else { ft.style.display = 'flex'; }

  const back = document.getElementById('m-back'), next = document.getElementById('m-next'), note = document.getElementById('m-note');
  back.style.display = n > 1 ? 'inline-flex' : 'none';
  if (n === 5) { next.textContent = '🚀 Activate Domain'; next.className = 'btn btn-g btn-sm'; }
  else { next.textContent = 'Continue →'; next.className = 'btn btn-p btn-sm'; }
  note.textContent = n === 5 ? 'Jobs run in background — returns instantly' : 'No credit card required';

  const dom = document.getElementById('dom-in')?.value || 'your domain';
  ['ms2-dom', 'ms3-dom', 'ms5-dom'].forEach(id => { const e = document.getElementById(id); if (e) e.textContent = dom; });
}

function mNext() {
  if (mCur === 5) { mCur = 6; renderM(6); runProc(); }
  else { mCur++; renderM(mCur); }
}

function mBack() { if (mCur > 1) { mCur--; renderM(mCur); } }

function runProc() {
  [['ps1', 700], ['ps2', 1400], ['ps3', 2000], ['ps4', 2600]].forEach(([id, t], i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      el.className = 'proc-step ps-done';
      el.querySelector('.proc-ico').textContent = '✅';
      if (i === 3) setTimeout(() => {
        mCur = 7; renderM(7);
        const dom = document.getElementById('dom-in').value || 'mybusiness.com';
        document.getElementById('cf-dom').textContent = dom;
        const dnaEl = document.getElementById('cf-dna');
        if (dnaEl) dnaEl.textContent = mMethod === 'ai' ? 'AI-Assisted' : 'Q&A (Manual)';
      }, 500);
    }, t);
  });
}

function finishActAndAccel() {
  const dom = document.getElementById('dom-in').value || 'mybusiness.com';
  closeModal();
  _addDomToTable(dom);
  V('acceleration');
  setTimeout(() => openAccelForDomain(dom), 150);
  mCur = 1; renderM(1);
}

function openAccelForDomain(dom) {
  V('acceleration');
  setTimeout(() => {
    // reset custom states
    accAudCustom = false; accVoiceCustom = false;
    const audPanel = document.getElementById('aud-custom-panel');
    const audBtn = document.getElementById('aud-custom-toggle');
    const audTag = document.getElementById('acc-aud-tag');
    const voicePanel = document.getElementById('voice-custom-panel');
    const voiceBtn = document.getElementById('voice-custom-toggle');
    const voiceTag = document.getElementById('acc-voice-tag');
    if (audPanel) audPanel.style.display = 'none';
    if (audBtn) audBtn.textContent = '+ Build Custom Audience — $15/mo';
    if (audTag) { audTag.textContent = 'Default — Free'; audTag.className = 'accel-card-tag'; }
    if (voicePanel) voicePanel.style.display = 'none';
    if (voiceBtn) voiceBtn.textContent = '+ Build Custom Voice — $10/mo';
    if (voiceTag) { voiceTag.textContent = 'Default — Free'; voiceTag.className = 'accel-card-tag'; }
    document.querySelectorAll('#aud-presets .apre, #voice-presets .vpre').forEach(p => p.classList.remove('on'));
    _updateAccelOrder();

    // find or create matching tab
    const tabsContainer = document.getElementById('accel-dom-tabs');
    if (!tabsContainer) return;
    let matchedTab = null;
    tabsContainer.querySelectorAll('.adom:not(.adom-draft)').forEach(t => {
      if (t.textContent.includes(dom)) matchedTab = t;
    });
    if (!matchedTab && tabsContainer) {
      const newTab = document.createElement('div');
      newTab.className = 'adom';
      newTab.innerHTML = `🔥 ${dom} <span class="sp sp-a" style="font-size:9px;padding:1px 6px;">Active</span>`;
      newTab.onclick = () => selAccelDom(newTab, dom, 'active');
      tabsContainer.insertBefore(newTab, tabsContainer.firstChild);
      matchedTab = newTab;
    }
    if (matchedTab) selAccelDom(matchedTab, dom, 'active');
  }, 180);
}

function _addDomToTable(dom) {
  const tr = document.createElement('tr');
  tr.onclick = () => selDom(tr, dom, 'active');
  tr.innerHTML = `<td><input type="checkbox" checked style="accent-color:var(--brand);"/></td><td><div class="dc"><div class="dfl">🔥</div><span class="dn">${dom}</span></div></td><td><span class="sp sp-a">● Active</span></td><td><div class="soci"><div class="si">🌐</div><div class="si">📄</div><div class="si">🔒</div></div></td><td><span style="font-size:10.5px;color:var(--ink4);">None</span></td><td><span class="lp">Building My Vision</span></td><td><span class="sob so-a">🚀 Active</span></td><td><span style="font-size:11.5px;color:var(--ink3);">—</span></td><td><span style="font-size:11.5px;color:var(--ink4);">Today</span></td>`;
  const tbody = document.getElementById('dom-tbody');
  if (tbody) tbody.insertBefore(tr, tbody.firstChild);
  ['d-active', 'mds-a'].forEach(id => { const e = document.getElementById(id); if (e) e.textContent = parseInt(e.textContent) + 1; });
  const sba = document.getElementById('sb-active');
  if (sba) { const p = sba.textContent.split('/'); sba.textContent = (parseInt(p[0]) + 1) + '/' + p[1].trim(); }
}

function finishAct() {
  const dom = document.getElementById('dom-in').value || 'mybusiness.com';
  closeModal(); V('mydomains');
  _addDomToTable(dom);
  document.getElementById('dash-hint').classList.add('on');
  mCur = 1; renderM(1);
}

/* ── 8. HELPERS ── */
function pk(el, cls) { document.querySelectorAll(cls).forEach(c => c.classList.remove('on')); el.classList.add('on'); }
function pp(el) { document.querySelectorAll('.pub-opt').forEach(c => c.classList.remove('on')); el.classList.add('on'); }
function pd(el) { document.querySelectorAll('.daybtn').forEach(c => c.classList.remove('on')); el.classList.add('on'); }

function checkDNS() {
  const s = document.getElementById('dns-s');
  s.className = 'dns-st dns-p'; s.innerHTML = '<span>🔄</span><span>Checking…</span>';
  setTimeout(() => { s.className = 'dns-st dns-ok'; s.innerHTML = '<span>✅</span><span>DNS verified — domain connected!</span>'; }, 1500);
}

/* ── 9. ACCELERATION PAGE ── */
let accAudCustom = false, accVoiceCustom = false;

function selAccelDom(el, domain, status) {
  document.querySelectorAll('#accel-dom-tabs .adom:not(.adom-draft)').forEach(d => d.classList.remove('on'));
  el.classList.add('on');
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  set('accel-dom-name', domain);
  set('acc-aside-dom', domain);
  const badge = document.getElementById('accel-state-badge');
  const cur = document.getElementById('accel-state-cur');
  if (status === 'accelerating') {
    if (badge) { badge.textContent = '⚡ Accelerating'; badge.style.cssText = 'background:var(--brand-lt);color:var(--brand);border-color:var(--brand-bd);'; }
    if (cur) cur.textContent = 'Custom audience & voice active · 1 blog/month';
  } else {
    if (badge) { badge.textContent = 'Base Plan — Free'; badge.style.cssText = ''; }
    if (cur) cur.textContent = 'Base plan · 1 blog/month · default audience & voice';
  }
}

function selAudPreset(el) {
  document.querySelectorAll('#aud-presets .apre').forEach(a => a.classList.remove('on'));
  el.classList.add('on');
}

function toggleAudCustom() {
  accAudCustom = !accAudCustom;
  const panel = document.getElementById('aud-custom-panel');
  const btn = document.getElementById('aud-custom-toggle');
  const tag = document.getElementById('acc-aud-tag');
  if (panel) panel.style.display = accAudCustom ? 'block' : 'none';
  if (btn) btn.textContent = accAudCustom ? '− Remove Custom Audience' : '+ Build Custom Audience — $15/mo';
  if (tag) { tag.textContent = accAudCustom ? 'Custom DNA — $15/mo' : 'Default — Free'; tag.className = 'accel-card-tag' + (accAudCustom ? ' paid' : ''); }
  _updateAccelOrder();
}

function selVoicePreset(el) {
  document.querySelectorAll('#voice-presets .vpre').forEach(v => v.classList.remove('on'));
  el.classList.add('on');
}

function toggleVoiceCustom() {
  accVoiceCustom = !accVoiceCustom;
  const panel = document.getElementById('voice-custom-panel');
  const btn = document.getElementById('voice-custom-toggle');
  const tag = document.getElementById('acc-voice-tag');
  if (panel) panel.style.display = accVoiceCustom ? 'block' : 'none';
  if (btn) btn.textContent = accVoiceCustom ? '− Remove Custom Voice' : '+ Build Custom Voice — $10/mo';
  if (tag) { tag.textContent = accVoiceCustom ? 'Custom Voice — $10/mo' : 'Default — Free'; tag.className = 'accel-card-tag' + (accVoiceCustom ? ' paid' : ''); }
  _updateAccelOrder();
}

function _updateAccelOrder() {
  const show = (id, v) => { const e = document.getElementById(id); if (e) e.style.display = v ? 'flex' : 'none'; };
  show('accel-ol-aud', accAudCustom);
  show('accel-ol-voice', accVoiceCustom);

  const total = (accAudCustom ? 15 : 0) + (accVoiceCustom ? 10 : 0);
  const el = document.getElementById('accel-total');
  if (el) { el.textContent = total > 0 ? '$' + total + '/mo' : '$0'; el.className = 'accel-total' + (total === 0 ? ' is-free' : ''); }

  const btn = document.getElementById('accel-save-btn');
  if (btn) btn.textContent = total > 0 ? '💳 Activate — $' + total + '/mo' : 'Save Preset Selection';
}

function saveAcceleration() {
  const btn = document.getElementById('accel-save-btn');
  const orig = btn.textContent;
  btn.textContent = '✓ Saved!'; btn.style.background = 'var(--green)';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
}

(function(){
  // 1. Inject nav CSS into <head>
  if (!document.getElementById('hp-nav-css')) {
    var st = document.createElement('style');
    st.id = 'hp-nav-css';
    st.textContent = `
/* ── NAV ── */
nav{position:fixed;top:0;left:0;right:0;z-index:200;padding:0 clamp(20px,5vw,80px);height:68px;display:flex;align-items:center;transition:background .35s,box-shadow .35s,backdrop-filter .35s}
nav.scrolled{background:rgba(255,255,255,.97);box-shadow:0 1px 0 rgba(11,25,41,.08);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.nav-inner{max-width:1240px;margin:0 auto;width:100%;display:flex;align-items:center;gap:0}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0;margin-right:40px}
.nav-logo img{height:28px;width:28px;object-fit:contain;filter:brightness(0) invert(1);transition:filter .35s}
nav.scrolled .nav-logo img{filter:none}
.nav-logo-text{font-family:var(--font-logo);font-size:19px;font-weight:400;letter-spacing:-.02em;color:#fff;line-height:1;transition:color .25s}
nav.scrolled .nav-logo-text{color:var(--n800)}
.nav-links{display:flex;align-items:stretch;gap:0;list-style:none;flex:1;height:68px}
.nav-item{position:relative;display:flex;align-items:center}
.nav-link{display:flex;align-items:center;gap:5px;font-size:14px;font-weight:500;color:rgba(255,255,255,.78);transition:color .15s;white-space:nowrap;padding:0 16px;height:100%;cursor:pointer}
nav.scrolled .nav-link{color:rgba(11,25,41,.68)}
.nav-link:hover,.nav-link.active-page{color:#fff}
nav.scrolled .nav-link:hover,nav.scrolled .nav-link.active-page{color:var(--n700)}
.nav-link svg{transition:transform .2s ease;flex-shrink:0}
.nav-item:hover .nav-link svg{transform:rotate(180deg)}
.nav-dropdown{position:absolute;top:calc(100% + 1px);left:50%;transform:translateX(-50%);width:260px;
  background:rgba(12,22,38,.96);backdrop-filter:blur(24px) saturate(1.5);-webkit-backdrop-filter:blur(24px) saturate(1.5);
  border:1px solid rgba(255,255,255,.12);border-radius:16px;
  box-shadow:0 8px 32px rgba(0,0,0,.4),0 32px 80px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.18);
  padding:10px;opacity:0;pointer-events:none;transform:translateX(-50%) translateY(-6px);
  transition:opacity .18s ease,transform .18s ease}
.nav-item:hover .nav-dropdown{opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(0)}
.nav-dropdown-section{padding:6px 0 2px}
.nav-dropdown-label{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.30);padding:4px 12px 8px;display:block}
.nav-dd-link{display:flex;align-items:center;gap:12px;padding:9px 12px;border-radius:9px;text-decoration:none;transition:background .14s}
.nav-dd-link:hover{background:rgba(255,255,255,.07)}
.nav-dd-icon{width:32px;height:32px;border-radius:8px;background:rgba(141,189,230,.10);border:1px solid rgba(141,189,230,.16);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.nav-dd-icon svg{width:14px;height:14px;color:var(--n200)}
.nav-dd-text{flex:1;min-width:0}
.nav-dd-title{font-size:13px;font-weight:600;color:#fff;line-height:1.2}
.nav-dd-sub{font-size:11px;color:rgba(255,255,255,.40);margin-top:1px;line-height:1.3}
.nav-dd-active .nav-dd-icon{background:rgba(201,169,97,.14);border-color:rgba(201,169,97,.24)}
.nav-dd-active .nav-dd-icon svg{color:var(--gold)}
.nav-dd-active .nav-dd-title{color:var(--gold)}
.nav-dropdown-sep{height:1px;background:rgba(255,255,255,.08);margin:6px 0}
.nav-right{display:flex;align-items:center;gap:8px;margin-left:16px;flex-shrink:0}
.nav-cta{background:rgba(255,255,255,.12);color:#fff;border:1.5px solid rgba(255,255,255,.28);padding:8px 20px;font-size:13px;border-radius:var(--r-pill);backdrop-filter:blur(8px)}
.nav-cta:hover{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.45)}
nav.scrolled .nav-cta{background:var(--n500);border-color:var(--n500);backdrop-filter:none}
nav.scrolled .nav-cta:hover{background:var(--n600)}
.nav-burger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px;border:none;background:none}
.nav-burger span{display:block;width:22px;height:2px;border-radius:2px;background:rgba(255,255,255,.85);transition:all .22s ease}
nav.scrolled .nav-burger span{background:var(--n700)}
.nav-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.nav-burger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.nav-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.mobile-menu{display:none;position:fixed;top:68px;left:0;right:0;background:rgba(12,22,38,.97);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.07);padding:24px clamp(20px,5vw,80px);z-index:199;flex-direction:column;gap:4px;max-height:calc(100vh - 68px);overflow-y:auto}
.mobile-menu.open{display:flex}
.mobile-menu-link{font-size:16px;font-weight:500;color:rgba(255,255,255,.7);padding:12px 0;border-bottom:1px solid rgba(255,255,255,.07)}
.mobile-menu-sub{font-size:14px;color:rgba(255,255,255,.45);padding:8px 0 8px 16px;border-bottom:1px solid rgba(255,255,255,.05)}
.mobile-menu-link:last-of-type,.mobile-menu-sub:last-of-type{border-bottom:none}
.mobile-menu-cta{margin-top:16px}
@media(max-width:768px){.nav-links{display:none}.nav-burger{display:flex}.nav-inner{justify-content:space-between}.nav-logo{margin-right:0}.nav-cta{display:none}}
`;
    document.head.appendChild(st);
  }

  // 2. Inject nav HTML
  var NAV_HTML = `
<nav id="main-nav">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo">
      <img src="assets/hansepay-mark-uploaded.png" alt="HansePay" />
      <span class="nav-logo-text">HansePay</span>
    </a>
    <ul class="nav-links">

      <!-- Platform -->
      <li class="nav-item">
        <span class="nav-link">Platform
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
        <div class="nav-dropdown">
          <div class="nav-dropdown-section">
            <span class="nav-dropdown-label">Platform</span>
            <a href="platform.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Overview</div><div class="nav-dd-sub">See the full platform at a glance</div></div>
            </a>
            <a href="platform-technology.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Technology</div><div class="nav-dd-sub">The infrastructure behind every transfer</div></div>
            </a>
          </div>
        </div>
      </li>

      <!-- Solutions -->
      <li class="nav-item">
        <span class="nav-link">Solutions
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
        <div class="nav-dropdown" style="width:300px">
          <div class="nav-dropdown-section">
            <span class="nav-dropdown-label">By Industry</span>
            <a href="solutions-ecommerce.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">E-Commerce &amp; Retail</div><div class="nav-dd-sub">Supplier payments, bulk FX, emerging markets</div></div>
            </a>
            <a href="solutions-manufacturing.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Import &amp; Manufacturing</div><div class="nav-dd-sub">Industrial FX, big-ticket execution, supply chain</div></div>
            </a>
            <a href="solutions-logistics.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Logistics &amp; Freight</div><div class="nav-dd-sub">Same-day execution, agent networks, maritime</div></div>
            </a>
          </div>
          <div class="nav-dropdown-sep"></div>
          <div class="nav-dropdown-section">
            <span class="nav-dropdown-label">By Business Size</span>
            <a href="solutions-corporate.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Mid &amp; Large Business</div><div class="nav-dd-sub">Institutional pricing, named expert, &gt;€2M</div></div>
            </a>
            <a href="solutions-sme.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Small Business</div><div class="nav-dd-sub">No minimum volume, same-day, interbank rates</div></div>
            </a>
          </div>
        </div>
      </li>

      <!-- About -->
      <li class="nav-item">
        <span class="nav-link">About
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
        <div class="nav-dropdown" style="width:270px">
          <div class="nav-dropdown-section">
            <span class="nav-dropdown-label">About HansePay</span>
            <a href="about-vision.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Vision &amp; Mission</div><div class="nav-dd-sub">Why we built HansePay</div></div>
            </a>
            <a href="about-team.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Team &amp; History</div><div class="nav-dd-sub">Founders, advisors, offices &amp; milestones</div></div>
            </a>
            <a href="about-licenses.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Licenses</div><div class="nav-dd-sub">MiCAR, BaFin, GDPR, ISO 27001</div></div>
            </a>
          </div>
        </div>
      </li>

      <!-- Insights -->
      <li class="nav-item">
        <span class="nav-link">Insights
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
        <div class="nav-dropdown" style="width:270px">
          <div class="nav-dropdown-section">
            <span class="nav-dropdown-label">Insights</span>
            <a href="insights-stories.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Customer stories</div><div class="nav-dd-sub">Real customers. Real results.</div></div>
            </a>
            <a href="insights-market.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Market insights</div><div class="nav-dd-sub">Currency analysis, weekly</div></div>
            </a>
            <a href="events.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Events</div><div class="nav-dd-sub">Where to find us this season</div></div>
            </a>
          </div>
          <div class="nav-dropdown-sep"></div>
          <div class="nav-dropdown-section">
            <span class="nav-dropdown-label">Free tools</span>
            <a href="tools-calculator.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">FX Savings Calculator</div><div class="nav-dd-sub">Estimate your annual saving</div></div>
            </a>
            <a href="tools-converter.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">Currency Converter</div><div class="nav-dd-sub">Live mid-market rates</div></div>
            </a>
            <a href="tools-iban.html" class="nav-dd-link">
              <div class="nav-dd-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
              <div class="nav-dd-text"><div class="nav-dd-title">IBAN Verifier</div><div class="nav-dd-sub">Validate format and bank details</div></div>
            </a>
          </div>
        </div>
      </li>

    </ul>
    <div class="nav-right">
      <a href="index.html#contact" class="btn nav-cta">Open an account</a>
      <button class="nav-burger" id="nav-burger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>
<div class="mobile-menu" id="mobile-menu">
  <a class="mobile-menu-link" href="index.html" onclick="closeMobileMenu()">Home</a>
  <a class="mobile-menu-link" href="platform.html" onclick="closeMobileMenu()">Platform</a>
  <a class="mobile-menu-sub" href="platform-technology.html" onclick="closeMobileMenu()">Technology</a>
  <a class="mobile-menu-link" href="solutions-ecommerce.html" onclick="closeMobileMenu()">Solutions</a>
  <a class="mobile-menu-sub" href="solutions-ecommerce.html" onclick="closeMobileMenu()">E-Commerce &amp; Retail</a>
  <a class="mobile-menu-sub" href="solutions-manufacturing.html" onclick="closeMobileMenu()">Import &amp; Manufacturing</a>
  <a class="mobile-menu-sub" href="solutions-logistics.html" onclick="closeMobileMenu()">Logistics &amp; Freight</a>
  <a class="mobile-menu-sub" href="solutions-corporate.html" onclick="closeMobileMenu()">Mid &amp; Large Business</a>
  <a class="mobile-menu-sub" href="solutions-sme.html" onclick="closeMobileMenu()">Small Business</a>
  <a class="mobile-menu-link" href="about-vision.html" onclick="closeMobileMenu()">About</a>
  <a class="mobile-menu-sub" href="about-vision.html" onclick="closeMobileMenu()">Vision &amp; Mission</a>
  <a class="mobile-menu-sub" href="about-team.html" onclick="closeMobileMenu()">Team &amp; History</a>
  <a class="mobile-menu-sub" href="about-licenses.html" onclick="closeMobileMenu()">Licenses</a>
  <a class="mobile-menu-link" href="insights-stories.html" onclick="closeMobileMenu()">Insights</a>
  <a class="mobile-menu-sub" href="insights-stories.html" onclick="closeMobileMenu()">Customer stories</a>
  <a class="mobile-menu-sub" href="insights-market.html" onclick="closeMobileMenu()">Market insights</a>
  <a class="mobile-menu-sub" href="events.html" onclick="closeMobileMenu()">Events</a>
  <a class="mobile-menu-sub" href="tools-calculator.html" onclick="closeMobileMenu()">FX Savings Calculator</a>
  <a class="mobile-menu-sub" href="tools-converter.html" onclick="closeMobileMenu()">Currency Converter</a>
  <a class="mobile-menu-sub" href="tools-iban.html" onclick="closeMobileMenu()">IBAN Verifier</a>
  <a href="index.html#contact" class="btn btn-primary mobile-menu-cta" onclick="closeMobileMenu()">Open an account</a>
</div>
`;

  var s = document.currentScript;
  var tmp = document.createElement('div');
  tmp.innerHTML = NAV_HTML;
  while (tmp.firstChild) s.parentNode.insertBefore(tmp.firstChild, s);

  // 3. Active-page detection
  (function setActive(){
    var file = window.location.pathname
      .replace(/^\/hansepay\//, '/')
      .replace(/^\//, '') || 'index.html';
    file = file.split('#')[0].split('?')[0] || 'index.html';

    document.querySelectorAll('a.nav-dd-link').forEach(function(a){
      var href = (a.getAttribute('href')||'').split('#')[0];
      if (href && href === file) {
        a.classList.add('nav-dd-active');
        var item = a.closest('.nav-item');
        if (item) {
          var pl = item.querySelector('.nav-link');
          if (pl) pl.classList.add('active-page');
        }
      }
    });
    document.querySelectorAll('li.nav-item > a.nav-link').forEach(function(a){
      var href = (a.getAttribute('href')||'').split('#')[0];
      if (href && href === file) a.classList.add('active-page');
    });

    // Section-based activations
    var prefixes = [
      {prefix:'solutions-', text:'Solutions'},
      {prefix:'platform', text:'Platform'},
      {prefix:'about-', text:'About'},
      {prefix:'insights-', text:'Insights'},
      {prefix:'events', text:'Insights'},
      {prefix:'tools', text:'Insights'}
    ];
    prefixes.forEach(function(p){
      if(file.startsWith(p.prefix)){
        document.querySelectorAll('.nav-item .nav-link').forEach(function(el){
          if(el.textContent.trim().startsWith(p.text)) el.classList.add('active-page');
        });
      }
    });
  })();

  // 4. Scroll + burger
  function initNav(){
    var nav = document.getElementById('main-nav');
    if (!nav) return;
    window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', scrollY > 20); }, {passive:true});
    if (scrollY > 20) nav.classList.add('scrolled');
    var burger = document.getElementById('nav-burger');
    var menu   = document.getElementById('mobile-menu');
    if (burger && menu) {
      burger.addEventListener('click', function(){
        var open = menu.classList.toggle('open');
        burger.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initNav);
  else initNav();

  window.closeMobileMenu = function(){
    var menu   = document.getElementById('mobile-menu');
    var burger = document.getElementById('nav-burger');
    if (menu)   menu.classList.remove('open');
    if (burger) burger.classList.remove('open');
    document.body.style.overflow = '';
  };
})();

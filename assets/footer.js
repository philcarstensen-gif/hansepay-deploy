(function(){
  // 1. Inject footer CSS into <head>
  if (!document.getElementById('hp-footer-css')) {
    var st = document.createElement('style');
    st.id = 'hp-footer-css';
    st.textContent = `
/* ── FOOTER ── */
footer{background:#060D1A;padding:96px 0 48px;border-top:1px solid rgba(255,255,255,.07)}
.footer-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:64px;margin-bottom:80px}
@media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr;gap:48px}}
@media(max-width:560px){.footer-grid{grid-template-columns:1fr}}
.footer-logo{display:flex;align-items:center;gap:10px;margin-bottom:16px}
.footer-logo img{height:28px;width:28px;object-fit:contain}
.footer-logo-text{font-family:var(--font-logo);font-size:18px;font-weight:400;color:#fff;letter-spacing:-.02em}
.footer-tagline{font-size:13px;color:rgba(255,255,255,.45);line-height:1.6;max-width:240px;margin-bottom:12px}
.footer-legal{font-size:11px;color:rgba(255,255,255,.25);line-height:1.6}
.footer-col-title{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fff;margin-bottom:20px}
.footer-links{list-style:none;display:flex;flex-direction:column;gap:10px}
.footer-link{font-size:13px;color:rgba(255,255,255,.45);transition:color .15s}.footer-link:hover{color:rgba(255,255,255,.9)}
.footer-hr{height:1px;background:rgba(255,255,255,.07);margin-bottom:28px}
.footer-bottom{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
.footer-copy{font-size:12px;color:rgba(255,255,255,.25)}
.bafin-badge{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:rgba(255,255,255,.35);padding:5px 12px;border:1px solid rgba(255,255,255,.1);border-radius:var(--r-pill)}
.bafin-badge svg{width:12px;height:12px;color:var(--n200)}
@media(max-width:768px){footer{padding:64px 0 36px}.footer-grid{margin-bottom:48px;gap:36px}}
`;
    document.head.appendChild(st);
  }

  // 2. Inject footer HTML
  var FOOTER_HTML = `
<footer>
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-logo"><img src="assets/hansepay-mark-uploaded-white.png" alt="HansePay" /><span class="footer-logo-text">HansePay</span></div>
        <p class="footer-tagline">Commercial FX, made in Hamburg.</p>
        <p class="footer-legal">&#169; 2026 Caplend Technologies GmbH<br>HansePay is a brand of Caplend Technologies GmbH</p>
      </div>
      <div>
        <div class="footer-col-title">Platform</div>
        <ul class="footer-links">
          <li><a class="footer-link" href="platform.html">Overview</a></li>
          <li><a class="footer-link" href="platform-technology.html">Technology</a></li>
          <li><a class="footer-link" href="platform-security.html">Security</a></li>
          <li><a class="footer-link" href="tools.html">Tools</a></li>
          <li><a class="footer-link" href="tools-calculator.html">FX Calculator</a></li>
          <li><a class="footer-link" href="tools-converter.html">Currency Converter</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Company</div>
        <ul class="footer-links">
          <li><a class="footer-link" href="about-vision.html">Vision &amp; Values</a></li>
          <li><a class="footer-link" href="about-history.html">History</a></li>
          <li><a class="footer-link" href="about-team.html">Team</a></li>
          <li><a class="footer-link" href="about-licenses.html">Licenses</a></li>
          <li><a class="footer-link" href="insights-stories.html">Customer stories</a></li>
          <li><a class="footer-link" href="insights-market.html">Market insights</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">Legal</div>
        <ul class="footer-links">
          <li><a class="footer-link" href="imprint.html">Imprint</a></li>
          <li><a class="footer-link" href="#">Privacy policy</a></li>
          <li><a class="footer-link" href="#">Terms of service</a></li>
          <li><a class="footer-link" href="#">Complaints</a></li>
          <li><a class="footer-link" href="about-licenses.html">Licences</a></li>
          <li><a class="footer-link" href="partners-partner.html">Partners</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-hr"></div>
    <div class="footer-bottom">
      <span class="footer-copy">HansePay &middot; Hamburg, Germany &middot; Regulated by BaFin</span>
      <span class="bafin-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        BaFin-regulated &middot; EU E-Money Institution
      </span>
    </div>
  </div>
</footer>
`;

  var s = document.currentScript;
  var tmp = document.createElement('div');
  tmp.innerHTML = FOOTER_HTML;
  while (tmp.firstChild) s.parentNode.insertBefore(tmp.firstChild, s);
})();

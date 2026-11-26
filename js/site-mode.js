/* YPT site-mode: Standard <-> Agentic AI version switch (CR-002).
 * Loaded by BOTH versions. Standard pages live at /, agentic pages at /agentic/.
 * - Choice is kept in localStorage ("ypt-site-mode" = standard | agentic).
 * - First visit on the standard site, no choice yet: a pop-up asks once.
 * - A "Site type" list box (top right) always lets the visitor switch.
 * - No server redirects; crawlers (no stored choice) always get the standard pages.
 * - ?site=standard or ?site=agentic sets the choice from a link.
 */
(function () {
    'use strict';
    var KEY = 'ypt-site-mode', BASE = '/agentic';
    var path = location.pathname, inAgentic = path === BASE || path.indexOf(BASE + '/') === 0;

    function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
    function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

    // Same page in the other version (agents.html exists only in the agentic version).
    function twin(mode) {
        var p = path, tail = location.search + location.hash;
        if (inAgentic) p = p.slice(BASE.length) || '/';
        if (mode === 'agentic') return BASE + (p === '/' ? '/' : p) + tail;
        if (p === '/agents.html' || p === '/agents') p = '/';
        return p + tail;
    }

    // ?site= override: set the choice, drop the parameter.
    var q = /[?&]site=(standard|agentic)\b/.exec(location.search);
    if (q) {
        set(q[1]);
        var clean = location.search.replace(/([?&])site=(standard|agentic)&?/, '$1').replace(/[?&]$/, '');
        if ((q[1] === 'agentic') !== inAgentic) { location.replace(twin(q[1]).split('?')[0] + clean + location.hash); return; }
        history.replaceState(null, '', path + clean + location.hash);
    }

    var mode = get();
    // Returning visitor who chose the other version: send them there before the page paints.
    if (mode === 'agentic' && !inAgentic) { location.replace(twin('agentic')); return; }
    if (mode === 'standard' && inAgentic) { location.replace(twin('standard')); return; }
    // Arrived on an /agentic/ link with no choice yet: that link is their choice.
    if (!mode && inAgentic) { set('agentic'); mode = 'agentic'; }

    var isBot = /bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent);

    function css() {
        var s = document.createElement('style');
        s.textContent =
            '.sm-box{position:fixed;top:8px;right:10px;z-index:2147483000;display:flex;align-items:center;gap:6px;' +
            'background:rgba(15,23,48,.92);color:#fff;border:1px solid rgba(255,255,255,.22);border-radius:999px;' +
            'padding:3px 4px 3px 11px;font:600 12px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
            'box-shadow:0 4px 14px rgba(0,0,0,.25);backdrop-filter:blur(8px)}' +
            '.sm-box label{opacity:.8;font-weight:500;white-space:nowrap}' +
            '.sm-box select{appearance:none;-webkit-appearance:none;background:#2457f5;color:#fff;border:0;border-radius:999px;' +
            'padding:7px 26px 7px 11px;font:inherit;cursor:pointer;' +
            'background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'><path d=\'M1 1l4 4 4-4\' fill=\'none\' stroke=\'white\' stroke-width=\'1.6\'/></svg>");' +
            'background-repeat:no-repeat;background-position:right 10px center}' +
            '.sm-box select:focus-visible{outline:2px solid #f28a1e;outline-offset:2px}' +
            '.sm-box select option{color:#111;background:#fff}' +
            '@media (max-width:900px){.sm-box{top:auto;bottom:calc(10px + env(safe-area-inset-bottom));right:auto;left:10px}}' +
            '.sm-ov{position:fixed;inset:0;z-index:2147483001;background:rgba(7,12,28,.66);display:flex;align-items:center;justify-content:center;padding:16px;' +
            'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;animation:smf .25s ease}' +
            '@keyframes smf{from{opacity:0}to{opacity:1}}' +
            '.sm-card{width:100%;max-width:440px;background:#fff;color:#0f1730;border-radius:20px;padding:26px 22px 20px;box-shadow:0 24px 70px rgba(0,0,0,.45);text-align:center}' +
            '.sm-card .sm-k{font:600 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:#2457f5;margin:0 0 10px}' +
            '.sm-card h2{font-size:22px;line-height:1.25;margin:0 0 10px;font-weight:700}' +
            '.sm-card p{font-size:14.5px;line-height:1.5;margin:0 0 18px;color:#44506b}' +
            '.sm-card button{display:block;width:100%;border:0;border-radius:12px;padding:14px 16px;font:600 15px/1.2 inherit;font-family:inherit;cursor:pointer}' +
            '.sm-yes{background:#2457f5;color:#fff;margin-bottom:8px}' +
            '.sm-no{background:#eef1f8;color:#0f1730}' +
            '.sm-card small{display:block;margin-top:12px;font-size:12px;color:#7a859c}';
        document.head.appendChild(s);
    }

    function go(v) { set(v); location.href = twin(v); }

    function box() {
        var d = document.createElement('div');
        d.className = 'sm-box';
        d.innerHTML = '<label for="sm-sel">Site type</label><select id="sm-sel" aria-label="Site type">' +
            '<option value="standard">Standard</option><option value="agentic">Agentic AI</option></select>';
        var sel = d.querySelector('select');
        sel.value = inAgentic ? 'agentic' : 'standard';
        sel.addEventListener('change', function () { go(sel.value); });
        document.body.appendChild(d);
    }

    function popup() {
        var o = document.createElement('div');
        o.className = 'sm-ov';
        o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-labelledby', 'sm-t');
        o.innerHTML = '<div class="sm-card"><p class="sm-k">New</p><h2 id="sm-t">Do you want to see our agentic version of this website?</h2>' +
            '<p>Same content, rebuilt around a crew of AI agents that guide you through each page.</p>' +
            '<button class="sm-yes" type="button">Yes, show me the agentic version</button>' +
            '<button class="sm-no" type="button">No thanks, keep the standard site</button>' +
            '<small>You can switch any time using &ldquo;Site type&rdquo; at the top right.</small></div>';
        document.body.appendChild(o);
        var yes = o.querySelector('.sm-yes'), no = o.querySelector('.sm-no');
        function close(v) { set(v); if (v === 'agentic') { location.href = twin('agentic'); } else { o.remove(); document.removeEventListener('keydown', esc); } }
        function esc(e) { if (e.key === 'Escape') close('standard'); }
        yes.onclick = function () { close('agentic'); };
        no.onclick = function () { close('standard'); };
        document.addEventListener('keydown', esc);
        yes.focus();
    }

    function ready() {
        css(); box();
        var isHome = path === '/' || path === '/index.html';
        if (!mode && !inAgentic && !isBot && isHome) setTimeout(popup, 900);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();

/* YPT site-mode: Standard <-> Agentic AI version switch (CR-002).
 * Loaded by BOTH versions. Standard pages live at /, agentic pages at /agentic/.
 * - Choice is kept in localStorage ("ypt-site-mode" = standard | agentic).
 * - Agentic AI is the default: a visitor with no choice yet lands on the agentic version (no pop-up).
 * - A "Site type" list box (top right) always lets the visitor switch.
 * - No server redirects; crawlers (no stored choice) still get the standard pages, so search keeps indexing them.
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

    var isBot = /bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent);
    var mode = get();
    // Returning visitor who chose the other version: send them there before the page paints.
    if (mode === 'agentic' && !inAgentic) { location.replace(twin('agentic')); return; }
    if (mode === 'standard' && inAgentic) { location.replace(twin('standard')); return; }
    // No choice yet: Agentic AI is the default. Visitors (not crawlers) land on the agentic twin of the page.
    if (!mode && !inAgentic && !isBot) { location.replace(twin('agentic')); return; }
    // Arrived on an /agentic/ link with no choice yet: that link is their choice.
    if (!mode && inAgentic) { set('agentic'); mode = 'agentic'; }

    function css() {
        var s = document.createElement('style');
        s.textContent =
            '.sm-box{position:fixed;bottom:calc(14px + env(safe-area-inset-bottom));right:14px;z-index:2147483000;display:flex;align-items:center;gap:6px;' +
            'background:rgba(15,23,48,.92);color:#fff;border:1px solid rgba(255,255,255,.22);border-radius:999px;' +
            'padding:3px;font:600 12px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
            'box-shadow:0 4px 14px rgba(0,0,0,.25);backdrop-filter:blur(8px)}' +
            '.sm-box label{opacity:.8;font-weight:500;white-space:nowrap}' +
            '.sm-box select{appearance:none;-webkit-appearance:none;background:#2457f5;color:#fff;border:0;border-radius:999px;' +
            'padding:7px 26px 7px 11px;font:inherit;cursor:pointer;' +
            'background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'><path d=\'M1 1l4 4 4-4\' fill=\'none\' stroke=\'white\' stroke-width=\'1.6\'/></svg>");' +
            'background-repeat:no-repeat;background-position:right 10px center}' +
            '.sm-box select:focus-visible{outline:2px solid #f28a1e;outline-offset:2px}' +
            '.sm-box select option{color:#111;background:#fff}' +
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
        d.innerHTML = '<select id="sm-sel" aria-label="Site type">' +
            '<option value="standard">Standard</option><option value="agentic">Agentic AI</option></select>';
        var sel = d.querySelector('select');
        sel.value = inAgentic ? 'agentic' : 'standard';
        sel.addEventListener('change', function () { go(sel.value); });
        document.body.appendChild(d);
    }

    function ready() {
        css(); box();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();

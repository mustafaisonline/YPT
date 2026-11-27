// Products page.
// 1) Alya reacts to the card you are looking at (the builder's own line shows on the card through CSS).
// 2) The Features button (or a click on the card) opens that product's sheet: a near full-page dialog with tabs.
//    Open and close, focus, tabs, the module list and the concept map are all handled here; the content is static markup built by scripts/build-products.py.
(function () {
    var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var T = $('#gb-text'), base = T ? T.textContent : '', tm;
    var plain = function (s) { return (s || '').replace('&amp;', '&'); };

    // ---------- Alya
    $$('.prod').forEach(function (c) {
        function on() { if (!T || open) return; clearTimeout(tm); T.textContent = 'That is the ' + plain(c.getAttribute('data-name')) + ', with ' + c.getAttribute('data-who') + '. Press Features to see everything it does.'; }
        function off() { if (!T) return; clearTimeout(tm); tm = setTimeout(function () { T.textContent = base; }, 900); }
        c.addEventListener('mouseenter', on); c.addEventListener('mouseleave', off); c.addEventListener('focusin', on); c.addEventListener('focusout', off);
    });

    // ---------- Sheet
    var open = null, trigger = null, inerted = [], backdrop = $('#ps-backdrop');

    function setInert(on) {
        if (on) {
            inerted = Array.prototype.filter.call(document.body.children, function (el) { return !el.classList.contains('ps') && el !== backdrop && el.tagName !== 'SCRIPT'; });
            inerted.forEach(function (el) { el.inert = true; el.setAttribute('data-ps-inert', ''); });
        } else { inerted.forEach(function (el) { el.inert = false; el.removeAttribute('data-ps-inert'); }); inerted = []; }
    }

    function openSheet(id, from) {
        var s = $('#ps-' + id); if (!s || open) return;
        open = s; trigger = from || document.activeElement;
        document.body.classList.add('ps-lock'); backdrop.hidden = false; s.hidden = false; setInert(true);
        showTab(s, 'overview');
        var card = $('#' + id), sh = $('.ps-sheet', s);
        if (!REDUCED && card) {
            // the sheet grows out of the card, turning as it comes
            var r = card.getBoundingClientRect(), sr = sh.getBoundingClientRect();
            s.style.setProperty('--dx', (r.left - sr.left) + 'px'); s.style.setProperty('--dy', (r.top - sr.top) + 'px');
            s.style.setProperty('--sx', Math.max(0.1, r.width / sr.width).toFixed(3)); s.style.setProperty('--sy', Math.max(0.1, r.height / sr.height).toFixed(3));
            s.classList.add('from');
            void sh.offsetWidth; s.classList.add('anim'); s.classList.remove('from');
            setTimeout(function () { s.classList.remove('anim'); }, 900);   // fallback: never leave it half open
        }
        var x = $('[data-close]', s); if (x) x.focus({ preventScroll: true });
        if (T) T.textContent = 'This is everything the ' + plain($('#' + id).getAttribute('data-name')) + ' does. Use the tabs: overview, features, modules, concept map and dashboards.';
    }

    function closeSheet() {
        if (!open) return;
        var s = open; open = null; if (s._lb && s._lb.isOpen()) $('.ps-lb', s).hidden = true;
        function done() { s.hidden = true; s.classList.remove('closing', 'anim', 'from'); backdrop.hidden = true; document.body.classList.remove('ps-lock'); setInert(false); if (trigger && trigger.focus) trigger.focus({ preventScroll: true }); }
        if (REDUCED) { done(); return; }
        s.classList.add('closing'); setTimeout(done, 240);
    }

    document.addEventListener('click', function (e) {
        var b = e.target.closest('[data-open]');
        if (b) { e.preventDefault(); openSheet(b.getAttribute('data-open'), b); return; }
        if (e.target.closest('[data-close]')) { closeSheet(); return; }
        if (e.target === backdrop) { closeSheet(); return; }
        var ps = e.target.closest('.ps');
        if (ps && !e.target.closest('.ps-sheet')) { closeSheet(); return; }
        var card = e.target.closest('.prod');
        if (card && !open && !e.target.closest('a, button')) openSheet(card.id, card.querySelector('[data-open]'));
    });
    document.addEventListener('keydown', function (e) {
        if (!open) return;
        var L = open._lb && open._lb.isOpen() ? open._lb : null;
        if (L && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); L.step(e.key === 'ArrowRight' ? 1 : -1); return; }
        if (e.key === 'Escape') { e.preventDefault(); if (L) L.close(); else closeSheet(); return; }
        if (e.key === 'Tab') {   // keep focus inside the sheet
            var f = $$('button:not([disabled]), a[href], [tabindex="0"]', L ? $('.ps-lb', open) : open).filter(function (el) { return el.offsetParent !== null && !el.closest('[hidden]'); });
            if (!f.length) return;
            var first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    // ---------- Tabs
    function showTab(s, key) {
        $$('.ps-tabs [role="tab"]', s).forEach(function (t) { var on = t.getAttribute('data-tab') === key; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; });
        $$('.ps-panel', s).forEach(function (p) { p.hidden = p.getAttribute('data-tab') !== key; });
        var body = $('.ps-body', s); if (body) { body.style.scrollBehavior = 'auto'; body.scrollTop = 0; body.style.scrollBehavior = ''; }
    }
    $$('.ps').forEach(function (s) {
        var tabs = $$('.ps-tabs [role="tab"]', s);
        tabs.forEach(function (t, i) {
            t.addEventListener('click', function () { showTab(s, t.getAttribute('data-tab')); });
            t.addEventListener('keydown', function (e) {
                var n = null;
                if (e.key === 'ArrowRight') n = (i + 1) % tabs.length; else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
                if (n !== null) { e.preventDefault(); tabs[n].focus(); showTab(s, tabs[n].getAttribute('data-tab')); }
            });
        });

        // modules: pick one on the left, see its verbs on the right
        $$('.ps-mod', s).forEach(function (m) {
            m.addEventListener('click', function () {
                var i = m.getAttribute('data-m');
                $$('.ps-mod', s).forEach(function (x) { x.classList.toggle('on', x === m); });
                $$('.ps-moddet', s).forEach(function (d) { d.hidden = d.getAttribute('data-m') !== i; });
                var det = $('.ps-moddet:not([hidden])', s), body = $('.ps-body', s); if (window.innerWidth < 721) { if (det) det.scrollIntoView({ block: 'nearest' }); } else if (body) { var dy = $('.ps-modules', s).getBoundingClientRect().top - body.getBoundingClientRect().top - 12; if (dy < 0) body.scrollTo({ top: Math.max(0, body.scrollTop + dy), behavior: REDUCED ? 'auto' : 'smooth' }); }
            });
        });


        // screenshots: thumbnails open a large viewer inside the sheet, with previous / next
        var lb = $('.ps-lb', s), shots = $$('.ps-shot', s), cur = 0;
        if (lb && shots.length) {
            var im = $('.ps-lb-img', lb), cb = $('figcaption b', lb), cs = $('figcaption span', lb), cn = $('figcaption em', lb);
            var show = function (i) {
                cur = i; var t = shots[i], src = $('img', t);
                im.src = src.getAttribute('src'); im.alt = src.getAttribute('alt');
                cb.textContent = $('b', t).textContent; cs.textContent = $$('span', t)[1].textContent; cn.textContent = (i + 1) + ' of ' + shots.length;
            };
            s._lb = {
                open: function (i) { show(i); lb.hidden = false; $('.ps-lb-x', lb).focus({ preventScroll: true }); },
                close: function () { lb.hidden = true; if (shots[cur]) shots[cur].focus({ preventScroll: true }); },
                step: function (d) { show((cur + d + shots.length) % shots.length); },
                isOpen: function () { return !lb.hidden; }
            };
            shots.forEach(function (t, i) { t.addEventListener('click', function () { s._lb.open(i); }); });
            $('[data-lbprev]', lb).addEventListener('click', function () { s._lb.step(-1); });
            $('[data-lbnext]', lb).addEventListener('click', function () { s._lb.step(1); });
            $('[data-lbclose]', lb).addEventListener('click', function () { s._lb.close(); });
            lb.addEventListener('click', function (e) { if (e.target === lb) s._lb.close(); });
            var tx = null;
            lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
            lb.addEventListener('touchend', function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 50) s._lb.step(dx < 0 ? 1 : -1); });
        }

        // concept map: select a box, light up what it connects to, explain it
        var svg = $('.ps-onto', s); if (!svg) return;
        var nodes = $$('.ps-node', svg), edges = $$('.ps-edge', svg), box = $('.ps-ond-box', s);
        function pick(k) {
            nodes.forEach(function (n) { n.classList.remove('hi', 'cur'); }); edges.forEach(function (g) { g.classList.remove('hi'); });
            if (k) {
                svg.classList.add('sel');
                nodes.forEach(function (n) { if (n.getAttribute('data-k') === k) n.classList.add('hi', 'cur'); });
                edges.forEach(function (g) {
                    var a = g.getAttribute('data-a'), b = g.getAttribute('data-b');
                    if (a === k || b === k) { g.classList.add('hi'); nodes.forEach(function (n) { var nk = n.getAttribute('data-k'); if (nk === a || nk === b) n.classList.add('hi'); }); }
                });
            } else svg.classList.remove('sel');
            $$('.ps-ond', box).forEach(function (d) { d.hidden = k ? d.getAttribute('data-k') !== k : !d.classList.contains('ps-ond-intro'); });
        }
        nodes.forEach(function (n) {
            n.addEventListener('click', function (e) { e.stopPropagation(); pick(n.getAttribute('data-k')); });
            n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(n.getAttribute('data-k')); } });
        });
        svg.addEventListener('click', function () { pick(null); });
        pick(null);
    });

    // open from a link such as products.html#wholesale
    var h = (location.hash || '').slice(1);
    if (h && $('#ps-' + h)) setTimeout(function () { openSheet(h, null); }, 300);
})();

// Services page. products.js does the opening, tabs and the role list; this adds two small things:
// 1) a button with data-tab (for example data-open="custom" data-tab="solutions") opens the sheet straight on that tab;
// 2) the role-family chips filter the role list on the Talent sheet.
(function () {
    var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

    document.addEventListener('click', function (e) {
        var b = e.target.closest('[data-open][data-tab]'); if (!b) return;
        var s = $('#ps-' + b.getAttribute('data-open')), t = s && $('.ps-tabs [data-tab="' + b.getAttribute('data-tab') + '"]', s);
        if (t) setTimeout(function () { t.click(); }, 0);
    });

    $$('.ps').forEach(function (s) {
        var chips = $$('.sv-fam', s); if (!chips.length) return;
        chips.forEach(function (c) {
            c.addEventListener('click', function () {
                var f = c.getAttribute('data-f');
                chips.forEach(function (x) { x.classList.toggle('on', x === c); });
                var first = null;
                $$('.ps-mod', s).forEach(function (m) { var show = f === 'all' || m.getAttribute('data-fam') === f; m.hidden = !show; if (show && !first) first = m; });
                var cur = $('.ps-mod.on', s); if ((!cur || cur.hidden) && first) first.click();
            });
        });
    });
})();

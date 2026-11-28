// How We Work: what is written on the walls and laptop screens. All of it is taken from the Invoice Management System (IMS)
// product sheet (scripts/products_ims.py): its real entities, relationships, features, modules, roles, permissions and journey.
// Figures (amounts, counts of invoices) are invented and every board that shows them says "Sample data". Customers are "Customer A..E".
// Each entry draws onto a 2D canvas context (x) of size w x h. Sizes scale with the width, so text stays the same on every board.
const FONT = 'Geist, "Helvetica Neue", Arial, sans-serif', MONO = '"SF Mono", Menlo, Consolas, "Courier New", monospace';
const INK = '#0f1730', SOFT = 'rgba(15,23,48,.62)', BLUE = '#2457f5', TEAL = '#0b8678', ORANGE = '#f28a1e', PURPLE = '#7a4cf0';
const GROUP = { people: PURPLE, sales: TEAL, master: ORANGE, trust: BLUE };

function rr(x, X, Y, W, H, R) { x.beginPath(); if (x.roundRect) x.roundRect(X, Y, W, H, R); else x.rect(X, Y, W, H); }
function T(x, s, X, Y, px, col, wt, maxW, al, font) {
    x.font = (wt || 600) + ' ' + px + 'px ' + (font || FONT);
    if (maxW) while (x.measureText(s).width > maxW && px > 6) { px -= 1; x.font = (wt || 600) + ' ' + px + 'px ' + (font || FONT); }
    x.fillStyle = col; x.textAlign = al || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, X, Y); return px;
}
function wrap(x, s, X, Y, maxW, px, lh, col, wt, maxLines, font) {   // returns the y after the last line
    x.font = (wt || 500) + ' ' + px + 'px ' + (font || FONT); x.fillStyle = col; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    const words = s.split(' '); let line = '', n = 0;
    for (let i = 0; i < words.length; i++) {
        const t = line ? line + ' ' + words[i] : words[i];
        if (x.measureText(t).width > maxW && line) { n++; if (maxLines && n >= maxLines) { x.fillText(line + '...', X, Y); return Y + lh; } x.fillText(line, X, Y); Y += lh; line = words[i]; } else line = t;
    }
    if (line) { x.fillText(line, X, Y); Y += lh; } return Y;
}
function bg(x, w, h, c) { x.fillStyle = c; x.fillRect(0, 0, w, h); }
function head(x, w, h, title, sub, col, dark) {   // title strip at the top of a board; returns the height used
    const u = w / 1000, H = 78 * u;
    x.fillStyle = col; x.fillRect(0, 0, w, H);
    T(x, title, 28 * u, H * 0.64, 38 * u, '#fff', 800, w * 0.62);
    if (sub) T(x, sub, w - 28 * u, H * 0.62, 24 * u, 'rgba(255,255,255,.85)', 600, w * 0.34, 'right');
    return H;
}
function tag(x, s, X, Y, px, col) {   // small rounded label
    x.font = '700 ' + px + 'px ' + FONT; const W = x.measureText(s).width + px * 1.1; rr(x, X, Y - px, W, px * 1.55, px * 0.5); x.fillStyle = col; x.fill(); T(x, s, X + px * 0.55, Y + px * 0.12, px, '#fff', 700); return W;
}
const money = n => 'PKR ' + n.toLocaleString('en-US');

const STICKY = ['#fff1a6', '#c9f2d9', '#ffd1e0', '#cfe0ff', '#ffd9a6'];

export const IMS = {
    // ---- 1 Discovery studio: what the customer said, as sticky notes (real problem statements) + the two people who use it
    needs(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#fbfcff'); const H = head(x, w, h, 'WHAT WE HEARD', 'Invoice Management System · Discovery', BLUE);
        const items = [['Numbers and totals by hand', 'Numbers in order, no gaps. Totals calculated on the server.'], ['Who has paid, who has not', 'Record a payment once, split it over invoices.'], ['Old debts get forgotten', 'Ageing: current, 1-30, 31-60, 61-90, over 90 days.'], ['The team finds out late', 'Pop-up and email with the PDF when an invoice is issued.'], ['No trail when things change', 'Every change on record: who, when, before and after.']];
        const cw = 124 * u, gap = 8 * u, x0 = 24 * u, y0 = H + 26 * u, ch = h - y0 - 22 * u;
        items.forEach((it, i) => {
            const X = x0 + i * (cw + gap), Y = y0 + (i % 2) * 8 * u; x.save(); x.translate(X + cw / 2, Y + ch / 2); x.rotate(((i % 3) - 1) * 0.025); x.translate(-cw / 2, -ch / 2);
            x.fillStyle = 'rgba(15,23,48,.12)'; rr(x, 4 * u, 6 * u, cw, ch, 6 * u); x.fill(); x.fillStyle = STICKY[i]; rr(x, 0, 0, cw, ch, 6 * u); x.fill();
            T(x, 'NEED ' + (i + 1), 10 * u, 22 * u, 13 * u, 'rgba(15,23,48,.5)', 700, null, 'left', MONO);
            const ey = wrap(x, it[0], 10 * u, 48 * u, cw - 20 * u, 19 * u, 22 * u, INK, 800, 3);
            wrap(x, it[1], 10 * u, ey + 6 * u, cw - 20 * u, 14 * u, 17 * u, 'rgba(15,23,48,.78)', 500, 6); x.restore();
        });
        const X = x0 + 5 * (cw + gap) + 10 * u, W = w - X - 20 * u;
        T(x, 'WHO USES IT', X, y0 + 18 * u, 18 * u, SOFT, 700, null, 'left', MONO);
        [['Administrator', 'Issues invoices, records payments.', PURPLE], ['Assistant', 'Reads everything, downloads invoice PDFs.', TEAL]].forEach((p, i) => {
            const Y = y0 + 40 * u + i * ((ch - 40 * u) / 2); rr(x, X, Y, W, (ch - 40 * u) / 2 - 10 * u, 8 * u); x.fillStyle = p[2]; x.fill();
            T(x, p[0], X + 14 * u, Y + 32 * u, 24 * u, '#fff', 800, W - 28 * u); wrap(x, p[1], X + 14 * u, Y + 56 * u, W - 28 * u, 16 * u, 20 * u, 'rgba(255,255,255,.9)', 500, 4);
        });
    },
    // ---- 2 Architecture room, left: the entity model (ERD) with its twelve relationships, the product's own layout
    erd(x, w, h) {
        const u = w / 1000; x.fillStyle = '#0f3478'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(255,255,255,.09)'; x.lineWidth = 1; for (let i = 0; i < w; i += 24 * u) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); } for (let i = 0; i < h; i += 24 * u) { x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); }
        T(x, 'ENTITY MODEL', 22 * u, 40 * u, 30 * u, '#fff', 800); T(x, 'Invoice Management System · 13 entities · 12 relationships', 22 * u, 66 * u, 17 * u, 'rgba(255,255,255,.7)', 500, w * 0.7);
        const E = { user: ['User', 110, 170, 'people'], role: ['Role', 110, 310, 'people'], audit: ['Audit entry', 110, 50, 'trust'], customer: ['Customer', 380, 50, 'master'], invoice: ['Invoice', 380, 170, 'sales'], document: ['PDF document', 380, 310, 'trust'], receipt: ['Receipt', 380, 440, 'sales'], contact: ['Contact and address', 640, 50, 'master'], line: ['Invoice line', 640, 170, 'sales'], term: ['Payment term', 640, 310, 'master'], alloc: ['Allocation', 640, 440, 'sales'], item: ['Product or service', 890, 170, 'master'], series: ['Number series', 890, 310, 'master'] };
        const ED = [['user', 'audit', 'leaves'], ['user', 'role', 'has'], ['user', 'invoice', 'issues'], ['invoice', 'customer', 'is for'], ['customer', 'contact', 'has'], ['invoice', 'line', 'contains'], ['line', 'item', 'uses'], ['invoice', 'document', 'produces'], ['receipt', 'alloc', 'is split into'], ['alloc', 'invoice', 'pays'], ['invoice', 'term', 'due by'], ['invoice', 'series', 'numbered from']];
        const sx = v => (60 + v * 0.86) * u * (w / 1000 > 0 ? 1 : 1) * (1000 / 1000), top = 96 * u, sy = v => top + (v - 50) * ((h - top - 70 * u) / 420) + 22 * u;
        const px = v => 30 * u + (v - 110) * ((w - 60 * u - 164 * u) / 780) + 82 * u;
        const bw = 164 * u, bh = 46 * u;
        x.lineWidth = 2.4 * u; x.font = '600 ' + 14 * u + 'px ' + FONT;
        ED.forEach(e => {
            const a = E[e[0]], b = E[e[1]], ax = px(a[1]), ay = sy(a[2]), bx = px(b[1]), by = sy(b[2]); x.strokeStyle = '#a9d0ff'; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
            const ang = Math.atan2(by - ay, bx - ax), dx = Math.abs(Math.cos(ang)) > 0.001 ? (bw / 2) / Math.abs(Math.cos(ang)) : 1e9, dy = Math.abs(Math.sin(ang)) > 0.001 ? (bh / 2) / Math.abs(Math.sin(ang)) : 1e9, d = Math.min(dx, dy) + 4 * u, tx = bx - Math.cos(ang) * d, ty = by - Math.sin(ang) * d;
            x.fillStyle = '#a9d0ff'; x.beginPath(); x.moveTo(tx, ty); x.lineTo(tx - Math.cos(ang - 0.4) * 13 * u, ty - Math.sin(ang - 0.4) * 13 * u); x.lineTo(tx - Math.cos(ang + 0.4) * 13 * u, ty - Math.sin(ang + 0.4) * 13 * u); x.fill();
            const mx = (ax + bx) / 2, my = (ay + by) / 2, lw = x.measureText(e[2]).width + 12 * u; x.fillStyle = '#0f3478'; x.fillRect(mx - lw / 2, my - 11 * u, lw, 22 * u); T(x, e[2], mx, my + 5 * u, 14 * u, '#d7eaff', 600, null, 'center');
        });
        Object.keys(E).forEach(k => { const e = E[k], X = px(e[1]) - bw / 2, Y = sy(e[2]) - bh / 2; x.fillStyle = 'rgba(0,0,0,.28)'; rr(x, X + 3 * u, Y + 4 * u, bw, bh, 7 * u); x.fill(); x.fillStyle = '#f7faff'; rr(x, X, Y, bw, bh, 7 * u); x.fill(); x.fillStyle = GROUP[e[3]]; rr(x, X, Y, 9 * u, bh, 5 * u); x.fill(); T(x, e[0], X + 18 * u, Y + bh * 0.64, 19 * u, INK, 800, bw - 26 * u); });
        [['People', PURPLE], ['Money', TEAL], ['Master data', ORANGE], ['Trust', BLUE]].forEach((l, i) => { const X = 24 * u + i * 150 * u, Y = h - 22 * u; x.fillStyle = l[1]; rr(x, X, Y - 14 * u, 18 * u, 18 * u, 4 * u); x.fill(); T(x, l[0], X + 26 * u, Y + 1 * u, 16 * u, '#fff', 600); });
    },
    // ---- 2 Architecture room, right: the eleven modules and what each lets a person do
    modmap(x, w, h) {
        const u = w / 1000; x.fillStyle = '#0f3478'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(255,255,255,.09)'; for (let i = 0; i < w; i += 24 * u) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); } for (let i = 0; i < h; i += 24 * u) { x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); }
        T(x, 'THE ELEVEN MODULES', 22 * u, 40 * u, 30 * u, '#fff', 800); T(x, 'Who can do what, screen by screen', 22 * u, 66 * u, 17 * u, 'rgba(255,255,255,.7)', 500);
        const M = [['Invoices', 'Create, issue, follow', 'Admin writes, assistant reads'], ['Received amounts', 'Record money that comes in', 'Admin writes, assistant reads'], ['Customers', 'Who you invoice', 'Ageing and statement'], ['Products and services', 'What you sell, with price', 'Fills invoice lines'], ['Dashboard', 'The books on one screen', 'Everyone'], ['Notifications', 'Everyone who should know', 'Pop-up and email'], ['Users and roles', 'Who can do what', 'Administrator'], ['Settings', 'Looks and counts like you', 'Branding, numbering'], ['Import and export', 'Bring data in, take it out', '1 JSON, 11 CSV'], ['Audit trail', 'The memory of the system', 'Append-only'], ['My account', 'Keep your sign-in safe', 'Everyone']];
        const cols = 4, gx = 12 * u, X0 = 22 * u, Y0 = 92 * u, cw = (w - 2 * X0 - (cols - 1) * gx) / cols, rows = 3, ch = (h - Y0 - 18 * u - (rows - 1) * gx) / rows;
        M.forEach((m, i) => { const c = i % cols, r = Math.floor(i / cols), X = X0 + c * (cw + gx), Y = Y0 + r * (ch + gx); x.fillStyle = 'rgba(255,255,255,.1)'; rr(x, X, Y, cw, ch, 8 * u); x.fill(); x.strokeStyle = 'rgba(190,220,255,.55)'; x.lineWidth = 2 * u; x.stroke(); T(x, String(i + 1).padStart(2, '0'), X + 12 * u, Y + 26 * u, 15 * u, '#8fc0ff', 700, null, 'left', MONO); T(x, m[0], X + 12 * u, Y + 56 * u, 22 * u, '#fff', 800, cw - 22 * u); wrap(x, m[1], X + 12 * u, Y + 82 * u, cw - 22 * u, 16 * u, 20 * u, 'rgba(255,255,255,.82)', 500, 2); T(x, m[2], X + 12 * u, Y + ch - 12 * u, 14 * u, '#a9d0ff', 600, cw - 22 * u); });
    },
    // ---- 3 Pilot bay: a sprint board made of real features
    kanban(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#fbfcff'); const H = head(x, w, h, 'PILOT BOARD', 'Invoice Management System · sample sprint', '#0b8678');
        const cols = [['TO DO', '#7a4cf0', ['Import from the old app', 'Database backups and restore drill', 'Works on a phone, offline page']], ['DOING', '#f28a1e', ['Split one payment across invoices', 'Statement with running balance', 'Email with the PDF attached']], ['DONE', '#0b8678', ['Numbers that never skip', 'Create and edit invoices', 'Audit trail of every change', 'Reverse a receipt with a reason']]];
        const cw = w / 3;
        cols.forEach((c, i) => {
            const X = i * cw; T(x, c[0], X + 24 * u, H + 40 * u, 24 * u, c[1], 800); x.fillStyle = c[1]; x.fillRect(X + 24 * u, H + 50 * u, 70 * u, 4 * u); if (i) { x.fillStyle = '#e8ecf8'; x.fillRect(X, H + 14 * u, 3 * u, h - H - 28 * u); }
            c[2].forEach((s, k) => { const Y = H + 74 * u + k * 84 * u; x.fillStyle = 'rgba(15,23,48,.1)'; rr(x, X + 26 * u, Y + 4 * u, cw - 52 * u, 70 * u, 8 * u); x.fill(); x.fillStyle = STICKY[(i + k) % 4]; rr(x, X + 24 * u, Y, cw - 52 * u, 70 * u, 8 * u); x.fill(); wrap(x, s, X + 40 * u, Y + 31 * u, cw - 84 * u, 22 * u, 27 * u, INK, 700, 2); T(x, i === 2 ? 'done' : i === 1 ? 'in progress' : 'planned', X + 40 * u, Y + 62 * u, 14 * u, 'rgba(15,23,48,.5)', 600, null, 'left', MONO); });
        });
    },
    // ---- 3 Pilot bay: how the product is released
    roadmap(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#fbfcff'); head(x, w, h, 'RELEASE PLAN', 'IMS', BLUE);
        const steps = [['1', 'Invoices', 'Create, numbers that never skip', '#7a4cf0'], ['2', 'Receipts', 'Record, split, statuses move', '#2457f5'], ['3', 'Customers', 'Ageing and statements', '#0b8678'], ['4', 'Trust', 'Notify the team, audit trail', '#f28a1e']];
        const lineY = h * 0.5, X0 = 130 * u, X1 = w - 130 * u; x.strokeStyle = '#2457f5'; x.lineWidth = 7 * u; x.lineCap = 'round'; x.beginPath(); x.moveTo(X0 - 40 * u, lineY); x.lineTo(X1 + 40 * u, lineY); x.stroke();
        steps.forEach((s, i) => { const cx = X0 + i * (X1 - X0) / 3, up = i % 2 === 0; x.fillStyle = s[3]; x.beginPath(); x.arc(cx, lineY, 26 * u, 0, 7); x.fill(); T(x, s[0], cx, lineY + 11 * u, 32 * u, '#fff', 800, null, 'center'); const Y = up ? lineY - 150 * u : lineY + 52 * u, W = 200 * u; rr(x, cx - W / 2, Y, W, 100 * u, 8 * u); x.fillStyle = 'rgba(15,23,48,.06)'; x.fill(); T(x, s[1], cx, Y + 36 * u, 26 * u, s[3], 800, W - 16 * u, 'center'); wrap(x, s[2], cx - W / 2 + 14 * u, Y + 62 * u, W - 28 * u, 18 * u, 22 * u, INK, 500, 2); });
    },
    // ---- meeting room 1 and the boardroom: the journey of an invoice, and the brief
    journey(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#fbfcff'); head(x, w, h, 'THE JOURNEY OF AN INVOICE', 'Demo script', BLUE);
        const st = [['Created and issued', 'Pick a customer, add lines. The number is assigned and the totals are calculated on the server.', '#2457f5'], ['Partly paid', 'A receipt is recorded and split across invoices. The status moves by itself.', '#f28a1e'], ['Paid', 'The last receipt settles it. Everything stays in the audit trail.', '#0b8678']];
        const gap = 36 * u, cw = (w - 60 * u - 2 * gap) / 3, Y = 130 * u, ch = h - Y - 40 * u;
        st.forEach((s, i) => { const X = 30 * u + i * (cw + gap); x.fillStyle = 'rgba(15,23,48,.07)'; rr(x, X, Y, cw, ch, 12 * u); x.fill(); x.fillStyle = s[2]; rr(x, X, Y, cw, 8 * u, 4 * u); x.fill(); x.beginPath(); x.arc(X + 42 * u, Y + 56 * u, 24 * u, 0, 7); x.fill(); T(x, String(i + 1), X + 42 * u, Y + 66 * u, 28 * u, '#fff', 800, null, 'center'); T(x, s[0], X + 80 * u, Y + 66 * u, 30 * u, INK, 800, cw - 92 * u); wrap(x, s[1], X + 22 * u, Y + 120 * u, cw - 44 * u, 21 * u, 29 * u, 'rgba(15,23,48,.8)', 500, 6); if (i < 2) { x.fillStyle = '#2457f5'; x.beginPath(); x.moveTo(X + cw + 6 * u, Y + ch / 2 - 18 * u); x.lineTo(X + cw + gap - 6 * u, Y + ch / 2); x.lineTo(X + cw + 6 * u, Y + ch / 2 + 18 * u); x.fill(); } });
    },
    brief(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#fbfcff'); x.fillStyle = '#1b1233'; x.fillRect(0, 0, w * 0.34, h);
        T(x, 'PRODUCT BRIEF', 28 * u, 56 * u, 20 * u, '#e9b949', 700, null, 'left', MONO); wrap(x, 'Invoice Management System', 28 * u, 106 * u, w * 0.34 - 50 * u, 36 * u, 42 * u, '#fff', 800, 3); wrap(x, 'Create invoices, record the money that comes in, and always know who owes what.', 28 * u, 236 * u, w * 0.34 - 50 * u, 17 * u, 22 * u, 'rgba(255,255,255,.8)', 500, 4);
        const g = [['2', 'roles'], ['14', 'permissions'], ['6', 'currencies'], ['5', 'ways to pay'], ['5', 'ageing columns'], ['11', 'CSV exports']], X0 = w * 0.34 + 36 * u, cw = (w - X0 - 30 * u) / 3, ch = (h - 60 * u) / 2;
        g.forEach((s, i) => { const X = X0 + (i % 3) * cw, Y = 30 * u + Math.floor(i / 3) * ch; T(x, s[0], X, Y + ch * 0.55, 90 * u, [BLUE, TEAL, ORANGE, PURPLE, '#d6336c', '#0b2a22'][i], 800, cw - 20 * u); T(x, s[1], X, Y + ch * 0.55 + 34 * u, 24 * u, SOFT, 600, cw - 20 * u); });
    },
    // ---- meeting room 2: invoiced per month (sample data)
    monthly(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#0e1736'); T(x, 'INVOICED PER MONTH', 28 * u, 52 * u, 32 * u, '#fff', 800); tag(x, 'Sample data', w - 200 * u, 50 * u, 19 * u, '#f28a1e');
        const n = 12, vals = []; for (let i = 0; i < n; i++) vals.push(18 + i * 2.6 + 7 * Math.sin(i / 1.4));
        const X0 = 70 * u, X1 = w - 36 * u, Y0 = 100 * u, Y1 = h - 56 * u, mx = Math.max(...vals) + 4, mn = 0;
        x.strokeStyle = 'rgba(255,255,255,.14)'; x.lineWidth = 1.5 * u; for (let k = 0; k <= 4; k++) { const Y = Y1 - k * (Y1 - Y0) / 4; x.beginPath(); x.moveTo(X0, Y); x.lineTo(X1, Y); x.stroke(); T(x, Math.round(mx * k / 4 * 10) + 'k', X0 - 10 * u, Y + 6 * u, 17 * u, 'rgba(255,255,255,.55)', 600, null, 'right'); }
        const pts = vals.map((v, i) => [X0 + 30 * u + i * (X1 - X0 - 50 * u) / (n - 1), Y1 - (v - mn) / (mx - mn) * (Y1 - Y0)]);
        const gr = x.createLinearGradient(0, Y0, 0, Y1); gr.addColorStop(0, 'rgba(94,234,212,.4)'); gr.addColorStop(1, 'rgba(94,234,212,0)'); x.fillStyle = gr; x.beginPath(); x.moveTo(pts[0][0], Y1); pts.forEach(p => x.lineTo(p[0], p[1])); x.lineTo(pts[n - 1][0], Y1); x.fill();
        x.strokeStyle = '#5eead4'; x.lineWidth = 5 * u; x.lineJoin = 'round'; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.stroke(); x.fillStyle = '#ffd36a'; x.beginPath(); x.arc(pts[n - 1][0], pts[n - 1][1], 9 * u, 0, 7); x.fill();
        ['Dec', 'Feb', 'Apr', 'Jun', 'Aug', 'Oct'].forEach((m, i) => T(x, m, pts[i * 2][0], h - 22 * u, 17 * u, 'rgba(255,255,255,.6)', 600, null, 'center'));
    },
    // ---- engineering floor
    code(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#0e1736'); x.fillStyle = '#16204a'; x.fillRect(0, 0, w, 44 * u); [['#ff5f57', 0], ['#febc2e', 1], ['#28c840', 2]].forEach(d => { x.fillStyle = d[0]; x.beginPath(); x.arc(24 * u + d[1] * 24 * u, 22 * u, 7 * u, 0, 7); x.fill(); }); T(x, 'invoice-totals.ts', 120 * u, 29 * u, 19 * u, '#bcd0ff', 600, null, 'left', MONO); T(x, 'illustrative', w - 20 * u, 29 * u, 15 * u, 'rgba(255,255,255,.4)', 600, null, 'right', MONO);
        const L = [[['// totals are always calculated on the server', '#6b7bb0']], [['export function ', '#ff9fb8'], ['invoiceTotals', '#7aa2ff'], ['(lines, discount, taxRate) {', '#e8ecf8']], [['  const subtotal = ', '#e8ecf8'], ['sum', '#7aa2ff'], ['(lines.map(l => l.qty * l.unitPrice))', '#e8ecf8']], [['  const afterDiscount = subtotal - ', '#e8ecf8'], ['discount', '#ffd36a']], [['  const tax = ', '#e8ecf8'], ['round2', '#7aa2ff'], ['(afterDiscount * taxRate)', '#e8ecf8']], [['  return { subtotal, discount, tax,', '#e8ecf8']], [['           total: afterDiscount + tax }', '#e8ecf8']], [['}', '#e8ecf8']], [['', '#fff']], [['// the next number never skips', '#6b7bb0']], [['const ', '#ff9fb8'], ['number = ', '#e8ecf8'], ['await ', '#ff9fb8'], ['series.next', '#7aa2ff'], ['(\'invoice\')   ', '#e8ecf8'], ['// INV-0014', '#5eead4']]];
        const px = 21 * u, lh = 28 * u; L.forEach((ln, i) => { const Y = 78 * u + i * lh; T(x, String(i + 1), 44 * u, Y, 17 * u, 'rgba(255,255,255,.28)', 500, null, 'right', MONO); let X = 66 * u; ln.forEach(seg => { x.font = '500 ' + px + 'px ' + MONO; x.fillStyle = seg[1]; x.textAlign = 'left'; x.fillText(seg[0], X, Y); X += x.measureText(seg[0]).width; }); });
    },
    build(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#12204f'); T(x, 'BUILD AND CHECKS', 28 * u, 52 * u, 32 * u, '#bfe0ff', 800); tag(x, 'Sample run', w - 190 * u, 50 * u, 19 * u, '#0b8678');
        const S = [['Install', '41 s'], ['Totals match to the cent', '12 tests'], ['Numbers never skip', '9 tests'], ['Over-payment is refused', '7 tests'], ['Same import refused twice', '5 tests'], ['Build', '1 m 08 s']];
        S.forEach((s, i) => { const Y = 92 * u + i * 46 * u; x.fillStyle = 'rgba(255,255,255,.07)'; rr(x, 28 * u, Y, w - 56 * u, 38 * u, 7 * u); x.fill(); x.fillStyle = '#5eead4'; x.beginPath(); x.arc(56 * u, Y + 19 * u, 11 * u, 0, 7); x.fill(); x.strokeStyle = '#0b2a22'; x.lineWidth = 3.4 * u; x.lineCap = 'round'; x.beginPath(); x.moveTo(50 * u, Y + 19 * u); x.lineTo(55 * u, Y + 24 * u); x.lineTo(63 * u, Y + 14 * u); x.stroke(); T(x, s[0], 82 * u, Y + 27 * u, 22 * u, '#fff', 600, w * 0.6); T(x, s[1], w - 44 * u, Y + 27 * u, 20 * u, '#8fc0ff', 600, null, 'right', MONO); });
    },
    ageing(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#0e1736'); T(x, 'WHO OWES WHAT, AND FOR HOW LONG', 28 * u, 50 * u, 28 * u, '#fff', 800, w * 0.6); tag(x, 'Sample data', w - 200 * u, 48 * u, 19 * u, '#f28a1e');
        const B = [['Current', 62], ['1-30 days', 34], ['31-60 days', 43], ['61-90 days', 0], ['Over 90', 0]], mx = 70, X0 = 40 * u, Y1 = h - 64 * u, Y0 = 120 * u, bw = (w - 2 * X0) / B.length;
        B.forEach((b, i) => { const bh = b[1] / mx * (Y1 - Y0), X = X0 + i * bw + bw * 0.16; x.fillStyle = ['#5eead4', '#ffd36a', '#ff9f43', '#ff7a90', '#ff5470'][i]; rr(x, X, Y1 - Math.max(bh, 4 * u), bw * 0.68, Math.max(bh, 4 * u), 8 * u); x.fill(); T(x, b[1] + 'k', X + bw * 0.34, Y1 - bh - 12 * u, 24 * u, '#fff', 800, null, 'center'); T(x, b[0], X + bw * 0.34, h - 28 * u, 19 * u, 'rgba(255,255,255,.7)', 600, bw * 0.9, 'center'); });
    },
    // ---- governance floor
    checksA(x, w, h) { checklist(x, w, h, 'SECURITY CHECKS', '#0b8678', ['Accounts lock for 15 minutes after five wrong passwords', 'Every page and action checked on the server', 'Sessions can be listed and signed out', 'Each business kept separate in the database', 'Export cells protected from formula tricks']); },
    checksB(x, w, h) { checklist(x, w, h, 'RELEASE CHECKS', '#2457f5', ['Totals match to the cent', 'Invoice numbers never skip', 'Over-payment is refused', 'Same import cannot run twice', 'Backup restores in the drill']); },
    audit(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#0b2a22'); T(x, 'AUDIT TRAIL', 28 * u, 52 * u, 34 * u, '#fff', 800); T(x, 'append-only: read, never edited or deleted', 28 * u, 80 * u, 17 * u, '#8fe0bc', 500, w * 0.6); tag(x, 'Sample data', w - 200 * u, 50 * u, 19 * u, '#f28a1e');
        const R = [['10:42', 'Administrator', 'Issued invoice', 'INV-0014'], ['10:51', 'Administrator', 'Recorded receipt', 'RC-0007'], ['11:03', 'Administrator', 'Edited invoice', 'INV-0012 v2'], ['11:20', 'Assistant', 'Downloaded PDF', 'INV-0014'], ['11:48', 'Administrator', 'Changed setting', 'Numbering'], ['12:05', 'Administrator', 'Reversed receipt', 'RC-0005']];
        const Y0 = 112 * u, rh = (h - Y0 - 20 * u) / R.length, cx = [28, 120, 330, 610].map(v => v * u);
        R.forEach((r, i) => { const Y = Y0 + i * rh; x.fillStyle = i % 2 ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.09)'; rr(x, 18 * u, Y, w - 36 * u, rh - 6 * u, 7 * u); x.fill(); const by = Y + rh / 2 + 6 * u; T(x, r[0], cx[0], by, 21 * u, '#8fe0bc', 600, null, 'left', MONO); T(x, r[1], cx[1], by, 22 * u, '#fff', 700, 200 * u); T(x, r[2], cx[2], by, 22 * u, '#d7f5e6', 500, 260 * u); T(x, r[3], cx[3], by, 22 * u, '#ffd36a', 700, w - cx[3] - 30 * u, 'left', MONO); });
    },
    // ---- mission control: three screens
    kpis(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#071033'); x.strokeStyle = 'rgba(94,234,212,.12)'; x.lineWidth = 1.5; for (let i = 1; i < 10; i++) { x.beginPath(); x.moveTo(w * i / 10, 0); x.lineTo(w * i / 10, h); x.stroke(); }
        T(x, 'DASHBOARD', 28 * u, 52 * u, 34 * u, '#5eead4', 800); tag(x, 'Sample data', w - 200 * u, 50 * u, 19 * u, '#f28a1e');
        const K = [['INVOICED', 412600, '14 invoices', '#7aa2ff'], ['OUTSTANDING', 138200, '5 open invoices', '#ffd36a'], ['OVERDUE', 42500, '2 overdue invoices', '#ff7a90']], gap = 18 * u, cw = (w - 56 * u - 2 * gap) / 3, Y = 96 * u;
        K.forEach((k, i) => { const X = 28 * u + i * (cw + gap); x.fillStyle = 'rgba(255,255,255,.06)'; rr(x, X, Y, cw, h - Y - 30 * u, 12 * u); x.fill(); x.fillStyle = k[3]; rr(x, X, Y, 8 * u, h - Y - 30 * u, 4 * u); x.fill(); T(x, k[0], X + 26 * u, Y + 46 * u, 19 * u, 'rgba(255,255,255,.6)', 700, null, 'left', MONO); T(x, 'PKR', X + 26 * u, Y + 108 * u, 24 * u, k[3], 700); T(x, k[1].toLocaleString('en-US'), X + 26 * u, Y + 168 * u, 52 * u, '#fff', 800, cw - 40 * u); T(x, k[2], X + 26 * u, Y + 214 * u, 21 * u, 'rgba(255,255,255,.7)', 500, cw - 40 * u); });
    },
    status(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#0e1736'); T(x, 'INVOICES BY STATUS', 28 * u, 50 * u, 30 * u, '#fff', 800); tag(x, 'Sample data', w - 200 * u, 48 * u, 19 * u, '#f28a1e');
        const P = [['Paid', 46, '#14b8a6'], ['Partly paid', 18, '#f28a1e'], ['Issued', 36, '#4f7cff']], cx = w * 0.27, cy = h * 0.56, r = Math.min(h * 0.3, w * 0.2); let a0 = -Math.PI / 2;
        P.forEach(p => { const a1 = a0 + p[1] / 100 * Math.PI * 2; x.strokeStyle = p[2]; x.lineWidth = r * 0.5; x.beginPath(); x.arc(cx, cy, r, a0, a1 - 0.02); x.stroke(); a0 = a1; }); T(x, '14', cx, cy + 14 * u, 52 * u, '#fff', 800, null, 'center'); T(x, 'invoices', cx, cy + 46 * u, 19 * u, 'rgba(255,255,255,.6)', 600, null, 'center');
        P.forEach((p, i) => { const Y = h * 0.34 + i * 84 * u, X = w * 0.55; x.fillStyle = p[2]; rr(x, X, Y - 26 * u, 28 * u, 28 * u, 7 * u); x.fill(); T(x, p[0], X + 44 * u, Y - 2 * u, 28 * u, '#fff', 700, w * 0.22); T(x, p[1] + '%', w - 36 * u, Y - 2 * u, 34 * u, p[2], 800, null, 'right'); });
    },
    latest(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#071033'); T(x, 'LATEST INVOICES', 28 * u, 52 * u, 32 * u, '#5eead4', 800); tag(x, 'Sample data', w - 200 * u, 50 * u, 19 * u, '#f28a1e');
        const R = [['INV-0014', 'Customer A', 'Issued', 'PKR 52,650.00', '#7aa2ff'], ['INV-0013', 'Customer B', 'Paid', 'PKR 31,590.00', '#5eead4'], ['INV-0012', 'Customer C', 'Partly paid', 'PKR 17,550.00', '#ffd36a'], ['INV-0011', 'Customer A', 'Paid', 'PKR 88,000.00', '#5eead4'], ['INV-0010', 'Customer D', 'Issued', 'PKR 42,500.00', '#7aa2ff']], Y0 = 96 * u, rh = (h - Y0 - 20 * u) / R.length;
        R.forEach((r, i) => { const Y = Y0 + i * rh; x.fillStyle = i % 2 ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.08)'; rr(x, 18 * u, Y, w - 36 * u, rh - 6 * u, 7 * u); x.fill(); const by = Y + rh / 2 + 7 * u; T(x, r[0], 36 * u, by, 22 * u, '#fff', 700, null, 'left', MONO); T(x, r[1], 230 * u, by, 22 * u, 'rgba(255,255,255,.85)', 500, 220 * u); tag(x, r[2], 470 * u, by - 2 * u, 18 * u, r[4] === '#ffd36a' ? '#b86a00' : r[4] === '#5eead4' ? '#0b8678' : '#2457f5'); T(x, r[3], w - 36 * u, by, 22 * u, '#fff', 700, 240 * u, 'right'); });
    },
    // ---- business floor
    funnel(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#fbfcff'); head(x, w, h, 'FROM ISSUED TO PAID', 'Sample data', '#2457f5');
        const F = [['Issued', '14 invoices', '#2457f5', 1], ['Partly paid', '8 invoices', '#4f7cff', 0.78], ['Paid', '6 invoices', '#14b8a6', 0.56]], Y0 = 108 * u, rh = (h - Y0 - 20 * u) / F.length;
        F.forEach((f, i) => { const W = (w - 60 * u) * f[3], X = (w - W) / 2, Y = Y0 + i * rh; x.fillStyle = f[2]; rr(x, X, Y, W, rh - 12 * u, 10 * u); x.fill(); T(x, f[0], w / 2, Y + (rh - 12 * u) * 0.46, 34 * u, '#fff', 800, W - 30 * u, 'center'); T(x, f[1], w / 2, Y + (rh - 12 * u) * 0.46 + 30 * u, 22 * u, 'rgba(255,255,255,.88)', 600, W - 30 * u, 'center'); });
    },
    methods(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#0e1736'); T(x, 'MONEY RECEIVED BY METHOD', 28 * u, 50 * u, 28 * u, '#fff', 800, w * 0.62); tag(x, 'Sample data', w - 200 * u, 48 * u, 19 * u, '#f28a1e');
        const M = [['Bank', 54, '#5eead4'], ['Cash', 27, '#ffd36a'], ['Cheque', 13, '#7aa2ff'], ['Card', 6, '#ff9fb8']], Y0 = 100 * u, rh = (h - Y0 - 16 * u) / M.length;
        M.forEach((m, i) => { const Y = Y0 + i * rh, bw = (w - 280 * u) * m[1] / 54; T(x, m[0], 28 * u, Y + rh * 0.58, 24 * u, '#fff', 700, 120 * u); x.fillStyle = 'rgba(255,255,255,.08)'; rr(x, 160 * u, Y + rh * 0.2, w - 280 * u, rh * 0.5, 8 * u); x.fill(); x.fillStyle = m[2]; rr(x, 160 * u, Y + rh * 0.2, Math.max(bw, 10 * u), rh * 0.5, 8 * u); x.fill(); T(x, m[1] + '%', w - 28 * u, Y + rh * 0.58, 26 * u, m[2], 800, null, 'right'); });
    },
    roles(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#fbfcff'); head(x, w, h, 'TWO ROLES, FOURTEEN PERMISSIONS', 'Checked on the server', '#7a4cf0');
        const R = [['Administrator', 'All 14', ['Create and edit invoices', 'Record and reverse receipts', 'Customers, items, users, settings', 'Import, export, audit trail'], '#7a4cf0'], ['Assistant', 'View only', ['See invoices, customers, payments', 'Download invoice PDFs', 'Get the invoice-issued alert', 'Cannot change or delete'], '#0b8678']], gap = 18 * u, cw = (w - 56 * u - gap) / 2, Y = 100 * u;
        R.forEach((r, i) => { const X = 28 * u + i * (cw + gap); x.fillStyle = r[3]; rr(x, X, Y, cw, h - Y - 22 * u, 12 * u); x.fill(); T(x, r[0], X + 20 * u, Y + 44 * u, 32 * u, '#fff', 800, cw * 0.6); T(x, r[1], X + cw - 20 * u, Y + 42 * u, 22 * u, 'rgba(255,255,255,.85)', 700, cw * 0.3, 'right', MONO); r[2].forEach((s, k) => T(x, '•  ' + s, X + 20 * u, Y + 90 * u + k * 34 * u, 21 * u, 'rgba(255,255,255,.95)', 500, cw - 36 * u)); });
    },
    // ---- academy
    training(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#fbfcff'); head(x, w, h, 'LEARN THE INVOICE MANAGEMENT SYSTEM', 'Lesson 1 of 4', BLUE);
        const L = [['1', 'Your first invoice', 'Pick a customer, add lines, issue it', '#2457f5'], ['2', 'Getting paid', 'Record a receipt, split it over invoices', '#0b8678'], ['3', 'Who owes what', 'Ageing and the customer statement', '#f28a1e'], ['4', 'Staying in control', 'Roles, notifications and the audit trail', '#7a4cf0']], Y0 = 106 * u, rh = (h - Y0 - 18 * u) / 4;
        L.forEach((l, i) => { const Y = Y0 + i * rh; x.fillStyle = i === 0 ? 'rgba(36,87,245,.1)' : 'rgba(15,23,48,.05)'; rr(x, 24 * u, Y, w - 48 * u, rh - 10 * u, 10 * u); x.fill(); x.fillStyle = l[3]; x.beginPath(); x.arc(70 * u, Y + (rh - 10 * u) / 2, 26 * u, 0, 7); x.fill(); T(x, l[0], 70 * u, Y + (rh - 10 * u) / 2 + 11 * u, 30 * u, '#fff', 800, null, 'center'); T(x, l[1], 118 * u, Y + (rh - 10 * u) * 0.46, 32 * u, INK, 800, w - 190 * u); T(x, l[2], 118 * u, Y + (rh - 10 * u) * 0.46 + 30 * u, 22 * u, SOFT, 500, w - 190 * u); });
    },
    launch(x, w, h) {
        const u = w / 1000; bg(x, w, h, '#2a1050'); const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#ff5f9e'); g.addColorStop(.5, '#ffd36a'); g.addColorStop(1, '#5eead4');
        T(x, 'LAUNCH DAY', w / 2, h * 0.5, 120 * u, g, 800, w * 0.9, 'center'); T(x, 'Invoice Management System is live', w / 2, h * 0.5 + 52 * u, 34 * u, '#fff', 600, w * 0.9, 'center'); T(x, 'INV-0001 is on its way', w / 2, h * 0.5 + 92 * u, 22 * u, 'rgba(255,255,255,.7)', 500, w * 0.9, 'center');
    },
    // ---- laptop screens (three kinds, shared out among the desks)
    lapInvoices(x, w, h) {
        const u = w / 512; bg(x, w, h, '#f6f8ff'); x.fillStyle = '#2457f5'; x.fillRect(0, 0, w, 34 * u); T(x, 'Invoices', 14 * u, 23 * u, 17 * u, '#fff', 800); T(x, 'New invoice', w - 12 * u, 23 * u, 12 * u, '#fff', 700, null, 'right');
        [['All', 1], ['Issued', 0], ['Partly paid', 0], ['Paid', 0], ['Overdue', 0]].forEach((c, i) => { x.fillStyle = c[1] ? '#2457f5' : '#e4e9fb'; rr(x, 12 * u + i * 62 * u, 44 * u, 56 * u, 20 * u, 10 * u); x.fill(); T(x, c[0], 12 * u + i * 62 * u + 28 * u, 58 * u, 11 * u, c[1] ? '#fff' : '#4a557a', 700, 50 * u, 'center'); });
        [['INV-0014', 'Customer A', 'Issued', '52,650.00', '#2457f5'], ['INV-0013', 'Customer B', 'Paid', '31,590.00', '#0b8678'], ['INV-0012', 'Customer C', 'Partly paid', '17,550.00', '#b86a00'], ['INV-0011', 'Customer A', 'Paid', '88,000.00', '#0b8678'], ['INV-0010', 'Customer D', 'Issued', '42,500.00', '#2457f5']].forEach((r, i) => { const Y = 78 * u + i * 44 * u; x.fillStyle = '#fff'; rr(x, 10 * u, Y, w - 20 * u, 38 * u, 6 * u); x.fill(); T(x, r[0], 18 * u, Y + 24 * u, 13 * u, INK, 800, 70 * u, 'left', MONO); T(x, r[1], 100 * u, Y + 24 * u, 13 * u, SOFT, 600, 90 * u); x.fillStyle = r[4]; rr(x, 202 * u, Y + 10 * u, 74 * u, 19 * u, 9 * u); x.fill(); T(x, r[2], 239 * u, Y + 24 * u, 11 * u, '#fff', 700, 66 * u, 'center'); T(x, r[3], w - 18 * u, Y + 24 * u, 13 * u, INK, 800, 100 * u, 'right'); });
    },
    lapDash(x, w, h) {
        const u = w / 512; bg(x, w, h, '#071033'); T(x, 'Dashboard', 14 * u, 26 * u, 17 * u, '#5eead4', 800); T(x, 'Sample data', w - 12 * u, 24 * u, 12 * u, '#ffb066', 700, null, 'right');
        [['Invoiced', '412,600', '#7aa2ff'], ['Outstanding', '138,200', '#ffd36a'], ['Overdue', '42,500', '#ff7a90']].forEach((k, i) => { const X = 10 * u + i * 166 * u; x.fillStyle = 'rgba(255,255,255,.07)'; rr(x, X, 40 * u, 158 * u, 62 * u, 8 * u); x.fill(); T(x, k[0], X + 10 * u, 58 * u, 11 * u, 'rgba(255,255,255,.6)', 700); T(x, k[1], X + 10 * u, 90 * u, 21 * u, k[2], 800, 140 * u); });
        const v = [18, 24, 22, 30, 28, 36, 40, 38, 47, 52, 49, 58]; x.strokeStyle = '#5eead4'; x.lineWidth = 3 * u; x.lineJoin = 'round'; x.beginPath(); v.forEach((a, i) => { const X = 20 * u + i * 43 * u, Y = h - 20 * u - a * 1.6 * u; i ? x.lineTo(X, Y) : x.moveTo(X, Y); }); x.stroke(); T(x, 'Invoiced per month', 14 * u, 124 * u, 12 * u, 'rgba(255,255,255,.6)', 700);
    },
    lapCode(x, w, h) {
        const u = w / 512; bg(x, w, h, '#0e1736'); x.fillStyle = '#16204a'; x.fillRect(0, 0, w, 22 * u); T(x, 'invoice-totals.ts', 10 * u, 16 * u, 11 * u, '#bcd0ff', 600, null, 'left', MONO);
        [[['const ', '#ff9fb8'], ['subtotal = ', '#e8ecf8'], ['sum', '#7aa2ff'], ['(lines)', '#e8ecf8']], [['const ', '#ff9fb8'], ['tax = ', '#e8ecf8'], ['round2', '#7aa2ff'], ['(net * rate)', '#e8ecf8']], [['return ', '#ff9fb8'], ['{ subtotal, tax,', '#e8ecf8']], [['  total }', '#e8ecf8']], [['', '#fff']], [['// next number never skips', '#6b7bb0']], [['await ', '#ff9fb8'], ['series.next', '#7aa2ff'], ["('invoice')", '#e8ecf8']], [['// INV-0014', '#5eead4']]].forEach((ln, i) => { let X = 12 * u; const Y = 44 * u + i * 20 * u; ln.forEach(s => { x.font = '500 ' + 13 * u + 'px ' + MONO; x.fillStyle = s[1]; x.textAlign = 'left'; x.fillText(s[0], X, Y); X += x.measureText(s[0]).width; }); });
    }
};
function checklist(x, w, h, title, col, items) {
    const u = w / 1000; bg(x, w, h, '#fbfcff'); const H = head(x, w, h, title, null, col), rh = (h - H - 20 * u) / items.length;
    items.forEach((s, i) => { const Y = H + 10 * u + i * rh, cy = Y + rh / 2; x.fillStyle = '#22a06b'; rr(x, 22 * u, cy - 20 * u, 40 * u, 40 * u, 9 * u); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 6 * u; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(31 * u, cy); x.lineTo(40 * u, cy + 9 * u); x.lineTo(54 * u, cy - 10 * u); x.stroke(); wrap(x, s, 80 * u, cy - 4 * u, w - 100 * u, 25 * u, 30 * u, INK, 600, 2); });
}

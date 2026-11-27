// How We Work, 3D: the "Your Partner Technologies" tower as a sales model. Real 3D agents (the same models as the home
// page, built through window.YPT_AG3D from agents3d.js), furniture modelled in code, one WebGL scene, one directed camera.
import * as THREE from './vendor/three.module.min.js';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';

const stage = document.getElementById('hww-stage');
if (stage) boot().catch(e => { console.error('hww3d', e); stage.classList.add('no3d'); document.dispatchEvent(new Event('ypt:hww3d-fail')); });

async function boot() {
    if (!window.YPT_AG3D) await Promise.race([new Promise(r => document.addEventListener('ypt:ag3d', r, { once: true })), new Promise(r => setTimeout(r, 5000))]);
    const AG = window.YPT_AG3D;
    if (!AG) { stage.classList.add('no3d'); document.dispatchEvent(new Event('ypt:hww3d-fail')); return; }
    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LOWQ = matchMedia('(max-width: 900px)').matches || (navigator.hardwareConcurrency || 8) <= 4;
    const FH = 3.6, FLOORS = 8, LIFTX = 22.6, AISLE = 2.7;
    // plan of each floor, ground up: width and depth taper towards the top
    const PLAN = [
        { w: 38, d: 12, name: 'Ground', c: 0xfff1de, wall: '#fff6ea', acc: 0xf28a1e },
        { w: 36, d: 11.5, name: 'Launch', c: 0xdfe6ff, wall: '#dfe8ff', acc: 0x5eead4 },
        { w: 34, d: 11, name: 'Govern', c: 0xe3f4ea, wall: '#eaf6ee', acc: 0x22a06b },
        { w: 32, d: 10.5, name: 'Build', c: 0xd6e0ff, wall: '#dbe5ff', acc: 0x7aa2ff },
        { w: 30, d: 10, name: 'Pilot', c: 0xdcf3ee, wall: '#e2f6f1', acc: 0x14b8a6 },
        { w: 28, d: 9.5, name: 'Discover', c: 0xe3ebff, wall: '#e9f0ff', acc: 0x2457f5 },
        { w: 26, d: 9, name: 'Business', c: 0xfbe9d3, wall: '#fbeede', acc: 0xf28a1e },
        { w: 22, d: 8.5, name: 'Top', c: 0xefe3ff, wall: '#ece4ff', acc: 0xe9b949 }
    ];

    // ------------------------------------------------------------------ renderer, scene, camera, lights
    const canvas = document.createElement('canvas'); canvas.id = 'hww-canvas'; stage.prepend(canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, LOWQ ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const DAY = gradientTex(['#e8eeff', '#f6efff', '#fdf1f6']), NIGHT = gradientTex(['#0b1026', '#1b1f4d', '#2c2457']);
    const scene = new THREE.Scene(); scene.background = DAY; scene.fog = new THREE.Fog(0xf1f0fb, 130, 280);
    const hemi = new THREE.HemisphereLight(0xffffff, 0xaeb9dc, 1.9); scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(-40, 60, 80); scene.add(key);
    const rim = new THREE.DirectionalLight(0xc5d3ff, 1.1); rim.position.set(60, 20, -50); scene.add(rim);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 600);
    const world = new THREE.Group(); scene.add(world);
    const tower = new THREE.Group(); world.add(tower);

    // ------------------------------------------------------------------ helpers
    const geoCache = {}, matCache = {};
    function rbox(w, h, d, r) { const k = [w, h, d, r].join('_'); return geoCache[k] || (geoCache[k] = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.01, h / 2.01, d / 2.01))); }
    function mat(color, o) { const k = color + JSON.stringify(o || {}); return matCache[k] || (matCache[k] = new THREE.MeshPhongMaterial(Object.assign({ color, shininess: 60, specular: 0x444a5c }, o))); }
    function glow(color) { const k = 'g' + color; return matCache[k] || (matCache[k] = new THREE.MeshBasicMaterial({ color })); }
    function box(parent, w, h, d, r, m, x, y, z) { const o = new THREE.Mesh(rbox(w, h, d, r), m); o.position.set(x, y, z); parent.add(o); return o; }
    function cyl(parent, rt, rb, h, m, x, y, z, seg) { const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 20), m); o.position.set(x, y, z); parent.add(o); return o; }
    function ball(parent, r, m, x, y, z) { const o = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), m); o.position.set(x, y, z); parent.add(o); return o; }
    function gradientTex(stops) {
        const c = document.createElement('canvas'); c.width = 4; c.height = 256; const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 256);
        stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); x.fillStyle = g; x.fillRect(0, 0, 4, 256);
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    }
    function ctex(w, h, draw) {
        const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
    }
    function rr(x, X, Y, W, H, R) { x.beginPath(); if (x.roundRect) x.roundRect(X, Y, W, H, R); else x.rect(X, Y, W, H); }
    const shadowTex = ctex(64, 64, (x) => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(20,30,70,.5)'); g.addColorStop(1, 'rgba(20,30,70,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    function blob(parent, x, z, w, d, y) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), shadowMat); m.rotation.x = -Math.PI / 2; m.position.set(x, (y || 0) + 0.02, z); m.renderOrder = 1; parent.add(m); return m; }
    const C = { wood: 0xe6c9a3, walnut: 0x8a5a3a, white: 0xf6f8ff, dark: 0x2b3358, steel: 0xaab4cf, blue: 0x4f7cff, teal: 0x14b8a6, orange: 0xf28a1e, green: 0x2f9e66, purple: 0x8b5cf6, pink: 0xec4899, yellow: 0xffd36a };
    const WOOD = () => mat(C.wood), WHITE = () => mat(C.white), DARK = () => mat(C.dark), STEEL = () => mat(C.steel);

    // ------------------------------------------------------------------ canvas art for screens and boards
    const art = {
        code(x, w, h) { x.fillStyle = '#0e1736'; x.fillRect(0, 0, w, h); const cols = ['#7aa2ff', '#5eead4', '#ffd36a', '#ff9fb8']; for (let i = 0; i < 12; i++) { x.fillStyle = cols[i % 4]; rr(x, 30 + (i % 3) * 26, 24 + i * (h / 14), 90 + (i * 53) % 260, 10, 5); x.fill(); } },
        build(x, w, h) { x.fillStyle = '#12204f'; x.fillRect(0, 0, w, h); x.fillStyle = '#bfe0ff'; x.font = '700 ' + h * .2 + 'px Geist, monospace'; x.fillText('BUILD  ▸ ▸ ▸', 36, h * .38); x.fillStyle = '#0a1230'; rr(x, 36, h * .55, w - 72, 36, 18); x.fill(); const g = x.createLinearGradient(36, 0, w - 36, 0); g.addColorStop(0, '#5eead4'); g.addColorStop(1, '#7aa2ff'); x.fillStyle = g; rr(x, 36, h * .55, (w - 72) * .72, 36, 18); x.fill(); },
        chart(x, w, h) { x.fillStyle = '#0e1736'; x.fillRect(0, 0, w, h); for (let i = 0; i < 6; i++) { const bh = (40 + (i * 37 % 60)) * h / 200; x.fillStyle = '#7aa2ff'; rr(x, 30 + i * (w / 7), h - 24 - bh, w / 11, bh, 6); x.fill(); } x.strokeStyle = '#5eead4'; x.lineWidth = 7; x.lineJoin = 'round'; x.beginPath(); x.moveTo(24, h * .7); [[.25, .5], [.45, .62], [.7, .26], [.95, .34]].forEach(p => x.lineTo(w * p[0], h * p[1])); x.stroke(); },
        kanban(x, w, h) {
            x.fillStyle = '#fbfcff'; x.fillRect(0, 0, w, h); const cols = [['TO DO', '#8b5cf6'], ['DOING', '#f28a1e'], ['DONE', '#22a06b']], cw = w / 3;
            cols.forEach((c, i) => { x.fillStyle = c[1]; x.font = '700 ' + h * .08 + 'px Geist, Arial'; x.fillText(c[0], i * cw + 22, h * .12); x.fillStyle = '#e8ecf8'; x.fillRect(i * cw + 10, h * .17, 2, h * .8); for (let k = 0; k < 4 - i + (i === 2 ? 1 : 0); k++) { x.fillStyle = ['#fff1a6', '#c9f2d9', '#ffd1e0', '#cfe0ff'][(i + k) % 4]; rr(x, i * cw + 22, h * .2 + k * h * .2, cw - 44, h * .15, 10); x.fill(); x.fillStyle = 'rgba(15,23,48,.35)'; x.fillRect(i * cw + 34, h * .245 + k * h * .2, (cw - 90) * (0.5 + (k * 31 % 50) / 100), 6); } });
        },
        sticky(x, w, h) {
            x.fillStyle = '#fbfcff'; x.fillRect(0, 0, w, h); x.fillStyle = '#2457f5'; x.beginPath(); x.arc(w / 2, h / 2, h * .13, 0, 7); x.fill(); x.fillStyle = '#fff'; x.font = '700 ' + h * .08 + 'px Geist, Arial'; x.textAlign = 'center'; x.fillText('NEED', w / 2, h / 2 + h * .03);
            const cols = ['#fff1a6', '#c9f2d9', '#ffd1e0', '#cfe0ff', '#ffd9a6'];
            for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283, px = w / 2 + Math.cos(a) * w * .36, py = h / 2 + Math.sin(a) * h * .34; x.strokeStyle = '#c3cdea'; x.lineWidth = 3; x.beginPath(); x.moveTo(w / 2, h / 2); x.lineTo(px, py); x.stroke(); x.fillStyle = cols[i % 5]; x.save(); x.translate(px, py); x.rotate((i % 3 - 1) * .08); rr(x, -w * .06, -h * .08, w * .12, h * .16, 6); x.fill(); x.fillStyle = 'rgba(15,23,48,.3)'; x.fillRect(-w * .045, -h * .03, w * .09, 4); x.fillRect(-w * .045, h * .015, w * .06, 4); x.restore(); }
        },
        blueprint(x, w, h) {
            x.fillStyle = '#143a8a'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(255,255,255,.13)'; x.lineWidth = 1; for (let i = 0; i < w; i += 24) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); } for (let i = 0; i < h; i += 24) { x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); }
            x.strokeStyle = '#bfe0ff'; x.fillStyle = 'rgba(191,224,255,.18)'; x.lineWidth = 4; [[.08, .12, .26, .24], [.4, .12, .22, .24], [.7, .12, .22, .24], [.2, .6, .26, .28], [.58, .6, .26, .28]].forEach(b => { rr(x, w * b[0], h * b[1], w * b[2], h * b[3], 8); x.fill(); x.stroke(); });
            [[.34, .24, .4, .24], [.62, .24, .7, .24], [.33, .36, .33, .6], [.52, .74, .58, .74], [.81, .36, .71, .6]].forEach(l => { x.beginPath(); x.moveTo(w * l[0], h * l[1]); x.lineTo(w * l[2], h * l[3]); x.stroke(); });
        },
        roadmap(x, w, h) { x.fillStyle = '#fbfcff'; x.fillRect(0, 0, w, h); x.strokeStyle = '#2457f5'; x.lineWidth = 8; x.beginPath(); x.moveTo(30, h / 2); x.lineTo(w - 30, h / 2); x.stroke(); ['#8b5cf6', '#2457f5', '#14b8a6', '#f28a1e'].forEach((c, i) => { x.fillStyle = c; x.beginPath(); x.arc(w * (.15 + i * .23), h / 2, h * .09, 0, 7); x.fill(); x.fillStyle = 'rgba(15,23,48,.4)'; rr(x, w * (.15 + i * .23) - w * .07, h * (i % 2 ? .66 : .2), w * .14, h * .12, 8); x.fill(); }); },
        checks(x, w, h) { x.fillStyle = '#fbfcff'; x.fillRect(0, 0, w, h); for (let i = 0; i < 5; i++) { const y = h * (.14 + i * .18); x.fillStyle = '#22a06b'; rr(x, w * .08, y - h * .05, h * .1, h * .1, 8); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(w * .08 + h * .025, y); x.lineTo(w * .08 + h * .045, y + h * .025); x.lineTo(w * .08 + h * .08, y - h * .03); x.stroke(); x.fillStyle = 'rgba(15,23,48,.35)'; rr(x, w * .08 + h * .15, y - 5, w * (.45 + (i * 29 % 30) / 100), 10, 5); x.fill(); } },
        shield(x, w, h) { x.fillStyle = '#0b2a22'; x.fillRect(0, 0, w, h); x.fillStyle = '#22a06b'; x.beginPath(); x.moveTo(w / 2, h * .1); x.lineTo(w * .74, h * .22); x.lineTo(w * .72, h * .55); x.quadraticCurveTo(w * .66, h * .8, w / 2, h * .92); x.quadraticCurveTo(w * .34, h * .8, w * .28, h * .55); x.lineTo(w * .26, h * .22); x.closePath(); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 14; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(w * .39, h * .5); x.lineTo(w * .47, h * .62); x.lineTo(w * .62, h * .36); x.stroke(); },
        mission(x, w, h) { x.fillStyle = '#071033'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(94,234,212,.25)'; x.lineWidth = 2; for (let i = 1; i < 8; i++) { x.beginPath(); x.moveTo(w * i / 8, 0); x.lineTo(w * i / 8, h); x.stroke(); } for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(0, h * i / 4); x.lineTo(w, h * i / 4); x.stroke(); } x.strokeStyle = '#5eead4'; x.lineWidth = 6; x.beginPath(); x.moveTo(0, h * .8); for (let i = 0; i <= 40; i++) x.lineTo(w * i / 40, h * (.65 - i / 40 * .35 + Math.sin(i * .7) * .06)); x.stroke(); x.fillStyle = '#ffd36a'; x.font = '700 ' + h * .13 + 'px Geist, monospace'; x.fillText('ALL SYSTEMS GO', 24, h * .2); x.fillStyle = '#5eead4'; x.beginPath(); x.arc(w - 36, 36, 12, 0, 7); x.fill(); },
        funnel(x, w, h) { x.fillStyle = '#fbfcff'; x.fillRect(0, 0, w, h); ['#2457f5', '#4f7cff', '#7aa2ff', '#a9c4ff'].forEach((c, i) => { x.fillStyle = c; const a = w * (.84 - i * .17), y = h * (.1 + i * .22); rr(x, (w - a) / 2, y, a, h * .18, 12); x.fill(); }); },
        deck(x, w, h) { x.fillStyle = '#fbfcff'; x.fillRect(0, 0, w, h); x.fillStyle = '#2457f5'; rr(x, w * .08, h * .12, w * .5, h * .12, 8); x.fill(); x.fillStyle = 'rgba(15,23,48,.35)'; [.34, .46, .58].forEach(p => { rr(x, w * .08, h * p, w * .6, 10, 5); x.fill(); }); x.fillStyle = '#ffd36a'; x.beginPath(); x.arc(w * .8, h * .55, h * .2, 0, 7); x.fill(); x.fillStyle = '#14b8a6'; x.beginPath(); x.moveTo(w * .8, h * .55); x.arc(w * .8, h * .55, h * .2, 0, 4); x.fill(); },
        stage(x, w, h) { x.fillStyle = '#2a1050'; x.fillRect(0, 0, w, h); const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#ff5f9e'); g.addColorStop(.5, '#ffd36a'); g.addColorStop(1, '#5eead4'); x.fillStyle = g; x.font = '700 ' + h * .55 + 'px Geist, Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('LAUNCH DAY', w / 2, h * .52, w * .9); }
    };
    function label(text, w, h, bg, fg, sub) {
        return ctex(512, Math.round(512 * h / w), (x, W, H) => {
            x.fillStyle = bg; rr(x, 0, 0, W, H, H * .2); x.fill(); x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle';
            let fs = H * (sub ? .4 : .5); x.font = '700 ' + fs + 'px Geist, Helvetica, Arial'; while (x.measureText(text).width > W * .9 && fs > 10) { fs -= 2; x.font = '700 ' + fs + 'px Geist, Helvetica, Arial'; }
            x.fillText(text, W / 2, H * (sub ? .36 : .52));
            if (sub) { let f2 = H * .22; x.font = '500 ' + f2 + 'px Geist, Helvetica, Arial'; while (x.measureText(sub).width > W * .9 && f2 > 8) { f2 -= 1; x.font = '500 ' + f2 + 'px Geist, Helvetica, Arial'; } x.globalAlpha = .78; x.fillText(sub, W / 2, H * .76); }
        });
    }

    // ------------------------------------------------------------------ props
    function sign(g, x, y, z, w, text, bg, fg, sub) {
        const h = sub ? w * .26 : w * .17;
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: label(text, w, h, bg || '#0f1730', fg || '#fff', sub), transparent: true })); m.position.set(x, y, z); g.add(m); return m;
    }
    function board(g, x, y, z, w, h, kind, ry) {
        h = Math.min(h, 2.0); y = Math.min(y, 1.5);
        const o = new THREE.Group(); o.position.set(x, y, z); o.rotation.y = ry || 0; g.add(o);
        box(o, w + 0.18, h + 0.18, 0.1, 0.05, DARK(), 0, 0, 0);
        const s = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: ctex(512, Math.max(64, Math.round(512 * h / w)), art[kind]) })); s.position.z = 0.056; o.add(s); return o;
    }
    let _lap; const lapTex = () => _lap || (_lap = ctex(256, 164, art.code));
    function laptop(p, x, y, z, rot) {
        const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rot || 0; p.add(g);
        box(g, 0.62, 0.025, 0.42, 0.01, STEEL(), 0, 0.012, 0);
        const lid = box(g, 0.62, 0.42, 0.025, 0.01, STEEL(), 0, 0.23, -0.2); lid.rotation.x = -0.18;
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.36), new THREE.MeshBasicMaterial({ map: lapTex() })); scr.position.set(0, 0.23, -0.185); scr.rotation.x = -0.18; scr.rotation.y = Math.PI; g.add(scr);
    }
    function chair(p, x, z, col, rot) {
        const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot || 0; p.add(g); const m = mat(col);
        box(g, 0.55, 0.09, 0.52, 0.04, m, 0, 0.5, 0); box(g, 0.52, 0.55, 0.08, 0.04, m, 0, 0.82, -0.27);
        cyl(g, 0.035, 0.035, 0.46, STEEL(), 0, 0.25, 0, 10); cyl(g, 0.28, 0.28, 0.04, DARK(), 0, 0.03, 0, 5);
    }
    function desk(p, x, z, w) {
        const g = new THREE.Group(); g.position.set(x, 0, z); p.add(g); w = w || 2.2;
        box(g, w, 0.07, 0.95, 0.03, WOOD(), 0, 0.76, 0); box(g, 0.06, 0.72, 0.9, 0.02, WHITE(), -w / 2 + 0.1, 0.36, 0); box(g, 0.06, 0.72, 0.9, 0.02, WHITE(), w / 2 - 0.1, 0.36, 0); box(g, w - 0.2, 0.35, 0.04, 0.02, WHITE(), 0, 0.55, -0.4);
        blob(g, 0, 0.05, w + 0.5, 1.8); return g;
    }
    function table(p, x, z, w, d, col, h) { const g = new THREE.Group(); g.position.set(x, 0, z); p.add(g); h = h || 0.76; box(g, w, 0.1, d, 0.05, mat(col || C.wood), 0, h, 0); cyl(g, 0.12, 0.2, h, STEEL(), -w / 2 + 0.5, h / 2, 0); cyl(g, 0.12, 0.2, h, STEEL(), w / 2 - 0.5, h / 2, 0); blob(g, 0, 0, w + 0.8, d + 0.8); return g; }
    function roundTable(p, x, z, r, col, h) { const g = new THREE.Group(); g.position.set(x, 0, z); p.add(g); h = h || 0.76; cyl(g, r, r, 0.09, mat(col || C.white), 0, h, 0, 32); cyl(g, 0.09, 0.2, h, STEEL(), 0, h / 2, 0); cyl(g, 0.42, 0.42, 0.05, DARK(), 0, 0.03, 0); blob(g, 0, 0, r * 2.6, r * 2.6); return g; }
    function plant(p, x, z, s) {
        s = s || 1; const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); p.add(g);
        cyl(g, 0.3, 0.22, 0.5, mat(0xd98a5c), 0, 0.25, 0, 18); const leaf = [mat(0x2f9e66), mat(0x3fbf7f), mat(0x23824f)];
        for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, l = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 9), leaf[i % 3]); l.scale.set(0.5, 1.5, 0.35); l.position.set(Math.cos(a) * 0.17, 0.95 + (i % 2) * 0.18, Math.sin(a) * 0.17); l.rotation.set(Math.sin(a) * 0.5, a, -Math.cos(a) * 0.5); g.add(l); }
        blob(g, 0, 0, 1.1, 1.1);
    }
    function rug(g, x, z, w, d, col) { box(g, w, 0.03, d, 0.1, mat(col), x, 0.05, z); }
    function sofa(g, x, z, w, col, ry) { const o = new THREE.Group(); o.position.set(x, 0, z); o.rotation.y = ry || 0; g.add(o); const m = mat(col); box(o, w, 0.42, 0.95, 0.18, m, 0, 0.32, 0); box(o, w, 0.55, 0.28, 0.14, m, 0, 0.66, -0.4); box(o, 0.3, 0.55, 0.95, 0.14, m, -w / 2 + 0.1, 0.5, 0); box(o, 0.3, 0.55, 0.95, 0.14, m, w / 2 - 0.1, 0.5, 0); blob(o, 0, 0, w + 0.6, 1.8); }
    function shelf(g, x, z, w, h) { const o = new THREE.Group(); o.position.set(x, 0, z); g.add(o); box(o, w, h, 0.4, 0.04, mat(0xd9c3a0), 0, h / 2, 0); const cols = [0x4f7cff, 0xf28a1e, 0x14b8a6, 0xec4899, 0x8b5cf6, 0x22a06b]; for (let r = 0; r < Math.floor(h / 0.5); r++) for (let k = 0; k < Math.floor(w / 0.3); k++) box(o, 0.2, 0.34, 0.28, 0.03, mat(cols[(r * 3 + k) % 6]), -w / 2 + 0.25 + k * 0.3, 0.38 + r * 0.5, 0.06); }
    function glassCube(g, x, z, w, d, accent) {
        const o = new THREE.Group(); o.position.set(x, 0, z); g.add(o); const gl = mat(0xcfe0ff, { transparent: true, opacity: 0.2, depthWrite: false, shininess: 120, specular: 0xffffff });
        [[w, 2.6, 0.04, 0, 1.3, d / 2], [w, 2.6, 0.04, 0, 1.3, -d / 2], [0.04, 2.6, d, -w / 2, 1.3, 0], [0.04, 2.6, d, w / 2, 1.3, 0]].forEach(a => { const m = new THREE.Mesh(new THREE.BoxGeometry(a[0], a[1], a[2]), gl); m.position.set(a[3], a[4], a[5]); o.add(m); });
        const fm = mat(accent || 0xe9edfa); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(c => box(o, 0.09, 2.62, 0.09, 0.03, fm, c[0] * w / 2, 1.31, c[1] * d / 2)); return o;
    }
    function rack(g, x, z, h) {
        const o = new THREE.Group(); o.position.set(x, 0, z); g.add(o); h = h || 2.2; box(o, 0.9, h, 0.8, 0.06, mat(0x1a2244), 0, h / 2, 0);
        const t = new THREE.Mesh(new THREE.PlaneGeometry(0.76, h - 0.2), new THREE.MeshBasicMaterial({ map: ctex(64, 256, (c, w, hh) => { c.fillStyle = '#0a1230'; c.fillRect(0, 0, w, hh); for (let i = 0; i < 14; i++) { c.fillStyle = '#16204a'; c.fillRect(4, 6 + i * 17, 56, 12); c.fillStyle = ['#5eead4', '#7aa2ff', '#ffd36a', '#ff7a90'][(i * 7) % 4]; c.fillRect(8, 10 + i * 17, 5, 5); c.fillRect(16, 10 + i * 17, 5, 5); } }) })); t.position.set(0, h / 2, 0.41); o.add(t); blob(o, 0, 0, 1.6, 1.4);
    }
    function standee(g, x, z, tex, w, h) { const o = new THREE.Group(); o.position.set(x, 0, z); g.add(o); box(o, w, h, 0.12, 0.1, mat(0xffffff), 0, h / 2 + 0.25, 0); const m = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.16, h - 0.16), new THREE.MeshBasicMaterial({ map: tex })); m.position.set(0, h / 2 + 0.25, 0.07); o.add(m); box(o, w * 0.7, 0.16, 0.7, 0.06, DARK(), 0, 0.08, 0); blob(o, 0, 0, w + 1, 1.8); return o; }

    // ------------------------------------------------------------------ agents (real 3D models)
    const PAL = [['#2457f5', '#1a3fd0', '#a9c4ff'], ['#14b8a6', '#0b8478', '#a4f0e4'], ['#f28a1e', '#c96d0c', '#ffd9a6'], ['#8b5cf6', '#6537d6', '#d6c4ff'], ['#ec4899', '#be2a78', '#ffc4de'], ['#22a06b', '#177a50', '#a8efcb'], ['#64748b', '#475569', '#cbd5e1']];
    const CROWD = PAL.map((p, i) => ({ id: 'c' + i, name: 'Agent', hue: p[0], dark: p[1], soft: '#eef', glow: p[2] }));
    const live = [], SC = 0.0112; let disco = false, nightOn = false, seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const LEAD = id => (window.YPT_AGENTS || {})[id];
    function agent(parent, x, z, o) {
        o = o || {};
        if (o.extra && LOWQ) return null;
        const def = o.def || CROWD[Math.floor(rnd() * CROWD.length)];
        const st = AG.build(def, 'full', !o.full);
        const g = new THREE.Group(), s = (o.scale || 1) * SC;
        st.shadow.visible = false; st.root.scale.setScalar(s); g.add(st.root);
        const lift = 68 * s; g.position.set(x, (o.y || 0) + lift + (o.hover == null ? 0.18 : o.hover), z); g.rotation.y = o.face || 0; parent.add(g);
        const bl = blob(parent, x, z, 1.1 * (o.scale || 1), 0.7 * (o.scale || 1));
        const a = { st, g, bl, base: g.position.y, phase: rnd() * 6.28, blink: 2 + rnd() * 3, patrol: o.patrol || null, dance: !!o.dance };
        live.push(a); return a;
    }
    function animate(t, dt) {
        for (const a of live) {
            const st = a.st; let bob = REDUCED ? 0 : Math.sin(t * 1.5 + a.phase) * 0.03;
            if (a.patrol && !REDUCED) {
                const p = a.patrol, u = (t * p.sp / (p.x1 - p.x0) + a.phase) % 2, k = u < 1 ? u : 2 - u;
                a.g.position.x = p.x0 + (p.x1 - p.x0) * k; a.g.rotation.y = (u < 1 ? 1 : -1) * 1.0; bob = Math.abs(Math.sin(t * 5 + a.phase)) * 0.05; a.bl.position.x = a.g.position.x;
            } else if (a.dance && disco && !REDUCED) { bob = Math.abs(Math.sin(t * 6.5 + a.phase)) * 0.28; a.g.rotation.y = Math.sin(t * 3 + a.phase) * 0.5; }
            if (!a.isAlya) a.g.position.y = a.base + bob;
            if (st.hand) st.hand.rotation.z = REDUCED ? 0 : Math.sin(t * (a.dance && disco ? 7 : 2.4) + a.phase) * ((st.waveAmp || 0.2) * (a.dance && disco ? 2.6 : 1));
            if (st.jet) { const fl = 1 + Math.sin(t * 22 + a.phase) * 0.14; st.jet.scale.set(9 * fl, 7 * fl, 9 * fl); st.jetCore.scale.set(4.2 * fl, 3.2 * fl, 4.2 * fl); }
            a.blink -= dt; if (st.eyesN) { st.eyesN.scale.y = a.blink < 0.12 && !REDUCED ? 0.12 : 1; if (a.blink < 0) a.blink = 3 + rnd() * 3.5; }
            for (const s of st.spinners) s.rotation.y = t * 2.2 + a.phase;
            const pu = 1 + Math.sin(t * 3.4 + a.phase) * 0.12;
            for (const p of st.pulsers) { if (!p.userData.base) p.userData.base = p.scale.clone(); p.scale.copy(p.userData.base).multiplyScalar(pu); }
        }
    }

    // ------------------------------------------------------------------ the tower shell
    const floors = [], glass = new THREE.MeshPhongMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.16, shininess: 120, specular: 0xffffff, depthWrite: false });
    const strips = [];
    function shade(hex, f) { const c = new THREE.Color(hex); c.multiplyScalar(1 + f); return '#' + c.getHexString(); }
    function backWall(P) {
        const tx = ctex(1024, 256, (x, w, h) => {
            const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, P.wall); g.addColorStop(1, shade(P.wall, -0.08)); x.fillStyle = g; x.fillRect(0, 0, w, h);
            const n = Math.max(3, Math.round(P.w / 7)), ww = w / n;
            for (let i = 0; i < n; i++) {
                const wx = i * ww + ww * 0.16, wy = h * 0.14, ww2 = ww * 0.68, wh = h * 0.56, sg = x.createLinearGradient(0, wy, 0, wy + wh); sg.addColorStop(0, '#bfe0ff'); sg.addColorStop(1, '#eaf5ff'); x.fillStyle = sg; x.fillRect(wx, wy, ww2, wh);
                x.fillStyle = '#9db6d8'; for (let k = 0; k < 5; k++) { const bw = ww2 / 5; x.fillRect(wx + k * bw + 2, wy + wh * (0.35 + ((k * 37 + i * 11) % 40) / 100), bw - 4, wh); }
                x.strokeStyle = '#eef2ff'; x.lineWidth = 6; x.strokeRect(wx, wy, ww2, wh); x.beginPath(); x.moveTo(wx + ww2 / 2, wy); x.lineTo(wx + ww2 / 2, wy + wh); x.stroke();
            }
        });
        return new THREE.Mesh(new THREE.PlaneGeometry(P.w, FH - 0.2), new THREE.MeshBasicMaterial({ map: tx }));
    }
    function makeFloor(i) {
        const P = PLAN[i], g = new THREE.Group(); g.position.y = i * FH; tower.add(g);
        box(g, P.w, 0.36, P.d, 0.1, mat(0xf4f6fd), 0, -0.18, 0);
        box(g, P.w - 0.6, 0.04, P.d - 0.6, 0.02, mat(P.c), 0, 0.02, 0);
        box(g, P.w + 0.05, 0.1, 0.1, 0.03, glow(P.acc), 0, -0.2, P.d / 2 + 0.02);
        const bw = backWall(P); bw.position.set(0, FH / 2 - 0.1, -P.d / 2 + 0.06); g.add(bw);
        [-1, 1].forEach(s => { const sw = new THREE.Mesh(new THREE.PlaneGeometry(P.d, FH - 0.2), glass); sw.rotation.y = Math.PI / 2; sw.position.set(s * P.w / 2, FH / 2 - 0.1, 0); g.add(sw); });
        const frame = mat(0xe9edfa), n = Math.round(P.w / 6);
        for (let k = 0; k <= n; k++) { const x = -P.w / 2 + 0.15 + k * (P.w - 0.3) / n; if (k === 0 || k === n) box(g, 0.18, FH - 0.1, 0.18, 0.05, frame, x, FH / 2 - 0.05, P.d / 2 - 0.15); box(g, 0.18, FH - 0.1, 0.18, 0.05, frame, x, FH / 2 - 0.05, -P.d / 2 + 0.15); }
        for (let k = 0; k < Math.round(P.w / 6); k++) strips.push(box(g, 3.2, 0.05, 0.35, 0.02, glow(0xfff4c8), -P.w / 2 + 3 + k * 6, FH - 0.28, 0));
        const gap = LIFTX - P.w / 2;
        if (gap > 0.1) { box(g, gap + 0.4, 0.3, 2.8, 0.06, mat(0xf4f6fd), P.w / 2 + gap / 2, -0.15, AISLE); box(g, gap + 0.4, 0.05, 2.8, 0.02, mat(P.c), P.w / 2 + gap / 2, 0.02, AISLE); const rl = new THREE.Mesh(new THREE.BoxGeometry(gap + 0.4, 1.1, 0.04), glass); rl.position.set(P.w / 2 + gap / 2, 0.55, AISLE + 1.4); g.add(rl); box(g, gap + 0.4, 0.07, 0.07, 0.02, frame, P.w / 2 + gap / 2, 1.1, AISLE + 1.4); }
        const gr = new THREE.Group(); g.add(gr); floors[i] = { g: gr, P, y: i * FH };
    }
    for (let i = 0; i < FLOORS; i++) makeFloor(i);

    // glass lift shaft with a moving cab
    const cab = new THREE.Group(); tower.add(cab);
    (function lift() {
        const top = FLOORS * FH;
        [[-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]].forEach(c => box(tower, 0.2, top + 0.4, 0.2, 0.06, mat(0xe9edfa), LIFTX + c[0], top / 2, AISLE + c[1]));
        const sh = new THREE.Mesh(new THREE.BoxGeometry(2.8, top, 2.8), glass); sh.position.set(LIFTX, top / 2, AISLE); tower.add(sh);
        box(tower, 3.2, 0.3, 3.2, 0.1, mat(0xf4f6fd), LIFTX, top + 0.15, AISLE);
        box(cab, 2.1, 0.12, 2.1, 0.05, mat(0xf4f6fd), 0, 0.02, 0); box(cab, 2.1, 0.12, 2.1, 0.05, glow(0xf28a1e), 0, 2.7, 0);
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(c => box(cab, 0.07, 2.7, 0.07, 0.02, STEEL(), c[0] * 1.02, 1.35, c[1] * 1.02));
        const cg = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.5, 2.1), glass); cg.position.y = 1.35; cab.add(cg); cab.position.set(LIFTX, 0, AISLE);
    })();

    // roof, sign, plinth
    (function dressing() {
        const top = PLAN[7], y = 7 * FH + FH;
        box(tower, top.w + 0.4, 0.4, top.d + 0.4, 0.12, mat(0xf4f6fd), 0, y - 0.2, 0);
        const sign = ctex(1024, 128, (x, w, h) => { x.fillStyle = '#0f1730'; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.font = '700 62px Geist, Helvetica, Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('YOUR PARTNER TECHNOLOGIES', w / 2, h / 2 + 2); x.fillStyle = '#f28a1e'; x.fillRect(0, h - 10, w, 10); });
        const sg = new THREE.Mesh(new THREE.PlaneGeometry(14, 1.75), new THREE.MeshBasicMaterial({ map: sign })); sg.position.set(0, y + 1.4, 0.2); tower.add(sg); box(tower, 14.4, 2.05, 0.3, 0.1, mat(0x0f1730), 0, y + 1.4, 0);
        cyl(tower, 0.05, 0.08, 4, STEEL(), 0, y + 4.1, -0.3, 8); ball(tower, 0.18, glow(0xff5f5f), 0, y + 6.2, -0.3);
        const base = new THREE.Group(); world.add(base);
        box(base, 84, 1.2, 46, 0.5, mat(0xfdfdff), 0, -0.7, 6); box(base, 80, 0.2, 42, 0.3, mat(0xd9eadf), 0, -0.02, 6); box(base, 24, 0.1, 10, 0.2, mat(0xe9e4d8), 0, 0.08, 13);
        for (let k = 0; k < 16; k++) { const tx = -37 + k * 4.9 + ((k * 7) % 3), tz = 21 + ((k * 5) % 4) * 1.1, tr = new THREE.Group(); tr.position.set(tx, 0, tz); base.add(tr); cyl(tr, 0.12, 0.16, 0.9, mat(0x8a5a3a), 0, 0.45, 0, 8); ball(tr, 0.9 + (k % 3) * 0.15, mat(k % 2 ? 0x3fbf7f : 0x2f9e66), 0, 1.5, 0); blob(base, tx, tz, 2.4, 2.4); }
        const ps = ctex(1024, 160, (x, w, h) => { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = '#0f1730'; x.font = '700 70px Geist, Helvetica, Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('Your Partner Technologies', w / 2, h / 2); x.fillStyle = '#f28a1e'; x.fillRect(80, h - 16, w - 160, 8); });
        const plate = new THREE.Mesh(new THREE.PlaneGeometry(12, 1.9), new THREE.MeshBasicMaterial({ map: ps })); plate.position.set(-14, 0.9, 22.2); base.add(plate); box(base, 12.3, 2.2, 0.2, 0.08, mat(0xe7ebf8), -14, 0.9, 22.05);
    })();

    // ------------------------------------------------------------------ rooms
    const ROOM = {}, hits = [];
    // the floor you are on glows a little brighter: a faint white glass box around each floor, shown only on the active one
    const floorGlow = [];
    for (let f = 0; f < FLOORS; f++) {
        const P = PLAN[f], m = new THREE.Mesh(new THREE.BoxGeometry(P.w, FH - 0.2, P.d), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
        m.position.set(0, f * FH + FH / 2, 0); m.renderOrder = 5; tower.add(m); floorGlow.push(m);
    }
    function room(id, f, x, span, zw) {
        ROOM[id] = { id, f, x, span };
        const P = PLAN[f], m = new THREE.Mesh(new THREE.BoxGeometry(zw || span, FH - 0.3, P.d - 0.4), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
        m.position.set(x, f * FH + FH / 2, 0); m.userData.room = id; tower.add(m); hits.push(m);
    }
    function wallSign(f, x, text, sub) { sign(floors[f].g, x, 3.0, -PLAN[f].d / 2 + 0.2, 4.6, text, '#0f1730', '#fff', sub); }
    function workRow(f, x0, z, n, step, col, o) {
        const g = floors[f].g;
        for (let k = 0; k < n; k++) { const x = x0 + k * step; desk(g, x, z, 2.2); chair(g, x + (k % 2 ? 0.2 : -0.2), z - 1.0, col || C.blue); laptop(g, x - 0.3, 0.8, z + 0.05, 0); agent(g, x + 0.2, z - 0.85, Object.assign({ hover: 0.55 }, o)); }
    }
    function pods(f, x0, z, n, step, col, o) { const g = floors[f].g; for (let k = 0; k < n; k++) { desk(g, x0 + k * step, z, 2.0); chair(g, x0 + k * step, z - 1.0, col); laptop(g, x0 + k * step - 0.2, 0.8, z + 0.05, 0); agent(g, x0 + k * step + 0.1, z - 0.85, Object.assign({ hover: 0.55 }, o)); } }
    const cornerPlants = (f) => { const g = floors[f].g, P = PLAN[f]; plant(g, -P.w / 2 + 1, 2.3, 1.3); plant(g, P.w / 2 - 1, -P.d / 2 + 1, 1.3); };

    // SAM's portrait: the flat artwork from the home page, framed like a standee
    const samTex = (() => {
        const c = Object.assign(document.createElement('canvas'), { width: 256, height: 320 }), x = c.getContext('2d'), t = new THREE.CanvasTexture(c), src = document.getElementById('sam-svg');
        const paint = (img) => { const g = x.createLinearGradient(0, 0, 0, 320); g.addColorStop(0, '#dfe9ff'); g.addColorStop(1, '#bcd0ff'); x.fillStyle = g; x.fillRect(0, 0, 256, 320); if (img) x.drawImage(img, 8, 40, 240, 240); x.fillStyle = '#0f1730'; x.fillRect(0, 270, 256, 50); x.fillStyle = '#fff'; x.font = '700 28px Geist, Arial'; x.textAlign = 'center'; x.fillText('SAM', 128, 302); x.fillStyle = '#c96d0c'; x.font = '700 17px Geist, Arial'; x.fillText('1 PERSON · 1 CONTACT', 128, 28); t.needsUpdate = true; };
        paint(null); t.colorSpace = THREE.SRGBColorSpace;
        if (src) { const im = new Image(); im.onload = () => paint(im); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src.textContent); }
        return t;
    })();

    const DISCO = { tiles: [], beams: [], ball: null, group: [] };
    function setDisco(on) { disco = on; DISCO.group.forEach(o => { o.visible = on; }); DISCO.tiles.forEach(t => { t.material = glow(on ? 0x7aa2ff : 0xe8e0ff); }); if (typeof relight === 'function') relight(); }
    function furnish() {
        // ---------- 7 Boardroom and C-suite
        { const f = 7, g = floors[f].g, P = PLAN[f];
            room('board', f, -3.8, 13, 13); room('csuite', f, 6.2, 9, 9);
            wallSign(f, -3.8, 'BOARDROOM', 'Strategy · money · risk · people'); rug(g, -3.8, -0.4, 11, 5.6, 0xd9c8ff);
            box(g, 8.6, 0.12, 2.6, 0.1, mat(C.walnut), -3.8, 0.8, -0.5); box(g, 6.6, 0.7, 1.4, 0.1, mat(0x4f311d), -3.8, 0.4, -0.5); blob(g, -3.8, -0.5, 10.4, 4.4);
            board(g, -3.8, 1.5, -P.d / 2 + 0.2, 4.2, 1.4, 'deck');
            for (let k = 0; k < 5; k++) { const x = -6.8 + k * 1.5; chair(g, x, -2.3, 0x2b3358, 0); agent(g, x, -2.0, { scale: 0.95, hover: 0.5 }); }
            for (let k = 0; k < 3; k++) { const x = -5.6 + k * 1.8; chair(g, x, 1.3, 0x2b3358, Math.PI); agent(g, x, 1.5, { scale: 0.95, hover: 0.5, extra: k === 1 }); }
            ['CEO', 'CFO', 'CTO'].forEach((t, k) => { const x = 4.2 + k * 2.55; glassCube(g, x, -1.7, 2.3, 2.9, 0xe9b949); desk(g, x, -2.2, 1.7); chair(g, x, -1.2, 0x2b3358, Math.PI); agent(g, x, -1.4, { scale: 0.9, hover: 0.55 }); sign(g, x, 2.85, -0.2, 1.5, t, '#e9b949', '#1b1233'); });
            cornerPlants(f); }
        // ---------- 6 Business
        { const f = 6, g = floors[f].g, P = PLAN[f]; const Z = [['directors', -9.6, 'DIRECTORS', 'VPs · C-1', 'roadmap'], ['sales', -3.3, 'SALES & MARKETING', 'First conversations', 'funnel'], ['procure', 3.1, 'PROCUREMENT & FINANCE', 'Vendors · billing', 'chart'], ['legalhr', 9.4, 'LEGAL & HR', 'Contracts · people', 'checks']];
            Z.forEach((z, i) => {
                room(z[0], f, z[1], 6, 6); wallSign(f, z[1], z[2], z[3]); rug(g, z[1], -0.6, 5.4, 4.6, [0xf9d9a8, 0xd9e6ff, 0xd9f3e4, 0xf3d9f0][i]); board(g, z[1], 1.5, -P.d / 2 + 0.2, 3.2, 1.2, z[4]);
                pods(f, z[1] - 1.1, -0.2, 2, 2.3, [C.orange, C.blue, C.green, C.purple][i]); if (i % 2) shelf(g, z[1] + 2.5, -P.d / 2 + 0.6, 1.0, 1.9);
            });
            shelf(g, -12.2, -P.d / 2 + 0.6, 1.0, 2.0); cornerPlants(f);
            agent(g, 0, 3.3, { scale: 0.95, patrol: { x0: -11, x1: 11, sp: 2.2 }, extra: true }); }
        // ---------- 5 Discover
        { const f = 5, g = floors[f].g, P = PLAN[f];
            room('sam', f, -9.4, 7, 7); room('discovery', f, -0.8, 8, 8); room('architect', f, 8.6, 9, 9);
            glassCube(g, -9.4, -0.6, 6, 5.2, 0xf28a1e); rug(g, -9.4, -0.6, 5.4, 4.6, 0xffe2bd); desk(g, -8.6, -1.3, 2.6); standee(g, -10.6, -1.4, samTex, 1.7, 2.2); laptop(g, -9.1, 0.8, -1.2, 0); chair(g, -7.6, -0.4, C.orange, Math.PI); plant(g, -11.6, 1.4, 1.1);
            sign(g, -9.4, 3.0, -P.d / 2 + 0.2, 4.6, 'SAM', '#f28a1e', '#fff', 'Your single point of contact');
            wallSign(f, -0.8, 'DISCOVERY STUDIO', 'Stage 1 · Siti'); board(g, -0.8, 1.5, -P.d / 2 + 0.2, 5.4, 2.0, 'sticky'); rug(g, -0.8, 0.2, 7, 5, 0xcfe0ff);
            roundTable(g, -0.6, 0.4, 1.3, C.white); agent(g, -2.7, -0.8, { def: LEAD('vera'), scale: 1.25, full: true, hover: 0.1, face: 0.3 }); agent(g, 0.7, 1.2, { scale: 0.9 }); agent(g, -1.2, 1.5, { scale: 0.9, extra: true }); agent(g, 1.9, -0.6, { scale: 0.9 });
            wallSign(f, 8.6, 'ARCHITECTURE ROOM', 'Stage 2 · Wei'); board(g, 6.5, 1.5, -P.d / 2 + 0.2, 3.6, 2.0, 'blueprint'); board(g, 10.7, 1.5, -P.d / 2 + 0.2, 3.6, 2.0, 'blueprint'); rug(g, 8.6, -0.2, 8.4, 4.6, 0xd2dcff);
            table(g, 8.4, 0.0, 3.4, 1.4, C.white); agent(g, 6.4, -1.4, { def: LEAD('atlas'), scale: 1.25, full: true, hover: 0.1, face: -0.2 }); agent(g, 9.2, -1.1, { scale: 0.9 }); agent(g, 10.8, 0.6, { scale: 0.9, extra: true }); cornerPlants(f); }
        // ---------- 4 Pilot
        { const f = 4, g = floors[f].g, P = PLAN[f];
            room('pilotbay', f, -4.5, 10, 10); room('meet', f, 9.3, 9, 9);
            wallSign(f, -4.5, 'PILOT BAY', 'Stage 3 · Aiman'); board(g, -4.5, 1.5, -P.d / 2 + 0.2, 6.2, 2.0, 'kanban'); board(g, -9.4, 1.5, -P.d / 2 + 0.2, 3, 1.8, 'roadmap'); rug(g, -4.5, 0.2, 9.4, 5, 0xc9ece4);
            roundTable(g, -2.2, 0.6, 1.1, C.white, 1.05); laptop(g, -2.2, 1.12, 0.6, 0); agent(g, -2.2, -0.7, { scale: 0.9 }); agent(g, -0.9, 1.0, { scale: 0.9, extra: true });
            agent(g, -5.8, -0.9, { def: LEAD('spark'), scale: 1.25, full: true, hover: 0.1, face: 0.25 }); pods(f, -9.2, 0.6, 2, 2.4, C.teal);
            [0, 1].forEach(k => { const x = 7.2 + k * 4.4; wallSign(f, x, 'MEETING ' + (k + 1), 'Demos & workshops'); glassCube(g, x, -0.8, 4, 4.4, 0xaed9ff); table(g, x, -0.8, 2.4, 1.1, C.white); board(g, x, 1.5, -P.d / 2 + 0.2, 2.6, 1.3, k ? 'chart' : 'deck'); agent(g, x - 1.1, -1.7, { scale: 0.85 }); agent(g, x + 1.0, -1.6, { scale: 0.85, extra: true }); });
            cornerPlants(f); }
        // ---------- 3 Build
        { const f = 3, g = floors[f].g, P = PLAN[f];
            room('engineering', f, -6, 14, 14); room('testlab', f, 10.4, 10, 10);
            wallSign(f, -6, 'ENGINEERING FLOOR', 'Stage 4 · Jun'); board(g, -9.2, 1.5, -P.d / 2 + 0.2, 4.6, 1.8, 'code'); board(g, -3.8, 1.5, -P.d / 2 + 0.2, 4.4, 1.8, 'build'); board(g, 0.6, 1.5, -P.d / 2 + 0.2, 4, 1.8, 'chart');
            workRow(f, -11.2, -2.6, 5, 2.8, 0x7aa2ff); workRow(f, -11.2, 0.4, 5, 2.8, 0x5eead4); agent(g, 2.4, 1.3, { def: LEAD('forge'), scale: 1.25, full: true, hover: 0.1, face: -0.2 });
            wallSign(f, 10.4, 'TEST LAB', 'QA & automation');
            const dev = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 2.0), new THREE.MeshBasicMaterial({ map: ctex(1024, 270, (x, w, h) => { x.fillStyle = '#10183a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 10; i++) for (let k = 0; k < 3; k++) { x.fillStyle = ['#2457f5', '#14b8a6', '#8b5cf6', '#f28a1e'][(i + k) % 4]; rr(x, 12 + i * 100, 10 + k * 84, 78, 74, 10); x.fill(); x.fillStyle = '#fff'; x.globalAlpha = .6; x.fillRect(24 + i * 100, 26 + k * 84, 54, 8); x.fillRect(24 + i * 100, 42 + k * 84, 34, 8); x.globalAlpha = 1; } }) })); dev.position.set(10.4, 1.5, -P.d / 2 + 0.2); g.add(dev); box(g, 7.8, 2.2, 0.08, 0.05, DARK(), 10.4, 1.5, -P.d / 2 + 0.14);
            table(g, 10.4, -0.5, 6.4, 1.4, C.white); [8.4, 10.4, 12.4].forEach(x => { laptop(g, x, 0.86, -0.5, 0); agent(g, x, -1.8, { scale: 0.95, hover: 0.5 }); }); agent(g, 10.4, 1.2, { scale: 0.9, extra: true });
            cornerPlants(f); }
        // ---------- 2 Govern
        { const f = 2, g = floors[f].g, P = PLAN[f];
            room('checks', f, -10.4, 7, 7); room('governance', f, -1, 9, 9); room('audit', f, 10, 9, 9);
            wallSign(f, -10.4, 'CHECKLISTS', 'Security · compliance · risk'); board(g, -11.7, 1.5, -P.d / 2 + 0.2, 2.2, 2.0, 'checks'); board(g, -9.1, 1.5, -P.d / 2 + 0.2, 2.2, 2.0, 'checks'); rug(g, -10.4, 0.2, 6, 4.6, 0xcdeedc); pods(f, -11.4, 0.4, 2, 2.4, C.green);
            wallSign(f, -1, 'GOVERNANCE OFFICE', 'Stage 5 · Mei'); board(g, -1, 1.5, -P.d / 2 + 0.2, 3.6, 2.0, 'shield'); rug(g, -1, 0.2, 8, 4.8, 0xd5efe0); table(g, -1, 0.0, 3.4, 1.3, C.white);
            agent(g, -3.2, -1.2, { def: LEAD('aegis'), scale: 1.25, full: true, hover: 0.1, face: 0.2 }); agent(g, -0.2, -1.2, { scale: 0.9 }); agent(g, 1.4, 1.2, { scale: 0.9, extra: true });
            wallSign(f, 10, 'AUDIT & REVIEW', 'Responsible-AI · data protection'); shelf(g, 7.6, -P.d / 2 + 0.6, 2.2, 2.2); shelf(g, 12.4, -P.d / 2 + 0.6, 2.2, 2.2); rug(g, 10, 0.2, 8, 4.6, 0xd9f3e4); pods(f, 8.8, 0.3, 2, 2.6, C.teal);
            cornerPlants(f); }
        // ---------- 1 Launch
        { const f = 1, g = floors[f].g, P = PLAN[f];
            room('mission', f, -3.5, 16, 16); room('launchpad', f, 12.5, 5, 5);
            wallSign(f, -3.5, 'MISSION CONTROL', 'Stage 6 · Farid'); board(g, -8.4, 1.5, -P.d / 2 + 0.2, 5.4, 2.0, 'mission'); board(g, -2.4, 1.5, -P.d / 2 + 0.2, 5.4, 2.0, 'chart'); board(g, 3.2, 1.5, -P.d / 2 + 0.2, 5, 2.0, 'mission');
            workRow(f, -11.5, -2.6, 4, 2.9, 0x5eead4); workRow(f, -11.5, 0.4, 4, 2.9, 0x7aa2ff); agent(g, 1.2, 1.2, { def: LEAD('orca'), scale: 1.25, full: true, hover: 0.1, face: -0.25 });
            const rk = new THREE.Group(); rk.position.set(12.5, 0, -1); rk.scale.setScalar(0.62); g.add(rk); cyl(rk, 0.4, 0.4, 3.6, mat(0xf6f8ff), 0, 2.1, 0, 24); const nose = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.2, 24), mat(C.orange)); nose.position.y = 4.5; rk.add(nose); ball(rk, 0.2, mat(0x5eead4), 0, 2.8, 0.38);
            [0, 2.1, 4.2].forEach(a => { const fin = box(rk, 0.08, 1.1, 0.9, 0.03, mat(C.orange), Math.cos(a) * 0.45, 0.8, Math.sin(a) * 0.45); fin.rotation.y = -a; });
            const flame = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.3, 16), new THREE.MeshBasicMaterial({ color: 0xffb04a })); flame.rotation.x = Math.PI; flame.position.y = -0.1; rk.add(flame); FLAME.m = flame; box(g, 4.6, 0.2, 4.6, 0.1, DARK(), 12.5, 0.12, -1); blob(g, 12.5, -1, 4, 4);
            sign(g, 12.5, 3.0, -P.d / 2 + 0.2, 4.4, 'LAUNCH PAD', '#f28a1e', '#fff'); rack(g, 7.4, -P.d / 2 + 1.3); rack(g, 8.5, -P.d / 2 + 1.3); rack(g, 16.2, -P.d / 2 + 1.3);
            cornerPlants(f); }
        // ---------- 0 Ground
        { const f = 0, g = floors[f].g, P = PLAN[f];
            room('lobby', f, -12.4, 11, 11); room('academy', f, -1.2, 11, 11); room('hall', f, 12.4, 13, 13);
            rug(g, -12.4, 0, 9, 7, 0xffe2bd); wallSign(f, -12.4, 'WELCOME', 'Reception');
            box(g, 4.4, 1.05, 1.1, 0.2, mat(C.white), -12.4, 0.52, -2.2); box(g, 4.6, 0.1, 1.3, 0.05, mat(C.walnut), -12.4, 1.08, -2.2); box(g, 4.4, 0.3, 0.06, 0.03, glow(C.orange), -12.4, 0.8, -1.64); blob(g, -12.4, -2.2, 6, 2.6); agent(g, -12.4, -3.0, { scale: 1.0, hover: 0.6 });
            sofa(g, -16.2, -0.8, 3.0, C.teal, 0.5); sofa(g, -8.4, -0.6, 2.6, C.blue, -0.5); table(g, -12.4, 0.2, 1.2, 0.8, C.wood, 0.4); plant(g, -17.6, -3.6, 1.6); plant(g, -7.2, -3.6, 1.4);
            wallSign(f, -1.2, 'ACADEMY', 'Stage 7 · Lin'); board(g, -1.2, 1.5, -P.d / 2 + 0.2, 5.4, 2.0, 'deck'); rug(g, -1.2, 0.1, 9.6, 6.2, 0xd8e5ff);
            agent(g, -3.6, -3.0, { def: LEAD('sage'), scale: 1.25, full: true, hover: 0.1, face: 0.2 });
            for (let r = 0; r < 2; r++) for (let k = 0; k < 4; k++) { const x = -4.6 + k * 2.4, z = -1.0 + r * 1.9; desk(g, x, z, 1.5); agent(g, x, z - 0.8, { scale: 0.85, hover: 0.55, extra: r === 1 && k % 2 === 1 }); }
            wallSign(f, 12.4, 'THE HALL', 'Where launches are celebrated'); box(g, 9.4, 0.5, 3.6, 0.15, mat(0x3a1a6b), 12.4, 0.25, -3.6); board(g, 12.4, 1.5, -P.d / 2 + 0.2, 6.2, 1.6, 'stage');
            [-1, 1].forEach(s => box(g, 1.1, 3.0, 0.25, 0.1, mat(0xc2185b), 12.4 + s * 4.6, 1.6, -P.d / 2 + 0.5));
            const tiles = []; for (let i = 0; i < 6; i++) for (let k = 0; k < 3; k++) { const t = box(g, 1.35, 0.04, 1.35, 0.03, glow(0xe8e0ff), 8.2 + i * 1.5, 0.06, -0.8 + k * 1.5); t.userData.tile = (i + k) % 4; tiles.push(t); }
            const dg = new THREE.Group(); dg.position.set(12.4, FH - 0.55, 0.4); g.add(dg); dg.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 1), new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 200, flatShading: true, emissive: 0x222244 }))); cyl(dg, 0.02, 0.02, 0.5, STEEL(), 0, 0.8, 0, 6);
            const beams = []; [0xff5f9e, 0x5eead4, 0xffd36a, 0x7aa2ff].forEach((c, i) => { const bm = new THREE.Mesh(new THREE.ConeGeometry(1.1, 3.0, 20, 1, true), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); bm.geometry.translate(0, -1.5, 0); bm.position.set(9.4 + i * 2, FH - 0.35, -0.8); g.add(bm); beams.push(bm); });
            DISCO.tiles = tiles; DISCO.ball = dg; DISCO.beams = beams; DISCO.group = [dg, ...beams]; setDisco(false);
            [0, 1, 2, 3, 4].forEach(k => agent(g, 9 + k * 1.6, 0.1 + (k % 2) * 1.2, { scale: 0.95, hover: 0.1, dance: true, extra: k > 2 }));
            agent(g, 0, 4.2, { scale: 0.95, patrol: { x0: -16, x1: 16, sp: 2.6 }, extra: true });
            plant(g, -P.w / 2 + 1, 4.0, 1.2); plant(g, P.w / 2 - 1, -P.d / 2 + 1, 1.4); }
    }
    const FLAME = { m: null };
    furnish();

    // ------------------------------------------------------------------ Alya, the escort (no visitor character: the camera is the visitor)
    const A = { x: 2, y: 0, z: 20, f: 0, goal: null, walking: false, yaw: 0, ride: false };
    const alyaA = agent(tower, A.x, A.z, { def: LEAD('alya'), scale: 1.3, full: true, hover: 0.1 });
    alyaA.isAlya = true; const alyaLift = alyaA.g.position.y;
    let walkRes = null;
    function walkTo(x, y, z, sp) { if (walkRes) walkRes(false); return new Promise(r => { A.goal = { x, y, z, sp }; walkRes = r; }); }
    function stepAlya(dt, t) {
        const g = alyaA.g, G = A.goal; let moving = false;
        if (G) {
            const dx = G.x - A.x, dy = G.y - A.y, dz = G.z - A.z, d = Math.hypot(dx, dy, dz), st = G.sp * dt;
            if (d <= st) { A.x = G.x; A.y = G.y; A.z = G.z; A.goal = null; const r = walkRes; walkRes = null; r && r(true); }
            else { A.x += dx / d * st; A.y += dy / d * st; A.z += dz / d * st; moving = Math.abs(dy) < 0.01; if (moving) A.yaw = Math.atan2(dx, dz); }
        }
        A.walking = moving;
        const targetYaw = moving ? Math.max(-1.1, Math.min(1.1, A.yaw)) : (A.ride ? 0 : -0.22);
        g.rotation.y += (targetYaw - g.rotation.y) * Math.min(1, dt * 7);
        g.position.set(A.x, A.y + alyaLift + (moving && !REDUCED ? Math.abs(Math.sin(t * 7)) * 0.07 : Math.sin(t * 1.5) * 0.03), A.z);
        alyaA.bl.position.set(A.x, A.y + 0.02, A.z); if (A.ride) cab.position.y = A.y;
    }

    // ------------------------------------------------------------------ the directed camera
    const rig = { tx: 0, ty: 14.5, tz: 0, dist: 90, yaw: 0.42, pitch: 0.2, turn: 1 };
    const shot = { tx: 0, ty: 14.5, tz: 0, dist: 90, yaw: 0.42, pitch: 0.2, turn: 1, rate: 1.4 };
    const user = { yaw: 0, pitch: 0, zoom: 1 };
    let following = false, mode = 'overview', yawSign = 1;
    const fitDist = (span) => { const v = THREE.MathUtils.degToRad(camera.fov / 2), h = Math.tan(v) * Math.max(0.45, camera.aspect); return Math.min(75, (span / 2) / h); };
    // the director's shot list: a camera angle per room, so no two stops look alike
    const SHOTS = { lobby: { yaw: 0.0, pitch: 0.08, k: 1.0 }, board: { yaw: 0.3, pitch: 0.07, k: 1.0 }, csuite: { yaw: -0.3, pitch: 0.12 }, sales: { yaw: -0.22, pitch: 0.1 }, sam: { yaw: 0.28, pitch: 0.1, k: 0.85 }, discovery: { yaw: -0.2, pitch: 0.13, k: 0.95 }, architect: { yaw: 0.25, pitch: 0.1 }, pilotbay: { yaw: -0.28, pitch: 0.12 }, engineering: { yaw: 0.2, pitch: 0.14, k: 1.05 }, governance: { yaw: -0.18, pitch: 0.09 }, mission: { yaw: 0.26, pitch: 0.13, k: 1.0 }, academy: { yaw: -0.24, pitch: 0.11 }, hall: { yaw: 0.0, pitch: 0.18, k: 1.1 } };
    function shotRoom(R) { const S = SHOTS[R.id] || { yaw: 0.12 * yawSign, pitch: 0.1 }; Object.assign(shot, { tx: R.x, ty: R.f * FH + 1.9, tz: 0, dist: Math.max(21, fitDist(R.span + 9)) * (S.k || 1), yaw: S.yaw, pitch: S.pitch, turn: 0, rate: 2.0 }); yawSign = -yawSign; }
    function shotOverview() { Object.assign(shot, { tx: 5, ty: 17, tz: 0, dist: Math.max(100, fitDist(74)), yaw: 0.42, pitch: 0.2, turn: 1, rate: 1.2 }); }
    function shotRide() { Object.assign(shot, { tx: LIFTX - 5, ty: A.y + 3, tz: 2, dist: 32, yaw: -0.45, pitch: 0.12, turn: 0, rate: 2.4 }); }
    // zooming out can go all the way to the opening wide shot (the whole building); on the way the view drifts to that shot's centre
    const overviewDist = () => Math.max(100, fitDist(74));
    const zmax = () => Math.max(1.9, overviewDist() / Math.max(8, rig.dist));
    function apply(r) {
        const zm = zmax(), w = zm > 1 ? Math.max(0, Math.min(1, (user.zoom - 1) / (zm - 1))) : 0, e = w * w * (3 - 2 * w);
        const tx = r.tx + (5 - r.tx) * e, ty = r.ty + (17 - r.ty) * e, tz = r.tz * (1 - e), ya = r.yaw + (0.42 - r.yaw) * e, pi = Math.max(-0.2, Math.min(1.35, r.pitch + (0.2 - r.pitch) * e + user.pitch));
        const yaw = ya + user.yaw, cp = Math.cos(pi), sp = Math.sin(pi), d = r.dist * user.zoom;
        camera.position.set(tx + Math.sin(yaw) * cp * d, ty + sp * d, tz + Math.cos(yaw) * cp * d); camera.lookAt(tx, ty, tz);
    }
    function resize() { const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); if (mode === 'overview') shotOverview(); }
    new ResizeObserver(resize).observe(stage); resize();

    // ------------------------------------------------------------------ the tour API used by hww.js
    let tok = 0;
    const wait = ms => new Promise(r => setTimeout(r, REDUCED ? 0 : ms));
    let holdNext = false, destF = 0;
    async function to(id) {
        const R = ROOM[id]; if (!R) return false; const my = ++tok; user.yaw = 0; user.pitch = 0; A.ride = false; const tgtY = R.f * FH; destF = R.f;
        // The visitor moved the view themselves (drag or scroll): the camera stays exactly where they left it. Alya walks to the lift
        // in front of them, rides, and comes out on the floor they are looking at.
        const hold = holdNext; holdNext = false; mode = hold ? 'free' : 'room'; if (hold) following = false;
        if (Math.abs(A.y - tgtY) > 0.05) {                                   // a different floor: walk to the glass lift and ride it
            const cur = Math.max(0, Math.min(FLOORS - 1, Math.round(A.y / FH))), here = Object.values(ROOM).find(r => r.f === cur);
            if (Math.abs(A.x - LIFTX) > 0.05) { if (!hold) { if (here) shotRoom(here); shot.tx = Math.min(PLAN[cur].w / 2 - 8, 14); } if (!await walkTo(LIFTX, A.y, AISLE, 9) || my !== tok) return false; }
            if (!hold) { A.ride = true; mode = 'ride'; shotRide(); } else A.ride = true;
            const tick = hold ? 0 : setInterval(() => { shot.ty = A.y + 3; }, 40);
            const ok = await walkTo(LIFTX, tgtY, AISLE, Math.max(9, Math.abs(tgtY - A.y) / 2.4)); clearInterval(tick);
            if (!ok || my !== tok) return false;
            A.ride = false; A.f = R.f;
            if (!hold) { mode = 'room'; shotRoom(R); shot.tx = LIFTX - 7; } await wait(400); if (my !== tok) return false;
        }
        if (hold) { const vx = Math.max(-18, Math.min(18, shot.tx)); const ok = await walkTo(vx, tgtY, AISLE, 9); return ok && my === tok; }
        shotRoom(R); following = true;
        const ok = await walkTo(R.x, tgtY, AISLE, 9); following = false;
        if (!ok || my !== tok) return false;
        shot.tx = R.x; await wait(500); return my === tok;
    }
    function overview(ms) { ++tok; mode = 'overview'; user.yaw = 0; user.pitch = 0; user.zoom = 1; shotOverview(); if (walkRes) { walkRes(false); walkRes = null; A.goal = null; } return wait(ms || 2200); }
    function place(id) { const R = ROOM[id]; ++tok; if (walkRes) { walkRes(false); walkRes = null; } A.goal = null; A.f = R.f; A.x = R.x; A.y = R.f * FH; A.z = AISLE; mode = 'room'; shotRoom(R); Object.assign(rig, shot); user.yaw = 0; cab.position.y = A.y; }
    function enter() { A.f = 0; A.x = 2; A.y = 0; A.z = 20; A.goal = null; cab.position.y = 0; }
    // the double-arrow buttons turn the view all the way round (left and right) or tip it up and down
    function look(d) { user.yaw = (user.yaw + d) % (Math.PI * 2); }
    function tilt(d) { user.pitch = Math.max(-0.5, Math.min(1.2, user.pitch + d)); }
    function zoom(k) { user.zoom = Math.max(0.45, Math.min(zmax(), user.zoom * k)); }
    function relight() { const on = nightOn || disco; scene.background = on ? NIGHT : DAY; scene.fog.color.set(on ? 0x14183d : 0xf1f0fb); hemi.intensity = nightOn ? 1.0 : disco ? 1.5 : 1.9; key.intensity = nightOn ? 1.1 : disco ? 1.7 : 2.3; rim.intensity = on ? 0.5 : 1.1; strips.forEach(s => s.scale.set(1, on ? 2.2 : 1, on ? 3 : 1)); }
    function setNight(on) { nightOn = on; relight(); }
    // clicking a room on the model asks the tour to go there; a click is told from a drag by distance
    let down = null;
    canvas.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY, e.clientX, e.clientY]; });
    // dragging with one finger or the mouse: sideways moves along the floor, up and down moves through the floors (the double-arrow buttons rotate the view); let go on a different floor and Alya comes to it
    let dragT = 0;
    const floorAtView = () => Math.max(0, Math.min(FLOORS - 1, Math.round((shot.ty - 1.9) / FH)));
    function summon() { clearTimeout(dragT); const f = floorAtView(); if (f === destF || !window.HWW3D || !window.HWW3D.onFloor) { if (f === destF) shotFloorSnap(f); return; } holdNext = true; window.HWW3D.onFloor(f); }
    // settling on the same floor: straighten the height only, so the place you slid to along the floor stays
    function shotFloorSnap(f) { if (mode === 'free') shot.ty = f * FH + 1.9; }
    canvas.addEventListener('pointermove', e => {
        if (!down || (e.pointerType === 'mouse' && e.buttons !== 1)) return;
        const dx = e.clientX - down[2], dy = e.clientY - down[3]; down[2] = e.clientX; down[3] = e.clientY;
        if (Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 6 && mode !== 'free') return;
        if (mode !== 'free') { if (mode === 'overview' || mode === 'ride') { Object.assign(shot, { tx: Math.max(-20, Math.min(20, A.x)), ty: A.y + 1.9, dist: 34, yaw: 0.2, pitch: 0.1, turn: 0, rate: 2.2 }); } mode = 'free'; following = false; }
        const upp = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * shot.dist * user.zoom / stage.clientHeight;
        const ya = rig.yaw + user.yaw;                                                              // sideways follows the way the view is turned
        shot.tx = Math.max(-30, Math.min(40, shot.tx - dx * upp * Math.cos(ya)));
        shot.tz = Math.max(-25, Math.min(25, shot.tz + dx * upp * Math.sin(ya)));
        if (e.pointerType !== 'touch') shot.ty = Math.max(1.9, Math.min((FLOORS - 1) * FH + 1.9, shot.ty + dy * upp));   // on a touch screen up and down scrolls the page
        clearTimeout(dragT); dragT = setTimeout(() => { if (down) summon(); }, 450);
    });
    canvas.addEventListener('pointercancel', () => { down = null; });
    canvas.addEventListener('pointerup', e => {
        if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) { const was = down; down = null; if (was && mode === 'free') summon(); return; } down = null;
        const r = canvas.getBoundingClientRect(), v = new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), rc = new THREE.Raycaster(); rc.setFromCamera(v, camera);
        const h = rc.intersectObjects(hits, false)[0]; if (h && window.HWW3D && window.HWW3D.onRoom) window.HWW3D.onRoom(h.object.userData.room);
    });

    // trackpad: two fingers up and down change the floor; open or close the fingers (pinch) to zoom
    const noWheel = '.hww-say, .hww-choices, .hww-ctl, .hww-floors';
    let wAcc = 0, wCool = 0, wLast = 0;
    stage.addEventListener('wheel', e => {
        if (e.target.closest && e.target.closest(noWheel)) return;
        if (e.ctrlKey) { e.preventDefault(); zoom(Math.exp(e.deltaY * 0.012)); return; }          // pinch arrives as a ctrl-wheel in Chrome and Edge
        if (window.scrollY > 4 || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;                // the page below is being read, or this is a sideways swipe
        const dir = e.deltaY > 0 ? -1 : 1, nf = destF + dir;
        if (nf < 0 || nf > FLOORS - 1) return;                                                   // ground floor and scrolling down: let the page scroll on
        e.preventDefault();
        const now = performance.now(); if (now - wLast > 250) wAcc = 0; wLast = now;
        wAcc += e.deltaY; if (Math.abs(wAcc) < 50 || now < wCool) return;
        wAcc = 0; wCool = now + 1100; clearTimeout(dragT);
        if (window.HWW3D && window.HWW3D.onFloor) { holdNext = true; window.HWW3D.onFloor(nf); }
    }, { passive: false });
    let pz = 1;                                                                                    // Safari pinch
    stage.addEventListener('gesturestart', e => { e.preventDefault(); pz = user.zoom; });
    stage.addEventListener('gesturechange', e => { e.preventDefault(); user.zoom = Math.max(0.45, Math.min(zmax(), pz / e.scale)); });

    // ------------------------------------------------------------------ render loop
    let last = performance.now();
    function frame(now) {
        requestAnimationFrame(frame);
        const dt = Math.min(0.25, (now - last) / 1000); last = now; const t = now / 1000;
        stepAlya(dt, t); animate(t, dt);
        if (following) shot.tx = Math.max(-20, Math.min(20, A.x * 0.5 + shot.tx * 0.5));
        const k = 1 - Math.exp(-dt * shot.rate);
        for (const p of ['tx', 'ty', 'tz', 'dist', 'yaw', 'pitch', 'turn']) rig[p] += (shot[p] - rig[p]) * k;
        world.rotation.y = rig.turn * Math.sin(t * 0.22) * 0.25;
        if (disco) { DISCO.ball.rotation.y = t * 1.2; DISCO.beams.forEach((b, i) => { b.rotation.z = Math.sin(t * 1.7 + i * 1.6) * 0.5; b.rotation.x = Math.cos(t * 1.3 + i) * 0.35; }); DISCO.tiles.forEach(tl => { tl.material = glow([0xff5f9e, 0x5eead4, 0xffd36a, 0x7aa2ff][(tl.userData.tile + Math.floor(t * 2.5)) % 4]); }); }
        const af = mode === 'overview' ? -1 : mode === 'free' ? floorAtView() : mode === 'ride' ? Math.max(0, Math.min(FLOORS - 1, Math.round(A.y / FH))) : destF;
        for (let f = 0; f < FLOORS; f++) { const m = floorGlow[f].material, to = f === af ? (nightOn || disco ? 0.12 : 0.2) : 0; m.opacity += (to - m.opacity) * Math.min(1, dt * 6); }
        if (FLAME.m) FLAME.m.scale.y = 1 + Math.sin(t * 25) * 0.25;
        apply(rig); renderer.render(scene, camera);
        bubble();
    }
    // Alya's speech bubble floats over her head: project her head to the screen each frame, keep the bubble inside the stage,
    // flip it below her if she is near the top edge, and aim its tail at her.
    const sayEl = document.getElementById('hww-say'), textEl = document.getElementById('hww-text'), hv = new THREE.Vector3();
    function bubble() {
        if (!sayEl) return;
        const W = stage.clientWidth, Hh = stage.clientHeight, bw = sayEl.offsetWidth, bh = sayEl.offsetHeight;
        hv.setFromMatrixPosition(alyaA.g.matrixWorld); hv.y += 1.0; hv.project(camera);
        const x = Math.max(24, Math.min(W - 24, (hv.x * 0.5 + 0.5) * W)), y = Math.max(0, Math.min(Hh, (-hv.y * 0.5 + 0.5) * Hh));
        const maxL = W - bw - (W > 900 ? 84 : 10), left = Math.max(10, Math.min(maxL, x - bw / 2));
        let top = y - bh - 16, below = false;
        if (top < 8) { top = y + 100; below = true; }
        top = Math.min(top, Hh - bh - 70);
        sayEl.style.transform = 'translate(' + left.toFixed(1) + 'px,' + top.toFixed(1) + 'px)';
        sayEl.style.setProperty('--tx', Math.max(22, Math.min(bw - 22, x - left)).toFixed(1) + 'px');
        sayEl.classList.toggle('below', below); sayEl.classList.toggle('idle', !textEl.textContent);
    }
    Object.assign(rig, shot);
    requestAnimationFrame(frame);
    window.HWW3D = { floorGlow, A, renderer, to, overview, place, enter, look, tilt, zoom, setNight, setDisco, rooms: ROOM, onRoom: null, live, rig, ready: true };
    document.documentElement.setAttribute('data-hww3d', 'ready');
    document.dispatchEvent(new Event('ypt:hww3d'));
}

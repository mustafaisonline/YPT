// The reception ("Arrival"): a real-material lobby for the How We Work tower. Loaded after the scene is ready; the simple placeholder
// furniture stays until this has loaded. Real models and materials are CC0 from Poly Haven (see assets/hww/CREDITS.md); the desk, the
// feature wall, paintings and the slide screen are built here in code. Nothing shown on the screens is a real figure.
import * as THREE from './vendor/three.module.min.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

export const CX = -12.4, X0 = CX - 5.5, X1 = CX + 5.5, ZB = -6, ZF = 6, CEIL = 3.1;

const DZ_ = -2.7; let sculpt = null;
export async function buildReception(ctx) {
    const { scene, renderer, parent, LOWQ, FH } = ctx;
    const base = 'assets/hww/';
    const root = new THREE.Group(); root.name = 'reception'; root.position.y = 0.09; parent.add(root);   // the plaza lawn the tower stands on is 9 cm proud of the slab
    const wallG = new THREE.Group(); wallG.position.z = 0.14; root.add(wallG);   // wall-mounted pieces sit proud of the building's column
    const inside = new THREE.Group(); inside.name = 'reception-inside'; inside.visible = false; root.add(inside);   // only drawn when you step in
    const tl = new THREE.TextureLoader(), aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    // image-based light for the real materials (only MeshStandard materials use it; the rest of the tower is unchanged)
    if (!scene.environment) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose(); }

    const tex = (name, tag, rep, srgb) => {
        const t = tl.load(base + 'tex/' + name + '_' + tag + '.jpg'); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = aniso;
        if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t;
    };
    const pbr = (name, rep, o) => new THREE.MeshStandardMaterial(Object.assign({ map: tex(name, 'diff', rep, true), roughnessMap: tex(name, 'rough', rep), normalMap: tex(name, 'nor', rep), roughness: 1, metalness: 0, envMapIntensity: 0.55 }, o));
    const plain = (color, o) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.6, metalness: 0, envMapIntensity: 0.5 }, o));
    const brass = new THREE.MeshStandardMaterial({ color: 0xd2a84e, roughness: 0.32, metalness: 1, envMapIntensity: 1.1 });
    const emissive = (c, i) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false, transparent: i != null, opacity: i == null ? 1 : i });
    const mesh = (geo, mat, x, y, z, par) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); (par || root).add(m); return m; };
    const bx = (w, h, d, mat, x, y, z, par) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, par);

    // ------------------------------------------------------------------ canvas art (all generated here)
    const ctex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; t.userData.c = c; return t; };
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    function painting(pal, bg) {
        return ctex(640, 800, (x, w, h) => {
            x.fillStyle = bg; x.fillRect(0, 0, w, h);
            for (let i = 0; i < 26; i++) {                                           // broad washes
                const c = pal[Math.floor(rnd() * pal.length)], cx = rnd() * w, cy = rnd() * h, r = 90 + rnd() * 260;
                const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, c + 'cc'); g.addColorStop(1, c + '00'); x.fillStyle = g; x.fillRect(0, 0, w, h);
            }
            for (let i = 0; i < 70; i++) {                                           // brush strokes
                x.strokeStyle = pal[Math.floor(rnd() * pal.length)] + (rnd() > 0.5 ? 'dd' : '88'); x.lineWidth = 6 + rnd() * 38; x.lineCap = 'round';
                const x0 = rnd() * w, y0 = rnd() * h; x.beginPath(); x.moveTo(x0, y0); x.bezierCurveTo(x0 + rnd() * 240 - 120, y0 + rnd() * 160 - 80, x0 + rnd() * 320 - 160, y0 + rnd() * 160 - 80, x0 + rnd() * 400 - 200, y0 + rnd() * 240 - 120); x.stroke();
            }
            x.globalAlpha = 0.07; for (let i = 0; i < 2600; i++) { x.fillStyle = rnd() > 0.5 ? '#fff' : '#000'; x.fillRect(rnd() * w, rnd() * h, 2, 2 + rnd() * 6); } x.globalAlpha = 1;   // canvas weave
        });
    }
    const ART = [
        painting(['#1c3d8f', '#2457f5', '#7aa2ff', '#f28a1e', '#fff3df'], '#f3efe6'),
        painting(['#0b7a6e', '#14b8a6', '#9be7dc', '#e9b949', '#12203f'], '#eef3ef'),
        painting(['#6b2f6e', '#ec4f93', '#f6b7d3', '#2457f5', '#fff6ea'], '#f6efe9'),
        painting(['#12203f', '#2f4a86', '#d4af37', '#f4e4b0', '#8aa6e0'], '#ece9e1')
    ];

    // the slide deck shown on the digital wall: slides turn every few seconds
    const SLIDES = [
        ['Welcome', 'Your Partner Technologies', 'We use AI agents to build your solution.'],
        ['Tell us what you need', 'Our agents build it', 'You chat with the solution, or talk to it.'],
        ['Launch offer', 'Any solution for $100', 'For our first 500 customers.'],
        ['Seven agents', 'One team, from idea to launch', 'Discover, design, build, check and launch.']
    ];
    let logoImg = null; const li = new Image(); li.onload = () => { logoImg = li; drawSlide(slideI); drawInlay(); brandPanel(); drawMon(); }; li.src = 'assets/images/ypt-logo-320.png';
    const slideTex = ctex(1280, 720, () => {}); let slideI = 0;
    function drawSlide(i) {
        const c = slideTex.userData.c, x = c.getContext('2d'), w = c.width, h = c.height, s = SLIDES[i % SLIDES.length];
        const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#0b1230'); g.addColorStop(0.6, '#1a2a6a'); g.addColorStop(1, '#2457f5'); x.fillStyle = g; x.fillRect(0, 0, w, h);
        x.fillStyle = 'rgba(255,255,255,.06)'; x.beginPath(); x.arc(w * 0.86, h * 0.2, 330, 0, 7); x.fill(); x.beginPath(); x.arc(w * 0.1, h * 1.0, 240, 0, 7); x.fill();
        if (logoImg) { x.save(); x.beginPath(); x.arc(110, 110, 62, 0, 7); x.clip(); x.drawImage(logoImg, 48, 48, 124, 124); x.restore(); }
        x.fillStyle = '#9fb8ff'; x.font = '600 34px Geist, Helvetica, Arial'; x.textBaseline = 'alphabetic'; x.fillText(s[0].toUpperCase(), 100, h * 0.42);
        x.fillStyle = '#fff'; x.font = '700 92px Geist, Helvetica, Arial'; x.fillText(s[1], 100, h * 0.6);
        x.fillStyle = '#d8e2ff'; x.font = '500 44px Geist, Helvetica, Arial'; x.fillText(s[2], 100, h * 0.74);
        for (let k = 0; k < SLIDES.length; k++) { x.fillStyle = k === i % SLIDES.length ? '#f28a1e' : 'rgba(255,255,255,.3)'; x.fillRect(100 + k * 46, h - 80, 32, 8); }
        slideTex.needsUpdate = true;
    }
    drawSlide(0);
    let drawMon = () => {};

    // ------------------------------------------------------------------ shell: floor, walls, ceiling, glass
    const stone = pbr('marble_01', [3.4, 3.6], { roughness: 0.42, color: 0xc2c0ba, envMapIntensity: 0.8 });
    const floor = mesh(new THREE.PlaneGeometry(X1 - X0, ZF - ZB), stone, CX, 0.012, 0); floor.rotation.x = -Math.PI / 2;
    // inlay: dark stone border with a brass line, slab joints, and a medallion in front of the desk
    const MX = CX + 1.4, MZ = 0.4;
    function drawInlay() {
        const c = inlayTex.userData.c, x = c.getContext('2d'), w = c.width, h = c.height, pxm = w / (X1 - X0), X = v => (v - X0) * pxm, Z = v => (v - ZB) * pxm;
        x.clearRect(0, 0, w, h);
        x.strokeStyle = 'rgba(40,36,30,.28)'; x.lineWidth = 3;                                              // slab joints
        for (let gx = X0 + 2.75; gx < X1 - 0.5; gx += 2.75) { x.beginPath(); x.moveTo(X(gx), Z(ZB + 0.55)); x.lineTo(X(gx), Z(ZF - 0.55)); x.stroke(); }
        for (let gz = ZB + 2.75; gz < ZF - 0.5; gz += 2.75) { x.beginPath(); x.moveTo(X(X0 + 0.55), Z(gz)); x.lineTo(X(X1 - 0.55), Z(gz)); x.stroke(); }
        x.fillStyle = '#25272e'; x.fillRect(X(X0), Z(ZB), X(X1) - X(X0), 0.5 * pxm); x.fillRect(X(X0), Z(ZF - 0.5), X(X1) - X(X0), 0.5 * pxm);   // border band
        x.fillRect(X(X0), Z(ZB), 0.5 * pxm, Z(ZF) - Z(ZB)); x.fillRect(X(X1 - 0.5), Z(ZB), 0.5 * pxm, Z(ZF) - Z(ZB));
        x.strokeStyle = '#d2a84e'; x.lineWidth = 5; x.strokeRect(X(X0 + 0.58), Z(ZB + 0.58), (X1 - X0 - 1.16) * pxm, (ZF - ZB - 1.16) * pxm);
        const mx = X(MX), mz = Z(MZ), r = 1.5 * pxm;                                                         // medallion
        x.fillStyle = '#1d2030'; x.beginPath(); x.arc(mx, mz, r, 0, 7); x.fill();
        x.strokeStyle = '#d2a84e'; x.lineWidth = 6; [1, 0.9, 0.62, 0.2].forEach(k => { x.beginPath(); x.arc(mx, mz, r * k, 0, 7); x.stroke(); });
        x.fillStyle = '#d2a84e'; for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; x.save(); x.translate(mx, mz); x.rotate(a); x.fillRect(r * 0.66, -2.5, r * 0.2, 5); x.restore(); }
        x.fillStyle = '#e9c36a'; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + Math.PI / 8; x.save(); x.translate(mx, mz); x.rotate(a); x.beginPath(); x.moveTo(r * 0.2, 0); x.lineTo(r * 0.58, -r * 0.07); x.lineTo(r * 0.58, r * 0.07); x.closePath(); x.fill(); x.restore(); }
        if (logoImg) { x.save(); x.beginPath(); x.arc(mx, mz, r * 0.19, 0, 7); x.clip(); x.drawImage(logoImg, mx - r * 0.19, mz - r * 0.19, r * 0.38, r * 0.38); x.restore(); }
        inlayTex.needsUpdate = true;
    }
    const inlayTex = ctex(2048, Math.round(2048 * (ZF - ZB) / (X1 - X0)), () => {});
    const inlay = mesh(new THREE.PlaneGeometry(X1 - X0, ZF - ZB), new THREE.MeshStandardMaterial({ map: inlayTex, transparent: true, roughness: 0.28, metalness: 0.05, envMapIntensity: 0.9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }), CX, 0.016, 0); inlay.rotation.x = -Math.PI / 2; drawInlay();
    const plaster = pbr('plastered_wall_04', [3, 1.2], { color: 0xcfcdc7 });
    const walnut = pbr('walnut_veneer', [1, 1], { roughness: 0.9, color: 0xb8a998, envMapIntensity: 0.35 });
    // feature wall behind the desk: warm plaster with a fluted walnut centre and a backlit brand panel
    bx(X1 - X0, CEIL, 0.06, plaster, CX, CEIL / 2, ZB + 0.08);
    const flutes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.07, 3.0, 0.1), walnut, 70);
    { const m = new THREE.Matrix4(); for (let i = 0; i < 70; i++) { m.makeTranslation(CX - 3.6 + i * 0.104, 1.55, ZB + 0.17); flutes.setMatrixAt(i, m); } wallG.add(flutes); }
    bx(7.4, 3.0, 0.04, plain(0x1b1510, { roughness: 0.9 }), CX, 1.55, ZB + 0.13, wallG);                                   // dark backing seen between the flutes
    flutes.renderOrder = 1;
    // the brand panel: emblem, YPT monogram, spaced wordmark and a tagline, in champagne metal on a dark panel with a raised edge
    const brandTex = ctex(2048, 440, () => {});
    function brandPanel() {
        const c = brandTex.userData.c, x = c.getContext('2d'), w = c.width, h = c.height; x.clearRect(0, 0, w, h);
        const gold = () => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#fff6dc'); g.addColorStop(0.45, '#f0d48a'); g.addColorStop(1, '#c99a3c'); return g; };
        x.textBaseline = 'alphabetic';
        const spaced = (t, cx, y, sp) => { const ws = [...t].map(ch => x.measureText(ch).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (t.length - 1); let px = cx - tot / 2; [...t].forEach((ch, i) => { x.fillText(ch, px, y); px += ws[i] + sp; }); };
        const hasLogo = !!logoImg, tx = hasLogo ? w * 0.56 : w / 2;
        if (hasLogo) { x.save(); x.beginPath(); x.arc(w * 0.17, h * 0.5, 150, 0, 7); x.clip(); x.drawImage(logoImg, w * 0.17 - 150, h * 0.5 - 150, 300, 300); x.restore(); x.strokeStyle = gold(); x.lineWidth = 7; x.beginPath(); x.arc(w * 0.17, h * 0.5, 160, 0, 7); x.stroke(); }
        x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 14; x.shadowOffsetY = 6;
        x.fillStyle = gold(); x.font = '800 190px Geist, Helvetica, Arial'; spaced('YPT', tx, h * 0.52, 26);
        x.shadowColor = 'transparent'; x.fillStyle = gold(); x.fillRect(tx - 330, h * 0.6, 660, 4);
        x.font = '600 58px Geist, Helvetica, Arial'; spaced('YOUR PARTNER TECHNOLOGIES', tx, h * 0.76, 11);
        x.fillStyle = '#e8dcc0'; x.font = '500 40px Geist, Helvetica, Arial'; spaced('AGENTIC AI, BUILT AROUND YOU', tx, h * 0.92, 8);
        brandTex.needsUpdate = true;
    }
    brandPanel();
    bx(5.6, 1.12, 0.07, plain(0x101319, { roughness: 0.45, metalness: 0.25 }), CX, 2.5, ZB + 0.2, wallG);
    bx(5.76, 0.05, 0.1, brass, CX, 3.06, ZB + 0.21, wallG); bx(5.76, 0.05, 0.1, brass, CX, 1.94, ZB + 0.21, wallG);
    bx(0.05, 1.17, 0.1, brass, CX - 2.8, 2.5, ZB + 0.21, wallG); bx(0.05, 1.17, 0.1, brass, CX + 2.8, 2.5, ZB + 0.21, wallG);
    const logo = mesh(new THREE.PlaneGeometry(5.1, 5.1 * 440 / 2048), new THREE.MeshBasicMaterial({ map: brandTex, transparent: true, toneMapped: false }), CX, 2.5, ZB + 0.245, wallG);
       // glow line above the panel
    // glass partition to the Academy hall: tinted glass, a frosted design (halftone dots, a frosted band, a kick band) and a real double door
    const partGlass = new THREE.MeshPhongMaterial({ color: 0xd7e6ff, transparent: true, opacity: 0.14, shininess: 150, specular: 0xffffff, depthWrite: false });
    function etch(wm, hm, doors) {
        const W = 2048, H = Math.round(2048 * hm / wm), ppm = W / wm;
        return ctex(W, H, (x, w, h) => {
            x.clearRect(0, 0, w, h); const Y = m => h - m * ppm;
            x.fillStyle = 'rgba(255,255,255,.62)'; x.fillRect(0, Y(0.32), w, 0.32 * ppm);                                            // frosted kick band
            x.fillStyle = 'rgba(255,255,255,.5)'; x.fillRect(0, Y(1.5), w, 0.42 * ppm);                                             // frosted band at eye level
            x.fillStyle = 'rgba(255,255,255,.28)'; for (let i = 0; i < w; i += 11) x.fillRect(i, Y(1.5), 2, 0.42 * ppm);            // fine vertical lines in the band
            x.fillStyle = 'rgba(210,168,78,.9)'; x.fillRect(0, Y(1.5) - 2, w, 3); x.fillRect(0, Y(1.08), w, 3);                    // brass hairlines
            const sp = 0.2 * ppm;                                                                                                    // halftone dots fading upwards
            for (let row = 0, yy = Y(1.62); yy > Y(2.95); row++, yy -= sp) { const k = (Y(1.62) - yy) / (Y(1.62) - Y(2.95)), r = sp * 0.34 * (1 - k); if (r < 0.8) continue; x.fillStyle = 'rgba(255,255,255,.7)'; for (let xx = (row % 2) * sp / 2; xx < w; xx += sp) { x.beginPath(); x.arc(xx, yy, r, 0, 7); x.fill(); } }
            doors.forEach(d => x.clearRect(d[0] * ppm, 0, (d[1] - d[0]) * ppm, h));
        });
    }
    const doors = [];
    function glassDoor(par, x, z, ry, w, wx, wz, reachP, reachA) {   // an automatic sliding door: a dark frame, a sensor, and two glass leaves that slide apart when someone comes near, from either side
        const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; par.add(g);
        const H = 2.55, T = 0.09, fm = frontM, glassM = new THREE.MeshPhongMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.16, shininess: 160, specular: 0xffffff, depthWrite: false });
        bx(T, H, 0.12, fm, -w / 2 - T / 2, H / 2, 0, g); bx(T, H, 0.12, fm, w / 2 + T / 2, H / 2, 0, g); bx(w + 2 * T, 0.16, 0.14, fm, 0, H + 0.02, 0, g);
        bx(0.3, 0.07, 0.1, plain(0x0b0d12, { roughness: 0.3 }), 0, H - 0.08, 0.07, g); bx(0.12, 0.012, 0.012, emissive(0x3ddc97), 0, H - 0.08, 0.125, g);   // sensor with a green light
        bx(w, 0.02, 0.2, brass, 0, 0.006, 0, g);                                                                                                               // threshold
        bx(w, 0.03, 0.05, fm, 0, H - 0.1, 0.045, g);                                                                                                           // track
        const leaves = [-1, 1].map(sx => { const L = new THREE.Group(); L.position.set(sx * w / 4, 0, 0.045); g.add(L);
            bx(w / 2 - 0.02, H - 0.14, 0.025, glassM, 0, H / 2 - 0.05, 0, L); bx(w / 2 - 0.02, 0.24, 0.035, brass, 0, 0.13, 0, L);                              // glass and kick plate
            bx(0.035, H - 0.14, 0.04, fm, -sx * (w / 4 - 0.03), H / 2 - 0.05, 0, L); bx(0.035, H - 0.14, 0.04, fm, sx * (w / 4 - 0.03), H / 2 - 0.05, 0, L);   // leaf edges
            mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 12), brass, -sx * (w / 4 - 0.1), 1.05, 0.03, L); L.userData.x0 = sx * w / 4; L.userData.sx = sx; return L; });
        const d = { leaves, w, open: 0, x: wx, z: wz, reachP, reachA }; doors.push(d); return d;
    }
    const part = mesh(new THREE.PlaneGeometry(ZF - ZB, 3.0), partGlass, X1, 1.55, 0); part.rotation.y = Math.PI / 2;
    const DZ1 = 2.7, DW1 = 2.0;   // on Alya's walking line, so she passes through it
    const partEtch = mesh(new THREE.PlaneGeometry(ZF - ZB, 3.0), new THREE.MeshBasicMaterial({ map: etch(ZF - ZB, 3.0, [[ZF - (DZ1 + DW1 / 2 + 0.05) - ZB, ZF - (DZ1 - DW1 / 2 - 0.05) - ZB]]), transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide, opacity: 0.95 }), X1 + 0.004, 1.55, 0); partEtch.rotation.y = Math.PI / 2;
    const frontM = plain(0x23262f, { metalness: 0.7, roughness: 0.45 });
    glassDoor(root, X1, DZ1, Math.PI / 2, DW1, X1, DZ1, 1.9, 4.2);
    bx(0.12, 0.06, ZF - ZB, frontM, X1, 3.07, 0);
    for (const zz of [ZB + 0.06, 0.0, ZF - 0.06]) bx(0.1, 3.1, 0.1, frontM, X1, 1.55, zz);
    // skirting
    bx(X1 - X0, 0.16, 0.04, plain(0x2b2f3a, { roughness: 0.45 }), CX, 0.1, ZB + 0.14); bx(X1 - X0, 0.025, 0.06, brass, CX, 0.19, ZB + 0.14);
    // ceiling: a dropped panel with a coffered border, crown moulding, recessed downlights and warm coves (only seen from inside)
    const ceilTex = ctex(256, 256, (x, w, h) => { const g = x.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.75); g.addColorStop(0, '#f6f1e6'); g.addColorStop(1, '#cfc8b8'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    const ceil = mesh(new THREE.PlaneGeometry(X1 - X0, ZF - ZB), new THREE.MeshBasicMaterial({ map: ceilTex, toneMapped: false }), CX, CEIL, 0, inside); ceil.rotation.x = Math.PI / 2;
    const dl = new THREE.CircleGeometry(0.1, 20), dlm = emissive(0xfff2d4), cm = new THREE.MeshBasicMaterial({ color: 0xe4ded0, toneMapped: false }), warm = emissive(0xffe3a8);
    for (let ix = 0; ix < 4; ix++) for (let iz = 0; iz < 4; iz++) { const m = mesh(dl, dlm, X0 + 1.4 + ix * 2.55, CEIL - 0.01, ZB + 1.4 + iz * 3.1, inside); m.rotation.x = Math.PI / 2; }
    // crown moulding all round, and a deeper raft over the desk with a lit edge
    bx(X1 - X0, 0.18, 0.18, cm, CX, CEIL - 0.09, ZB + 0.15, inside); bx(X1 - X0, 0.18, 0.18, cm, CX, CEIL - 0.09, ZF - 0.1, inside);
    bx(0.18, 0.18, ZF - ZB, cm, X0 + 0.1, CEIL - 0.09, 0, inside); bx(0.18, 0.18, ZF - ZB, cm, X1 - 0.1, CEIL - 0.09, 0, inside);
    bx(7.0, 0.14, 2.5, cm, CX, CEIL - 0.07, DZ_ - 0.1, inside);
    bx(6.84, 0.03, 0.04, warm, CX, CEIL - 0.15, DZ_ + 1.12, inside); bx(6.84, 0.03, 0.04, warm, CX, CEIL - 0.15, DZ_ - 1.32, inside);
    bx(0.04, 0.03, 2.3, warm, CX - 3.42, CEIL - 0.15, DZ_ - 0.1, inside); bx(0.04, 0.03, 2.3, warm, CX + 3.42, CEIL - 0.15, DZ_ - 0.1, inside);
    bx(X1 - X0 - 0.6, 0.03, 0.04, warm, CX, CEIL - 0.19, ZB + 0.36, inside);                                                      // cove light along the feature wall
    // two brass ring pendants over the desk
    for (const sx of [-2.5, 2.5]) { const r = mesh(new THREE.TorusGeometry(0.5, 0.025, 12, 48), brass, CX + sx, 2.35, DZ_ + 0.2, inside); r.rotation.x = Math.PI / 2; const gl = mesh(new THREE.TorusGeometry(0.5, 0.012, 8, 48), emissive(0xffeab8), CX + sx, 2.33, DZ_ + 0.2, inside); gl.rotation.x = Math.PI / 2;
        for (const a of [0, 2.1, 4.2]) bx(0.008, CEIL - 2.35, 0.008, brass, CX + sx + Math.cos(a) * 0.5, 2.35 + (CEIL - 2.35) / 2, DZ_ + 0.2 + Math.sin(a) * 0.5, inside); }
    // glazed entrance wall (drawn only when you step inside): etched glass, mullions and a double door
    const fg = mesh(new THREE.PlaneGeometry(X1 - X0, 3.0), partGlass, CX, 1.55, ZF - 0.02, inside);
    const DX2 = CX + 1.9, DW2 = 2.0;
    mesh(new THREE.PlaneGeometry(X1 - X0, 3.0), new THREE.MeshBasicMaterial({ map: etch(X1 - X0, 3.0, [[DX2 - DW2 / 2 - 0.05 - X0, DX2 + DW2 / 2 + 0.05 - X0]]), transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide, opacity: 0.95 }), CX, 1.55, ZF - 0.014, inside);
    for (let k = 0; k <= 6; k++) { const mx = X0 + k * (X1 - X0) / 6; if (Math.abs(mx - DX2) > DW2 / 2 + 0.1) bx(0.07, 3.1, 0.07, frontM, mx, 1.55, ZF - 0.02, inside); }
    bx(X1 - X0, 0.08, 0.08, frontM, CX, 3.07, ZF - 0.02, inside);
    glassDoor(inside, DX2, ZF - 0.02, 0, DW2, DX2, ZF, 2.0, 0);

    // ------------------------------------------------------------------ the reception desk (built in code)
    const DZ = DZ_, dW = 5.0;
    const deskBase = new THREE.Group(); deskBase.position.set(CX, 0, DZ); root.add(deskBase);
    bx(dW, 1.02, 0.12, plain(0x1b1510), 0, 0.52, 0.42, deskBase);
    { const n = Math.round(dW / 0.1), fl = new THREE.InstancedMesh(new THREE.BoxGeometry(0.065, 1.0, 0.06), walnut, n), m = new THREE.Matrix4(); for (let i = 0; i < n; i++) { m.makeTranslation(-dW / 2 + 0.05 + i * (dW - 0.1) / (n - 1), 0.52, 0.5); fl.setMatrixAt(i, m); } deskBase.add(fl); }
    bx(dW + 0.1, 0.07, 1.25, pbr('marble_01', [2.4, 0.9], { roughness: 0.4, color: 0xc6c2ba }), 0, 1.07, 0.1, deskBase);          // honed stone top
    bx(dW + 0.12, 0.04, 0.04, brass, 0, 1.0, 0.72, deskBase);                                                           // brass edge
    bx(dW - 0.4, 0.035, 0.04, emissive(0xffd890), 0, 0.12, 0.46, deskBase);                                              // warm kick light
    bx(dW - 0.2, 0.74, 0.5, plain(0x2a211a), 0, 0.37, -0.35, deskBase);                                                 // working surface behind the raised front
    bx(dW - 0.2, 0.04, 0.55, pbr('walnut_veneer', [1.6, 0.3], { roughness: 0.7, color: 0xb8a998 }), 0, 0.76, -0.35, deskBase);
    // two desk screens: a welcome / check-in screen and a "who is on duty" board, both drawn here (no real figures)
    const monA = ctex(1024, 640, () => {}), monB = ctex(1024, 640, () => {});
    drawMon = () => {
        const bg = x => { const g = x.createLinearGradient(0, 0, 1024, 640); g.addColorStop(0, '#0b1230'); g.addColorStop(1, '#1d3a9a'); x.fillStyle = g; x.fillRect(0, 0, 1024, 640); };
        let c = monA.userData.c.getContext('2d'); bg(c);
        if (logoImg) { c.save(); c.beginPath(); c.arc(100, 96, 44, 0, 7); c.clip(); c.drawImage(logoImg, 56, 52, 88, 88); c.restore(); }
        c.fillStyle = '#9fb8ff'; c.font = '600 28px Geist, Helvetica, Arial'; c.fillText('WELCOME', 170, 84); c.fillStyle = '#fff'; c.font = '700 40px Geist, Helvetica, Arial'; c.fillText('Your Partner Technologies', 170, 126);
        c.fillStyle = '#fff'; c.font = '700 64px Geist, Helvetica, Arial'; c.fillText('Good to see you.', 56, 270);
        c.fillStyle = '#d8e2ff'; c.font = '500 36px Geist, Helvetica, Arial'; c.fillText('Tell us what you would like to build.', 56, 332); c.fillText('We will bring in the right agent.', 56, 380);
        c.fillStyle = '#f28a1e'; c.beginPath(); c.roundRect(56, 450, 420, 92, 46); c.fill(); c.fillStyle = '#fff'; c.font = '700 34px Geist, Helvetica, Arial'; c.fillText('Tap to check in  →', 100, 508);
        c.fillStyle = 'rgba(255,255,255,.55)'; c.font = '500 26px Geist, Helvetica, Arial'; c.fillText('Visitors and guests are welcome', 56, 600);
        monA.needsUpdate = true;
        c = monB.userData.c.getContext('2d'); bg(c);
        c.fillStyle = '#9fb8ff'; c.font = '600 28px Geist, Helvetica, Arial'; c.fillText('ON DUTY TODAY', 56, 78); c.fillStyle = '#fff'; c.font = '700 44px Geist, Helvetica, Arial'; c.fillText('Our agent team', 56, 130);
        [['Discover', 'asks the right questions'], ['Design', 'plans what you will see'], ['Build', 'creates your solution'], ['Check', 'tests it with our people'], ['Launch', 'goes live with you']].forEach((r, i) => {
            const y = 200 + i * 74; c.fillStyle = 'rgba(255,255,255,.09)'; c.beginPath(); c.roundRect(56, y - 40, 912, 60, 16); c.fill();
            c.fillStyle = '#3ddc97'; c.beginPath(); c.arc(92, y - 10, 10, 0, 7); c.fill();
            c.fillStyle = '#fff'; c.font = '700 32px Geist, Helvetica, Arial'; c.fillText(r[0], 124, y); c.fillStyle = '#c3d1ff'; c.font = '500 28px Geist, Helvetica, Arial'; c.fillText(r[1], 330, y); });
        c.fillStyle = 'rgba(255,255,255,.55)'; c.font = '500 24px Geist, Helvetica, Arial'; c.fillText('Seven agents, one team', 56, 610);
        monB.needsUpdate = true;
    };
    drawMon();
    function monitor(x, tex) {
        const g = new THREE.Group(); g.position.set(x, 1.1, -0.1); g.rotation.x = -0.12; deskBase.add(g);
        bx(0.86, 0.56, 0.035, plain(0x0b0d12, { roughness: 0.25, metalness: 0.5 }), 0, 0.3, 0, g);
        mesh(new THREE.PlaneGeometry(0.8, 0.5), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }), 0, 0.3, 0.019, g);
        const neck = bx(0.06, 0.2, 0.04, plain(0x2b2f3a, { metalness: 0.7, roughness: 0.35 }), 0, 0.02, -0.03, g); neck.rotation.x = 0.12;
        mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.02, 28), plain(0x2b2f3a, { metalness: 0.7, roughness: 0.35 }), 0, -0.06, 0.0, g);
        return g;
    }
    monitor(-1.55, monA); monitor(1.55, monB);
    // a small bell and a name plate in brass
    mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.04, 20), brass, 0.1, 1.13, 0.35, deskBase); mesh(new THREE.SphereGeometry(0.04, 12, 8), brass, 0.1, 1.17, 0.35, deskBase);

    // ------------------------------------------------------------------ paintings and the slide wall
    function frame(x, y, z, w, h, art, par) {
        const g = new THREE.Group(); g.position.set(x, y, z); (par || wallG).add(g);
        bx(w + 0.12, h + 0.12, 0.06, plain(0x15110d, { roughness: 0.55 }), 0, 0, 0, g);
        mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: art, roughness: 0.85, envMapIntensity: 0.25 }), 0, 0, 0.035, g);
        bx(0.5, 0.025, 0.12, brass, 0, h / 2 + 0.28, 0.1, g); bx(0.02, 0.2, 0.02, brass, 0, h / 2 + 0.17, 0.05, g);     // picture light
        const glowM = new THREE.MeshBasicMaterial({ color: 0xffe9bd, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide });
        const cone = mesh(new THREE.PlaneGeometry(w * 0.9, h * 0.95), glowM, 0, 0, 0.06, g);
        return g;
    }
    frame(CX + 4.3, 1.7, ZB + 0.16, 1.15, 1.45, ART[1]);
    // the wall TV, left of the desk: the website's own hero video, with a brand caption bar. Until the video is ready (or if it cannot load) it shows the poster slides.
    const screen = new THREE.Group(); screen.position.set(CX - 4.5, 1.75, ZB + 0.17); wallG.add(screen);
    bx(2.0, 1.2, 0.08, plain(0x0c0e13, { roughness: 0.35, metalness: 0.4 }), 0, 0, 0, screen);
    bx(2.06, 1.26, 0.03, brass, 0, 0, -0.03, screen);
    const tvMat = new THREE.MeshBasicMaterial({ map: slideTex, toneMapped: false });
    mesh(new THREE.PlaneGeometry(1.9, 1.069), tvMat, 0, 0, 0.045, screen);
    const capTex = ctex(1024, 96, (x, w, h) => { const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(8,12,34,.88)'); g.addColorStop(1, 'rgba(8,12,34,.55)'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = '#f28a1e'; x.fillRect(0, 0, 10, h); x.fillStyle = '#fff'; x.font = '700 38px Geist, Helvetica, Arial'; x.textBaseline = 'middle'; x.fillText('Your Partner Technologies', 34, h / 2); x.fillStyle = '#c3d1ff'; x.font = '500 30px Geist, Helvetica, Arial'; x.textAlign = 'right'; x.fillText('Agentic AI, built around you', w - 28, h / 2); });
    mesh(new THREE.PlaneGeometry(1.9, 1.9 * 96 / 1024), new THREE.MeshBasicMaterial({ map: capTex, transparent: true, toneMapped: false }), 0, -0.47, 0.05, screen);
    let vid = null;
    function wake() {   // start the video the first time someone steps inside
        if (vid || LOWQ_NO_VIDEO) return; vid = document.createElement('video');
        vid.crossOrigin = 'anonymous'; vid.muted = true; vid.loop = true; vid.playsInline = true; vid.setAttribute('playsinline', ''); vid.preload = 'auto';
        vid.src = 'https://objectstorage.us-sanjose-1.oraclecloud.com/n/axtx9ohfletb/b/ypt/o/home-page-hero.mp4';
        vid.addEventListener('playing', () => { const vt = new THREE.VideoTexture(vid); vt.colorSpace = THREE.SRGBColorSpace; tvMat.map = vt; tvMat.needsUpdate = true; }, { once: true });
        vid.addEventListener('error', () => { vid = null; });
        const pl = vid.play(); if (pl && pl.catch) pl.catch(() => {});
    }
    const LOWQ_NO_VIDEO = false;
    bx(2.0, 0.02, 0.085, brass, 0, -0.61, 0, screen);

    // ------------------------------------------------------------------ real models
    const loader = new GLTFLoader(); const cache = {};
    async function model(name) { if (!cache[name]) cache[name] = loader.loadAsync(base + 'models/' + name + '/' + name + '.gltf'); return (await cache[name]).scene.clone(true); }
    function prep(o) { o.traverse(m => { if (m.isMesh) { m.frustumCulled = true; const mm = m.material; if (mm) { mm.envMapIntensity = 0.7; if (mm.map) mm.map.anisotropy = aniso; } } }); return o; }
    const box3 = new THREE.Box3(), size = new THREE.Vector3();
    async function put(name, o) {
        let g; try { g = prep(await model(name)); } catch (e) { console.warn('reception model failed', name, e); return null; }
        const holder = new THREE.Group(); holder.add(g);
        box3.setFromObject(g); box3.getSize(size);
        const k = o.h ? o.h / size.y : o.w ? o.w / size.x : o.s || 1; g.scale.multiplyScalar(k);
        box3.setFromObject(g); g.position.set(-(box3.min.x + box3.max.x) / 2, -box3.min.y, -(box3.min.z + box3.max.z) / 2);   // stand centred on its footprint
        holder.position.set(o.x, o.y || 0, o.z); holder.rotation.y = o.ry || 0; root.add(holder);
        if (o.shadow) { const b = new THREE.Mesh(new THREE.PlaneGeometry(o.shadow[0], o.shadow[1]), ctx.shadowMat); b.rotation.x = -Math.PI / 2; b.position.set(o.x, 0.02, o.z); b.renderOrder = 1; root.add(b); }
        return holder;
    }
    // lounge, left of the desk: a black leather chesterfield facing two walnut-and-leather armchairs around a stone table
    const L = CX - 3.7;
    const jobs = [
        put('sofa_02', { x: CX - 4.6, z: 1.9, ry: Math.PI / 2, w: 2.2, shadow: [3.2, 3.2] }),
        put('modern_arm_chair_01', { x: CX - 1.9, z: 0.55, ry: -Math.PI / 2 + 0.25, h: 0.88, shadow: [1.8, 1.8] }),
        put('modern_arm_chair_01', { x: CX - 1.9, z: 3.25, ry: -Math.PI / 2 - 0.25, h: 0.88, shadow: [1.8, 1.8] }),
        put('coffee_table_round_01', { x: CX - 3.1, z: 1.9, w: 1.05, shadow: [1.6, 1.6] }),
        put('Ottoman_01', { x: CX - 3.1, z: 3.7, ry: 0.2, w: 0.85, shadow: [1.3, 1.3] }),
        put('mid_century_lounge_chair', { x: CX + 3.75, z: -0.3, ry: -2.0, h: 0.98, shadow: [1.8, 1.8] }),
        put('side_table_tall_01', { x: CX + 3.4, z: 0.95, h: 0.82, shadow: [0.9, 0.9] }),
        put('modern_wooden_cabinet', { x: CX + 3.4, z: ZB + 0.5, w: 1.9, shadow: [2.6, 1.2] }),
        put('modern_ceiling_lamp_01', { x: CX - 3.1, z: 1.9, y: 1.75, s: 1.0 }),
        put('modern_ceiling_lamp_01', { x: CX - 2.9, z: -1.9, y: 2.0, s: 1.0 }),
        put('modern_ceiling_lamp_01', { x: CX + 2.9, z: -1.9, y: 2.0, s: 1.0 }),
        put('ceramic_vase_01', { x: CX + 2.9, z: ZB + 0.5, y: 0.81, h: 0.42 }),
        put('brass_vase_01', { x: CX + 4.0, z: ZB + 0.5, y: 0.81, h: 0.5 }),
        put('potted_plant_04', { x: CX + 1.9, z: DZ + 0.1, y: 1.11, h: 0.34 }),
        put('standing_picture_frame_01', { x: CX + 3.4, z: ZB + 0.45, y: 0.81, h: 0.5, ry: 0.15 })
    ];
    if (!LOWQ) jobs.push(put('calathea_orbifolia_01', { x: CX - 5.0, z: ZB + 0.9, h: 1.5, shadow: [1.6, 1.6] }), put('potted_plant_02', { x: CX + 5.0, z: ZB + 1.0, h: 1.2, shadow: [1.2, 1.2] }), put('potted_plant_02', { x: X0 + 0.5, z: ZF - 1.0, h: 1.0, shadow: [1.0, 1.0] }));
    // a wool rug under the lounge
    const rugTex = ctex(512, 512, (x, w, h) => { x.fillStyle = '#24293b'; x.fillRect(0, 0, w, h); x.strokeStyle = '#d2a84e'; x.lineWidth = 6; x.strokeRect(26, 26, w - 52, h - 52); x.strokeStyle = '#3a4363'; x.lineWidth = 3; x.strokeRect(46, 46, w - 92, h - 92); for (let i = 0; i < 4000; i++) { x.fillStyle = 'rgba(255,255,255,' + (0.03 + rnd() * 0.05) + ')'; x.fillRect(rnd() * w, rnd() * h, 1.5, 3); } });
    const rg = mesh(new THREE.PlaneGeometry(4.6, 3.8), new THREE.MeshStandardMaterial({ map: rugTex, roughness: 1, envMapIntensity: 0.2 }), CX - 3.1, 0.03, 1.9); rg.rotation.x = -Math.PI / 2;
    // warm pools of light on the floor and wall (soft, additive)
    const poolTex = ctex(128, 128, (x) => { const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,226,160,.8)'); g.addColorStop(1, 'rgba(255,226,160,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); });
    const poolM = new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    [[CX - 3.1, 1.9, 3.4], [CX - 2.9, -1.9, 2.2], [CX + 2.9, -1.9, 2.2]].forEach(p => { const m = mesh(new THREE.PlaneGeometry(p[2], p[2]), poolM, p[0], 0.04, p[1]); m.rotation.x = -Math.PI / 2; m.renderOrder = 2; });

    // a brass sculpture on a stone plinth by the entrance, lit from below
    { const pl = new THREE.Group(); pl.position.set(CX + 4.35, 0, 4.7); root.add(pl);
      bx(0.7, 0.8, 0.7, pbr('marble_01', [0.5, 0.6], { color: 0xc6c2ba, roughness: 0.4 }), 0, 0.4, 0, pl); bx(0.74, 0.03, 0.74, brass, 0, 0.815, 0, pl); bx(0.6, 0.02, 0.6, emissive(0xffd890), 0, 0.02, 0, pl);
      const k = mesh(new THREE.TorusKnotGeometry(0.2, 0.06, 140, 16, 2, 3), new THREE.MeshStandardMaterial({ color: 0xd9ad52, metalness: 1, roughness: 0.2, envMapIntensity: 1.5 }), 0, 1.25, 0, pl); sculpt = k; }
    // a tray, books and a bud vase on the coffee table
    jobs[3].then(t => { if (!t) return; box3.setFromObject(t); const ty = box3.max.y;
        const tr = mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.015, 40), brass, CX - 3.1, ty + 0.008, 1.9);
        [[0x1c3d8f, 0.3, 0.04, 0.2, 0.3], [0xd9d2c3, 0.26, 0.035, 0.18, -0.2], [0x0b7a6e, 0.22, 0.03, 0.16, 0.1]].forEach((b, i) => bx(b[1], b[2], b[3], plain(b[0], { roughness: 0.7 }), CX - 3.28 + i * 0.02, ty + 0.016 + 0.04 * i + b[2] / 2, 1.78, root).rotation.y = b[4]);
        mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.16, 16), plain(0xe9dcc2, { roughness: 0.3 }), CX - 2.95, ty + 0.1, 2.0); });
    await Promise.all(jobs);
    // slides turn on the screen
    let acc = 0, tt = 0;
    const blockers = [   // furniture footprints: x0, x1, z0, z1 (walk-around collisions)
        [CX - 2.7, CX + 2.7, DZ_ - 0.8, DZ_ + 0.95], [CX - 5.3, CX - 3.9, 0.7, 3.1], [CX - 2.4, CX - 1.4, 0.05, 1.05], [CX - 2.4, CX - 1.4, 2.75, 3.75], [CX - 3.75, CX - 2.45, 1.25, 2.55], [CX - 3.6, CX - 2.6, 3.25, 4.15],
        [CX + 3.2, CX + 4.3, -0.85, 0.25], [CX + 3.1, CX + 3.7, 0.65, 1.25], [CX + 2.35, CX + 4.5, ZB, ZB + 1.0], [CX - 5.5, CX - 4.4, ZB, ZB + 1.4], [CX + 4.5, X1, ZB, ZB + 1.5], [X0, X0 + 1.0, ZF - 1.5, ZF], [CX + 3.95, CX + 4.75, 4.3, 5.1]];
    const R = 0.3;
    return {
        group: root, inside, screen,
        wake,
        clamp(x, z) {   // keep a walker (radius R) in the room and out of the furniture; the two doors lead out, a few steps either way
            const inHall = Math.abs(z - DZ1) < DW1 / 2 - 0.2, inFront = Math.abs(x - DX2) < DW2 / 2 - 0.2;
            let xmax = X1 - 0.45, zmax = ZF - 0.4;
            if (inHall && x > X1 - 1) xmax = X1 + 2.6; if (inFront && z > ZF - 1) zmax = ZF + 2.6;
            if (!(inHall && x > X1 - 0.6) && !(inFront && z > ZF - 0.6)) { x = Math.min(x, X1 - 0.45); z = Math.min(z, ZF - 0.4); }
            x = Math.max(X0 + 0.45, Math.min(xmax, x)); z = Math.max(ZB + 0.5, Math.min(zmax, z));
            if (x < X1 - 0.3 && z < ZF - 0.3) for (const b of blockers) { const x0 = b[0] - R, x1 = b[1] + R, z0 = b[2] - R, z1 = b[3] + R; if (x > x0 && x < x1 && z > z0 && z < z1) { const d = [x - x0, x1 - x, z - z0, z1 - z], m = Math.min(...d); if (m === d[0]) x = x0; else if (m === d[1]) x = x1; else if (m === d[2]) z = z0; else z = z1; } }
            return [x, z];
        },
        tick(dt, actors) {   // actors: [{x, z, r}] people or agents near enough to open the doors
            for (const d of doors) { const near = actors && actors.some(a => Math.hypot(a.x - d.x, a.z - d.z) < (a.agent ? d.reachA : d.reachP)); d.open += Math.max(-1, Math.min(1, (near ? 1 : 0) - d.open)) * Math.min(1, dt * 3.2) * (near ? 1.2 : 0.9); d.open = Math.max(0, Math.min(1, d.open));
                for (const L of d.leaves) L.position.x = L.userData.x0 + L.userData.sx * d.w * 0.46 * d.open * d.open * (3 - 2 * d.open); }
            acc += dt; tt += dt; if (acc > 5) { acc = 0; slideI++; drawSlide(slideI); } if (sculpt) sculpt.rotation.y = tt * 0.4; },
        spots: [   // where you can stand: x, z, eye height, yaw (0 faces the back wall), pitch
            { name: 'Entrance', x: CX + 1.6, z: 4.9, y: 1.62, yaw: 0.0, pitch: -0.04 },
            { name: 'Lounge', x: CX - 5.0, z: 3.9, y: 1.45, yaw: -0.95, pitch: -0.02 },
            { name: 'Reception desk', x: CX + 0.9, z: -0.6, y: 1.62, yaw: 0.35, pitch: -0.02 }
        ]
    };
}

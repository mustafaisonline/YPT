// The reception ("Arrival"): a real-material lobby for the How We Work tower. Loaded after the scene is ready; the simple placeholder
// furniture stays until this has loaded. Real models and materials are CC0 from Poly Haven (see assets/hww/CREDITS.md); the desk, the
// feature wall, paintings and the slide screen are built here in code. Nothing shown on the screens is a real figure.
import * as THREE from './vendor/three.module.min.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

export const CX = -12.4, X0 = CX - 5.5, X1 = CX + 5.5, ZB = -6, ZF = 6, CEIL = 3.1;

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
    let logoImg = null; const li = new Image(); li.onload = () => { logoImg = li; drawSlide(slideI); }; li.src = 'assets/images/ypt-logo-320.png';
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

    // ------------------------------------------------------------------ shell: floor, walls, ceiling, glass
    const stone = pbr('marble_01', [3.4, 3.6], { roughness: 0.7, color: 0xa8a8a8, envMapIntensity: 0.45 });
    const floor = mesh(new THREE.PlaneGeometry(X1 - X0, ZF - ZB), stone, CX, 0.012, 0); floor.rotation.x = -Math.PI / 2;
    const plaster = pbr('plastered_wall_04', [3, 1.2], { color: 0xcfcdc7 });
    const walnut = pbr('walnut_veneer', [1, 1], { roughness: 0.9, color: 0xb8a998, envMapIntensity: 0.35 });
    // feature wall behind the desk: warm plaster with a fluted walnut centre and a backlit brand panel
    bx(X1 - X0, CEIL, 0.06, plaster, CX, CEIL / 2, ZB + 0.08);
    const flutes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.07, 3.0, 0.1), walnut, 70);
    { const m = new THREE.Matrix4(); for (let i = 0; i < 70; i++) { m.makeTranslation(CX - 3.6 + i * 0.104, 1.55, ZB + 0.17); flutes.setMatrixAt(i, m); } wallG.add(flutes); }
    bx(7.4, 3.0, 0.04, plain(0x1b1510, { roughness: 0.9 }), CX, 1.55, ZB + 0.13, wallG);                                   // dark backing seen between the flutes
    flutes.renderOrder = 1;
    // the logo panel: brushed metal letters on a softly lit panel
    const logoTex = ctex(1536, 330, (x, w, h) => {
        x.clearRect(0, 0, w, h);
        const gg = x.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, '#fff8e6'); gg.addColorStop(0.5, '#f0d48a'); gg.addColorStop(1, '#d9b04e');
        x.fillStyle = gg; x.font = '700 124px Geist, Helvetica, Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('YOUR PARTNER', w / 2, h * 0.3);
        x.font = '600 96px Geist, Helvetica, Arial'; x.fillText('TECHNOLOGIES', w / 2, h * 0.72);
    });
    bx(5.4, 1.5, 0.05, plain(0x16181f, { roughness: 0.5, metalness: 0.2 }), CX, 2.42, ZB + 0.21, wallG);
    bx(5.4, 0.025, 0.06, brass, CX, 3.17, ZB + 0.22, wallG); bx(5.4, 0.025, 0.06, brass, CX, 1.67, ZB + 0.22, wallG);
    const logo = mesh(new THREE.PlaneGeometry(4.6, 0.99), new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, toneMapped: false }), CX, 2.42, ZB + 0.25, wallG);
    // side walls of the room: a glass partition to the Academy, and the glass side of the building on the left (already in the shell)
    const partGlass = new THREE.MeshPhongMaterial({ color: 0xd7e6ff, transparent: true, opacity: 0.14, shininess: 150, specular: 0xffffff, depthWrite: false });
    const part = mesh(new THREE.PlaneGeometry(ZF - ZB, 3.0), partGlass, X1, 1.55, 0); part.rotation.y = Math.PI / 2;
    for (let k = 0; k <= 2; k++) bx(0.035, 3.1, 0.035, brass, X1, 1.55, ZB + 0.1 + k * (ZF - ZB - 0.2) / 2);
    bx(0.04, 0.035, ZF - ZB, brass, X1, 3.1, 0);
    // skirting
    bx(X1 - X0, 0.12, 0.03, plain(0x2b2f3a, { roughness: 0.5 }), CX, 0.1, ZB + 0.13);
    // ceiling: a dropped panel with recessed downlights and a warm cove around the desk (only seen from inside)
    const ceilTex = ctex(256, 256, (x, w, h) => { const g = x.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.75); g.addColorStop(0, '#f6f1e6'); g.addColorStop(1, '#cfc8b8'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    const ceil = mesh(new THREE.PlaneGeometry(X1 - X0, ZF - ZB), new THREE.MeshBasicMaterial({ map: ceilTex, toneMapped: false }), CX, CEIL, 0, inside); ceil.rotation.x = Math.PI / 2;
    const dl = new THREE.CircleGeometry(0.1, 20), dlm = emissive(0xfff2d4);
    for (let ix = 0; ix < 4; ix++) for (let iz = 0; iz < 4; iz++) { const m = mesh(dl, dlm, X0 + 1.4 + ix * 2.55, CEIL - 0.01, ZB + 1.4 + iz * 3.1, inside); m.rotation.x = Math.PI / 2; }
    bx(7.4, 0.05, 0.12, emissive(0xffe3a8), CX, CEIL - 0.03, ZB + 0.5, inside);
    // glazed entrance, drawn only when you step inside
    const frontM = plain(0x23262f, { metalness: 0.7, roughness: 0.45 });
    const fg = mesh(new THREE.PlaneGeometry(X1 - X0, 3.0), partGlass, CX, 1.55, ZF - 0.02, inside);
    for (let k = 0; k <= 6; k++) bx(0.07, 3.1, 0.07, frontM, X0 + k * (X1 - X0) / 6, 1.55, ZF - 0.02, inside);
    bx(X1 - X0, 0.07, 0.07, frontM, CX, 3.08, ZF - 0.02, inside);
    bx(1.6, 2.6, 0.04, new THREE.MeshPhongMaterial({ color: 0xbcd4ff, transparent: true, opacity: 0.12, depthWrite: false }), CX + 1.4, 1.35, ZF - 0.03, inside);
    bx(0.04, 1.0, 0.04, brass, CX + 0.7, 1.1, ZF - 0.0, inside); bx(0.04, 1.0, 0.04, brass, CX + 2.1, 1.1, ZF - 0.0, inside);   // door pulls

    // ------------------------------------------------------------------ the reception desk (built in code)
    const DZ = -2.7, dW = 5.0;
    const deskBase = new THREE.Group(); deskBase.position.set(CX, 0, DZ); root.add(deskBase);
    bx(dW, 1.02, 0.12, plain(0x1b1510), 0, 0.52, 0.42, deskBase);
    { const n = Math.round(dW / 0.1), fl = new THREE.InstancedMesh(new THREE.BoxGeometry(0.065, 1.0, 0.06), walnut, n), m = new THREE.Matrix4(); for (let i = 0; i < n; i++) { m.makeTranslation(-dW / 2 + 0.05 + i * (dW - 0.1) / (n - 1), 0.52, 0.5); fl.setMatrixAt(i, m); } deskBase.add(fl); }
    bx(dW + 0.1, 0.07, 1.25, pbr('marble_01', [2.4, 0.9], { roughness: 0.4, color: 0xc6c2ba }), 0, 1.07, 0.1, deskBase);          // honed stone top
    bx(dW + 0.12, 0.04, 0.04, brass, 0, 1.0, 0.72, deskBase);                                                           // brass edge
    bx(dW - 0.4, 0.035, 0.04, emissive(0xffd890), 0, 0.12, 0.46, deskBase);                                              // warm kick light
    bx(dW - 0.2, 0.74, 0.5, plain(0x2a211a), 0, 0.37, -0.35, deskBase);                                                 // working surface behind the raised front
    bx(dW - 0.2, 0.04, 0.55, pbr('walnut_veneer', [1.6, 0.3], { roughness: 0.7, color: 0xb8a998 }), 0, 0.76, -0.35, deskBase);
    // monitor, phone and a small plant on the desk
    bx(0.62, 0.38, 0.03, plain(0x0d0f14, { roughness: 0.3 }), -0.9, 1.4, -0.12, deskBase); bx(0.5, 0.26, 0.012, emissive(0x6f93ff), -0.9, 1.4, -0.1, deskBase); bx(0.08, 0.16, 0.08, plain(0x2b2f3a, { metalness: 0.6 }), -0.9, 1.22, -0.12, deskBase);
    bx(0.62, 0.38, 0.03, plain(0x0d0f14, { roughness: 0.3 }), 0.9, 1.4, -0.12, deskBase); bx(0.5, 0.26, 0.012, emissive(0x6f93ff), 0.9, 1.4, -0.1, deskBase); bx(0.08, 0.16, 0.08, plain(0x2b2f3a, { metalness: 0.6 }), 0.9, 1.22, -0.12, deskBase);
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
    // the digital slide wall, left of the desk: a slim screen with a brass edge, showing a slide deck that turns every few seconds
    const screen = new THREE.Group(); screen.position.set(CX - 4.55, 1.75, ZB + 0.17); wallG.add(screen);
    bx(1.9, 1.1, 0.07, plain(0x0c0e13, { roughness: 0.35, metalness: 0.4 }), 0, 0, 0, screen);
    mesh(new THREE.PlaneGeometry(1.8, 1.01), new THREE.MeshBasicMaterial({ map: slideTex, toneMapped: false }), 0, 0, 0.04, screen);
    bx(1.9, 0.02, 0.075, brass, 0, -0.56, 0, screen);

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
        put('mid_century_lounge_chair', { x: CX + 3.7, z: 2.0, ry: -2.3, h: 0.98, shadow: [1.8, 1.8] }),
        put('side_table_tall_01', { x: CX + 2.7, z: 3.4, h: 0.82, shadow: [0.9, 0.9] }),
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

    await Promise.all(jobs);
    // slides turn on the screen
    let acc = 0;
    return {
        group: root, inside, screen,
        tick(dt) { acc += dt; if (acc > 5) { acc = 0; slideI++; drawSlide(slideI); } },
        spots: [   // where you can stand: x, z, eye height, yaw (0 faces the back wall), pitch
            { name: 'Entrance', x: CX + 1.6, z: 4.9, y: 1.62, yaw: 0.0, pitch: -0.04 },
            { name: 'Lounge', x: CX - 5.0, z: 3.9, y: 1.45, yaw: -0.95, pitch: -0.02 },
            { name: 'Reception desk', x: CX + 0.9, z: -0.6, y: 1.62, yaw: 0.35, pitch: -0.02 }
        ]
    };
}

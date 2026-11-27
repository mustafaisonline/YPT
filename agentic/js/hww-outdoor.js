// The exterior of the How We Work tower ("Outdoor"): real-material facade, a working glass lift, the roof, the plaza, lawn and trees.
// Loaded after the scene is up; the simple pastel exterior stays until this has loaded completely (and if it fails). Textures are CC0
// from Poly Haven and ambientCG (see assets/hww/CREDITS.md). Trees, hedges, lamps, benches and planters are built in code from those
// textures, merged into a handful of meshes so the whole exterior costs a few dozen draw calls.
import * as THREE from './vendor/three.module.min.js';
import { mergeGeometries } from './vendor/BufferGeometryUtils.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

export async function buildOutdoor(ctx) {
    const { scene, renderer, world, tower, floors, shells, cab, PLAN, FH, FLOORS, LIFTX, AISLE, LOWQ, A, old } = ctx;
    const base = 'assets/hww/outdoor/tex/';
    const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const TL = new THREE.TextureLoader();
    if (!scene.environment) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose(); }

    // ------------------------------------------------------------------ textures (all loaded before anything is attached)
    const lt = (file, srgb, dir) => TL.loadAsync((dir || base) + file).then(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = aniso; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; });
    // a leaf atlas: decode, then bleed the leaf colour into the transparent texels so mip-mapped edges do not go dark
    const leafTex = file => new Promise((res, rej) => {
        const im = new Image(); im.onerror = rej;
        im.onload = () => {
            const W = im.naturalWidth, H = im.naturalHeight, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
            const d = x.getImageData(0, 0, W, H).data, has = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) has[i] = d[i * 4 + 3] > 40 ? 1 : 0;
            for (let pass = 0; pass < 7; pass++) {
                const add = [];
                for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) { const i = y * W + xx; if (has[i]) continue; let r = 0, g = 0, b = 0, n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = xx + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= W || Y >= H) continue; const j = Y * W + X; if (has[j]) { r += d[j * 4]; g += d[j * 4 + 1]; b += d[j * 4 + 2]; n++; } } if (n) add.push(i, r / n, g / n, b / n); }
                for (let k = 0; k < add.length; k += 4) { const i = add[k]; d[i * 4] = add[k + 1]; d[i * 4 + 1] = add[k + 2]; d[i * 4 + 2] = add[k + 3]; has[i] = 1; }
            }
            const t = new THREE.DataTexture(new Uint8Array(d.buffer.slice(0)), W, H, THREE.RGBAFormat); t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.anisotropy = aniso; t.needsUpdate = true; res(t);
        };
        im.src = base + file;
    });
    const logoP = new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = 'assets/images/ypt-logo-320.png'; });
    const fontsP = (document.fonts && document.fonts.ready) ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]) : Promise.resolve();
    const [steelD, steelN, steelR, concD, concN, concR, paveD, paveN, paveR, pav2D, pav2N, grassD, grassN, bark1D, bark1N, bark2D, bark2N, woodD, woodN, leafI, leafJ, logoImg] = await Promise.all([
        lt('Metal009_diff.jpg', true), lt('Metal009_nor.jpg'), lt('Metal009_rough.jpg'),
        lt('concrete_slab_wall_diff.jpg', true), lt('concrete_slab_wall_nor.jpg'), lt('concrete_slab_wall_rough.jpg'),
        lt('precast_stone_paving_diff.jpg', true), lt('precast_stone_paving_nor.jpg'), lt('precast_stone_paving_rough.jpg'),
        lt('concrete_pavers_diff.jpg', true), lt('concrete_pavers_nor.jpg'),
        lt('leafy_grass_diff.jpg', true), lt('leafy_grass_nor.jpg'),
        lt('bark_brown_02_diff.jpg', true), lt('bark_brown_02_nor.jpg'), lt('bark_brown_01_diff.jpg', true), lt('bark_brown_01_nor.jpg'),
        lt('walnut_veneer_diff.jpg', true, 'assets/hww/tex/'), lt('walnut_veneer_nor.jpg', false, 'assets/hww/tex/'),
        leafTex('island_leaves.png'), leafTex('jacaranda_leaves.png'), logoP, fontsP
    ]);

    // ------------------------------------------------------------------ materials (a registry lets night mode dim the image-based light)
    const reg = [];
    const std = (o, env) => { const m = new THREE.MeshStandardMaterial(o); m.envMapIntensity = env; reg.push({ m, env }); return m; };
    const MAT = {
        steel: std({ map: steelD, normalMap: steelN, roughnessMap: steelR, metalness: 0.7, roughness: 0.8, color: 0xffffff }, 1.6),
        dark: std({ map: steelD, normalMap: steelN, roughnessMap: steelR, metalness: 0.75, roughness: 1, color: 0x6b7482 }, 1.2),
        conc: std({ map: concD, normalMap: concN, roughnessMap: concR, roughness: 1, color: 0xeef0f4 }, 0.5),
        concDark: std({ map: concD, normalMap: concN, roughnessMap: concR, roughness: 1, color: 0x6e737d }, 0.5),
        floor: std({ map: concD, normalMap: concN, roughnessMap: concR, roughness: 0.85, color: 0xc9cdd6 }, 0.6),
        pave: std({ map: paveD, normalMap: paveN, roughnessMap: paveR, roughness: 1, color: 0xd2d8e2 }, 0.45),
        pave2: std({ map: pav2D, normalMap: pav2N, roughness: 0.95, color: 0xdfe3ea }, 0.45),
        wood: std({ map: woodD, normalMap: woodN, roughness: 0.75, color: 0xcfa070 }, 0.5),
        soil: std({ color: 0x3a2e26, roughness: 1 }, 0.2),
        roof: std({ color: 0x4d525b, roughness: 0.95 }, 0.3),
        hedgeCore: std({ color: 0x2c5a2a, roughness: 1 }, 0.3),
        bark1: std({ map: bark1D, normalMap: bark1N, roughness: 1, color: 0xd9d4cc }, 0.4),
        bark2: std({ map: bark2D, normalMap: bark2N, roughness: 1, color: 0xe2d2bc }, 0.4)
    };
    for (const k of ['steel', 'dark']) MAT[k].normalScale.set(0.6, 0.6);
    const GLASS = std({ color: 0xbcd6f4, transparent: true, opacity: 0.2, roughness: 0.05, metalness: 0.1, depthWrite: false, side: THREE.DoubleSide }, 2.2);
    GLASS.userData.glass = true;
    // glass of the lift cab: a little clearer
    const lawnMat = std({ map: grassD, normalMap: grassN, roughness: 1, color: 0xa8d88a }, 0.35); lawnMat.normalScale.set(0.7, 0.7);
    lawnMat.onBeforeCompile = sh => {
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vWP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xz;');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec2 vWP;\nfloat h21(vec2 p){return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);}\nfloat vn(vec2 p){vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);}')
            .replace('#include <map_fragment>', `
            vec4 sA = texture2D(map, vMapUv), sB = texture2D(map, vMapUv * 0.37 + vec2(0.37, 0.11));
            vec4 sampledDiffuseColor = mix(sA, sB, smoothstep(0.3, 0.7, vn(vWP * 0.08)));
            float mow = step(0.5, fract(vWP.x / 5.0 + 0.13 * vn(vWP * 0.05)));
            diffuseColor *= sampledDiffuseColor;
            diffuseColor.rgb *= (0.8 + 0.4 * vn(vWP * 0.22)) * (0.93 + 0.1 * mow);`);
    };

    // ------------------------------------------------------------------ geometry helpers
    function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
    const rnd = mulberry(20240611), rr = (a, b) => a + (b - a) * rnd();
    function bxg(w, h, d, x, y, z, tile, ry) {                       // a box whose texture coordinates are in metres / tile, so texture scale stays true on every size
        const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv, dm = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]], ox = rnd() * 4, oy = rnd() * 4;
        for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dm[f][0] / (tile || 2) + ox, uv.getY(i) * dm[f][1] / (tile || 2) + oy); }
        if (ry) g.rotateY(ry); g.translate(x, y, z); return g;
    }
    const plg = (w, h, x, y, z, ry, rx) => { const g = new THREE.PlaneGeometry(w, h); if (rx) g.rotateX(rx); if (ry) g.rotateY(ry); g.translate(x, y, z); return g; };
    const cyg = (rt, rb, h, x, y, z, seg, rx, rz) => { const g = new THREE.CylinderGeometry(rt, rb, h, seg || 10); if (rx) g.rotateX(rx); if (rz) g.rotateZ(rz); g.translate(x, y, z); return g; };
    const mesh = (list, m) => { if (!list.length) return null; const mg = mergeGeometries(list, false); list.forEach(g => g.dispose()); const o = new THREE.Mesh(mg, m); return o; };
    // flat shape (outer rectangle, optional rectangular hole) lying at height y, texture coordinates in metres / tile
    function flat(x0, z0, x1, z1, hole, y, tile, m) {
        const s = new THREE.Shape(); s.moveTo(x0, -z0); s.lineTo(x1, -z0); s.lineTo(x1, -z1); s.lineTo(x0, -z1); s.closePath();
        if (hole) { const p = new THREE.Path(); p.moveTo(hole[0], -hole[1]); p.lineTo(hole[0], -hole[3]); p.lineTo(hole[2], -hole[3]); p.lineTo(hole[2], -hole[1]); p.closePath(); s.holes.push(p); }
        const g = new THREE.ShapeGeometry(s); g.rotateX(-Math.PI / 2); g.translate(0, y, 0);
        const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / tile, p.getZ(i) / tile);
        const o = new THREE.Mesh(g, m); return o;
    }
    const canvasTex = (w, h, draw, srgb) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; t.userData.c = c; return t; };
    const font = (wt, px) => wt + ' ' + px + 'px Geist, Helvetica, Arial, sans-serif';
    const adds = [];                                                  // [parent, object]: attached together in one step at the end
    const put = (parent, o) => { if (o) adds.push([parent, o]); return o; };
    const night = { on: false };

    // ------------------------------------------------------------------ the facade, floor by floor
    // atlas of window bays: day (sky reflections, some blinds) and night (lit offices)
    const BW = 512, BH = 276;
    const facadeTex = (nightMode) => canvasTex(BW * 2, BH * 2, (x, w, h) => {
        const r = mulberry(nightMode ? 5 : 9);
        for (let v = 0; v < 4; v++) {
            const ox = (v % 2) * BW, oy = Math.floor(v / 2) * BH;
            x.save(); x.beginPath(); x.rect(ox, oy, BW, BH); x.clip();
            x.fillStyle = nightMode ? '#0b1127' : '#39414f'; x.fillRect(ox, oy, BW, BH);
            const gx = ox + 8, gy = oy + 8, gw = BW - 16, gh = BH - 16;
            const g = x.createLinearGradient(0, gy, 0, gy + gh);
            if (nightMode) { g.addColorStop(0, '#0f1a3d'); g.addColorStop(1, '#1b2a57'); } else { g.addColorStop(0, '#6f97c9'); g.addColorStop(0.55, '#a9c6e6'); g.addColorStop(1, '#d6e3ef'); }
            x.fillStyle = g; x.fillRect(gx, gy, gw, gh);
            if (nightMode) {
                if (v !== 3) { const lg = x.createLinearGradient(0, gy, 0, gy + gh); lg.addColorStop(0, 'rgba(255,214,140,' + (v === 0 ? 0.55 : 0.3) + ')'); lg.addColorStop(1, 'rgba(255,190,110,' + (v === 0 ? 0.9 : 0.5) + ')'); x.fillStyle = lg; x.fillRect(gx, gy, gw, gh); }
                for (let k = 0; k < 7; k++) { x.fillStyle = 'rgba(20,24,40,' + (0.35 + r() * 0.3) + ')'; x.fillRect(gx + r() * gw * 0.9, gy + gh * (0.62 + r() * 0.15), 30 + r() * 70, gh * 0.4); }
                if (v === 2) { x.fillStyle = 'rgba(120,170,255,.5)'; x.fillRect(gx + gw * 0.2, gy + gh * 0.5, 60, 38); x.fillRect(gx + gw * 0.62, gy + gh * 0.55, 70, 40); }
            } else {
                x.fillStyle = 'rgba(70,98,138,.35)';                                        // distant skyline reflected in the glass
                for (let k = 0; k < 9; k++) { const bw = 26 + r() * 52, bh = 22 + r() * 90; x.fillRect(gx + r() * gw, gy + gh - bh, bw, bh); }
                x.fillStyle = 'rgba(255,255,255,.2)'; for (let k = 0; k < 3; k++) { const px = gx + (k * 0.38 + r() * 0.2) * gw; x.beginPath(); x.moveTo(px, gy); x.lineTo(px + 60, gy); x.lineTo(px - 90, gy + gh); x.lineTo(px - 150, gy + gh); x.fill(); }
                if (v === 1 || v === 2) { const bh = gh * (v === 1 ? 0.34 : 0.62); x.fillStyle = '#ddd8cc'; x.fillRect(gx, gy, gw, bh); x.fillStyle = 'rgba(0,0,0,.14)'; for (let yy = gy; yy < gy + bh; yy += 7) x.fillRect(gx, yy, gw, 2); x.fillStyle = '#b9b3a4'; x.fillRect(gx, gy + bh - 5, gw, 5); }
            }
            x.fillStyle = nightMode ? '#0b1127' : '#39414f'; x.fillRect(gx + gw / 3 - 2, gy, 4, gh); x.fillRect(gx + gw * 2 / 3 - 2, gy, 4, gh); x.fillRect(gx, gy + gh * 0.3, gw, 4);
            x.restore();
        }
    });
    const facadeDay = facadeTex(false), facadeNight = facadeTex(true);
    const FACADE = std({ map: facadeDay, metalness: 0.45, roughness: 0.2 }, 1.0);

    const hash = (a, b) => { const s = Math.sin(a * 91.7 + b * 12.3) * 43758.5453; return s - Math.floor(s); };
    const GH = FH - 0.36;                                              // clear height between slabs
    const per = [];                                                    // per floor: the new meshes (they belong to that floor's shell so hiding a shell hides them)
    for (let i = 0; i < FLOORS; i++) {
        const P = PLAN[i], g = shells[i], conc = [], dk = [], gl = [], fac = [];
        if (i > 0) conc.push(bxg(P.w, 0.36, P.d, 0, -0.18, 0, 3));
        else conc.push(bxg(P.w - 0.02, 0.5, P.d - 0.02, 0, -0.25, 0, 3));
        // slab edge: a dark steel angle running round the front and sides, a slim cap on the back
        dk.push(bxg(P.w + 0.06, 0.07, 0.06, 0, -0.035, P.d / 2 + 0.03, 1), bxg(0.06, 0.07, P.d + 0.06, -P.w / 2 - 0.03, -0.035, 0, 1), bxg(0.06, 0.07, P.d + 0.06, P.w / 2 + 0.03, -0.035, 0, 1));
        // back wall: ribbon glazing in bays, with real mullions
        const n = Math.max(3, Math.round(P.w / 6)), bw = P.w / n, zb = -P.d / 2 + 0.03;
        for (let k = 0; k < n; k++) {
            const v = Math.floor(hash(i + 1, k + 3) * 4), gq = new THREE.PlaneGeometry(bw, GH), uv = gq.attributes.uv, u0 = (v % 2) * 0.5 + 0.004, v0 = (1 - Math.floor(v / 2)) * 0.5 + 0.004;
            for (let q = 0; q < 4; q++) uv.setXY(q, u0 + uv.getX(q) * 0.492, v0 + uv.getY(q) * 0.492);
            gq.rotateY(Math.PI); gq.translate(-P.w / 2 + bw * (k + 0.5), GH / 2, zb); fac.push(gq);
            dk.push(bxg(0.12, GH, 0.16, -P.w / 2 + bw * k, GH / 2, zb - 0.02, 1));
        }
        dk.push(bxg(0.12, GH, 0.16, P.w / 2, GH / 2, zb - 0.02, 1), bxg(P.w, 0.1, 0.16, 0, GH - 0.05, zb - 0.02, 1), bxg(P.w, 0.1, 0.16, 0, 0.05, zb - 0.02, 1));
        // side walls: glass between slender steel mullions
        [-1, 1].forEach(s => {
            gl.push(plg(P.d, GH, s * P.w / 2, GH / 2, 0, Math.PI / 2));
            const m = Math.max(3, Math.round(P.d / 3));
            for (let k = 0; k <= m; k++) { const z = -P.d / 2 + k * P.d / m; dk.push(bxg(0.1, GH, 0.1, s * P.w / 2, GH / 2, z, 1)); }
            dk.push(bxg(0.1, 0.08, P.d, s * P.w / 2, GH - 0.04, 0, 1), bxg(0.1, 0.07, P.d, s * P.w / 2, 0.035, 0, 1), bxg(0.07, 0.06, P.d, s * P.w / 2, GH * 0.62, 0, 1));
        });
        // front: four steel columns (corners and the two third points), no wall, so the cutaway still reads
        [-P.w / 2 + 0.12, P.w / 2 - 0.12].forEach(x => dk.push(bxg(0.2, GH, 0.2, x, GH / 2, P.d / 2 - 0.12, 1.2)));
        // the lift bridge to the shaft
        const gap = LIFTX - P.w / 2;
        if (gap > 0.1) {
            const bl = gap + 0.4, bx0 = P.w / 2 + gap / 2;
            conc.push(bxg(bl, 0.3, 2.8, bx0, -0.15, AISLE, 3));
            dk.push(bxg(bl, 0.05, 0.08, bx0, 1.08, AISLE - 1.4, 1), bxg(bl, 0.05, 0.08, bx0, 1.08, AISLE + 1.4, 1));
            [AISLE - 1.4, AISLE + 1.4].forEach(z => { gl.push(plg(bl - 0.2, 1.0, bx0, 0.58, z, 0)); const m = Math.max(2, Math.round(bl / 2)); for (let k = 0; k <= m; k++) dk.push(bxg(0.06, 1.1, 0.06, bx0 - bl / 2 + 0.1 + k * (bl - 0.2) / m, 0.55, z, 1)); });
            if (i < FLOORS) [AISLE - 1.2, AISLE + 1.2].forEach(z => dk.push(bxg(0.12, 2.6, 0.12, P.w / 2, 1.3, z, 1)));
            dk.push(bxg(0.12, 0.1, 2.52, P.w / 2, 2.62, AISLE, 1));
        }
        const grp = new THREE.Group(); grp.name = 'facade' + i;
        [[conc, MAT.conc], [dk, MAT.dark], [fac, FACADE], [gl, GLASS]].forEach(([l, m]) => { const o = mesh(l, m); if (o) grp.add(o); });
        per.push(grp); put(g, grp);
    }

    // ------------------------------------------------------------------ the lift: steel frame, glass shaft, rails, counterweight, cab, sliding doors
    const TOP = FLOORS * FH, liftG = new THREE.Group(); liftG.name = 'lift'; put(tower, liftG);
    const stat = [], conL = [];
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(c => { stat.push(bxg(0.2, TOP + 0.5, 0.2, LIFTX + c[0] * 1.4, TOP / 2 + 0.1, AISLE + c[1] * 1.4, 1)); stat.push(bxg(0.5, 0.06, 0.5, LIFTX + c[0] * 1.4, 0.03 + 0.08, AISLE + c[1] * 1.4, 1)); });
    for (let k = 0; k <= FLOORS; k++) {                              // floor-level ring beams and landing frames
        const y = k * FH - 0.15;
        stat.push(bxg(2.8, 0.3, 0.12, LIFTX, y, AISLE - 1.4, 1.4), bxg(2.8, 0.3, 0.12, LIFTX, y, AISLE + 1.4, 1.4), bxg(0.12, 0.3, 2.8, LIFTX + 1.4, y, AISLE, 1.4), bxg(0.12, 0.3, 2.8, LIFTX - 1.4, y, AISLE, 1.4));
    }
    for (let k = 0; k < FLOORS; k++) {                               // door surround at each landing (on the side facing the building)
        const y = k * FH, xd = LIFTX - 1.4 - 0.06;
        stat.push(bxg(0.1, 2.4, 0.14, xd, y + 1.2 + 0.08, AISLE - 0.74, 1), bxg(0.1, 2.4, 0.14, xd, y + 1.2 + 0.08, AISLE + 0.74, 1), bxg(0.12, 0.3, 1.62, xd, y + 2.5, AISLE, 1));
        stat.push(bxg(0.06, 2.3, 0.46, xd, y + 1.15 + 0.08, AISLE - 1.02, 1.2), bxg(0.06, 2.3, 0.46, xd, y + 1.15 + 0.08, AISLE + 1.02, 1.2));   // fixed side panels (the leaves slide behind them)
    }
    [-1.22, 1.22].forEach(dz => stat.push(bxg(0.14, TOP, 0.05, LIFTX + 0.1, TOP / 2, AISLE + dz, 1), bxg(0.05, TOP, 0.12, LIFTX + 0.1, TOP / 2, AISLE + dz * 0.97, 1)));   // cab guide rails
    stat.push(bxg(0.06, TOP, 0.06, LIFTX + 1.2, TOP / 2, AISLE - 0.55, 1), bxg(0.06, TOP, 0.06, LIFTX + 1.2, TOP / 2, AISLE + 0.55, 1));   // counterweight rails
    conL.push(bxg(3.4, 0.3, 3.4, LIFTX, TOP + 0.15, AISLE, 3));
    stat.push(bxg(2.2, 1.1, 2.4, LIFTX, TOP + 0.85, AISLE, 1.5), bxg(2.4, 0.1, 2.6, LIFTX, TOP + 1.45, AISLE, 1.5));   // machine room, clad in steel
    put(liftG, mesh(stat, MAT.steel)); put(liftG, mesh(conL, MAT.conc));
    { const m = mesh([plg(2.7, TOP, LIFTX, TOP / 2, AISLE - 1.4, 0), plg(2.7, TOP, LIFTX, TOP / 2, AISLE + 1.4, 0), plg(2.7, TOP, LIFTX - 1.4, TOP / 2, AISLE, Math.PI / 2), plg(2.7, TOP, LIFTX + 1.4, TOP / 2, AISLE, Math.PI / 2)], GLASS); put(liftG, m); }
    // landing door leaves: 8 floors x 2 leaves, one instanced mesh
    const leafG = new THREE.BoxGeometry(0.05, 2.25, 0.68), landing = new THREE.InstancedMesh(leafG, MAT.steel, FLOORS * 2); landing.frustumCulled = false; put(liftG, landing);
    const landOpen = new Array(FLOORS).fill(0), dm = new THREE.Matrix4();
    function setLanding(f) { const o = landOpen[f], y = f * FH + 1.2, xd = LIFTX - 1.4; for (let s = 0; s < 2; s++) { dm.makeTranslation(xd, y, AISLE + (s ? 1 : -1) * (0.335 + o * 0.55)); landing.setMatrixAt(f * 2 + s, dm); } landing.instanceMatrix.needsUpdate = true; }
    for (let f = 0; f < FLOORS; f++) setLanding(f);
    // call buttons beside each landing door
    { const bl = []; for (let k = 0; k < FLOORS; k++) bl.push(plg(0.1, 0.22, LIFTX - 1.4 - 0.1, k * FH + 1.2, AISLE + 1.38, -Math.PI / 2)); const bm = mesh(bl, new THREE.MeshBasicMaterial({ color: 0xffa23a, toneMapped: false, side: THREE.DoubleSide })); put(liftG, bm); }
    // cables and counterweight
    const cable = []; for (let c = 0; c < 2; c++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1, 6), MAT.dark); put(liftG, m); cable.push(m); }
    const cwt = new THREE.Group(); cwt.add(new THREE.Mesh(mergeGeometries([bxg(0.14, 1.7, 0.8, 0, 0, 0, 1), bxg(0.18, 0.1, 0.84, 0, 0.9, 0, 1), bxg(0.18, 0.1, 0.84, 0, -0.9, 0, 1)]), MAT.dark)); put(liftG, cwt);
    // the cab (the existing `cab` group: its old pieces are hidden, the new ones added to it)
    const cabParts = new THREE.Group(); cabParts.name = 'cab-new'; put(cab, cabParts);
    const cs = [], cd = [];
    cs.push(bxg(2.1, 0.12, 2.1, 0, 2.64, 0, 1.2), bxg(0.1, 2.56, 2.0, 1.0, 1.32, 0, 1.2), bxg(2.0, 2.56, 0.1, 0, 1.32, -1.0, 1.2), bxg(0.1, 0.1, 2.1, -1.0, 2.52, 0, 1.2));   // ceiling, back wall, side wall, door header
    cs.push(bxg(0.1, 2.56, 0.4, -1.0, 1.32, -0.8, 1.2), bxg(0.1, 2.56, 0.4, -1.0, 1.32, 0.8, 1.2), bxg(2.0, 0.3, 0.06, 0, 0.17, 1.0, 1.2));
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(c => cs.push(bxg(0.08, 2.64, 0.08, c[0] * 1.03, 1.32, c[1] * 1.03, 1)));
    cs.push(bxg(2.1, 0.16, 0.3, 0, 2.78, 0, 1.2), bxg(0.3, 0.1, 2.1, 0, 2.72, 0, 1.2));       // crosshead and guide shoes sit on top
    // handrails inside, along the back and the side wall
    cs.push(cyg(0.025, 0.025, 1.7, 0.9, 0.95, 0, 10, Math.PI / 2), cyg(0.025, 0.025, 1.7, 0, 0.95, -0.9, 10, 0, Math.PI / 2));
    [-0.7, 0, 0.7].forEach(t => cs.push(bxg(0.1, 0.04, 0.04, 0.95, 0.95, t, 1), bxg(0.04, 0.04, 0.1, t, 0.95, -0.95, 1)));
    cd.push(bxg(2.05, 0.08, 2.05, 0, 0.06, 0, 2));
    const cabSteel = mesh(cs, MAT.steel), cabFloor = mesh(cd, MAT.concDark); cabParts.add(cabSteel, cabFloor);
    cabParts.add(new THREE.Mesh(plg(2.0, 2.4, 0, 1.3, 1.0, 0), GLASS));                         // the camera side is glass
    const cl = new THREE.Mesh(plg(1.5, 1.5, 0, 2.575, 0, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xfff1d0, toneMapped: false })); cabParts.add(cl);
    // landing-style indicator above the cab door (inside) and a button panel
    const dispC = document.createElement('canvas'); dispC.width = 128; dispC.height = 64; const dispT = new THREE.CanvasTexture(dispC); dispT.colorSpace = THREE.SRGBColorSpace;
    let shownF = -1; const LBL = ['G', '1', '2', '3', '4', '5', '6', '7'];
    function drawDisp(f, dir) { const x = dispC.getContext('2d'); x.fillStyle = '#05080f'; x.fillRect(0, 0, 128, 64); x.fillStyle = '#ffb347'; x.font = font(700, 44); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(LBL[f] || '', 64, 34); if (dir) { x.beginPath(); if (dir > 0) { x.moveTo(104, 20); x.lineTo(114, 34); x.lineTo(94, 34); } else { x.moveTo(104, 48); x.lineTo(114, 34); x.lineTo(94, 34); } x.fill(); } dispT.needsUpdate = true; }
    drawDisp(0, 0); { const dp = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.23), new THREE.MeshBasicMaterial({ map: dispT, toneMapped: false })); dp.rotation.y = Math.PI / 2; dp.position.set(-0.94, 2.33, 0); cabParts.add(dp); }
    { const pc = canvasTex(64, 192, (x, w, h) => { x.fillStyle = '#9aa3ad'; x.fillRect(0, 0, w, h); for (let k = 0; k < 8; k++) { const cy = 22 + k * 21, cx = k % 2 ? 44 : 20; x.fillStyle = '#20252c'; x.beginPath(); x.arc(cx, cy, 9, 0, 7); x.fill(); x.fillStyle = k === 0 ? '#ffb347' : '#dfe6ee'; x.font = font(700, 11); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(LBL[k], cx, cy); } });
        const pp = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.72), new THREE.MeshStandardMaterial({ map: pc, metalness: 0.6, roughness: 0.4, envMapIntensity: 0.6 })); pp.position.set(-0.5, 1.15, -0.945); cabParts.add(pp); }
    // cab doors
    const dl = [new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.15, 0.66), MAT.steel), new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.15, 0.66), MAT.steel)]; dl.forEach(m => { m.position.set(-1.09, 1.18, 0); cabParts.add(m); });
    let cabOpen = 0, cabPrevY = null;

    // ------------------------------------------------------------------ the roof and the sign
    const top = PLAN[FLOORS - 1], ry = FLOORS * FH;
    { const g = new THREE.Group(); g.name = 'roof'; put(tower, g);
        const c = [bxg(top.w + 0.4, 0.4, top.d + 0.4, 0, ry - 0.2, 0, 3)], d = [], hv = [];
        const pw = 0.25, ph = 0.75, W = top.w + 0.4, D = top.d + 0.4;                      // parapet with a steel coping
        c.push(bxg(W, ph, pw, 0, ry + ph / 2, D / 2 - pw / 2, 2.5), bxg(W, ph, pw, 0, ry + ph / 2, -D / 2 + pw / 2, 2.5), bxg(pw, ph, D - 2 * pw, -W / 2 + pw / 2, ry + ph / 2, 0, 2.5), bxg(pw, ph, D - 2 * pw, W / 2 - pw / 2, ry + ph / 2, 0, 2.5));
        d.push(bxg(W + 0.08, 0.05, pw + 0.1, 0, ry + ph + 0.025, D / 2 - pw / 2, 1), bxg(W + 0.08, 0.05, pw + 0.1, 0, ry + ph + 0.025, -D / 2 + pw / 2, 1), bxg(pw + 0.1, 0.05, D, -W / 2 + pw / 2, ry + ph + 0.025, 0, 1), bxg(pw + 0.1, 0.05, D, W / 2 - pw / 2, ry + ph + 0.025, 0, 1));
        const rm = new THREE.Mesh(new THREE.BoxGeometry(W - 2 * pw, 0.06, D - 2 * pw), MAT.roof); rm.position.set(0, ry + 0.03, 0); g.add(rm);
        [-6.5, 6.5].forEach(x => { hv.push(bxg(3.2, 1.3, 1.6, x, ry + 0.65, -2.6, 1.5)); d.push(cyg(0.55, 0.55, 0.08, x - 0.8, ry + 1.34, -2.6, 20), cyg(0.55, 0.55, 0.08, x + 0.8, ry + 1.34, -2.6, 20)); });
        c.push(bxg(2.6, 2.7, 2.4, 0, ry + 1.35, -2.4, 3));                                  // stair bulkhead
        put(g, mesh(c, MAT.conc)); put(g, mesh(d, MAT.dark)); put(g, mesh(hv, MAT.steel));
        // the sign: backlit panel in a steel frame on legs, with a braced steel back
        const sy = ry + 1.55, sd = [bxg(14.5, 0.14, 0.34, 0, sy + 1.0, 0.0, 1), bxg(14.5, 0.14, 0.34, 0, sy - 1.0, 0.0, 1), bxg(0.14, 2.14, 0.34, -7.18, sy, 0, 1), bxg(0.14, 2.14, 0.34, 7.18, sy, 0, 1), bxg(14.3, 2.0, 0.3, 0, sy, 0, 1)];
        [-5.5, 0, 5.5].forEach(x => { sd.push(bxg(0.18, 0.7, 0.18, x, ry + 0.35 + 0.0, 0.0, 1)); });
        [-4, 4].forEach(x => { const s = cyg(0.04, 0.04, 1.9, x, ry + 0.8, -0.8, 8, 0.45); sd.push(s); });
        put(g, mesh(sd, MAT.steel));
        const st = canvasTex(2048, 256, (x, w, h) => { const gg = x.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, '#162040'); gg.addColorStop(1, '#0c1226'); x.fillStyle = gg; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.font = font(700, 124); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('YOUR PARTNER TECHNOLOGIES', w / 2, h / 2 - 4); x.fillStyle = '#f28a1e'; x.fillRect(0, h - 18, w, 18); });
        const sp = new THREE.Mesh(new THREE.PlaneGeometry(14.3, 14.3 * 256 / 2048), new THREE.MeshBasicMaterial({ map: st, toneMapped: false })); sp.position.set(0, sy, 0.19); g.add(sp);
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 4.2, 8), MAT.steel); mast.position.set(0, ry + 2.1 + 1.0, -2.9); g.add(mast);
        const beac = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), new THREE.MeshBasicMaterial({ color: 0xff4a4a, toneMapped: false })); beac.position.set(0, ry + 5.45, -2.9); g.add(beac); per.beacon = beac;
    }

    // ------------------------------------------------------------------ ground: plinth, lawn, paving, kerbs, planting
    const gnd = new THREE.Group(); gnd.name = 'outdoor'; put(world, gnd);
    const kerbs = [], pl = [];
    pl.push(bxg(84, 1.2, 46, 0, -0.7, 6, 4));                                                 // concrete plinth the whole site stands on
    const plinth = mesh(pl, MAT.conc); gnd.add(plinth);
    { const o = flat(-42, -17, 42, 29, [-40, -15, 40, 27], -0.098, 3, MAT.pave2); gnd.add(o); }  // perimeter walkway
    const lawn = flat(-40, -15, 40, 27, [-19, -6, 19, 6], 0.07, 5, lawnMat); gnd.add(lawn);
    gnd.add(flat(-24, -9.5, 27.5, 9, [-19, -6, 19, 6], 0.08, 3.2, MAT.pave));                 // the apron round the tower
    gnd.add(flat(-14, 9, 14, 19.5, null, 0.08, 3.2, MAT.pave));                                // the plaza
    gnd.add(flat(-2.5, 19.5, 2.5, 27, null, 0.08, 2.4, MAT.pave2));                             // the path to the street
    { const f = new THREE.Mesh(new THREE.BoxGeometry(38, 0.4, 12), MAT.floor); f.position.set(0, 0.075 - 0.2, 0); gnd.add(f); // ground-floor slab inside the tower
        const uv = f.geometry.attributes.uv; for (let q = 0; q < uv.count; q++) uv.setXY(q, uv.getX(q) * 6, uv.getY(q) * 2); }
    // kerbs: along the lawn boundary, and edging where paving meets grass
    const kb = (x0, z0, x1, z1, h, t, y0) => kerbs.push(bxg(Math.abs(x1 - x0) || t, h, Math.abs(z1 - z0) || t, (x0 + x1) / 2, (y0 == null ? -0.1 : y0) + h / 2, (z0 + z1) / 2, 2));
    kb(-40.3, -15.3, 40.3, -15, 0.26, 0.3); kb(-40.3, 27, 40.3, 27.3, 0.26, 0.3); kb(-40.3, -15, -40, 27, 0.26, 0.3); kb(40, -15, 40.3, 27, 0.26, 0.3);
    const ed = (x0, z0, x1, z1) => kerbs.push(bxg(Math.abs(x1 - x0) || 0.14, 0.1, Math.abs(z1 - z0) || 0.14, (x0 + x1) / 2, 0.05, (z0 + z1) / 2, 2));
    ed(-24, -9.6, 27.6, -9.5); ed(-24.1, -9.5, -24, 9); ed(27.5, -9.5, 27.6, 9); ed(-24, 9, -14, 9.1); ed(14, 9, 27.5, 9.1);
    ed(-14.1, 9, -14, 19.6); ed(14, 9, 14.1, 19.6); ed(-14, 19.5, -2.5, 19.6); ed(2.5, 19.5, 14, 19.6); ed(-2.6, 19.6, -2.5, 27); ed(2.5, 19.6, 2.6, 27);
    gnd.add(mesh(kerbs, MAT.conc));

    // ---------- foliage: leaf cards stamped from a real leaf atlas
    const ISL = [[15, 20, 150, 415], [168, 22, 345, 402], [368, 35, 495, 370], [530, 50, 665, 370], [710, 20, 838, 425], [15, 640, 190, 985], [222, 592, 365, 1010], [430, 615, 578, 1010]].map(r => r.map(v => v / 1024));
    const JAC = [[165, 25, 1010, 480], [0, 335, 440, 710], [250, 605, 1024, 1010]].map(r => r.map(v => v / 1024));
    const LP = { isl: { P: [], N: [], U: [], C: [], I: [] }, jac: { P: [], N: [], U: [], C: [], I: [] } };
    const wood1 = [], wood2 = [];
    const V = (x, y, z) => new THREE.Vector3(x, y, z), UP = V(0, 1, 0);
    function card(L, set, rects, cx, cy, cz, nx, ny, nz, len, col, flat) {
        const rc = rects[Math.floor(rnd() * rects.length)], ra = (rc[2] - rc[0]) / (rc[3] - rc[1]);
        const n = V(nx, ny, nz).normalize();
        let a = V(rr(-1, 1), flat ? rr(-0.6, 0.1) : rr(-0.6, 1), rr(-1, 1));                // long axis of the leaf (sticks out and a little up)
        if (flat) { a.x = cx - flat.x; a.z = cz - flat.z; a.y = rr(-0.5, 0.1); }
        a.sub(n.clone().multiplyScalar(a.dot(n))).normalize(); if (!isFinite(a.x)) a.set(1, 0, 0);
        const b = new THREE.Vector3().crossVectors(a, n).normalize();
        const W = set === 'jac' ? len * (rc[3] - rc[1]) / (rc[2] - rc[0]) : len * ra, Ll = len;
        const S = LP[set], base = S.P.length / 3;
        for (const [sa, sb] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
            S.P.push(cx + a.x * sa * Ll / 2 + b.x * sb * W / 2, cy + a.y * sa * Ll / 2 + b.y * sb * W / 2, cz + a.z * sa * Ll / 2 + b.z * sb * W / 2); S.N.push(n.x, n.y, n.z); S.C.push(col[0], col[1], col[2]);
            if (set === 'isl') S.U.push(rc[0] + (rc[2] - rc[0]) * (sb + 1) / 2, rc[1] + (rc[3] - rc[1]) * (1 - sa) / 2); else S.U.push(rc[0] + (rc[2] - rc[0]) * (sa + 1) / 2, rc[1] + (rc[3] - rc[1]) * (sb + 1) / 2);
        }
        S.I.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
    // a blob of foliage: n cards on a (hollowed) ellipsoid shell
    function blob(set, cx, cy, cz, rx, ry, rz, n, len, tint, o) {
        o = o || {};
        for (let i = 0; i < n; i++) {
            let dx = rnd() * 2 - 1, dy = rnd() * 2 - 1, dz = rnd() * 2 - 1; const m = Math.hypot(dx, dy, dz) || 1; dx /= m; dy /= m; dz /= m;
            const sh = (o.hollow == null ? 0.55 : o.hollow) + (1 - (o.hollow == null ? 0.55 : o.hollow)) * Math.sqrt(rnd());
            if (o.minY != null && dy < o.minY) dy = -dy * 0.5;
            const px = cx + dx * rx * sh, py = cy + dy * ry * sh, pz = cz + dz * rz * sh;
            const shade = 0.55 + 0.45 * sh, top = 0.88 + 0.16 * dy, k = rr(0.85, 1.12) * shade * top;
            const col = [Math.min(1.3, tint[0] * k * rr(0.92, 1.08)), Math.min(1.3, tint[1] * k), Math.min(1.3, tint[2] * k * rr(0.9, 1.08))];
            card(null, set, set === 'isl' ? ISL : JAC, px, py, pz, o.flat ? dx * 0.3 : dx * 0.8, o.flat ? 1 : dy * 0.8 + 0.35, o.flat ? dz * 0.3 : dz * 0.8, len * rr(0.75, 1.25), col, o.flat ? { x: cx, z: cz } : null);
        }
    }
    function tube(pts, r0, r1, rad, list, flare) {
        const curve = new THREE.CatmullRomCurve3(pts), seg = Math.max(3, pts.length * 2), fr = curve.computeFrenetFrames(seg, false), len = curve.getLength(), P = [], N = [], U = [], I = [], ut = Math.max(1, Math.round(2 * Math.PI * r0 / 1.2));
        for (let i = 0; i <= seg; i++) {
            const t = i / seg, c = curve.getPointAt(t); let r = r0 + (r1 - r0) * t; if (flare && t < 0.14) r *= 1 + 0.5 * Math.pow(1 - t / 0.14, 2);
            for (let j = 0; j <= rad; j++) { const a = j / rad * Math.PI * 2, nx = fr.normals[i].x * Math.cos(a) + fr.binormals[i].x * Math.sin(a), ny = fr.normals[i].y * Math.cos(a) + fr.binormals[i].y * Math.sin(a), nz = fr.normals[i].z * Math.cos(a) + fr.binormals[i].z * Math.sin(a); P.push(c.x + nx * r, c.y + ny * r, c.z + nz * r); N.push(nx, ny, nz); U.push(j / rad * ut, t * len / 1.6); }
        }
        for (let i = 0; i < seg; i++) for (let j = 0; j < rad; j++) { const a = i * (rad + 1) + j, b = a + rad + 1; I.push(a, b, a + 1, b, b + 1, a + 1); }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2)); g.setIndex(I); list.push(g);
        return curve;
    }
    const TRUNK = { broad: 0, feather: 1, column: 2 };
    function tree(kind, x, z, s, yaw) {
        const cs = Math.cos(yaw || 0), sn = Math.sin(yaw || 0), at = (p) => V(x + p.x * cs - p.z * sn, p.y, z + p.x * sn + p.z * cs), W = kind === 'feather' ? wood2 : wood1;
        const th = (kind === 'broad' ? 2.5 : kind === 'feather' ? 2.0 : 1.8) * s, lean = V(rr(-0.15, 0.15) * s, 0, rr(-0.15, 0.15) * s);
        tube([at(V(0, -0.05, 0)), at(V(lean.x * 0.5, th * 0.5, lean.z * 0.5)), at(V(lean.x, th, lean.z))], 0.26 * s, 0.17 * s, 8, W, true);
        const limbs = kind === 'column' ? 7 : kind === 'feather' ? 3 : 5, tips = [], tw = [];
        for (let k = 0; k < limbs; k++) {
            const a = k / limbs * Math.PI * 2 + rr(-0.35, 0.35), el = kind === 'column' ? rr(0.12, 0.3) : kind === 'feather' ? rr(0.45, 0.65) : rr(0.55, 0.85);
            const dir = V(Math.cos(a) * el, 1 - el * 0.6, Math.sin(a) * el).normalize(), len = (kind === 'column' ? rr(2.6, 3.4) : kind === 'feather' ? rr(3.0, 3.8) : rr(2.6, 3.4)) * s, st = V(lean.x, th * 0.92, lean.z);
            const p1 = st.clone().addScaledVector(dir, len * 0.4).add(V(rr(-0.2, 0.2), 0, rr(-0.2, 0.2))), p2 = st.clone().addScaledVector(dir, len * 0.75).add(V(0, kind === 'feather' ? -0.1 : 0.25, 0)), p3 = st.clone().addScaledVector(dir, len);
            const cv = tube([at(st), at(p1), at(p2), at(p3)], 0.12 * s, 0.045 * s, 6, W); tips.push(at(p3));
            for (let q = 0; q < (kind === 'column' ? 1 : 2); q++) {
                const t0 = rr(0.45, 0.8), b0 = cv.getPointAt(t0), a2 = a + (q ? 1 : -1) * rr(0.6, 1.1), d2 = V(Math.cos(a2) * 0.8 + dir.x * 0.5, rr(0.2, 0.7), Math.sin(a2) * 0.8 + dir.z * 0.5).normalize(), l2 = (kind === 'column' ? 1.6 : 1.5) * s * rr(0.8, 1.2);
                const e0 = b0.clone(), e1 = e0.clone().addScaledVector(d2, l2 * 0.5), e2 = e0.clone().addScaledVector(d2, l2);
                tube([e0, e1.add(V(0, 0.12, 0)), e2], 0.05 * s, 0.02 * s, 5, W); tw.push(e2);
            }
        }
        const set = kind === 'feather' ? 'jac' : 'isl', tint = kind === 'column' ? [0.95, 1.12, 0.62] : kind === 'feather' ? [0.95, 1.12, 0.9] : [rr(0.9, 1.0), rr(1.05, 1.15), rr(0.6, 0.72)], q = LOWQ ? 0.6 : 1;
        if (kind === 'feather') { tips.forEach(p => blob('jac', p.x, p.y - 0.2 * s, p.z, 2.3 * s, 0.9 * s, 2.3 * s, Math.round(26 * q), 2.1 * s, tint, { hollow: 0.3, flat: true })); tw.forEach(p => blob('jac', p.x, p.y, p.z, 1.5 * s, 0.7 * s, 1.5 * s, Math.round(14 * q), 1.7 * s, tint, { hollow: 0.3, flat: true })); }
        else if (kind === 'column') { tips.forEach(p => blob('isl', p.x, p.y, p.z, 1.15 * s, 1.5 * s, 1.15 * s, Math.round(150 * q), 0.55 * s, tint)); tw.forEach(p => blob('isl', p.x, p.y, p.z, 0.8 * s, 0.9 * s, 0.8 * s, Math.round(55 * q), 0.5 * s, tint)); blob('isl', x + lean.x, th + 2.7 * s, z + lean.z, 1.1 * s, 2.0 * s, 1.1 * s, Math.round(150 * q), 0.55 * s, tint); }
        else { tips.forEach(p => blob('isl', p.x, p.y, p.z, 1.9 * s, 1.3 * s, 1.9 * s, Math.round(190 * q), 0.62 * s, tint)); tw.forEach(p => blob('isl', p.x, p.y, p.z, 1.15 * s, 0.9 * s, 1.15 * s, Math.round(70 * q), 0.55 * s, tint)); blob('isl', x + lean.x, th + 2.6 * s, z + lean.z, 2.1 * s, 1.3 * s, 2.1 * s, Math.round(150 * q), 0.62 * s, tint); }
    }
    const solids = [], shadows = [];
    const shadowPlane = (x, z, w, d, y) => shadows.push(plg(w, d, x, (y || 0.088), z, 0, -Math.PI / 2));
    // trees: tall ones stay on the flanks and behind; the front of the site is kept low so the camera can look into the ground floor
    const TREES = [
        ['broad', -36, 22, 1.0], ['feather', -30, 24, 0.95], ['column', -25, 23, 0.9], ['broad', 28, 23, 1.0], ['feather', 35, 22, 1.05], ['column', 21, 25, 0.9],
        ['broad', -36, 6, 1.1], ['feather', -33, -4, 1.0], ['column', -36, -10, 1.0], ['broad', 35, 7, 1.1], ['feather', 33, -5, 1.0], ['column', 36, -11, 1.0],
        ['broad', -28, -12, 1.1], ['feather', -18, -12.5, 1.0], ['broad', -7, -12, 1.15], ['column', 5, -12.5, 1.0], ['feather', 15, -12, 1.05], ['broad', 26, -12, 1.1]
    ];
    TREES.forEach((t, i) => { if (LOWQ && i % 2) return; tree(t[0], t[1], t[2], t[3], rr(0, 6.28)); shadowPlane(t[1], t[2], 7.5 * t[3], 7.5 * t[3]); });
    // low planting: hedges along the plaza, shrub beds in planters
    function hedge(x0, z0, x1, z1, h, w, cardsPerM) {
        const L = Math.hypot(x1 - x0, z1 - z0), ang = Math.atan2(z1 - z0, x1 - x0), n = Math.round(L * cardsPerM * (LOWQ ? 0.55 : 1)), tint = [0.78, 0.98, 0.5];
        solids.push(bxg(L - 0.1, h * 0.86, w * 0.8, 0, h * 0.43, 0, 1).applyMatrix4(new THREE.Matrix4().makeRotationY(-ang)).applyMatrix4(new THREE.Matrix4().makeTranslation((x0 + x1) / 2, 0.08, (z0 + z1) / 2)));
        const ca = Math.cos(ang), sa = Math.sin(ang), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
        for (let i = 0; i < n; i++) {
            const u = rnd() * L - L / 2, r = rnd(); let lx = u, ly, lz, nx = 0, ny = 0, nz = 0;
            if (r < 0.34) { ly = h; lz = (rnd() - 0.5) * w; ny = 1; } else { const sd = rnd() < 0.5 ? -1 : 1; ly = rnd() * h; lz = sd * w / 2; nz = sd; ny = 0.25; }
            const wx = cx + lx * ca - lz * sa, wz = cz + lx * sa + lz * ca, nwx = nx * ca - nz * sa, nwz = nx * sa + nz * ca;
            const k = rr(0.85, 1.15) * (0.7 + 0.3 * ly / h);
            card(null, 'isl', ISL, wx, 0.08 + ly, wz, nwx, ny + 0.2, nwz, rr(0.28, 0.4), [tint[0] * k, tint[1] * k, tint[2] * k], null);
        }
        shadowPlane(cx, cz, L + 1, w + 1.2, 0.087);
    }
    hedge(-12.5, 20.1, -4.2, 20.1, 0.85, 0.7, 70); hedge(4.2, 20.1, 12.5, 20.1, 0.85, 0.7, 70);
    hedge(-21.9, 22.1, -20.5, 22.1, 0.8, 1.2, 60); hedge(-7.5, 22.1, -6.1, 22.1, 0.8, 1.2, 60);
    // planters
    const planters = []; const planter = (x, z, len) => { planters.push(bxg(len, 0.7, 0.9, x, 0.08 + 0.35, z, 1.5)); solids.push(bxg(len - 0.16, 0.06, 0.74, x, 0.08 + 0.7, z, 1)); blob('isl', x, 0.08 + 1.0, z, len * 0.46, 0.38, 0.42, Math.round(len * 55 * (LOWQ ? 0.5 : 1)), 0.32, [0.8, 1.0, 0.55], { hollow: 0.1, minY: -0.2 }); shadowPlane(x, z, len + 1, 2.2, 0.087); };
    [[-22, 8, 3], [25.5, 9.8, 3], [-22, -7.5, 3], [25.8, -7.5, 3], [-15, -8.3, 2.6], [15, -8.3, 2.6]].forEach(p => planter(p[0], p[1], p[2]));
    // benches (walnut slats on steel legs) and street lamps
    const slats = [], bsteel = [], lampPole = [], lampHead = [], glowL = [], pool = [];
    function bench(x, z, ry0) {
        const m = new THREE.Matrix4().makeRotationY(ry0), t = new THREE.Matrix4().makeTranslation(x, 0.08, z), M = t.multiply(m), push = (g, l) => { g.applyMatrix4(M); l.push(g); };
        for (let k = 0; k < 5; k++) push(bxg(1.9, 0.04, 0.07, 0, 0.45, -0.2 + k * 0.1, 0.5), slats);
        for (let k = 0; k < 3; k++) push(bxg(1.9, 0.07, 0.025, 0, 0.62 + k * 0.1, -0.3, 0.5), slats);
        [-0.8, 0.8].forEach(sx => { push(bxg(0.05, 0.45, 0.5, sx, 0.225, 0, 1), bsteel); push(bxg(0.05, 0.4, 0.04, sx, 0.65, -0.3, 1), bsteel); });
        shadowPlane(x, z, 2.6, 1.6, 0.087);
    }
    [[-22.2, 1.5, Math.PI / 2], [25.9, 6.2, -Math.PI / 2], [-6, -8.3, 0], [8, -8.3, 0], [-23, -3.5, Math.PI / 2]].forEach(b => bench(b[0], b[1], b[2]));
    const poolTex = canvasTex(128, 128, (x, w, h) => { const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,214,140,.9)'); g.addColorStop(0.5, 'rgba(255,190,110,.3)'); g.addColorStop(1, 'rgba(255,190,110,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    function lamp(x, z, face) {
        const h = 5.2; lampPole.push(cyg(0.05, 0.09, h, x, 0.08 + h / 2, z, 10), cyg(0.14, 0.14, 0.12, x, 0.14, z, 12));
        const ax = x + Math.cos(face) * 0.7, az = z + Math.sin(face) * 0.7;
        { const ag = new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8); ag.rotateZ(Math.PI / 2); ag.rotateY(-face); ag.translate(x + Math.cos(face) * 0.35, 0.08 + h - 0.06, z + Math.sin(face) * 0.35); lampPole.push(ag); }
        lampHead.push(bxg(0.7, 0.1, 0.34, ax, 0.08 + h + 0.02, az, 1, -face)); glowL.push(plg(0.6, 0.26, ax, 0.08 + h - 0.04, az, -face, Math.PI / 2));
        pool.push(plg(7, 7, ax, 0.092, az, 0, -Math.PI / 2)); shadowPlane(x, z, 0.8, 0.8, 0.087);
    }
    [[-26, 17.5, 0], [26, 17.5, Math.PI], [-24, -3, 0], [-20, 9.4, 0], [24.5, 9.4, Math.PI], [-3.6, 27, Math.PI / 2]].forEach(l => { if (LOWQ && l[1] > 20) return; lamp(l[0], l[1], l[2]); });
    gnd.add(mesh(planters, MAT.conc), mesh(solids, MAT.hedgeCore));
    gnd.add(mesh(slats, MAT.wood), mesh(bsteel, MAT.dark), mesh(lampPole, MAT.dark), mesh(lampHead, MAT.dark));
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xdfe6f2, toneMapped: false, side: THREE.DoubleSide }), glowMesh = mesh(glowL, glowMat); gnd.add(glowMesh);
    const poolMat = new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }); gnd.add(mesh(pool, poolMat));
    const shTex = canvasTex(64, 64, (x) => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(10,20,10,.55)'); g.addColorStop(0.6, 'rgba(10,20,10,.2)'); g.addColorStop(1, 'rgba(10,20,10,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
    gnd.add(mesh(shadows, new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })));
    // foliage meshes
    const leafMat = (tex) => { const m = std({ map: tex, vertexColors: true, roughness: 0.75, side: THREE.DoubleSide, alphaTest: 0.42, alphaToCoverage: true }, 0.45); m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', THREE.ShaderChunk.normal_fragment_begin.replace('float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;', 'float faceDirection = 1.0;')); }; return m; };
    for (const [set, tex] of [['isl', leafI], ['jac', leafJ]]) {
        const S = LP[set]; if (!S.P.length) continue;
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(S.P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(S.N, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(S.U, 2)); g.setAttribute('color', new THREE.Float32BufferAttribute(S.C, 3)); g.setIndex(S.I);
        const o = new THREE.Mesh(g, leafMat(tex)); gnd.add(o);
    }
    { const w1 = mesh(wood1, MAT.bark1), w2 = mesh(wood2, MAT.bark2); if (w1) gnd.add(w1); if (w2) gnd.add(w2); }

    // ---------- the entrance sign: a dark stone wall with a steel cap and brushed steel lettering
    { const sg = new THREE.Group(); sg.position.set(-14, 0, 22.1); gnd.add(sg);
        const bd = [bxg(12, 1.9, 0.45, 0, 0.08 + 0.95, 0, 2.5)], cap = [bxg(12.2, 0.08, 0.6, 0, 0.08 + 1.94, 0, 1), bxg(12.5, 0.2, 0.8, 0, 0.08 + 0.1, 0, 2)];
        sg.add(mesh(bd, MAT.concDark), mesh(cap, MAT.steel));
        const letters = canvasTex(2048, 300, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = '#fff'; x.textBaseline = 'alphabetic'; const text = 'YOUR PARTNER TECHNOLOGIES', avail = w - (logoImg ? 380 : 120); let fs = 150, sp = 16, ws, tot; do { x.font = font(700, fs); sp = fs * 0.1; ws = [...text].map(c => x.measureText(c).width); tot = ws.reduce((a, b) => a + b, 0) + sp * (text.length - 1); fs -= 4; } while (tot > avail && fs > 40); let px = w / 2 - tot / 2 + (logoImg ? 130 : 0); [...text].forEach((c, i) => { x.fillText(c, px, 200); px += ws[i] + sp; }); if (logoImg) { x.save(); x.beginPath(); x.arc(150, 130, 105, 0, 7); x.clip(); x.drawImage(logoImg, 45, 25, 210, 210); x.restore(); } });
        const lm = new THREE.MeshStandardMaterial({ map: letters, alphaTest: 0.5, metalness: 0.6, roughness: 0.3, color: 0xffffff, envMapIntensity: 2.2 }); reg.push({ m: lm, env: 2.2 });
        const lp = new THREE.Mesh(new THREE.PlaneGeometry(10.8, 10.8 * 300 / 2048), lm); lp.position.set(0, 0.08 + 1.2, 0.232); sg.add(lp);
        const tag = canvasTex(1024, 120, (x, w, h) => { x.clearRect(0, 0, w, h); x.fillStyle = '#f28a1e'; x.textBaseline = 'middle'; const t = 'AGENTIC AI, BUILT AROUND YOU'; let fs = 56, sp = 10, ws, tot; do { x.font = font(600, fs); sp = fs * 0.18; ws = [...t].map(c => x.measureText(c).width); tot = ws.reduce((a, b) => a + b, 0) + sp * (t.length - 1); fs -= 2; } while (tot > w * 0.92 && fs > 20); let px = w / 2 - tot / 2; x.textAlign = 'left'; [...t].forEach((c, i) => { x.fillText(c, px, h / 2); px += ws[i] + sp; }); });
        const tp = new THREE.Mesh(new THREE.PlaneGeometry(6, 6 * 120 / 1024), new THREE.MeshBasicMaterial({ map: tag, transparent: true, toneMapped: false })); tp.position.set(0, 0.08 + 0.3, 0.232); sg.add(tp);
    }

    // ------------------------------------------------------------------ attach everything in one step; hide the old exterior
    const tick = (t, dt) => {
        const y = cab.position.y;
        if (cabPrevY === null) cabPrevY = y;
        const vy = Math.abs(y - cabPrevY) / Math.max(dt, 0.001); cabPrevY = y;
        const f = Math.max(0, Math.min(FLOORS - 1, Math.round(y / FH))), at = Math.abs(y - f * FH) < 0.07 && vy < 0.6;
        const near = A && (A.ride || Math.hypot(A.x - LIFTX, A.z - AISLE) < 7.5) && Math.abs(A.y - f * FH) < 1.5;
        for (let k = 0; k < FLOORS; k++) { const tg = k === f && at && near ? 1 : 0, d = tg - landOpen[k]; if (Math.abs(d) > 0.001) { landOpen[k] += Math.sign(d) * Math.min(Math.abs(d), dt * (tg ? 1.7 : 3.2)); setLanding(k); } }
        { const tg = at && near ? 1 : 0, d = tg - cabOpen; if (Math.abs(d) > 0.001) { cabOpen += Math.sign(d) * Math.min(Math.abs(d), dt * (tg ? 1.7 : 3.2)); } dl[0].position.z = -(0.33 + cabOpen * 0.5); dl[1].position.z = 0.33 + cabOpen * 0.5; }
        const dir = vy > 0.6 ? Math.sign(y - (tick.py == null ? y : tick.py)) : 0; tick.py = y;
        const ff = Math.round(y / FH); if (ff !== shownF || dir !== tick.dir) { shownF = ff; tick.dir = dir; drawDisp(Math.max(0, Math.min(FLOORS - 1, ff)), dir); }
        const ct = TOP + 0.3, cy = y + 2.85;
        cable.forEach((c, i) => { const len = Math.max(0.1, ct - cy); c.scale.y = len; c.position.set(LIFTX + 0.05, cy + len / 2, AISLE + (i ? 0.3 : -0.3)); });
        cwt.position.set(LIFTX + 1.22, 26.2 - y + 0.2, AISLE);
        if (per.beacon) per.beacon.material.color.setHex(Math.sin(t * 3) > 0.2 ? 0xff4a4a : 0x6a1c1c);
    };
    let alive = true, last = performance.now();
    const loop = (now) => { if (!alive) return; requestAnimationFrame(loop); const dt = Math.min(0.1, (now - last) / 1000); last = now; tick(now / 1000, dt); };
    function relight(on) {
        night.on = !!on; reg.forEach(r => { r.m.envMapIntensity = r.env * (on ? 0.32 : 1); });
        FACADE.map = on ? facadeNight : facadeDay; FACADE.needsUpdate = true; FACADE.emissive.setHex(on ? 0xffffff : 0x000000); FACADE.emissiveMap = on ? facadeNight : null; FACADE.emissiveIntensity = on ? 0.85 : 0; FACADE.needsUpdate = true;
        glowMat.color.setHex(on ? 0xfff0c8 : 0xdfe6f2); poolMat.opacity = on ? 0.55 : 0;
    }
    // commit: attach the new pieces, hide the old ones; if anything throws, undo
    const hid = [];
    try {
        adds.forEach(([p, o]) => p.add(o));
        old.forEach(o => { if (o && o.visible) { o.visible = false; hid.push(o); } });
        cab.children.forEach(c => { if (c !== cabParts && c.visible) { c.visible = false; hid.push(c); } });
    } catch (e) { adds.forEach(([p, o]) => p.remove(o)); hid.forEach(o => { o.visible = true; }); throw e; }
    requestAnimationFrame(loop);
    return { relight, tick, per, reg, dispose() { alive = false; adds.forEach(([p, o]) => p.remove(o)); hid.forEach(o => { o.visible = true; }); } };
}

// The fit-out for every floor of the tower: real floor surfaces, the ceilings, lights and glazed fronts you see when you step inside,
// sliding doors on the ground floor, where you can stand and walk, and real plant models in place of the simple ones.
// Loaded after the scene is up (like the reception); the scene stays complete without it.
import * as THREE from './vendor/three.module.min.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';

const CEIL = 3.1;
const LABEL = { lobby: 'Reception', academy: 'The Academy', hall: 'The Hall', mission: 'Mission Control', launchpad: 'Launch Pad', checks: 'Checklists', governance: 'Governance office', audit: 'Audit and review', engineering: 'Engineering floor', testlab: 'Test lab', pilotbay: 'Pilot bay', meet: 'Meeting rooms', sam: 'SAM, your contact', discovery: 'Discovery studio', architect: 'Architecture room', directors: 'Directors', sales: 'Sales and marketing', procure: 'Procurement and finance', legalhr: 'Legal and HR', board: 'Boardroom', csuite: 'C-suite' };
// one floor surface per storey: [texture set, tint, roughness]
const FLOORS = [['terrazzo_tiles', 0xc9c5bd, 0.4], ['diagonal_parquet', 0xa89a84, 0.5], ['brushed_concrete_03', 0x9a9d9a, 0.45], ['granite_tile_03', 0xb4b0a8, 0.4], ['diagonal_parquet', 0x9f917b, 0.5], ['terrazzo_tiles', 0xa2a6ac, 0.4], ['diagonal_parquet', 0xa89a84, 0.5], ['diagonal_parquet', 0x85694c, 0.38]];

export async function buildFit(ctx) {
    const { renderer, FH, PLAN, floors, shells, ROOM, BLK, LOWQ, PLANTS, recep } = ctx;
    const base = 'assets/hww/';
    const tl = new THREE.TextureLoader(), aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const pbrs = ctx.PBRS;
    const reg = (m, env) => { m.userData.env0 = m.envMapIntensity = env; pbrs.push(m); return m; };
    const tex = (name, tag, rep, srgb) => { const t = tl.load(base + 'tex/' + name + '_' + tag + '.jpg'); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = aniso; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; };
    const pbr = (name, rep, o, env) => reg(new THREE.MeshStandardMaterial(Object.assign({ map: tex(name, 'diff', rep, true), roughnessMap: tex(name, 'rough', rep), normalMap: tex(name, 'nor', rep), roughness: 1, metalness: 0 }, o)), env);
    const plain = (color, o, env) => reg(new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.6, metalness: 0 }, o)), env == null ? 0.5 : env);
    const emissive = (c, op) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false, transparent: op != null, opacity: op == null ? 1 : op });
    const brass = reg(new THREE.MeshStandardMaterial({ color: 0xd2a84e, roughness: 0.32, metalness: 1 }), 1.1);
    const frameM = plain(0x23262f, { metalness: 0.7, roughness: 0.45 }, 0.9);
    const mesh = (geo, mat, x, y, z, par) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); par.add(m); return m; };
    const bx = (w, h, d, mat, x, y, z, par) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, par);
    const ctex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t; };
    const partGlass = new THREE.MeshPhongMaterial({ color: 0xd7e6ff, transparent: true, opacity: 0.14, shininess: 150, specular: 0xffffff, depthWrite: false });
    const cm = new THREE.MeshBasicMaterial({ color: 0xe4ded0, toneMapped: false }), warm = emissive(0xffe3a8), dlm = emissive(0xfff2d4), dl = new THREE.CircleGeometry(0.1, 20);

    // frosted design for glass: a kick band, a band at eye level with fine lines, and halftone dots fading upwards; clear gaps where the doors are
    function etch(wm, hm, doors) {
        const W = 2048, H = Math.round(2048 * hm / wm), ppm = W / wm;
        return ctex(W, H, (x, w, h) => {
            x.clearRect(0, 0, w, h); const Y = m => h - m * ppm;
            x.fillStyle = 'rgba(255,255,255,.62)'; x.fillRect(0, Y(0.32), w, 0.32 * ppm);
            x.fillStyle = 'rgba(255,255,255,.5)'; x.fillRect(0, Y(1.5), w, 0.42 * ppm);
            x.fillStyle = 'rgba(255,255,255,.28)'; for (let i = 0; i < w; i += 11) x.fillRect(i, Y(1.5), 2, 0.42 * ppm);
            x.fillStyle = 'rgba(210,168,78,.9)'; x.fillRect(0, Y(1.5) - 2, w, 3); x.fillRect(0, Y(1.08), w, 3);
            const sp = 0.2 * ppm;
            for (let row = 0, yy = Y(1.62); yy > Y(2.95); row++, yy -= sp) { const k = (Y(1.62) - yy) / (Y(1.62) - Y(2.95)), r = sp * 0.34 * (1 - k); if (r < 0.8) continue; x.fillStyle = 'rgba(255,255,255,.7)'; for (let xx = (row % 2) * sp / 2; xx < w; xx += sp) { x.beginPath(); x.arc(xx, yy, r, 0, 7); x.fill(); } }
            doors.forEach(d => x.clearRect(d[0] * ppm, 0, (d[1] - d[0]) * ppm, h));
        });
    }
    const doors = [];
    function glassDoor(par, x, z, w, reachP) {   // an automatic sliding door
        const g = new THREE.Group(); g.position.set(x, 0, z); par.add(g);
        const H = 2.55, T = 0.09, glassM = new THREE.MeshPhongMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.16, shininess: 160, specular: 0xffffff, depthWrite: false });
        bx(T, H, 0.12, frameM, -w / 2 - T / 2, H / 2, 0, g); bx(T, H, 0.12, frameM, w / 2 + T / 2, H / 2, 0, g); bx(w + 2 * T, 0.16, 0.14, frameM, 0, H + 0.02, 0, g);
        bx(0.3, 0.07, 0.1, plain(0x0b0d12, { roughness: 0.3 }), 0, H - 0.08, 0.07, g); bx(0.12, 0.012, 0.012, emissive(0x3ddc97), 0, H - 0.08, 0.125, g);
        bx(w, 0.02, 0.2, brass, 0, 0.006, 0, g); bx(w, 0.03, 0.05, frameM, 0, H - 0.1, 0.045, g);
        const leaves = [-1, 1].map(sx => { const L = new THREE.Group(); L.position.set(sx * w / 4, 0, 0.045); g.add(L);
            bx(w / 2 - 0.02, H - 0.14, 0.025, glassM, 0, H / 2 - 0.05, 0, L); bx(w / 2 - 0.02, 0.24, 0.035, brass, 0, 0.13, 0, L);
            bx(0.035, H - 0.14, 0.04, frameM, -sx * (w / 4 - 0.03), H / 2 - 0.05, 0, L); bx(0.035, H - 0.14, 0.04, frameM, sx * (w / 4 - 0.03), H / 2 - 0.05, 0, L);
            mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 12), brass, -sx * (w / 4 - 0.1), 1.05, 0.03, L); L.userData.x0 = sx * w / 4; L.userData.sx = sx; return L; });
        const d = { leaves, w, open: 0, par, x, z, reachP }; doors.push(d); return d;
    }

    const ceilMs = [];
    const out = { inside: [], spots: [], doors, floorsDone: 0, setNight(on) { ceilMs.forEach(m => m.color.setScalar(on ? 0.4 : 1)); cm.color.set(on ? 0x6e6a62 : 0xe4ded0); } };
    const worldOf = new THREE.Vector3();
    for (let f = 0; f < PLAN.length; f++) {
        const P = PLAN[f], g = floors[f].g, ins = new THREE.Group(); ins.name = 'fit-inside-' + f; ins.visible = false; g.add(ins); out.inside[f] = ins;
        const [tn, tint, rgh] = FLOORS[f], x0 = f === 0 ? recep.X1 : -P.w / 2 + 0.3, x1 = P.w / 2 - 0.3, fw = x1 - x0, fd = P.d - 0.6;
        // floor surface: a real material over the pastel tile, with a darker border band
        const fm = pbr(tn, [Math.max(1, fw / 2.6), Math.max(1, fd / 2.6)], { color: tint, roughness: rgh, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }, 0.6);
        const oy = f === 0 ? 0.095 : 0;   // the lawn the tower stands on is a little proud of the ground slab
        const fl = mesh(new THREE.PlaneGeometry(fw, fd), fm, (x0 + x1) / 2, 0.05 + oy, 0, g); fl.rotation.x = -Math.PI / 2;
        const edge = plain(0x25272e, { roughness: 0.45 }, 0.5);
        bx(fw, 0.012, 0.28, edge, (x0 + x1) / 2, 0.056 + oy, P.d / 2 - 0.44, g); bx(fw, 0.012, 0.28, edge, (x0 + x1) / 2, 0.056 + oy, -P.d / 2 + 0.44, g);
        // skirting along the back wall, with a brass cap
        bx(fw, 0.14, 0.04, plain(0x2b2f3a, { roughness: 0.45 }, 0.5), (x0 + x1) / 2, 0.12 + oy, -P.d / 2 + 0.1, g); bx(fw, 0.02, 0.06, brass, (x0 + x1) / 2, 0.2 + oy, -P.d / 2 + 0.1, g);

        // what you only see from inside: ceiling with downlights and crown moulding, and the glazed front
        const cw = fw, cx = (x0 + x1) / 2;
        const ceilM = new THREE.MeshBasicMaterial({ map: ctex(64, 64, (c, w, h) => { const gr = c.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w * 0.75); gr.addColorStop(0, '#f6f1e6'); gr.addColorStop(1, '#cfc8b8'); c.fillStyle = gr; c.fillRect(0, 0, w, h); }), toneMapped: false }); ceilMs.push(ceilM);
        const ceil = mesh(new THREE.PlaneGeometry(cw, P.d), ceilM, cx, CEIL, 0, ins); ceil.rotation.x = Math.PI / 2;
        const nx = Math.max(2, Math.round(cw / 2.6)), nz = Math.max(2, Math.round(P.d / 3.1));
        const dls = new THREE.InstancedMesh(dl, dlm, nx * nz), mm = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
        for (let ix = 0; ix < nx; ix++) for (let iz = 0; iz < nz; iz++) { mm.compose(new THREE.Vector3(x0 + (ix + 0.5) * cw / nx, CEIL - 0.01, -P.d / 2 + (iz + 0.5) * P.d / nz), q, new THREE.Vector3(1, 1, 1)); dls.setMatrixAt(ix * nz + iz, mm); } ins.add(dls);
        bx(cw, 0.18, 0.18, cm, cx, CEIL - 0.09, -P.d / 2 + 0.1, ins); bx(cw, 0.18, 0.18, cm, cx, CEIL - 0.09, P.d / 2 - 0.1, ins);
        bx(cw - 0.6, 0.03, 0.04, warm, cx, CEIL - 0.19, -P.d / 2 + 0.36, ins);
        if (f === 0) bx(0.18, 0.18, P.d, cm, x0 + 0.09, CEIL - 0.09, 0, ins);
        bx(0.18, 0.18, P.d, cm, x1 - 0.09, CEIL - 0.09, 0, ins);
        // glazed front: etched glass, dark mullions, a header; on the ground floor sliding doors in front of the Academy and the Hall
        const fz = P.d / 2 - 0.02, gaps = [];
        if (f === 0) [recep.AX, recep.HX].forEach(dx => gaps.push([dx - 1.0, dx + 1.0]));
        mesh(new THREE.PlaneGeometry(cw, 3.0), partGlass, cx, 1.55, fz, ins);
        mesh(new THREE.PlaneGeometry(cw, 3.0), new THREE.MeshBasicMaterial({ map: etch(cw, 3.0, gaps.map(a => [a[0] - 0.05 - x0, a[1] + 0.05 - x0])), transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide, opacity: 0.95 }), cx, 1.55, fz + 0.006, ins);
        const nm = Math.round(cw / 3);
        for (let k = 0; k <= nm; k++) { const mx = x0 + k * cw / nm; if (!gaps.some(a => mx > a[0] - 0.15 && mx < a[1] + 0.15)) bx(0.07, 3.1, 0.07, frameM, mx, 1.55, fz, ins); }
        bx(cw, 0.08, 0.08, frameM, cx, 3.07, fz, ins);
        if (f === 0) gaps.forEach(a => glassDoor(ins, (a[0] + a[1]) / 2, fz, 2.0, 2.0));
        floors[f].fit = { x0, x1 };

        // where you can stand: two places in every room, the first by the glass front looking in, the second inside looking across
        const sp = [];
        const rooms = Object.values(ROOM).filter(r => r.f === f);
        if (f === 0) recep.spots.forEach(s => sp.push(s));
        rooms.forEach(r => { if (f === 0 && r.id === 'lobby') return; const nm2 = LABEL[r.id] || r.id; sp.push({ name: nm2, x: r.x, z: P.d / 2 - 1.5, y: 1.62, yaw: 0, pitch: -0.04, sx: r.x }); sp.push({ name: nm2 + ', across', x: r.x - Math.min(2.5, r.span * 0.25), z: 1.6, y: 1.55, yaw: 0.7, pitch: -0.02, sx: r.x + 0.01 }); });
        sp.forEach(s => { if (s.sx == null) s.sx = s.x; });
        sp.sort((a, b) => a.sx - b.sx);
        out.spots[f] = sp;
    }

    // real pendant lamps over every room (only drawn when you are inside that floor, so they cost nothing in the overview)
    if (!LOWQ) {
        const lp = await new GLTFLoader().loadAsync(base + 'models/modern_ceiling_lamp_01/modern_ceiling_lamp_01.gltf').then(g => g.scene).catch(() => null);
        if (lp) { const b3 = new THREE.Box3(), sz = new THREE.Vector3(); b3.setFromObject(lp); b3.getSize(sz);
            Object.values(ROOM).forEach(r => { const f = r.f, P = PLAN[f]; const n = r.span > 9 ? 2 : 1;
                for (let k = 0; k < n; k++) { const c = lp.clone(true), s0 = 0.9 / Math.max(sz.x, 0.001); c.scale.multiplyScalar(s0); const bb = new THREE.Box3().setFromObject(c); const h = new THREE.Group(); c.position.set(-(bb.min.x + bb.max.x) / 2, -bb.max.y, -(bb.min.z + bb.max.z) / 2); h.add(c);
                    h.position.set(r.x + (n === 2 ? (k ? 1 : -1) * r.span * 0.22 : 0), CEIL, -0.2); out.inside[f].add(h); } }); }
    }
    // real plants in place of the simple ones (cheaper to skip on phones)
    if (!LOWQ) {
        const loader = new GLTFLoader(), box3 = new THREE.Box3(), size = new THREE.Vector3();
        const names = ['potted_plant_04', 'anthurium_botany_01'], proto = [];
        await Promise.all(names.map(async n => { try { proto.push((await loader.loadAsync(base + 'models/' + n + '/' + n + '.gltf')).scene); } catch (e) { proto.push(null); } }));
        PLANTS.forEach((pl, i) => {
            const src = proto[i % proto.length]; if (!src || !pl.simple.parent) return; const c = src.clone(true);
            c.traverse(m => { if (m.isMesh && m.material && m.material.map) m.material.map.anisotropy = aniso; });
            box3.setFromObject(c); box3.getSize(size); const k = (1.35 / Math.max(size.y, 0.001)); c.scale.multiplyScalar(k); box3.setFromObject(c); c.position.set(-(box3.min.x + box3.max.x) / 2, -box3.min.y, -(box3.min.z + box3.max.z) / 2);
            const h = new THREE.Group(); h.add(c); pl.g.add(h); pl.simple.visible = false;
        });
    }

    // clamp: bounds, furniture, and (ground floor) the lobby partition and the sliding doors out
    out.clamp = function (f, x, z) {
        const P = PLAN[f];
        if (f === 0 && x < recep.X1 - 0.3) return recep.clamp(x, z);
        let xmin = -P.w / 2 + 0.5, xmax = P.w / 2 - 0.5, zmin = -P.d / 2 + 0.7, zmax = P.d / 2 - 0.45;
        if (f === 0) { for (const dx of [recep.AX, recep.HX]) if (Math.abs(x - dx) < 0.8 && z > P.d / 2 - 1.2) zmax = P.d / 2 + 2.6; }
        x = Math.max(xmin, Math.min(xmax, x)); z = Math.max(zmin, Math.min(zmax, z));
        const bl = (BLK[f] || []).concat(f === 0 ? recep.walls : []);
        for (const b of bl) { const a0 = b[0] - 0.3, a1 = b[1] + 0.3, c0 = b[2] - 0.3, c1 = b[3] + 0.3; if (x > a0 && x < a1 && z > c0 && z < c1) { const d = [x - a0, a1 - x, z - c0, c1 - z], m = Math.min(...d); if (m === d[0]) x = a0; else if (m === d[1]) x = a1; else if (m === d[2]) z = c0; else z = c1; } }
        return [x, z];
    };
    out.tick = function (dt, actors) {
        for (const d of doors) { const near = actors && actors.some(a => !a.agent && Math.hypot(a.x - d.x, a.z - d.z) < d.reachP); d.open += Math.max(-1, Math.min(1, (near ? 1 : 0) - d.open)) * Math.min(1, dt * 3.2) * (near ? 1.2 : 0.9); d.open = Math.max(0, Math.min(1, d.open)); for (const L of d.leaves) L.position.x = L.userData.x0 + L.userData.sx * d.w * 0.46 * d.open * d.open * (3 - 2 * d.open); }
    };
    return out;
}

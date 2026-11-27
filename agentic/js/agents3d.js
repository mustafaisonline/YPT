// YPT — the agents as real 3D models (three.js, self-hosted in js/vendor, MIT licence).
//
// agentic.js draws every agent as an SVG. This module upgrades each of those to a true 3D model:
// built in code from spheres, capsules and tori (no model files to download), lit with real lights,
// and rendered into a small canvas that sits exactly where the drawing was. The SVG stays in the page
// (hidden) to hold the layout, and remains the fallback if WebGL is not available.
//
// One WebGL renderer is shared by all agents: each visible agent is rendered in turn and copied into
// its own 2D canvas. That keeps normal page layering, CSS animations, dragging and fly-outs working,
// and avoids the browser's limit on the number of WebGL contexts.

import * as THREE from './vendor/three.module.min.js';

const AGENTS = window.YPT_AGENTS;
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (AGENTS) start();

function start() {
    // ---------------------------------------------------------------- renderer
    const GL = 1024; // shared drawing surface; large enough for the biggest agent at 2x
    const glCanvas = document.createElement('canvas');
    glCanvas.width = glCanvas.height = GL;
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true, antialias: true });
    } catch (e) { return; } // no WebGL: the SVG agents stay
    renderer.setPixelRatio(1);
    renderer.setSize(GL, GL, false);
    renderer.setClearColor(0x000000, 0);
    renderer.setScissorTest(true);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0xaeb9dc, 1.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(-140, 200, 260); scene.add(key);
    const rim = new THREE.DirectionalLight(0xc5d3ff, 1.1); rim.position.set(180, 60, -160); scene.add(rim);
    const holder = new THREE.Group(); scene.add(holder);

    // The models are built in the same coordinate space as the SVG drawings (a 124 x 142 canvas),
    // so each one lines up with the drawing it replaces. Two framings: full body, and head only.
    const FRAME = {
        full: { cx: 2, cy: -1, h: 142, aspect: 124 / 142 },
        head: { cx: 0, cy: 26, h: 88, aspect: 100 / 88 }
    };
    const FOV = 16;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 2000);
    function aim(f) {
        const d = (f.h / 2) / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
        camera.aspect = f.aspect; camera.position.set(f.cx, f.cy, d); camera.lookAt(f.cx, f.cy, 0); camera.updateProjectionMatrix();
    }

    // ---------------------------------------------------------------- shared geometry and materials
    // D = 1 builds the full-detail models used by the page's agents; D = 0 builds light ones for crowds (see YPT_AG3D below).
    let D = 1;
    const geo = {}, G = (k, make) => { k = D + k; return geo[k] || (geo[k] = make()); };
    const sphere = () => G('sphere', () => new THREE.SphereGeometry(1, D ? 36 : 14, D ? 24 : 9));
    const cyl = () => G('cyl', () => new THREE.CylinderGeometry(1, 1, 1, D ? 28 : 10));
    const capsule = (r, len) => G('cap' + r + '_' + len, () => new THREE.CapsuleGeometry(r, len, D ? 10 : 3, D ? 24 : 10));
    const torus = (r, tube, arc) => G('tor' + r + '_' + tube + '_' + arc, () => new THREE.TorusGeometry(r, tube, D ? 12 : 6, D ? 40 : 14, arc));
    const box = () => G('box', () => new THREE.BoxGeometry(1, 1, 1));
    const octa = () => G('octa', () => new THREE.OctahedronGeometry(1));
    const cone = (open) => G('cone' + open, () => new THREE.ConeGeometry(1, 1, D ? 28 : 10, 1, !!open));
    const dome = () => G('dome', () => new THREE.SphereGeometry(1, D ? 36 : 14, D ? 18 : 7, 0, Math.PI * 2, 0, Math.PI / 2));

    const phong = (color, shininess, extra) => new THREE.MeshPhongMaterial(Object.assign({ color, shininess, specular: 0x555b6e }, extra));
    const M = {
        shell: phong(0xf3f5fc, 90, { specular: 0x8a90a6 }),
        steel: phong(0x9aa6c4, 60),
        neck: phong(0x8f9cc2, 30),
        visor: phong(0x0d1430, 220, { specular: 0x9fb2ff }),
        white: phong(0xffffff, 60),
        ink: phong(0x3a4258, 40),
        gold: phong(0xf5a524, 60),
        bulb: new THREE.MeshBasicMaterial({ color: 0xffe27a }),
        glass: new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, shininess: 200 })
    };
    const perAgent = {};
    function mats(def) {
        return perAgent[def.id] || (perAgent[def.id] = {
            accent: phong(new THREE.Color(def.hue), 70),
            dark: phong(new THREE.Color(def.dark), 50),
            glow: new THREE.MeshBasicMaterial({ color: new THREE.Color(def.glow) }),
            jet: new THREE.MeshBasicMaterial({ color: new THREE.Color(def.hue), transparent: true, opacity: 0.5, depthWrite: false })
        });
    }
    // soft round ground shadow, drawn once
    const shadowTex = (() => {
        const c = document.createElement('canvas'); c.width = 128; c.height = 32;
        const x = c.getContext('2d'), g = x.createRadialGradient(64, 16, 0, 64, 16, 64);
        g.addColorStop(0, 'rgba(19,31,71,.5)'); g.addColorStop(0.55, 'rgba(19,31,71,.2)'); g.addColorStop(1, 'rgba(19,31,71,0)');
        x.setTransform(1, 0, 0, 0.25, 0, 12); x.fillStyle = g; x.beginPath(); x.arc(64, 16, 64, 0, 7); x.fill();
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    })();
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    const plane = () => G('plane', () => new THREE.PlaneGeometry(1, 1));

    // ---------------------------------------------------------------- model building helpers
    // Positions are given in SVG coordinates (x right, y down) plus a depth z, relative to a pivot.
    function mesh(parent, g, m, x, y, z, sx, sy, sz, pivot) {
        const o = new THREE.Mesh(g, m), p = pivot || [60, 60];
        o.position.set(x - p[0], p[1] - y, z || 0);
        o.scale.set(sx == null ? 1 : sx, sy == null ? (sx == null ? 1 : sx) : sy, sz == null ? (sx == null ? 1 : sx) : sz);
        parent.add(o); return o;
    }
    // a thin rod between two SVG points
    function rod(parent, m, x1, y1, z1, x2, y2, z2, r, pivot) {
        const p = pivot || [60, 60];
        const a = new THREE.Vector3(x1 - p[0], p[1] - y1, z1), b = new THREE.Vector3(x2 - p[0], p[1] - y2, z2);
        const o = new THREE.Mesh(cyl(), m);
        o.position.copy(a).add(b).multiplyScalar(0.5);
        o.scale.set(r, a.distanceTo(b), r);
        o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
        parent.add(o); return o;
    }

    const HEAD = [60, 68]; // the head turns about the neck
    const ARM = [80, 84];  // the right hand swings about the shoulder

    // ---------------------------------------------------------------- industry looks
    // The visitor's industry (window.YPT_LOOK, set in agentic.js) changes the hat, the clothes and one detail.
    const lookCache = {};
    function lookMats(L) {
        return lookCache[L.id] || (lookCache[L.id] = {
            suit: phong(new THREE.Color(L.suit), 60),
            dark: phong(new THREE.Color(L.suit).multiplyScalar(0.6), 50),
            trim: phong(new THREE.Color(L.trim), 80)
        });
    }
    function lookHat(L, head) {
        const k = lookMats(L), H = HEAD;
        switch (L.hat) {
            case 'bowler':
                mesh(head, dome(), k.suit, 60, 25, 0, 30, 21, 27, H);
                mesh(head, cyl(), k.trim, 60, 23.5, 0, 30.6, 3.2, 27.6, H);
                mesh(head, cyl(), k.suit, 60, 24.5, 0, 38, 3, 33, H); break;
            case 'headset': {
                mesh(head, torus(39, 2.6, Math.PI), k.trim, 60, 42, 0, 1, 1, 1, H);
                rod(head, M.steel, 22, 52, 14, 30, 66, 24, 1.2, H); rod(head, M.steel, 30, 66, 24, 38, 70, 27, 1.2, H);
                mesh(head, sphere(), k.suit, 38, 70, 27, 3.4, 3.4, 3.4, H); break;
            }
            case 'surgcap':
                mesh(head, dome(), k.suit, 60, 27, 0, 29, 22, 26, H);
                mesh(head, box(), k.trim, 60, 15, 22, 10, 3, 1.4, H); mesh(head, box(), k.trim, 60, 15, 22, 3, 10, 1.4, H); break;
            case 'straw':
                mesh(head, cyl(), k.trim, 60, 24, 0, 47, 1.8, 42, H);
                mesh(head, dome(), k.trim, 60, 24, 0, 25, 17, 23, H);
                mesh(head, cyl(), k.suit, 60, 22.5, 0, 25.6, 3, 23.6, H); break;
            case 'helmet':
                mesh(head, dome(), k.suit, 60, 26, 0, 32, 25, 29, H);
                mesh(head, cyl(), k.dark, 60, 26, 0, 34, 3.4, 31, H);
                mesh(head, octa(), k.trim, 60, 13, 24.6, 4.2, 4.2, 1.4, H); break;
            case 'cap':
                mesh(head, dome(), k.suit, 60, 25, 0, 30, 20, 27, H);
                mesh(head, cyl(), k.dark, 60, 25.5, 17, 25, 1.8, 19, H);
                mesh(head, sphere(), k.trim, 60, 5, 0, 2.8, 2.8, 2.8, H);
                mesh(head, box(), k.trim, 60, 16, 24.2, 12, 6, 1.2, H); break;
            case 'hardhat': {
                mesh(head, dome(), k.suit, 60, 25, 0, 33, 23, 29, H);
                mesh(head, cyl(), k.dark, 60, 24.5, 0, 39, 4.5, 34, H);
                const ridge = mesh(head, capsule(3.2, 44), k.dark, 60, 12, 0, 1, 1, 1, H); ridge.rotation.x = Math.PI / 2; ridge.scale.set(1.3, 1, 0.9); ridge.position.y += 6; break;
            }
            case 'mortar': {
                mesh(head, cyl(), k.dark, 60, 17, 0, 19, 9, 19, H);
                const board = mesh(head, box(), k.suit, 60, 11, 0, 46, 3, 46, H); board.rotation.y = Math.PI / 4; board.rotation.z = -0.06;
                mesh(head, sphere(), k.trim, 60, 9, 0, 2.6, 1.6, 2.6, H);
                rod(head, k.trim, 60, 9.5, 0, 88, 12, 8, 0.8, H); rod(head, k.trim, 88, 12, 8, 88, 25, 8, 0.8, H);
                mesh(head, sphere(), k.trim, 88, 27, 8, 2.6, 3.2, 2.6, H); break;
            }
            case 'fedora':
                mesh(head, cyl(), k.dark, 60, 24, 0, 44, 2.4, 38, H);
                mesh(head, dome(), k.suit, 60, 24, 0, 25, 19, 23, H);
                mesh(head, cyl(), k.trim, 60, 22.5, 0, 25.8, 3, 23.8, H); break;
            case 'bellcap':
                mesh(head, dome(), k.suit, 60, 24, 0, 25, 15, 22, H);
                mesh(head, cyl(), k.dark, 60, 24, 0, 26, 2.4, 23, H);
                mesh(head, cyl(), k.trim, 60, 18, 0, 25.6, 2.2, 22.6, H);
                mesh(head, sphere(), k.trim, 60, 8, 0, 3.2, 3.2, 3.2, H); break;
            case 'beret': {
                const b = mesh(head, sphere(), k.suit, 63, 14, 0, 31, 9, 28, H); b.rotation.z = -0.14;
                mesh(head, cyl(), k.dark, 60, 22, 0, 27, 3, 24, H);
                mesh(head, sphere(), k.trim, 58, 5, 0, 2.6, 2.6, 2.6, H); break;
            }
            case 'beanie':
                mesh(head, dome(), k.suit, 60, 26, 0, 29, 23, 26, H);
                mesh(head, cyl(), k.dark, 60, 24, 0, 31, 6, 28, H);
                mesh(head, sphere(), k.trim, 60, 2, 0, 5, 5, 5, H); break;
            case 'goggles':
                mesh(head, dome(), k.suit, 60, 26, 0, 30, 21, 27, H);
                mesh(head, cyl(), k.trim, 60, 23.5, 0, 31, 2.4, 28, H);
                mesh(head, sphere(), M.glass, 48, 14, 22, 9, 6, 3, H); mesh(head, sphere(), M.glass, 72, 14, 22, 9, 6, 3, H); break;
            case 'peaked':
                mesh(head, dome(), k.suit, 60, 25, 0, 30, 22, 27, H);
                mesh(head, cyl(), k.dark, 60, 23.5, 0, 30.6, 4, 27.6, H);
                mesh(head, sphere(), k.trim, 60, 22, 27.4, 3.2, 3.2, 1.6, H);
                mesh(head, cyl(), k.dark, 60, 26, 18, 25, 1.4, 13, H); break;
        }
    }
    function lookBody(L, body) {
        const k = lookMats(L);
        switch (L.detail) {
            case 'tie':
                [-1, 1].forEach(s => { const c = mesh(body, box(), M.white, 60 + s * 5.2, 74.5, 14.2, 7, 3, 1.4); c.rotation.z = s * 0.55; });
                mesh(body, box(), k.trim, 60, 82, 15, 4.4, 11, 1.8); mesh(body, sphere(), k.trim, 60, 76, 15.2, 2.6); break;
            case 'lanyard':
                rod(body, k.trim, 51, 73, 12, 60, 95, 16.8, 0.9); rod(body, k.trim, 69, 73, 12, 60, 95, 16.8, 0.9);
                mesh(body, box(), M.white, 60, 100, 17.6, 7, 9, 1); break;
            case 'stethoscope': {
                const t = mesh(body, torus(9, 0.9, Math.PI), M.ink, 60, 75, 15, 1, 1.35, 1); t.rotation.z = Math.PI;
                mesh(body, sphere(), M.steel, 60, 88, 16.5, 2.4); break;
            }
            case 'straps':
                mesh(body, box(), k.dark, 51, 84, 16, 4, 24, 1.6); mesh(body, box(), k.dark, 69, 84, 16, 4, 24, 1.6);
                mesh(body, sphere(), k.trim, 51, 95, 17, 1.7); mesh(body, sphere(), k.trim, 69, 95, 17, 1.7); break;
            case 'epaulette': {
                const l = mesh(body, box(), k.trim, 45, 77, 7, 9, 2.8, 7); l.rotation.z = -0.5;
                const r = mesh(body, box(), k.trim, 75, 77, 7, 9, 2.8, 7); r.rotation.z = 0.5; break;
            }
            case 'apron':
                rod(body, k.trim, 50, 73, 11, 52, 96, 16, 0.9); rod(body, k.trim, 70, 73, 11, 68, 96, 16, 0.9);
                mesh(body, box(), k.trim, 60, 100, 17.4, 20, 9, 1.2); break;
            case 'stripe': {
                const ring = mesh(body, torus(20.5, 1.8, Math.PI * 2), k.trim, 60, 96, 0, 1, 0.86, 1); ring.rotation.x = Math.PI / 2; break;
            }
            case 'tassel': mesh(body, box(), k.trim, 60, 96, 17.6, 2.6, 22, 0.9); break;
            case 'badge': mesh(body, sphere(), k.trim, 49, 82, 14.5, 2.8); break;
            case 'wings': { const l = mesh(body, box(), k.trim, 52, 78, 15.4, 12, 2.2, 1.4); l.rotation.z = 0.35; const r = mesh(body, box(), k.trim, 68, 78, 15.4, 12, 2.2, 1.4); r.rotation.z = -0.35; mesh(body, sphere(), M.white, 60, 79, 16, 2.4); break; }
            case 'bowtie': { const l = mesh(body, cone(), k.trim, 55.5, 75, 15.4, 5, 6, 2); l.rotation.z = Math.PI / 2; const r = mesh(body, cone(), k.trim, 64.5, 75, 15.4, 5, 6, 2); r.rotation.z = -Math.PI / 2; mesh(body, sphere(), M.white, 60, 75, 15.8, 2); break; }
            case 'vest': mesh(body, box(), k.trim, 51, 87, 16.4, 4, 28, 1.4); mesh(body, box(), k.trim, 69, 87, 16.4, 4, 28, 1.4); break;
        }
    }

    function headgear(def, head, m, st) {
        const H = HEAD;
        const L = window.YPT_LOOK; if (L && L.hat) return lookHat(L, head);
        switch (def.id) {
            case 'vera': { // headset band, boom and microphone
                const band = mesh(head, torus(39, 2.6, Math.PI), m.accent, 60, 42, 0, 1, 1, 1, H); band.rotation.y = 0;
                rod(head, M.steel, 22, 52, 14, 30, 66, 24, 1.2, H); rod(head, M.steel, 30, 66, 24, 38, 70, 27, 1.2, H);
                mesh(head, sphere(), m.accent, 38, 70, 27, 3.4, 3.4, 3.4, H); break;
            }
            case 'atlas': { // signal beacon
                rod(head, M.steel, 60, 17, 0, 60, 6, 0, 1.25, H);
                const d = mesh(head, octa(), m.accent, 60, 0, 0, 6.5, 8, 6.5, H); st.spinners.push(d); break;
            }
            case 'forge': { // hard hat
                mesh(head, dome(), m.accent, 60, 25, 0, 33, 23, 29, H);
                mesh(head, cyl(), m.dark, 60, 24.5, 0, 39, 4.5, 34, H);
                const ridge = mesh(head, capsule(3.2, 44), m.dark, 60, 12, 0, 1, 1, 1, H); ridge.rotation.x = Math.PI / 2; ridge.scale.set(1.3, 1, 0.9); ridge.position.y += 6; break;
            }
            case 'orca': { // twin antennas
                rod(head, M.steel, 45, 18, 0, 39, 5, 0, 1.25, H); rod(head, M.steel, 75, 18, 0, 81, 5, 0, 1.25, H);
                st.pulsers.push(mesh(head, sphere(), m.accent, 38, 3, 0, 4.6, 4.6, 4.6, H), mesh(head, sphere(), m.accent, 82, 3, 0, 4.6, 4.6, 4.6, H)); break;
            }
            case 'spark': { // lightning bolt
                const s = new THREE.Shape(); [[64, -7], [52, 8], [60, 8], [56, 17], [69, 3], [61, 3]].forEach((p, i) => s[i ? 'lineTo' : 'moveTo'](p[0] - 60, H[1] - p[1]));
                const g = G('bolt', () => new THREE.ExtrudeGeometry(s, { depth: 5, bevelEnabled: true, bevelSize: 0.8, bevelThickness: 0.8, bevelSegments: 2 }));
                const b = new THREE.Mesh(g, m.accent); b.position.z = -2.5; head.add(b); break;
            }
            case 'sage': { // mortarboard with tassel
                mesh(head, cyl(), m.dark, 60, 17, 0, 19, 9, 19, H);
                const board = mesh(head, box(), m.accent, 60, 11, 0, 46, 3, 46, H); board.rotation.y = Math.PI / 4; board.rotation.z = -0.06;
                mesh(head, sphere(), M.gold, 60, 9, 0, 2.6, 1.6, 2.6, H);
                rod(head, M.gold, 60, 9.5, 0, 88, 12, 8, 0.8, H); rod(head, M.gold, 88, 12, 8, 88, 25, 8, 0.8, H);
                mesh(head, sphere(), M.gold, 88, 27, 8, 2.6, 3.2, 2.6, H); break;
            }
            case 'aegis': { // shield crest
                rod(head, M.steel, 60, 17, 0, 60, 8, 0, 1.25, H);
                const s = new THREE.Shape(); [[0, -9], [12, -5], [12, 3], [6, 11], [0, 14], [-6, 11], [-12, 3], [-12, -5]].forEach((p, i) => s[i ? 'lineTo' : 'moveTo'](p[0], H[1] - 4 - p[1]));
                const g = G('shield', () => new THREE.ExtrudeGeometry(s, { depth: 5, bevelEnabled: true, bevelSize: 0.9, bevelThickness: 0.9, bevelSegments: 2 }));
                const sh = new THREE.Mesh(g, m.accent); sh.position.set(0, -4, -2.5); head.add(sh); break;
            }
            case 'scout': { // radar dish
                rod(head, M.steel, 60, 17, 0, 60, 8, 0, 1.25, H);
                const dishG = new THREE.Group(); dishG.position.set(0, H[1] - 5, 0); dishG.rotation.z = 0.42; dishG.rotation.x = 0.35; head.add(dishG);
                const dish = new THREE.Mesh(dome(), m.accent); dish.scale.set(12, 7, 12); dish.rotation.x = Math.PI; dishG.add(dish);
                const pin = new THREE.Mesh(cyl(), m.dark); pin.scale.set(0.9, 8, 0.9); pin.position.y = 3; dishG.add(pin);
                const tip = new THREE.Mesh(sphere(), m.dark); tip.scale.setScalar(2.4); tip.position.y = 8; dishG.add(tip); st.pulsers.push(tip); break;
            }
            case 'joy': { // bow
                const l = mesh(head, cone(), m.accent, 66, 13, 10, 9, 15, 5, H); l.rotation.z = -Math.PI / 2;
                const r = mesh(head, cone(), m.accent, 82, 13, 10, 9, 15, 5, H); r.rotation.z = Math.PI / 2;
                mesh(head, sphere(), m.dark, 74, 13, 11, 4.6, 4.6, 4.6, H); break;
            }
            default: { // a single antenna
                rod(head, M.steel, 60, 17, 0, 60, 7, 0, 1.25, H);
                st.pulsers.push(mesh(head, sphere(), m.accent, 60, 4, 0, 4.6, 4.6, 4.6, H));
            }
        }
    }

    function tools(def, body, hand, m, st) {
        const A = ARM;
        switch (def.id) {
            case 'vera': { // clipboard in the left hand
                const g = new THREE.Group(); g.position.set(17.5 - 60, 60 - 96, 11); g.rotation.z = 0.14; g.rotation.y = 0.25; body.add(g);
                const b = new THREE.Mesh(box(), M.white); b.scale.set(19, 24, 1.6); g.add(b);
                const c = new THREE.Mesh(box(), m.accent); c.scale.set(9, 5, 3); c.position.y = 12; g.add(c);
                [4, -1, -6].forEach((y, i) => { const l = new THREE.Mesh(box(), M.steel); l.scale.set(i === 2 ? 8 : 12, 1.3, 0.4); l.position.set(i === 2 ? -2 : 0, y, 1); g.add(l); });
                break;
            }
            case 'sage': { // book in the left hand
                const g = new THREE.Group(); g.position.set(17.5 - 60, 60 - 92.5, 11); g.rotation.z = 0.17; g.rotation.y = 0.3; body.add(g);
                const cv = new THREE.Mesh(box(), m.accent); cv.scale.set(21, 17, 5); g.add(cv);
                const pg = new THREE.Mesh(box(), M.white); pg.scale.set(17, 13, 5.6); pg.position.x = 1; g.add(pg);
                const sp = new THREE.Mesh(box(), m.dark); sp.scale.set(1.4, 13.4, 5.8); g.add(sp); break;
            }
            case 'atlas': { // compass
                const g = new THREE.Group(); g.position.set(101 - A[0], A[1] - 74, 12); hand.add(g);
                const f = new THREE.Mesh(cyl(), M.white); f.scale.set(9.5, 2.4, 9.5); f.rotation.x = Math.PI / 2; g.add(f);
                const r = new THREE.Mesh(torus(10, 1.6, Math.PI * 2), m.accent); g.add(r);
                const nd = new THREE.Mesh(octa(), m.accent); nd.scale.set(2.6, 7.5, 1.4); nd.position.z = 2; nd.rotation.z = -0.6; g.add(nd); st.needle = nd; break;
            }
            case 'forge': { // wrench
                const g = new THREE.Group(); g.position.set(99 - A[0], A[1] - 76, 10); g.rotation.z = -0.56; hand.add(g);
                const h = new THREE.Mesh(capsule(2.5, 16), M.steel); h.position.y = -4; g.add(h);
                const j = new THREE.Mesh(torus(5.6, 2.3, Math.PI * 1.45), M.steel); j.position.y = 10; j.rotation.z = Math.PI * 0.78; g.add(j); break;
            }
            case 'orca': { // conductor's baton with a star
                rod(hand, M.ink, 96, 84, 8, 111, 60, 12, 1.2, A);
                const s = mesh(hand, octa(), m.accent, 112, 57, 12, 6, 6, 3, A); st.spinners.push(s); st.pulsers.push(s); break;
            }
            case 'spark': { // light bulb
                mesh(hand, cyl(), M.steel, 101, 82.5, 10, 3.4, 5, 3.4, A);
                st.pulsers.push(mesh(hand, sphere(), M.bulb, 101, 72, 10, 8.5, 8.5, 8.5, A)); break;
            }
            case 'joy': { // megaphone. It is not fixed to one hand: she passes it from hand to hand (see draw).
                const g = new THREE.Group(); g.position.set(44, -16, 15); g.rotation.z = 0.38; body.add(g); st.meg = g; st.megT = 0;
                const c = new THREE.Mesh(cone(true), m.accent); c.material = m.accent; c.scale.set(12, 22, 12); c.rotation.z = Math.PI / 2; c.position.x = 4; g.add(c);
                const c2 = new THREE.Mesh(cone(true), m.dark); c2.scale.set(11.4, 21, 11.4); c2.rotation.z = Math.PI / 2; c2.position.x = 4.6; c2.material = new THREE.MeshPhongMaterial({ color: m.dark.color, side: THREE.BackSide }); g.add(c2);
                const hd = new THREE.Mesh(cyl(), m.dark); hd.scale.set(2.4, 6, 2.4); hd.position.set(-7, 0, 0); hd.rotation.z = Math.PI / 2; g.add(hd); break;
            }
            case 'aegis': { // shield in the hand
                const s = new THREE.Shape(); [[0, -9], [12, -5], [12, 3], [6, 11], [0, 14], [-6, 11], [-12, 3], [-12, -5]].forEach((p, i) => s[i ? 'lineTo' : 'moveTo'](p[0], -p[1]));
                const g = G('shieldHand', () => new THREE.ExtrudeGeometry(s, { depth: 3.5, bevelEnabled: true, bevelSize: 0.8, bevelThickness: 0.8, bevelSegments: 2 }));
                const sh = new THREE.Mesh(g, m.dark); sh.position.set(106 - A[0], A[1] - 72, 8); sh.scale.setScalar(0.95); hand.add(sh);
                const face = new THREE.Mesh(g, M.white); face.position.set(106 - A[0], A[1] - 72, 11); face.scale.setScalar(0.7); hand.add(face); break;
            }
            case 'scout': { // magnifying glass
                rod(hand, m.dark, 97, 85, 8, 102, 77, 10, 1.8, A);
                const g = new THREE.Group(); g.position.set(106 - A[0], A[1] - 70, 11); hand.add(g);
                g.add(new THREE.Mesh(torus(8, 1.7, Math.PI * 2), m.dark));
                const l = new THREE.Mesh(cyl(), M.glass); l.scale.set(7.6, 0.8, 7.6); l.rotation.x = Math.PI / 2; g.add(l); break;
            }
        }
    }

    function build(def, variant) {
        const m = mats(def);
        const st = { spinners: [], pulsers: [] };
        const root = new THREE.Group(), body = new THREE.Group(), head = new THREE.Group();
        head.position.set(0, 60 - HEAD[1], 0);
        root.add(head);

        // ---- head
        const shellH = mesh(head, capsule(27, 18), M.shell, 60, 43, 0, 1, 1, 0.92, HEAD); shellH.rotation.z = Math.PI / 2;
        const visor = mesh(head, capsule(16.5, 23), M.visor, 60, 43.5, 20, 1, 1, 0.55, HEAD); visor.rotation.z = Math.PI / 2;
        mesh(head, capsule(5, 9), m.accent, 21.5, 44.5, 0, 1, 1, 1, HEAD);
        mesh(head, capsule(5, 9), m.accent, 98.5, 44.5, 0, 1, 1, 1, HEAD);
        st.eyesN = new THREE.Group(); st.eyesH = new THREE.Group(); head.add(st.eyesN, st.eyesH);
        st.eyeL = mesh(st.eyesN, capsule(4.5, 4), m.glow, 47.5, 43.5, 29.4, 1, 1, 0.3, HEAD);
        st.eyeR = mesh(st.eyesN, capsule(4.5, 4), m.glow, 72.5, 43.5, 29.4, 1, 1, 0.3, HEAD);
        st.arcL = mesh(st.eyesH, torus(5.5, 1.8, Math.PI), m.glow, 47.5, 46.5, 29.6, 1, 1, 0.4, HEAD);
        st.arcR = mesh(st.eyesH, torus(5.5, 1.8, Math.PI), m.glow, 72.5, 46.5, 29.6, 1, 1, 0.4, HEAD);
        const mouth = mesh(head, torus(5, 1, Math.PI), m.glow, 60, 53.2, 29.2, 1, 0.7, 0.4, HEAD); mouth.rotation.z = Math.PI;
        if (def.lash) { rod(head, m.glow, 42, 35, 29, 39, 32, 28, 0.9, HEAD); rod(head, m.glow, 78, 35, 29, 81, 32, 28, 0.9, HEAD); }
        headgear(def, head, m, st);

        // ---- body, hands, thruster, shadow
        if (variant === 'full') {
            root.add(body);
            mesh(body, cyl(), M.neck, 60, 71, 0, 7, 8, 7);
            const L = window.YPT_LOOK, dressed = L && L.hat;
            mesh(body, sphere(), dressed ? lookMats(L).suit : M.shell, 60, 91, 0, 21, 19.5, 18);
            if (dressed) lookBody(L, body);
            const panel = mesh(body, capsule(5.5, 13), m.accent, 60, 87.5, 15.4, 1, 1, 0.5); panel.rotation.z = Math.PI / 2;
            [54.5, 60, 65.5].forEach(x => mesh(body, sphere(), M.white, x, 88, 18.4, 1.4));
            mesh(body, sphere(), M.shell, 28, 94, 8, 7);
            st.hand = new THREE.Group(); st.hand.position.set(ARM[0] - 60, 60 - ARM[1], 5); body.add(st.hand);
            const raised = !/atlas|forge|orca|spark|joy|scout|aegis/.test(def.id);
            st.palm = mesh(st.hand, sphere(), M.shell, raised ? 95 : 94, raised ? 80 : 86, 4, 7, 7, 7, ARM);
            st.waveAmp = raised ? 0.32 : 0.18;
            tools(def, body, st.hand, m, st);
            st.jet = mesh(body, sphere(), m.jet, 60, 113.5, 0, 9, 7, 9);
            st.jetCore = mesh(body, sphere(), m.glow, 60, 112, 0, 4.2, 3.2, 4.2);
            st.shadow = new THREE.Mesh(plane(), shadowMat); st.shadow.position.set(0, 60 - 128, -30); st.shadow.scale.set(66, 16, 1); st.shadow.renderOrder = -1; root.add(st.shadow);
        }
        st.root = root; st.head = head; st.body = body;
        return st;
    }

    // ---------------------------------------------------------------- mounting
    const live = new Set();
    const HOVER = '[data-open],[data-spot],.path,.cast-card,.nav-links a,.more-can,.cast-row';
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.target.__ag3d) e.target.__ag3d.onScreen = e.isIntersecting; }), { rootMargin: '120px' });

    function mount(el) {
        if (el.__ag3d) return;
        const def = AGENTS[el.getAttribute('data-agent')];
        const svg = el.querySelector('svg');
        if (!def || !svg) return;
        const variant = (svg.getAttribute('viewBox') || '').indexOf('10 ') === 0 ? 'head' : 'full';
        let canvas = el.querySelector('canvas.ag3d'); // a cloned agent (fly-out) already carries one
        if (!canvas) { canvas = document.createElement('canvas'); canvas.className = 'ag3d'; el.appendChild(canvas); }
        const a = build(def, variant);
        Object.assign(a, {
            el, canvas, ctx: canvas.getContext('2d'), variant, def, onScreen: true, n: live.size,
            phase: Math.random() * 6.28, yaw: 0, pitch: 0, spin: 0, blink: 2 + Math.random() * 4,
            mood: el.getAttribute('data-mood') || '',
            hoverEl: el.closest(HOVER), promo: el.classList.contains('promo-ag'),
            intro: !!el.closest('.spot-fig') ? 1 : 0, drawn: false
        });
        el.__ag3d = a; live.add(a); io.observe(el);
    }
    function scan(root) {
        if (root.nodeType !== 1) return;
        if (root.matches && root.matches('.ag[data-agent]')) mount(root);
        root.querySelectorAll && root.querySelectorAll('.ag[data-agent]').forEach(mount);
    }
    scan(document.body);
    // a new industry was chosen: every agent is rebuilt in the new clothes
    document.addEventListener('ypt:industry', () => {
        for (const a of live) { a.needle = null; a.meg = null; Object.assign(a, build(a.def, a.variant)); }
    });
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(scan))).observe(document.body, { childList: true, subtree: true });

    // ---------------------------------------------------------------- animation and drawing
    let px = innerWidth / 2, py = innerHeight / 2, frame = 0, last = performance.now(), avg = 0.016, stride = 1;
    addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; }, { passive: true });
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    function draw(a, t, dt) {
        const el = a.el, cw = el.clientWidth;
        if (!cw || el.style.visibility === 'hidden') return;
        const small = cw < 60;
        if (small && a.drawn && (frame + a.n) % 4) return; // tiny avatars do not need every frame
        // On slower devices the larger agents take turns, so the page itself always stays smooth.
        if (!small && a.drawn && stride > 1 && a.spin <= 0 && (frame + a.n) % stride) return;
        const f = FRAME[a.variant];
        const w = Math.min(GL, Math.max(2, Math.round(cw * dpr))), h = Math.min(GL, Math.round(w / f.aspect));
        if (a.canvas.width !== w || a.canvas.height !== h) { a.canvas.width = w; a.canvas.height = h; }

        // Time since THIS agent was last drawn (it may have skipped frames), so spins, turns and
        // hand-overs take the same real time on a slow device as on a fast one.
        dt = Math.min(0.25, t - (a.lastT || t)); a.lastT = t;

        // ---- pose
        const r = el.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height * 0.35);
        const dist = Math.hypot(dx, dy) || 1, k = Math.min(1, dist / 420);
        const ty = REDUCED ? 0 : (dx / dist) * k * 0.62, tp = REDUCED ? 0 : (dy / dist) * k * 0.34;
        a.yaw += (ty - a.yaw) * Math.min(1, dt * 7); a.pitch += (tp - a.pitch) * Math.min(1, dt * 7);
        // (Joy mostly keeps her eyes where she is facing, with only a glance toward the mouse.)
        const glance = a.meg ? 0.3 : 1;
        a.head.rotation.set(a.pitch * glance, a.yaw * glance, 0);
        if (a.variant === 'full') a.body.rotation.y = a.yaw * 0.3 * glance;

        // a full turn in real 3D when the agent is told to spin, flip, or first appears in a takeover
        const wantSpin = el.classList.contains('spin') || el.classList.contains('play');
        if (wantSpin && a.spin <= 0 && !a.spun) { a.spin = 1; a.spun = true; }
        if (!wantSpin) a.spun = false;
        if (a.intro > 0 && a.spin <= 0) { a.spin = 1; a.intro = 0; }
        let turn = 0;
        if (a.spin > 0) { a.spin = Math.max(0, a.spin - dt / 0.85); const e = 1 - a.spin; turn = (1 - Math.pow(1 - e, 3)) * Math.PI * 2; }

        const bob = REDUCED || a.promo ? 0 : Math.sin(t * 1.5 + a.phase) * 2.4;
        a.root.position.y = bob;
        // Joy's stance follows her megaphone: she turns her whole body to face the side she is holding
        // it on. Facing the banner's words on the way out, then turning round at the far end and
        // staying that way until she is home again.
        let stance = 0;
        if (a.meg) { const m = a.megT * a.megT * (3 - 2 * a.megT); stance = 0.6 - 1.2 * m; }
        a.root.rotation.set(0, turn + stance, REDUCED ? 0 : Math.sin(t * 0.9 + a.phase) * 0.035);

        // ---- face
        const hot = a.mood === 'happy' || (a.hoverEl ? a.hoverEl.matches(':hover') : el.matches(':hover')) || !!el.closest('.cur-ag.hot');
        a.eyesH.visible = hot || a.mood === 'wink';
        a.eyesN.visible = !hot;
        if (a.mood === 'wink') { a.arcL.visible = false; a.eyeR.visible = false; a.eyesN.visible = true; }
        a.blink -= dt;
        const closing = a.blink < 0.12 && !REDUCED;
        a.eyesN.scale.y = closing ? 0.12 : 1;
        if (a.blink < 0) a.blink = 3 + Math.random() * 3.5;

        // ---- moving parts
        if (a.variant === 'full') {
            const reach = a.promo && el.closest('.promo-joy.reach');
            a.hand.visible = !reach;
            a.hand.rotation.z = REDUCED ? 0 : Math.sin(t * 2.4 + a.phase) * a.waveAmp;
            const fl = 1 + Math.sin(t * 22 + a.phase) * 0.14;
            a.jet.scale.set(9 * fl, 7 * fl, 9 * fl); a.jetCore.scale.set(4.2 * fl, 3.2 * fl, 4.2 * fl);
            a.shadow.visible = !a.promo;
            a.shadow.position.y = (60 - 128) - bob;
            const sq = 1 - bob * 0.03; a.shadow.scale.set(66 * sq, 16 * sq, 1);
            if (a.needle) a.needle.rotation.z = -0.6 + Math.sin(t * 1.3) * 0.5;
            if (a.meg) {
                // Which hand holds the megaphone: the one nearer the banner's words. When that changes
                // she tosses it across in a little arc, and it turns round to face the other way.
                const want = el.closest('.promo-joy.swap') ? 1 : 0;
                a.megT += Math.max(-dt / 0.55, Math.min(dt / 0.55, want - a.megT));
                const e = a.megT * a.megT * (3 - 2 * a.megT), arc = Math.sin(Math.PI * e);
                const wob = REDUCED ? 0 : Math.sin(t * 2.4 + a.phase) * 2;
                a.meg.position.set(44 - 90 * e, -16 - 8 * e + arc * 30 + wob, 15);
                a.meg.rotation.set(arc * 1.2, Math.PI * e, 0.38);
            }
        }
        for (const s of a.spinners) s.rotation.y = t * 2.2 + a.phase;
        const pu = 1 + Math.sin(t * 3.4 + a.phase) * 0.12;
        for (const p of a.pulsers) { if (!p.userData.base) p.userData.base = p.scale.clone(); p.scale.copy(p.userData.base).multiplyScalar(pu); }

        // ---- render with the shared renderer, then copy into this agent's own canvas
        aim(f);
        holder.add(a.root);
        renderer.setViewport(0, 0, w, h); renderer.setScissor(0, 0, w, h);
        renderer.clear(); renderer.render(scene, camera);
        holder.remove(a.root);
        a.ctx.clearRect(0, 0, w, h);
        a.ctx.drawImage(glCanvas, 0, GL - h, w, h, 0, 0, w, h);
        if (!a.drawn) { a.drawn = true; el.classList.add('is3d'); }
    }

    function loop(now) {
        requestAnimationFrame(loop);
        if (document.hidden) { last = now; return; }
        const dt = Math.min(0.05, (now - last) / 1000); last = now; frame++;
        avg += (dt - avg) * 0.05;
        if (frame % 45 === 0) stride = avg > 0.045 ? 3 : avg > 0.024 ? 2 : 1;
        const t = now / 1000;
        for (const a of live) {
            if (!a.el.isConnected) { live.delete(a); io.unobserve(a.el); continue; }
            if (a.onScreen) draw(a, t, dt);
        }
    }
    requestAnimationFrame(loop);

    // For other 3D scenes on the site (How We Work): build the same agent models, light or full, and a hook to
    // read what a built model offers. The caller owns the animation and the rendering.
    window.YPT_AG3D = {
        THREE,
        build(def, variant, light) { D = light ? 0 : 1; try { return build(def, variant || 'full'); } finally { D = 1; } },
        HEAD, ARM
    };
    document.dispatchEvent(new Event('ypt:ag3d'));
}

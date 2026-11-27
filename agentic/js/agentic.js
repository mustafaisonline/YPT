// YPT — Agentic AI theme (concept). Vanilla JS, no dependencies, fully static.
(function () {
    'use strict';

    var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

    // ------------------------------------------------------------------
    // The cast. One agent per YPT service line. Copy is adapted from the
    // existing YPT pages; "href" points at the existing page for that line.
    // hue = accent, dark = deeper accent, soft = pastel tile, glow = eye colour.
    // ------------------------------------------------------------------
    var AGENTS = [
        {
            skills: ['Strategic alignment', 'Value hypothesis', 'Risk & governance', 'Lifecycle positioning', 'Executive sponsorship'],
            id: 'vera', name: 'Siti', role: 'Discovery Agent', line: 'Value Discovery Canvas™',
            hue: '#f5a524', dark: '#d9820b', soft: '#fdf0d9', glow: '#ffd98a',
            href: 'services/value-discovery-canvas.html',
            can: 'I listen first', gear: 'Headset and clipboard, because she asks the questions and writes down every answer.',
            brief: [
                'I go first. Before any capital is committed, I interview your stakeholders and shape every initiative.',
                'I check five things: strategic alignment, the value hypothesis, risk and governance, lifecycle position, and executive sponsorship.',
                'This is stage 1 of 7: Discover. You walk away with a clear problem statement and a value case.'
            ],
            enables: 'Clarity before cost. You walk away with validated initiatives, not a wish list, and the other agents get a brief they can build from.'
        },
        {
            skills: ['Target architecture', 'Data model & integrations', 'Operating model design', 'Investment prioritization', 'Vendor oversight'],
            id: 'atlas', name: 'Wei', role: 'Architect Agent', line: 'Strategic Advisory',
            hue: '#2457f5', dark: '#1a3fd0', soft: '#e6ecff', glow: '#a9c4ff',
            href: 'strategic-advisory.html',
            can: 'I design the blueprint', gear: 'A compass and a signal beacon, because he turns the brief into a blueprint and keeps everyone on it.',
            brief: [
                'I design the blueprint. Most programs don’t fail on technology; they fail because architecture, data model and investment sequencing don’t line up.',
                'I cover the target architecture, the data model and integrations, the operating model, investment prioritization and vendor oversight.',
                'This is stage 2 of 7: Design. When delivery starts, I stay on to keep every agent and every partner inside the blueprint.'
            ],
            enables: 'A target design, data model and plan you can defend at board level, and a build that stays coherent as it grows.'
        },
        {
            skills: ['Working prototypes', 'Proof of concept', 'AI assistants', 'MVPs in days'],
            id: 'spark', name: 'Aiman', role: 'Pilot Agent', line: 'AI Powered Consulting',
            hue: '#ec4f93', dark: '#cf2f76', soft: '#fde6f0', glow: '#ffb8d6',
            href: 'ai-powered-consulting.html',
            can: 'I make it real, fast', gear: 'A lightning bolt and a bright idea, because he turns ideas into a working pilot fast.',
            brief: [
                'I make it real, fast. I turn the blueprint into a working pilot you can click, test and judge for yourself.',
                'Working prototypes, proofs of concept, AI assistants and MVPs, against success criteria we agree up front.',
                'This is stage 3 of 7: Pilot. Many solutions have a first working version in 24 to 72 hours. I also serve SMEs and growing businesses that need something shipped.'
            ],
            enables: 'Proof before you commit. A working pilot in days, built so it can grow into the production solution.'
        },
        {
            skills: ['Platform modernization', 'Lakehouse & warehouse', 'Governance enablement', 'Analytics acceleration', 'Applied AI use cases'],
            id: 'forge', name: 'Jun', role: 'Builder Agent', line: 'Data & AI Services',
            hue: '#12b3a0', dark: '#0b8f80', soft: '#dff6f1', glow: '#96f0e2',
            href: 'services/data-ai-services.html',
            can: 'I build it for production', gear: 'Hard hat and wrench, because he builds the data model, the database and the pipelines.',
            brief: [
                'I build the foundation the other agents stand on: the data model, the database, the pipelines.',
                'Platform modernization, lakehouse and warehouse, operational governance, analytics people actually adopt, and applied AI use cases.',
                'This is stage 4 of 7: Build. Everything I build sits inside the architecture Wei defined, and the pilot Aiman proved.'
            ],
            enables: 'A governed data foundation your own agents can read from and write to, with the full data lifecycle covered end to end.'
        },
        {
            skills: ['Guardrails', 'Human-in-the-loop', 'Audit trail', 'Compliance & risk', 'Responsible AI oversight'],
            id: 'aegis', name: 'Mei', role: 'Governance Agent', line: 'AI Oversight & Governance',
            hue: '#f2684f', dark: '#d94a31', soft: '#fde5df', glow: '#ffc3b6',
            href: 'services/agentic-ai.html',
            can: 'I keep it safe and accountable', gear: 'A shield, because she keeps every agent inside the rules you set.',
            brief: [
                'I keep it safe and accountable. Before agents act on their own, someone has to decide what they may do alone and what needs a person.',
                'I set the guardrails, the human-in-the-loop checkpoints, the audit trail, and the compliance and risk sign-off.',
                'This is stage 5 of 7: Govern. Nothing important happens without you.'
            ],
            enables: 'A safe, compliant solution, with a full trail of what every agent did and who approved it.'
        }
,
        {
            skills: ['Production release', 'Multi-agent orchestration', 'Monitoring & alerts', 'Cost & drift control', 'RAG & knowledge strategy'],
            id: 'orca', name: 'Farid', role: 'Launch Agent', line: 'Agentic AI',
            hue: '#8257f0', dark: '#6537d6', soft: '#eee8fe', glow: '#cfbcff',
            href: 'services/agentic-ai.html',
            can: 'I take it live and keep it running', gear: 'Twin antennas and a conductor’s baton, because she keeps every agent in time once the solution is live.',
            brief: [
                'I take your solution live and keep it running. Specialized agents across your systems need one conductor, and that’s me.',
                'I handle the production release, the multi-agent orchestration, the monitoring, and the cost and drift control that keeps answers grounded.',
                'This is stage 6 of 7: Launch. Autonomous intelligence, without losing control.'
            ],
            enables: 'A live, monitored solution you can scale across the enterprise without operational blind spots.'
        },
        {
            skills: ['Executive data literacy', 'Governance ownership', 'Modeling discipline', 'Standards alignment'],
            id: 'sage', name: 'Lin', role: 'Enablement Agent', line: 'Trainings',
            hue: '#2faa6e', dark: '#1f8a56', soft: '#e0f5ea', glow: '#a9f0c9',
            href: 'trainings.html',
            can: 'I make your team self-sufficient', gear: 'Graduation cap and book, because she makes sure your people can run what we build.',
            brief: [
                'I make sure your people can run what we build. Transformation fails when internal capability lags behind platform ambition.',
                'Six architect-led programs, from data literacy to Agentic AI and vibe coding.',
                'Executive data literacy, governance ownership, modeling discipline and shared standards.',
                'This is stage 7 of 7: Adopt. Training and handover, so you are never dependent on us.'
            ],
            enables: 'Internal strength instead of permanent consulting reliance. Your team owns the agents; they don’t rent them.'
        }
    ];
    var BY_ID = {};
    AGENTS.forEach(function (a) { BY_ID[a.id] = a; });
    var GUIDE = { id: 'guide', name: 'YPT', hue: '#2457f5', dark: '#1a3fd0', soft: '#e6ecff', glow: '#a9c4ff' };
    BY_ID.guide = GUIDE;
    // Joy fronts offers and announcements. She is not one of the seven service agents.
    BY_ID.joy = { id: 'joy', name: 'Hui', hue: '#ff5fa2', dark: '#e0357f', soft: '#ffe3ef', glow: '#ffd3e6', lash: true };
    // Alya escorts visitors through the "How We Work" building. She is not one of the seven service agents and not Hui.
    BY_ID.alya = { id: 'alya', name: 'Alya', hue: '#14b8a6', dark: '#0b8478', soft: '#d9f6f2', glow: '#a4f0e4', lash: true };

    // ------------------------------------------------------------------
    // Industry looks. The visitor picks an industry and every agent changes into that industry's work
    // clothes: a hat (hat), the colour of the clothes (suit, trim) and one extra detail (detail).
    // "General" keeps the standard look, where each agent wears its own headgear.
    // ------------------------------------------------------------------
    function shade(hex, f) {
        var n = parseInt(String(hex).replace('#', ''), 16), c = function (v) { return Math.max(0, Math.min(255, Math.round(v * f))); };
        return '#' + ((1 << 24) | (c((n >> 16) & 255) << 16) | (c((n >> 8) & 255) << 8) | c(n & 255)).toString(16).slice(1);
    }
    var INDUSTRIES = [
        { id: 'general', short: 'General', name: 'General', hat: '', suit: '', trim: '', detail: '', kit: '' },
        { id: 'banking', short: 'Banking', name: 'Banking & Finance', hat: 'bowler', suit: '#1b2a4e', trim: '#d4af37', detail: 'tie', kit: 'a bowler hat and a tie' },
        { id: 'telecom', short: 'Telecom', name: 'Telecom', hat: 'headset', suit: '#2457f5', trim: '#9fd0ff', detail: 'lanyard', kit: 'a headset and a staff lanyard' },
        { id: 'healthcare', short: 'Healthcare', name: 'Healthcare', hat: 'surgcap', suit: '#eaf7f6', trim: '#12b3a0', detail: 'stethoscope', kit: 'a scrub cap and a stethoscope' },
        { id: 'agriculture', short: 'Farming', name: 'Agriculture', hat: 'straw', suit: '#5f8a3a', trim: '#e8c35a', detail: 'straps', kit: 'a straw hat and overalls' },
        { id: 'defence', short: 'Defence', name: 'Defence', hat: 'helmet', suit: '#59693d', trim: '#e0c565', detail: 'epaulette', kit: 'a field helmet and shoulder boards' },
        { id: 'retail', short: 'Retail', name: 'Retail', hat: 'cap', suit: '#e8553d', trim: '#ffffff', detail: 'apron', kit: 'a store cap and an apron' },
        { id: 'energy', short: 'Energy', name: 'Energy & Utilities', hat: 'hardhat', suit: '#f5a50f', trim: '#f2f5ff', detail: 'stripe', kit: 'a hard hat and a hi-vis band' },
        { id: 'education', short: 'Education', name: 'Education', hat: 'mortar', suit: '#3b2a6b', trim: '#f5a524', detail: 'tassel', kit: 'a mortarboard and a gown' },
        { id: 'government', short: 'Government', name: 'Government', hat: 'peaked', suit: '#22314f', trim: '#d8b04a', detail: 'badge', kit: 'a peaked cap and an ID badge' },
        { id: 'airlines', short: 'Airlines', name: 'Airlines & Aviation', hat: 'peaked', suit: '#1c3f7a', trim: '#e8c35a', detail: 'wings', kit: 'a pilot cap and wings' },
        { id: 'insurance', short: 'Insurance', name: 'Insurance', hat: 'fedora', suit: '#0e6b6b', trim: '#f5a524', detail: 'badge', kit: 'a fedora and a shield pin' },
        { id: 'manufacturing', short: 'Manufacturing', name: 'Manufacturing', hat: 'hardhat', suit: '#2f6fb3', trim: '#ffd23f', detail: 'straps', kit: 'a hard hat and work overalls' },
        { id: 'logistics', short: 'Logistics', name: 'Logistics & Transport', hat: 'cap', suit: '#f08a1c', trim: '#1b2a4e', detail: 'vest', kit: 'a driver cap and a hi-vis vest' },
        { id: 'maritime', short: 'Maritime', name: 'Maritime & Shipping', hat: 'peaked', suit: '#14325c', trim: '#ffffff', detail: 'epaulette', kit: 'a captain’s cap and shoulder boards' },
        { id: 'hospitality', short: 'Hospitality', name: 'Hospitality & Travel', hat: 'bellcap', suit: '#7a1f3d', trim: '#d4af37', detail: 'bowtie', kit: 'a bellhop cap and a bow tie' },
        { id: 'construction', short: 'Real Estate', name: 'Real Estate & Construction', hat: 'hardhat', suit: '#eef1f7', trim: '#e8553d', detail: 'lanyard', kit: 'a white hard hat and a site pass' },
        { id: 'media', short: 'Media', name: 'Media & Entertainment', hat: 'beret', suit: '#2b2b3a', trim: '#ec4f93', detail: 'lanyard', kit: 'a beret and a press pass' },
        { id: 'technology', short: 'Technology', name: 'Technology & Software', hat: 'beanie', suit: '#14203d', trim: '#6ee7b7', detail: 'lanyard', kit: 'a beanie and a badge' },
        { id: 'pharma', short: 'Pharma', name: 'Pharma & Life Sciences', hat: 'goggles', suit: '#f4f8ff', trim: '#2457f5', detail: 'badge', kit: 'lab goggles and a lab coat' }
    ];
    var LOOKS = {}; INDUSTRIES.forEach(function (i) { LOOKS[i.id] = i; });
    var KEY = 'ypt-industry', storedIndustry = '';
    try { storedIndustry = localStorage.getItem(KEY) || ''; } catch (e) {}
    window.YPT_INDUSTRIES = INDUSTRIES;
    var GENERIC = !!(document.body && document.body.hasAttribute('data-generic')); // pages like How We Work always use the standard look
    window.YPT_LOOK = (GENERIC ? LOOKS.general : LOOKS[storedIndustry]) || LOOKS.general; // read by js/agents3d.js

    // ------------------------------------------------------------------
    // Character drawing. Every agent shares one body (so they read as a
    // team) and differs by colour, headgear and the tool it carries.
    // Drawn on a 120 x 138 canvas; "head" crops to a head-and-shoulders avatar.
    // ------------------------------------------------------------------
    var uid = 0;
    var STEEL = '#9aa6c4', EDGE = '#cbd3ea';

    function headgear(a, ac) {
        switch (a.id) {
            case 'vera': // headset + mic
                return '<path d="M22 42a38 38 0 0 1 76 0" fill="none" stroke="url(#' + ac + ')" stroke-width="5" stroke-linecap="round"/>' +
                    '<path d="M21 54q0 15 15 16" fill="none" stroke="' + STEEL + '" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<circle cx="38" cy="70" r="3.4" fill="' + a.hue + '"/>';
            case 'atlas': // beacon
                return '<path d="M60 16V6" stroke="' + STEEL + '" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<path class="ag-pulse" d="M60-5l6 6-6 6-6-6z" fill="url(#' + ac + ')"/>';
            case 'forge': // hard hat
                return '<path d="M28 24q0-21 32-21q32 0 32 21z" fill="url(#' + ac + ')"/>' +
                    '<rect x="55" y="1" width="10" height="23" rx="5" fill="' + a.dark + '" opacity=".5"/>' +
                    '<path d="M35 16q7-9 18-10.500" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.600" stroke-linecap="round"/>' +
                    '<rect x="22" y="21" width="76" height="7" rx="3.500" fill="' + a.dark + '"/><rect x="26" y="22" width="68" height="2" rx="1" fill="#fff" opacity=".28"/>';
            case 'orca': // twin antennas
                return '<path d="M45 17L39 5M75 17l6-12" stroke="' + STEEL + '" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<circle class="ag-pulse" cx="38" cy="3" r="4.5" fill="url(#' + ac + ')"/>' +
                    '<circle class="ag-pulse" cx="82" cy="3" r="4.5" fill="url(#' + ac + ')"/>';
            case 'spark': // lightning bolt
                return '<path d="M64-7L52 8h8l-4 9 13-14h-8z" fill="url(#' + ac + ')" stroke="' + a.dark + '" stroke-width="1" stroke-linejoin="round"/>';
            case 'sage': // mortarboard
                return '<path d="M41 14h38v9q-19 7-38 0z" fill="' + a.dark + '"/>' +
                    '<path d="M60 1l36 11-36 11-36-11z" fill="url(#' + ac + ')"/><path d="M60 3.500l26 8-26 3-26-3z" fill="#fff" opacity=".2"/>' +
                    '<path d="M90 12v13" stroke="#f5a524" stroke-width="2" stroke-linecap="round"/><circle cx="90" cy="27" r="2.6" fill="#f5a524"/>';
            case 'joy': // bow
                return '<path d="M74 13l15-9v18zM74 13l-15-9v18z" fill="url(#' + ac + ')" stroke="' + a.dark + '" stroke-width="1" stroke-linejoin="round"/>' +
                    '<circle cx="74" cy="13" r="4.5" fill="' + a.dark + '"/>';
            case 'aegis': // shield crest
                return '<path d="M60 16V9" stroke="' + STEEL + '" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<path d="M60-9l12 4v8q0 8-12 12q-12-4-12-12v-8z" fill="url(#' + ac + ')" stroke="' + a.dark + '" stroke-width="1" stroke-linejoin="round"/>' +
                    '<path d="M54 2l4 4 8-8" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>';
            case 'scout': // radar dish
                return '<path d="M60 16V8" stroke="' + STEEL + '" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<g transform="rotate(-24 60 5)"><path d="M48 3a12 12 0 0 0 24 0z" fill="url(#' + ac + ')"/>' +
                    '<path d="M60 3V-4" stroke="' + a.dark + '" stroke-width="2" stroke-linecap="round"/><circle class="ag-pulse" cx="60" cy="-6" r="2.4" fill="' + a.dark + '"/></g>';
            default:
                return '<path d="M60 16V7" stroke="' + STEEL + '" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<circle class="ag-pulse" cx="60" cy="4" r="4.5" fill="url(#' + ac + ')"/>';
        }
    }

    // Tool held in the left hand (drawn under the hand) or the right hand (moves with the wave).
    function leftTool(a) {
        if (a.id === 'vera') return '<g transform="rotate(-8 18 96)"><rect x="8" y="84" width="19" height="24" rx="3" fill="#fff" stroke="' + EDGE + '" stroke-width="1.5"/>' +
            '<rect x="13" y="81.5" width="9" height="5" rx="2" fill="' + a.hue + '"/>' +
            '<path d="M12 93h11M12 98h11M12 103h7" stroke="' + EDGE + '" stroke-width="1.6" stroke-linecap="round"/></g>';
        if (a.id === 'sage') return '<g transform="rotate(-10 17 94)"><rect x="7" y="84" width="21" height="17" rx="2.5" fill="' + a.hue + '"/>' +
            '<rect x="10" y="86.5" width="15" height="12" rx="1.2" fill="#fff"/><path d="M17.5 86.5v12" stroke="' + a.hue + '" stroke-width="1.4"/></g>';
        return '';
    }
    function rightTool(a) {
        switch (a.id) {
            case 'atlas': return '<circle cx="101" cy="74" r="10" fill="#fff" stroke="' + a.hue + '" stroke-width="2.8"/>' +
                '<path d="M101 67l3 7-3 7-3-7z" fill="' + a.hue + '" transform="rotate(35 101 74)"/><circle cx="101" cy="74" r="1.4" fill="#fff"/>';
            case 'forge': return '<g transform="rotate(32 99 80)"><rect x="96.5" y="68" width="5" height="20" rx="2.5" fill="' + STEEL + '"/>' +
                '<path d="M92 63a7 7 0 1 0 14 0h-4.2v4.6h-5.6V63z" fill="' + STEEL + '"/></g>';
            case 'orca': return '<path d="M96 84L111 60" stroke="#474e63" stroke-width="2.6" stroke-linecap="round"/>' +
                '<path class="ag-pulse" d="M112 50l2 5.2 5.2 2-5.2 2-2 5.2-2-5.2-5.2-2 5.2-2z" fill="' + a.hue + '"/>';
            case 'spark': return '<rect x="97.5" y="80" width="7" height="5" rx="1.5" fill="' + STEEL + '"/>' +
                '<circle cx="101" cy="72" r="8.500" fill="#ffe27a" stroke="#f5a524" stroke-width="1.800"/><circle cx="98" cy="68.500" r="2.400" fill="#fff" opacity=".9"/>' +
                '<path d="M98 72l3-3 3 3" fill="none" stroke="#f5a524" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';
            case 'joy': return '<g transform="rotate(-22 100 76)"><path d="M95 72h6l13-8v24l-13-8h-6z" fill="' + a.hue + '" stroke="' + a.dark + '" stroke-width="1.2" stroke-linejoin="round"/>' +
                '<path d="M118 70l4-2M119 76h5M118 82l4 2" stroke="' + a.dark + '" stroke-width="1.8" stroke-linecap="round"/></g>';
            case 'aegis': return '<path d="M106 62l13 4v10q0 10-13 15q-13-5-13-15V66z" fill="#fff" stroke="' + a.dark + '" stroke-width="3" stroke-linejoin="round"/>' +
                '<path d="M100 76l4 4 8-9" fill="none" stroke="' + a.hue + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
            case 'scout': return '<path d="M97 84l5-7" stroke="' + a.dark + '" stroke-width="3.6" stroke-linecap="round"/>' +
                '<circle cx="106" cy="70" r="8" fill="rgba(255,255,255,.75)" stroke="' + a.dark + '" stroke-width="3"/>' +
                '<path d="M102 68q3-3 6-1" fill="none" stroke="' + a.hue + '" stroke-width="1.5" stroke-linecap="round"/>';
            default: return '';
        }
    }

    // The industry hat, drawn on the head (the 3D version is in js/agents3d.js).
    function hatSVG(L, su) {
        var S = 'url(#' + su + ')', D = shade(L.suit, 0.6), T = L.trim, ln = ' stroke="rgba(15,23,48,.35)" stroke-width=".8"';
        var gloss = '<ellipse cx="46" cy="9" rx="10" ry="3" fill="#fff" opacity=".35" transform="rotate(-14 46 9)"/>';
        switch (L.hat) {
            case 'bowler': return '<path d="M32 23q0-21 28-21t28 21z" fill="' + S + '"' + ln + '/><rect x="31" y="17" width="58" height="5" fill="' + T + '"/><rect x="24" y="21" width="72" height="6" rx="3" fill="' + D + '"/>' + gloss;
            case 'headset': return '<path d="M22 42a38 38 0 0 1 76 0" fill="none" stroke="' + T + '" stroke-width="5" stroke-linecap="round"/><path d="M21 54q0 15 15 16" fill="none" stroke="' + STEEL + '" stroke-width="2.5" stroke-linecap="round"/><circle cx="38" cy="70" r="3.6" fill="' + L.suit + '"/>';
            case 'surgcap': return '<path d="M25 27q0-26 35-26t35 26q-35-7-70 0z" fill="' + S + '" stroke="#b9cbe0" stroke-width="1"/><path d="M60 8.500v11M54.500 14h11" stroke="' + T + '" stroke-width="4.500" stroke-linecap="round"/>';
            case 'straw': return '<ellipse cx="60" cy="23" rx="50" ry="9" fill="' + shade(T, 0.9) + '"' + ln + '/><path d="M36 23q0-21 24-21t24 21z" fill="' + T + '"' + ln + '/><path d="M36 17h48v5H36z" fill="' + L.suit + '"/>' + gloss;
            case 'helmet': return '<path d="M24 28q0-27 36-27t36 27z" fill="' + S + '"' + ln + '/><rect x="21" y="25" width="78" height="7" rx="3.500" fill="' + D + '"/><path d="M60 7l2.500 5.200 5.700.7-4.200 3.900 1.100 5.600-5.100-2.800-5.100 2.800 1.100-5.600-4.200-3.900 5.700-.7z" fill="' + T + '"/>';
            case 'cap': return '<path d="M30 24q0-21 30-21t30 21z" fill="' + S + '"' + ln + '/><ellipse cx="60" cy="26" rx="36" ry="5.500" fill="' + D + '"/><circle cx="60" cy="3.500" r="3" fill="' + T + '"/><rect x="51" y="11" width="18" height="8" rx="3" fill="' + T + '"/>';
            case 'hardhat': return '<path d="M28 24q0-21 32-21q32 0 32 21z" fill="' + S + '"' + ln + '/><rect x="55" y="1" width="10" height="23" rx="5" fill="' + D + '" opacity=".5"/><rect x="22" y="21" width="76" height="7" rx="3.500" fill="' + D + '"/>' + gloss;
            case 'mortar': return '<path d="M41 14h38v9q-19 7-38 0z" fill="' + D + '"/><path d="M60 1l36 11-36 11-36-11z" fill="' + S + '"/><path d="M60 3.500l26 8-26 3-26-3z" fill="#fff" opacity=".2"/><path d="M90 12v13" stroke="' + T + '" stroke-width="2" stroke-linecap="round"/><circle cx="90" cy="27" r="2.600" fill="' + T + '"/>';
            case 'peaked': return '<path d="M30 25q0-23 30-23t30 23z" fill="' + S + '"' + ln + '/><rect x="29" y="19" width="62" height="7" fill="' + D + '"/><circle cx="60" cy="22.500" r="3.600" fill="' + T + '"/><ellipse cx="60" cy="27" rx="27" ry="3.500" fill="' + shade(L.suit, 0.45) + '"/>';
            case 'fedora': return '<ellipse cx="60" cy="24" rx="44" ry="7" fill="' + D + '"' + ln + '/><path d="M36 24q0-22 24-22t24 22z" fill="' + S + '"' + ln + '/><path d="M36 18h48v5H36z" fill="' + T + '"/><path d="M50 4q10 6 20 0" fill="none" stroke="' + D + '" stroke-width="2.200" stroke-linecap="round"/>' + gloss;
            case 'bellcap': return '<path d="M34 25q0-17 26-17t26 17z" fill="' + S + '"' + ln + '/><ellipse cx="60" cy="25.500" rx="26" ry="4" fill="' + D + '"/><path d="M42 20h36" stroke="' + T + '" stroke-width="3"/><circle cx="60" cy="14" r="3.200" fill="' + T + '"/><path d="M82 26q4 8 2 16" fill="none" stroke="' + T + '" stroke-width="2" stroke-linecap="round"/>';
            case 'beret': return '<ellipse cx="66" cy="14" rx="32" ry="13" fill="' + S + '"' + ln + ' transform="rotate(-8 66 14)"/><path d="M36 22q24 6 50-2v5q-26 8-50 2z" fill="' + D + '"/><circle cx="58" cy="3" r="2.600" fill="' + T + '"/>';
            case 'beanie': return '<path d="M30 28q0-26 30-26t30 26z" fill="' + S + '"' + ln + '/><rect x="26" y="21" width="68" height="9" rx="4.500" fill="' + D + '"/><path d="M34 24h52M34 27h52" stroke="' + T + '" stroke-width="1.200" opacity=".7"/><circle cx="60" cy="1" r="5" fill="' + T + '"/>';
            case 'goggles': return '<path d="M30 28q0-22 30-22t30 22z" fill="' + S + '"' + ln + '/><rect x="27" y="21" width="66" height="6" rx="3" fill="' + T + '"/><rect x="36" y="9" width="20" height="12" rx="6" fill="rgba(160,205,255,.55)" stroke="' + T + '" stroke-width="2"/><rect x="64" y="9" width="20" height="12" rx="6" fill="rgba(160,205,255,.55)" stroke="' + T + '" stroke-width="2"/><path d="M56 15h8" stroke="' + T + '" stroke-width="2.400"/>';
        }
        return '';
    }
    // The industry clothes, drawn over the torso.
    function suitSVG(L, su) {
        var T = L.trim, D = shade(L.suit, 0.6);
        var out = '<path d="M39 81q0-9 9-9h24q9 0 9 9v7q0 22-21 22T39 88z" fill="url(#' + su + ')"/>';
        switch (L.detail) {
            case 'tie': out += '<path d="M49 73l11 9 11-9-3-2.500H52z" fill="#fff"/><path d="M57.500 77h5l1.500 5-4 12-4-12z" fill="' + T + '"/>'; break;
            case 'lanyard': out += '<path d="M50 73q10 22 20 0" fill="none" stroke="' + T + '" stroke-width="2"/><rect x="56" y="95" width="8" height="10" rx="1.500" fill="#fff" stroke="' + T + '" stroke-width="1"/>'; break;
            case 'stethoscope': out += '<path d="M49 72.500q-1 17 11 19q12-2 11-19" fill="none" stroke="#3a4258" stroke-width="2" stroke-linecap="round"/><circle cx="60" cy="93" r="3" fill="#9aa6c4" stroke="#3a4258" stroke-width="1"/>'; break;
            case 'straps': out += '<rect x="46" y="73" width="5" height="32" fill="' + D + '"/><rect x="69" y="73" width="5" height="32" fill="' + D + '"/><circle cx="48.500" cy="97" r="1.700" fill="' + T + '"/><circle cx="71.500" cy="97" r="1.700" fill="' + T + '"/>'; break;
            case 'epaulette': out += '<rect x="40" y="75" width="10" height="4" rx="1" fill="' + T + '" transform="rotate(-25 45 77)"/><rect x="70" y="75" width="10" height="4" rx="1" fill="' + T + '" transform="rotate(25 75 77)"/>'; break;
            case 'apron': out += '<path d="M50 73l-1 28q11 5 22 0l-1-28" fill="none" stroke="' + T + '" stroke-width="1.600"/><rect x="50" y="96" width="20" height="8" rx="2" fill="' + T + '" opacity=".95"/>'; break;
            case 'stripe': out += '<path d="M39.500 94q20.500 9 41 0v4.500q-20.500 9-41 0z" fill="' + T + '"/>'; break;
            case 'tassel': out += '<rect x="58.500" y="73" width="3" height="36" fill="' + T + '" opacity=".9"/>'; break;
            case 'badge': out += '<circle cx="48" cy="82" r="3.200" fill="' + T + '" stroke="#fff" stroke-width=".8"/>'; break;
            case 'wings': out += '<path d="M60 78l-17-3q4 8 17 9q13-1 17-9z" fill="' + T + '" stroke="#fff" stroke-width=".6"/><circle cx="60" cy="79" r="2.400" fill="#fff"/>'; break;
            case 'bowtie': out += '<path d="M60 76l-9-4v8zM60 76l9-4v8z" fill="' + T + '"/><circle cx="60" cy="76" r="2.200" fill="#fff"/>'; break;
            case 'vest': out += '<rect x="48" y="73" width="5" height="34" fill="' + T + '"/><rect x="67" y="73" width="5" height="34" fill="' + T + '"/><path d="M39.500 94q20.500 9 41 0v3q-20.500 9-41 0z" fill="#fff" opacity=".85"/>'; break;
        }
        return out;
    }

    // 3D look: every surface is shaded as a rounded solid lit from the upper left. Shells and coloured
    // parts use radial gradients (bright core, darker rim), with a specular highlight on top, a shaded
    // underside, contact shadows where parts meet, a glossy visor, glowing eyes and a soft ground shadow.
    // It is all gradients, no blur filters, so dozens of animated agents stay smooth.
    function agentSVG(a, o) {
        o = o || {};
        var n = ++uid, sh = 'sh' + n, ac = 'ac' + n, vz = 'vz' + n, gs = 'gs' + n, eg = 'eg' + n, ey = 'ey' + n, jt = 'jt' + n;
        var RIM = '#96a4c9', SHADE = '#55659f';
        var L = o.look || window.YPT_LOOK || {}, suitOn = !!L.hat, su = 'su' + n;
        var handRaised = !rightTool(a); // empty right hand waves a little higher
        var glow = '<ellipse cx="47.5" cy="43.5" rx="10" ry="11" fill="url(#' + eg + ')"/><ellipse cx="72.5" cy="43.5" rx="10" ry="11" fill="url(#' + eg + ')"/>';
        var eyeL = '<rect class="ag-eye" x="43" y="37" width="9" height="13" rx="4.5" fill="url(#' + ey + ')"/>';
        var eyeR = '<rect class="ag-eye" x="68" y="37" width="9" height="13" rx="4.5" fill="url(#' + ey + ')"/>';
        var arcL = '<path d="M42 46q5.5-8 11 0" fill="none" stroke="' + a.glow + '" stroke-width="3.6" stroke-linecap="round"/>';
        var arcR = '<path d="M67 46q5.5-8 11 0" fill="none" stroke="' + a.glow + '" stroke-width="3.6" stroke-linecap="round"/>';
        var eyes;
        if (o.mood === 'happy') eyes = '<g class="ag-eyes">' + glow + arcL + arcR + '</g>';
        else if (o.mood === 'wink') eyes = '<g class="ag-eyes">' + glow + eyeL + arcR + '</g>';
        else eyes = '<g class="ag-eyes">' + glow + '<g class="ag-eyes-n">' + eyeL + eyeR + '</g><g class="ag-eyes-h">' + arcL + arcR + '</g></g>';

        var head =
            // ear pods
            '<rect x="17" y="35" width="10" height="19" rx="5" fill="url(#' + ac + ')"/><rect x="93" y="35" width="10" height="19" rx="5" fill="url(#' + ac + ')"/>' +
            '<rect x="19" y="37.5" width="2.6" height="8" rx="1.3" fill="#fff" opacity=".5"/><rect x="95" y="37.5" width="2.6" height="8" rx="1.3" fill="#fff" opacity=".5"/>' +
            // head shell, shaded underside, specular highlight
            '<rect x="24" y="16" width="72" height="54" rx="25" fill="url(#' + sh + ')" stroke="' + RIM + '" stroke-width="1"/>' +
            '<path d="M24.800 46Q60 67 95.200 46V45Q95 70 71 70H49Q25 70 24.800 45z" fill="' + SHADE + '" opacity=".15"/>' +
            '<ellipse cx="45" cy="22.500" rx="15" ry="4.600" fill="#fff" opacity=".95" transform="rotate(-13 45 22.500)"/>' +
            '<circle cx="65" cy="20.300" r="1.900" fill="#fff" opacity=".85"/>' +
            // visor: deep glass, gloss sweep, rim light along the bottom edge
            '<rect x="32" y="27" width="56" height="33" rx="16" fill="url(#' + vz + ')" stroke="#070b1c" stroke-width="1"/>' +
            '<path d="M35.500 38q2-8.500 13.500-8.500h20q-21 1.500-29.500 12.500z" fill="#fff" opacity=".17"/>' +
            '<path d="M41 58.300q19 2.600 38 0" fill="none" stroke="#8fa3e6" stroke-opacity=".55" stroke-width="1.200" stroke-linecap="round"/>' +
            eyes +
            (a.lash ? '<path d="M42 35l-3-3M46 33.500l-1-3.500M78 35l3-3M74 33.500l1-3.500" fill="none" stroke="' + a.glow + '" stroke-width="1.800" stroke-linecap="round"/>' : '') +
            '<path d="M55 54q5 3.600 10 0" fill="none" stroke="' + a.glow + '" stroke-width="2" stroke-linecap="round"/>' +
            (suitOn ? hatSVG(L, su) : headgear(a, ac));

        var body = '';
        if (!o.head) {
            var hx = handRaised ? 95 : 94, hy = handRaised ? 80 : 86;
            body =
                '<ellipse class="ag-jet" cx="60" cy="114" rx="11" ry="8" fill="url(#' + jt + ')"/>' +
                '<ellipse class="ag-jet" cx="60" cy="112" rx="4.500" ry="3.400" fill="#fff" opacity=".9"/>' +
                '<rect x="53" y="67" width="14" height="8" rx="2" fill="#9fabcf"/>' +
                // torso shell, contact shadow under the head, shaded underside, highlight
                '<path d="M39 81q0-9 9-9h24q9 0 9 9v7q0 22-21 22T39 88z" fill="url(#' + sh + ')" stroke="' + RIM + '" stroke-width="1"/>' +
                (suitOn ? suitSVG(L, su) : '') +
                '<ellipse cx="60" cy="74.600" rx="15.500" ry="3.800" fill="#3f4d80" opacity=".3"/>' +
                '<path d="M40.500 94q19.500 11 39 0q-3.500 16-19.500 16t-19.500-16z" fill="' + SHADE + '" opacity=".17"/>' +
                '<ellipse cx="46.600" cy="84" rx="2.600" ry="6" fill="#fff" opacity=".9" transform="rotate(12 46.600 84)"/>' +
                // chest panel with a gloss strip
                '<rect x="48" y="82" width="24" height="11" rx="5.500" fill="url(#' + ac + ')" stroke="' + a.dark + '" stroke-width=".600"/>' +
                '<rect x="51" y="83.400" width="18" height="2.600" rx="1.300" fill="#fff" opacity=".4"/>' +
                '<circle cx="54.500" cy="88.300" r="1.500" fill="#fff"/><circle cx="60" cy="88.300" r="1.500" fill="#fff"/><circle cx="65.500" cy="88.300" r="1.500" fill="#fff"/>' +
                leftTool(a) +
                '<circle cx="28" cy="94" r="7" fill="url(#' + sh + ')" stroke="' + RIM + '" stroke-width="1"/><circle cx="25.800" cy="91.400" r="2" fill="#fff" opacity=".95"/>' +
                '<g class="ag-hand-r">' + rightTool(a) +
                '<circle cx="' + hx + '" cy="' + hy + '" r="7" fill="url(#' + sh + ')" stroke="' + RIM + '" stroke-width="1"/>' +
                '<circle cx="' + (hx - 2.2) + '" cy="' + (hy - 2.6) + '" r="2" fill="#fff" opacity=".95"/></g>';
        }
        var stop = function (off, col, op) { return '<stop offset="' + off + '" stop-color="' + col + '"' + (op == null ? '' : ' stop-opacity="' + op + '"') + '/>'; };
        return '<svg viewBox="' + (o.head ? '10 -10 100 88' : '0 -10 124 142') + '" aria-hidden="true" focusable="false" style="--d:-' + ((n * 0.7) % 4).toFixed(1) + 's">' +
            '<defs>' +
            (suitOn ? '<radialGradient id="' + su + '" cx=".36" cy=".22" r=".92">' + stop(0, shade(L.suit, 1.4)) + stop(0.55, L.suit) + stop(1, shade(L.suit, 0.6)) + '</radialGradient>' : '') +
            '<radialGradient id="' + sh + '" cx=".36" cy=".22" r=".92">' + stop(0, '#ffffff') + stop(0.4, '#eef2fb') + stop(0.78, '#c5cfe9') + stop(1, '#9dabd0') + '</radialGradient>' +
            '<radialGradient id="' + ac + '" cx=".34" cy=".2" r=".95">' + stop(0, a.glow) + stop(0.36, a.hue) + stop(1, a.dark) + '</radialGradient>' +
            '<radialGradient id="' + vz + '" cx=".5" cy=".16" r=".98">' + stop(0, '#34477f') + stop(0.5, '#131c3c') + stop(1, '#04071a') + '</radialGradient>' +
            '<radialGradient id="' + gs + '">' + stop(0, '#131f47', 0.5) + stop(0.55, '#131f47', 0.2) + stop(1, '#131f47', 0) + '</radialGradient>' +
            '<radialGradient id="' + eg + '">' + stop(0, a.glow, 0.7) + stop(1, a.glow, 0) + '</radialGradient>' +
            '<linearGradient id="' + ey + '" x1="0" y1="0" x2="0" y2="1">' + stop(0, '#ffffff') + stop(0.55, a.glow) + stop(1, a.glow) + '</linearGradient>' +
            '<radialGradient id="' + jt + '">' + stop(0, a.glow, 0.95) + stop(0.5, a.hue, 0.55) + stop(1, a.hue, 0) + '</radialGradient>' +
            '</defs>' +
            (o.head ? '' : '<ellipse class="ag-shadow" cx="60" cy="127.500" rx="31" ry="6.500" fill="url(#' + gs + ')"/>') +
            '<g class="ag-fig">' + body + head + '</g></svg>';
    }
    function agentEl(a, o) { return '<span class="ag" data-agent="' + a.id + '"' + (o && o.mood ? ' data-mood="' + o.mood + '"' : '') + '>' + agentSVG(a, o) + '</span>'; }
    window.YPT_AGENTS = BY_ID; // read by js/agents3d.js, which upgrades each drawing to a real 3D model
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

    // Fill static placeholders: <span data-ag="vera" data-v="head" data-mood="happy"></span>
    $$('[data-ag]').forEach(function (el) {
        var a = BY_ID[el.getAttribute('data-ag')];
        if (a) { el.classList.add('ag'); el.setAttribute('data-agent', a.id); el.innerHTML = agentSVG(a, { head: el.getAttribute('data-v') === 'head', mood: el.getAttribute('data-mood') }); }
    });

    // ------------------------------------------------------------------
    // Hero field: agents flying around "your solution"
    // ------------------------------------------------------------------
    var field = $('#field');
    if (field) {
        var POS = { vera: [50, 10], atlas: [83, 24], spark: [91, 69], forge: [73, 91], aegis: [31, 91], orca: [7, 68], sage: [17, 23] }; /* clockwise from the top: stage 1 to 7 */
        var CHIPS = [['Requirements interview', 24, 38], ['Data model', 78, 41], ['Guardrails', 40, 77], ['Human-in-the-loop', 68, 5]];
        var html = '<svg class="links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">';
        AGENTS.forEach(function (a) { html += '<line x1="50" y1="50" x2="' + POS[a.id][0] + '" y2="' + POS[a.id][1] + '"/>'; });
        html += '</svg>';
        CHIPS.forEach(function (c, i) {
            html += '<div class="fly" data-depth="' + (0.5 + (i % 3) * 0.3) + '" style="left:' + c[1] + '%;top:' + c[2] + '%">' +
                '<div class="chip" style="--dur:' + (8 + i * 1.3) + 's;--delay:-' + (i * 1.7) + 's">' + c[0] + '</div></div>';
        });
        var ICONS = {
            db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
            chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
            shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
            flow: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 6h10M6 8l5 8M18 8l-5 8"/>',
            chart: '<path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6"/>',
            code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12"/>'
        };
        [['chat', 36, 25, '#fdf0d9', '#d9820b'], ['db', 64, 28, '#dff6f1', '#0b8f80'], ['shield', 68, 72, '#eee8fe', '#6537d6'],
         ['flow', 97, 38, '#e6ecff', '#1a3fd0'], ['chart', 3, 82, '#fde5df', '#d94a31'], ['code', 99, 88, '#fde6f0', '#cf2f76']].forEach(function (t, i) {
            html += '<div class="fly" data-depth="' + (0.7 + (i % 3) * 0.4) + '" style="left:' + t[1] + '%;top:' + t[2] + '%">' +
                '<div class="tool" style="background:' + t[3] + ';color:' + t[4] + ';--dur:' + (7 + i * 1.1) + 's;--delay:-' + (i * 1.3) + 's">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[t[0]] + '</svg></div></div>';
        });
        /* Sam: a flat, head-and-shoulders portrait. To use a designer's artwork instead, swap this string for '<img src="..." alt="">'. */
        var ARMAN = '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
            '<path d="M6 64q0-18 16-21h20q16 3 16 21z" fill="#16224a"/>' +
            '<path d="M25 43l7 9 7-9z" fill="#fff"/><path d="M29.500 44h5l-2.500 7z" fill="#2457f5"/>' +
            '<rect x="27" y="35" width="10" height="11" rx="4" fill="#d9a07c"/>' +
            '<ellipse cx="32" cy="26" rx="13" ry="14.500" fill="#f0bd96"/>' +
            '<path d="M18.500 25q-3-18 13.500-18t13.500 18q-2-8-6-10-8 2-21 10z" fill="#1f1512"/>' +
            '<path d="M27.500 33q4.500-2 9 0-4.500 1.800-9 0z" fill="#1f1512"/>' +
            '<path d="M28 36.500q4 1.500 8 0 .5 7-4 7.500-4.500-.5-4-7.500z" fill="#1f1512"/>' +
            '<circle cx="27" cy="26.500" r="1.700" fill="#1f1512"/><circle cx="37" cy="26.500" r="1.700" fill="#1f1512"/>' +
            '<path d="M29 35.500q3 2 6 0" fill="none" stroke="#f0bd96" stroke-width="1.400" stroke-linecap="round"/>' +
            '</svg>';
        html += '<div class="core"><div class="core-who"><span class="core-av" aria-hidden="true">' + ARMAN + '</span>' +
            '<span class="core-name"><b>SAM (FDE)</b><small>Forward Deployed Engineer</small></span></div>' +
            '<span class="core-sub">I\u2019m your HUMAN Lead</span>' +
            '<span class="core-ask"><span id="core-type"></span><i class="caret"></i>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></span></div>';
        AGENTS.forEach(function (a, i) {
            html += '<div class="fly" data-depth="' + (1 + (i % 3) * 0.5) + '" style="left:' + POS[a.id][0] + '%;top:' + POS[a.id][1] + '%">' +
                '<button class="fly-ag" data-spot="' + a.id + '" aria-label="Meet ' + a.name + ', the ' + a.role + '">' +
                agentEl(a) +
                '<span class="tag"><i class="stg">' + (i + 1) + '</i>' + a.name + ' <b>· ' + a.role.replace(' Agent', '') + '</b></span></button></div>';
        });
        field.innerHTML = html;
        // One agent at a time speaks up, so visitors see what each can do without hovering.
        // The "your solution" tile types example requests, to show you talk to what we build.
        var typeEl = $('#core-type'), ASKS = ['Show this month\u2019s deals', 'Open the renewal form', 'Who approves this?', 'Create a quote'];
        if (REDUCED) typeEl.textContent = ASKS[0];
        else (function typeLoop(k, n) {
            var t = ASKS[k % ASKS.length];
            typeEl.textContent = t.slice(0, n);
            if (n < t.length) setTimeout(function () { typeLoop(k, n + 1); }, 55);
            else setTimeout(function () { typeLoop(k + 1, 0); }, 1900);
        })(0, 0);
        var flyers = $$('.fly-ag', field), turn = 0;
        if (!REDUCED) {
            // ...and now and then one of them shows off with a flip.
            setInterval(function () {
                var f = flyers[Math.floor(Math.random() * flyers.length)].querySelector('.ag');
                f.classList.add('play'); setTimeout(function () { f.classList.remove('play'); }, 1000);
            }, 3400);
        }

        // Spotlight: hover (or tap) an agent and it takes over the hero to introduce itself.
        var hero = field.closest('.hero'), spot = document.createElement('div'), spotT = 0, coolUntil = 0;
        spot.className = 'spot'; spot.setAttribute('aria-live', 'polite'); hero.appendChild(spot);
        var renderSpot = function (id) {
            var a = BY_ID[id];
            spot.style.setProperty('--soft', a.soft); spot.style.setProperty('--hue', a.hue); spot.style.setProperty('--hue-d', a.dark);
            spot.innerHTML = '<button class="spot-x" aria-label="Close">\u00d7</button>' +
                '<div class="spot-fig">' + agentEl(a, { mood: 'happy' }) + '</div>' +
                '<div class="spot-txt"><p class="mono">Stage ' + (AGENTS.indexOf(a) + 1) + ' of 7 \u00b7 ' + a.role + ' \u00b7 ' + esc(a.line) + '</p>' +
                '<p class="spot-hey">Hey, you found me!</p>' +
                '<h2>I\u2019m ' + a.name + ', your ' + a.role.replace(' Agent', '').toLowerCase() + ' agent. <span class="hl">' + a.can + '.</span></h2>' +
                '<p class="spot-p">' + a.brief[0] + '</p>' +
                '<ul class="spot-skills">' + a.skills.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
                '<div class="hero-cta"><button class="btn btn--solid" data-open="' + a.id + '">Hear my full briefing <span class="arr">\u2192</span></button>' +
                '<a class="btn btn--ghost" href="' + a.href + '">Open ' + esc(a.line) + '</a></div>' +
                '<div class="spot-team"><span class="mono">Meet the others</span>' + AGENTS.map(function (b) {
                    return '<button data-spot-to="' + b.id + '" class="' + (b.id === id ? 'on' : '') + '" style="--soft:' + b.soft + ';--hue:' + b.hue + '" aria-label="' + b.name + '">' + agentEl(b, { head: true }) + '</button>';
                }).join('') + '</div></div>';
        };
        var openSpot = function (id) {
            renderSpot(id); spot.classList.add('on'); hero.classList.add('spotting');
            var g = $('#guide'); if (g) g.classList.remove('talk'); // the guide steps aside while an agent has the floor
        };
        var capTok = 0;
        var closeSpot = function () {
            capTok++; clearTimeout(spotT);
            $$('.fly-ag .ag, .more-ag', hero).forEach(function (el) { el.style.visibility = ''; }); // agents that flew off come home
            spot.classList.remove('on'); hero.classList.remove('spotting'); coolUntil = Date.now() + 700;
        };
        // An agent spins up into the air and flies off the right edge of the screen; "then" runs once it is gone.
        var flyOff = function (ag, then) {
            if (REDUCED || !ag || !ag.animate) return then();
            var r = ag.getBoundingClientRect(), ghost = ag.cloneNode(true), over = false;
            ghost.classList.remove('play', 'spin');
            ghost.style.cssText = 'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;z-index:150;pointer-events:none;margin:0;transition:none';
            document.body.appendChild(ghost); ag.style.visibility = 'hidden';
            var dx = window.innerWidth - r.left + 90;
            var done = function () { if (over) return; over = true; ghost.remove(); then(); };
            var anim = ghost.animate([
                { transform: 'translate(0,0) rotate(0deg) scale(1)' },
                { transform: 'translate(' + (dx * 0.2).toFixed(0) + 'px,-150px) rotate(300deg) scale(1.35)', offset: 0.4 },
                { transform: 'translate(' + dx.toFixed(0) + 'px,-50px) rotate(900deg) scale(0.9)' }
            ], { duration: 780, easing: 'cubic-bezier(0.4, 0, 0.9, 0.5)', fill: 'forwards' }); // stays off-screen until removed
            anim.onfinish = done; anim.oncancel = done;
        };
        flyers = $$('.fly-ag', field);
        var lines = $$('.links line', field), dragging = false;
        var setOffset = function (wrap, ox, oy) {
            wrap._ox = ox; wrap._oy = oy; placeFly(wrap);
            var fr = field.getBoundingClientRect();
            wrap._line.setAttribute('x2', (wrap._home[0] + ox / fr.width * 100).toFixed(2));
            wrap._line.setAttribute('y2', (wrap._home[1] + oy / fr.height * 100).toFixed(2));
        };
        // Top-right control: a hint until something is moved, then a button that sends everyone home.
        var dragUi = document.createElement('button');
        dragUi.className = 'hero-drag'; dragUi.type = 'button';
        dragUi.innerHTML = '<span class="hd-hint"><b>\u2725</b></span><span class="hd-reset"><b>\u21ba</b></span>';
        var setDragTip = function (moved) {
            var s = moved ? 'Bring the agents back' : 'Drag any agent anywhere';
            dragUi.title = s; dragUi.setAttribute('aria-label', s);
        };
        setDragTip(false);
        hero.appendChild(dragUi);
        dragUi.addEventListener('click', function () {
            if (!dragUi.classList.contains('moved')) return;
            dragUi.classList.remove('moved'); setDragTip(false);
            var moved = flyers.map(function (f) { return f.parentNode; }).filter(function (w) { return w._ox || w._oy; });
            var from = moved.map(function (w) { return [w._ox, w._oy]; }), t0 = performance.now(), dur = REDUCED ? 1 : 520;
            moved.forEach(function (w) { w.classList.add('dragging'); });
            (function glide(now) {
                var t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
                moved.forEach(function (w, i) { setOffset(w, from[i][0] * (1 - e), from[i][1] * (1 - e)); });
                if (t < 1) requestAnimationFrame(glide);
                else moved.forEach(function (w) { w.classList.remove('dragging'); });
            })(t0);
        });
        flyers.forEach(function (f) {
            var id = f.getAttribute('data-spot');
            // Click (or tap) an agent: it spins up into the air and flies off the right edge of the
            // screen, then its takeover opens and it flies back in from the left, still spinning.
            // Once it has taken off it cannot be cancelled, so a quick click always works.
            var ag = f.querySelector('.ag'), busy = false;
            var launch = function () {
                clearTimeout(spotT);
                if (busy) return;
                busy = true;
                flyOff(ag, function () { busy = false; openSpot(id); });
            };
            // Hovering only makes the agent spin (CSS) and lets you drag it; the takeover opens on a click or tap.
            f.addEventListener('click', function () {
                if (f._dragged) { f._dragged = false; return; } // that was a drop, not a click
                launch();
            });

            // Drag: pick the agent up and put it anywhere in the hero. Its name tag travels with it
            // and its line to "Your solution" stretches to follow.
            var wrap = f.parentNode, line = lines[AGENTS.indexOf(BY_ID[id])];
            wrap._home = POS[id]; wrap._line = line;
            f.addEventListener('pointerdown', function (e) {
                if (e.pointerType === 'touch' || e.button > 0) return; // touch keeps normal scrolling
                clearTimeout(spotT);
                var sx = e.clientX, sy = e.clientY, ox0 = wrap._ox || 0, oy0 = wrap._oy || 0, moved = false;
                var fr = field.getBoundingClientRect(), hr = hero.getBoundingClientRect();
                var homeX = fr.left + POS[id][0] / 100 * fr.width, homeY = fr.top + POS[id][1] / 100 * fr.height;
                var top = hr.top + (document.querySelector('.nav') ? document.querySelector('.nav').offsetHeight : 0) + 50;
                var move = function (ev) {
                    var dx = ev.clientX - sx, dy = ev.clientY - sy;
                    if (!moved && Math.abs(dx) + Math.abs(dy) < 7) return;
                    if (!moved) { moved = true; dragging = true; clearTimeout(spotT); wrap.classList.add('dragging'); document.body.classList.add('is-dragging'); }
                    // keep the agent inside the hero so it can never be lost off-screen
                    var nx = Math.max(hr.left + 60, Math.min(hr.right - 60, homeX + ox0 + dx));
                    var ny = Math.max(top, Math.min(hr.bottom - 80, homeY + oy0 + dy));
                    setOffset(wrap, nx - homeX, ny - homeY);
                };
                var up = function () {
                    window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
                    if (!moved) return;
                    f._dragged = true; setTimeout(function () { f._dragged = false; }, 60);
                    dragging = false; wrap.classList.remove('dragging'); document.body.classList.remove('is-dragging');
                    coolUntil = Date.now() + 500; // do not open the takeover just because it was dropped under the pointer
                    dragUi.classList.add('moved'); setDragTip(true);
                };
                window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
            });
            f.addEventListener('dragstart', function (e) { e.preventDefault(); });
        });
        // "What else can I do?": the solution's agent takes the hero and lists what it can do,
        // one speech cloud at a time, each cloud landing as a line item.
        var CATS = { sales: ['#fdf0d9', '#d9820b'], product: ['#fde6f0', '#cf2f76'], data: ['#dff6f1', '#0b8f80'], docs: ['#e0f5ea', '#1f8a56'], insight: ['#eee8fe', '#6537d6'], ops: ['#fde5df', '#d94a31'], you: ['#e6ecff', '#1a3fd0'] };
        // Each entry: what the agent says in the cloud, the short line it becomes, and its colour group.
        // Ordered as a story: daily relief first, then money, then the busywork, then insight,
        // then running the team, and last the reassurance that the customer stays in control.
        var CAPS = [
            ['I can read your inbox and show you only the emails that need you.', 'Show you only the emails that matter', 'docs'],
            ['I can read a 60-page document and hand you the one page you need.', 'Summarize long documents in a page', 'docs'],
            ['I can find that one email, file or record you are hunting for, in seconds.', 'Find any email, file or record in seconds', 'docs'],
            ['I can draft the reply for you. You just read it and press send.', 'Draft your replies, ready to send', 'docs'],
            ['I can turn a customer conversation into a quotation before the call ends.', 'Quote before the call ends', 'sales'],
            ['I can send the invoice the moment the work is done.', 'Invoice the moment work is done', 'sales'],
            ['I can chase overdue payments politely, so you never have to.', 'Chase overdue payments for you', 'sales'],
            ['I can capture every lead and follow up, so not one goes cold.', 'Never let a lead go cold', 'sales'],
            ['I can do the data entry. Just tell me what happened.', 'Do the data entry you hate', 'data'],
            ['I can update prices, products and stock everywhere, from one sentence.', 'Update prices and products in one sentence', 'product'],
            ['I can fill in the form for you and open exactly the screen you need.', 'Fill in forms, open the right screen', 'data'],
            ['I can onboard a new employee or a new customer, step by step.', 'Onboard new staff and customers', 'ops'],
            ['I can answer any question about your numbers, in plain words.', 'Answer any question about your numbers', 'insight'],
            ['I can build your dashboard while you are still describing it.', 'Build dashboards as you describe them', 'insight'],
            ['I can have your weekly report waiting for you on Monday morning.', 'Have reports ready before you ask', 'insight'],
            ['I can warn you early: low stock, a late project, a deal that is slipping.', 'Warn you before a problem grows', 'insight'],
            ['I can plan the project, assign the tasks and track who is doing what.', 'Plan projects and assign the tasks', 'ops'],
            ['I can remind you and your team what is due, and when.', 'Remind everyone what is due, and when', 'ops'],
            ['I can be your agentic project manager, awake around the clock.', 'Be your project manager, around the clock', 'ops'],
            ['I can answer your customers on your website and WhatsApp, day and night.', 'Answer your customers, day and night', 'sales'],
            ['I can do all of this by voice, and I always ask you before anything important.', 'Work by voice, and ask before big steps', 'you']
        ];
        var openCaps = function () {
            var my = ++capTok;
            spot.style.setProperty('--soft', '#e6ecff'); spot.style.setProperty('--hue', GUIDE.hue); spot.style.setProperty('--hue-d', GUIDE.dark);
            spot.innerHTML = '<button class="spot-x" aria-label="Close">\u00d7</button>' +
                '<div class="spot-fig caps-fig"><div class="cloud" id="cloud"></div>' + agentEl(GUIDE, { mood: 'happy' }) + '</div>' +
                '<div class="spot-txt"><p class="mono">What your agents will do for you</p>' +
                '<h2 class="caps-h">Imagine handing your agents <span class="hl">all of this.</span></h2>' +
                '<ol class="caps" id="caps"></ol>' +
                '<button class="caps-skip" id="caps-skip">Show me all ' + CAPS.length + ' now</button>' +
                '<p class="mono caps-n"><b id="caps-n">0</b> of ' + CAPS.length + ' \u00b7 examples; your agent\u2019s skills depend on the solution we build for you</p>' +
                '<div class="hero-cta" id="caps-cta" hidden><a class="btn btn--solid" href="contact.html">Tell us what you need <span class="arr">\u2192</span></a>' +
                '<a class="btn btn--ghost" href="#how" id="caps-how">See how a build works</a></div></div>';
            spot.classList.add('on'); hero.classList.add('spotting');
            var g = $('#guide'); if (g) g.classList.remove('talk');
            var cloud = $('#cloud'), list = $('#caps'), count = $('#caps-n'), skip = $('#caps-skip'), landed = 0;
            var live = function () { return my === capTok && spot.classList.contains('on'); };
            var land = function (i) {
                var c = CATS[CAPS[i][2]], label = CAPS[i][1];
                var li = document.createElement('li');
                li.style.setProperty('--c', c[0]); li.style.setProperty('--cd', c[1]);
                li.innerHTML = '<i>\u2713</i>' + esc(label);
                list.appendChild(li); landed = i + 1; count.textContent = landed;
            };
            var finish = function () {
                cloud.className = 'cloud stay'; cloud.textContent = 'And many more things I can do for you, based on your requirement. Just tell me.';
                skip.hidden = true; $('#caps-cta').hidden = false;
            };
            // Each line gets a little over three seconds: long enough to read the cloud before it lands in the list.
            var EACH = REDUCED ? 0 : 3600, LAND = REDUCED ? 0 : 2950;
            skip.addEventListener('click', function () {
                my = -1; // stop the paced loop, then drop in whatever has not landed yet
                for (var k = landed; k < CAPS.length; k++) land(k);
                finish();
            });
            (function step(i) {
                if (!live()) return;
                if (i >= CAPS.length) return finish();
                cloud.className = 'cloud'; void cloud.offsetWidth;
                cloud.textContent = CAPS[i][0]; cloud.className = 'cloud pop';
                setTimeout(function () { if (live() && landed === i) land(i); }, LAND);
                setTimeout(function () { step(i + 1); }, EACH);
            })(0);
        };
        var capsBtn = $('#caps-open');
        if (capsBtn) {
            // The card stays put; its agent hops out, flies off to the right, and reappears in the takeover.
            var capBusy = false;
            var capLaunch = function () {
                clearTimeout(spotT);
                if (capBusy) return;
                capBusy = true;
                flyOff($('.more-ag', capsBtn), function () { capBusy = false; openCaps(); });
            };
            // Hover only makes the agent spin, like the hero agents; it flies off on a click or tap.
            var capAg = $('.more-ag', capsBtn), capSpinT = 0;
            capsBtn.addEventListener('pointerenter', function (e) {
                if (e.pointerType !== 'mouse' || capBusy || capAg.classList.contains('spin')) return;
                capAg.classList.add('spin');
                clearTimeout(capSpinT); capSpinT = setTimeout(function () { capAg.classList.remove('spin'); }, 600);
            });
            capsBtn.addEventListener('click', capLaunch);
        }
        hero.addEventListener('mouseleave', closeSpot);
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSpot(); });
        spot.addEventListener('click', function (e) {
            if (e.target.closest('.spot-x')) return closeSpot();
            if (e.target.closest('[data-open]') || e.target.closest('#caps-how')) closeSpot();
        });
        spot.addEventListener('pointerover', function (e) {
            // Pointing at the close button is enough; a click or tap still works too.
            if (e.pointerType === 'mouse' && e.target.closest('.spot-x')) return closeSpot();
        });
        spot.addEventListener('click', function (e) {
            var b = e.target.closest('[data-spot-to]');
            if (b && !b.classList.contains('on')) renderSpot(b.getAttribute('data-spot-to'));
        });
    }

    // Pointer: eyes follow the cursor, floating layers shift with depth.
    var px = 0, py = 0, raf = 0, parX = 0, parY = 0;
    // Position of a floating element = its home spot + the parallax shift + wherever the visitor dragged it.
    // Everything is snapped to whole pixels: text on a half pixel is what makes labels look soft.
    function placeFly(el) {
        var k = parseFloat(el.getAttribute('data-depth')) * 16;
        if (el._w == null) { el._w = el.offsetWidth; el._h = el.offsetHeight; }
        var x = Math.round(-el._w / 2 - parX * k + (el._ox || 0)), y = Math.round(-el._h / 2 - parY * k + (el._oy || 0));
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    }
    function placeAll() { $$('.fly[data-depth]').forEach(function (el) { el._w = null; placeFly(el); }); }
    function onMove(e) {
        px = e.clientX; py = e.clientY;
        if (!raf) raf = requestAnimationFrame(track);
    }
    function track() {
        raf = 0;
        $$('.ag-eyes').forEach(function (g) {
            var r = g.ownerSVGElement.getBoundingClientRect();
            if (r.bottom < -100 || r.top > window.innerHeight + 100) return;
            var dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 3);
            var d = Math.sqrt(dx * dx + dy * dy) || 1, m = Math.min(1, d / 160) * 3.4;
            g.setAttribute('transform', 'translate(' + (dx / d * m).toFixed(2) + ' ' + (dy / d * m * 0.75).toFixed(2) + ')');
        });
        var cx = px / window.innerWidth - 0.5, cy = py / window.innerHeight - 0.5;
        parX = cx; parY = cy;
        $$('.fly[data-depth]').forEach(placeFly);
    }
    if (!REDUCED) window.addEventListener('pointermove', onMove, { passive: true });
    // Snap once everything has its final size (fonts loaded), and again whenever the window changes.
    placeAll();
    window.addEventListener('load', placeAll);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeAll);
    var rsT = 0; window.addEventListener('resize', function () { clearTimeout(rsT); rsT = setTimeout(placeAll, 120); });

    // ------------------------------------------------------------------
    // Shared: play a list of lines into a container, one after another.
    // ------------------------------------------------------------------
    function Player(box) {
        var token = 0;
        return {
            play: function (items, gap, done) {
                var my = ++token; box.innerHTML = '';
                var i = 0;
                (function next() {
                    if (my !== token) return;
                    if (i >= items.length) { if (done) done(); return; }
                    var el = document.createElement('div');
                    el.innerHTML = items[i++];
                    el = el.firstChild; box.appendChild(el);
                    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
                    if (REDUCED) next(); else setTimeout(next, gap);
                })();
            }
        };
    }
    function say(agentId, text, label) {
        var a = BY_ID[agentId];
        return '<div class="msg" style="--soft:' + a.soft + '">' + agentEl(a, { head: true }) + '<div class="bub"><span class="who">' + (label || a.name + ' · ' + a.role) + '</span>' + text + '</div></div>';
    }
    function you(text) {
        return '<div class="msg msg--you"><span class="avatar-you">You</span><div class="bub"><span class="who">You</span>' + text + '</div></div>';
    }
    function log(agentId, text) {
        return '<div class="log">' + agentEl(BY_ID[agentId], { head: true }) + '<span>' + text + '</span><span class="ok">✓ done</span></div>';
    }
    function pills(list) {
        return '<div class="pills">' + list.map(function (p) { return '<span><b>' + p[0] + '</b> ' + p[1] + '</span>'; }).join('') + '</div>';
    }

    // ------------------------------------------------------------------
    // Walkthrough: an illustrative CRM build, in four scenes.
    // ------------------------------------------------------------------
    var SCENES = [
        [
            you('We need a CRM for our 40-person sales team: leads, pipeline, quotes and renewals.'),
            say('vera', 'Understood. I’ll bring in the team. Before anyone builds anything, I have a few questions for you.'),
            pills([['7', 'agents assigned'], ['0', 'lines of code written by you']])
        ],
        [
            say('vera', 'Who approves a discount above 15%?'),
            you('The regional sales manager.'),
            say('atlas', 'Which numbers does your board review every month?'),
            you('Pipeline coverage and renewal rate.'),
            pills([['12', 'requirements captured'], ['3', 'approval rules'], ['2', 'board KPIs']])
        ],
        [
            log('forge', 'Data model: accounts, contacts, deals, quotes, renewals'),
            log('forge', 'Database provisioned with role-based access'),
            log('orca', 'Workflows: lead routing, discount approval (human-in-the-loop)'),
            log('orca', 'Guardrails and audit trail on every agent action'),
            log('sage', 'Sales team onboarding and playbook prepared'),
            pills([['5', 'entities'], ['2', 'workflows'], ['100%', 'actions logged']])
        ],
        [
            you('Which deals close this month and still need approval?'),
            say('orca', 'Three deals close this month. Two are above the 15% discount rule and need the regional manager.' +
                '<table class="tbl"><tr><th>Deal</th><th>Value</th><th>Discount</th><th>Status</th></tr>' +
                '<tr><td>Northwind renewal</td><td>$84k</td><td>18%</td><td class="flag">Needs approval</td></tr>' +
                '<tr><td>Halden expansion</td><td>$52k</td><td>20%</td><td class="flag">Needs approval</td></tr>' +
                '<tr><td>Brightline new</td><td>$31k</td><td>10%</td><td>Ready</td></tr></table>', 'Your CRM agent'),
            you('<span class="voice"><i></i><i></i><i></i><i></i></span>Spoken: \u201cOpen the renewal form for Northwind.\u201d'),
            say('orca', 'Opening the renewal form. I\u2019ve filled in the account and last year\u2019s terms for you.', 'Your CRM agent')
        ]
    ];
    var winBody = $('#demo-body'), stepEls = $$('.step');
    if (winBody && stepEls.length) {
        var demo = Player(winBody), cur = -1, timer = 0;
        var show = function (n) {
            clearTimeout(timer); cur = n;
            var gap = 950, hold = 3200, total = SCENES[n].length * gap + hold;
            stepEls.forEach(function (s, i) {
                s.classList.remove('on'); s.setAttribute('aria-selected', i === n ? 'true' : 'false');
                s.style.setProperty('--step-ms', total + 'ms');
            });
            var demoEl = winBody.closest('.demo'); if (demoEl) demoEl.setAttribute('data-step', n); // lights up the crew on this stage
            void stepEls[n].offsetWidth; // restart the progress bar
            stepEls[n].classList.add('on');
            demo.play(SCENES[n], gap);
            if (!REDUCED) timer = setTimeout(function () { show((n + 1) % SCENES.length); }, total);
        };
        stepEls.forEach(function (s, i) { s.addEventListener('click', function () { show(i); }); });
        new IntersectionObserver(function (en) {
            if (en[0].isIntersecting) { if (cur < 0) show(0); else if (!timer) show(cur); }
            else { clearTimeout(timer); timer = 0; }
        }, { threshold: 0.15 }).observe(winBody);
    }

    // ------------------------------------------------------------------
    // Roster + briefing console: click an agent, it briefs you.
    // ------------------------------------------------------------------
    var cast = $('#cast'), con = $('#console');
    if (cast && con) {
        cast.innerHTML = AGENTS.map(function (a) {
            return '<button class="cast-row" data-open="' + a.id + '" style="--hue:' + a.hue + ';--soft:' + a.soft + '">' +
                '<span class="tile">' + agentEl(a, { head: true }) + '</span>' +
                '<span><strong>' + a.name + '<span>' + a.role + '</span></strong><em>' + esc(a.line) + '</em></span>' +
                '<span class="go"><i></i>Brief me</span></button>';
        }).join('');
        var cHead = $('.console-head', con), cBody = $('.console-body', con), cFoot = $('.console-foot', con);
        var brief = Player(cBody), met = {}, active = null;

        var open = function (id, scroll) {
            var a = BY_ID[id]; if (!a || !a.brief) return;
            active = a; met[id] = true;
            $$('.cast-row', cast).forEach(function (r) {
                var rid = r.getAttribute('data-open');
                r.classList.toggle('on', rid === id); r.classList.toggle('met', !!met[rid]);
            });
            var n = Object.keys(met).length;
            $('#met-n').textContent = n; $('#met-bar').style.width = (n / AGENTS.length * 100) + '%';
            cHead.style.setProperty('--soft', a.soft);
            cHead.innerHTML = agentEl(a, { mood: 'happy' }) + '<div><h3>' + a.name + '</h3><p class="mono">' + a.role + ' · ' + esc(a.line) + '</p></div>';
            cFoot.innerHTML = '';
            brief.play(a.brief.map(function (t) { return say(id, t); }), 1300, function () {
                cFoot.innerHTML = '<button class="ask" id="ask-enables">What does that give me?</button>' +
                    '<a class="ask ask--go" href="' + a.href + '">Open ' + esc(a.line) + ' →</a>';
                $('#ask-enables').addEventListener('click', function () {
                    this.disabled = true;
                    var q = document.createElement('div'); q.innerHTML = you('What does that give me?');
                    var r = document.createElement('div'); r.innerHTML = say(id, a.enables);
                    cBody.appendChild(q.firstChild); cBody.appendChild(r.firstChild);
                    $$('.msg', cBody).slice(-2).forEach(function (m, i) { setTimeout(function () { m.classList.add('in'); }, REDUCED ? 0 : 80 + i * 700); });
                });
            });
            if (scroll) $('#agents').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
        };
        document.addEventListener('click', function (e) {
            var t = e.target.closest('[data-open]'); if (!t) return;
            open(t.getAttribute('data-open'), !cast.contains(t));
        });
        new IntersectionObserver(function (en, io) {
            if (en[0].isIntersecting && !active) { open('vera'); io.disconnect(); }
        }, { threshold: 0.25 }).observe(con);
    }

    // ------------------------------------------------------------------
    // Agent showcase page (agents.html): the cast, one card each.
    // ------------------------------------------------------------------
    var grid = $('#cast-grid');
    if (grid) {
        grid.innerHTML = AGENTS.map(function (a) {
            return '<article class="cast-card rv" style="--soft:' + a.soft + ';--hue-d:' + a.dark + '">' +
                '<div class="stage">' + agentEl(a) + '</div><div class="info">' +
                '<h3>' + a.name + '</h3><span class="mono">' + a.role + '</span>' +
                '<dl><dt>Owns</dt><dd>' + esc(a.line) + '</dd>' +
                '<dt>Says</dt><dd>“' + a.can + '.”</dd>' +
                '<dt>Carries</dt><dd>' + a.gear + '<span class="look-note"></span></dd></dl></div></article>';
        }).join('');
    }
    var mine = $('#cmp-mine');
    if (mine) mine.innerHTML = AGENTS.map(function (a) { return agentEl(a, { head: true }); }).join('');

    // ------------------------------------------------------------------
    // Companion guide: one line per section.
    // ------------------------------------------------------------------
    var guide = $('#guide');
    if (guide) {
        var sayEl = $('#guide-text'), lastSay = '', hideT = 0;
        $('#guide-close').addEventListener('click', function () { guide.classList.add('off'); });
        $('.guide-ag', guide).addEventListener('click', function () {
            if (guide.classList.contains('off')) { guide.classList.remove('off'); guide.classList.add('talk'); return; }
            var t = $('#agents'); if (t) t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
        });
        var gio = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                var t = en.target.getAttribute('data-guide');
                if (!en.isIntersecting || t === lastSay) return;
                lastSay = t; guide.classList.remove('talk');
                setTimeout(function () { sayEl.textContent = t; guide.classList.add('talk'); }, REDUCED ? 0 : 260);
                clearTimeout(hideT); hideT = setTimeout(function () { guide.classList.remove('talk'); }, 6500);
            });
        }, { rootMargin: '-45% 0px -45% 0px' });
        $$('[data-guide]').forEach(function (s) { gio.observe(s); });
    }

    // ------------------------------------------------------------------
    // Pip, the pointer's agent: a tiny agent that tags along beside the mouse,
    // grins over anything clickable and ducks when you click.
    // ------------------------------------------------------------------
    if (!REDUCED && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        var PIP = { id: 'pip', name: 'Jia', hue: '#f28a1e', dark: '#d9690b', soft: '#fdecd9', glow: '#ffd9a8' };
        BY_ID.pip = PIP;
        var pip = document.createElement('div');
        pip.className = 'cur-ag'; pip.setAttribute('aria-hidden', 'true');
        pip.innerHTML = agentEl(PIP, { head: true });
        document.body.appendChild(pip);
        var tx = 0, ty = 0, cx2 = 0, cy2 = 0, pipRaf = 0, started = false;
        var pipTick = function () {
            cx2 += (tx - cx2) * 0.2; cy2 += (ty - cy2) * 0.2;
            pip.style.transform = 'translate3d(' + cx2.toFixed(1) + 'px,' + cy2.toFixed(1) + 'px,0)';
            pipRaf = (Math.abs(tx - cx2) + Math.abs(ty - cy2) > 0.3) ? requestAnimationFrame(pipTick) : 0;
        };
        window.addEventListener('pointermove', function (e) {
            if (e.pointerType !== 'mouse') return;
            tx = e.clientX + 24; ty = e.clientY + 26; // trails just behind the arrow's tail
            if (!started) { started = true; cx2 = tx; cy2 = ty; }
            pip.classList.add('on');
            pip.classList.toggle('hot', !!(e.target.closest && e.target.closest('a, button, [role="tab"]')));
            if (!pipRaf) pipRaf = requestAnimationFrame(pipTick);
        }, { passive: true });
        document.addEventListener('pointerdown', function () { pip.classList.add('down'); });
        document.addEventListener('pointerup', function () { pip.classList.remove('down'); });
        document.documentElement.addEventListener('mouseleave', function () { pip.classList.remove('on'); });
    }

    // ------------------------------------------------------------------
    // Joy's banner tour: she walks to the price, the customer limit and the button in turn,
    // stretches out a hand and touches each one, and each reacts. Wide screens only.
    // ------------------------------------------------------------------
    var promo = $('.promo'), joy = promo && $('.promo-joy', promo);
    if (joy && !REDUCED) {
        var wideMq = window.matchMedia('(min-width: 1280px)');
        var price = $('.promo-price', promo), rest = $('.promo-500', promo), go = $('.promo-go', promo), tag = $('.promo-tag', promo), lead = $('strong', promo);
        var tourT = 0, touring = false;
        var later = function (fn, ms) { tourT = setTimeout(fn, ms); };
        // She stands with her right side at the left edge of "el" (nudged by "shift"), on top of the banner.
        var xFor = function (el, shift) { return el.getBoundingClientRect().left - promo.getBoundingClientRect().left - 96 + (shift || 0); };
        var walk = function (el, shift, then, ms) {
            // "ms" is how long the walk takes; the default is a brisk step, the walk home is a slow stroll
            joy.style.setProperty('--walk', ((ms || 950) / 1000) + 's');
            joy.style.setProperty('--jx', xFor(el, shift).toFixed(0) + 'px'); later(then, (ms || 950) + 250);
        }; // a little longer than the walk itself, so she has always arrived
        // "$100" arrives: it counts up from nothing as it is highlighted, so the price lands instead of just sitting there.
        var countUp = function () {
            var t0 = performance.now(), dur = 750;
            price.style.minWidth = price.offsetWidth + 'px';
            (function tick(now) {
                var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
                price.textContent = '$' + Math.round(100 * e);
                if (p < 1) requestAnimationFrame(tick);
            })(t0);
        };
        var touch = function (el, cls, hold, then, aim, fx, fy) {
            // reach from her hand to a point on the target ("fx" across, "fy" down). She taps the lower-left
            // corner of each one, so her hand never covers the words.
            var jr = joy.getBoundingClientRect(), er = (aim || el).getBoundingClientRect();
            var dx = er.left + er.width * (fx || 0.5) - (jr.left + 66), dy = er.top + er.height * (fy == null ? 0.5 : fy) - (jr.top + 65);
            var arm = $('.joy-arm', joy);
            arm.style.transform = 'rotate(' + (Math.atan2(dy, dx) * 180 / Math.PI).toFixed(1) + 'deg)';
            joy.style.setProperty('--arm', Math.max(24, Math.sqrt(dx * dx + dy * dy)).toFixed(0) + 'px');
            joy.classList.add('reach');
            later(function () {
                el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
                if (el === price) countUp();
                later(function () { joy.classList.remove('reach'); later(function () { el.classList.remove(cls); then(); }, 320); }, hold);
            }, 400);
        };
        // She walks right up beside each target, standing on top of the words just before it,
        // and puts her hand on top of the target itself: the $100, the 500, then the button.
        var num = $('.promo-n', promo);
        var REST_AT_BUTTON = 3600, WALK_HOME = 2800, REST_AT_HOME = 5200;
        var light = function (el) { // highlight one part of the offer; the highlights overlap, so the story flows
            el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit');
            if (el === price) countUp();
            setTimeout(function () { el.classList.remove('hit'); }, 2100);
        };
        var loop = function () {
            if (!touring) return;
            // "Limited-time offer" -> "$100" -> "first 500 customers" -> "Claim your spot": she walks the banner left to
            // right in one go and each part lights up as she reaches it. At the button she reaches out and presses it.
            light(tag);
            later(function () {
                walk(price, 4, function () {
                    light(price);
                    later(function () {
                        walk(rest, 0, function () {
                            light(rest);
                            later(function () {
                                walk(go, 8, function () {
                                    touch(go, 'press', 1300, function () {
                                        // step round to the free space on the far side of the button and wait there
                                        var beside = go.getBoundingClientRect().width + 96 + 6;
                                        walk(go, beside, function () {
                                            // At the right-hand end she passes the megaphone to her other hand, so it
                                            // still points at the banner, and passes it back once she is home again.
                                            joy.classList.add('swap');
                                            later(function () {
                                                walk(tag, -8, function () { joy.classList.remove('swap'); later(loop, REST_AT_HOME); }, WALK_HOME);
                                            }, REST_AT_BUTTON);
                                        });
                                    }, go, 0.03, 0.92);   // bottom-left edge of the button's black area, clear of its label
                                }, 650);
                            }, 500);
                        }, 650);
                    }, 600);
                }, 650);
            }, 650);
        };
        var setTour = function () {
            clearTimeout(tourT); joy.classList.remove('reach', 'swap');
            touring = wideMq.matches;
            promo.classList.toggle('tour', touring);
            if (touring) { joy.style.setProperty('--jx', xFor(tag, -8).toFixed(0) + 'px'); later(loop, 2500); } // first round starts soon after the page opens
        };
        setTour();
        if (wideMq.addEventListener) wideMq.addEventListener('change', setTour);
        // the logo showcase borrows Joy and the banner, so the tour steps aside while it is open
        window.YPT_TOUR = {
            pause: function () { clearTimeout(tourT); touring = false; joy.classList.remove('reach', 'swap'); $$('.hit, .press', promo).forEach(function (el) { el.classList.remove('hit', 'press'); }); },
            resume: setTour
        };
    }

    // The logo: point at it and it grows, spins five times, and settles back into place.
    var brand = $('.brand'), scOpen = false;
    if (brand && !REDUCED) brand.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse' || brand.classList.contains('spin') || scOpen) return;
        brand.classList.add('spin');
        setTimeout(function () { brand.classList.remove('spin'); }, 1950);
    });

    // Full screen: one button in the header puts the whole page into the browser's full-screen mode;
    // the same button (now a cross) or the Esc key brings it back. Shown only where the browser
    // supports full screen for pages (iPhone Safari does not, so the button stays hidden there).
    var fsBtn = $('#fs-btn'), docEl = document.documentElement;
    var fsReq = docEl.requestFullscreen || docEl.webkitRequestFullscreen;
    var fsExit = document.exitFullscreen || document.webkitExitFullscreen;
    if (fsBtn && fsReq && fsExit && (document.fullscreenEnabled || document.webkitFullscreenEnabled)) {
        var fsEl = function () { return document.fullscreenElement || document.webkitFullscreenElement; };
        var fsSync = function () {
            var on = !!fsEl();
            fsBtn.classList.toggle('on', on);
            fsBtn.setAttribute('aria-label', on ? 'Exit full screen' : 'Enter full screen');
            fsBtn.title = on ? 'Exit full screen' : 'Full screen';
        };
        fsBtn.hidden = false;
        document.body.classList.add('has-fs'); // the industry picker sits to the left of this button
        fsBtn.addEventListener('click', function () {
            var p = fsEl() ? fsExit.call(document) : fsReq.call(docEl);
            if (p && p.catch) p.catch(function () {});
        });
        document.addEventListener('fullscreenchange', fsSync);
        document.addEventListener('webkitfullscreenchange', fsSync);
    }

    // ------------------------------------------------------------------
    // Industry picker: a pop-up on a first visit, and a list in the top-right corner afterwards.
    // ------------------------------------------------------------------
    var dotBg = function (L) { return L.suit ? 'radial-gradient(circle at 35% 30%, ' + shade(L.suit, 1.45) + ', ' + L.suit + ' 62%, ' + shade(L.suit, 0.6) + ')' : 'conic-gradient(#2457f5, #f28a1e, #ec4f93, #2457f5)'; };
    // Line icons and tile colours for each industry, used in the industry list.
    var IND_ICON = {
        general: ['<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3.4 3.2 14.6 0 18M12 3c-3.2 3.4-3.2 14.6 0 18"/>', '#eef0ff', '#2457f5'],
        banking: ['<path d="M3 9.5L12 4l9 5.5H3zM5.5 12v6M10 12v6M14 12v6M18.5 12v6M3.5 20.5h17"/>', '#e6eaf5', '#1b2a4e'],
        telecom: ['<circle cx="12" cy="9" r="1.6"/><path d="M12 10.6V21M9 21h6M10 14l-2 7M14 14l2 7M7.6 6.4a6 6 0 0 0 0 5.2M16.4 6.4a6 6 0 0 1 0 5.2M5 4.2a9.500 9.500 0 0 0 0 9.600M19 4.200a9.500 9.500 0 0 1 0 9.600"/>', '#e3ecff', '#2457f5'],
        healthcare: ['<path d="M12 20s-8-4.600-8-10.200A4.300 4.300 0 0 1 12 7.500a4.300 4.300 0 0 1 8 2.300C20 15.400 12 20 12 20z"/><path d="M7 12.500h2.500l1.500-2.500 2 4 1.500-1.500H17"/>', '#dff6f1', '#0b8f80'],
        agriculture: ['<path d="M12 21v-9M8 21h8"/><path d="M12 12C12 8 9 5.500 5 5.500c0 4 2.500 6.500 7 6.500zM12 14c0-3.200 2.400-5.500 6-5.500 0 3.500-2.200 5.500-6 5.500z"/>', '#e7f1da', '#4a7a2c'],
        defence: ['<path d="M12 3l8 3v6c0 4.800-3.300 8-8 9.500C7.300 20 4 16.800 4 12V6z"/><path d="M12 8.500l1.200 2.600 2.800.3-2.100 1.900.6 2.800-2.500-1.400-2.500 1.400.6-2.800L8 11.400l2.800-.3z"/>', '#e9ecdc', '#59693d'],
        retail: ['<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.500a3 3 0 0 1 6 0V8"/>', '#fde5df', '#d9472f'],
        energy: ['<path d="M13 2.500L5 13.500h6l-1 8 8-11h-6z"/>', '#fdf0d0', '#c97d00'],
        education: ['<path d="M12 4l10 5-10 5L2 9z"/><path d="M6 11.500V16c0 1.500 2.700 3 6 3s6-1.500 6-3v-4.500M22 9v5"/>', '#ece6fb', '#3b2a6b'],
        government: ['<path d="M12 3v2M7.500 11a4.500 4.500 0 0 1 9 0M4 11h16M5.500 11v8M9.500 11v8M14.500 11v8M18.500 11v8M3 20.500h18"/>', '#e4e8f2', '#22314f'],
        airlines: ['<path d="M21 15.500v-1.500l-8-5V4a1.500 1.500 0 0 0-3 0v5l-8 5v1.500l8-2.300V18l-2 1.500V21l3.500-1 3.500 1v-1.500L13 18v-4.800z"/>', '#e1ecfa', '#1c3f7a'],
        insurance: ['<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v6a2 2 0 0 0 4 0M12 3V2"/>', '#d9f1f1', '#0e6b6b'],
        manufacturing: ['<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.500"/><path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M18.700 5.300l-2.100 2.100M7.400 16.600l-2.100 2.100"/>', '#e0ecf8', '#2f6fb3'],
        logistics: ['<path d="M2.500 6.500h11v10h-11zM13.500 10h4l3 3v3.500h-7z"/><circle cx="7" cy="18" r="1.800"/><circle cx="17" cy="18" r="1.800"/>', '#fdebd6', '#c9670a'],
        maritime: ['<circle cx="12" cy="5" r="2"/><path d="M12 7v14M7 11h10M4.500 14c.5 4 3.700 7 7.500 7s7-3 7.500-7"/>', '#dfe8f4', '#14325c'],
        hospitality: ['<path d="M3 20h18M5 18a7 7 0 0 1 14 0M12 8V6M10 6h4"/>', '#f7e1e8', '#7a1f3d'],
        construction: ['<path d="M4 21V9l6-3v15M10 21V4h10v17M13 8h4M13 12h4M13 16h4M2 21h20"/>', '#fbe6e1', '#c04a32'],
        media: ['<path d="M3 10h18v10H3zM3 10l3-5 3.500 3.200M9.500 8.200L12 4.500l3.500 3.700M15.500 8.200L18 4.500l3 5.500"/>', '#fbe3ee', '#b8346f'],
        technology: ['<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.500" y="9.500" width="5" height="5"/><path d="M9 2.500v3M15 2.500v3M9 18.500v3M15 18.500v3M2.500 9h3M2.500 15h3M18.500 9h3M18.500 15h3"/>', '#daf6ec', '#0b8662'],
        pharma: ['<path d="M9.500 3h5M10.500 3v6L5 19a1.700 1.700 0 0 0 1.500 2.500h11A1.700 1.700 0 0 0 19 19l-5.500-10V3M7.500 15h9"/>', '#e2e9ff', '#2457f5']
    };
    var icoHTML = function (id) {
        var d = IND_ICON[id] || IND_ICON.general;
        return '<span class="ind-ico" style="--bg:' + d[1] + ';--fg:' + d[2] + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d[0] + '</svg></span>';
    };
    var picker = null;
    function applyNote() {
        var L = window.YPT_LOOK;
        $$('.look-note').forEach(function (el) { el.textContent = L.hat ? ' Dressed for ' + L.name + ': ' + L.kit + '.' : ''; });
    }
    function syncPicker() {
        var L = window.YPT_LOOK;
        if (!picker) return;
        $('.ind-btn .ind-dot-ico', picker).innerHTML = icoHTML('general'); // always the globe
        $('.ind-btn', picker).title = L.id === 'general' ? 'Choose your industry' : 'Industry: ' + L.name + ' (click to change)';
        $$('.ind-list button', picker).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-id') === L.id ? 'true' : 'false'); });
    }
    function setIndustry(id, persist) {
        var L = LOOKS[id] || LOOKS.general;
        window.YPT_LOOK = L;
        if (persist) { try { localStorage.setItem(KEY, L.id); } catch (e) {} }
        // redraw every agent's drawing (also the fallback shown before, or without, the 3D models)
        $$('.ag[data-agent]').forEach(function (el) {
            var def = BY_ID[el.getAttribute('data-agent')], old = el.querySelector('svg');
            if (!def || !old) return;
            var tmp = document.createElement('span');
            tmp.innerHTML = agentSVG(def, { head: (old.getAttribute('viewBox') || '').indexOf('10 ') === 0, mood: el.getAttribute('data-mood') || '' });
            old.replaceWith(tmp.firstChild);
        });
        syncPicker(); applyNote();
        document.dispatchEvent(new Event('ypt:industry')); // js/agents3d.js rebuilds the 3D models
    }
    function celebrate() { // everyone gives a quick turn in their new clothes
        $$('.fly-ag .ag, .more-ag, .cast-card .ag').forEach(function (el) { el.classList.add('spin'); setTimeout(function () { el.classList.remove('spin'); }, 1100); });
    }

    var nav = $('.nav');
    if (nav) {
        picker = document.createElement('div');
        picker.className = 'ind-pick';
        picker.innerHTML = '<button type="button" class="ind-btn" aria-haspopup="true" aria-expanded="false" aria-label="Choose your industry"><span class="ind-dot-ico"></span>' +
            '<span class="ind-lab"><small>Industry</small></span>' +
            '<svg class="ind-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>' +
            '<ul class="ind-list" hidden>' + INDUSTRIES.map(function (i) {
                return '<li><button type="button" data-id="' + i.id + '">' + icoHTML(i.id) + '<span class="ind-name">' + esc(i.name) + '</span>' +
                    '<span class="ind-ag" aria-hidden="true">' + agentSVG(BY_ID.guide, { head: true, look: i }) + '</span>' +
                    '<svg class="ind-ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></button></li>';
            }).join('') + '</ul>';
        var fsb = $('#fs-btn');
        if (document.body.classList.contains('has-promo')) nav.appendChild(picker);
        else if (fsb && fsb.parentNode) fsb.parentNode.insertBefore(picker, fsb);
        else nav.appendChild(picker);
        var pBtn = $('.ind-btn', picker), pList = $('.ind-list', picker);
        var pClose = function () { pList.hidden = true; pBtn.setAttribute('aria-expanded', 'false'); };
        pBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            pList.hidden = !pList.hidden; pBtn.setAttribute('aria-expanded', pList.hidden ? 'false' : 'true');
        });
        pList.addEventListener('click', function (e) {
            var b = e.target.closest('button[data-id]'); if (!b) return;
            setIndustry(b.getAttribute('data-id'), true); celebrate(); pClose();
        });
        document.addEventListener('click', function (e) { if (!picker.contains(e.target)) pClose(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') pClose(); });
        syncPicker(); applyNote();
    }

    function openIndustryModal() {
        if ($('.ind-modal')) return;
        var m = document.createElement('div');
        m.className = 'ind-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'ind-h');
        m.innerHTML = '<div class="ind-card"><p class="mono eyebrow"><i></i>Welcome to YPT</p>' +
            '<h2 id="ind-h">Which industry are you in?</h2>' +
            '<p>Pick yours and our agents change into that industry’s work clothes. You can switch at any time from the top right of the page.</p>' +
            '<div class="ind-grid">' + INDUSTRIES.map(function (i) {
                return '<button type="button" class="ind-opt" data-id="' + i.id + '"><span class="ag">' + agentSVG(BY_ID.guide, { look: i }) + '</span><span>' + esc(i.id === 'general' ? 'Another industry' : i.name) + '</span></button>';
            }).join('') + '</div>' +
            '<button type="button" class="ind-skip">Skip for now</button></div>';
        document.body.appendChild(m);
        var done = function (id) {
            document.removeEventListener('keydown', onKey);
            setIndustry(id, true); if (id !== 'general') celebrate();
            m.classList.remove('on'); setTimeout(function () { m.remove(); }, 400);
        };
        var onKey = function (e) { if (e.key === 'Escape') done('general'); };
        document.addEventListener('keydown', onKey);
        m.addEventListener('click', function (e) {
            var b = e.target.closest('.ind-opt');
            if (b) return done(b.getAttribute('data-id'));
            if (e.target.closest('.ind-skip') || e.target === m) done('general');
        });
        requestAnimationFrame(function () { requestAnimationFrame(function () { m.classList.add('on'); var f = $('.ind-opt', m); if (f) f.focus({ preventScroll: true }); }); });
    }
    if (!storedIndustry && !GENERIC) setTimeout(openIndustryModal, 900);

    // ------------------------------------------------------------------
    // The logo showcase: click the logo and it spins in from the corner, grows, and slows to a stop on the
    // left of the screen. The offer banner and Joy fly in beside it. Click anywhere else and everything
    // returns to where it came from.
    // ------------------------------------------------------------------
    // On any page other than the home page, a click on the logo sends you home and the showcase opens there,
    // so the offer is shown wherever the logo is clicked (js/main.js does the same for the older pages).
    var LOGO_FLAG = 'ypt-logo-offer', onHome = /(^|\/)(index\.html)?$/.test(location.pathname);
    if (brand && !onHome) brand.addEventListener('click', function () { try { sessionStorage.setItem(LOGO_FLAG, '1'); } catch (err) {} });
    if (brand && onHome) {
        var arrived = false;
        try { arrived = sessionStorage.getItem(LOGO_FLAG) === '1'; sessionStorage.removeItem(LOGO_FLAG); } catch (err) {}
        if (arrived) window.addEventListener('load', function () { setTimeout(function () { if (!scOpen) brand.click(); }, 450); });
    }
    if (brand && onHome) brand.addEventListener('click', function (e) {
        e.preventDefault();
        if (scOpen) return;
        scOpen = true;
        brand.classList.remove('spin');
        var promoEl = $('.promo'), promoJoy = $('.promo-joy'), hdrLogo = $('.brand-logo', brand);
        var fromLogo = hdrLogo.getBoundingClientRect();
        var fromBanner = promoEl ? promoEl.getBoundingClientRect() : null;
        var fromJoy = promoJoy ? promoJoy.getBoundingClientRect() : null;
        var sc = document.createElement('div');
        sc.className = 'sc'; sc.setAttribute('role', 'dialog'); sc.setAttribute('aria-label', 'Your Partner Technologies: limited-time offer');
        sc.innerHTML = '<div class="sc-in">' +
            '<div class="sc-logo"><span class="sc-ring"></span><img src="' + $('img', hdrLogo).getAttribute('src') + '" alt=""></div>' +
            '<div class="sc-offer"><span class="sc-joy">' + agentEl(BY_ID.joy) + '</span>' +
            '<div class="sc-card"><span class="promo-tag mono">Limited-time offer</span>' +
            '<strong>Any solution for <b>$100</b></strong><span class="sc-rest">for our first 500 customers</span>' +
            '<p>We build it with AI agents, and the solution we hand over is one you can talk to.</p>' +
            '<a class="promo-go sc-go" href="contact.html">Claim your spot <span class="arr">→</span></a></div></div></div>';
        document.body.appendChild(sc);
        document.body.classList.add('sc-open');
        if (window.YPT_TOUR) window.YPT_TOUR.pause();
        brand.style.visibility = 'hidden';
        var logo = $('.sc-logo', sc), card = $('.sc-card', sc), joyBox = $('.sc-joy', sc), anims = [], homeward = [];
        var fly = function (el, from, o) {
            if (!el.animate) return null;
            var to = el.getBoundingClientRect();
            if (!from) from = { left: to.left + to.width * 0.1, top: to.top + to.height * 0.1, width: to.width * 0.8, height: to.height * 0.8 };
            var dx = from.left + from.width / 2 - (to.left + to.width / 2), dy = from.top + from.height / 2 - (to.top + to.height / 2);
            var sx = from.width / to.width, sy = o.uniform ? sx : from.height / to.height;
            var kf = [
                { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ') rotate(' + (o.from || 0) + 'deg)', opacity: o.fade ? 0 : 1 },
                { transform: 'translate(0,0) scale(1) rotate(' + (o.to || 0) + 'deg)', opacity: 1 }
            ];
            var a = el.animate(kf, { duration: REDUCED ? 1 : o.ms, delay: REDUCED ? 0 : (o.delay || 0), easing: o.ease, fill: 'both' });
            anims.push(a); homeward.push({ el: el, kf: [kf[1], kf[0]], ms: o.ms }); return a;
        };
        // five turns, slowing steadily until it stops upright
        fly(logo, fromLogo, { uniform: true, from: 0, to: REDUCED ? 0 : 1800, ms: 2400, ease: 'cubic-bezier(0.12, 0.62, 0.22, 1)' });
        fly(card, fromBanner, { fade: !fromBanner, ms: 1000, delay: 150, ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
        var ja = fly(joyBox, fromJoy, { uniform: true, fade: !fromJoy, from: REDUCED ? 0 : -720, ms: 1500, delay: 100, ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
        var joyAg = $('.ag', joyBox);
        if (ja && ja.finished) ja.finished.then(function () { if (!joyAg.isConnected) return; joyAg.classList.add('spin'); setTimeout(function () { joyAg.classList.remove('spin'); }, 1200); }, function () {});
        requestAnimationFrame(function () { sc.classList.add('on'); });

        var closing = false, finished = false;
        var cleanup = function () {
            if (finished) return; finished = true;
            sc.remove(); document.body.classList.remove('sc-open'); brand.style.visibility = '';
            document.removeEventListener('keydown', onKey);
            scOpen = false;
            if (window.YPT_TOUR) window.YPT_TOUR.resume();
        };
        var close = function () {
            if (closing) return; closing = true;
            sc.classList.remove('on');
            try {
                // everything flies back to where it came from (new animations, from where it landed to where it started)
                Promise.all(homeward.map(function (h) {
                    return new Promise(function (res) {
                        var a = h.el.animate(h.kf, { duration: REDUCED ? 1 : Math.round(h.ms / 2.2), easing: 'cubic-bezier(0.5, 0, 0.75, 0.4)', fill: 'both' });
                        a.onfinish = res; a.oncancel = res;
                    });
                })).then(cleanup, cleanup);
            } catch (err) { cleanup(); }
            setTimeout(cleanup, 1800);
        };
        var onKey = function (ev) { if (ev.key === 'Escape') close(); };
        document.addEventListener('keydown', onKey);
        sc.addEventListener('click', function (ev) { if (!ev.target.closest('.sc-card')) close(); });
    });

    // Reveal on scroll + mobile nav
    var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $$('.rv').forEach(function (el) { rio.observe(el); });
    var tog = $('#nav-toggle');
    if (tog) tog.addEventListener('click', function () {
        var o = $('#nav-links').classList.toggle('open'); tog.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
})();

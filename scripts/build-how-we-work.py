#!/usr/bin/env python3
"""Generates agentic/how-we-work.html: the cutaway building for the "How We Work" page.

Static markup on purpose: the lead agents are <span data-ag="..."> placeholders that js/agentic.js fills (and
js/agents3d.js upgrades to 3D) when the page loads. Camera, tour and controls live in js/hww.js; styling in css/hww.css.
Run:  python3 scripts/build-how-we-work.py && python3 scripts/stamp-version.py
"""
import json, os, re, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, 'agentic/how-we-work.html')
W, FH, FLOOR = 1600, 640, 560          # world width, floor height, y of the floor line (feet)
PAL = ['#4f7cff', '#14b8a6', '#f28a1e', '#8b5cf6', '#ec4899', '#22a06b', '#64748b']
_n = [0]


def pal():
    _n[0] += 1
    return PAL[_n[0] % len(PAL)]


def esc(s):
    return html.escape(s, quote=True)


def pr(x, y, w, h, inner='', cls='', style=''):
    return f'<div class="pr {cls}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;{style}">{inner}</div>'


def head(x, y, w=56, c=None, cls=''):
    """A small flat agent head and shoulders (the crowd)."""
    h = round(w * 76 / 60)
    return f'<svg class="pr ah {cls}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;--c:{c or pal()}"><use href="#ah"/></svg>'


def ws(x, y, c=None, scale=1.0, flip=False, who=True):
    """Workstation: agent behind a desk with a glowing monitor."""
    s = ''
    if who:
        s += head(x + 84 * scale, y - 31 * scale, 56 * scale, c)
    s += f'<svg class="pr ws" style="left:{x}px;top:{y}px;width:{150*scale}px;height:{70*scale}px"><use href="#ws"/></svg>'
    return s


def row(x0, n, step, y, scale=1.0):
    return ''.join(ws(x0 + i * step, y, None, scale) for i in range(n))


def glass(x, y0=70, y1=FLOOR, label=''):
    return pr(x, y0, 8, y1 - y0, '', 'glass')


def sign(x, w, text, cls=''):
    return pr(x, 56, w, 26, f'<span>{esc(text)}</span>', 'sign ' + cls)


def plant(x, y=FLOOR - 78, s=1.0):
    return f'<svg class="pr" style="left:{x}px;top:{y}px;width:{46*s}px;height:{78*s}px" viewBox="0 0 46 78"><path d="M23 40C10 34 6 20 8 8c12 4 18 14 15 32z" fill="#2f9e66"/><path d="M23 40C36 32 40 18 38 6c-13 5-18 15-15 34z" fill="#3fbf7f"/><path d="M23 44C16 30 18 16 24 4c4 14 3 28-1 40z" fill="#23824f"/><path d="M10 52h26l-4 24H14z" fill="#b8663f"/><rect x="8" y="48" width="30" height="7" rx="3" fill="#cf7a4e"/></svg>'


def window(x, y=86, w=170, h=150, night=False):
    sky = '#16204a,#27346b' if night else '#bfe0ff,#eaf5ff'
    a, b = sky.split(',')
    bld = ''.join(f'<rect x="{bx}" y="{by}" width="{bw}" height="{h-by}" fill="{"#0c1233" if night else "#9db6d8"}" opacity=".85"/>' +
                  (f'<rect x="{bx+4}" y="{by+6}" width="3" height="3" fill="#ffd36a"/><rect x="{bx+12}" y="{by+16}" width="3" height="3" fill="#ffd36a"/>' if night else '')
                  for bx, by, bw in [(6, 92, 26), (36, 70, 30), (70, 104, 24), (98, 60, 32), (134, 96, 28)])
    gid = f'sk{x}{y}'
    return (f'<svg class="pr win" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px" viewBox="0 0 {w} {h}"><defs><linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient></defs>'
            f'<rect width="{w}" height="{h}" rx="6" fill="url(#{gid})"/>{bld}<path d="M{w/2} 0V{h}M0 {h/2}H{w}" stroke="#fff" stroke-width="4" opacity=".75"/><rect width="{w}" height="{h}" rx="6" fill="none" stroke="#dfe6f7" stroke-width="5"/></svg>')


def board(x, y, w, h, kind='scribble'):
    inner = ''
    if kind == 'scribble':
        inner = ''.join(f'<path d="M14 {22+i*18}h{w-40-(i%3)*30}" stroke="#7a89b8" stroke-width="3" stroke-linecap="round"/>' for i in range(max(2, (h - 30) // 18)))
    elif kind == 'diagram':
        inner = (f'<rect x="18" y="22" width="64" height="34" rx="6" fill="#dbe6ff" stroke="#2457f5" stroke-width="2.5"/><rect x="{w/2-32}" y="{h/2-17}" width="64" height="34" rx="6" fill="#d9f6f2" stroke="#14b8a6" stroke-width="2.5"/>'
                 f'<rect x="{w-82}" y="22" width="64" height="34" rx="6" fill="#fdecd9" stroke="#f28a1e" stroke-width="2.5"/><rect x="{w/2-32}" y="{h-58}" width="64" height="34" rx="6" fill="#eee8fd" stroke="#8b5cf6" stroke-width="2.5"/>'
                 f'<path d="M82 39L{w/2-34} {h/2-4}M{w-82} 39L{w/2+34} {h/2-4}M{w/2} {h/2+17}V{h-58}" stroke="#51607f" stroke-width="2.5" fill="none" stroke-linecap="round"/>')
    elif kind == 'sticky':
        cols = ['#ffe27a', '#ffb3c7', '#9fe7ff', '#b8f0b0', '#d9c2ff']
        inner = ''.join(f'<rect x="{12+(i%7)*((w-24)//7)}" y="{14+(i//7)*((h-28)//4)}" width="{(w-24)//7-8}" height="{(h-28)//4-8}" rx="3" fill="{cols[(i*3)%5]}" transform="rotate({(i*7)%9-4} {20+(i%7)*((w-24)//7)} {20+(i//7)*((h-28)//4)})"/>' for i in range(28))
    elif kind == 'kanban':
        cols = ['#dbe6ff', '#fdecd9', '#d9f6f2']
        inner = ''
        cw = (w - 40) / 3
        for c in range(3):
            inner += f'<rect x="{14+c*(cw+6)}" y="14" width="{cw}" height="{h-28}" rx="6" fill="{cols[c]}"/>'
            for k in range(3 - c % 2 + (1 if c == 2 else 0)):
                inner += f'<rect x="{20+c*(cw+6)}" y="{24+k*34}" width="{cw-12}" height="26" rx="4" fill="#fff" stroke="#c3cdea"/><rect x="{26+c*(cw+6)}" y="{31+k*34}" width="{cw-32}" height="4" rx="2" fill="#aab6dc"/>'
    return f'<svg class="pr board" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" rx="8" fill="#fff" stroke="#c3cdea" stroke-width="4"/>{inner}</svg>'


def screen(x, y, w, h, kind='chart', cls=''):
    inner = ''
    if kind == 'chart':
        inner = f'<path d="M10 {h-14}L{w*.25} {h*.55}L{w*.45} {h*.7}L{w*.7} {h*.3}L{w-10} {h*.4}" fill="none" stroke="#5eead4" stroke-width="3" stroke-linejoin="round"/>'
    elif kind == 'bars':
        inner = ''.join(f'<rect x="{10+i*((w-20)//6)}" y="{h-12-((i*37)%60+16)*h/110}" width="{(w-20)//6-5}" height="{((i*37)%60+16)*h/110}" rx="2" fill="#7aa2ff"/>' for i in range(6))
    elif kind == 'ok':
        inner = f'<circle cx="{w/2}" cy="{h/2}" r="{min(w,h)/3.2}" fill="none" stroke="#4ade80" stroke-width="4"/><path d="M{w/2-10} {h/2}l7 8 14-16" fill="none" stroke="#4ade80" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
    elif kind == 'code':
        inner = ''.join(f'<rect x="12" y="{10+i*11}" width="{20+((i*29)%(w-40))}" height="4" rx="2" fill="{["#7aa2ff","#5eead4","#ffd36a","#ff9fb8"][i%4]}"/>' for i in range((h - 14) // 11))
    return f'<svg class="pr scr {cls}" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px" viewBox="0 0 {w} {h}"><rect width="{w}" height="{h}" rx="7" fill="#0e1736" stroke="#3a4a86" stroke-width="3"/>{inner}</svg>'


def lead(aid, x, w=150, cls=''):
    """Standing lead agent: feet on the floor line. data-ag is filled by agentic.js."""
    h = round(w * 1.06)
    return f'<div class="pr lead {cls}" style="left:{x - w//2}px;top:{FLOOR - h + 14}px;width:{w}px;height:{h}px"><span data-ag="{aid}" aria-hidden="true"></span></div>'


def hit(x0, x1, rid, label):
    return f'<button class="hit" type="button" data-room="{rid}" style="left:{x0}px;width:{x1-x0}px" aria-label="{esc(label)}"><span>{esc(label)}</span></button>'


def lift(n, label):
    return (f'<div class="pr lift" style="left:96px;top:96px;width:76px;height:{FLOOR-96}px"><div class="lift-top">{esc(label)}</div>'
            '<div class="lift-doors"><i></i><i></i></div></div>')


# --------------------------------------------------------------------------------------------- floors
THEME = {  # wall top, wall bottom, carpet, accent
    7: ('#1e2858', '#12183a', '#272c52', '#e9b949'),
    6: ('#fbeede', '#f1dcc2', '#cfa77a', '#f28a1e'),
    5: ('#e9f0ff', '#d6e2fb', '#a8bfe8', '#2457f5'),
    4: ('#e2f6f1', '#c8ece2', '#8fd0bf', '#14b8a6'),
    3: ('#232c4f', '#171e3d', '#2a3358', '#7aa2ff'),
    2: ('#eaf6ee', '#d3ebdc', '#a6cdb4', '#22a06b'),
    1: ('#101733', '#0a0f25', '#171e3f', '#5eead4'),
    0: ('#fff4e6', '#fbe6cc', '#d9b88f', '#f28a1e'),
}
LABEL = {7: '7', 6: '6', 5: '5', 4: '4', 3: '3', 2: '2', 1: '1', 0: 'G'}
NAMES = {7: 'Board & C-suite', 6: 'Business', 5: 'Discover', 4: 'Pilot', 3: 'Build', 2: 'Govern', 1: 'Launch', 0: 'Ground'}

ROOMS = [{"id": "board","f": 7,"name": "Boardroom","text": "The Board of Directors and its Chair sit here. Every project answers to these chairs: strategy, money, risk and people."},{"id": "csuite","f": 7,"name": "C-suite offices","text": "CEO, COO, CTO, CFO, CPO, CISO, CMO and CHRO each have an office on this floor."},{"id": "directors","f": 6,"name": "Directors (C-1)","text": "The VPs and directors: Engineering, Product, Delivery and Sales."},{"id": "sales","f": 6,"name": "Sales and Marketing","text": "Account executives, pre-sales and marketing teams. Your first conversation with us usually starts here."},{"id": "procure","f": 6,"name": "Procurement and Finance","text": "Procurement and vendor management, finance and billing."},{"id": "legalhr","f": 6,"name": "Legal and HR","text": "Legal and contracts, HR and talent."},{"id": "sam","f": 5,"name": "SAM, your single point of contact","text": "SAM is our Forward Deployed Engineer and your single point of contact. He runs the whole journey with you."},{"id": "discovery","f": 5,"name": "Discovery studio","text": "Siti leads Discovery with business analysts, solution consultants, UX researchers and data analysts."},{"id": "architect","f": 5,"name": "Architecture room","text": "Wei leads Architecture with solution, data, security and integration architects."},{"id": "pilotbay","f": 4,"name": "Pilot bay","text": "Aiman leads the Pilot with product owners, project and programme managers, scrum masters and UX/UI designers."},{"id": "meet","f": 4,"name": "Meeting rooms","text": "Glass meeting rooms for customer demos and workshops."},{"id": "engineering","f": 3,"name": "Engineering floor","text": "Jun leads Build with front-end, back-end, mobile, AI/ML, data and integration engineers."},{"id": "testlab","f": 3,"name": "Test lab","text": "QA and test automation, with a wall of real devices."},{"id": "checks","f": 2,"name": "Checklists","text": "Security, compliance and risk checklists."},{"id": "governance","f": 2,"name": "Governance office","text": "Mei leads Governance: security, compliance and risk, internal audit, responsible-AI review and data protection."},{"id": "audit","f": 2,"name": "Audit and review","text": "Internal audit, responsible-AI review and data protection."},{"id": "mission","f": 1,"name": "Mission control","text": "Farid leads Launch with DevOps, site reliability, cloud and infrastructure, release and change managers."},{"id": "lobby","f": 0,"name": "Lobby","text": "Reception. This is where every visit starts."},{"id": "academy","f": 0,"name": "Academy and support","text": "Lin leads Enablement with trainers, customer success, the support desk and documentation."},{"id": "launchpad","f": 1,"name": "Launch pad","text": "Where finished work lifts off. Farid launches it and keeps watching it after launch."},{"id": "hall","f": 0,"name": "The Hall","text": "Where launches are celebrated."}]  # the 3D positions live in js/hww3d.js


def room(rid, f, x0, x1, name, text, stop_x=None):
    pass
    return hit(x0, x1, rid, name)


def floor_html(n):
    _n[0] = n * 3
    top, bot, carpet, acc = THEME[n]
    s = ''
    body = ''
    if n == 7:
        for i, x in enumerate((210, 420, 630)):
            body += window(x, 92, 180, 160, True)
        body += pr(720, 96, 210, 110, '<span>STRATEGY<br>RISK · MONEY<br>PEOPLE</span>', 'wallscreen')
        for i in range(8):  # chairs and agents along a long table
            cx = 230 + i * 80
            body += pr(cx + 2, 392, 56, 90, '', 'chairback') + head(cx, 372, 56)
        body += pr(200, 470, 700, 22, '', 'table') + pr(214, 492, 672, 12, '', 'tablefront') + pr(480, 504, 22, 56, '', 'tableleg') + pr(660, 504, 22, 56, '', 'tableleg')
        body += glass(950)
        body += sign(180, 220, 'Boardroom', 'gold') + sign(960, 300, 'C-suite offices', 'gold')
        for i, t in enumerate(['CEO', 'COO', 'CTO', 'CFO', 'CPO', 'CISO', 'CMO', 'CHRO']):
            x = 966 + i * 77
            body += pr(x, 330, 70, 230, '', 'office') + head(x + 4, 404, 52) + pr(x + 2, 478, 66, 12, '', 'tablefront') + pr(x, 300, 70, 22, f'<span>{t}</span>', 'plaque')
        body += room('board', 7, 170, 950, 'Boardroom', 'The Board of Directors and its Chair sit here. Every project answers to these chairs: strategy, money, risk and people.', 560)
        body += room('csuite', 7, 950, 1580, 'C-suite offices', 'CEO, COO, CTO, CFO, CPO, CISO, CMO and CHRO each have an office on this floor.', 1260)
    elif n == 6:
        body += glass(560) + glass(930) + glass(1250)
        body += sign(180, 220, 'Directors (C-1)') + sign(570, 260, 'Sales & Marketing') + sign(940, 280, 'Procurement & Finance') + sign(1260, 240, 'Legal & HR')
        body += window(200, 96, 140, 120)
        body += ''.join(ws(190 + i * 120, 440, None, 0.8) for i in range(3)) 
        body += screen(580, 100, 150, 100, 'chart') + screen(750, 100, 150, 100, 'bars')
        body += ''.join(ws(580 + i * 92, 455, None, 0.62) for i in range(3)) + ''.join(ws(590 + i * 92, 380, None, 0.5) for i in range(3))
        body += pr(960, 96, 160, 110, '<span>LEDGER</span>', 'wallscreen') + ''.join(pr(1150 + i * 24, 330, 20, 230, '', 'cabinet') for i in range(3))
        body += ''.join(ws(950 + i * 100, 450, None, 0.68) for i in range(2))
        body += pr(1290, 100, 190, 130, '<span>⚖ CONTRACTS<br>PEOPLE & TALENT</span>', 'wallscreen')
        body += ''.join(ws(1270 + i * 150, 450, None, 0.72) for i in range(2))
        body += plant(540) + plant(1230)
        body += room('directors', 6, 170, 560, 'Directors (C-1)', 'The VPs and directors: Engineering, Product, Delivery and Sales.', 380)
        body += room('sales', 6, 560, 930, 'Sales and Marketing', 'Account executives, pre-sales and marketing teams. Your first conversation with us usually starts here.', 740)
        body += room('procure', 6, 930, 1250, 'Procurement and Finance', 'Procurement and vendor management, finance and billing.', 1090)
        body += room('legalhr', 6, 1250, 1580, 'Legal and HR', 'Legal and contracts, HR and talent.', 1415)
    elif n == 5:
        body += glass(520) + glass(1050)
        body += sign(180, 240, 'SAM · single point of contact', 'acc') + sign(530, 230, 'Discovery studio  1', 'acc') + sign(1060, 260, 'Architecture room  2', 'acc')
        body += pr(184, 300, 330, 260, '', 'office wide')
        body += pr(190, 470, 200, 22, '', 'table') + pr(200, 492, 180, 10, '', 'tablefront')
        body += f'<div class="pr sam" style="left:250px;top:374px;width:96px;height:112px"><svg viewBox="0 0 70 70" aria-label="SAM">{SAM}</svg></div>'
        body += pr(184, 252, 190, 44, '<b>SAM (FDE)</b><small>Forward Deployed Engineer</small>', 'nameplate')
        body += board(540, 100, 330, 200, 'sticky') + ws(720, 450, None, 0.75)
        body += lead('vera', 700)
        body += ''.join(head(880 + i * 70, 450, 50) for i in range(2)) + pr(850, 508, 190, 12, '', 'tablefront')
        body += board(1080, 96, 250, 190, 'diagram') + pr(1350, 96, 190, 110, '<span>DESIGN<br>REVIEW</span>', 'wallscreen')
        body += lead('atlas', 1330) + ws(1420, 470, None, 0.7)
        body += room('sam', 5, 170, 520, 'SAM, your single point of contact', 'SAM is our Forward Deployed Engineer and your single point of contact. He runs the whole journey with you.', 440)
        body += room('discovery', 5, 520, 1050, 'Discovery studio', 'Siti leads Discovery with business analysts, solution consultants, UX researchers and data analysts.', 540)
        body += room('architect', 5, 1050, 1580, 'Architecture room', 'Wei leads Architecture with solution, data, security and integration architects.', 1170)
    elif n == 4:
        body += glass(1000)
        body += sign(180, 240, 'Pilot bay  3', 'acc') + sign(1010, 240, 'Meeting rooms')
        body += board(200, 96, 360, 200, 'kanban') + pr(590, 100, 230, 150, '<span>LIVE DEMO</span><i></i>', 'wallscreen demo')
        body += ws(220, 450, None, 0.8) + lead('spark', 700) + ws(830, 450, None, 0.8)
        for k, x in enumerate((1030, 1310)):
            body += pr(x, 330, 250, 230, '', 'office wide')
            body += screen(x + 70, 360, 110, 70, 'chart') + pr(x + 30, 480, 190, 16, '', 'table') + pr(x + 40, 496, 170, 8, '', 'tablefront')
            body += ''.join(head(x + 28 + i * 60, 424, 46) for i in range(3))
        body += plant(1000)
        body += room('pilotbay', 4, 170, 1000, 'Pilot bay', 'Aiman leads the Pilot with product owners, project and programme managers, scrum masters and UX/UI designers.', 540)
        body += room('meet', 4, 1000, 1580, 'Meeting rooms', 'Glass meeting rooms for customer demos and workshops.', 1290)
    elif n == 3:
        body += glass(1250)
        body += sign(180, 280, 'Engineering floor  4', 'acc') + sign(1260, 200, 'Test lab')
        body += screen(220, 100, 300, 120, 'code') + pr(560, 100, 330, 110, '<span>BUILD ▸ ▸ ▸</span><em><u></u></em>', 'wallscreen build') + screen(930, 100, 260, 120, 'bars')
        body += ''.join(ws(190 + i * 175, 398, None, 0.6) for i in range(6))
        body += ''.join(ws(200 + i * 190, 476, None, 0.8) for i in range(5) if i != 2)
        body += lead('forge', 640)
        body += ''.join(pr(1280 + (i % 4) * 70, 100 + (i // 4) * 96, 56, 84, '<i></i>', 'device') for i in range(8))
        body += ws(1290, 450, None, 0.78) + ws(1440, 450, None, 0.62) + screen(1280, 320, 120, 70, 'ok')
        body += room('engineering', 3, 170, 1250, 'Engineering floor', 'Jun leads Build with front-end, back-end, mobile, AI/ML, data and integration engineers.', 470)
        body += room('testlab', 3, 1250, 1580, 'Test lab', 'QA and test automation, with a wall of real devices.', 1400)
    elif n == 2:
        body += glass(520) + glass(1060)
        body += sign(180, 240, 'Checklists') + sign(530, 270, 'Governance office  5', 'acc') + sign(1070, 240, 'Audit & review')
        body += board(200, 100, 300, 210, 'scribble') + ''.join(f'<svg class="pr" style="left:{222}px;top:{122+i*38}px;width:28px;height:28px" viewBox="0 0 28 28"><rect width="28" height="28" rx="6" fill="#22a06b"/><path d="M7 14l5 5 9-10" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' for i in range(4))
        body += pr(560, 96, 260, 150, '<span>🛡 SECURE<br>COMPLIANT<br>REVIEWED</span>', 'wallscreen shield') + lead('aegis', 700)
        body += ws(220, 450, None, 0.8) + ws(560, 460, None, 0.7) + ws(870, 460, None, 0.7)
        body += screen(1100, 100, 200, 110, 'ok') + pr(1320, 100, 190, 110, '<span>RESPONSIBLE<br>AI REVIEW</span>', 'wallscreen')
        body += ws(1090, 450, None, 0.8) + ws(1330, 450, None, 0.8)
        body += room('checks', 2, 170, 520, 'Checklists', 'Security, compliance and risk checklists.', 350)
        body += room('governance', 2, 520, 1060, 'Governance office', 'Mei leads Governance: security, compliance and risk, internal audit, responsible-AI review and data protection.', 530)
        body += room('audit', 2, 1060, 1580, 'Audit and review', 'Internal audit, responsible-AI review and data protection.', 1320)
    elif n == 1:
        for i, (c, k) in enumerate([(0, 'chart'), (1, 'bars'), (2, 'ok'), (3, 'chart'), (4, 'bars'), (5, 'ok')]):
            body += screen(430 + i * 160, 96, 150, 120, k, 'wall')
        body += pr(1400, 96, 170, 120, '<span>GO-LIVE<br><b>T-00:10</b></span>', 'wallscreen clock')
        body += sign(180, 250, 'Mission control  6', 'acc')
        body += ''.join(ws(200 + i * 195, 476, None, 0.82) for i in range(7) if i != 3)
        body += ''.join(ws(240 + i * 195, 390, None, 0.6) for i in range(6))
        body += lead('orca', 810)
        body += room('mission', 1, 170, 1580, 'Mission control', 'Farid leads Launch with DevOps, site reliability, cloud and infrastructure, release and change managers.', 640)
    elif n == 0:
        body += pr(18, 90, 70, FLOOR - 90, '', 'door')
        body += glass(640) + glass(1100)
        body += sign(180, 200, 'Lobby', 'acc') + sign(650, 280, 'Academy & support  7', 'acc') + sign(1110, 200, 'The Hall', 'acc')
        body += pr(240, 96, 260, 150, '<img src="assets/images/ypt-logo-320.png" alt="Your Partner Technologies"><span>YOUR PARTNER<br>TECHNOLOGIES</span>', 'wallscreen logo')
        body += pr(330, 478, 200, 82, '', 'reception') + head(396, 420, 54)
        body += pr(190, 520, 120, 40, '', 'sofa') + plant(560) + plant(190, FLOOR - 140, 1.5)
        body += board(670, 100, 330, 190, 'scribble') + lead('sage', 880)
        body += ''.join(ws(680 + i * 110, 478, None, 0.62) for i in range(3))
        body += pr(1110, 470, 470, 90, '', 'stage') + pr(1140, 100, 400, 60, '<span>WELCOME · LAUNCH · WELL DONE</span>', 'wallscreen banner')
        body += '<div class="pr ball" style="left:1330px;top:48px"><i></i></div>' + '<div class="pr beams">' + ''.join(f'<i style="--r:{r}deg;--c:{c}"></i>' for r, c in [(-38, '#ff5fa2'), (-14, '#7aa2ff'), (14, '#ffd36a'), (38, '#5eead4')]) + '</div>'
        body += ''.join(head(1130 + i * 72, 410 + (i % 2) * 14, 54, None, 'cheer') for i in range(6))
        body += room('lobby', 0, 100, 640, 'Lobby', 'Reception. This is where every visit starts.', 420)
        body += room('academy', 0, 640, 1100, 'Academy and support', 'Lin leads Enablement with trainers, customer success, the support desk and documentation.', 700)
        body += room('hall', 0, 1100, 1580, 'The Hall', 'Where launches are celebrated.', 1340)
    lights = ''.join(f'<i style="left:{80 + i * 195}px"></i>' for i in range(8))
    if n == 5:
        pass
    return (f'<div class="fl" data-f="{n}" style="top:{(7 - n) * FH}px;--wt:{top};--wb:{bot};--cp:{carpet};--ac:{acc}">'
            f'<div class="fl-wall"></div><div class="fl-ceil">{lights}</div><div class="fl-floor"></div>'
            f'{lift(n, LABEL[n])}<div class="fl-label">{LABEL[n]}</div>{body}</div>')


# --------------------------------------------------------------------------------------------- data
SAM = ''
src = open(os.path.join(ROOT, 'agentic/js/agentic.js'), encoding='utf8').read()
m = re.search(r"var ARMAN = (.*?);\n\s*html \+=", src, re.S)
if m:
    full = ''.join(re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(1)))
    inner = re.search(r'<svg[^>]*>(.*)</svg>', full, re.S)
    SAM = inner.group(1) if inner else ''

STOPS = [
    {'id': 'lobby', 'f': 0, 'x': 420, 'chip': 'Welcome', 'say': "Welcome to Your Partner Technologies. I'm Alya, and I'll be your escort today. How can I help you?"},
    {'id': 'board', 'f': 7, 'x': 560, 'chip': 'Leadership', 'say': 'Welcome on board. Everything here answers to these chairs: strategy, money, risk and people.'},
    {'id': 'sales', 'f': 6, 'x': 740, 'chip': 'Before stage 1', 'say': 'Your conversation starts on this floor, with sales, procurement, finance, legal and people teams. Then it moves to the people who listen first.'},
    {'id': 'sam', 'f': 5, 'x': 440, 'chip': 'Your single point of contact', 'say': 'This is SAM, our Forward Deployed Engineer. He is your single point of contact and runs the whole journey with you, so you only ever talk to one person.'},
    {'id': 'discovery', 'f': 5, 'x': 540, 'chip': 'Stage 1 of 7 · Discovery', 'say': 'Siti and her team ask questions first. Nothing is built before we understand what you need.'},
    {'id': 'architect', 'f': 5, 'x': 1170, 'chip': 'Stage 2 of 7 · Architect', 'say': 'Wei turns what we heard into a design you can read and challenge.'},
    {'id': 'pilotbay', 'f': 4, 'x': 540, 'chip': 'Stage 3 of 7 · Pilot', 'say': 'Aiman proves the idea small and fast, before anyone commits further.'},
    {'id': 'engineering', 'f': 3, 'x': 470, 'chip': 'Stage 4 of 7 · Build', 'say': "Jun's team builds it. Our agents do the heavy lifting while people steer."},
    {'id': 'governance', 'f': 2, 'x': 530, 'chip': 'Stage 5 of 7 · Governance', 'say': 'Mei checks security, compliance and risk before anything goes live.'},
    {'id': 'mission', 'f': 1, 'x': 640, 'chip': 'Stage 6 of 7 · Launch', 'say': 'Farid launches it, and keeps watching it after launch.'},
    {'id': 'academy', 'f': 0, 'x': 700, 'chip': 'Stage 7 of 7 · Enablement', 'say': 'Lin makes sure your team can run it themselves, so you are never dependent on us.'},
    {'id': 'hall', 'f': 0, 'x': 1340, 'chip': 'Launch day', 'say': "That's how we work, from the first conversation to launch. Ready to start yours?"},
]

LIST = [
    (7, 'Top · Board & C-suite', 'Board of Directors, Chair, CEO, COO, CTO, CFO, CPO, CISO, CMO, CHRO.'),
    (6, 'Business', 'Directors (C-1): VP Engineering, Product, Delivery, Sales. Sales and marketing, procurement and finance, legal and HR.'),
    (5, 'Discover', "SAM, your single point of contact. Stage 1, Siti: business analysts, solution consultants, UX researchers, data analysts. Stage 2, Wei: enterprise, solution, data, security and integration architects."),
    (4, 'Pilot', 'Stage 3, Aiman: product owners, project and programme managers, scrum masters, UX/UI designers.'),
    (3, 'Build', 'Stage 4, Jun: front-end, back-end, mobile, AI/ML, data and integration engineers; QA and test automation.'),
    (2, 'Govern', 'Stage 5, Mei: security, compliance and risk, internal audit, responsible-AI review, data protection.'),
    (1, 'Launch', 'Stage 6, Farid: DevOps, site reliability, cloud and infrastructure, release and change managers.'),
    (0, 'Ground · Lobby, Academy, Hall', 'Reception. Stage 7, Lin: trainers, customer success, support desk, documentation. The Hall for launch celebrations.'),
]


def build():
    sprite = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d6cff"/><stop offset="1" stop-color="#5eead4"/></linearGradient>
<symbol id="ah" viewBox="0 -4 60 76"><rect x="15" y="44" width="30" height="26" rx="9" fill="var(--c)" opacity=".82"/><rect x="22" y="40" width="16" height="8" rx="3" fill="#8a96b8"/>
<rect x="3" y="18" width="7" height="15" rx="3.5" fill="var(--c)"/><rect x="50" y="18" width="7" height="15" rx="3.5" fill="var(--c)"/>
<rect x="8" y="6" width="44" height="36" rx="13" fill="var(--c)"/><rect x="8" y="6" width="44" height="14" rx="9" fill="#fff" opacity=".28"/>
<rect x="14" y="16" width="32" height="19" rx="9" fill="#101936"/><rect x="20" y="21" width="7" height="9" rx="3.5" fill="#9fe7ff"/><rect x="33" y="21" width="7" height="9" rx="3.5" fill="#9fe7ff"/>
<path d="M30 6V0" stroke="#8a96b8" stroke-width="2.4" stroke-linecap="round"/><circle cx="30" cy="-1" r="3.2" fill="var(--c)"/></symbol>
<symbol id="ws" viewBox="0 0 150 70"><rect x="14" y="2" width="58" height="38" rx="5" fill="#1a2244"/><rect x="18" y="6" width="50" height="28" rx="3" fill="url(#scr)" opacity=".92"/>
<path d="M22 14h24M22 20h34M22 26h18" stroke="#fff" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/><rect x="36" y="40" width="14" height="5" fill="#8a96b8"/>
<rect x="0" y="40" width="150" height="9" rx="3" fill="#dcb98f"/><rect x="6" y="49" width="138" height="21" rx="3" fill="#c39a6e"/><rect x="96" y="30" width="30" height="10" rx="2" fill="#f28a1e" opacity=".0"/></symbol>
</defs></svg>'''
    stops_json = json.dumps({'stops': STOPS, 'rooms': ROOMS}, ensure_ascii=False)
    picker = ''.join(f'<button type="button" data-floor="{n}" aria-label="Floor {LABEL[n]}: {esc(NAMES[n])}"><b>{LABEL[n]}</b><span>{esc(NAMES[n])}</span></button>' for n in (7, 6, 5, 4, 3, 2, 1, 0))
    lst = ''.join(f'<details class="pg-q"><summary>Level {LABEL[n]} · {esc(t)}</summary><div><p>{esc(d)}</p></div></details>' for n, t, d in LIST)
    main = f'''<main id="main-content">
{sprite}
<section class="hww" id="hww" aria-label="How We Work: a tour of our building">
  <div class="hww-stage" id="hww-stage">
    <p class="no3d-note">Your browser cannot show the 3D tower. The tour text still works, and every floor is listed below.</p>
    <div class="hww-say" id="hww-say">
      <div class="hww-who"><span class="hww-name">Alya</span><span class="hww-chip" id="hww-chip"></span></div>
      <p id="hww-text" aria-hidden="true"></p><span class="sr" id="hww-sr" role="status"></span>
    </div>
    <div class="hww-choices" id="hww-choices"></div>
    <div class="hww-ctl" id="hww-ctl" role="toolbar" aria-label="Tour controls">
      <button type="button" data-a="prev" aria-label="Previous stop" title="Previous stop">◀</button>
      <button type="button" data-a="next" aria-label="Next stop" title="Next stop">▶</button>
      <span class="sep"></span>
      <button type="button" data-a="up" aria-label="Lift up" title="Lift up">▲</button>
      <button type="button" data-a="down" aria-label="Lift down" title="Lift down">▼</button>
      <span class="sep"></span>
      <button type="button" data-a="left" aria-label="Look left" title="Look left">←</button>
      <button type="button" data-a="right" aria-label="Look right" title="Look right">→</button>
      <button type="button" data-a="zin" aria-label="Zoom in" title="Zoom in">＋</button>
      <button type="button" data-a="zout" aria-label="Zoom out" title="Zoom out">－</button>
      <span class="sep"></span>
      <button type="button" data-a="light" aria-label="Lights on or off" title="Lights on or off" aria-pressed="false">☀</button>
      <button type="button" data-a="restart" aria-label="Restart the tour" title="Restart the tour">⟲</button>
      <button type="button" data-a="skip" class="txt" title="Skip to the last stop">Skip</button>
    </div>
    <div class="hww-floors" id="hww-floors" role="group" aria-label="Floors">{picker}</div>
    <div class="hww-step" id="hww-step" aria-hidden="true"></div>
  </div>
  <script type="application/json" id="hww-data">{stops_json}</script>
  <script type="text/plain" id="sam-svg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">{SAM}</svg></script>
</section>
<section class="sec sec--plain hww-list"><div class="wrap">
  <div class="sec-head"><p class="mono">Prefer to read it?</p><h2 class="h2">Every floor, in one list</h2></div>
  <div class="pg-faq hww-listbox">{lst}</div>
</div></section>
</main>'''
    t = open(PAGE, encoding='utf8').read()
    i = t.index('<main id="main-content">')
    j = t.index('</main>') + len('</main>')
    t = t[:i] + main + t[j:]
    if 'css/hww.css' not in t:
        t = t.replace('</head>', '    <link rel="stylesheet" href="css/hww.css">\n</head>', 1)
    t = t.replace('<body class="has-promo">', '<body class="has-promo hww-page" data-generic>', 1)
    if 'js/hww3d.js' not in t:
        t = t.replace('<script type="module" src="js/agents3d.js', '<script type="module" src="js/hww3d.js"></script>\n<script type="module" src="js/agents3d.js', 1)
    if 'js/hww.js' not in t:
        t = t.replace('<script src="js/agentic.js', '<script src="js/hww.js" defer></script>\n<script src="js/agentic.js', 1)
    open(PAGE, 'w', encoding='utf8').write(t)
    print('built', len(main) // 1024, 'KB main')


if __name__ == '__main__':
    build()

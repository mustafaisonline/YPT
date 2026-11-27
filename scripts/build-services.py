#!/usr/bin/env python3
"""Builds agentic/services.html: two service cards (Custom Agentic AI Solutions, Talent) and, for each, a full-page sheet (dialog) with tabs.
Uses the same sheet markup as the products page, so css/products.css and js/products.js do the opening, tabs and module list.
Run:  python3 scripts/build-services.py   (then python3 scripts/stamp-version.py)
Content: scripts/services_custom.py and scripts/services_talent.py. No invented track record: only things that can be counted on the page.
"""
import re, os, sys, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
os.chdir(os.path.join(ROOT, 'agentic'))
E = html.escape
import services_custom as C
import services_talent as T

a = open('agents.html', encoding='utf8').read()
head = a[:a.index('<main>')]
foot = a[a.index('</main>') + len('</main>'):]
head = re.sub(r'<!-- Design review page.*?-->', '<!-- Services page: custom agentic AI solutions and talent. Kept out of search until launch. -->', head, flags=re.S)
head = head.replace('<title>The YPT Agents | Character Design</title>', '<title>Services | Your Partner Technologies</title>')
head = head.replace('<a href="agents.html" class="on">', '<a href="agents.html">')
head = head.replace('<a href="services.html" data-n="services-nav">', '<a href="services.html" data-n="services-nav" class="on">')
head = head.replace('<a class="btn btn--solid" href="index.html">See them on the homepage <span class="arr">→</span></a>', '<a class="btn btn--solid" href="contact.html">Talk to us <span class="arr">→</span></a>')
head = head.replace('</head>', '    <link rel="stylesheet" href="css/products.css?v=1">\n    <link rel="stylesheet" href="css/services.css?v=1">\n</head>', 1)
foot = foot.replace('<script type="module" src="js/agents3d.js', '<script src="js/products.js?v=1" defer></script>\n<script src="js/services.js?v=1" defer></script>\n<script type="module" src="js/agents3d.js', 1)

CK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
ARR = '<span class="arr">→</span>'


def icon(path, cls=''):
    return f'<svg class="{cls}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{path}</svg>'


def tabbar(sid, tabs):
    return ''.join(f'<button type="button" role="tab" id="ps-{sid}-t-{k}" aria-controls="ps-{sid}-p-{k}" aria-selected="{"true" if i == 0 else "false"}" tabindex="{0 if i == 0 else -1}" data-tab="{k}">{lab}</button>' for i, (k, lab) in enumerate(tabs))


def panels(sid, tabs, body):
    return ''.join(f'<div class="ps-panel" role="tabpanel" id="ps-{sid}-p-{k}" aria-labelledby="ps-{sid}-t-{k}" data-tab="{k}"{"" if i == 0 else " hidden"} tabindex="0">{body[k]}</div>' for i, (k, _) in enumerate(tabs))


def sheet(S, tabs, body, cta):
    sid = S['id']
    return f'''
<div class="ps" id="ps-{sid}" role="dialog" aria-modal="true" aria-labelledby="ps-{sid}-title" hidden style="--c:{S['c']};--cd:{S['cd']};--soft:{S['soft']}">
  <div class="ps-sheet">
    <header class="ps-head">
      <span class="ps-agent"><span data-ag="{S['ag']}" data-v="head"></span></span>
      <div class="ps-ht"><p class="mono">Service · With {S['who']}, {S['role']}</p><h2 id="ps-{sid}-title">{S['name']}</h2><p class="ps-tag">{S['tag']}</p></div>
      <a class="btn ps-demo" href="contact.html">{cta} {ARR}</a>
      <button type="button" class="ps-x" data-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </header>
    <div class="ps-tabs" role="tablist" aria-label="Sections">{tabbar(sid, tabs)}</div>
    <div class="ps-body">{panels(sid, tabs, body)}</div>
  </div>
</div>'''


def rows(pairs):
    return '<ul class="ps-prob">' + ''.join(f'<li><span class="ps-q">{E(q)}</span><span class="ps-a">{CK}{E(a_)}</span></li>' for q, a_ in pairs) + '</ul>'


def nums(items):
    return '<div class="ps-nums sv-nums">' + ''.join(f'<div class="ps-num"><b>{n}</b><span>{E(t)}</span></div>' for n, t in items) + '</div>'


def fgrid(items):
    return '<ul class="ps-fgrid">' + ''.join(f'<li class="ps-fi">{CK}<div><b>{E(t)}</b><span>{E(d)}</span></div></li>' for t, d in items) + '</ul>'


# ------------------------------------------------------------------------------------------------ custom solutions
CUSTOM = dict(id='custom', name='Custom Agentic AI Solutions', short='Custom Agentic AI Solutions', tag='Any solution you can describe, built by our agents',
              who='Jun', role='Builder Agent', ag='forge', c='#2457f5', cd='#1a3fd0', soft='#e6ecff')
ctabs = [('overview', 'Overview'), ('solutions', 'What we can build'), ('how', 'How it works'), ('offer', 'The $100 offer')]

kind_cards = ''.join(
    f'<article class="sv-kind"><span class="sv-kic">{icon(k[5])}</span><div><h5>{E(k[1])}</h5><p class="sv-like">The kind of system you know as <b>{E(k[2])}</b></p>'
    f'<p>{E(k[3])}</p><ul>{"".join(f"<li>{E(x)}</li>" for x in k[4])}</ul></div></article>' for k in C.KINDS)
steps_rows = rows([(f'{n}. {t}', d) for n, (ag, t, who, d) in enumerate(C.STEPS, 1)])
cbody = {
    'overview': (
        '<p class="ps-lead">Tell us what you need. Our agents build it, and the solution you get can talk to you.</p>'
        '<p class="ps-about">If you can describe a business system in words, we can create it. That includes the kind of systems you already know from the market: customer management, ERP, HR, ticketing, knowledge bases, master data, support desks, dashboards and more. '
        'We build a new one around your business, with your words, your steps and your rules.</p>'
        + nums([(len(C.KINDS), 'kinds of system we build'), (len(C.STEPS), 'steps from idea to launch'), (len(C.EVERY), 'things included in every one'), ('$100', 'launch offer, first 500 customers')])
        + '<h4 class="ps-h4">Included in every solution</h4>' + fgrid(C.EVERY)
        + '<h4 class="ps-h4">Why people choose this</h4><div class="ps-personas sv-pillars">' + ''.join(f'<div class="ps-card ps-persona"><h5>{E(t)}</h5><p>{E(d)}</p></div>' for t, d in C.PILLARS) + '</div>'),
    'solutions': (
        '<p class="ps-intro">Pick the kind of system closest to what you have in mind. We shape it to your business, so it will not look like anyone else\'s.</p>'
        f'<div class="sv-kinds">{kind_cards}</div><p class="ps-note sv-note">{E(C.REPLICA_NOTE)} Not on the list? <a href="contact.html">Tell us what you need</a>. If it can be described, it can be built.</p>'),
    'how': (
        '<p class="ps-intro">Five steps, each with its own agent. You stay in the loop, and nothing goes live without your say.</p>'
        '<ol class="ps-journey">' + ''.join(f'<li>{E(t)}</li>' for _, t, _, _ in C.STEPS) + '</ol>'
        '<h4 class="ps-h4">What happens at each step</h4>' + steps_rows),
    'offer': (
        f'<div class="sv-offerbox"><p class="mono">Limited-time offer</p><h3>{C.OFFER}</h3><p class="sv-offer-sub">{C.OFFER_SUB}</p>'
        '<p>Tell us the system you want. We will confirm the details with you and get started.</p>'
        f'<a class="btn btn--solid" href="contact.html">Claim your spot {ARR}</a></div>'
        '<h4 class="ps-h4">Questions people ask</h4>' + rows(C.CUSTOM_FAQ)),
}

# ------------------------------------------------------------------------------------------------ talent
TALENT = dict(id='talent', name='Talent: IT specialists, anywhere in the world', short='Talent', tag='The right people for any IT role, found for you',
              who='Lin', role='Enablement Agent', ag='sage', c='#0f9d8f', cd='#0b7a6e', soft='#d9f6f2')
ttabs = [('overview', 'Overview'), ('roles', 'Roles and job descriptions'), ('how', 'How it works'), ('practices', 'Best practices')]

role_i = 0
nav, det = '', ''
fam_chips = '<div class="sv-fams" role="group" aria-label="Filter roles by family"><button type="button" class="sv-fam on" data-f="all">All roles</button>' + ''.join(
    f'<button type="button" class="sv-fam" data-f="{i}">{E(fn)}</button>' for i, (fn, _) in enumerate(T.FAMILIES)) + '</div>'
VERB = {'do': 'M5 12.5l4.5 4.5L19 7.5', 'must': 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z', 'nice': 'M12 5v14M5 12h14'}
for fi, (fname, roles) in enumerate(T.FAMILIES):
    for (name, one, summ, resp, must, nice) in roles:
        nav += f'<button type="button" class="ps-mod{" on" if role_i == 0 else ""}" data-m="{role_i}" data-fam="{fi}"><b>{E(name)}</b><span>{E(fname)}</span></button>'
        def vb(label, key, items):
            return (f'<div class="ps-verb"><div class="ps-vl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{VERB[key]}"/></svg><b>{label}</b></div>'
                    f'<ul>{"".join(f"<li>{E(x)}</li>" for x in items)}</ul></div>')
        det += (f'<div class="ps-moddet" data-m="{role_i}" data-fam="{fi}"{"" if role_i == 0 else " hidden"}><h4>{E(name)}</h4><p class="ps-purpose">{E(summ)}</p><p class="mono ps-who">Family: {E(fname)}</p>'
                + vb('What they do', 'do', resp) + vb('Must have', 'must', must) + vb('Nice to have', 'nice', nice)
                + f'<p class="sv-jdcta"><a class="btn btn--solid" href="contact.html">Hire a {E(name)} {ARR}</a></p></div>')
        role_i += 1

jd_tpl = ('<div class="ps-card sv-tpl"><h5>A job description that works</h5><ol>'
          '<li><b>Title and level</b> A standard title and a clear level.</li>'
          '<li><b>The outcome</b> What this person will achieve in six months.</li>'
          '<li><b>What they will do</b> Four to six responsibilities, in plain words.</li>'
          '<li><b>Must have</b> Four or five real requirements that can be shown.</li>'
          '<li><b>Nice to have</b> A short list of extras that help.</li>'
          '<li><b>The team and how we work</b> Who they join, how decisions are made.</li>'
          '<li><b>Working pattern</b> Location, time zones and hours.</li>'
          '<li><b>The process</b> The interview steps and how long it takes.</li></ol></div>')
tbody = {
    'overview': (
        '<p class="ps-lead">Any IT role, from anywhere in the world, found for you.</p>'
        '<p class="ps-about">Data engineers, AI engineers, data scientists, iOS developers and every other IT role you need. Tell us the role. We agree a best-practice job description with you, search worldwide, screen the candidates and bring you a short list.</p>'
        + nums([(T.ROLE_COUNT, 'roles with ready job descriptions'), (len(T.FAMILIES), 'role families'), (len(T.HIRE_STEPS), 'steps from brief to start'), (len(T.JD_PRACTICES), 'job description best practices')])
        + '<h4 class="ps-h4">The families of roles we hire for</h4><div class="sv-famgrid">' + ''.join(
            f'<div class="ps-card sv-famcard"><h5>{E(fn)}</h5><p>{E(", ".join(r[0] for r in rs))}</p></div>' for fn, rs in T.FAMILIES) + '</div>'
        + '<h4 class="ps-h4">What you can expect</h4>' + fgrid([
            ('A clear job description first', 'We agree what good looks like before the search starts.'),
            ('A short list, not a pile of CVs', 'A few well-matched people, each with a summary and evidence.'),
            ('Worldwide reach', 'Remote across time zones, or in the place you need.'),
            ('Help to the finish', 'Interview guidance, offer support and a good start.')])),
    'roles': (
        '<p class="ps-intro">Pick a role to see a best-practice job description. Use it as it is, or let us tailor it to your team.</p>' + fam_chips
        + f'<div class="ps-modules sv-roles"><nav class="ps-modnav" aria-label="Roles">{nav}</nav><div class="ps-modbody">{det}</div></div>'),
    'how': (
        '<p class="ps-intro">Six steps from your brief to a successful start. You always see the evidence behind a recommendation.</p>'
        '<ol class="ps-journey">' + ''.join(f'<li>{E(t)}</li>' for t, _ in T.HIRE_STEPS) + '</ol>'
        '<h4 class="ps-h4">What happens at each step</h4>' + rows([(f'{i}. {t}', d) for i, (t, d) in enumerate(T.HIRE_STEPS, 1)])
        + '<h4 class="ps-h4">Questions people ask</h4>' + rows(T.TALENT_FAQ)),
    'practices': (
        '<p class="ps-intro">A good job description attracts the right people and makes the decision easier. These are the practices we follow, and the template we start from.</p>'
        + rows(T.JD_PRACTICES) + jd_tpl),
}

# ------------------------------------------------------------------------------------------------ page
sheets = sheet(CUSTOM, ctabs, cbody, 'Claim your $100 spot') + sheet(TALENT, ttabs, tbody, 'Tell us the role')

kind_tiles = ''.join(
    f'<button type="button" class="sv-tile" data-open="custom" data-tab="solutions" aria-haspopup="dialog"><span class="sv-kic">{icon(k[5])}</span><b>{E(k[1])}</b><span class="sv-like">like {E(k[2].split(", ")[0])}</span></button>' for k in C.KINDS)
fam_pills = ''.join(f'<span>{E(fn)}</span>' for fn, _ in T.FAMILIES)
steps_flow = ''.join(f'<li><span data-ag="{ag}" data-v="head"></span><b>{E(t)}</b><span>{E(who)}.</span></li>' for ag, t, who, d in C.STEPS)
pillars = ''.join(f'<div class="sv-pillar rv"><span class="sv-pn">{i}</span><h3>{E(t)}</h3><p>{E(d)}</p></div>' for i, (t, d) in enumerate(C.PILLARS, 1))

main = f'''<main>
    <section class="page-head prod-head sv-head">
        <div class="wrap prod-head-in">
            <div>
                <p class="mono eyebrow"><i></i>Services</p>
                <h1 class="h1">Tell us what you need. <span class="hl">We build it, or find who will.</span></h1>
                <p class="lede">Two services, one promise. Our agents build any solution you can describe, and we find the right IT people, anywhere in the world, when you need a team.</p>
                <p class="sv-offerline"><b>Any solution for $100</b> <span>for our first 500 customers</span></p>
            </div>
            <div class="guide-bubble" id="guide-bubble">
                <span class="gb-ag" data-ag="guide"></span>
                <div class="gb-say"><b>Alya</b><span id="gb-text">Hi, I'm Alya. Open a service and I will tell you how it works.</span>
                    <span class="gb-btns"><a class="btn btn--solid" href="#services">See the services</a><a class="btn" href="contact.html">Talk to a person</a></span></div>
            </div>
        </div>
    </section>

    <section class="sec" id="services" style="padding-top:36px">
        <div class="wrap">
            <div class="sv-cards">
                <button type="button" class="sv-card sv-card--custom" id="custom" data-open="custom" aria-haspopup="dialog" data-name="Custom Agentic AI Solutions" data-who="Jun" style="--c:#2457f5;--cd:#1a3fd0;--soft:#e6ecff">
                    <span class="sv-badge">Service 1 · Limited offer</span>
                    <span class="sv-cag"><span data-ag="forge" data-v="head"></span></span>
                    <b class="sv-ct">Custom Agentic AI Solutions</b>
                    <span class="sv-cp">Any system you can describe. A CRM, an ERP, an HR system, ticketing, a knowledge base, master data and more. Built by our agents, and it talks back.</span>
                    <span class="sv-chips"><span>Any kind</span><span>Chat and voice</span><span>Made for you</span></span>
                    <span class="sv-price"><b>$100</b><span>for our first 500 customers</span></span>
                    <span class="sv-go">Open this service <i aria-hidden="true">→</i></span>
                </button>
                <button type="button" class="sv-card sv-card--talent" id="talent" data-open="talent" aria-haspopup="dialog" data-name="Talent" data-who="Lin" style="--c:#0f9d8f;--cd:#0b7a6e;--soft:#d9f6f2">
                    <span class="sv-badge">Service 2</span>
                    <span class="sv-cag"><span data-ag="sage" data-v="head"></span></span>
                    <b class="sv-ct">Talent, anywhere in the world</b>
                    <span class="sv-cp">Data engineers, AI engineers, data scientists, iOS developers and every other IT role. With best-practice job descriptions, ready to use.</span>
                    <span class="sv-chips"><span>{T.ROLE_COUNT} roles</span><span>Worldwide</span><span>Ready job descriptions</span></span>
                    <span class="sv-price"><b>Tell us the role</b><span>We agree the brief, then search</span></span>
                    <span class="sv-go">Open this service <i aria-hidden="true">→</i></span>
                </button>
            </div>
        </div>
    </section>

    <section class="sec sec--plain" id="build">
        <div class="wrap">
            <div class="sec-head rv">
                <p class="mono">Custom Agentic AI Solutions</p>
                <h2 class="h2">Whatever you have seen in the market, <span class="hl">we can build yours.</span></h2>
                <p class="lede">Pick the kind of system you have in mind. We create a new one around your business, and it can talk to you.</p>
            </div>
            <div class="sv-tiles rv">{kind_tiles}</div>
            <p class="sv-fine">{E(C.REPLICA_NOTE)}</p>
            <div class="sv-every rv"><h3>Every solution comes with</h3><ul>{''.join(f'<li>{CK}<b>{E(t)}</b><span>{E(d)}</span></li>' for t, d in C.EVERY)}</ul></div>
        </div>
    </section>

    <section class="sec" id="how">
        <div class="wrap">
            <div class="sec-head rv">
                <p class="mono">How it works</p>
                <h2 class="h2">From one sentence to <span class="hl">a working system.</span></h2>
                <p class="lede">Five steps, each with its own agent. You stay in the loop, and people check every result.</p>
            </div>
            <ol class="pflow rv">{steps_flow}</ol>
            <div class="sv-pillars rv">{pillars}</div>
        </div>
    </section>

    <section class="sec sec--plain" id="people">
        <div class="wrap">
            <div class="sv-talent rv">
                <div>
                    <p class="mono">Talent</p>
                    <h2 class="h2">Need people, <span class="hl">not just software?</span></h2>
                    <p class="lede">We find IT specialists for you anywhere in the world, from data engineers and AI engineers to iOS developers, cloud, security and leadership roles. Every role comes with a best-practice job description.</p>
                    <div class="sv-pills">{fam_pills}</div>
                    <p><button type="button" class="btn btn--solid" data-open="talent" data-tab="roles">See the roles and job descriptions {ARR}</button></p>
                </div>
                <div class="sv-talent-ag"><span data-ag="sage"></span></div>
            </div>
            <div class="prod-cta rv"><p>Ready to start? <b>Tell us what you need</b>, a solution or a person, and we will take it from there.</p><a class="btn btn--solid" href="contact.html">Talk to us {ARR}</a></div>
        </div>
    </section>
</main>
<div class="ps-backdrop" id="ps-backdrop" hidden></div>{sheets}'''
open('services.html', 'w', encoding='utf8').write(head + main + foot)
print('ok', len(head + main + foot) // 1024, 'KB', T.ROLE_COUNT, 'roles')

"""Content for the Staff Transfer Management System product sheet.
Everything here comes from the real code in the demo build (a public-sector staff transfer and placement portal for an organisation with many sites).
All names, places and figures are masked and generic. What is not built (e-mail or other notifications, password reset, single sign-on, a feed from a real HR system,
adding or editing users inside the portal, a facility head recommendation step, browser tests) is left out on purpose or stated as not built.
Sample figures on the dashboard tab are invented and labelled as sample data."""
import html

E = html.escape

NAME = 'Staff Transfer Management System'

LEAD = 'Staff ask to move, the system finds swaps and chains that work for everyone, and officers approve, with every step on record.'
ABOUT = ('The product is a transfer and placement portal for an organisation with many sites. A staff member lists up to three places they would like to move to. '
         'The system looks for an open post, a direct swap, or a chain of people who each move to the next person\'s site, always between people of the same grade. '
         'Nobody leaves a site unless the gap is filled or the site stays above a minimum staffing level. Everyone in a proposal must accept, an officer approves, and every step is written to an audit trail. '
         'Matching only proposes: a person is never moved automatically.')
PROBLEMS = [
    ('Moves are arranged by hand and by phone', 'The system searches every open request and every open post for vacancy moves, swaps and chains, and explains why it picked each one.'),
    ('Nobody knows where posts are open', 'Staff can explore sites with open posts for their grade and how many colleagues want to move there. Counts only, no names.'),
    ('Fairness is hard to show', 'Waiting time, remote service, the person\'s own preference and the length of the chain are scored with weights an administrator sets, and the approver sees the score breakdown.'),
    ('A move leaves a gap behind', 'By default nobody is released until the post is filled, and a site cannot fall below a set share of its approved posts.'),
    ('No trail when a decision is questioned', 'Every request, proposal, consent, approval, rule change, export and sign-in is recorded with who, when, and the values before and after.'),
]
PERSONAS = [
    ('Staff member', 'Lists up to three wishes, follows the request through four steps, accepts or declines a match, withdraws a request, and explores open posts.'),
    ('Site head', 'Sees their own site: establishment, requests and proposals. Read-only.'),
    ('Regional officer', 'Sees their own region and approves moves inside it. Records support for moves that cross regions.'),
    ('Central administrator', 'Runs matching, approves any proposal, edits the rules and exports reports. Sees everything.'),
    ('Auditor', 'Reads every dashboard, the audit trail, the sign-in log and the data lineage. Cannot change anything.'),
]
GLANCE = [('5', 'roles'), ('3', 'kinds of move'), ('3', 'ranked wishes'), ('2', 'approval levels'), ('7', 'reports'), ('3', 'languages')]
JTITLE = 'The journey of a transfer request'
JOURNEY = ['Submitted', 'Matched, awaiting consent', 'Pending approval', 'Completed']

FEATINTRO = '{n} features, grouped by what they do for the person asking to move and for the officer deciding. Open the Modules tab to see them by screen.'
FEATURES = [
    ('Ask to move', [
        ('Up to three ranked wishes', 'Choose a particular site or a whole region, in order of preference.'),
        ('A reason', 'Return to home area, family, health, spouse, education or other, with an optional note.'),
        ('One live request at a time', 'A second request is refused until the first is withdrawn or finished.'),
        ('Follow it in four steps', 'Submitted, matched and awaiting consent, pending approval, completed. Shown on the home page.'),
        ('Explore sites', 'Open posts for your grade and how many colleagues want to move there. Counts only: identities stay hidden until a match is proposed.'),
        ('Withdraw', 'A request can be withdrawn while it is still only submitted.')]),
    ('Find the moves', [
        ('Vacancy moves', 'A person moves into an open post for their grade.'),
        ('Direct swaps', 'Two people of the same grade each want the other\'s site.'),
        ('Chains', 'A ring of three, four or more people, each moving to the next person\'s site. The longest allowed chain is a setting.'),
        ('Chains that end in a vacancy', 'A path that ends in an open post, which frees one person\'s old post for the next.'),
        ('Like for like', 'Only people of the same grade are matched. Staff who are bonded are not matched.'),
        ('Same answer every time', 'The same data and rules always give the same proposals, and every proposal says why.')]),
    ('Protect the sites', [
        ('Nobody leaves without cover', 'By default a person is released only when their post is filled by the move.'),
        ('Minimum staffing guard', 'A move that is not filled behind may not take a site below a set share of its approved posts.'),
        ('Reasons for no match', 'Each unmatched request says why: no open post or partner, a guard would be broken, or the partner is already used.'),
        ('Establishment view', 'Approved posts against people in post for every site and grade, with the vacancies left.')]),
    ('Agree and decide', [
        ('Consent from everyone', 'Every person in a proposal must accept. One decline cancels it and everyone returns to the open list.'),
        ('Colleagues stay anonymous', 'Other people in a proposal appear to a staff member only as Colleague.'),
        ('Two levels of approval', 'A regional officer approves moves inside the region. Moves across regions need central approval.'),
        ('Four-eyes check', 'An officer can never decide a proposal that contains their own record.'),
        ('Records move on approval', 'Approving updates every person\'s site and marks every request completed, in one step.')]),
    ('See what is happening', [
        ('Overview', 'Staff in scope, open requests, open posts, proposals in progress and approved transfers, with charts.'),
        ('Supply and demand map', 'A tile map of regions showing net leaving or coming, with a table beside it.'),
        ('Matching performance', 'Average chain length, acceptance rate, time to approve, proposals by kind and outcome, and waiting time of open requests.'),
        ('Match finder', 'For an unmatched request, ranks other places that could work and checks the best ones against the real engine. A model fitted on synthetic data.'),
        ('Acceptance predictor', 'Estimates how likely each person is to accept and the chance a whole proposal completes. Illustrative: fitted on simulated behaviour.'),
        ('Hotspot forecast', 'Projects where requests and shortages are heading, backtested against simple baselines. Illustrative on sample data.')]),
    ('Control and trust', [
        ('Five roles, checked on the server', 'Staff member, site head, regional officer, central administrator and auditor see different menus and data, and every action is checked on the server.'),
        ('Rules are settings, versioned', 'Chain length, minimum staffing, score weights and the backfill rule are edited by an administrator. Each change makes a new version, and every proposal records the version that made it.'),
        ('Audit trail', 'Append-only record of who did what and when, with the values before and after.'),
        ('Sign-in log', 'Every successful and failed sign-in and sign-out.'),
        ('Seven reports as CSV', 'Requests register, approved transfers, vacancies, open requests, proposals and decisions, user access review and a data inventory. Every download is recorded.'),
        ('Data lineage, ERD and dictionary', 'Pages that show where each figure comes from, how the tables relate and what every column means.'),
        ('Three languages and a phone-friendly layout', 'Switch language on any screen, and install it as an app with an offline page.')]),
]

MODINTRO = 'Eleven modules. Pick one to see exactly what a person can do in it. Matching only proposes: people consent and officers decide.'
MODULES = [
    ('My home', 'Where a staff member sees their posting and request.', 'Staff member', {
        'View': ['Current site, region, grade and years in service', 'The request tracker in four steps', 'Posts open now at the wished places', 'How many colleagues want to move to your site, as a count', 'A banner when a match is waiting for an answer']}),
    ('New transfer request', 'Ask to move.', 'Staff member', {
        'Create': ['Up to three ranked wishes: a site or a whole region', 'A reason and an optional note'],
        'Automatic': ['Refused if you already have a live request', 'Request number assigned', 'Written to the audit trail']}),
    ('Explore sites', 'Find where posts are open.', 'Staff member', {
        'View': ['Sites with open posts for your grade', 'How many colleagues want to move there', 'Filter by region']}),
    ('My matches and my requests', 'Answer a proposal and track requests.', 'Staff member', {
        'View': ['Each proposal as a picture of who moves where, with others shown as Colleague', 'Your request history with status'],
        'Update': ['Accept a move', 'Decline a move (the proposal is cancelled)'],
        'Remove': ['Withdraw a request that is still only submitted']}),
    ('Overview and dashboards', 'The state of transfers at a glance.', 'Administrators, officers, site heads, auditors (scoped by role)', {
        'View': ['Staff in scope, open requests, open posts, proposals in progress, approved transfers', 'Requests by status and approved transfers per month', 'Open requests by region and longest waiting', 'Supply and demand tile map', 'Establishment: approved posts against people in post', 'Matching performance: chain length, acceptance rate, time to approve']}),
    ('Transfer requests', 'Every request in scope.', 'Administrators, officers, site heads, auditors (scoped by role)', {
        'View': ['List of requests with staff number, grade, site, reason, status and days waiting', 'Filter by status']}),
    ('Matching console', 'Run the engine, consent, approve.', 'Central administrator runs and approves; regional officers approve in their region', {
        'View': ['A preview of what the next run would match and why others stay unmatched', 'Each proposal as a picture, with score, rule version, chance to accept and why it ranked', 'Filter by in progress, awaiting consent, pending approval, approved, rejected, cancelled'],
        'Create': ['Run matching now'],
        'Update': ['Approve or reject a proposal with a comment', 'Record support for a move that crosses regions'],
        'Automatic': ['Every approved move updates each person\'s site and completes the requests', 'Four-eyes check', 'Every step written to the audit trail']}),
    ('Match finder, acceptance predictor, hotspot forecast', 'Three helpers that are illustrative.', 'Administrators, officers, site heads (scoped by role)', {
        'View': ['Other places an unmatched request could ask for, checked against the real engine', 'Chance each person accepts and the chance a proposal completes, with the weakest link', 'Projected requests and shortages, with a backtest'],
        'Automatic': ['Each is labelled as fitted on synthetic data or simulated behaviour']}),
    ('Rules', 'Matching rules as settings.', 'Central administrator edits; others read', {
        'View': ['Every rule with its current value and version'],
        'Update': ['Change the longest chain, the minimum staffing share, the score weights or the backfill rule'],
        'Automatic': ['Each change creates a new version and an audit row', 'Each proposal records the version that made it']}),
    ('Users and reports', 'Who has access, and the numbers to take away.', 'Central administrator and auditor', {
        'View': ['Accounts with role, site or region, status and last sign-in', 'Seven reports with a preview'],
        'Export': ['CSV of requests, approved transfers, vacancies, open requests, proposals, user access and data inventory'],
        'Automatic': ['Every export is recorded in the audit trail']}),
    ('Governance', 'The memory and the map of the system.', 'Central administrator and auditor', {
        'View': ['Audit trail by record type, with values before and after', 'Sign-in log', 'Data lineage and table lineage', 'ERD', 'Database browser', 'Data dictionary'],
        'Automatic': ['The audit trail is append-only: it can be read but never edited from the portal']}),
]

# concept model
ONTO = {
    'user': ('User', 'people', 'A person who signs in, with a role and, for some roles, a site or region.', ['Name and sign-in', 'Role', 'Preferred language', 'Active or switched off']),
    'role': ('Role', 'people', 'What a user may see and do. Five exist: staff member, site head, regional officer, central administrator and auditor.', ['Name', 'Menus and data in scope']),
    'staff': ('Staff member', 'people', 'A person on the establishment who may ask to move.', ['Staff number', 'Grade and current site', 'Home region and service start', 'Years of remote service', 'Status: active, on leave or bonded']),
    'grade': ('Grade', 'master', 'The kind of post a person holds. Moves only happen between people of the same grade.', ['Code and category', 'Label in three languages']),
    'site': ('Site', 'master', 'A place where people work.', ['Code and name', 'Type: hospital, health centre, village clinic or district office', 'Region and district', 'Urban, semi-urban or remote']),
    'region': ('Region', 'master', 'A group of sites, used for scope and for wishing for a whole region.', ['Code', 'Name in three languages']),
    'post': ('Post', 'master', 'How many people of a grade a site is approved to have. The gap is the vacancy.', ['Site and grade', 'Approved count']),
    'request': ('Transfer request', 'flow', 'A staff member\'s ask to move.', ['Request number', 'Reason and note', 'Status: submitted, matched, awaiting consent, pending approval, approved, completed, withdrawn or rejected']),
    'wish': ('Wish', 'flow', 'One ranked place on a request, either a site or a whole region.', ['Rank 1 to 3', 'Site or region']),
    'proposal': ('Proposal', 'flow', 'A set of moves the engine suggests together: a vacancy move, a swap or a chain.', ['Proposal number and kind', 'Score and explanation', 'Rule version', 'Status']),
    'leg': ('Move', 'flow', 'One person\'s part in a proposal: from one site to another.', ['Order in the chain', 'From site and to site', 'Consent: pending, accepted or declined']),
    'approval': ('Approval', 'trust', 'An officer\'s decision on a proposal.', ['Level: region or central', 'Approved or rejected', 'Comment and time']),
    'rule': ('Rule', 'master', 'A matching setting with a version number.', ['Key and value', 'Version and start date', 'Note']),
    'audit': ('Audit entry', 'trust', 'One line in the append-only record of changes.', ['Who, what and when', 'Value before and after']),
}
POS = {'user': (110, 60), 'role': (110, 190), 'staff': (110, 320), 'audit': (110, 440),
       'request': (380, 60), 'wish': (380, 190), 'grade': (380, 320), 'post': (380, 440),
       'proposal': (640, 60), 'leg': (640, 190), 'site': (640, 320), 'rule': (640, 440),
       'approval': (890, 60), 'region': (890, 320)}
EDGES = [('user', 'role', 'has'), ('user', 'audit', 'leaves'), ('user', 'staff', 'may be'), ('staff', 'request', 'files'), ('request', 'wish', 'ranks'),
         ('wish', 'site', 'points to'), ('staff', 'grade', 'holds'), ('staff', 'site', 'works at'), ('site', 'region', 'is in'), ('post', 'site', 'is at'),
         ('post', 'grade', 'is for'), ('proposal', 'leg', 'contains'), ('leg', 'staff', 'moves'), ('leg', 'site', 'goes to'), ('proposal', 'approval', 'needs'),
         ('approval', 'user', 'is made by'), ('proposal', 'rule', 'follows')]
EXTRAS = [('Sign-in record', 'Each successful and failed sign-in and sign-out.'), ('Session', 'A signed-in browser, which expires.'),
          ('Reason', 'Return to home area, family, health, spouse, education or other.'), ('Site type', 'Hospital, health centre, village clinic or district office.')]
GROUPCOL = {'people': '#7a4cf0', 'flow': '#0b8678', 'master': '#f28a1e', 'trust': '#2457f5'}
GROUPNAME = {'people': 'People', 'flow': 'Transfers', 'master': 'Master data', 'trust': 'Trust'}
LEGEND = ('people', 'master', 'flow', 'trust')
CANVAS = (1000, 500)
ONTOHINT = 'The arrows read as a sentence: <b>Proposal contains Move</b>, <b>Staff member files Transfer request</b>.'

TAX = '''<div class="ps-tax">
<div class="ps-card"><h5 class="mono">A request&#39;s life</h5><ul class="ps-flow ps-h"><li>Submitted</li><li>Matched, awaiting consent</li><li>Pending approval</li><li>Completed</li></ul><p>It can also be withdrawn by the person, or rejected by an officer.</p></div>
<div class="ps-card"><h5 class="mono">Three kinds of move</h5><ul class="ps-flow"><li>Vacancy move <b>into an open post for your grade</b></li><li>Swap <b>two people trade sites</b></li><li>Chain <b>a ring of people, or a path that ends in an open post</b></li></ul></div>
<div class="ps-card"><h5 class="mono">Who may do what</h5><ul class="ps-flow"><li>Staff member <b>own request, accept or decline, explore</b></li><li>Site head <b>sees own site</b></li><li>Regional officer <b>sees own region, approves inside it</b></li><li>Central administrator <b>runs matching, approves any, edits rules</b></li><li>Auditor <b>reads everything, changes nothing</b></li></ul></div>
<div class="ps-card"><h5 class="mono">The matching settings</h5><ul class="ps-flow"><li>Longest chain <b>default 4</b></li><li>Minimum staffing <b>default half of approved posts</b></li><li>Release only with cover <b>on</b></li><li>Score weights <b>waiting, remote service, preference, chain length, leaving a post empty</b></li></ul></div>
<div class="ps-card"><h5 class="mono">Why a request may stay unmatched</h5><ul class="ps-flow"><li>No open post or partner</li><li>It would take a site below the minimum</li><li>The partner is already in another proposal, or the chain is too long</li></ul></div>
<div class="ps-card"><h5 class="mono">Who must agree</h5><ul class="ps-flow ps-h"><li>Every person in the proposal</li><li>A regional officer, inside the region</li><li>Central, across regions</li></ul></div>
</div>'''

SHOTDIR = 'img/products/staff'
SHOTNOTE = 'The organisation shown is a sample, with sample sites, regions and staff numbers.'
SHOTS = [
    ('01-matching-console', 'The matching console', 'Proposals as pictures: a chain of three, and a chain that ends in an open post, each with its score and why it ranked.'),
    ('02-my-matches', 'A match for a staff member', 'A swap shown as who moves where, with the other person as Colleague, and a clear accept or decline.'),
    ('03-staff-home', 'The staff home page', 'Current posting, the request tracker in four steps, and a banner when a match is waiting.'),
    ('04-supply-demand', 'Supply and demand', 'A tile map of regions showing net leaving or coming, with open posts beside it.'),
    ('05-audit-trail', 'The audit trail', 'Every consent, approval and matching run on record, with values before and after.'),
]
SHOTALT = 'Staff Transfer Management System'


def _donut(parts, cols, label):
    import math
    r, cx, cy, circ = 46, 60, 60, 2 * math.pi * 46; off = 0; out = []
    for (lab, v), col in zip(parts, cols):
        ln = v / 100 * circ
        out.append(f'<circle r="{r}" cx="{cx}" cy="{cy}" fill="none" stroke="{col}" stroke-width="22" stroke-dasharray="{ln:.1f} {circ - ln:.1f}" stroke-dashoffset="{-off:.1f}" transform="rotate(-90 {cx} {cy})"/>'); off += ln
    svg = f'<svg viewBox="0 0 120 120" class="ps-donut" role="img" aria-label="{E(label)}">{"".join(out)}</svg>'
    return '<div class="ps-donutwrap">' + svg + '<ul class="ps-leg">' + ''.join(f'<li><i style="background:{c}"></i>{l} <b>{v}%</b></li>' for (l, v), c in zip(parts, cols)) + '</ul></div>'


def _bars(rows, col, unit=''):
    m = max(v for _, v in rows)
    return '<ul class="ps-bars">' + ''.join(f'<li><span>{E(l)}</span><div><i style="width:{v / m * 100:.0f}%;background:{col}"></i></div><b>{v}{unit}</b></li>' for l, v in rows) + '</ul>'


def _line(label):
    import math
    n = 10; vals = [10 + i * 1.2 + 6 * math.sin(i / 1.3) for i in range(n)]
    mx, mn = max(vals), min(vals); w, h = 420, 150
    pts = [(i * w / (n - 1), h - 16 - (v - mn) / (mx - mn) * (h - 44)) for i, v in enumerate(vals)]
    line = ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
    grid = ''.join(f'<line x1="0" x2="{w}" y1="{y}" y2="{y}"/>' for y in (30, 70, 110))
    return f'<svg viewBox="0 0 {w} {h}" class="ps-chart" role="img" aria-label="{E(label)}"><g class="grid">{grid}</g><polygon class="area" points="0,{h} {line} {w},{h}"/><polyline class="ln" pathLength="1" points="{line}"/><circle cx="{pts[-1][0]:.1f}" cy="{pts[-1][1]:.1f}" r="5"/></svg>'


def DASH():
    kpis = [('Open requests', '86', 'average wait 9 months'), ('Open posts', '124', 'across 38 sites'), ('Approved moves, last 90 days', '12', 'swaps and chains')]
    k = ''.join(f'<div class="ps-kpi"><p class="mono">{E(a)}</p><b class="ps-kpi-m">{E(b)}</b><span>{E(c)}</span></div>' for a, b, c in kpis)
    pill = {'Chain of 3': 'ps-p-i', 'Swap': 'ps-p-g', 'Vacancy move': 'ps-p-w'}
    rows = [('PRP-0012', 'Chain of 3', 'Awaiting consent', '33', '20%'), ('PRP-0013', 'Swap', 'Pending approval', '58', '71%'), ('PRP-0014', 'Vacancy move', 'Awaiting consent', '41', '64%'),
            ('PRP-0015', 'Chain of 4', 'Awaiting consent', '74', '8%'), ('PRP-0016', 'Swap', 'Approved', '49', '100%')]
    pr = ''.join(f'<tr><td>{a}</td><td><span class="ps-pill {pill.get(b, "ps-p-i")}">{b}</span></td><td>{c}</td><td class="r">{d}</td><td class="r">{e}</td></tr>' for a, b, c, d, e in rows)
    wait = [('REQ-00080', 'Staff member 1', 'Hospital Site A', 'Staff Nurse', '409'), ('REQ-00112', 'Staff member 2', 'Village Clinic Site B', 'Pharmacist', '388'),
            ('REQ-00031', 'Staff member 3', 'Health Centre Site C', 'Medical Officer', '352'), ('REQ-00207', 'Staff member 4', 'Hospital Site D', 'Staff Nurse', '301')]
    wt = ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td><td class="r">{e}</td></tr>' for a, b, c, d, e in wait)
    est = ('<table class="ps-tbl"><thead><tr><th>Site</th><th>Grade</th><th class="r">Approved posts</th><th class="r">In post</th><th class="r">Vacancy</th></tr></thead><tbody>'
           '<tr><td>Hospital Site A</td><td>Staff Nurse</td><td class="r">12</td><td class="r">11</td><td class="r">1</td></tr>'
           '<tr><td>Village Clinic Site B</td><td>Pharmacist</td><td class="r">2</td><td class="r">2</td><td class="r">0</td></tr>'
           '<tr><td>Health Centre Site C</td><td>Medical Officer</td><td class="r">4</td><td class="r">2</td><td class="r">2</td></tr></tbody></table>')
    exp = ['Transfer requests register', 'Approved transfers by month, region and category', 'Vacancy and establishment', 'Unmatched and open requests', 'Match proposals and decisions', 'User access review', 'Data inventory']
    ex = ''.join(f'<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l4 4v14H7zM14 3v4h4M9 13h6M9 17h6"/></svg><div><b>{E(t)}</b></div><em class="mono">CSV</em></li>' for t in exp)
    charts = [
        ('Approved moves per month, last 10 months', _line('Sample chart: approved moves per month for the last ten months'), 'wide'),
        ('Requests by status', _donut([('Submitted', 72), ('Completed', 20), ('Withdrawn', 6), ('Rejected', 2)], ['#2457f5', '#14b8a6', '#f28a1e', '#7a4cf0'], 'Sample chart: requests by status'), ''),
        ('Proposals by kind', _bars([('Vacancy move', 11), ('Swap', 7), ('Chain', 13)], '#7a4cf0'), ''),
        ('Wanting to leave and to come, by region', _bars([('Region 01', 21), ('Region 02', 25), ('Region 03', 24), ('Region 04', 8), ('Region 05', 14)], '#f28a1e'), ''),
        ('Why requests stay unmatched', _bars([('No open post or partner', 91), ('Would break the minimum', 5), ('Partner already used', 4)], '#14b8a6', '%'), ''),
    ]
    ch = ''.join(f'<div class="ps-card ps-chartcard {w_}"><h5 class="mono">{t}</h5>{c}</div>' for t, c, w_ in charts)
    return ('<p class="ps-note"><b>Sample data.</b> These figures are invented to show what the screens look like. The overview and the tile map in the product are drawn from the requests, posts and proposals it keeps; the charts here are a sketch of the same numbers. Your own figures appear as people ask to move.</p>'
            f'<div class="ps-kpis ps-kpis3">{k}</div><div class="ps-charts">{ch}</div>'
            f'<div class="ps-card ps-tblcard"><h5 class="mono">Proposals from the last run</h5><table class="ps-tbl"><thead><tr><th>Proposal</th><th>Kind</th><th>Status</th><th class="r">Score</th><th class="r">Chance it completes</th></tr></thead><tbody>{pr}</tbody></table></div>'
            f'<div class="ps-card ps-tblcard"><h5 class="mono">Longest waiting requests</h5><table class="ps-tbl"><thead><tr><th>Request</th><th>Staff member</th><th>Site</th><th>Grade</th><th class="r">Days waiting</th></tr></thead><tbody>{wt}</tbody></table></div>'
            f'<h4 class="ps-h4">The establishment: where the posts are open</h4><div class="ps-card ps-tblcard"><h5 class="mono">Approved posts against people in post</h5>{est}</div>'
            f'<h4 class="ps-h4">Take your data anywhere</h4><p class="ps-intro">Seven reports, previewed on screen or downloaded as CSV. Every download is recorded in the audit trail.</p><ul class="ps-reports">{ex}</ul>')
DASHTAB = 'Dashboard and reports'

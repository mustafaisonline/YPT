"""Content for the Data & AI Nexus product sheet, taken from the real project (inventory of the portal code).
Left out on purpose because it is not built there: announcements and feature switches, the full erasure programme, four-eyes approvals, 17 languages, multi-factor sign-in.
Dashboard figures are invented and labelled as sample data."""
import html
from products_ims import _donut, _bars, _line

E = html.escape

LEAD = 'Learn data and AI, practise it, and get certified: one place for trainings, knowledge, tests and certificates.'
ABOUT = ('Data & AI Nexus brings learning for data and AI together. Read in the knowledge hub, join a training programme, check what you know with a test, '
         'and receive a certificate that anyone can verify. Trainers publish programmes and dates, and organisations can train and test their own people.')
PROBLEMS = [
    ('Learning is scattered', 'Topics, trainings, tests and certificates live in one place, with one sign-in.'),
    ('Hard to know your level', 'Programmes come in six levels, and a knowledge check shows where you stand.'),
    ('Certificates can be faked', 'Every certificate has a public page where anyone can verify it, and it can expire, be renewed or be revoked.'),
    ('Teams need their own tests', 'Organisations can set role tests and interviews for their people and get the results as a file.'),
    ('Prices differ by country', 'A programme can have its own price for each region, and coupons and refunds are handled in the same place.'),
]
PERSONAS = [
    ('Learner', 'Reads the hub, books trainings, takes tests and collects certificates.'),
    ('Trainer', 'Publishes programmes and dates, takes attendance and sees the people registered.'),
    ('Organisation', 'Trains and tests its own people, with an organisation administrator.'),
    ('Industry leader', 'Shares insights with a plan and subscribers.'),
    ('Platform admin', 'Approves, reports, refunds and watches the health of the platform.'),
]
GLANCE = [('4', 'account types'), ('6', 'programme levels'), ('3', 'delivery formats'), ('4', 'pricing regions'), ('7', 'reaction kinds'), ('5', 'downloadable reports')]
JTITLE = 'The journey of a learner'
JOURNEY = ['Sign up', 'Read and explore', 'Join a programme', 'Pass the check', 'Get certified']

FEATINTRO = '{n} features, grouped by what they do for the learner, the trainer and the people who run the platform. Open the Modules tab to see them by screen.'
FEATURES = [
    ('Accounts', [
        ('Four account types', 'Standard, trainer, organisation and industry leader, each with the roles it needs.'),
        ('Social sign-in', 'Sign in with Google, GitHub or LinkedIn.'),
        ('Safe by default', 'An account locks itself after repeated failures, and its owner can unlock it again.'),
        ('Install as an app', 'The portal installs on a phone or computer.')]),
    ('Programmes and trainings', [
        ('Domains and six levels', 'Foundation, practitioner, architect, executive, builder and mentorship.'),
        ('Three delivery formats', 'Choose how a programme is delivered.'),
        ('Prices by region', 'Malaysia, Pakistan, international and Malaysia HRDC-claimable.'),
        ('Scheduled dates', 'Dates move through planned, open, full, completed, cancelled and pending review.'),
        ('Interest lists', 'Tell people when a programme they want is scheduled.')]),
    ('Registration and payment', [
        ('Registration with online checkout', 'Pay by card through Stripe.'),
        ('Coupons', 'Discount codes with their own rules.'),
        ('Refunds', 'Handled by the platform team and recorded.'),
        ('Attendance', 'Trainers take attendance and export it as a file.')]),
    ('Knowledge Hub', [
        ('Topics', 'Articles to read, with a Chinese translation for some.'),
        ('Seven reaction kinds', 'React to a topic the way you mean it.'),
        ('Bookmarks and a reading list', 'Keep what you want to come back to.'),
        ('Comments and hashtags', 'Discuss a topic and find related ones.'),
        ('Books', 'A shelf of recommended books.')]),
    ('Tests and certificates', [
        ('Knowledge check', 'A test with a certificate as a PDF when you pass.'),
        ('Role tests and interviews', 'Organisations can have their own versions, with results as a file.'),
        ('Public verify page', 'Anyone can check that a certificate is real.'),
        ('Expiry, renewal and revoke', 'A certificate can expire, be renewed or be revoked, and a reminder is sent before it expires.'),
        ('Reviews', 'Learners can review a programme, and the reviews are moderated.')]),
    ('Shop and insights', [
        ('Industry insights', 'Leaders publish insights, with plans and subscriptions.'),
        ('Agents and skills shop', 'Credit packs and an access pass.'),
        ('Advert slots', 'Places on the site for sponsors.')]),
    ('Looked after by the platform', [
        ('Admin board', 'Pending approvals, revenue by month and the health of the system.'),
        ('Five reports', 'Downloadable as files.'),
        ('Audit log', 'A record of what was done, downloadable.'),
        ('Email outbox and log', 'See which emails went out and which are waiting.'),
        ('System status', 'A page that tells you whether everything is running.')]),
]

MODINTRO = 'Eleven modules. Pick one to see exactly what a person can do in it. Records are changed and cancelled rather than wiped, so the history stays.'
MODULES = [
    ('Accounts and sign-in', 'Who you are.', 'Everyone', {
        'Create': ['Register as a standard, trainer, organisation or industry-leader account', 'Sign in with Google, GitHub or LinkedIn'],
        'Update': ['Change your profile and password'],
        'Automatic': ['Account locks after repeated failures', 'Self-unlock by email']}),
    ('Programmes', 'What can be learned.', 'Trainer; platform admin', {
        'View': ['Browse programmes by domain and level', 'See the three delivery formats and the price for your region'],
        'Create': ['Trainers add a programme', 'Add prices for each region'],
        'Update': ['Edit a programme']}),
    ('Scheduled dates', 'When it happens.', 'Trainer; platform admin', {
        'Create': ['Schedule a date for a programme'],
        'Update': ['Move a date through planned, open, full, completed, cancelled or pending review'],
        'View': ['See the dates open for registration'],
        'Export': ['Download attendance as a file']}),
    ('Registration and payment', 'Book a place.', 'Learner; platform admin', {
        'Create': ['Register for a date', 'Pay by card through Stripe', 'Apply a coupon', 'Join an interest list'],
        'Update': ['Platform team refunds a payment'],
        'View': ['Your registrations and orders']}),
    ('Knowledge Hub', 'Read and react.', 'Everyone; signed-in members react', {
        'View': ['Read topics', 'Read in Chinese where a translation exists', 'See books'],
        'Create': ['React in one of seven ways', 'Bookmark a topic', 'Comment', 'Follow a hashtag'],
        'Remove': ['Remove a bookmark or your own comment']}),
    ('Knowledge check', 'Know your level.', 'Learner', {
        'Create': ['Take the check'],
        'View': ['See your score'],
        'Export': ['Certificate as a PDF when you pass']}),
    ('Role tests and interviews', 'Test people for a role.', 'Organisation administrator', {
        'Create': ['Set a role test or interview, with an organisation version'],
        'View': ['See results'],
        'Export': ['Results as a file']}),
    ('Certificates', 'Proof that holds up.', 'Learner; platform admin', {
        'View': ['A public page where anyone can verify a certificate', 'Download as a PDF'],
        'Update': ['Renew a certificate', 'Revoke one'],
        'Automatic': ['Expiry date', 'A reminder before it expires']}),
    ('Reviews', 'What learners say.', 'Learner; platform admin', {
        'Create': ['Write a review of a programme'],
        'Approve': ['Platform team moderates reviews']}),
    ('Industry insights and shop', 'Leaders and extras.', 'Industry leader; learner', {
        'Create': ['Leaders publish insights, with plans and subscriptions', 'Buy credit packs or an access pass in the agents and skills shop'],
        'View': ['Read insights you have access to']}),
    ('Admin board and reports', 'Run the platform.', 'Platform admin', {
        'View': ['Pending approvals', 'Revenue by month', 'System status and health', 'Email outbox and log'],
        'Export': ['Five reports', 'Audit log as a file'],
        'Approve': ['Approve pending programmes, dates and reviews']}),
]

ONTO = {
    'org': ('Organisation', 'people', 'A company or team that trains and tests its own people.', ['Name and administrator']),
    'user': ('Learner', 'people', 'A person with an account.', ['Account type: standard, trainer, organisation or industry leader', 'Role']),
    'review': ('Review', 'trust', 'What a learner says about a programme.', ['Moderated before it shows']),
    'programme': ('Programme', 'catalogue', 'Something that can be learned.', ['Domain and one of six levels', 'Delivery format', 'Price by region']),
    'offering': ('Scheduled date', 'catalogue', 'A programme on a date.', ['Status: planned, open, full, completed, cancelled or pending review']),
    'registration': ('Registration', 'sales', 'A learner booked on a date.', ['Attendance']),
    'certificate': ('Certificate', 'trust', 'Proof that a learner passed.', ['Public verify page', 'Expiry, renewal and revoke']),
    'topic': ('Topic', 'catalogue', 'An article in the Knowledge Hub.', ['Reactions, bookmarks and comments', 'Chinese translation for some']),
    'check': ('Knowledge check', 'trust', 'A test of what you know.', ['Score', 'Certificate as a PDF']),
    'order': ('Order', 'sales', 'A payment.', ['Paid by card through Stripe', 'Coupon and refund']),
    'audit': ('Audit entry', 'trust', 'A record of what was done.', ['Who, what and when']),
}
POS = {'org': (110, 50), 'user': (110, 170), 'review': (110, 310),
       'programme': (380, 50), 'offering': (380, 170), 'registration': (380, 310), 'audit': (380, 440),
       'topic': (640, 50), 'check': (640, 170), 'certificate': (640, 310), 'order': (640, 440)}
EDGES = [('user', 'org', 'belongs to'), ('user', 'registration', 'makes'), ('user', 'review', 'writes'), ('registration', 'offering', 'is for'),
         ('offering', 'programme', 'is of'), ('registration', 'order', 'is paid by'), ('registration', 'certificate', 'earns'),
         ('order', 'audit', 'is recorded in'), ('topic', 'check', 'is tested by'), ('check', 'certificate', 'can earn')]
EXTRAS = [('Coupon', 'A discount code.'), ('Interest list entry', 'Someone who wants to hear when a programme is scheduled.'), ('Reaction', 'One of seven ways to respond to a topic.'),
          ('Bookmark', 'A topic saved by a learner.'), ('Email', 'A message that was sent or is waiting.')]
GROUPCOL = {'people': '#2457f5', 'catalogue': '#2e9b5f', 'sales': '#e0467f', 'trust': '#7a4cf0'}
GROUPNAME = {'people': 'People', 'catalogue': 'Catalogue', 'sales': 'Sales', 'trust': 'Trust'}
LEGEND = ('people', 'catalogue', 'sales', 'trust')
CANVAS = (1000, 520)
ONTOHINT = 'The arrows read as a sentence: <b>Learner makes Registration</b>, <b>Registration earns Certificate</b>.'

TAX = '''<div class="ps-tax">
<div class="ps-card"><h5 class="mono">Programme levels</h5><ul class="ps-flow ps-h"><li>Foundation</li><li>Practitioner</li><li>Architect</li><li>Executive</li><li>Builder</li><li>Mentorship</li></ul></div>
<div class="ps-card"><h5 class="mono">Pricing regions</h5><ul class="ps-flow"><li>Malaysia</li><li>Pakistan</li><li>International</li><li>Malaysia, HRDC-claimable</li></ul></div>
<div class="ps-card"><h5 class="mono">A date&#39;s life</h5><ul class="ps-flow ps-h"><li>Planned</li><li>Open</li><li>Full</li><li>Completed</li></ul><p>Or cancelled, or pending review.</p></div>
<div class="ps-card"><h5 class="mono">Account types</h5><ul class="ps-flow"><li>Standard</li><li>Trainer</li><li>Organisation</li><li>Industry leader</li></ul></div>
<div class="ps-card"><h5 class="mono">Reports</h5><ul class="ps-flow"><li>Five reports <b>each as a file</b></li><li>Audit log <b>as a file</b></li><li>Attendance <b>as a file</b></li></ul></div>
</div>'''

SHOTDIR = 'img/products/nexus'
SHOTNOTE = 'The content shown is sample content.'
DASHTAB = 'Admin board'


def DASH():
    kpis = [('Learners', '6,420', 'registered accounts'), ('Registrations', '1,284', 'this quarter'), ('Certificates', '932', 'issued'), ('Pending', '14', 'waiting for approval')]
    k = ''.join(f'<div class="ps-kpi"><p class="mono">{E(a)}</p><b>{E(b)}</b><span>{E(c)}</span></div>' for a, b, c in kpis)
    charts = [('Revenue by month', _line(), 'wide'),
              ('Registrations by level', _donut([('Foundation', 38), ('Practitioner', 29), ('Architect', 17), ('Others', 16)], ['#2e9b5f', '#2457f5', '#7a4cf0', '#e0467f'], 'Sample chart: registrations by level'), ''),
              ('Registrations by region', _bars([('Malaysia', 46), ('Pakistan', 24), ('International', 18), ('HRDC-claimable', 12)], '#2e9b5f', '%'), '')]
    ch = ''.join(f'<div class="ps-card ps-chartcard {w_}"><h5 class="mono">{t}</h5>{c}</div>' for t, c, w_ in charts)
    return ('<p class="ps-note"><b>Sample data.</b> The real admin board shows pending counts, revenue by month and system health as tiles and tables. The figures and charts here are invented to show the kind of view.</p>'
            f'<div class="ps-kpis">{k}</div><div class="ps-charts">{ch}</div>')


SHOTS = [
    ('01-trainings', 'The trainings', 'Expert-led trainings to choose from, with level, format and duration on each card.'),
    ('02-training', 'One training', 'Level, duration, prerequisites, format, certificate and the fee, charged in USD by card.'),
    ('03-assessment', 'Assessments', 'Test yourself, prepare for an interview, or screen candidates as an organisation.'),
    ('04-account', 'Create an account', 'One account for everything, with extra roles you can tick.'),
    ('05-verify', 'Verify a certificate', 'Anyone can check a certificate by its ID, or by the holder\'s name where they chose to be listed.'),
]

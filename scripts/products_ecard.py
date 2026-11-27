"""Content for the eCardForever product sheet, taken from the real project (inventory of the eCard code).
Left out on purpose because it is not built there: owner statistics for a card (the tables exist but nothing fills them), other languages, a confirmed vCard file, maps button.
Dashboard figures are invented and labelled as sample data."""
import html
from products_ims import _donut, _bars, _line

E = html.escape

LEAD = 'A digital business card that is yours for good: one link that shows who you are, how to reach you and what you do.'
ABOUT = ('Build a card in minutes: your photo, name, title and company, your contact details, buttons to call, message or book you, and your social links. '
         'Pick a design and a layout, share it with a link or a QR code, and add a one-page website when you need more room. '
         'Nothing to print, and nothing to reprint when your details change.')
PROBLEMS = [
    ('Paper cards get lost and go out of date', 'One card on one link that you can update any time, so people always see your latest details.'),
    ('Your details are scattered', 'Phone, email, WhatsApp, LinkedIn and more sit together on one page, each one a single tap.'),
    ('Looking professional takes a designer', 'Choose a design and a layout, including styles made for different professions, and it fits a phone screen.'),
    ('People ask how to book you', 'Add buttons to call, email, message on WhatsApp, book a meeting or download a file, right on the card.'),
    ('You want more than a card', 'Turn on a one-page website from a template made for your kind of business.'),
]
PERSONAS = [
    ('Visitor', 'Opens a card from a link or QR code and taps to call, message or connect. No account needed.'),
    ('Card owner', 'Builds and updates their own card, picks a design and layout, shares it, and can add a website.'),
    ('Member', 'Signed-in people can browse the members directory and bookmark the ones they want to remember.'),
    ('Platform admin', 'Looks after users, designs, templates, billing and security. Four admin roles share the work.'),
]
GLANCE = [('29', 'contact and social types'), ('8', 'action button types'), ('50+', 'card layouts'), ('40+', 'one-page website templates'), ('12', 'theme categories'), ('4', 'admin roles')]
JTITLE = 'The journey of a card'
JOURNEY = ['Sign up', 'Build your card', 'Pick a design', 'Share the link', 'Keep it up to date']

FEATINTRO = '{n} features, grouped by what they do for the card owner, the visitor and the people who run the platform. Open the Modules tab to see them by screen.'
FEATURES = [
    ('Build your card', [
        ('Card editor with sections', 'A status pill, profile lines, contacts, action buttons, social links, a footer and a photo, each edited in its own section.'),
        ('Order and show or hide', 'Move sections around and switch any of them on or off.'),
        ('29 contact and social types', 'Mobile, phone, email, website, WhatsApp, Telegram, Signal, WeChat, Discord, Teams, Zoom, Google Meet, LinkedIn, GitHub, Instagram, TikTok, YouTube and more.'),
        ('8 action button types', 'Call, email, WhatsApp, book a meeting, website, custom link, save contact and download.'),
        ('Social links with your own heading', 'A carousel of your profiles with a heading you choose.'),
        ('Profile photo', 'Upload a photo and it is prepared for you.'),
        ('Draft recovery', 'If you close the editor by accident, your unsaved work comes back.')]),
    ('Look right', [
        ('Designs for professions', 'A catalogue of designs, including styles made for different professions.'),
        ('50+ layouts', 'Frame, bento, gallery, editorial, noir and many more ways to arrange the same card.'),
        ('Themes in 12 categories', 'Corporate, elegant, minimal, modern tech, creative, dark mode, nature, premium glass and more.'),
        ('Made for phones', 'The card is one phone-width column, so it looks the same everywhere.')]),
    ('Share', [
        ('Your own link', 'Your card lives at its own address, ready to put on anything.'),
        ('QR code', 'Show a QR code on screen so someone can scan your card.'),
        ('Share by link or WhatsApp', 'Copy the link or send it on WhatsApp.'),
        ('Members directory', 'Signed-in people can search members and bookmark the ones they want to keep.')]),
    ('One-page website', [
        ('40+ templates', 'Made for kinds of business such as barber, clinic, tutor, law firm and property agent.'),
        ('Edit your content and images', 'Fill in your own words and pictures in the template.'),
        ('Preview, then publish', 'See it first, and take it down any time.')]),
    ('Account and upgrades', [
        ('Sign up and sign in', 'Sign-in attempts are rate limited to keep accounts safe.'),
        ('Your account is yours', 'Change your password, or delete your account.'),
        ('Add-ons by card or bank transfer', 'Pay with Stripe or by bank transfer. Orders can be cancelled, and renewals switched off.'),
        ('Ask the team to do it for you', 'Request a managed service and follow its status.')]),
    ('Looked after by the platform', [
        ('Four admin roles', 'Super admin, support, analytics and content, each with its own permissions.'),
        ('Look after users', 'View, edit, suspend, sign out everywhere, reset passwords and delete accounts.'),
        ('Manage designs and templates', 'Themes, layouts, designs and website templates are managed by admins.'),
        ('Billing control', 'Confirm bank payments, grant or end entitlements and edit the catalogue.'),
        ('Audit and monitoring', 'An audit centre, error monitoring and platform observability pages.'),
        ('Found by search, installable', 'Sitemaps for public cards, and the site installs as an app with an offline page.')]),
]

MODINTRO = 'Ten modules. Pick one to see exactly what a person can do in it. Nothing on a card is hidden from you: you can change or remove any part of it yourself.'
MODULES = [
    ('Card editor', 'Build and keep your card.', 'Card owner', {
        'Create': ['Create your card', 'Add contacts, action buttons, social links and a footer'],
        'View': ['Open your card as visitors see it'],
        'Update': ['Edit name, title, company and other profile lines', 'Reorder sections and show or hide them', 'Upload or change your photo'],
        'Remove': ['Remove any item from the card', 'Delete the card'],
        'Automatic': ['Unsaved work recovered if you close the editor']}),
    ('Contacts and action buttons', 'How people reach you.', 'Card owner', {
        'Create': ['29 contact and social types', 'Action buttons: call, email, WhatsApp, book a meeting, website, custom link, save contact, download'],
        'Update': ['Change a label, link or button style', 'Choose which items are visible']}),
    ('Designs, layouts and themes', 'How it looks.', 'Card owner; admins manage the catalogue', {
        'View': ['Browse designs, layouts and themes by category'],
        'Update': ['Choose a design', 'Choose a layout', 'Choose a theme'],
        'Create': ['Admins add and edit themes, layouts and designs']}),
    ('Sharing', 'Get your card in front of people.', 'Card owner; everyone', {
        'View': ['Anyone opens a card from its link', 'Show your QR code on screen'],
        'Export': ['Copy the link', 'Share on WhatsApp'],
        'Automatic': ['Public cards listed in the sitemap for search engines']}),
    ('One-page website', 'More room when a card is not enough.', 'Card owner', {
        'Create': ['Start a website from one of 40+ templates'],
        'View': ['Preview before publishing'],
        'Update': ['Edit your content', 'Upload images'],
        'Remove': ['Delete your website']}),
    ('Account', 'Your sign-in and profile.', 'Everyone with an account', {
        'Create': ['Register with a username and email', 'Check that a username is free'],
        'Update': ['Change your profile and password', 'Upload a profile photo'],
        'Remove': ['Delete your account'],
        'Automatic': ['Sign-in and registration are rate limited']}),
    ('Members and connections', 'Find people on the platform.', 'Signed-in members', {
        'View': ['Search the members directory', 'See counts and countries'],
        'Create': ['Bookmark a member'],
        'Remove': ['Remove a bookmark']}),
    ('Billing', 'Paid add-ons.', 'Card owner; admins confirm bank payments', {
        'View': ['The catalogue of add-ons', 'Your orders'],
        'Create': ['Check out by card (Stripe) or bank transfer', 'Request a managed service'],
        'Remove': ['Cancel an order', 'Switch off a renewal'],
        'Approve': ['Admins confirm or reject a bank payment, and grant or end an entitlement']}),
    ('Admin: people and catalogue', 'Keep the platform in order.', 'Admins, by role', {
        'View': ['Users and accounts overview'],
        'Update': ['Edit users', 'Suspend or reactivate', 'Reset a password', 'Sign someone out everywhere'],
        'Remove': ['Delete a user'],
        'Create': ['Add themes, layouts, designs and website templates']}),
    ('Admin: dashboard and audit', 'See how the platform is doing.', 'Admins, by role', {
        'View': ['Dashboard of users, cards and design use', 'Audit centre', 'Error monitoring and observability', 'Database explorer and ERD viewer']}),
    ('Search and install', 'Be found and be handy.', 'Everyone', {
        'Automatic': ['Sitemaps and robots file for search engines', 'Install as an app on a phone or computer', 'Offline page when there is no signal']}),
]

ONTO = {
    'admin': ('Admin', 'people', 'A person who looks after the platform, with one of four roles.', ['Role: super admin, support, analytics or content', 'Permissions per role']),
    'user': ('User', 'people', 'A person with an account.', ['Username and email', 'Status and sign-in history', 'Role: standard or admin']),
    'order': ('Order', 'money', 'A purchase of an add-on.', ['Status: requested, awaiting payment, paid, active, cancelled, expired, failed or rejected', 'Paid by Stripe or bank transfer']),
    'entitlement': ('Entitlement', 'money', 'What a paid order switches on for an account.', ['Status: active, cancelled or expired']),
    'audit': ('Audit entry', 'trust', 'A record of what an admin did.', ['Who, what and when']),
    'card': ('Card', 'card', 'The digital business card of a user.', ['Link name and page title', 'Design and layout', 'Order and visibility of sections', 'Published or not']),
    'website': ('Website', 'card', 'An optional one-page website of a user.', ['Content and images', 'Published or not']),
    'profile': ('Profile', 'people', 'Personal details of a user.', ['Names, mobile, address, country', 'Preferred language']),
    'design': ('Design', 'card', 'The overall look of a card, with its layout.', ['Design and layout choice']),
    'item': ('Card item', 'card', 'One thing on a card: a contact, an action button, a social link or the footer.', ['Type and label', 'Link', 'Order and visibility']),
    'theme': ('Theme', 'card', 'Colours and styling, in one of twelve categories.', ['Category', 'Colour palette']),
    'template': ('Website template', 'card', 'A starting point for a website, made for a kind of business.', ['Industry', 'Styling']),
}
POS = {'admin': (110, 50), 'user': (110, 170), 'order': (110, 310), 'entitlement': (110, 440),
       'audit': (380, 50), 'card': (380, 170), 'website': (380, 310), 'profile': (380, 440),
       'design': (640, 50), 'item': (640, 170), 'theme': (640, 310), 'template': (640, 440)}
EDGES = [('admin', 'audit', 'leaves'), ('admin', 'user', 'manages'), ('user', 'profile', 'has'), ('user', 'card', 'owns'), ('user', 'website', 'publishes'), ('user', 'order', 'places'),
         ('order', 'entitlement', 'grants'), ('card', 'design', 'uses'), ('card', 'item', 'contains'), ('card', 'theme', 'styled by'), ('website', 'template', 'built from')]
EXTRAS = [('Bookmark', 'A member saved by another member.'), ('Managed-service request', 'A request for the team to do something for you, with a status.'), ('Layout', 'The way a card is arranged.'),
          ('Sign-in record', 'Each sign-in, failed sign-in and password reset.'), ('Error event', 'A problem reported by a browser, for monitoring.')]
GROUPCOL = {'people': '#7a4cf0', 'card': '#e0467f', 'money': '#2e9b5f', 'trust': '#2457f5'}
GROUPNAME = {'people': 'People', 'card': 'Card and website', 'money': 'Orders', 'trust': 'Trust'}
LEGEND = ('people', 'card', 'money', 'trust')
CANVAS = (1000, 500)
ONTOHINT = 'The arrows read as a sentence: <b>User owns Card</b>, <b>Card contains Card item</b>.'

TAX = '''<div class="ps-tax">
<div class="ps-card"><h5 class="mono">Ways to be reached</h5><ul class="ps-flow"><li>Phone and email <b>mobile, phone, email</b></li><li>Messaging <b>WhatsApp, Telegram, Signal, WeChat, Discord, Skype</b></li><li>Meetings <b>Teams, Zoom, Google Meet, Outlook</b></li><li>Social and work <b>LinkedIn, GitHub, Instagram, X, TikTok, YouTube and more</b></li><li>Web <b>website, custom link</b></li></ul></div>
<div class="ps-card"><h5 class="mono">Action buttons</h5><ul class="ps-flow"><li>Communication <b>call, email, WhatsApp</b></li><li>Meetings <b>book a meeting</b></li><li>Links <b>website, custom link</b></li><li>Card and downloads <b>save contact, download</b></li></ul></div>
<div class="ps-card"><h5 class="mono">Who may do what</h5><ul class="ps-flow"><li>Visitor <b>open a card</b></li><li>Card owner <b>build, share, add a website, buy add-ons</b></li><li>Admin <b>four roles: super admin, support, analytics, content</b></li></ul></div>
<div class="ps-card"><h5 class="mono">An order&#39;s life</h5><ul class="ps-flow ps-h"><li>Requested</li><li>Awaiting payment</li><li>Paid</li><li>Active</li></ul><p>Or cancelled, expired, failed or rejected. A bank transfer is confirmed by an admin.</p></div>
<div class="ps-card"><h5 class="mono">Themes by category</h5><ul class="ps-flow ps-h"><li>Corporate</li><li>Elegant</li><li>Minimal</li><li>Modern tech</li><li>Creative</li><li>Dark mode</li><li>Nature</li><li>Premium glass</li></ul><p>And a few fan-style palettes.</p></div>
</div>'''

SHOTDIR = 'img/products/ecard'
SHOTNOTE = 'The card and the people shown are samples.'
DASHTAB = 'Admin dashboard'


def DASH():
    kpis = [('Users', '18,240', 'registered accounts'), ('New this month', '1,126', 'up 9% on last month'), ('Active this week', '4,870', 'signed in at least once'), ('E-cards', '17,905', 'cards created')]
    k = ''.join(f'<div class="ps-kpi"><p class="mono">{E(a)}</p><b>{E(b)}</b><span>{E(c)}</span></div>' for a, b, c in kpis)
    charts = [('New accounts per day, last 30 days', _line(), 'wide'),
              ('Cards by design', _donut([('Arctic white', 34), ('Noir', 21), ('Meridian', 17), ('Others', 28)], ['#e0467f', '#7a4cf0', '#2457f5', '#14b8a6'], 'Sample chart: cards by design'), ''),
              ('Users by country', _bars([('Country A', 58), ('Country B', 31), ('Country C', 19), ('Country D', 12), ('Others', 24)], '#e0467f', '%'), ''),
              ('Website templates in use', _bars([('Clinic', 44), ('Tutor', 38), ('Barber', 30), ('Law firm', 22), ('Property agent', 17)], '#7a4cf0', ''), '')]
    ch = ''.join(f'<div class="ps-card ps-chartcard {w_}"><h5 class="mono">{t}</h5>{c}</div>' for t, c, w_ in charts)
    return ('<p class="ps-note"><b>Sample data.</b> This is the dashboard the platform team sees, with invented figures to show what it looks like. A card owner does not have a statistics screen yet.</p>'
            f'<div class="ps-kpis">{k}</div><div class="ps-charts">{ch}</div>')


SHOTS = [
    ('01-card', 'A card', 'How a visitor sees it on a phone: name, role, contact lines, an action button and social links.'),
    ('02-editor', 'The card editor', 'Edit every line in place, drag to reorder, remove what you do not need, then save.'),
    ('03-designs', 'Designs', 'Browse 47 designs by category, each previewed live as a phone card.'),
    ('04-websites', 'Website designs', 'One-page websites for kinds of business, ready to fill in and publish.'),
    ('05-admin', 'The admin dashboard', 'Users, sign-ups, what needs attention, and the menus for people, content, billing and the platform.'),
]

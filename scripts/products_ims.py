"""Content for the Invoice Management System (Tally) product sheet.
Everything here comes from the real code in the IMS project (inventory taken from the tally-roles-invoice-app branch).
What is not built there (void, credit notes, approvals, customer-facing invoice emails, reminders, charts, reports section, translations) is left out on purpose.
Sample figures on the dashboard tab are invented and labelled as sample data."""
import html

E = html.escape

NAME = 'Invoice Management System'

LEAD = 'Create invoices, record the money that comes in, and always know who owes what, with every change on record.'
ABOUT = ('The product keeps the ledger of a small business: customers, products and services, invoices with numbers that never skip, and the receipts that settle them. '
         'An administrator creates invoices and records payments; an assistant can read everything and download invoice PDFs. Totals are calculated on the server, '
         'statuses move by themselves as money arrives, the team is told when an invoice is issued, and every change is written to an audit trail.')
PROBLEMS = [
    ('Invoice numbers and totals done by hand', 'Numbers are assigned in order with no gaps, and totals are calculated on the server, so they always add up.'),
    ('Who has paid and who has not', 'Record a payment once, split it across invoices if needed, and each invoice moves to partly paid or paid by itself.'),
    ('The oldest debts get forgotten', 'Every customer shows what is current and what is 1-30, 31-60, 61-90 and over 90 days late, plus a running statement.'),
    ('The team finds out late', 'When an invoice is issued, the team gets a pop-up inside the app and an email with the invoice PDF attached.'),
    ('No trail when something changes', 'Every create, edit, issue, delete, payment and setting change is recorded with who, when, and the values before and after.'),
]
PERSONAS = [
    ('Administrator', 'Creates and issues invoices, records and reverses payments, manages customers, items, users, settings, imports, exports and the audit trail.'),
    ('Assistant', 'Read-only: sees invoices, customers and payments and downloads invoice PDFs. Gets notified when an invoice is issued.'),
]
GLANCE = [('2', 'roles'), ('14', 'permissions'), ('6', 'currencies'), ('5', 'ways to record a payment'), ('5', 'ageing columns per customer'), ('11', 'CSV exports')]
JTITLE = 'The journey of an invoice'
JOURNEY = ['Created and issued', 'Partly paid', 'Paid']

FEATINTRO = '{n} features, grouped by what they do for the person sending the invoice and for the person watching the books. Open the Modules tab to see them by screen.'
FEATURES = [
    ('Invoices', [
        ('Create and edit invoices', 'Pick a customer, add lines, set one discount and one tax rate. The server recalculates every amount and never trusts the screen.'),
        ('Numbers that never skip', 'Each invoice gets the next number from its series, with your own prefix, pattern and yearly or never-ending count.'),
        ('Products and services list', 'Add an item once with its price. Invoice lines suggest it and fill the price.'),
        ('Payment terms and due dates', 'The due date follows the customer\'s payment term, such as net 14 days.'),
        ('Six currencies', 'PKR, USD, EUR, GBP, AED and MYR, chosen per invoice. Totals are kept separately for each currency.'),
        ('Duplicate an invoice', 'Start a new invoice from an old one.'),
        ('Edit after issue, safely', 'The number stays, the version goes up, and two people cannot overwrite each other\'s changes.'),
        ('Customer details frozen on the invoice', 'Name, address and tax number are kept as they were on the day it was issued.'),
        ('Invoice PDF', 'A branded PDF with your bank details and terms, downloadable from the invoice.')]),
    ('Get paid', [
        ('Record received amounts', 'Cash, bank, cheque, card or other, with a date, reference and notes.'),
        ('Split one payment across invoices', 'The amounts allocated must add up to the amount received, and paying more than is owed is refused.'),
        ('Status moves by itself', 'Issued becomes partly paid, then paid, as receipts are recorded or reversed.'),
        ('Reverse a receipt', 'Undo a payment with a reason, and the invoices go back to what they were.'),
        ('Receipt numbers', 'Every receipt has its own number in its own series.')]),
    ('Customers', [
        ('Customer records', 'Contacts, billing and shipping addresses, payment term and currency, with a customer number suggested for you.'),
        ('Ageing', 'Open invoices sorted into current, 1-30, 31-60, 61-90 and over 90 days late, for every currency.'),
        ('Statement', 'Each invoice and receipt in order with a running balance, ready to read out on a call.'),
        ('Deactivate, never lose', 'A customer can be switched off and on again, so the history stays.'),
        ('Overdue at a glance', 'An Overdue filter on the invoice list shows what is late.')]),
    ('Tell the team', [
        ('Instant pop-up', 'When an invoice is issued, the other people in the business see a notification right away.'),
        ('Email with the PDF', 'Everyone who should know gets an email with the invoice PDF attached, sent from a queue that retries if the mail server is busy.'),
        ('Choose who is told', 'Switch notifications on or off per person, and add extra addresses such as a shared inbox.'),
        ('Notification inbox', 'A bell with unread notifications, mark one or all as read, and a list of emails waiting or failed.')]),
    ('Control and trust', [
        ('Two roles, fourteen permissions', 'Administrator and assistant, checked on the server for every page and every action.'),
        ('Audit trail', 'Append-only record of who did what and when, with the values before and after, filterable by person, type and date.'),
        ('Only an administrator can delete', 'Deleting an invoice is permanent, but a full copy is kept in the audit trail.'),
        ('Safer sign-in', 'Accounts lock for 15 minutes after five wrong passwords, and sessions can be listed and signed out from another device.'),
        ('Each business separate', 'Every business\'s data is separated inside the database, not only on the screen.')]),
    ('Set up, move data, take it anywhere', [
        ('Your branding', 'Legal name, colour, address, footer, bank details and default terms on every invoice.'),
        ('Numbering settings', 'Prefix, pattern, reset policy and starting number for invoices, receipts and credit notes.'),
        ('Import from the old app', 'Load the previous app\'s backup: stage it, preview the rows and any errors, then commit or reject. Importing the same file twice is caught.'),
        ('Export everything', 'One full JSON export and eleven CSV exports, with cells protected against spreadsheet formula tricks.'),
        ('Database backups', 'A backup script and a restore drill that proves a backup can be restored.'),
        ('Works on a phone', 'Install it as an app on a phone or computer, with an offline page.')]),
]

MODINTRO = 'Eleven modules. Pick one to see exactly what a person can do in it. Only an administrator can delete an invoice, and a full copy of it stays in the audit trail.'
MODULES = [
    ('Invoices', 'Create, issue and follow every invoice.', 'Administrator creates and changes; assistant views and downloads PDFs', {
        'Create': ['New invoice: customer, currency, payment term, lines, discount, tax, notes, terms', 'Duplicate an existing invoice'],
        'View': ['List with search, status chips, Overdue chip, date and amount filters, sort and pages', 'Invoice sheet with lines, totals, status history, receipts and email status'],
        'Update': ['Edit an issued invoice (number kept, version goes up, conflicts caught)'],
        'Remove': ['Delete an invoice (administrator only, permanent, full copy kept in the audit trail)'],
        'Export': ['Download the invoice PDF', 'CSV of invoices and invoice lines'],
        'Automatic': ['Number assigned from the series when issued', 'Totals recalculated on the server', 'Due date from the payment term', 'Customer details frozen on the invoice', 'Status follows the receipts', 'Every status change recorded']}),
    ('Received amounts', 'Record the money that comes in.', 'Administrator records and reverses; assistant views', {
        'Create': ['Record a receipt: cash, bank, cheque, card or other', 'Split one receipt across several open invoices of the same customer'],
        'View': ['List of receipts with filters'],
        'Remove': ['Reverse a receipt, with a reason'],
        'Export': ['CSV of receipts and allocations'],
        'Automatic': ['Receipt number from its series', 'Invoice moves to partly paid or paid', 'Allocations must equal the amount; over-payment refused']}),
    ('Customers', 'Who you invoice.', 'Administrator manages; assistant views', {
        'Create': ['New customer with contacts and billing or shipping addresses', 'Customer number suggested automatically'],
        'View': ['Customer list and profile', 'Ageing of open invoices by currency', 'Statement with running balance', 'Their invoices and receipts'],
        'Update': ['Edit details, contacts, payment term and default currency'],
        'Remove': ['Deactivate or reactivate (nothing is deleted)'],
        'Export': ['CSV of customers, contacts and addresses']}),
    ('Products and services', 'What you sell, with its price.', 'Administrator manages; assistant views', {
        'Create': ['Add an item with code, name, unit and price'],
        'View': ['Item list'],
        'Update': ['Change name, unit or price'],
        'Remove': ['Deactivate or reactivate'],
        'Automatic': ['Invoice lines suggest items and fill the price'],
        'Export': ['CSV of items']}),
    ('Dashboard', 'The state of the books on one screen.', 'Everyone', {
        'View': ['Invoiced, Outstanding and Overdue, per currency, with counts', 'The latest invoices with status and total']}),
    ('Notifications', 'Everyone who should know, knows.', 'Everyone for their own; administrator for the email queue', {
        'View': ['Your notifications, newest first', 'The list of emails waiting, sent, failed or given up'],
        'Update': ['Mark one or all as read', 'Send waiting emails now'],
        'Automatic': ['Pop-up the moment an invoice is issued', 'One email per person with the PDF attached', 'Retries after 1, 5, 15, 60 and 240 minutes, then marked as given up']}),
    ('Users and roles', 'Who can do what.', 'Administrator', {
        'Create': ['Add a user and give them a role'],
        'View': ['User list', 'Which permissions each role has'],
        'Update': ['Change a role', 'Reset a password', 'Unlock a locked account', 'Switch invoice notifications on or off for a person'],
        'Remove': ['Deactivate or reactivate a user']}),
    ('Settings', 'Make it look and count like your business.', 'Administrator', {
        'Update': ['Branding: legal name, colour, address, footer, tagline, phone, email, website, bank details, default terms', 'Extra email addresses to notify', 'Numbering: prefix, pattern, reset policy, start value', 'Payment terms: name and days due'],
        'Create': ['New payment terms']}),
    ('Import and export', 'Bring data in, take it out.', 'Administrator', {
        'Create': ['Import the previous app\'s JSON backup: stage, preview, commit or reject'],
        'View': ['Import history with row errors and warnings'],
        'Export': ['Full JSON export', 'Eleven CSV exports'],
        'Automatic': ['The same file cannot be imported twice', 'Every export is recorded in the audit trail', 'Spreadsheet formula protection on every cell']}),
    ('Audit trail', 'The memory of the system.', 'Administrator', {
        'View': ['Filter by person, entity type, action and date', 'Open any row to see the values before and after'],
        'Automatic': ['Every write is recorded, append-only: it can be read but never edited or deleted']}),
    ('My account', 'Keep your own sign-in safe.', 'Everyone', {
        'Update': ['Change your password'],
        'View': ['Your signed-in sessions'],
        'Remove': ['Sign out other devices, or revoke one session'],
        'Automatic': ['Account locks for 15 minutes after five wrong passwords']}),
]

# concept model
ONTO = {
    'user': ('User', 'people', 'A person who signs in. Has a role, and can be switched on or off for invoice notifications.', ['Name and email', 'Status: invited, active or deactivated', 'Notify on invoice: yes or no']),
    'role': ('Role', 'people', 'A named set of permissions. Two exist: administrator and assistant.', ['Name', 'The permissions it holds']),
    'audit': ('Audit entry', 'trust', 'One line in the append-only record of changes.', ['Who, what, when and from where', 'Value before and after']),
    'customer': ('Customer', 'master', 'Someone you invoice.', ['Customer number and name', 'Tax registration number', 'Default payment term and currency', 'Active or deactivated']),
    'contact': ('Contact and address', 'master', 'People and places for a customer.', ['Contact name, email, phone', 'Billing or shipping address']),
    'invoice': ('Invoice', 'sales', 'A bill to a customer, numbered from a series.', ['Number and version', 'Currency, dates, payment term', 'Subtotal, discount, tax and total', 'Status: draft, issued, partly paid or paid']),
    'line': ('Invoice line', 'sales', 'One thing billed on an invoice.', ['Description, quantity, unit', 'Unit price and amount']),
    'receipt': ('Receipt', 'sales', 'Money received from a customer.', ['Receipt number and date', 'Method: cash, bank, cheque, card or other', 'Reference and notes', 'Recorded or reversed']),
    'alloc': ('Allocation', 'sales', 'The part of a receipt applied to one invoice.', ['Receipt and invoice', 'Amount applied']),
    'item': ('Product or service', 'master', 'Something you sell, with a price to suggest on invoice lines.', ['Code and name', 'Unit and price', 'Active or deactivated']),
    'term': ('Payment term', 'master', 'How long a customer has to pay.', ['Name', 'Days due']),
    'series': ('Number series', 'master', 'The counter that gives invoices, receipts and credit notes their numbers.', ['Prefix and pattern', 'Yearly or never-ending count', 'Next number']),
    'document': ('PDF document', 'trust', 'The PDF of an invoice, recorded with a fingerprint so it can be proved unchanged.', ['Invoice', 'Fingerprint (SHA-256)']),
}
POS = {'audit': (110, 50), 'user': (110, 170), 'role': (110, 310),
       'customer': (380, 50), 'invoice': (380, 170), 'document': (380, 310), 'receipt': (380, 440),
       'contact': (640, 50), 'line': (640, 170), 'term': (640, 310), 'alloc': (640, 440),
       'item': (890, 170), 'series': (890, 310)}
EDGES = [('user', 'audit', 'leaves'), ('user', 'role', 'has'), ('user', 'invoice', 'issues'), ('invoice', 'customer', 'is for'), ('customer', 'contact', 'has'),
         ('invoice', 'line', 'contains'), ('line', 'item', 'uses'), ('invoice', 'document', 'produces'), ('receipt', 'alloc', 'is split into'), ('alloc', 'invoice', 'pays'),
         ('invoice', 'term', 'due by'), ('invoice', 'series', 'numbered from')]
EXTRAS = [('Business', 'The company using the product: name, base currency, time zone. All data belongs to one business.'), ('Currency', 'PKR, USD, EUR, GBP, AED and MYR.'),
          ('Notification', 'An in-app message and an email waiting to be sent, with its status.'), ('Sign-in record', 'Each sign-in, failed sign-in, sign-out and lockout.'),
          ('Import batch', 'A staged file from the previous app, with its row errors.')]
GROUPCOL = {'people': '#7a4cf0', 'sales': '#0b8678', 'master': '#f28a1e', 'trust': '#2457f5'}
GROUPNAME = {'people': 'People', 'sales': 'Money', 'master': 'Master data', 'trust': 'Trust'}
LEGEND = ('people', 'master', 'sales', 'trust')
CANVAS = (1000, 500)
ONTOHINT = 'The arrows read as a sentence: <b>Invoice contains Invoice line</b>, <b>Receipt is split into Allocation</b>.'

TAX = '''<div class="ps-tax">
<div class="ps-card"><h5 class="mono">An invoice&#39;s life</h5><ul class="ps-flow ps-h"><li>Draft</li><li>Issued</li><li>Partly paid</li><li>Paid</li></ul><p>Saving a new invoice issues it straight away. After that, receipts move it along by themselves.</p></div>
<div class="ps-card"><h5 class="mono">Who may do what</h5><ul class="ps-flow"><li>Administrator <b>all 14 permissions</b></li><li>Assistant <b>view data, download PDFs</b></li></ul></div>
<div class="ps-card"><h5 class="mono">The fourteen permissions, in groups</h5><ul class="ps-flow"><li>Read <b>view data, invoice PDF</b></li><li>Invoices <b>create and edit, duplicate, delete</b></li><li>Money <b>record receipt, reverse receipt</b></li><li>Master data <b>customers, items</b></li><li>Control <b>audit, export, import, users, settings</b></li></ul></div>
<div class="ps-card"><h5 class="mono">How lateness is classified</h5><ul class="ps-flow ps-h"><li>Current</li><li>1-30 days</li><li>31-60 days</li><li>61-90 days</li><li>Over 90 days</li></ul><p>Shown for every customer, separately for each currency.</p></div>
<div class="ps-card"><h5 class="mono">Ways to record a payment</h5><ul class="ps-flow ps-h"><li>Cash</li><li>Bank</li><li>Cheque</li><li>Card</li><li>Other</li></ul></div>
<div class="ps-card"><h5 class="mono">An email&#39;s life</h5><ul class="ps-flow ps-h"><li>Waiting</li><li>Sent</li><li>Failed, will retry</li><li>Given up after five tries</li></ul></div>
</div>'''

SHOTDIR = 'img/products/ims'
SHOTNOTE = 'The business shown is a sample, with sample customers and amounts.'
SHOTS = [
    ('01-dashboard', 'The dashboard', 'Invoiced, outstanding and overdue at a glance, and the latest invoices with their status.'),
    ('02-invoices', 'The invoice list', 'Search, filter by status, date and amount, and see the balance of every invoice.'),
    ('03-new-invoice', 'A new invoice', 'Customer, currency, lines, discount and tax, with the totals previewed as you type.'),
    ('04-customer', 'A customer', 'Profile, ageing of open invoices, a statement with running balance, and their invoices.'),
    ('05-audit', 'The audit trail', 'Every change on record, filterable by person, type and date.'),
]
SHOTALT = 'Tally'


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


def _line():
    import math
    n = 12; vals = [18 + i * 2.6 + 7 * math.sin(i / 1.4) for i in range(n)]
    mx, mn = max(vals), min(vals); w, h = 420, 150
    pts = [(i * w / (n - 1), h - 16 - (v - mn) / (mx - mn) * (h - 44)) for i, v in enumerate(vals)]
    line = ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
    grid = ''.join(f'<line x1="0" x2="{w}" y1="{y}" y2="{y}"/>' for y in (30, 70, 110))
    return f'<svg viewBox="0 0 {w} {h}" class="ps-chart" role="img" aria-label="Sample chart: amount invoiced per month for the last twelve months"><g class="grid">{grid}</g><polygon class="area" points="0,{h} {line} {w},{h}"/><polyline class="ln" pathLength="1" points="{line}"/><circle cx="{pts[-1][0]:.1f}" cy="{pts[-1][1]:.1f}" r="5"/></svg>'


def DASH():
    kpis = [('Invoiced', 'PKR 412,600.00', '14 invoices'), ('Outstanding', 'PKR 138,200.00', '5 open invoices'), ('Overdue', 'PKR 42,500.00', '2 overdue invoices')]
    k = ''.join(f'<div class="ps-kpi"><p class="mono">{E(a)}</p><b class="ps-kpi-m">{E(b)}</b><span>{E(c)}</span></div>' for a, b, c in kpis)
    pill = {'Issued': 'ps-p-i', 'Partly paid': 'ps-p-w', 'Paid': 'ps-p-g'}
    rows = [('INV-0014', 'Customer A', 'Issued', 'PKR 52,650.00'), ('INV-0013', 'Customer B', 'Paid', 'PKR 31,590.00'), ('INV-0012', 'Customer C', 'Partly paid', 'PKR 17,550.00'),
            ('INV-0011', 'Customer A', 'Paid', 'PKR 88,000.00'), ('INV-0010', 'Customer D', 'Issued', 'PKR 42,500.00')]
    inv = ''.join(f'<tr><td>{a}</td><td>{b}</td><td><span class="ps-pill {pill[c]}">{c}</span></td><td class="r">{d}</td></tr>' for a, b, c, d in rows)
    age = ('<table class="ps-tbl"><thead><tr><th>Currency</th><th class="r">Current</th><th class="r">1-30 days</th><th class="r">31-60 days</th><th class="r">61-90 days</th><th class="r">Over 90 days</th><th class="r">Total</th></tr></thead>'
           '<tbody><tr><td>PKR</td><td class="r">62,000.00</td><td class="r">33,700.00</td><td class="r">42,500.00</td><td class="r">0.00</td><td class="r">0.00</td><td class="r"><b>138,200.00</b></td></tr></tbody></table>')
    stm = ('<table class="ps-tbl"><thead><tr><th>Date</th><th>Document</th><th>Description</th><th class="r">Charge / (credit)</th><th class="r">Running balance</th></tr></thead><tbody>'
           '<tr><td>2026-10-02</td><td>INV-0009</td><td>Invoice</td><td class="r">40,000.00</td><td class="r">40,000.00</td></tr>'
           '<tr><td>2026-10-21</td><td>RC-0006</td><td>Receipt (BANK)</td><td class="r">- 25,000.00</td><td class="r">15,000.00</td></tr>'
           '<tr><td>2026-11-12</td><td>INV-0011</td><td>Invoice</td><td class="r">88,000.00</td><td class="r">103,000.00</td></tr></tbody></table>')
    exp = ['Customers', 'Customer contacts', 'Customer addresses', 'Products and services', 'Tax codes', 'Payment terms', 'Invoices', 'Invoice lines', 'Receipts', 'Receipt allocations', 'Number series']
    ex = ''.join(f'<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l4 4v14H7zM14 3v4h4M9 13h6M9 17h6"/></svg><div><b>{E(t)}</b></div><em class="mono">CSV</em></li>' for t in exp)
    charts = [
        ('Invoiced per month, last 12 months', _line(), 'wide'),
        ('Invoices by status', _donut([('Paid', 46), ('Partly paid', 18), ('Issued', 36)], ['#14b8a6', '#f28a1e', '#2457f5'], 'Sample chart: invoices by status'), ''),
        ('Outstanding by age', _bars([('Current', 62), ('1-30 days', 34), ('31-60 days', 43), ('61-90 days', 0), ('Over 90 days', 0)], '#f28a1e', 'k'), ''),
        ('Money received by method', _bars([('Bank', 54), ('Cash', 27), ('Cheque', 13), ('Card', 6)], '#14b8a6', '%'), ''),
        ('Top customers by amount invoiced', _bars([('Customer A', 140), ('Customer B', 96), ('Customer C', 71), ('Customer D', 58), ('Customer E', 39)], '#7a4cf0', 'k'), ''),
    ]
    ch = ''.join(f'<div class="ps-card ps-chartcard {w_}"><h5 class="mono">{t}</h5>{c}</div>' for t, c, w_ in charts)
    return ('<p class="ps-note"><b>Sample data.</b> These figures are invented to show what the screens look like. The charts are drawn from the amounts, dates and statuses the product already keeps; the current screens show them as tiles and tables. Your own figures appear as you invoice.</p>'
            f'<div class="ps-kpis ps-kpis3">{k}</div><div class="ps-charts">{ch}</div>'
            f'<div class="ps-card ps-tblcard"><h5 class="mono">Latest invoices</h5><table class="ps-tbl"><thead><tr><th>Invoice</th><th>Customer</th><th>Status</th><th class="r">Total</th></tr></thead><tbody>{inv}</tbody></table></div>'
            f'<h4 class="ps-h4">On every customer: who owes what, and for how long</h4><div class="ps-card ps-tblcard"><h5 class="mono">Ageing of open invoices</h5>{age}</div>'
            f'<div class="ps-card ps-tblcard"><h5 class="mono">Statement</h5>{stm}</div>'
            f'<h4 class="ps-h4">Take your data anywhere</h4><p class="ps-intro">One full export of everything in a single file, and eleven CSV files for spreadsheets.</p><ul class="ps-reports">{ex}</ul>')
DASHTAB = 'Dashboard and statements'

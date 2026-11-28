"""Content for the International Business ERP, E-Commerce and Trade Management System product sheet.
Everything here comes from the real, built parts of the project (story status, functional spec and the data model).
What is only planned (live marketplace connections, mobile apps, purchase-order receipts into stock, landed cost on stock, customer notifications and similar) is left out on purpose.
The product is built for an international trading and e-commerce business with several companies in different countries on one central database.
All names, companies, countries and figures are anonymised or invented; sample figures on the dashboard tab are labelled as sample data."""
import html

E = html.escape

NAME = 'International Business ERP, E-Commerce & Trade Management System'

LEAD = 'One platform for a trading and e-commerce business that runs several companies in different countries: buyers, suppliers, stock, marketplace orders, money and profit, on one central database.'
ABOUT = ('The product runs the daily work of an international trading and online-selling group. Each company has its own books, stock and users, kept apart inside the database, and a head-office view '
         'shows them side by side or together. It covers export enquiries and quotations, orders and shipments across borders, suppliers and purchase orders, warehouses and stock, marketplace orders and what '
         'each one really earned, payouts, and a ledger with expenses and profit and loss. Marketplace work is done through uploaded files and manual entry: no live connection to any marketplace is built yet. '
         'Anything important is approved by a second person, and every change is written to an audit trail.')
PROBLEMS = [
    ('Several companies, several spreadsheets', 'Each company has its own ledger, stock and users on one central database, and a head-office dashboard shows one company or all together in the currency you choose.'),
    ('Buyer enquiries get lost between email and chat', 'Every enquiry is captured with its lines, assigned to an owner, quoted with a margin floor, approved, and followed until it becomes an export order.'),
    ('Nobody knows what an online order really earned', 'Each marketplace order shows revenue, marketplace fees, advertising, purchase cost and refunds, with a missing cost flagged and never guessed.'),
    ('Stock is wrong or oversold', 'Stock is the sum of append-only movements per warehouse, reservations stop two orders taking the last unit, and transfers, counts and adjustments need approval.'),
    ('Money moves through too many hands', 'Settlements, payout accounts and bank statements are matched in a chain, and a second person confirms the match. Nothing in the product moves money itself.'),
    ('Who approved what is unclear', 'Roles and approval limits are checked on the server, nobody approves what they prepared, and the audit trail keeps who, when, and before and after.'),
]
PERSONAS = [
    ('Owner or administrator', 'Sees every company, approves what is waiting, sets roles, limits and settings, and reads the head-office dashboard.'),
    ('Export and import manager', 'Works buyer enquiries, quotations, trade orders, shipments, customs records and documents.'),
    ('Procurement officer', 'Finds suppliers, sends requests for quotation, issues purchase orders and matches supplier invoices.'),
    ('E-commerce and marketplace manager', 'Loads marketplace files, maps listings, works orders and returns, and watches profit per order.'),
    ('Warehouse manager', 'Receives, moves, counts and adjusts stock, and dispatches goods.'),
    ('Accountant', 'Posts and approves journals and expenses, reads the ledger, and reviews payouts and reconciliation.'),
    ('Buyer or supplier (portal)', 'A buyer sends enquiries, reviews quotations and follows an order. A supplier registers, answers requests and sees purchase orders.'),
]
GLANCE = [('Several', 'companies on one database'), ('2', 'portals for outside parties'), ('13', 'modules'), ('350', 'data models'), ('Per company', 'ledger and currency'), ('2nd person', 'approves what matters')]
JTITLE = 'The journey of an export order'
JOURNEY = ['Buyer enquiry', 'Quotation approved', 'Export order', 'Shipped', 'Invoiced and paid']

FEATINTRO = '{n} features, grouped by the part of the business they serve. Open the Modules tab to see them by screen.'
FEATURES = [
    ('Several companies, one platform', [
        ('One database, many companies', 'Every company has its own data, separated inside the database and not only on the screen. A person sees only the companies they are given.'),
        ('Head-office dashboard', 'Sales, purchases, customers, suppliers, orders, enquiries, stock, expenses and profit for one company or all together, with a figure catalogue and drill-down to the source records.'),
        ('Display currency', 'Show consolidated figures in the currency you choose. Where an exchange rate is missing, the figure says so instead of guessing.'),
        ('Targets and alerts', 'Set targets, see actuals against them, and get alerts such as open enquiries or approvals waiting, with thresholds you control.'),
        ('Role dashboards', 'Dashboards for the accountant, the import and export managers, procurement, e-commerce, warehouse, support and the administrator.')]),
    ('Export and import trade', [
        ('Buyer enquiries and quotations', 'Capture an enquiry, ask the buyer to clarify, quote with a minimum margin floor, have it approved, issue it, revise or withdraw it.'),
        ('Counter-offers', 'The buyer can accept, decline or counter, and the quotation history is kept.'),
        ('Export and import orders', 'An accepted enquiry becomes an export order. A purchase order can become an import order. Orders are approved, confirmed or cancelled with reasons.'),
        ('Shipments and tracking', 'Create outbound and inbound shipments, book a carrier, dispatch, record tracking events, and confirm delivery with proof.'),
        ('Customs and documents', 'Record customs declarations, holds, duties and taxes, and share trade documents with the buyer as a bundle.'),
        ('Compliance screening', 'Restricted products, destinations and parties are screened, flags are cleared or blocked, and an override needs a reason.'),
        ('Export invoices', 'Create a proforma and an export invoice from a shipment, issue it, and cancel it by credit note.')]),
    ('Suppliers and buying', [
        ('Supplier onboarding', 'Registration, documents with expiry watch, bank details approved by a second person, product declarations and evaluations.'),
        ('Requests for quotation', 'Send a request to chosen suppliers, collect offers, compare them side by side, and approve one.'),
        ('Purchase orders', 'Create from an approved offer or without one, submit for approval, issue to the supplier, amend, cancel or close.'),
        ('Supplier invoices and the three-way match', 'Record a supplier invoice, match it to the order and the receipt, and resolve any variance.'),
        ('Supplier scorecards', 'Scores from delivery and quality, with action on poor performance.')]),
    ('Products, prices and stock', [
        ('Catalogue', 'Brands, a category tree with specification attributes, products with several variants, photographs, and approval before a product goes live.'),
        ('Prices and price lists', 'Dated prices per company, price lists with CSV import, and price changes decided by another person.'),
        ('Warehouses and stock', 'Stock per warehouse and per company, never added across companies. Every figure is the sum of movements with who, when and why.'),
        ('Reservations', 'Reserve stock for an order so that two orders cannot take the last unit.'),
        ('Transfers, counts and adjustments', 'Move stock between warehouses with approval and in-transit tracking, count stock and approve variances, and record damage.'),
        ('Serial numbers and reorder levels', 'Capture and trace serial numbers, set reorder levels and see what to buy.'),
        ('Stock value', 'Moving-average cost per company, compared against the ledger.')]),
    ('Online marketplaces', [
        ('Marketplace accounts and listings', 'Define marketplaces and accounts, map every listing to an internal product, and resolve mapping conflicts in bulk.'),
        ('File and manual import', 'Download a template, upload a file, validate it, review row errors, commit, or undo the batch. Orders, returns and refunds can also be typed in.'),
        ('Orders, returns and cancellations', 'Ingest orders, apply status changes, fulfil from your own warehouse, receive returns and decide their condition.'),
        ('Stock to publish', 'Allocate stock to each channel with a safety buffer, calculate the quantity to offer, and export an update file for upload.'),
        ('Profit per order', 'Revenue, shipping income, marketplace fees, advertising, purchase cost and refunds, estimated first and finalised when the settlement arrives.'),
        ('Profit views', 'By product, account, country and company, plus a trend, loss-making and low-margin flags, and CSV export.')]),
    ('Payouts and money', [
        ('Settlements and payout accounts', 'Record marketplace settlements, payout accounts and receipts, and track what is expected and overdue.'),
        ('Reconciliation chain', 'Settlement, receipt, withdrawal and bank receipt are matched automatically inside a tolerance, or by hand, and confirmed by a second person.'),
        ('Ledger per company', 'Chart of accounts, fiscal periods, manual and recurring journals with approval, posting from other modules, and reversal.'),
        ('Reports from posted entries', 'Trial balance, profit and loss, balance sheet, cash book and bank book, ageing, and reports by cost centre.'),
        ('Expenses and approval limits', 'Expense categories, approval and posting, and financial approval limits enforced by role.')]),
    ('Control and trust', [
        ('Roles and permissions', 'Access is checked on the server for every page and action, and people only see what their role and company allow.'),
        ('Maker and checker', 'The person who prepared something cannot approve it. This is enforced in the use case and in the database.'),
        ('Audit trail', 'Every change is recorded with who, when and the values before and after, and the trail cannot be edited.'),
        ('Support desk', 'Tickets with service levels and escalation, canned replies, a knowledge base, and payment disputes.'),
        ('Spreadsheet-safe exports', 'CSV exports are available across the product, protected against formula tricks.')]),
]

MODINTRO = 'Thirteen modules. Pick one to see exactly what a person can do in it. Pages mark anything not built yet, and this sheet leaves those out.'
MODULES = [
    ('Dashboards', 'The state of the group on one screen.', 'Owner and role holders', {
        'View': ['Head-office dashboard for one company or all together', 'Tiles for sales, purchases, enquiries, stock, expenses and profit with drill-down', 'Alerts and exceptions', 'Role dashboards'],
        'Update': ['Set targets', 'Set alert thresholds', 'Choose display currency and period'],
        'Export': ['Dashboard as PDF']}),
    ('Buyers and enquiries', 'The export CRM.', 'Export manager; buyers through the portal', {
        'Create': ['Buyer registration and profile', 'Enquiry with product lines', 'Enquiry captured on behalf of a buyer'],
        'View': ['Inbox with owner and status', 'Pipeline, conversion and quotation win-rate reports', 'Buyer activity'],
        'Update': ['Triage: company and owner', 'Ask the buyer to clarify', 'Decline or reopen an enquiry', 'Internal notes and follow-ups'],
        'Automatic': ['Compliance screening on submission', 'Margin floor checked on quotations']}),
    ('Quotations', 'From enquiry to an agreed price.', 'Export manager and approver', {
        'Create': ['Quotation from an enquiry with a standard template'],
        'Update': ['Approve, issue, revise or withdraw', 'Respond to a counter-offer'],
        'View': ['Find and export quotations', 'Buyer view and download'],
        'Automatic': ['Expiry after the validity period']}),
    ('Import and export', 'Orders, shipments, customs and landed cost.', 'Export and import managers', {
        'Create': ['Export order from an accepted enquiry', 'Import order from a purchase order', 'Outbound and inbound shipments', 'Customs declaration', 'Proforma and export invoice'],
        'View': ['Order and shipment registers', 'Late shipments', 'Customs and documents pending'],
        'Update': ['Book a carrier, dispatch, record tracking events', 'Confirm delivery with proof', 'Record duties and taxes', 'Share a document bundle with the buyer'],
        'Remove': ['Cancel an order, a shipment or an invoice (by credit note)'],
        'Automatic': ['Compliance screening with flags']}),
    ('Suppliers', 'Who you buy from.', 'Procurement officer; suppliers through the portal', {
        'Create': ['Supplier registration or prospect invitation'],
        'View': ['Directory and full supplier record', 'Documents nearing expiry', 'Scorecards'],
        'Update': ['Approve a registration', 'Verify a bank-detail change (second person)', 'Suspend, reinstate or close a supplier'],
        'Export': ['Supplier directory']}),
    ('Procurement', 'Requests, orders and invoices.', 'Procurement officer and approver', {
        'Create': ['Request for quotation', 'Purchase order from an offer or directly', 'Record an offer received outside the portal'],
        'View': ['Offers compared side by side', 'Order list and reports'],
        'Update': ['Approve an offer', 'Submit and approve a purchase order', 'Issue, amend, cancel or close', 'Match a supplier invoice and resolve variances'],
        'Remove': ['Cancel an order or a request']}),
    ('Catalogue and prices', 'What you sell and for how much.', 'Catalogue and pricing staff', {
        'Create': ['Brand, category and attributes', 'Product with its first SKU', 'Price list'],
        'View': ['Search and filter products', 'Product page with photographs'],
        'Update': ['Submit a product for approval', 'Change a price, approved by another person', 'Hold, discontinue or archive'],
        'Export': ['Catalogue CSV'],
        'Automatic': ['Bulk import with row-level error report']}),
    ('Inventory', 'Stock you can trust.', 'Warehouse manager', {
        'Create': ['Warehouse and locations', 'Transfer between warehouses', 'Stock adjustment and damage record', 'Reservation'],
        'View': ['Stock of a product across warehouses', 'Movement history of a product', 'Serial number trace', 'What to reorder'],
        'Update': ['Approve and dispatch a transfer', 'Count stock and approve variances', 'Reverse a movement'],
        'Export': ['Stock CSV'],
        'Automatic': ['Stock is the sum of movements', 'Last unit cannot be taken twice']}),
    ('Marketplaces', 'Online orders, by file or by hand.', 'E-commerce and marketplace manager', {
        'Create': ['Marketplace and account', 'Import batch from a file', 'Manual order, shipment update, return or refund', 'Outbound change request'],
        'View': ['Orders, returns, listings and imports', 'Needs-attention queue', 'Unmapped lines'],
        'Update': ['Map a listing to a product', 'Validate, commit or undo a batch', 'Receive a return and decide its condition', 'Approve an outbound change'],
        'Export': ['Stock and listing update files for upload'],
        'Automatic': ['Overselling prevented across channels', 'Stock discrepancy review']}),
    ('E-commerce profit', 'What each online order earned.', 'E-commerce manager, finance', {
        'View': ['Profit per order, product, account, country and company', 'Trend and fees', 'Unallocated costs', 'Estimate against actual'],
        'Update': ['Set the low-margin threshold', 'Fix a missing cost and recalculate'],
        'Export': ['Orders and profit reports as CSV'],
        'Automatic': ['Created when an order arrives', 'Finalised from the settlement', 'Alerts on loss-making orders']}),
    ('Payouts and reconciliation', 'Follow the money from settlement to bank.', 'Accountant', {
        'Create': ['Payout account', 'Settlement', 'Receipt and withdrawal records', 'Statement import'],
        'View': ['Unreconciled queue', 'Full chain for any record', 'Reports'],
        'Update': ['Match, unmatch and re-match', 'Mark a link as disputed and resolve it', 'Approve a withdrawal record (second person)'],
        'Automatic': ['Automatic matching inside tolerance and date window', 'Conversion rate recorded']}),
    ('Accounting', 'One ledger per company.', 'Accountant and approver', {
        'Create': ['Journal, manual or recurring', 'Expense', 'Payment or receipt voucher'],
        'View': ['General ledger, trial balance, profit and loss, balance sheet', 'Cash book and bank book', 'Receivable and payable ageing'],
        'Update': ['Approve or reject a journal', 'Reverse a posted journal', 'Open and close periods', 'Set approval limits'],
        'Automatic': ['Postings raised by other modules', 'Only posted entries counted']}),
    ('Administration and audit', 'Roles, support and the memory of the system.', 'Administrator', {
        'Create': ['Users and roles', 'Support tickets and knowledge articles'],
        'View': ['Approvals inbox', 'Audit trail with before and after values', 'Service-level reports'],
        'Update': ['Permissions per role', 'Notification settings'],
        'Automatic': ['Every write is recorded, append-only']}),
]

# concept model
ONTO = {
    'company': ('Company', 'org', 'A legal entity in one country. Owns its own books, stock and users.', ['Name and country', 'Base currency', 'Status']),
    'buyer': ('Buyer', 'trade', 'An overseas customer.', ['Company details and addresses', 'Status: pending review or approved']),
    'inquiry': ('Enquiry', 'trade', 'A request from a buyer for products.', ['Lines of products and quantities', 'Owner', 'Status from new to converted']),
    'quote': ('Quotation', 'trade', 'A priced answer to an enquiry.', ['Lines and margin', 'Validity', 'Approved, issued, revised or withdrawn']),
    'torder': ('Trade order', 'trade', 'An export or import order.', ['Direction', 'Party and total', 'Status: draft, confirmed, in fulfilment, shipped']),
    'shipment': ('Shipment', 'trade', 'Goods on the move, with a carrier and tracking events.', ['Direction', 'Carrier and tracking', 'Customs and documents']),
    'supplier': ('Supplier', 'source', 'Who you buy from.', ['Documents with expiry', 'Bank details approved by a second person', 'Score']),
    'po': ('Purchase order', 'source', 'An order placed with a supplier.', ['Lines and total', 'Approval', 'Status']),
    'sku': ('Product and SKU', 'source', 'Something you sell, with price and cost.', ['Code and name', 'Prices per company', 'Status']),
    'warehouse': ('Warehouse', 'source', 'A place where stock is kept.', ['Name and locations', 'Managers']),
    'stock': ('Stock movement', 'source', 'One entry in the append-only record of stock.', ['Product and warehouse', 'Quantity and reason', 'Who and when']),
    'mkacct': ('Marketplace account', 'ecom', 'A selling account on an online marketplace.', ['Marketplace', 'Company', 'Active or paused']),
    'mkorder': ('Marketplace order', 'ecom', 'An order that came from a marketplace.', ['Lines and status', 'Destination country', 'Mapped products']),
    'econ': ('Order profit', 'ecom', 'The revenue, costs and profit of one order.', ['Revenue and fees', 'Advertising, cost and refunds', 'Estimated or final']),
    'settle': ('Settlement', 'ecom', 'What a marketplace pays out for a period.', ['Amount and period', 'Matched receipts']),
    'journal': ('Journal', 'money', 'A balanced entry in a company ledger.', ['Lines of debit and credit', 'Draft, approved or posted']),
}
POS = {'company': (110, 50), 'buyer': (380, 50), 'inquiry': (640, 50), 'quote': (890, 50),
       'journal': (110, 170), 'torder': (380, 170), 'shipment': (640, 170), 'econ': (890, 170),
       'supplier': (110, 310), 'po': (380, 310), 'sku': (640, 310), 'mkorder': (890, 310),
       'warehouse': (110, 440), 'stock': (380, 440), 'mkacct': (640, 440), 'settle': (890, 440)}
EDGES = [('buyer', 'inquiry', 'sends'), ('inquiry', 'quote', 'is answered by'), ('quote', 'torder', 'becomes'), ('torder', 'shipment', 'ships as'),
         ('company', 'torder', 'owns'), ('company', 'journal', 'keeps'), ('torder', 'journal', 'posts to'), ('torder', 'sku', 'sells'),
         ('supplier', 'po', 'receives'), ('po', 'sku', 'orders'), ('sku', 'stock', 'is counted in'), ('stock', 'warehouse', 'sits in'),
         ('mkacct', 'mkorder', 'receives'), ('mkorder', 'sku', 'sells'), ('mkorder', 'econ', 'has'), ('settle', 'mkorder', 'pays for'),
         ('mkacct', 'settle', 'is paid by'), ('settle', 'journal', 'posts to')]
EXTRAS = [('Currency and exchange rate', 'Each company keeps its own currency, and consolidated figures use recorded rates.'), ('Approval', 'A request waiting for a second person.'),
          ('Audit entry', 'Who changed what and when, with before and after.'), ('Import batch', 'A staged marketplace file with its row errors.'),
          ('Customs declaration', 'The customs record for a shipment, with duties and holds.'), ('Support ticket', 'A customer or buyer question with a service-level clock.')]
GROUPCOL = {'org': '#7a4cf0', 'trade': '#0b8678', 'source': '#f28a1e', 'ecom': '#d6336c', 'money': '#2457f5'}
GROUPNAME = {'org': 'Company', 'trade': 'Export and import', 'source': 'Buying and stock', 'ecom': 'Online selling', 'money': 'Money'}
LEGEND = ('org', 'trade', 'source', 'ecom', 'money')
CANVAS = (1000, 500)
ONTOHINT = 'The arrows read as a sentence: <b>Buyer sends Enquiry</b>, <b>Marketplace account receives Marketplace order</b>.'

TAX = '''<div class="ps-tax">
<div class="ps-card"><h5 class="mono">An export order&#39;s life</h5><ul class="ps-flow ps-h"><li>Draft</li><li>Confirmed</li><li>In fulfilment</li><li>Shipped</li></ul><p>It starts from an accepted enquiry. Shipment progress moves it along.</p></div>
<div class="ps-card"><h5 class="mono">From enquiry to order</h5><ul class="ps-flow ps-h"><li>Submitted</li><li>Under review</li><li>Quoted</li><li>Accepted</li><li>Converted</li></ul></div>
<div class="ps-card"><h5 class="mono">A purchase, step by step</h5><ul class="ps-flow ps-h"><li>Request for quotation</li><li>Offer approved</li><li>Purchase order approved</li><li>Supplier invoice matched</li></ul></div>
<div class="ps-card"><h5 class="mono">The money chain</h5><ul class="ps-flow ps-h"><li>Settlement</li><li>Receipt</li><li>Withdrawal</li><li>Bank receipt</li></ul><p>Each link is matched automatically or by hand, and confirmed by a second person.</p></div>
<div class="ps-card"><h5 class="mono">What a marketplace order earns</h5><ul class="ps-flow"><li>Revenue <b>plus shipping income</b></li><li>Minus <b>marketplace fees and advertising</b></li><li>Minus <b>purchase cost and refunds</b></li><li>Result <b>net profit and margin</b></li></ul></div>
<div class="ps-card"><h5 class="mono">Who must not approve their own work</h5><ul class="ps-flow"><li>Quotations <b>second person approves</b></li><li>Purchase orders <b>second person approves</b></li><li>Bank-detail changes <b>second person verifies</b></li><li>Journals and expenses <b>approval limits by role</b></li></ul></div>
</div>'''

SHOTDIR = 'img/products/world'
SHOTNOTE = 'The group shown is a sample, with sample companies, buyers and amounts.'
SHOTS = [
    ('01-dashboard', 'The head-office dashboard', 'Alerts and tiles for sales, orders, enquiries, suppliers and profit across the companies, with drill-down.'),
    ('02-buyers-inquiries', 'Buyers and enquiries', 'New, under review, quoted and converted enquiries, with conversion and quotation win rate.'),
    ('03-trade-orders', 'Export and import orders', 'Orders with direction, party, status and total, next to shipments, documents and customs.'),
    ('04-ecommerce-profit', 'Profit per marketplace order', 'Revenue, fees, advertising, cost, refunds, profit and margin for every online order.'),
    ('05-profit-and-loss', 'Profit and loss', 'A ledger report for one company, from posted entries only.'),
]
SHOTALT = 'Trade ERP'


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
    n = 12; vals = [18 + i * 2.2 + 6 * math.sin(i / 1.3) for i in range(n)]
    mx, mn = max(vals), min(vals); w, h = 420, 150
    pts = [(i * w / (n - 1), h - 16 - (v - mn) / (mx - mn) * (h - 44)) for i, v in enumerate(vals)]
    line = ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
    grid = ''.join(f'<line x1="0" x2="{w}" y1="{y}" y2="{y}"/>' for y in (30, 70, 110))
    return f'<svg viewBox="0 0 {w} {h}" class="ps-chart" role="img" aria-label="Sample chart: marketplace profit per month for the last twelve months"><g class="grid">{grid}</g><polygon class="area" points="0,{h} {line} {w},{h}"/><polyline class="ln" pathLength="1" points="{line}"/><circle cx="{pts[-1][0]:.1f}" cy="{pts[-1][1]:.1f}" r="5"/></svg>'


def DASH():
    kpis = [('Sales this month', 'USD 186,400', '3 companies'), ('Open enquiries', '22', '7 quoted or negotiating'), ('Net profit', 'USD 26,100', 'all companies together')]
    k = ''.join(f'<div class="ps-kpi"><p class="mono">{E(a)}</p><b class="ps-kpi-m">{E(b)}</b><span>{E(c)}</span></div>' for a, b, c in kpis)
    pill = {'Shipped': 'ps-p-i', 'In fulfilment': 'ps-p-w', 'Confirmed': 'ps-p-g'}
    rows = [('TRD-0010', 'Buyer A', 'Shipped', 'USD 79,850.00'), ('TRD-0009', 'Buyer B', 'In fulfilment', 'USD 18,898.50'), ('TRD-0008', 'Buyer C', 'Confirmed', 'USD 38,651.50'),
            ('TRD-0007', 'Buyer A', 'In fulfilment', 'USD 58,535.50'), ('TRD-0006', 'Buyer B', 'Shipped', 'USD 73,945.00')]
    inv = ''.join(f'<tr><td>{a}</td><td>{b}</td><td><span class="ps-pill {pill[c]}">{c}</span></td><td class="r">{d}</td></tr>' for a, b, c, d in rows)
    prof = ('<table class="ps-tbl"><thead><tr><th>Order</th><th class="r">Revenue</th><th class="r">Fees</th><th class="r">Cost</th><th class="r">Profit</th><th class="r">Margin</th></tr></thead><tbody>'
            '<tr><td>MPO-0149</td><td class="r">128.97</td><td class="r">0.00</td><td class="r">37.20</td><td class="r">96.27</td><td class="r">74.7%</td></tr>'
            '<tr><td>MPO-0120</td><td class="r">42.99</td><td class="r">9.45</td><td class="r">12.40</td><td class="r">25.14</td><td class="r">58.5%</td></tr>'
            '<tr><td>MPO-0061</td><td class="r">12.99</td><td class="r">0.00</td><td class="r">13.40</td><td class="r">4.09</td><td class="r">31.5%</td></tr></tbody></table>')
    exp = ['Products and prices', 'Stock by warehouse', 'Marketplace orders', 'Orders and profit', 'Suppliers', 'Buyers', 'Quotations', 'Purchase orders', 'Journals', 'Trial balance']
    ex = ''.join(f'<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l4 4v14H7zM14 3v4h4M9 13h6M9 17h6"/></svg><div><b>{E(t)}</b></div><em class="mono">CSV</em></li>' for t in exp)
    charts = [
        ('Marketplace profit per month, last 12 months', _line(), 'wide'),
        ('Trade orders by status', _donut([('Confirmed', 30), ('In fulfilment', 30), ('Shipped', 30), ('Draft', 10)], ['#14b8a6', '#2457f5', '#f28a1e', '#7a4cf0'], 'Sample chart: trade orders by status'), ''),
        ('Enquiry pipeline', _bars([('New', 5), ('Under review', 10), ('Quoted', 7), ('Accepted', 1), ('Converted', 9)], '#14b8a6'), ''),
        ('Profit by destination country', _bars([('Country 1', 74), ('Country 2', 79), ('Country 3', 75)], '#7a4cf0', '%'), ''),
        ('Sales by company', _bars([('Company A', 112), ('Company B', 48), ('Company C', 26)], '#f28a1e', 'k'), ''),
    ]
    ch = ''.join(f'<div class="ps-card ps-chartcard {w_}"><h5 class="mono">{t}</h5>{c}</div>' for t, c, w_ in charts)
    return ('<p class="ps-note"><b>Sample data.</b> These figures are invented to show what the screens look like. The charts are drawn from the amounts, dates and statuses the product already keeps; the current screens show them as tiles, lists and tables. Your own figures appear as you trade.</p>'
            f'<div class="ps-kpis ps-kpis3">{k}</div><div class="ps-charts">{ch}</div>'
            f'<div class="ps-card ps-tblcard"><h5 class="mono">Latest trade orders</h5><table class="ps-tbl"><thead><tr><th>Order</th><th>Buyer</th><th>Status</th><th class="r">Total</th></tr></thead><tbody>{inv}</tbody></table></div>'
            f'<h4 class="ps-h4">On every marketplace order: what it really earned</h4><div class="ps-card ps-tblcard"><h5 class="mono">Order profit</h5>{prof}</div>'
            f'<h4 class="ps-h4">Take your data anywhere</h4><p class="ps-intro">CSV files for spreadsheets across the catalogue, stock, orders, profit and the ledger.</p><ul class="ps-reports">{ex}</ul>')
DASHTAB = 'Dashboard and reports'

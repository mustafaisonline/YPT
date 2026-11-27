#!/usr/bin/env python3
"""Builds agentic/products.html: four product cards, and for each product a full-page "product sheet" (dialog) with tabs.
Run:  python3 scripts/build-products.py   (then python3 scripts/stamp-version.py)

The wholesale & retail product's content comes from the real project (its code, schema and requirements). Wording is market-neutral
on purpose (no city, currency, wallet brands or seeded product names). The other three products only carry draft Overview and
Features tabs until their real content is supplied: nothing is invented for modules, ontology or dashboards.
"""
import re, os, sys, math, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(os.path.join(ROOT, 'agentic'))
E = html.escape

a = open('agents.html', encoding='utf8').read()
head = a[:a.index('<main>')]
foot = a[a.index('</main>') + len('</main>'):]
head = re.sub(r'<!-- Design review page.*?-->', '<!-- Products page: the four YPT products. Kept out of search until launch. -->', head, flags=re.S)
head = head.replace('<title>The YPT Agents | Character Design</title>', '<title>Products | Your Partner Technologies</title>')
head = head.replace('<a href="agents.html" class="on">', '<a href="agents.html">')
head = head.replace('<a href="products.html">', '<a href="products.html" class="on">')
head = head.replace('<a class="btn btn--solid" href="index.html">See them on the homepage <span class="arr">→</span></a>', '<a class="btn btn--solid" href="contact.html">Talk to us <span class="arr">→</span></a>')
head = head.replace('</head>', '    <link rel="stylesheet" href="css/products.css?v=1">\n</head>', 1)
foot = foot.replace('<script type="module" src="js/agents3d.js', '<script src="js/products.js?v=1" defer></script>\n<script type="module" src="js/agents3d.js', 1)

CK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
FLIP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4"/></svg>'

# --------------------------------------------------------------------------------------------- products
P = [
    dict(id='wholesale', n='01', name='Online Wholesale &amp; Retail Management System', tag='Sell wholesale and retail goods online, and run the orders behind them', ag='forge', who='Jun', role='Builder', c='#f28a1e', cd='#b9680c', soft='#fdf0d9',
         say='I built the storefront and the admin behind it, so a business can sell online from day one.', feats=['Online catalogue', 'Wholesale pricing', 'Orders and stock'], full=True,
         art='<rect x="14" y="14" width="212" height="12" rx="6" fill="#fff" opacity=".9"/><circle cx="22" cy="20" r="3" fill="#f28a1e"/>' + ''.join(f'<g transform="translate({14 + i * 54} 36)"><rect width="46" height="62" rx="9" fill="#fff"/><rect x="11" y="8" width="24" height="24" rx="7" fill="{col}"/><rect x="8" y="38" width="30" height="4" rx="2" fill="#c9d1ea"/><rect x="8" y="46" width="18" height="8" rx="4" fill="#f28a1e"/></g>' for i, col in enumerate(['#e0a24a', '#d35c3a', '#7ba05b', '#e8c45a']))),
    dict(id='world', n='02', name='Supply the World', tag='Import and export, run end to end', ag='atlas', who='Wei', role='Architect', c='#2457f5', cd='#1a3fd0', soft='#e6ecff',
         say='I mapped the whole chain, from supplier to port to customer, so every shipment has a place and an owner.', feats=['Shipments and routes', 'Trade documents', 'Supplier and buyer records'],
         draft=['Shipment and route tracking', 'Import and export documents in one place', 'Supplier and buyer records', 'Customs and compliance checklist', 'Status updates at every step', 'Reports across all shipments'],
         art='<circle cx="120" cy="64" r="46" fill="#fff" opacity=".92"/><path d="M74 64h92M120 18c-20 14-20 74 0 92M120 18c20 14 20 74 0 92M82 40h76M82 88h76" stroke="#9db6ff" stroke-width="2" fill="none"/><path d="M40 98C70 40 150 30 206 40" stroke="#2457f5" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round" fill="none"/><circle cx="40" cy="98" r="7" fill="#f28a1e"/><circle cx="206" cy="40" r="7" fill="#14b8a6"/><rect x="126" y="28" width="22" height="12" rx="3" fill="#2457f5"/><rect x="130" y="22" width="6" height="6" rx="1" fill="#1a3fd0"/>'),
    dict(id='ims', n='03', name='Invoice Management System', tag='Invoices handled, not chased', ag='aegis', who='Mei', role='Governance', c='#14b8a6', cd='#0b8678', soft='#dff6f1',
         say='I keep every invoice numbered, every payment matched and every change on record. Nothing slips through.', feats=['Invoices and receipts', 'Ageing and statements', 'Audit trail'], full=True,
         art=''.join(f'<g transform="translate({22 + i * 10} {16 + i * 10}) "><rect width="150" height="84" rx="10" fill="#fff" opacity="{.55 + i * .2}"/></g>' for i in range(3)) + '<rect x="52" y="46" width="60" height="6" rx="3" fill="#c9d1ea"/><rect x="52" y="60" width="96" height="5" rx="2.5" fill="#dde3f4"/><rect x="52" y="72" width="80" height="5" rx="2.5" fill="#dde3f4"/><rect x="52" y="84" width="40" height="5" rx="2.5" fill="#dde3f4"/><g transform="translate(150 70)"><circle r="22" fill="#14b8a6"/><path d="M-9 0l6 7 12-14" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'),
    dict(id='staff', n='04', name='Staff Transfer Management', tag='Move people between teams and sites without the paperwork', ag='sage', who='Lin', role='Enablement', c='#7a4cf0', cd='#5a35c0', soft='#eee8fe',
         say='I walk each move through, from the request to the first day, so no one is left wondering what comes next.', feats=['Transfer requests', 'Manager approvals', 'Handover checklist'],
         draft=['Transfer requests with reasons', 'Manager and HR approvals', 'Handover checklist', 'Transfer history per person', 'Notifications to everyone involved', 'Reports by team and site'],
         art='<rect x="16" y="24" width="64" height="84" rx="12" fill="#fff" opacity=".92"/><rect x="160" y="24" width="64" height="84" rx="12" fill="#fff" opacity=".92"/>' + ''.join(f'<rect x="{x}" y="{y}" width="12" height="12" rx="3" fill="#c9bdf7"/>' for x in (26, 44, 62) for y in (36, 56)) + ''.join(f'<rect x="{x}" y="{y}" width="12" height="12" rx="3" fill="#c9bdf7"/>' for x in (170, 188, 206) for y in (36, 56)) + '<path d="M86 66h68" stroke="#7a4cf0" stroke-width="4" stroke-linecap="round"/><path d="M146 56l12 10-12 10" stroke="#7a4cf0" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g class="mv"><circle cx="120" cy="50" r="11" fill="#f28a1e"/><rect x="109" y="64" width="22" height="22" rx="9" fill="#f28a1e"/></g>'),
]

# --------------------------------------------------------------------------------------------- wholesale & retail: real content
LEAD = 'One system to sell to the public, to shopkeepers and to wholesalers, and to run everything behind the sale: prices, stock, payments, delivery and reports.'
ABOUT = ('Buyers browse a catalogue, fill a cart and check out as a guest or with an account. Each buyer sees the price that belongs to them, '
         'pays the way they prefer, and follows the order to the door. Behind the shop, staff process orders, check payments, keep stock and prices right, '
         'and see how the business is doing, with every change recorded.')
PROBLEMS = [
    ('Orders live in chat and calls', 'Every order is captured once, with its items, payment and delivery, and visible to the buyer and the staff.'),
    ('Three kinds of buyer, one price list', 'Retail, trade and wholesale prices, minimum quantities and quantity breaks, applied automatically for each buyer.'),
    ('Prices and stock change often', 'Change a price or a stock count in one place and the shop updates everywhere.'),
    ('Payment is informal', 'Cash on delivery, mobile wallet or bank transfer, with proof uploaded by the buyer and verified by a person.'),
    ('One product, many pack sizes', 'Every pack size is its own item with its own price and stock, grouped under one product page.'),
]
PERSONAS = [
    ('Public shopper', 'Browses and buys at retail prices, with or without an account.'),
    ('Shopkeeper', 'Applies for a trade account and, once approved, buys at trade prices.'),
    ('Wholesaler', 'Approved for wholesale prices and bigger quantity breaks.'),
    ('Order desk', 'Staff who process orders, verify payments and keep stock right.'),
    ('Administrator', 'Everything: catalogue, prices, customers, approvals, reports and settings.'),
]
GLANCE = [('3', 'buyer types'), ('3', 'price tiers'), ('4', 'ways to pay'), ('15', 'admin screens'), ('11', 'downloadable reports'), ('2', 'languages, incl. right-to-left')]
JOURNEY = ['Placed', 'Confirmed', 'Packed', 'Out for delivery', 'Delivered']

FEATURES = [
    ('Shop and discover', [
        ('Catalogue by category', 'Products are grouped so buyers find what they want in a few clicks.'),
        ('Pack sizes as separate items', 'Each size has its own price and stock, under one product page.'),
        ('Search, filters and sorting', 'Filter by price range, pack size, stock and offers, and sort the results.'),
        ('Rich product pages', 'Photos, description, shelf life and badges such as organic, new and featured.'),
        ('Offer prices', 'A struck-through "was" price shows buyers what they save.')]),
    ('Buy', [
        ('Cart that stays honest', 'Price, minimum quantity and stock are checked again when the order is placed.'),
        ('Guest checkout', 'Buyers can order without creating an account.'),
        ('Delivery address, zone and time slot', 'Buyers choose where and roughly when; the fee follows the zone.'),
        ('WhatsApp ordering', 'A chat button for buyers who prefer to ask first.')]),
    ('Pricing and trade', [
        ('Three price tiers', 'Retail, trade and wholesale prices on every pack size.'),
        ('Minimum order quantities', 'Set per tier, so trade and wholesale orders start at a sensible size.'),
        ('Quantity breaks', 'Order more and the unit price drops automatically.'),
        ('Trade accounts by approval', 'Buyers apply with business details; trade and wholesale prices show only after approval.'),
        ('Price locked on the order', 'The price a buyer saw is stored on the order line and never changes afterwards.')]),
    ('Pay', [
        ('Cash on delivery, mobile wallet or bank transfer', 'Payment instructions are shown up front, with the account details.'),
        ('Proof of payment', 'Buyers enter a transaction ID and can upload a screenshot or slip.'),
        ('Verified by a person', 'Staff verify or reject each payment, and a rejection carries a reason.'),
        ('Confirm only when paid', 'A prepaid order is confirmed only after its payment is verified; cash orders are marked paid on delivery.')]),
    ('Deliver and track', [
        ('Delivery zones', 'Each zone has a fee, a free-delivery threshold and an estimated delivery time.'),
        ('Order timeline', 'Placed, confirmed, packed, out for delivery, delivered, with who changed it and when.'),
        ('Tracking for guests', 'Anyone can follow an order with the order number and phone number.'),
        ('Cancel while still open', 'Buyers can cancel an order that is only placed; the stock goes back on the shelf.')]),
    ('Run the business', [
        ('Overview dashboard', "Today's orders, sales, what needs attention, and the charts that matter."),
        ('Stock per pack size', 'Stock counts and reorder levels, with a low-stock list.'),
        ('Edit products and prices', 'Names and descriptions in two languages, prices per tier, show or hide a product.'),
        ('Customers and approvals', 'Buyer list, change a buyer type, and approve or reject trade applications.'),
        ('Enquiries inbox', 'Contact and franchise enquiries with a status, so none are forgotten.'),
        ('Banners and payment details', 'Show or hide home-page banners and keep payment account details up to date.')]),
    ('Control and insight', [
        ('Eleven reports', 'Sales by day, product, category and buyer type, payments, stock and more, each as a CSV download.'),
        ('Audit trail', 'Every admin change is recorded: who, what, when, and the old and new value.'),
        ('Sign-in log and web traffic', 'See who signed in, and how visitors use the shop by page, device and language.'),
        ('Data dictionary and database view', 'A readable map of the data and a read-only view of the tables.'),
        ('Roles and permissions', 'Order desk staff and administrators see different screens, checked on the server.'),
        ('No overselling', 'Stock is taken the moment an order is placed, so the same item is never sold twice.')]),
    ('Everywhere', [
        ('English and Urdu', 'The whole shop and admin switch language, including right-to-left layout.'),
        ('Works on a phone', 'Designed for small screens first, and installable as an app.')]),
]

# modules: name, purpose, who, verbs {Create, View, Update, Remove, Approve, Export, Automatic}
MODULES = [
    ('Catalogue and search', 'The public shop window.', 'Everyone', {
        'View': ['Categories and product pages with pack sizes', 'Search, price and pack-size filters, sort', 'Offers and badges']}),
    ('Cart and checkout', 'From first item to placed order.', 'Everyone', {
        'Create': ['Add items to the cart', 'Place an order as a guest or signed-in buyer', 'Choose address, delivery zone and time slot'],
        'Update': ['Change quantities in the cart'], 'Remove': ['Remove items from the cart'],
        'Automatic': ['Price, minimum and stock re-checked at checkout', 'Quantity breaks applied', 'Stock taken as the order is placed']}),
    ('Orders', 'The order desk.', 'Order desk, administrator; buyers for their own orders', {
        'View': ['Order list with filters', 'Order detail: items, payment, address, timeline', 'Buyers track an order by number and phone'],
        'Update': ['Move an order along: confirmed, packed, out for delivery, delivered'],
        'Remove': ['Cancel an order (the stock goes back)'],
        'Automatic': ['Every change written to the order timeline', 'Cash orders marked paid on delivery']}),
    ('Payments', 'Check money before goods move.', 'Buyers submit; order desk and administrator decide', {
        'Create': ['Buyer submits a transaction ID and optional proof'],
        'View': ['Queue of payments waiting to be checked, with the proof'],
        'Approve': ['Verify a payment', 'Reject a payment with a reason'],
        'Automatic': ['A prepaid order cannot be confirmed before its payment is verified']}),
    ('Products', 'What the shop sells.', 'Administrator', {
        'View': ['Product list with category and status'],
        'Update': ['Names and descriptions in two languages', 'Mark featured or organic', 'Show or hide a product'],
        'Remove': ['Hide (deactivate) instead of delete, so order history stays intact']}),
    ('Pricing and pack sizes', 'The right price for the right buyer.', 'Administrator', {
        'View': ['Price list by tier for every pack size'],
        'Update': ['Retail, trade and wholesale price', 'Minimum quantity per tier', 'Offer (compare-at) price'],
        'Automatic': ['Rule check: wholesale no higher than trade, trade no higher than retail', 'Price recorded on each order line', 'Quantity breaks applied at checkout'],
        'Export': ['Price list report']}),
    ('Stock', 'Always know what is on the shelf.', 'Order desk, administrator', {
        'View': ['Stock for every pack size', 'Low-stock list'],
        'Update': ['Stock quantity', 'Reorder level'],
        'Automatic': ['Down when an order is placed, back up when it is cancelled'],
        'Export': ['Low-stock and reorder report']}),
    ('Customers', 'Who buys.', 'Administrator', {
        'Create': ['Buyers sign up themselves'],
        'View': ['Buyer list with type, city and order count'],
        'Update': ['Change a buyer type (public, shopkeeper, wholesaler)'],
        'Remove': ['Deactivate or reactivate an account, history kept'],
        'Export': ['Customers and trade accounts report']}),
    ('Trade accounts', 'Controlled access to trade and wholesale prices.', 'Buyers apply; administrator decides', {
        'Create': ['Apply with business name, city, phone and a note'],
        'View': ['Queue of waiting applications'],
        'Approve': ['Approve or reject; approval sets the buyer type']}),
    ('Delivery', 'Where and when goods go.', 'Administrator; order desk for the delivery list', {
        'View': ['Delivery zones', "Today's delivery list by time slot"],
        'Update': ['Fee, free-delivery threshold, estimated days, active or not'],
        'Export': ['Delivery list report']}),
    ('Enquiries and store content', 'Talk to customers and keep the shop front fresh.', 'Public to send; staff to manage', {
        'Create': ['Contact and franchise enquiries from the public site'],
        'Update': ['Enquiry status: new, answered, closed', 'Payment account details'],
        'Remove': ['Show or hide home-page banners']}),
    ('Dashboards and reports', 'See how the business is doing.', 'Order desk, administrator', {
        'View': ['Overview: six headline numbers and six charts', 'Web traffic by page, device and language'],
        'Export': ['Eleven reports as CSV']}),
    ('Governance', 'Trust and traceability.', 'Administrator', {
        'View': ['Audit trail: who, what, when, old and new value', 'Sign-in and sign-out log', 'Data dictionary', 'Read-only database view'],
        'Automatic': ['Every admin write is recorded', 'Every admin page is protected on the server']}),
    ('Accounts and access', 'Who may do what.', 'Everyone', {
        'Create': ['Register an account'],
        'View': ['Sign in and out; roles: guest, customer, shopkeeper, wholesaler, order desk, administrator'],
        'Update': ['Language switch, English or Urdu']}),
]

# ontology: key, label, group, definition, key fields, connections (key, verb, direction label)
ONTO = {
    'buyer': ('Buyer', 'people', 'A person or business that buys. Has a buyer type that decides the price tier.', ['Name, phone, city', 'Buyer type: public, shopkeeper or wholesaler', 'Active or deactivated']),
    'trade': ('Trade application', 'store', 'A buyer asking for trade or wholesale prices. Staff approve or reject.', ['Business name, city, phone', 'Requested type', 'Status: pending, approved, rejected']),
    'staff': ('Staff account', 'people', 'Order desk or administrator. Order desk handles orders, payments and stock; administrators also manage catalogue, prices and customers.', ['Role: staff or admin', 'Sign-in history']),
    'order': ('Order', 'sales', 'One purchase: who bought, what, where it goes, how it is paid and where it stands.', ['Order number', 'Buyer tier, delivery slot, totals', 'Status: placed, confirmed, packed, out for delivery, delivered, cancelled']),
    'line': ('Order line', 'sales', 'One pack size on an order, with the quantity and the price the buyer saw.', ['Pack size, quantity', 'Unit price kept as sold', 'Line total']),
    'zone': ('Delivery zone', 'sales', 'An area with its own delivery fee, free-delivery threshold and estimated days.', ['Fee', 'Free above', 'Estimated days']),
    'payment': ('Payment', 'sales', 'The money for an order and its proof.', ['Method: cash, wallet or bank', 'Transaction ID and proof', 'Status: awaiting, submitted, verified, rejected, paid on delivery']),
    'event': ('Order event', 'sales', 'One step in the order timeline.', ['Status', 'Who changed it and when', 'Optional note']),
    'category': ('Category', 'catalogue', 'A group of products in the shop.', ['Name in two languages', 'Display order']),
    'product': ('Product', 'catalogue', 'Something the shop sells, before it is split into pack sizes.', ['Name and description in two languages', 'Photo, shelf life', 'Featured, new, organic, active']),
    'pack': ('Pack size', 'catalogue', 'A product in one size. The unit that is priced, stocked and ordered.', ['Size', 'Stock and reorder level', 'Active or hidden']),
    'price': ('Price by buyer type', 'catalogue', 'The price of a pack size for retail, trade and wholesale buyers.', ['Price per tier', 'Minimum quantity per tier', 'Offer (compare-at) price']),
    'breaks': ('Quantity break', 'catalogue', 'A lower unit price from a given quantity.', ['Tier', 'From quantity', 'Unit price']),
    'audit': ('Audit entry', 'trust', 'A record of an admin change.', ['Who, what, when', 'Old and new value']),
    'signin': ('Sign-in record', 'trust', 'A record of a sign-in, a failed sign-in or a sign-out.', ['Account', 'Event', 'When']),
}
# node positions in a 1000 x 620 canvas
POS = {'buyer': (110, 140), 'trade': (110, 280), 'staff': (110, 440), 'signin': (110, 570),
       'zone': (380, 50), 'order': (380, 170), 'payment': (380, 310), 'event': (380, 440), 'audit': (380, 570),
       'line': (640, 170), 'pack': (640, 310), 'price': (640, 440), 'category': (890, 170), 'product': (890, 310), 'breaks': (890, 440)}
EDGES = [('buyer', 'order', 'places'), ('buyer', 'trade', 'applies with'), ('order', 'zone', 'ships via'), ('order', 'line', 'contains'), ('order', 'payment', 'paid by'), ('order', 'event', 'records'),
         ('line', 'pack', 'is a'), ('pack', 'product', 'size of'), ('product', 'category', 'in'), ('pack', 'price', 'has'), ('pack', 'breaks', 'has'),
         ('staff', 'payment', 'verifies'), ('staff', 'audit', 'leaves'), ('staff', 'signin', 'leaves')]
EXTRAS = [('Enquiry', 'A contact or franchise message from the public, with a status.'), ('Home banner', 'A message on the shop front that staff can show or hide.'),
          ('Payment account', 'The account details buyers pay into.'), ('Page view', 'One visit to a page, by device and language, for web traffic.')]
GROUPCOL = {'people': '#7a4cf0', 'sales': '#f28a1e', 'catalogue': '#14b8a6', 'trust': '#2457f5', 'store': '#e0467f'}
GROUPNAME = {'people': 'People', 'sales': 'Sales', 'catalogue': 'Catalogue', 'trust': 'Trust', 'store': 'Store'}


TAX = '''<div class="ps-tax">
<div class="ps-card"><h5 class="mono">Buyer types and prices</h5><ul class="ps-flow"><li>Public shopper <b>retail price</b></li><li>Shopkeeper <b>trade price</b></li><li>Wholesaler <b>wholesale price</b></li></ul><p>Trade and wholesale prices unlock only after a staff member approves the account.</p></div>
<div class="ps-card"><h5 class="mono">How the catalogue is organised</h5><ul class="ps-flow ps-h"><li>Category</li><li>Product</li><li>Pack size</li><li>Price by buyer type</li></ul><p>Stock and orders attach to the pack size, so every size is counted on its own.</p></div>
<div class="ps-card"><h5 class="mono">An order&#39;s life</h5><ul class="ps-flow ps-h"><li>Placed</li><li>Confirmed</li><li>Packed</li><li>Out for delivery</li><li>Delivered</li></ul><p>Cancelled is possible before delivery and returns the stock.</p></div>
<div class="ps-card"><h5 class="mono">A payment&#39;s life</h5><ul class="ps-flow ps-h"><li>Awaiting</li><li>Submitted</li><li>Verified</li><li>or Rejected</li></ul><p>Cash orders go straight to pay on delivery, then paid on delivery.</p></div>
<div class="ps-card"><h5 class="mono">Who may do what</h5><ul class="ps-flow"><li>Guest <b>browse, buy, track</b></li><li>Customer <b>+ account and order history</b></li><li>Order desk <b>orders, payments, stock</b></li><li>Administrator <b>everything</b></li></ul></div>
</div>'''
LEGEND = ('people', 'catalogue', 'sales', 'trust')
CANVAS = (1000, 620)
JTITLE = 'The journey of an order'
DASHTAB = 'Dashboards and reports'
MODINTRO = 'Thirteen modules. Pick one to see exactly what a person can do in it. Nothing here is deleted for good: records are hidden or deactivated, so the history is always there.'
FEATINTRO = '{n} features, grouped by what they do for the buyer and for the owner. Open the Modules tab to see them by screen.'
ONTOHINT = 'The arrows read as a sentence: <b>Buyer places Order</b>, <b>Order contains Order line</b>.'
SHOTDIR = 'img/products/wholesale'
SHOTNOTE = 'The shop shown is a sample store with sample records.'


def onto_svg():
    W, H = CANVAS; nw, nh = 170, 52
    s = [f'<svg class="ps-onto" viewBox="0 0 {W} {H}" role="group" aria-label="How the parts of the product connect">']
    s.append('<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1l9 4-9 4z" fill="#8a96b8"/></marker></defs>')
    def edge_pts(a, b):
        ax, ay = POS[a]; bx, by = POS[b]
        dx, dy = bx - ax, by - ay
        if abs(dx) > abs(dy) * 0.8 or abs(dy) < 5:   # side to side
            sx = ax + (nw / 2 if dx > 0 else -nw / 2); ex = bx - (nw / 2 if dx > 0 else -nw / 2); return sx, ay, ex, by
        sy = ay + (nh / 2 if dy > 0 else -nh / 2); ey = by - (nh / 2 if dy > 0 else -nh / 2); return ax, sy, bx, ey
    for a_, b_, lab in EDGES:
        x1, y1, x2, y2 = edge_pts(a_, b_)
        s.append(f'<g class="ps-edge" data-a="{a_}" data-b="{b_}"><line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" marker-end="url(#ar)"/><text x="{(x1 + x2) / 2}" y="{(y1 + y2) / 2 - 6}" text-anchor="middle">{lab}</text></g>')
    for k, (x, y) in POS.items():
        lab, grp, *_ = ONTO[k]
        col = GROUPCOL[grp]
        s.append(f'<g class="ps-node" data-k="{k}" tabindex="0" role="button" aria-label="{E(lab)}" transform="translate({x - nw / 2} {y - nh / 2})"><rect width="{nw}" height="{nh}" rx="14" style="--nc:{col}"/><rect class="bar" width="8" height="{nh}" rx="4" fill="{col}"/><text x="{nw / 2 + 4}" y="{nh / 2 + 5}" text-anchor="middle">{E(lab)}</text></g>')
    s.append('</svg>')
    return ''.join(s)


def onto_panel():
    cards = {}
    for k, (lab, grp, d, fields) in ONTO.items():
        rel = []
        for a_, b_, v in EDGES:
            if a_ == k: rel.append(f'{v} {ONTO[b_][0]}')
            if b_ == k: rel.append(f'{ONTO[a_][0]} {v} it')
        cards[k] = (lab, grp, d, fields, rel)
    detail = ''.join(f'<div class="ps-ond" data-k="{k}" hidden><span class="ps-grp mono" style="--nc:{GROUPCOL[g]}">{GROUPNAME[g]}</span><h4>{E(l)}</h4><p>{E(d)}</p><p class="mono ps-sub">Holds</p><ul>' + ''.join(f'<li>{E(f)}</li>' for f in fl) + '</ul><p class="mono ps-sub">Connects to</p><ul>' + ''.join(f'<li>{E(r)}</li>' for r in rl) + '</ul></div>' for k, (l, g, d, fl, rl) in cards.items())
    intro = '<div class="ps-ond ps-ond-intro"><h4>Pick any box</h4><p>Each box is a thing the product keeps track of. ' + ONTOHINT + ' Select a box to see what it holds and what it connects to.</p></div>'
    legend = ''.join(f'<li><i style="background:{GROUPCOL[g]}"></i>{GROUPNAME[g]}</li>' for g in LEGEND)
    lst = ''.join(f'<li><b>{E(l)}</b> <span>{E(d)}</span><em>' + '; '.join(rl) + '</em></li>' for k, (l, g, d, fl, rl) in cards.items())
    tax = TAX
    extras = ''.join(f'<li><b>{E(a_)}</b> {E(b_)}</li>' for a_, b_ in EXTRAS)
    return (f'<div class="ps-ontology"><div class="ps-onto-wrap">{onto_svg()}<ul class="ps-legend">{legend}</ul></div>'
            f'<aside class="ps-ond-box" aria-live="polite">{intro}{detail}</aside></div>'
            f'<ol class="ps-onto-list">{lst}</ol>'
            f'<h4 class="ps-h4">Also kept by the product, on their own</h4><ul class="ps-extras">{extras}</ul>'
            f'<h4 class="ps-h4">Taxonomies: how things are classified</h4>{tax}')


# ------------------------------------------------------------------ dashboards (sample data, invented, no real figures)
def dashboard_panel():
    kpis = [('Orders today', '24', 'placed, confirmed or packed: 9'), ('Sales, last 30 days', '128.4k', 'up 12% on the month before'), ('Orders to process', '9', 'waiting on the order desk'),
            ('Payments to verify', '4', 'proof submitted'), ('Trade applications', '3', 'waiting for a decision'), ('Low-stock pack sizes', '7', 'at or below reorder level')]
    k = ''.join(f'<div class="ps-kpi"><p class="mono">{E(a_)}</p><b>{E(b_)}</b><span>{E(c_)}</span></div>' for a_, b_, c_ in kpis)
    # sales per day area chart
    n = 30; vals = [60 + 22 * math.sin(i / 3.2) + 14 * math.sin(i / 1.3 + 1) + i * 1.6 for i in range(n)]
    mx, mn = max(vals), min(vals); w, h = 420, 150
    pts = [(i * w / (n - 1), h - 14 - (v - mn) / (mx - mn) * (h - 40)) for i, v in enumerate(vals)]
    line = ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
    area = f'0,{h} ' + line + f' {w},{h}'
    grid = ''.join(f'<line x1="0" x2="{w}" y1="{y}" y2="{y}"/>' for y in (30, 70, 110))
    c1 = f'<svg viewBox="0 0 {w} {h}" class="ps-chart" role="img" aria-label="Sample chart: sales per day for the last 30 days, rising"><g class="grid">{grid}</g><polygon class="area" points="{area}"/><polyline class="ln" pathLength="1" points="{line}"/><circle cx="{pts[-1][0]:.1f}" cy="{pts[-1][1]:.1f}" r="5"/></svg>'
    # donut
    def donut(parts, cols):
        r, cx, cy, circ = 46, 60, 60, 2 * math.pi * 46; off = 0; out = []
        for (lab, v), col in zip(parts, cols):
            ln = v / 100 * circ
            out.append(f'<circle r="{r}" cx="{cx}" cy="{cy}" fill="none" stroke="{col}" stroke-width="22" stroke-dasharray="{ln:.1f} {circ - ln:.1f}" stroke-dashoffset="{-off:.1f}" transform="rotate(-90 {cx} {cy})"/>'); off += ln
        return f'<svg viewBox="0 0 120 120" class="ps-donut" role="img" aria-label="Sample chart: sales by buyer type">{"".join(out)}</svg>'
    bt = [('Retail', 38), ('Shopkeeper', 34), ('Wholesale', 28)]; btc = ['#f28a1e', '#14b8a6', '#2457f5']
    c2 = '<div class="ps-donutwrap">' + donut(bt, btc) + '<ul class="ps-leg">' + ''.join(f'<li><i style="background:{c}"></i>{l} <b>{v}%</b></li>' for (l, v), c in zip(bt, btc)) + '</ul></div>'
    def bars(rows, col, unit=''):
        m = max(v for _, v in rows)
        return '<ul class="ps-bars">' + ''.join(f'<li><span>{E(l)}</span><div><i style="width:{v / m * 100:.0f}%;background:{col}"></i></div><b>{v}{unit}</b></li>' for l, v in rows) + '</ul>'
    c3 = bars([('Spices', 41), ('Flours', 33), ('Pulses', 24), ('Oils and ghee', 19), ('Dry fruit', 11)], '#14b8a6', 'k')
    c4 = bars([('Best seller A', 18), ('Best seller B', 15), ('Best seller C', 12), ('Best seller D', 9), ('Best seller E', 7)], '#7a4cf0', 'k')
    c5 = bars([('Cash on delivery', 46), ('Mobile wallet', 31), ('Bank transfer', 23)], '#f28a1e', '%')
    c6 = bars([('Placed', 9), ('Confirmed', 12), ('Packed', 8), ('Out for delivery', 6), ('Delivered', 118), ('Cancelled', 5)], '#2457f5')
    charts = [('Sales per day, last 30 days', c1, 'wide'), ('Sales by buyer type', c2, ''), ('Sales by category', c3, ''), ('Top products', c4, ''), ('Payment methods', c5, ''), ('Orders by status', c6, '')]
    ch = ''.join(f'<div class="ps-card ps-chartcard {w_}"><h5 class="mono">{t}</h5>{c}</div>' for t, c, w_ in charts)
    att = ('<div class="ps-card"><h5 class="mono">Needs attention</h5><ul class="ps-att"><li><b>4 payments</b> to verify <em>Review</em></li><li><b>9 orders</b> to process <em>Open queue</em></li>'
           '<li><b>7 pack sizes</b> low on stock <em>See stock</em></li><li><b>3 trade applications</b> waiting <em>Decide</em></li></ul></div>')
    reps = [('Sales by day', 'Orders and sales per day, last 90 days'), ('Sales by product and pack size', 'Quantity and sales for every pack size'), ('Sales by category', 'Sales per catalogue category'),
            ('Sales by buyer type', 'Retail, shopkeeper and wholesale sales'), ('Orders by status', 'The current order pipeline'), ('Payments by method and status', 'Every payment and where it stands'),
            ('Cash on delivery to collect', 'Cash orders not yet paid'), ('Low stock and reorder', 'Pack sizes at or below their reorder level'), ('Customers and trade accounts', 'Buyers with type, city and order counts'),
            ('Delivery list', 'Open orders by time slot and area'), ('Price list by tier', 'Retail, trade and wholesale price of every pack size')]
    rp = ''.join(f'<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l4 4v14H7zM14 3v4h4M9 13h6M9 17h6"/></svg><div><b>{E(t)}</b><span>{E(d)}</span></div><em class="mono">CSV</em></li>' for t, d in reps)
    return (f'<p class="ps-note"><b>Sample data.</b> These numbers are invented to show what the screens look like. Your own figures appear here once the shop is trading.</p>'
            f'<div class="ps-kpis">{k}</div><div class="ps-charts">{ch}{att}</div>'
            f'<h4 class="ps-h4">Eleven reports, each one a click to download</h4><ul class="ps-reports">{rp}</ul>')


def modules_panel():
    nav = ''.join(f'<button type="button" class="ps-mod{" on" if i == 0 else ""}" data-m="{i}"><b>{E(n)}</b><span>{E(p)}</span></button>' for i, (n, p, w, v) in enumerate(MODULES))
    det = ''
    ICON = {'Create': 'M12 5v14M5 12h14', 'View': 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', 'Update': 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',
            'Remove': 'M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13', 'Approve': 'M5 12.5l4.5 4.5L19 7.5', 'Export': 'M12 4v11M7 10l5 5 5-5M5 20h14', 'Automatic': 'M13 2L4 14h7l-1 8 9-12h-7z'}
    for i, (n, p, w, v) in enumerate(MODULES):
        rows = ''.join(f'<div class="ps-verb"><div class="ps-vl"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{ICON[k]}"/></svg><b>{ {"Remove": "Remove / hide", "Automatic": "Happens by itself"}.get(k, k)}</b></div><ul>' + ''.join(f'<li>{E(x)}</li>' for x in items) + '</ul></div>' for k, items in v.items())
        det += f'<div class="ps-moddet" data-m="{i}"{"" if i == 0 else " hidden"}><h4>{E(n)}</h4><p class="ps-purpose">{E(p)}</p><p class="mono ps-who">Used by: {E(w)}</p>{rows}</div>'
    return (f'<p class="ps-intro">{E(MODINTRO)}</p>'
            f'<div class="ps-modules"><nav class="ps-modnav" aria-label="Modules">{nav}</nav><div class="ps-modbody">{det}</div></div>')


def overview_panel():
    prob = ''.join(f'<li><span class="ps-q">{E(q)}</span><span class="ps-a">{CK}{E(a_)}</span></li>' for q, a_ in PROBLEMS)
    pers = ''.join(f'<div class="ps-card ps-persona"><h5>{E(t)}</h5><p>{E(d)}</p></div>' for t, d in PERSONAS)
    gl = ''.join(f'<div class="ps-num"><b>{a_}</b><span>{E(b_)}</span></div>' for a_, b_ in GLANCE)
    jr = ''.join(f'<li>{E(x)}</li>' for x in JOURNEY)
    return (f'<p class="ps-lead">{E(LEAD)}</p><p class="ps-about">{E(ABOUT)}</p><div class="ps-nums">{gl}</div>'
            f'<h4 class="ps-h4">The problems it takes off your desk</h4><ul class="ps-prob">{prob}</ul>'
            f'<h4 class="ps-h4">Who uses it</h4><div class="ps-personas">{pers}</div>'
            f'<h4 class="ps-h4">{E(JTITLE)}</h4><ol class="ps-journey">{jr}</ol>')


def features_panel(p):
    if not p.get('full'):
        items = ''.join(f'<li class="ps-fi">{CK}<div><b>{E(x)}</b></div></li>' for x in p['draft'])
        return f'<p class="ps-note"><b>Draft.</b> The full feature list for this product is being prepared.</p><ul class="ps-fgrid">{items}</ul>'
    out = []
    for g, items in FEATURES:
        out.append(f'<section class="ps-fg"><h4 class="ps-h4">{E(g)}</h4><ul class="ps-fgrid">' + ''.join(f'<li class="ps-fi">{CK}<div><b>{E(t)}</b><span>{E(d)}</span></div></li>' for t, d in items) + '</ul></section>')
    total = sum(len(i) for _, i in FEATURES)
    return '<p class="ps-intro">' + E(FEATINTRO.format(n=total)) + '</p>' + ''.join(out)


def overview_draft(p):
    return (f'<p class="ps-lead">{E(p["tag"])}.</p><p class="ps-note"><b>Draft.</b> The full overview, modules, concept map and dashboards for this product are being prepared. '
            f'Meanwhile, <a href="contact.html">ask for a demo</a> and we will walk you through it.</p>')


SHOTS = [
    ('01-home', 'The public shop', 'Search, categories, offers, and the delivery and payment promises, on the first screen a buyer sees.'),
    ('02-product', 'A product page', "Pack sizes, the signed-in buyer's own price, the minimum order and the quantity breaks."),
    ('03-cart', 'The cart', 'Totals, the delivery fee for the zone, and how far the buyer is from free delivery.'),
    ('04-admin', 'Owner overview', 'Six numbers and the charts behind them: sales, orders to process, payments to verify, low stock.'),
    ('05-orders', 'The order desk', 'Every order with its status and payment, searchable and filterable by status.'),
]


def shots_panel():
    th = ''.join(f'<button type="button" class="ps-shot" data-i="{i}" aria-label="Open screenshot {i + 1} of {len(SHOTS)}: {t}"><span class="ps-shot-img"><img src="{SHOTDIR}/{f}.jpg" alt="{t}" loading="lazy" width="1440" height="813"></span><b>{t}</b><span>{d}</span></button>' for i, (f, t, d) in enumerate(SHOTS))
    return f'<p class="ps-lead">Real screens from the working product. Open any one to see it large. {E(SHOTNOTE)}</p><div class="ps-shots">{th}</div>'


def lightbox():
    x = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    return ('<div class="ps-lb" hidden role="dialog" aria-modal="true" aria-label="Screenshot viewer">'
            f'<button type="button" class="ps-lb-x" data-lbclose aria-label="Close viewer">{x}<path d="M6 6l12 12M18 6L6 18"/></svg></button>'
            f'<button type="button" class="ps-lb-n ps-lb-prev" data-lbprev aria-label="Previous screenshot">{x}<path d="M15 5l-7 7 7 7"/></svg></button>'
            '<figure class="ps-lb-fig"><img class="ps-lb-img" alt=""><figcaption><b></b><span></span><em></em></figcaption></figure>'
            f'<button type="button" class="ps-lb-n ps-lb-next" data-lbnext aria-label="Next screenshot">{x}<path d="M9 5l7 7-7 7"/></svg></button>'
            '</div>')



def use(pid):
    globals().update(DATASETS[pid])


def sheet(p):
    use(p['id']) if p['id'] in DATASETS else None
    tabs = [('overview', 'Overview'), ('features', 'Features')]
    if p.get('full'): tabs += [('modules', 'Modules'), ('ontology', 'Concept map'), ('dash', DASHTAB), ('shots', 'Screenshots')]
    panels = {'overview': overview_panel() if p.get('full') else overview_draft(p), 'features': features_panel(p)}
    if p.get('full'): panels.update({'modules': modules_panel(), 'ontology': onto_panel(), 'dash': DASH(), 'shots': shots_panel()})
    tb = ''.join(f'<button type="button" role="tab" id="ps-{p["id"]}-t-{k}" aria-controls="ps-{p["id"]}-p-{k}" aria-selected="{"true" if i == 0 else "false"}" tabindex="{0 if i == 0 else -1}" data-tab="{k}">{lab}</button>' for i, (k, lab) in enumerate(tabs))
    pn = ''.join(f'<div class="ps-panel" role="tabpanel" id="ps-{p["id"]}-p-{k}" aria-labelledby="ps-{p["id"]}-t-{k}" data-tab="{k}"{"" if i == 0 else " hidden"} tabindex="0">{panels[k]}</div>' for i, (k, _) in enumerate(tabs))
    return f'''
<div class="ps" id="ps-{p['id']}" role="dialog" aria-modal="true" aria-labelledby="ps-{p['id']}-title" hidden style="--c:{p['c']};--cd:{p['cd']};--soft:{p['soft']}">
  <div class="ps-sheet">
    <header class="ps-head">
      <span class="ps-agent"><span data-ag="{p['ag']}" data-v="head"></span></span>
      <div class="ps-ht"><p class="mono">Product {p['n']} · Built with {p['who']}, {p['role']}</p><h2 id="ps-{p['id']}-title">{p['name']}</h2><p class="ps-tag">{p['tag']}</p></div>
      <a class="btn ps-demo" href="contact.html">Ask for a demo <span class="arr">→</span></a>
      <button type="button" class="ps-x" data-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </header>
    <div class="ps-tabs" role="tablist" aria-label="Sections">{tb}</div>
    <div class="ps-body">{pn}</div>
    {lightbox() if p.get('full') else ''}
  </div>
</div>'''


WHOLESALE = {k: globals()[k] for k in ('LEAD', 'ABOUT', 'PROBLEMS', 'PERSONAS', 'GLANCE', 'JOURNEY', 'JTITLE', 'FEATURES', 'FEATINTRO', 'MODULES', 'MODINTRO', 'ONTO', 'POS', 'EDGES', 'EXTRAS', 'GROUPCOL', 'GROUPNAME', 'LEGEND', 'CANVAS', 'ONTOHINT', 'TAX', 'SHOTS', 'SHOTDIR', 'SHOTNOTE', 'DASHTAB')}
WHOLESALE['DASH'] = dashboard_panel
sys.path.insert(0, os.path.join(ROOT, 'scripts'))
import products_ims
IMS = {k: getattr(products_ims, k) for k in list(WHOLESALE)}
IMS['DASH'] = products_ims.DASH
IMS['DASHTAB'] = 'Dashboard and statements'
DATASETS = {'wholesale': WHOLESALE, 'ims': IMS}

cards = ''
sheets = ''
for p in P:
    chips = ''.join(f'<li>{f}</li>' for f in p['feats'])
    cards += f'''
        <article class="prod rv" id="{p['id']}" style="--c:{p['c']};--cd:{p['cd']};--soft:{p['soft']}" data-who="{p['who']}" data-name="{p['name']}">
            <div class="prod-face prod-front">
                <div class="prod-art"><svg viewBox="0 0 240 124" aria-hidden="true">{p['art']}</svg>
                    <span class="prod-n mono">Product {p['n']}</span>
                    <span class="prod-agent"><span data-ag="{p['ag']}" data-v="head"></span></span>
                </div>
                <div class="prod-body">
                    <h3>{p['name']}</h3>
                    <p class="prod-tag">{p['tag']}</p>
                    <ul class="prod-feats">{chips}</ul>
                    <p class="prod-by mono">Built with {p['who']} · {p['role']}</p>
                    <div class="prod-go"><a class="btn btn--solid" href="contact.html">Ask for a demo <span class="arr">→</span></a><button type="button" class="btn prod-flip" data-open="{p['id']}" aria-haspopup="dialog">{FLIP} Features</button></div>
                </div>
                <div class="prod-say" role="note"><b>{p['who']}</b><span>{p['say']}</span></div>
            </div>
        </article>'''
    sheets += sheet(p)

main = f'''<main>
    <section class="page-head prod-head">
        <div class="wrap prod-head-in">
            <div>
                <p class="mono eyebrow"><i></i>Products</p>
                <h1 class="h1">Products our agents <span class="hl">built for you.</span></h1>
                <p class="lede">Four working products, each one designed, built and checked by the YPT agent team and the people who steer them. Pick the one closest to your business and open it to see everything it does.</p>
            </div>
            <div class="guide-bubble" id="guide-bubble">
                <span class="gb-ag" data-ag="guide"></span>
                <div class="gb-say"><b>Alya</b><span id="gb-text">Hi, I'm Alya. Four products below. Hover one and its builder will tell you about it.</span>
                    <span class="gb-btns"><a class="btn btn--solid" href="#products">See the products</a><a class="btn" href="contact.html">Talk to a person</a></span></div>
            </div>
        </div>
    </section>

    <section class="sec" id="products" style="padding-top:36px">
        <div class="wrap">
            <div class="prod-grid">{cards}
            </div>
        </div>
    </section>

    <section class="sec sec--plain">
        <div class="wrap">
            <div class="sec-head rv">
                <p class="mono">How they are made</p>
                <h2 class="h2">Built by agents, <span class="hl">checked by people.</span></h2>
                <p class="lede">Every product follows the same path as our client work: we listen first, design it, prove it small, build it, check it, then launch and hand it over.</p>
            </div>
            <ol class="pflow rv">
                <li><span data-ag="vera" data-v="head"></span><b>Discover</b><span>Siti asks the questions.</span></li>
                <li><span data-ag="atlas" data-v="head"></span><b>Design</b><span>Wei draws the plan.</span></li>
                <li><span data-ag="forge" data-v="head"></span><b>Build</b><span>Jun builds it.</span></li>
                <li><span data-ag="aegis" data-v="head"></span><b>Check</b><span>Mei checks it.</span></li>
                <li><span data-ag="orca" data-v="head"></span><b>Launch</b><span>Farid launches it.</span></li>
            </ol>
            <div class="prod-cta rv"><p>Not sure which product fits? <b>Tell us about your business</b> and our team will point you to the right one.</p><a class="btn btn--solid" href="contact.html">Talk to us <span class="arr">→</span></a></div>
        </div>
    </section>
</main>
<div class="ps-backdrop" id="ps-backdrop" hidden></div>{sheets}'''
open('products.html', 'w', encoding='utf8').write(head + main + foot)
print('ok', len(head + main + foot) // 1024, 'KB')

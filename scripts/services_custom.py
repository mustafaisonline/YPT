"""Content for the Custom Agentic AI Solutions service.
Famous products are named only as a reference to the KIND of system (nominative use). Ours are built fresh for the customer, never copies."""

OFFER = 'Any solution for $100'
OFFER_SUB = 'for our first 500 customers'

# (id, name, "the kind of system you know as", what it does, [what you could have], icon path (48 box))
KINDS = [
    ('crm', 'Customer relationship management', 'Salesforce, HubSpot, Zoho CRM',
     'Everything about your customers and deals in one place.',
     ['Leads, accounts and contacts', 'Sales pipeline and forecasts', 'Quotes, follow-ups and reminders', 'Reports for sales leaders'],
     '<circle cx="18" cy="17" r="6"/><path d="M6 38c0-7 5-11 12-11s12 4 12 11"/><path d="M31 14h11M31 21h8M33 30l4 4 6-8"/>'),
    ('erp', 'Enterprise resource planning', 'SAP, Oracle NetSuite, Odoo',
     'Finance, buying, stock, orders and reports, joined up.',
     ['Purchasing and supplier records', 'Inventory and warehouses', 'Orders, invoices and payments', 'Financial and management reports'],
     '<rect x="6" y="8" width="16" height="14" rx="3"/><rect x="26" y="8" width="16" height="14" rx="3"/><rect x="6" y="26" width="16" height="14" rx="3"/><rect x="26" y="26" width="16" height="14" rx="3"/>'),
    ('hrm', 'Human resources management', 'Workday, BambooHR, SAP SuccessFactors',
     'People records and people processes, handled and tracked.',
     ['Employee profiles and documents', 'Leave, attendance and approvals', 'Hiring and onboarding', 'Appraisals and training records'],
     '<circle cx="24" cy="14" r="6"/><path d="M10 40c0-8 6-13 14-13s14 5 14 13"/><circle cx="9" cy="20" r="3.5"/><circle cx="39" cy="20" r="3.5"/>'),
    ('ticket', 'Ticketing and work management', 'Jira, ServiceNow, Asana',
     'Requests, tasks and issues, from raised to resolved.',
     ['Tickets, boards and workflows', 'Assignments, priorities and deadlines', 'Service levels and escalations', 'Team and customer views'],
     '<path d="M6 16a4 4 0 0 0 0 8v10a2 2 0 0 0 2 2h32a2 2 0 0 0 2-2V24a4 4 0 0 1 0-8V14a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2z" transform="translate(0 0)"/><path d="M18 18v12M18 24h12"/>'),
    ('wiki', 'Knowledge and documentation', 'Confluence, Notion, SharePoint',
     'One place for pages, procedures and what the team knows.',
     ['Spaces, pages and templates', 'Search that finds the answer', 'Review and approval of content', 'Ask-it-a-question assistant'],
     '<path d="M12 6h18l8 8v28H12z"/><path d="M30 6v8h8"/><path d="M18 24h14M18 30h14M18 36h9"/>'),
    ('mdm', 'Master data management', 'Informatica MDM, Reltio, Profisee',
     'One trusted version of your customers, products and suppliers.',
     ['Matching and merging of duplicates', 'Golden records with history', 'Reference data and hierarchies', 'Stewardship queues and quality rules'],
     '<ellipse cx="24" cy="12" rx="14" ry="6"/><path d="M10 12v12c0 3 6 6 14 6s14-3 14-6V12"/><path d="M10 24v12c0 3 6 6 14 6s14-3 14-6V24"/>'),
    ('help', 'Customer support and helpdesk', 'Zendesk, Freshdesk, Intercom',
     'Answer customers quickly, in one shared inbox.',
     ['Email, chat and web forms in one queue', 'Suggested answers from your knowledge base', 'Routing, tags and satisfaction checks', 'Support performance reports'],
     '<path d="M8 12h32a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H22l-8 7v-7H8a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z"/><path d="M15 21h18M15 27h11"/>'),
    ('bi', 'Dashboards and analytics', 'Power BI, Tableau, Looker',
     'Live numbers your team can actually read and trust.',
     ['KPI dashboards by role', 'Drill-downs and filters', 'Scheduled reports by email', 'Ask-a-question-in-words analytics'],
     '<path d="M8 40V8M8 40h34"/><rect x="14" y="26" width="6" height="10" rx="1.5"/><rect x="25" y="18" width="6" height="18" rx="1.5"/><rect x="36" y="10" width="6" height="26" rx="1.5"/>'),
    ('flow', 'Workflow and approvals', 'ServiceNow, Power Automate, Camunda',
     'Requests that move to the right person without chasing.',
     ['Forms and multi-step approvals', 'Rules, deadlines and reminders', 'Audit trail of every decision', 'Hand-offs between teams'],
     '<rect x="6" y="8" width="12" height="10" rx="2.5"/><rect x="30" y="8" width="12" height="10" rx="2.5"/><rect x="18" y="30" width="12" height="10" rx="2.5"/><path d="M18 13h12M12 18v6c0 3 3 3 6 3h0M36 18v6c0 3-3 3-6 3"/>'),
    ('shop', 'Online store and booking', 'Shopify, Magento, Calendly',
     'Sell products or services online, and take orders or bookings.',
     ['Catalogue, cart and checkout', 'Prices, offers and delivery rules', 'Bookings, calendars and reminders', 'Orders and stock behind it'],
     '<path d="M8 14h32l-3 22H11z"/><path d="M17 14v-2a7 7 0 0 1 14 0v2"/>'),
    ('lms', 'Learning and certification', 'Moodle, Docebo, TalentLMS',
     'Train people, test them and issue certificates.',
     ['Courses, lessons and cohorts', 'Tests and certificates', 'Progress tracking', 'Trainer and manager views'],
     '<path d="M4 18l20-9 20 9-20 9z"/><path d="M12 23v9c4 4 20 4 24 0v-9M44 18v10"/>'),
    ('portal', 'Customer, vendor and staff portals', 'Salesforce Experience Cloud, custom portals',
     'A secure front door for the people you work with.',
     ['Sign-in and role-based access', 'Self-service requests and documents', 'Status tracking', 'Messages and notifications'],
     '<rect x="6" y="9" width="36" height="26" rx="3"/><path d="M6 17h36M16 40h16M24 35v5"/>'),
]

PILLARS = [
    ('Tell us in plain words', 'No specification to write. Describe what you want to happen, and our agents ask what they still need to know.'),
    ('Built by agents, checked by people', 'Our agent team designs and builds quickly. Our people check every step before you see it.'),
    ('It talks back', 'Every solution we hand over can be used by chat, or by voice if you choose, and takes you to the right screen.'),
    ('Made for your business', 'Your words, your steps, your rules. It is built around how you work, not the other way round.'),
]

# every solution comes with
EVERY = [
    ('Chat and voice', 'Ask it things in plain words, or talk to it.'),
    ('The right screen, fast', 'It opens the screen or form you need.'),
    ('Roles and access', 'Each person sees only what they should.'),
    ('A record of every change', 'Who did what, and when.'),
    ('Reports and exports', 'Numbers on screen, and files you can share.'),
    ('Works on phone and computer', 'Clear on a small screen as well as a big one.'),
]

STEPS = [
    ('vera', 'Discover', 'Siti asks the questions', 'You describe the problem and the outcome you want. Siti asks what is still unclear.'),
    ('atlas', 'Design', 'Wei draws the plan', 'Wei turns it into a simple plan and screens you can react to, before anything is built.'),
    ('forge', 'Build', 'Jun builds it', 'Jun builds the solution in short steps, and you see progress as it grows.'),
    ('aegis', 'Check', 'Mei checks it', 'Mei checks that it is safe, accurate and does what we agreed. People review the result.'),
    ('orca', 'Launch', 'Farid launches it', 'Farid puts it live and hands it over, with a walk-through for your team.'),
]

CUSTOM_FAQ = [
    ('Can you really build any kind of solution?', 'If it is a software solution a business can describe, yes. Tell us what you need. We confirm what is possible and agree the plan with you before we start.'),
    ('What does "any solution for $100" mean?', 'It is our launch offer for our first 500 customers. Use the button on this page to claim your spot and tell us what you want. We will confirm the details with you.'),
    ('Are these copies of Salesforce, Jira and the others?', 'No. We build a new system around your business that does the same kind of job. Those product names belong to their owners, and we mention them only so you can picture the kind of system.'),
    ('Do I need to know exactly what I want?', 'No. Start with the problem you want to solve. Our discovery step is there to turn it into a clear plan.'),
    ('Can it connect to what we already use?', 'Yes. We can connect to the systems you already have, and bring existing data across.'),
    ('How will I use it?', 'On a computer or a phone, by typing to it like a chat or, if you choose, by voice.'),
]

REPLICA_NOTE = 'Product names belong to their owners. We name them only to show the kind of system. Everything we build is created fresh for you.'

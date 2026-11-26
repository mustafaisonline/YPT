# WBS: Convert the YPT portal to the agentic AI theme

Branch: `agentic-ai-revamp` (own branch, never merged to `main` unless the user says so). Folder: `~/Documents/GitHub/YPT_agentic_AI`.
Rule: one page at a time. Read the whole page, propose, implement, check desktop and mobile, tick it here, wait for the user. Commit only on "Commit and push".
Status: `[ ]` todo, `[~]` in progress, `[x]` done, `[-]` no change.

Every page keeps the Limited-time offer banner (Joy, $100, first 500 customers) at the top. It ships inside the shared shell (0.3).

Content guardrails: keep every fact, offer, price, title, meta tag, canonical and JSON-LD. No new metrics or client claims. Existing content stays; the agent explains it.

## Phase 0: shared shell (do first)
- [x] 0.1 Numbering on the home hero: 1 Discovery (Siti, top centre), 2 Architect (Wei), 3 Pilot (Aiman), 4 Builder (Jun), 5 Governance (Mei), 6 Launch (Farid), 7 Enablement (Lin, ends top-left). Clockwise through the same seven slots. Number shown in the tag, crew rows and takeover heading.
- [x] 0.2 Banner helper renamed Mei Ling to Hui (no clash with Mei).
- [~] 0.3 (kit built in scripts/pagekit.py: banner + header + footer + guide; index/agents not yet restamped) One shared header, offer banner and footer (menu currently hard-coded in index.html and agents.html), with path prefixes for services/, blog/, partnerships/, team/, case-studies/.
- [~] 0.4 (built: agent head + speech bubble + data-guide lines + FAQ accordion + card kit, in css/agentic.css 'Page kit') Reusable page-guide block: one agent plus its lines (what this is, what it is not, where next).
- [ ] 0.5 Checks: agentic.js runs on pages with no #field; asset/module paths resolve from subfolders; main.js vs main.min.js.

## Phase 1: the seven lifecycle pages (in order)
| # | Page | Agent |
|---|---|---|
| [x] 1.1 | services/value-discovery-canvas.html | 1 Siti, Discovery |
| [~] 1.2 | strategic-advisory.html | 2 Wei, Architect |
| [x] 1.3 | ai-powered-consulting.html | 3 Aiman, Pilot |
| [x] 1.4 | services/data-ai-services.html | 4 Jun, Builder |
| [x] 1.5 | services/agentic-ai.html | 5 Mei, Governance + 6 Farid, Launch (both point here today; decide whether Governance gets its own page or section) |
| [x] 1.6 | trainings.html | 7 Lin, Enablement |

## Phase 2: hubs and trust pages
| # | Page | Proposed agent |
|---|---|---|
| [~] 2.1 | services.html | Jun (hub of all services) |
| [x] 2.2 | about.html (Why YPT) | Siti |
| [x] 2.3 | partnerships.html | Farid |
| [x] 2.4 | case-studies.html | Aiman |
| [x] 2.5 | case-studies/edw-replatforming.html | Aiman |
| [x] 2.6 | contact.html | Siti |
| [x] 2.7 | services/ltad.html | Lin |
| [x] 2.8 | services/ltad2.html | Mei (vendor-neutral evaluation) |
| [x] 2.9 | team/mustafa-qizilbash.html | Siti |
| [x] 2.10 | data-ai-essentials.html (training) | Lin |
| [x] 2.11 | enterprise-data-architecture.html (training) | Lin |
| [x] 2.12 | enterprise-data-modelling.html (training) | Lin |
| [x] 2.13 | data-blueprint.html (training) | Lin |
| [x] 2.14 | agentic-ai-strategy-adoption.html (training) | Lin |
| [x] 2.15 | ai-powered-product-development.html (training) | Lin |
| [x] 2.16 | data-ai-career-mentorship-program.html (training) | Lin |

## Phase 3: partnerships products, blog, utility
| # | Page | Plan |
|---|---|---|
| [ ] 3.1 | partnerships/*.html (6 product pages + _product-template) | Ask the user first: they look like placeholder vendors. Shell only until confirmed. |
| [ ] 3.2 | blog/index.html | Shell + guide |
| [ ] 3.3 | blog/*.html (10 articles) | Shell + guide only, article text untouched |
| [ ] 3.4 | 404.html | Shell + friendly agent |

## Already agentic
- [x] index.html (home)
- [x] agents.html (menu updated; names to refresh in Phase 0)

## No change (redirect stubs)
- [-] ai-powered-solutions.html, data-ai-consultancy.html, four4s.html, genai.html, ltad.html, ltad2.html, team.html
- [-] author/mustafaisonline/index.html, contact/index.html, partners/index.html, services/index.html, testimonials/index.html

## Open questions
1. Does Governance get its own page?
2. Partnership product pages: real or placeholder?
3. Blog: shell + guide only, or rewrite? (default: shell + guide only)

## Status 2026-11-27 (overnight)
All content pages converted with scripts/convert.py (text parity: 0 missing text nodes; icon-only links kept). Strategic Advisory and Services were hand-built. Open: restamp index/agents footer, per-page copy review by a human, CR-002 (standard/agentic switch).

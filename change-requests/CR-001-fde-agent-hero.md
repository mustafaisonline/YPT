# CR-001: Forward Deployed Engineer (FDE) hero with 7 lifecycle agents

Status: **Parked.** Not implemented. Waiting for the user to finish parallel changes in another terminal.
Raised: 2026-11-26

## Where the work lives (important)
The agent hero is NOT in this repo (`YPT`) or on GitHub. It is an uncommitted draft in:
`~/Documents/GitHub/YPT_agentic_AI` (same remote, untracked files):
- `home1.html` (hero, `data-open="..."` agent buttons, relay and crew rows)
- `agents.html` (agents page)
- `css/agentic.css`, `js/agentic.js` (agent artwork via `data-ag="<name>"`, `data-v="head"`)

Open question for implementation time: edit the draft in place (recommended), or port into live `index.html`. Re-check the draft first, since it is being changed in another terminal.

## Goal
Make the hero tell the delivery story: a human Forward Deployed Engineer sits with the customer and uses specialist AI agents from discovery to delivery.

## Hero structure
**Center:** Forward Deployed Engineer (FDE), the human lead. Standard title is "Forward Deployed Engineer" (not "deployment").
- Label: "Forward Deployed Engineer (FDE) · Human lead"
- Definition: "An engineer embedded with your team who uses AI agents to take you from discovery to a working solution."
- Keep the "Your Solution" box as the outcome beneath/near the center.
- Make the center visibly human (not a robot), larger than the agents; agents are secondary.

**Headline:** Meet your Forward Deployed Engineer.
**Subline:** One human expert, embedded with you, directing seven specialist AI agents from discovery to delivery.

**Story line:** Discover → Design → Pilot → Build → Govern → Launch → Adopt.
Show stage labels and/or numbering on the agents; light the connecting lines in lifecycle order.

## The 7 agents, in delivery order
| # | Agent | Label | Voice | Customer walks away with |
|---|---|---|---|---|
| 1 | Vera | Discovery | "I listen first." | Clear problem statement and value case |
| 2 | Atlas | Architect | "I design the blueprint." | Target design, data model, plan |
| 3 | Spark | Pilot | "I make it real, fast." | Working POC in days |
| 4 | Forge | Builder | "I build it for production." | Finished, integrated solution |
| 5 | Aegis (NEW) | Governance | "I keep it safe and accountable." | Guardrails, human-in-the-loop, audit trail |
| 6 | Orca | Launch | "I take it live and keep it running." | Production release with monitoring |
| 7 | Sage | Enablement | "I make your team self-sufficient." | Training and handover |

## Changes versus the current hero
- Added: human FDE center; new agent Aegis (Governance).
- Renamed: Atlas (Strategy to Architect), Spark (Product to Pilot), Orca (Orchestration to Launch).
- Removed: Scout (Ecosystem), not a step in delivering the customer's project. Scout's hub slot is reused for Aegis. Consider moving the ecosystem idea elsewhere (e.g. a partner-network line). Nav links that use Scout (`services/ltad2.html` "Ecosystem") need a new agent mapping.
- Kept: Vera, Forge, Sage.
- Optional later: an 8th Data agent (e.g. "Scout · Data"); needs hub layout rework.

## Agent pages (must be updated too)
Every agent opens its own page/hero. Update the content for each renamed role and create a new page/view for Aegis; remove or repoint Scout. Update `agents.html`, the `data-open` buttons, the "relay" and "crew-row" copy, the "who leads" phase strip, the floating decorative agents, and nav `data-ag` mappings in `home1.html`; plus `agentic.js` agent definitions (new Aegis artwork/colour).

## Risks and checks
- Don't over-claim autonomy; keep "human-in-the-loop" wording.
- Confirm engagement model before publishing the FDE definition (embedded full or part time, customers per FDE).
- Hub layout is positioned for a fixed spoke count; 7 around a larger center needs spacing rework.
- Re-verify in browser at desktop and mobile widths after implementation.

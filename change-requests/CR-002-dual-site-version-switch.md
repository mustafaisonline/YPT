# CR-002: Standard and Agentic AI versions side by side, with a "Site type" switch

Status: **Proposed, not implemented.** Raised 2026-11-27 by the user (message sent while the agentic rebuild was running overnight).
Rule from the user: `main` is not replaced. The agentic version stays in branch `agentic-ai-revamp` until the user says otherwise.

## What the user wants
- On the main website, a first-visit pop-up asks: "Do you want to see our agentic version of this website?"
- After that, a "Site type" list box at the top right with two options: **Standard** (the current main site) and **Agentic AI**.
- The choice is remembered in the visitor's browser. On a later visit they land on the version they chose.
- Both versions live on the same website.

## Why this needs a decision (the branch cannot simply be merged)
The agentic pages use the **same file names** as the standard pages (`index.html`, `services.html`, ...). Merging the branch into `main` would replace the standard site. To run both, one version must move to its own path.

## Proposed design (recommended)
1. Keep the standard site exactly where it is on `main`.
2. Publish the agentic site under `/agentic/` (same page names inside: `/agentic/services.html`, `/agentic/blog/what-is-data.html`, ...). A small build step copies the branch output there and fixes asset paths (`css/`, `js/`, `assets/`) to absolute paths so they resolve from either location.
3. One small script, `site-mode.js`, loaded by both versions:
   - Stores the choice in `localStorage` under `ypt-site-mode` (`standard` or `agentic`).
   - First visit with no stored choice, on the standard site: show the pop-up. "Yes" sets `agentic` and goes to the same page under `/agentic/`. "No thanks" sets `standard`.
   - Always renders the "Site type" list box top right. Changing it sets the choice and goes to the equivalent page in the other version (same path, with or without the `/agentic/` prefix).
   - A returning visitor whose choice is `agentic` and who opens a standard URL is sent to the agentic equivalent (and the reverse for `standard`).
4. Search engines: never redirect on the server or without a stored choice, so crawlers keep seeing the standard pages. Mark `/agentic/` pages `noindex` and keep canonical URLs pointing at the standard pages, unless the user wants the agentic version indexed.

## Decisions needed from the user
1. Is `/agentic/` as the path for the agentic version acceptable?
2. Should the agentic version be indexed by search engines, or kept `noindex` (recommended at first)?
3. Pop-up wording and whether it should appear on every page's first visit or only on the home page.
4. Should the header "Site type" box also appear on the standard version's header (needs a change to the standard header script `js/main.js`)? Yes by the description above.
5. Deployment: confirm how `main` is deployed (GitHub Pages or the Dockerfile) before anything is merged.

## Risks
- Touching `main` and `js/main.js` affects the live site. Do it in a separate branch with a preview first.
- Relative links inside the branch's pages assume the site root; the `/agentic/` copy needs the path fix described in step 2.
- The first-visit industry picker on the agentic site is a second pop-up; decide the order so visitors do not see two dialogs back to back.

# GC Lax — Green Canyon Lacrosse Landing Page

## Project Overview

Landing page for **Green Canyon High School Lacrosse** (North Logan, Utah), the Wolves. One-stop hub for parents/players: team store, GroupSpot sign-up, volunteer sign-ups, live stats, and rules — replacing long parent emails.

Live at **https://greencanyonlacrosse.com**.

## Deployment — read this before touching file paths

**`docs/` is the only real copy of the site and the only thing that's live.** It's served by **GitHub Pages** (repo Settings → Pages → source: `main` branch, `/docs`), not Netlify — there is no Netlify deployment despite the domain name suggesting otherwise; an earlier Netlify migration was abandoned and removed (2026-08-29) because DNS was never repointed to it. GitHub Pages already has the HTTPS cert for the custom domain.

There used to be a duplicate `src/` folder that diverged from `docs/` for weeks without anyone noticing (that's exactly the kind of bug to avoid — see incident note below). It's been deleted. **Do not recreate a second copy of the site.** If you ever add a build step or asset pipeline, make sure it still outputs directly into `docs/`, or update the GitHub Pages source setting to match.

## Structure

```
docs/
├── index.html          ← public landing page (single-file HTML/CSS/JS)
├── admin.html           ← in-browser admin panel for non-technical board members
├── site-data.json       ← all editable content (links, announcement, sign-ups, etc.)
├── CNAME                ← greencanyonlacrosse.com (required by GitHub Pages)
├── manifest.json        ← PWA manifest
├── assets/               ← logo, favicon, rules PDFs
└── parent-email-reference.md  ← source material for site copy
```

`index.html` fetches `site-data.json` on load and populates the page (announcement banner, quick action links, sign-up text, GroupSpot code, etc.). Fallback hardcoded HTML is shown if the fetch fails.

## Admin panel (`admin.html`)

Lets non-technical booster board members update site content without touching code. Flow:
1. Board member opens `admin.html`, pastes a GitHub personal access token (entered each session, never stored in code — only in `sessionStorage`).
2. On load, it fetches `docs/site-data.json` via the GitHub Contents API, decodes it, and populates the form.
3. On save, it PUTs the updated JSON back to the same file via the GitHub API, which commits directly to `main` → GitHub Pages redeploys automatically (~30s–1min).

**Encoding gotcha (fixed 2026-08-29, don't reintroduce):** GitHub's Contents API returns file content as base64. Plain `atob()` does NOT correctly reverse the UTF-8-safe encoding used on save (`btoa(unescape(encodeURIComponent(json)))`) — it corrupts any multi-byte character (emoji, en dashes, etc.) on load, and re-saving then writes the corrupted version back, compounding over time. The load path must mirror the encode: `JSON.parse(decodeURIComponent(escape(atob(...))))`. If you ever touch this code, keep both sides symmetric.

**Known gap:** admin.html has form fields (e.g. "Photo Day") for content that no longer renders anywhere on the public page, and the `resources` (rules PDFs) array in `site-data.json` isn't editable from admin at all — the live Rules modal uses hardcoded hrefs instead. Worth reconciling next time someone's in there.

## Brand / Design

- **Colors:** forest green `#245b4e` (dark `#1a4038`, light `#2d6e61`), white/black, gold accent `#c8a951`.
- **Mascot:** Wolves.
- **Fonts:** Inter (body), Plus Jakarta Sans (headings), via Google Fonts.
- **Style:** clean, mobile-first — parents mostly view this on phones. Friendly booster-club tone, not corporate.

## Key Links

| What | URL |
|------|-----|
| Team Store | https://shop.teamupathletics.com/015-green_canyon_lacrosse_fan_s/shop/home |
| GroupSpot (Parents) | https://get.groupspot.app/QZLhY |
| GroupSpot (Players) | https://get.groupspot.app/RAaUG |
| Volunteer Sign-Up Sheet | https://docs.google.com/spreadsheets/d/1QA8yNgIIZlBfNOS42R4fHIm_hfpebGl9dKtjTnj9y8k/edit |
| Live Stats (Statty) | https://www.app.stattyapp.com/public |
| Schedule (MaxPreps, Varsity/JV) | linked via `scheduleLinks` in site-data.json |

## Incident log

- **2026-08-29:** Discovered admin.html had been silently writing to a stale duplicate the whole time content drifted — actually it was the reverse: `src/site-data.json` (an abandoned Netlify-migration copy) had gone stale while `docs/site-data.json` (the real, live one) kept receiving admin edits correctly. The actual bug was a UTF-8 encode/decode mismatch corrupting emoji and special characters on every load→save round trip. Fixed the encoding, repaired the already-corrupted fields, and deleted the abandoned `src/`, `netlify.toml`, and `netlify/functions/` to remove the duplicate-copy trap entirely.

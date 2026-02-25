# GC Lax — Green Canyon Lacrosse Landing Page

## Project Overview

This is a landing page for **Green Canyon High School Lacrosse** (North Logan, Utah). The goal is to replace long parent emails with a single website at a domain like `gclax.com` where parents, players, and fans can find everything they need — team store links, communication app sign-ups, volunteer sign-ups, game schedules, photos, and announcements.

## Current State

There is a working **prototype** in `src/index.html`. It's a single-file HTML page with embedded CSS that demonstrates the layout, sections, and design direction. It uses:

- Google Fonts (Inter)
- CSS custom properties for theming
- Mobile-first responsive design
- Sticky navigation pills
- Card-based section layout

The prototype is functional and can be opened in any browser as-is.

## Brand / Design

- **School colors:** Forest green (`#1a5632`) and silver (`#a8b5ad`), with black and white accents. Gold accent (`#c8a951`) also used.
- **Mascot:** Wolves
- **Logo:** A wolf head SVG placeholder is currently inline in the hero. Replace with the real GC Wolves logo by dropping the image file in `assets/` and swapping the SVG for `<img src="assets/gc-wolves-logo.png">` — there's a comment in the HTML marking exactly where.
- **Style:** Clean, professional, mobile-first. Parents will mostly view this on phones.
- **Fonts:** Inter (or similar clean sans-serif)
- **Tone:** Friendly but organized. This is a booster club site, not a corporate site.

## Sections (current and planned)

### Currently in the prototype:
1. **Announcement Banner** — Swappable top bar for time-sensitive info (photo day, order deadlines, etc.)
2. **Hero** — GC LAX branding, 2026 season badge
3. **Quick Action Grid** — 4 big tap targets: Team Store, Join GroupSpot, Sign-Ups, Schedule
4. **Team Store** — Description + link to https://shop.teamupathletics.com/015-green_canyon_lacrosse_fan_s/shop/home
5. **GroupSpot Communication** — Parent and player join links (parent code: QZLhY)
6. **Concessions/Snack Sign-Ups** — Link to Google Sheets sign-up
7. **Game Schedule** — Table with home/away badges (placeholder data currently)
8. **Team Photos** — Photo day info
9. **Footer** — Basic booster club info

### Sections to consider adding later:
- Coach and board contact info
- Fundraising / sponsor section
- FAQ (common parent questions)
- Photo gallery (post-season)
- Link to the team's custom app (Quad Code project, separate repo)

## Key Links (real, from the team email)

| What | URL |
|------|-----|
| Team Store | https://shop.teamupathletics.com/015-green_canyon_lacrosse_fan_s/shop/home |
| GroupSpot (Parents) | https://get.groupspot.app/QZLhY |
| GroupSpot (Players) | https://get.groupspot.app/RAaUG |
| Volunteer Sign-Up Sheet | https://docs.google.com/spreadsheets/d/1QA8yNgIIZlBfNOS42R4fHIm_hfpebGl9dKtjTnj9y8k/edit?usp=sharing |
| Team App | TBD (Quad Code project) |

## Technical Direction

This should stay **simple and easy to maintain** by non-developers on the booster club board. Recommendations:

- **Keep it as a static site.** No server-side code needed. The content changes a few times per season, not daily.
- **Single HTML file is fine for now.** If it grows, consider splitting into a simple multi-page site or using a lightweight static site generator.
- **Hosting:** GitHub Pages (free) or Netlify (free tier). Domain: register something like gclax.com (~$12/year).
- **Editing workflow:** Board members can edit the HTML directly in GitHub's web editor, or you could add a simple JSON config file for links/dates that the page reads.

## Data-Driven Approach (optional enhancement)

To make the site easier for non-technical board members to update, consider extracting the changing data into a `site-data.json` file:

```json
{
  "season": "2026",
  "announcement": {
    "active": true,
    "text": "Team photos — Monday, March 2nd at 5:00 PM after practice!"
  },
  "links": {
    "teamStore": "https://shop.teamupathletics.com/...",
    "groupspotParents": "https://get.groupspot.app/QZLhY",
    "groupspotPlayers": "https://get.groupspot.app/RAaUG",
    "signupSheet": "https://docs.google.com/spreadsheets/d/...",
    "teamApp": ""
  },
  "schedule": [
    { "date": "Mar 7", "opponent": "Mountain Crest", "time": "4:00 PM", "location": "home" },
    { "date": "Mar 14", "opponent": "Sky View", "time": "4:00 PM", "location": "away" }
  ],
  "photoDay": {
    "date": "Monday, March 2nd",
    "time": "5:00 PM",
    "note": "After practice. Parent Night follows at 6:30 PM."
  }
}
```

Then the HTML reads this JSON on load and populates the page. Board members only ever edit the JSON file — no touching HTML.

## File Structure

```
gclax-site/
├── CLAUDE.md          ← This file (project context for Claude Code)
├── src/
│   └── index.html     ← Working prototype
├── docs/
│   └── parent-email-reference.md  ← Example of current parent communications
└── assets/            ← Future: logo, photos, favicon
```

## Next Steps / Task List

1. **Polish the prototype** — Review the current HTML, tighten up spacing, ensure it looks great on iPhone Safari
2. **Add the JSON data layer** — Extract schedule, links, and announcement into a data file
3. **Add a favicon and open graph tags** — So link previews look good when shared
4. **Set up GitHub repo** — Initialize git, push to GitHub, enable GitHub Pages
5. **Register domain** — gclax.com or similar, point DNS to GitHub Pages
6. **Add the team app button** — Once the Quad Code app URL is known, add it as a prominent CTA
7. **Ongoing:** Update schedule, announcement banner, and links as the season progresses

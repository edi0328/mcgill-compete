# Compete McGill — Website

The website for Compete McGill, McGill University's competitive programming club.
Built to be updated by future executives **without touching page code** — almost
everything you'll ever need to change lives in `src/content/`.

## Running locally

```bash
npm install     # first time only
npm run dev     # http://localhost:4321 (port 3000 is often taken by other tools)
npm run build   # production build (run before merging big changes)
npm run lint    # check code style
```

Deployed on **Vercel**: connect the GitHub repo at vercel.com → every push to
`main` deploys automatically. No config needed.

## How the site is organized

| Directory | What it is | Who edits it |
|---|---|---|
| `src/content/` | **All site content** (events, team, resources, …) | Every exec |
| `src/components/` | Reusable UI pieces (cards, tables, animations) | Only if changing design |
| `src/app/` | The five pages (they just read from `src/content/`) | Only if changing layout |
| `src/types/content.ts` | Data shapes for the content files | Rarely |
| `public/` | Images (logo, team photos, …) | When adding photos |

## Updating content

### Events (`src/content/events.ts`)

Add an object to the `events` array — copy an existing one. Required fields:
`title`, `date` (`"YYYY-MM-DD"`), `startTime`, `endTime`, `location`, `type`,
`level`, `host`, `description`. Optional `links`: `slides`, `problems`,
`editorial`, `contest`, `rsvp`, `discord`.

The site **automatically** sorts events and splits upcoming vs. past by date —
never delete past events, they become the archive.

### Google Calendar embed (`src/content/site.ts`)

Set `calendarEmbedUrl` to your calendar's embed URL:
Google Calendar → Settings → *your calendar* → **Integrate calendar** → copy the
`src` URL from the embed code. Until then the Schedule page shows setup
instructions in its place.

### Team members (`src/content/team.ts`)

Add to `teamMembers`. `order` controls display position (1 = first).
Optional: `photo` (put the file in `public/team/`, use path `"/team/name.jpg"`),
`programYear`, `bio`, `links`. Get the member's consent before publishing a
photo or bio. Set `facultyAdvisor` to `null` if there isn't one.

### Resources (`src/content/resources.ts`)

The arrays `gettingStarted`, `externalResources`, `beginnerRoadmap`,
`advancedRoadmap`, and `problemSets`. Copy an existing entry.

### Algorithm templates (`src/content/templates/`)

One file per topic (dataStructures, graphs, trees, strings, math, geometry),
rendered at `/templates` and `/templates/<slug>`. Each entry has a name,
topic, complexity, description, an example problem, and the code in both C++
and Python. To add one: copy an entry in the matching topic file, pick a
unique `slug`, and add that slug to a leaf in `topicTree` (in `index.ts`).
The page is generated automatically.

### Past session materials (`src/content/pastMaterials.ts`)

One entry per session: semester, week, topic, level, plus whichever of
`slides` / `problems` / `solutions` / `recording` exist. Shown on both the
Schedule archive and the Resources page.

### Hall of Fame (`src/content/hallOfFame.ts`)

**Read the comment at the top of that file first.** Rules:

1. Only publish results confirmed by a public source (icpc.global standings,
   news article).
2. Fill in `sourceLink` with that source.
3. Then — and only then — set `verified: true`. Unverified entries show a red
   "TODO: verify" badge on the site.
4. Never publish names without the people's consent. `notableAlumni` stays
   empty unless the person approved being listed.

### Site-wide links (`src/content/site.ts`)

Discord invite, Instagram, GitHub, club email, sponsorship email, and the
weekly rhythm table.

## Placeholders that still need real data

Search the repo for `[` to find them all. Currently:

- [x] Discord invite and Instagram URL in `site.ts` (done)
- [ ] `[CLUB_EMAIL]`, `[SPONSORSHIP_EMAIL]` in `site.ts`
- [ ] `[GOOGLE_CALENDAR_EMBED_URL]` in `site.ts`
- [ ] Real events for the current semester in `events.ts` (`[ROOM, BUILDING]`, `[EXEC_NAME]`, link placeholders)
- [ ] Real exec names/bios in `team.ts` (`[EXEC_NAME]`, contact addresses)
- [ ] Verified ICPC history in `hallOfFame.ts` (`[YEAR]`, `[TEAM_NAME]`, `[SOURCE_LINK]`, …)
- [ ] Real session materials in `pastMaterials.ts` and problem-set links in `resources.ts`

## Design System

See [`src/docs/DESIGN_SYSTEM.md`](src/docs/DESIGN_SYSTEM.md) for comprehensive documentation on:
- Typography scale, line-height, and character limits
- Color system (light/dark modes with WCAG contrast ratios)
- Spacing system (4px increments, responsive patterns)
- Component specifications (buttons, links, inputs, cards, navigation)
- Accessibility requirements (WCAG AAA targets, keyboard navigation, screen readers)
- Animation guidelines and motion preferences
- Implementation checklists for design, development, and QA phases

This design system ensures consistency, accessibility, and maintainability across the site.

## Design notes (for the curious)

- Fonts: Departure Mono (pixel display font for headings/wordmark, self-hosted
  from `src/app/fonts/`, SIL OFL — license file kept next to it), Space Grotesk
  (body), JetBrains Mono (code/metadata). All via `next/font` — no external
  font requests.
- Animations: `motion` (Framer Motion). All scroll reveals go through
  `src/components/AnimatedSection.tsx`; the "decrypt" heading effect is
  `src/components/ScrambleText.tsx`. Both respect `prefers-reduced-motion`.
- The hero gem is real three.js (`src/components/GemCanvas.tsx` — drag it, and
  it turns as you scroll) with the CSS version (`Logo3D.tsx`) as loading/no-JS
  fallback, client-only via `HeroVisuals.tsx`.
- Theme: follows the system light/dark preference by default; the header
  sun/moon button overrides it (saved in localStorage). Both palettes are
  defined once in `src/app/globals.css` with `light-dark()` — edit colors there.
- Level badges use Codeforces rating colors on purpose.

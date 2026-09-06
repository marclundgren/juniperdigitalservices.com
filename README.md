# Juniper Digital Services — homepage

A static site running a 50/50 layout A/B test. No build step, no dependencies.
Serve the folder — don't open the files directly, the split needs real paths:

```
python3 -m http.server 8000
```

Two entry points, each splitting 50/50 between the two layouts:

| URL | |
| --- | --- |
| `/` | editorial or centered, national copy |
| `/local/` | editorial or centered, Orange County copy |

## Viewing each variant

Opening a variant's URL directly is not enough — `ab.js` will bounce you to
whichever layout you're bucketed into. **Add `?layout=off` once**, and from then
on every URL below opens exactly as requested, with no redirects, for as long as
that browser keeps the setting:

| Variant | Local | Live |
| --- | --- | --- |
| editorial · national | <http://localhost:8000/?layout=off> | <https://juniperdigitalservices.com/?layout=off> |
| centered · national | <http://localhost:8000/centered/?layout=off> | <https://juniperdigitalservices.com/centered/?layout=off> |
| editorial · Orange County | <http://localhost:8000/local/?layout=off> | <https://juniperdigitalservices.com/local/?layout=off> |
| centered · Orange County | <http://localhost:8000/local/centered/?layout=off> | <https://juniperdigitalservices.com/local/centered/?layout=off> |

`?layout=off` sticks, so you only need it on the first page you open — after
that you can navigate between all four freely. To rejoin the test and get a
fresh random assignment:

```
/?layout=clear
```

Two other ways in, depending on what you're doing:

- **Send someone one specific layout** — `?layout=editorial` or
  `?layout=centered` *pins* rather than opts out, so they'll be redirected to
  that layout and stay on it everywhere, including if they later land on `/`
  with no query string. Use this for "here's the version I want you to react
  to"; use `?layout=off` for "let me flip through all four".
- **From devtools**, on any page:

  ```js
  localStorage.setItem('jds_layout', 'off')        // see every URL as-is
  localStorage.setItem('jds_layout', 'centered')   // or 'editorial' — pin one
  localStorage.removeItem('jds_layout')            // rejoin the test
  ```

  In a browser that blocks storage the pin lives in a cookie instead, and only
  `?layout=clear` will reset it — so prefer the URL when in doubt.

While `theme.js` is still on the page, the switcher's "↗ Centered" /
"↗ Editorial" link at the bottom jumps straight to the other layout on the same
copy variant.

See "A/B test" below for how the split and the pin actually work.

## Palette preview

Ten palettes are wired up. Append `?theme=<name>`, e.g. `/?theme=teal&layout=off`.

Each theme is named for the colour you'd call the site — the accent that
carries the headline, buttons and awning — except `ink`, where the dark
ground is the dominant impression.

| Name | Paper | Accent | Reads as |
| --- | --- | --- | --- |
| `juniper` *(default)* | cool off-white | evergreen | the namesake — calm, durable |
| `clay` | warm cream | terracotta | local, hand-built, storefront |
| `crimson` | bone | signal red on black | Swiss, editorial, bold |
| `oxblood` | blush | deep burgundy | restrained, formal |
| `brass` | warm cream | brass on navy | established, civic |
| `teal` | cool gray | petrol | calm, precise |
| `cobalt` | near-white | cobalt blue | crisp, direct |
| `plum` | mauve-gray | deep magenta | distinctive, unexpected |
| `graphite` | warm gray | none — monochrome | severe, typographic |
| `ink` | **dark charcoal** | amber | after-hours, premium |

Old names from the first two rounds (`navy`, `slate`, `bone`, `harbor`,
`mustard`) still resolve — `theme.js` aliases them so shared links don't break.

### How these were checked

`clay` and `harbor` had accents only ΔE 9.3 apart on near-identical paper, and
`navy`/`mustard` were ΔE 4.6 — visually the same palette twice. Both duplicates
were cut and replaced (`plum`, `graphite`), and the remaining accents re-spaced
so the closest pair is now ΔE 26. Every theme was also swept for WCAG contrast
across thirteen foreground/background pairs; that turned up a brass accent below
4.5:1 and form/button borders below 1.4.11's 3:1 in *all nine* themes, which is
why there's a separate `--edge` token for interactive borders rather than
reusing the decorative `--line-strong` hairline.

`juniper` was added later and held to the same bar: sixteen foreground/background
pairs checked, all passing — the tightest are `--edge` on paper at 3.39:1 against
1.4.11's 3:1 floor and `--accent` on paper at 5.91:1. Its accent `#2C6B45` is
ΔE 27.6 from `teal`, the nearest existing accent, so it clears the ΔE 26 spacing
floor and no two themes read as the same palette.

There's also a pill switcher fixed at the bottom of the page. Pick a winner and
delete `theme.js` plus the `.theme-switch` block in `index.html` — the palette
you keep just becomes the `:root` block in `styles.css`. (`nav.js` stays — that
one drives the mobile menu.)

## Files

Four pages, two layouts × two copy variants. The two "national" pages are the
top-level test; the two under `local/` are the Orange County test.

| Path | What it is | Owns |
| --- | --- | --- |
| `index.html` | editorial layout, national copy | — |
| `centered/index.html` | centered layout, national copy | `centered/styles.css`, `centered/theme.js`, `centered/fonts/` |
| `local/index.html` | editorial layout, Orange County copy | — |
| `local/centered/index.html` | centered layout, Orange County copy | — |

Design assets live once and are shared: the editorial pages both link the root
`styles.css` / `fonts/` / `nav.js`, and both centered pages link
`centered/styles.css` / `centered/fonts/`. So a palette or spacing change flows
to both copy variants of a layout automatically. **Copy edits do not propagate**
— change a headline on `/` and you have to make the same edit in `/local/`.
If the two start diverging in more than wording, stop and pick one.

### The copy delta

Everything that differs between `/local/` and `/`, and nothing else:

| `/local/` (Orange County) | `/` (national) |
| --- | --- |
| Eyebrow "Orange County, California" | "Independent Web Developer" |
| "for local small businesses" | "for small businesses" |
| Storefront plaque "Est. Orange County" | "Est. 2026" |
| City strip (Old Towne Orange, Fullerton, …) | Business types (retail, dental & medical, studios, trades, …) |
| "We talk, in person if you'd like" | "We talk, on your schedule" |
| "Twenty minutes at your counter or over the phone" | "Twenty minutes on a call — or at your counter, if you're close by" |
| "I'm a freelance web developer in Orange County" | "I'm a freelance web developer" |
| Testimonial roles with city names | Roles only |
| "Happy to meet in person anywhere in the county" | "Happy to meet by video, phone, or in person" |
| "the businesses that make this county run" | "the businesses that make main street run" |
| Footer "Where / Orange County, California" | "Clients / Small businesses anywhere in the U.S." |

The About section's "the block with the hardware store, the dentist, the taqueria
that's been there thirty years" is kept deliberately — it reads as main-street
positioning rather than a place, and it's what still ties the name to the pitch
once the county is gone.

The centered pair differs on the same axis: the badge drops to "Hand-Coded
Websites for Small Businesses", and the hero subhead, the "what kind of
businesses" FAQ answer and the testimonial roles lose their regional framing.

| File | Ships? |
| --- | --- |
| `styles.css`, `centered/styles.css` | yes |
| `fonts/*.woff2` | yes — Fraunces + Karla, subset, self-hosted |
| `centered/fonts/*.woff2` | yes — Space Grotesk + JetBrains Mono, subset |
| `nav.js` | yes — mobile menu toggle (editorial layout only) |
| `ab.js` | yes — 50/50 layout split + GA4 tagging |
| `theme.js`, `centered/theme.js` | **no** — palette preview only, delete before launch |


## Before this goes live

- [x] **Web3Forms key** is wired into all four forms. Submissions post
      straight to Web3Forms and arrive at the address on that account. Each
      page sends a different `subject` so you can tell which one a lead came
      from: `New inquiry (editorial)`, `New inquiry (editorial, local)`,
      `Free site audit request (centered)`, and
      `Free site audit request (centered, local)`.
- [ ] **Domain** — nothing is registered yet. The `redirect` hidden input in
      each form is commented out and points at a `YOUR-DOMAIN` placeholder;
      fill it in once a domain is settled. See "Naming" below.
- [ ] **Thank-you page** (optional) — right now a submit lands on Web3Forms'
      own success page, which is off-brand. Uncomment the `redirect` hidden
      input in each form and point it at a `thanks.html` you control.
- [ ] **Testimonials** — all three quotes are placeholders and are labeled as
      such on the page. Replace with real quotes (with permission) or cut the
      section entirely. Don't ship the placeholders.
- [ ] **Photo** — swap the dashed `.photo-slot` block in the About section for
      `<img src="images/marc.jpg" alt="…">`.
- [ ] **Name** — "Marc" is used throughout the About/signature copy; change it
      if you want a different first name on the page.
- [ ] **Service-area list** — the cities in the strip under the hero are a
      first guess. Swap in the ones you actually want to rank for.

## A/B test

`ab.js` splits traffic 50/50 between the two **layouts** and tags every GA4 hit
with which one the visitor saw. GitHub Pages has no server-side routing, so the
split happens in the browser: the script is the first thing in `<head>`, assigns
a layout, stores it, and redirects before anything paints.

There are two surfaces running the same layout test against different copy:

| Surface | `ab_test` | editorial | centered |
| --- | --- | --- | --- |
| national | `layout-2026-09-home` | `/` | `/centered/` |
| Orange County | `layout-2026-09-local` | `/local/` | `/local/centered/` |

A visitor gets **one** layout assignment that follows them across both surfaces,
so the split measures the layout rather than the route; `ab_test` still tells you
which surface a hit came from. Both are set in the `SURFACES` array at the top of
`ab.js`.

**A known asymmetry.** The editorial variant is served directly at `/` and
`/local/`; the centered variant costs one extra redirect. That's the price of not
making the canonical homepage a redirect stub, but it does put a small latency
handicap on one arm — worth remembering when a result is close.

**To turn it on:**

1. Create a GA4 property, then put its measurement ID in `GA_ID` in `ab.js`.
   While it's still `G-XXXXXXXXXX` the script splits traffic but loads no
   analytics at all, so nothing breaks before you're ready.
2. In GA4 → Admin → Custom definitions, register two **event-scoped** custom
   dimensions with parameter names `ab_variant` and `ab_test`. Without this the
   variant is sent but never shows up in reports.
3. Compare variants in Explore, or on any report, by breaking down
   `generate_lead` events by `ab_variant`.

**What gets measured.** Every page view carries `ab_variant` and `ab_test`, and
`ab_variant` is also set as a user property so you can build audiences from it.
Submitting any contact form fires a `generate_lead` event — that's the conversion
to judge the test on. The four forms also send different Web3Forms `subject`
lines, so leads are attributable even outside GA.

### Pinning a layout

For review, QA, or sending someone a specific version:

| URL | Effect |
| --- | --- |
| `?layout=editorial` | pin this browser to the editorial layout |
| `?layout=centered` | pin this browser to the centered layout |
| `?layout=off` | opt out of the test entirely — stay on whatever URL you opened |
| `?layout=clear` | forget the pin and re-roll on the next load |

`?ab=` is accepted as an alias so links made before the `/lab` restructure still
resolve. See "Viewing each variant" at the top for which one to use when.

The pin lives in `localStorage` under `jds_layout`. Where storage is available
it is the only source of truth, so deleting the key from devtools really does
re-roll the visitor. Where the browser blocks storage outright, a cookie carries
the pin instead (180 days) — `?layout=clear` clears both, which is why it's the
reliable way to reset rather than deleting the key by hand.

The pin is the layout only — it applies to whichever surface you visit, so a
browser pinned to `centered` sees `/centered/` at the root and
`/local/centered/` under `/local/`.

While the palette switcher is still on the page, its "↗ Centered" / "↗ Editorial"
link jumps to the other layout on the same surface with the pin applied.

**SEO.** Crawlers are detected by user-agent and never bucketed or redirected, so
each URL is indexed as requested. `/` and `/local/` are self-canonical and meant
to be indexed — `/local/` is a real Orange County landing page, not a test
artifact. The two centered variants carry `<link rel="canonical">` at their
editorial counterpart, which is Google's documented handling for an A/B test
served on a second URL; `noindex` would have thrown away the variant's signals
instead of consolidating them.

**Before running this on real traffic:**

- Nothing at `/` links to `/local/`, so it won't be discovered or indexed. Add a
  link (or a sitemap entry) if you want the regional page to rank.
- `theme.js` still renders the palette switcher on all four pages. It's listed
  above as delete-before-launch and this is the launch.


## GitHub Pages

Repo → Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder
`/ (root)`. For the custom domain, add the domain you register under Pages →
Custom domain (that writes a `CNAME` file), then point DNS at GitHub:

- `A` records for the apex → `185.199.108.153`, `185.199.109.153`,
  `185.199.110.153`, `185.199.111.153`
- `CNAME` for `www` → `<your-github-username>.github.io`

Then tick **Enforce HTTPS** once the cert issues.

## Naming

The site and business name is **Juniper Digital Services** — already the LLC in
the footer, now promoted to the front of the page. Nothing is registered yet, so
this is still reversible.

Two things worth knowing before it isn't:

- **The old name had a neighbour.** The centered layout was modelled on
  `secondstreetdigital.com`, a real agency. "Second Street Web" sat one word
  away from it. "Juniper" has no such collision.
- **The name now implies a colour.** The palettes deliberately avoided green
  because the reference site was emerald. A brand called Juniper points straight
  at it, so `juniper` (evergreen on cool off-white) is the new default and
  terracotta `clay` is one click away in the switcher. The centered layout
  carries the same ten palettes, generated from the token sets here so a colour
  can be compared across layouts rather than guessed at — see `centered/README.md`.

Domain is still open. `juniperdigitalservices.com` is a mouthful at 24
characters; `juniperdigital.com` or `juniperweb.com` may be worth pricing first.
The wordmark reads "Juniper *Digital Services*", so a shorter domain still
matches what's on the page.

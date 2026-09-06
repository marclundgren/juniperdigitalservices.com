# Juniper Digital Services — homepage concept

A single static homepage for review. No build step, no dependencies.
Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Palette preview

Ten palettes are wired up. Append `?theme=<name>`, e.g. `index.html?theme=teal`.

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

| File | Ships? |
| --- | --- |
| `index.html`, `styles.css` | yes |
| `fonts/*.woff2` | yes — Fraunces + Karla, subset, self-hosted |
| `nav.js` | yes — mobile menu toggle |
| `ab.js` | yes — 50/50 A/B split + GA4 tagging |
| `theme.js` | **no** — palette preview only, delete before launch |

## Before this goes live

- [x] **Web3Forms key** is wired into all four forms. Submissions post
      straight to Web3Forms and arrive at the address on that account. Each
      page sends a different `subject` so you can tell which one a lead came
      from: `Juniper (home)`, `lab/national`, `lab/centered`,
      `lab/centered-national`.
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

## Parallel experiments

`lab/` holds alternate directions that are deliberately kept off the main page —
nothing at the repo root links to them, though `ab.js` now redirects half of all
traffic into `lab/centered/` (see "A/B test" below). See `lab/README.md`.
Currently:

- `lab/centered/` → `/lab/centered/` — centered SaaS-marketing layout modelled on
  the reference site's shape, in four non-green palettes.
- `lab/national/` → `/lab/national/` — this page with every geographic reference
  removed, for marketing beyond one metro.
- `lab/centered-national/` → `/lab/centered-national/` — same, for the centered layout.

The region-free variants share this page's stylesheet and fonts, so design
changes flow through to them — but **copy edits do not**. See `lab/README.md`.

## A/B test

`ab.js` splits traffic 50/50 between the two layouts and tags every GA4 hit with
which one the visitor saw. GitHub Pages has no server-side routing, so the split
happens in the browser: the script is the first thing in `<head>`, assigns a
variant, stores it in a cookie, and redirects before anything paints.

| Variant | Path |
| --- | --- |
| `editorial` | `/` |
| `centered` | `/lab/centered/` |

Both are set in the `VARIANTS` array at the top of `ab.js`.

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
Submitting either contact form fires a `generate_lead` event — that's the
conversion to judge the test on. The two forms also already send different
Web3Forms `subject` lines, so leads are attributable even outside GA.

**Overrides**, for reviewing while the test is live:

| URL | Effect |
| --- | --- |
| `?ab=editorial` | pin this browser to the editorial layout |
| `?ab=centered` | pin this browser to the centered layout |
| `?ab=off` | opt out of the test entirely |

All three persist for 180 days in the `jds_ab` cookie. `/lab/` links to
`?ab=off` so review sessions don't get bounced around.

**SEO.** Crawlers are detected by user-agent and never bucketed or redirected,
so each URL is indexed as requested. `/lab/centered/` traded its `noindex` for
`<link rel="canonical">` pointing at the homepage, which is Google's documented
handling for an A/B test served on a second URL — `noindex` would have thrown
away the variant's signals instead of consolidating them.

**Two things to decide before running this on real traffic:**

- The variant B URL is literally `/lab/centered/`, which visitors see in the
  address bar. Move that folder somewhere presentable (`/b/`, say) and update
  `VARIANTS` — note `lab/centered-national/` links to `../centered/styles.css`
  and would need repointing.
- `theme.js` still renders the palette switcher on both pages. It's listed above
  as delete-before-launch and this is the launch.

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

- **The old name had a neighbour.** `lab/centered/` was modelled on
  `secondstreetdigital.com`, a real agency. "Second Street Web" sat one word
  away from it. "Juniper" has no such collision.
- **The name now implies a colour.** The palettes deliberately avoided green
  because the reference site was emerald. A brand called Juniper points straight
  at it, so `juniper` (evergreen on cool off-white) is the new default and
  terracotta `clay` is one click away in the switcher. The `lab/centered/`
  experiment now carries the same ten palettes, generated from the token sets
  here so both layouts show identical colour — see `lab/README.md`.

Domain is still open. `juniperdigitalservices.com` is a mouthful at 24
characters; `juniperdigital.com` or `juniperweb.com` may be worth pricing first.
The wordmark reads "Juniper *Digital Services*", so a shorter domain still
matches what's on the page.

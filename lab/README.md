# lab/ — parallel design experiments

**Browse them at [`/lab/`](https://marclundgren.github.io/juniperdigitalservices.com/lab/)**, which links to every
version with palette shortcuts. A `.nojekyll` file at the repo root keeps GitHub
Pages from rendering this README as that directory's page.

Alternate directions, kept out of the way of the main concept at the repo root.
Nothing in here is linked from `/index.html`, so the Orange County page can keep
being iterated on without these getting in the way. Each experiment is a
self-contained folder — its own HTML, CSS and fonts — so you can delete one
without touching anything else.

| Folder | URL | What it is |
| --- | --- | --- |
| `centered/` | `/lab/centered/` | Centered / SaaS-marketing layout, modelled on the reference site's homepage shape |
| `national/` | `/lab/national/` | The main editorial page with every geographic reference stripped out |
| `centered-national/` | `/lab/centered-national/` | The centered layout with every geographic reference stripped out |

### How the region-free variants work

`national/` and `centered-national/` are **content-only** variants. Each is a
single HTML file that links back to its parent's stylesheet, fonts and scripts:

- `national/index.html` → `../../styles.css`, `../../nav.js`, `../../theme.js`
- `centered-national/index.html` → `../centered/styles.css`, `../centered/theme.js`

So design changes to a parent page — palette, spacing, type — flow through to
its region-free twin automatically, and there are no duplicate font files. The
trade-off is the reverse: **copy edits do not propagate.** Change a headline on
the main page and you have to make the same edit in `national/index.html`. If
the two versions start diverging in more than wording, it's worth stopping and
picking one.

Both carry `noindex`, same as `centered/`, so nothing here competes with the
real homepage in search.

---

---

## national/

The root page's editorial layout — Fraunces + Karla, storefront motif, all nine
palettes — with the geography taken out, for marketing beyond one metro.

What changed from the root page, and nothing else:

| Root page | `national/` |
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

---

## centered-national/

`centered/` with the geography removed. Badge becomes "Hand-Coded Websites for
Small Businesses", the hero subhead and the "what kind of businesses" FAQ answer
drop their regional framing, and the testimonial roles lose their city names.
Same four palettes, same everything else.

---

## centered/

A deliberate structural mimic of secondstreetdigital.com's homepage: pill badge
over a big centered headline with one phrase in the accent colour, centered
subhead, one large pill CTA, a three-stat strip, three feature cards with icon
tiles, a 2×2 numbered process grid, a split "why me" section with check cards,
two testimonials with star ratings, and a `+`/`×` FAQ accordion. Content is
web development instead of Google Ads.

**Palettes** — the same ten as the root layout, with identical token values, so
a colour can be compared across both layouts rather than guessed at. `juniper`
is the default here too.

| `?theme=` | Accent | On dark |
| --- | --- | --- |
| `juniper` *(default)* | `#2C6B45` evergreen | `#79C193` |
| `clay` | `#B24E23` terracotta | `#E8926A` |
| `crimson` | `#C4141C` signal red | `#F0503F` |
| `oxblood` | `#7E2230` burgundy | `#DE9080` |
| `brass` | `#906714` brass | `#DCAE45` |
| `teal` | `#0E6B72` petrol | `#4FBFC6` |
| `cobalt` | `#1B45D8` cobalt | `#7E99FF` |
| `plum` | `#7A2E63` deep magenta | `#D687BC` |
| `graphite` | `#1F1E1C` monochrome | `#C9C5BD` |
| `ink` | `#E0912F` amber on charcoal | `#E9A445` |

The palette blocks in `centered/styles.css` are generated from the token sets in
the root `styles.css`, mapped `--paper/--alt/--card` ← `--paper/--paper-2/--card`
and `--dark/--on-dark/--dark-2/--dark-line/--accent-on-dark` ← the `--band*`
family. Change a colour in the root stylesheet and re-generate rather than
editing both by hand.

**Retired** — `indigo`, `azure`, `magenta` and `ember`, the four placeholder
palettes from when this experiment had no brand colour to use. `indigo` was
ΔE 9.2 from `cobalt` and `ember` ΔE 15.4 from `clay` — under the ΔE 26 spacing
floor the rest of the set is held to, so the switcher had three blues and two
oranges that read the same. `azure` and `magenta` *were* distinct; they were
dropped for parity, not for spacing, and could be added back to both layouts if
you want them in the system. `theme.js` aliases all four to their nearest
survivor so old `?theme=` links still resolve.

**Accessibility** — the layout no longer hardcodes any colour except a drop
shadow: `ink` inverts the ground, so every surface had to become a token. 210
foreground/background pairs (10 palettes × 21 element pairs) were checked and
all pass, tightest being the rating stars on `oxblood` at 4.63:1. Two fixes came
out of that sweep: `.section-alt .eyebrow` uses `--accent-deep` because the
mid-tone accent fell to 4.36:1 (`clay`) and 4.11:1 (`brass`) as small text on
the alt ground, and `--star` replaced a hardcoded `#E0A020` that sat at ~2.25:1
on nine of the ten card surfaces.

**Type** — Space Grotesk (geometric sans) + JetBrains Mono for the eyebrows,
badge and stat numerals. Self-hosted and subset, same as the main page; the mono
labels are the reference's device, the typefaces are not.

**Notes**

- The FAQ uses native `<details>`/`<summary>`, so it works with no JavaScript.
  `theme.js` is the palette switcher only and gets deleted before launch.
- `<meta name="robots" content="noindex">` is set so this never competes with
  the real homepage in search while it's parked on the live site.
- The audit form posts to Web3Forms on the same account as the main page. Each
  page uses a distinct `subject` so leads are attributable to the variant that
  produced them.
- Testimonials are placeholders and labelled as such on the page.
- The three stats avoid any claim I can't stand behind (no invented "years of
  experience" figure). Add one if you want the reference's opening beat.

**A caution.** This is a close structural copy of a site whose domain is one word
away from yours. Same section order, same rhetorical beats, same badge-over-
centered-headline opening. Different colour and typeface pull it apart, but if
you go this direction it's worth reworking the section order and at least the
hero composition so it reads as convergent evolution rather than a trace.

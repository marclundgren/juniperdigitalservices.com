# centered/ — the centered layout

Variant B of the layout A/B test, in two copy versions:

| Path | Copy |
| --- | --- |
| `centered/index.html` | national |
| `local/centered/index.html` | Orange County |

Both link this folder's `styles.css`, `theme.js` and `fonts/`, so design changes
flow to both. Copy edits don't — see the root README's "Files" section.


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

The palette blocks in `styles.css` are generated from the token sets in
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
  `theme.js` is the palette switcher only, builds nothing outside review mode
  (`?review=1`), and gets deleted before launch.
- Both pages carry `<link rel="canonical">` at their editorial counterpart
  rather than `noindex`, so the variant's signals consolidate onto the page
  being tested against. See the root README's "A/B test" section.
- The audit forms post to Web3Forms on the same account as the editorial pages.
  Each of the four pages uses a distinct `subject` so leads are attributable to
  the variant that produced them.
- Testimonials are placeholders and labelled as such on the page.
- The three stats avoid any claim I can't stand behind (no invented "years of
  experience" figure). Add one if you want the reference's opening beat.

**A caution.** This is a close structural copy of a site whose domain was one
word away from the old business name. Same section order, same rhetorical beats, same badge-over-
centered-headline opening. Different colour and typeface pull it apart, but if
you go this direction it's worth reworking the section order and at least the
hero composition so it reads as convergent evolution rather than a trace.

# Torchlight — revision brief

Paste this into Claude Design. The first fourteen screens are structurally
sound: the sourcing discipline, the "NOT BALANCED" dissent panel and the
partial-chart honesty are all correct and should survive unchanged. What follows
fixes who the app is written for, adds the navigation it lacks, and corrects
factual errors.

---

## Part 1 — factual corrections

Several values on screen do not match what the engine produces. Fix these
first; they are wrong, not merely different.

| Screen | Shown | Correct |
|---|---|---|
| 06 Tradition detail | Lahiri ayanamsa `23°44′` | `23°43′34″` (23.7261°) |
| 05 Dimension detail | Human Design "Defined throat · channel 20–34" | The engine computes gates, lines and profile only — no channels or centres. Use "Profile 4/6 · Sun gate 7.4" |
| 08 Panchanga | Five limbs including "02 VARA · Budhavara" | The engine returns four limbs. Vara depends on local sunrise and is deliberately not computed. Show four, or add sunrise to the engine first |
| 04, 11 | "10/10" completeness badge | The engine ships **eight** systems for a chart. Use 8/8, or drop the badge |
| 05 Dimension detail | Numerology "birthday 15 → 6" | Birthday number is `6`, life path `6`. The arrow implies a reduction the app must not perform |

The gemstone screen is correct — the engine really does return stone, finger,
metal and day. Only the **weight (5.25 ratti) is invented**; remove it or add it
to the engine.

---

## Part 2 — the register is wrong for the buyer

The screens are written for someone who already reads charts. Sanskrit appears
untranslated as primary labels: *Guru*, *Shukra*, *Vrischika*, *Budhavara*,
*mahadasha*, *antardasha*, *Vimshottari*, *navamsha*. A US reader who knows
their sun sign and nothing else cannot enter this.

Rule: **English first, tradition second, once.**

- "Jupiter period (*mahadasha*)" — then "Jupiter period" thereafter
- "Scorpio rising (*Vrischika lagna*)"
- "Venus (*Shukra*)"
- Never a Sanskrit word alone as a heading

The `SOURCE` captions may stay technical. That is where precision belongs, and
it is what makes the app credible. The headings must not.

---

## Part 3 — navigation

Screens 04–12 show a four-item bar reading `CHART TIME VARGA MORE`. Replace it.
"VARGA" means nothing to the buyer and "MORE" hides half the app.

Five tabs, Feather icons above short labels, active in gold `#B89B4C`:

| Tab | Icon | Holds |
|---|---|---|
| Today | `sun` | The current period and what is live now |
| Chart | `circle` | All eight systems, dimensions inside |
| Life | `compass` | The life areas — money, work, love, health |
| Timeline | `clock` | Periods from birth onward |
| You | `user` | Profiles, settings, account |

---

## Part 4 — what is missing entirely

The engine computes two things the design never shows, and they are what a
paying user actually wants.

### Life areas — a new tab and its detail screen

The twelve houses **are** life areas, already computed to arcsecond precision:

- **Money & resources** `dollar-sign` — 2nd, 11th
- **Work & vocation** `briefcase` — 6th, 10th
- **Love & partnership** `heart` — 5th, 7th
- **Home & family** `home` — 4th
- **Health & routine** `activity` — 6th
- **Learning & belief** `book-open` — 9th
- **Depth & transformation** `layers` — 8th
- **Self & appearance** `user` — 1st

A grid of cards, each with its icon in a tinted tile. Tapping one opens: which
planets sit in those houses, what the running period means for that area, and
which traditions have something to say. This is the screen someone opens weekly.

### A "Today" home screen

There is no home. Screen 04 is a chart reference, not somewhere to return. Today
holds four things and stops:

1. The date and the single most relevant thing about it
2. The running period in one sentence, with the year it ends
3. Three or four life areas that are active now — not all eight
4. One quiet line into the full chart

---

## Part 5 — the five dimensions move

Screen 04 leads with all five dimension bars stacked. Keep the design — the
split bars and dissent captions are good work — but move it inside **Chart**.

It answers "what sort of person are you" with five adjectives, which is the
least specific thing this engine knows. Lead with what is *happening* and to
*which part of life*. The dissent panel stays exactly as designed; it is the
strongest screen in the set and belongs one level in, where a curious reader
finds it.

---

## Part 6 — colour

The palette has ten tokens and the designs use two. Widen it without changing it:

- Each life area gets a tint as an icon tile or a left edge — merlot `#722F37`
  love, teal `#4A7373` health, gold `#B89B4C` money, warm charcoal work. Never a
  filled card background.
- `surface2` `#EFEAE6` for nested content, so a card inside a card reads deeper.
- Dark theme is not an inversion. On `#36312E`, gold `#C5A55A` and merlot
  `#C48B93` carry more weight than in light — let them.

One gold **action** per screen still holds. Tints are not actions.

---

## Part 7 — smaller notes

- **Screen 02**: the brief said Google-only. Email and password fields are still
  there. Remove them; leave the Google button alone. Also drop "computes charts
  locally" — charts are computed server-side.
- **Screen 13**: rupee amounts, but the app is for US users. Use dollars.
- **Screen 03**: "STEP 1 OF 1" is noise on a single-step form.
- **Screen 11**: "Profiles stay on this device. Sync is off." is untrue —
  profiles are stored server-side.
- **Screen 01**: "V2.4 SWISS EPHEMERIS 2.10" — the engine version is 1.0.0, and
  Swiss is a dev-time reference that does not ship. Remove both.

---

## What must not change

- Every colour, type size, spacing value and radius
- Bordered cards, never shadowed · Feather icons only, no emoji
- The `SOURCE` caption under every claim — this is the product
- "NOT BALANCED": a four-against-one split is a dissent, never a middle position
- The partial-chart screen that says four of ten cannot run rather than guessing

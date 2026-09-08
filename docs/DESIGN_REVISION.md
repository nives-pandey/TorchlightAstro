# Torchlight — revision instruction

Paste everything below into Claude Design.

---

The fourteen screens are structurally right. The sourcing discipline, the
dissent panel on Expression, and the partial-chart screen that refuses to guess
are the best things in the set and must survive unchanged. Six changes.

## 1. Write for someone who knows their sun sign and nothing else

The app is for a US audience. Right now Sanskrit carries the meaning: *Guru*,
*Shukra*, *Vrischika*, *Budhavara*, *mahadasha*, *antardasha*, *Vimshottari*,
*navamsha*. A reader in Ohio has no way in.

**English first, tradition second, once, then English thereafter:**

- "Jupiter period (*mahadasha*)" → "Jupiter period" from then on
- "Scorpio rising (*Vrischika lagna*)"
- "Venus (*Shukra*)"
- Timeline now-marker: "Jupiter period · Venus sub-period", not "Guru / Shukra"
- Never a Sanskrit word alone as a heading or a tab label

Keep the `SOURCE` captions exactly as technical as they are. That is where
precision belongs and it is what makes the app credible. The headings are what
must change.

## 2. Replace the bottom bar

`CHART TIME VARGA MORE` is four items, one of which is a Sanskrit term and one
of which hides half the app. Five tabs, Feather icons above short labels, active
tab in gold `#B89B4C`, inactive in `#7D7875`:

| Tab | Icon | Holds |
|---|---|---|
| Today | `sun` | What is live right now |
| Chart | `circle` | All the traditions; the five dimensions live in here |
| Life | `compass` | Life areas — money, work, love, health |
| Timeline | `clock` | Periods from birth onward |
| You | `user` | Profiles, settings, account |

## 3. Add a Today screen — this becomes the home

There is no home screen. Screen 04 is a chart reference, not somewhere a person
returns. Add one, and hold it to four things:

1. Today's date, and the single most relevant thing about it
2. The running period in one plain sentence, with the year it ends
3. Three or four life areas that are active now — never all eight
4. One quiet line into the full chart

If a section needs a sentence explaining why it is on screen, it does not belong
on this screen.

## 4. Add Life areas — a grid and a detail screen

This is what a paying person opens weekly, and it is missing entirely. The
twelve houses are life areas; treat them as the product surface.

- **Money & resources** `dollar-sign`
- **Work & vocation** `briefcase`
- **Love & partnership** `heart`
- **Home & family** `home`
- **Health & routine** `activity`
- **Learning & belief** `book-open`
- **Depth & transformation** `layers`
- **Self & appearance** `user`

A grid of cards, each with its icon in a tinted tile. Tapping one opens a detail
screen: which placements sit in that area, what the running period means for it
specifically, and which traditions have something to say. Past, present and
future for one part of life — that is the thing worth paying for.

## 5. Move the five dimensions inside Chart

Keep screens 04 and 05 as designed — the split bars, the counts, the "NOT
BALANCED" panel. Do not redraw them. Move them one level in, as a section of the
Chart tab.

They answer "what sort of person are you" with five adjectives, which is the
least specific thing this app knows. Lead with what is happening and to which
part of life. The dissent panel stays exactly as it is, one tap away.

## 6. Use more of the palette

Ten colour tokens exist and the screens use two. Widen the range without
changing a value:

- Give each life area a tint as a small icon tile or a left edge — merlot
  `#722F37` for love, teal `#4A7373` for health, gold `#B89B4C` for money, warm
  charcoal for work. Never as a filled card background.
- Use `surface2` `#EFEAE6` for nested content, so a card inside a card reads as a
  different depth.
- The dark theme is not an inversion. On `#36312E`, gold `#C5A55A` and merlot
  `#C48B93` carry more weight than they do in light — let them.

One gold **action** per screen still holds. Tints are not actions.

## Smaller fixes

- **Screen 02** — Google sign-in only. Remove the email and password fields.
- **Screen 13** — dollars, not rupees. The audience is US.
- **Screen 03** — drop "STEP 1 OF 1" from a single-step form.

## What must not change

- Every colour, type size, spacing value and radius
- Bordered cards, never shadowed · Feather icons only, no emoji
- The `SOURCE` caption under every claim
- "NOT BALANCED" — a four-against-one split is a dissent, never a middle position
- The partial-chart screen that names what cannot run rather than guessing

## Screens after this

Sixteen: the fourteen, plus Today and the two Life screens, minus nothing.

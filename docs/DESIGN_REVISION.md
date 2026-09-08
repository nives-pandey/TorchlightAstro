# Torchlight — revision brief

Paste this into Claude Design as the next instruction. It replaces the parts of
the first brief it contradicts and leaves the tokens alone.

---

## What to change

The current designs read like a marketing site for the product rather than the
product. Make it a working app someone opens daily.

### 1. Bottom navigation — five tabs, Feather icons, labels underneath

The app has no navigation. Add a persistent bottom bar, which is what every
Android app of this kind uses and what a US audience expects:

| Tab | Icon | What it holds |
|---|---|---|
| Today | `sun` | What is happening now, and what it means |
| Chart | `circle` | The birth chart, all ten traditions |
| Life | `compass` | The life areas — money, work, love, health |
| Timeline | `clock` | Past, present and future periods |
| You | `user` | Profiles, settings, account |

Active tab in gold, inactive in muted text. Icon above a short label. No badges,
no centre-raised button.

### 2. Replace the five-dimension display entirely

Cut the trait-axis cards from the home screen. They answer "what sort of person
are you" with adjectives, which is the least specific thing this app knows and
the thing every competitor already does badly.

Put the **life areas** there instead. These come from the twelve houses, which
the engine already computes — this is not new data, it was simply never
surfaced:

- **Money & resources** — 2nd and 11th house
- **Work & vocation** — 6th and 10th house
- **Love & partnership** — 5th and 7th house
- **Home & family** — 4th house
- **Health & routine** — 6th house
- **Learning & belief** — 9th house
- **Transformation & depth** — 8th house
- **Self & how you appear** — 1st house

Design these as a grid of cards, each with its own Feather icon
(`dollar-sign`, `briefcase`, `heart`, `home`, `activity`, `book-open`,
`layers`, `user`). Tapping one opens that area's reading: which planets sit
there, which traditions have something to say, and what the current period means
for that part of life specifically.

The trait comparison does not disappear — it moves to a section inside Chart,
where a curious reader can find it. It stops being the headline.

### 3. Past, present, future is the spine

This is what people pay for, and the engine already computes it: nine planetary
periods spanning a lifetime, each with real dates.

Design the **Timeline** tab as a vertical sequence running from birth to old
age. The period running now is marked and expanded. Past periods are collapsed
but readable. Future periods are named with their years. Tapping any period
shows what that period governs and, when a life area is selected, what it meant
or will mean for that area.

Real example from the engine — use these values, do not invent others:

```
Moon      1990–1992
Mars      1992–1999
Rahu      1999–2017
Jupiter   2017–2033   ← running now
Saturn    2033–2052
Mercury   2052–2069
Ketu      2069–2076
Venus     2076–2096
Sun       2096–2102
```

### 4. Uncrowd the home screen

The Today tab holds four things and stops:

1. The date, and the one thing most worth knowing today
2. The period running now, in one sentence, with the year it ends
3. Three or four life-area cards — the ones most active right now, not all eight
4. One quiet line to the full chart

Everything else moves behind a tab. If a section needs a paragraph to explain
why it is on screen, it does not belong on the home screen.

### 5. Colour — keep the palette, use more of it

The tokens stay exactly as they are. The problem is that only two of them are
being used. Widen the range within the same family:

- Give each life area its own tint drawn from the existing palette — merlot
  `#722F37` for love, teal `#4A7373` for health, gold `#B89B4C` for money, warm
  charcoal for work — used as a small icon tile or a left edge on the card, not
  as a filled background.
- Use `surface2` `#EFEAE6` for nested content, so a card inside a card reads as
  a different depth.
- The dark theme should not be a straight inversion. On `#36312E` the gold
  `#C5A55A` and merlot `#C48B93` carry more weight than they do in light — let
  them.

Still one gold *action* per screen. Tints are not actions.

### 6. Register — this is for a US audience

Write for someone in the United States who may know their sun sign and nothing
else.

- Use the English name first, the traditional term second: "your Jupiter period
  (*mahadasha*)", not the reverse.
- Never use an untranslated Sanskrit term as a heading.
- Section headers stay two or three words, uppercase, letter-spaced.
- No exclamation marks, no "unlock", no "discover", no "your cosmic journey".
- The tone is a knowledgeable person explaining something carefully — closer to
  a good doctor than a horoscope column.

### 7. What a paying user gets

Design the value as visible, not as a locked door. On the life-area screens and
the timeline, the depth is the product: what each period means for money, for
work, for a relationship. Show that depth working. Do not design paywall
overlays, blurred text, or countdowns — if a contribution screen appears at all,
it asks once, quietly, and never blocks anything.

---

## What not to change

- Every colour, type size, spacing value and radius from the first brief
- Bordered cards, never shadowed
- Feather icons only, no emoji
- One gold action per screen
- Disagreement between traditions is a finding, and an even split is *contested*,
  never "balanced"
- Every claim sits next to the placement it came from

---

## Screens after this revision

Twelve, replacing the fourteen in the first brief.

1. Splash
2. Sign in — Google button only
3. Birth details — date, optional time, place with nearby-village narrowing
4. **Today** — the home tab
5. **Life areas** — the grid
6. **Life area detail** — one area opened up
7. **Timeline** — periods from birth onward
8. **Period detail** — one period, and what it governs
9. **Chart** — all ten traditions, with the trait comparison inside it
10. **Tradition detail** — one tradition's placements
11. **You** — profiles, settings, account deletion
12. Empty and error states

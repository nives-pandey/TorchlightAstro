# Torchlight — design brief

Paste the **Prompt** section below into Claude Design. Everything under it is
reference: exact tokens, the real data each screen shows, and the rules the
current build already follows.

---

## Prompt

Design a mobile app called **Torchlight**. It computes a person's astrological
chart across ten traditions from one birth input, and its distinguishing idea is
that it shows where those traditions **agree and disagree** rather than averaging
them into one answer.

Design for **Android first**, portrait, 360×800dp reference. Every screen needs a
light and a dark variant.

### Voice and restraint

- Real icons only (Feather icon set). **No emoji anywhere.**
- Section headers are two or three words, uppercase, letter-spaced. Never a
  sentence. "WHERE THEY DISAGREE", not "Here is where the traditions disagree
  about you".
- Buttons carry one word where one word will do: *Continue*, *Save*, *Retry*.
  Never "Tap here to continue".
- No explanatory paragraphs above content. The content explains itself.
- One gold element per screen, and it is the primary action. Nothing else is gold.

### Palette — use these exact values

Light: background `#FCFBF9`, card `#F5F2F0`, raised `#EFEAE6`, text `#36312E`,
muted text `#7D7875`, subtle text `#A29B96`, hairline `#E6E2DE`, gold `#B89B4C`,
merlot `#722F37`, danger `#A8442A`, success `#4A7373`.

Dark: background `#36312E`, card `#3D3835`, raised `#45403C`, text `#F5F2F0`,
muted `#B0A9A4`, subtle `#8A837E`, hairline `#45403C`, gold `#C5A55A`,
merlot `#C48B93`, danger `#D98A6A`, success `#6A9797`.

Gold means action. Merlot means weight or emphasis — never error. Red is only
for genuine errors. The ground is warm off-white, never pure white; the dark
ground is warm charcoal, never black.

### Type

Lora (serif) for display and titles. Montserrat for everything else.

Display 30/38 · Title 22/30 · Heading 17/24 · Body 15/22 · Caption 13/18 ·
Label 11/14 uppercase with 0.8 letter-spacing. Weights: 600 for display through
heading, 400 body, 600 for label.

### Geometry

Spacing scale 4 · 8 · 12 · 16 · 24 · 32 · 48. Screen padding 24.
Corner radii: 6 small, 10 medium, 14 cards, 999 pills.
Cards are **bordered with a 1px hairline, never shadowed** — a shadow on a warm
parchment ground reads as dirt. Minimum touch target 48dp.

### Screens to design

Design these fourteen. Where a screen has an empty, loading, or error state,
show it.

**Onboarding and account**
1. **Splash** — wordmark on the ground, nothing else. This is what a returning
   person sees for the half second the stored session is being checked, so it
   must not flash anything that looks like a sign-in prompt.
2. **Sign in** — a single Google button and nothing else. No email field, no
   password field, no create-account toggle: there is one way in, and signing in
   for the first time *is* creating the account. Below the button, a line of
   small print naming what the app will read from the Google account (name and
   email, nothing more) and a link to the privacy policy — Google's branding
   rules require the button to be recognisably theirs, so keep its shape and
   wording conventional rather than restyling it into the palette. The screen
   also needs its failed state: the sign-in was cancelled or refused, stated
   plainly with a way to try again.
3. **Birth details** — date, time, and place. Time is explicitly optional and
   the screen says what is lost without it. Place is a search field; results
   appear as a list, and once a place is chosen a second list offers nearby
   smaller settlements, because Indian village names have no canonical spelling
   and a person reaches their village by narrowing from the town they know.

**The chart — the heart of the app**
4. **Chart overview** — the main screen. In order: a plain-language reading in
   three short sections (*where you are now*, *what stands out*, *how the
   traditions read you*), then what the traditions unanimously agree on, then
   where they disagree, then each tradition's own placements.
5. **Dimension detail** — one trait axis opened up, showing each tradition's
   reading, how strongly it reads, and the exact placement it came from.
6. **Tradition detail** — one tradition's full placements. Design it once so it
   works for Vedic, Western, and Chinese alike.
7. **Timeline** — the Vedic dasha periods as a life-long sequence, with the
   period running now marked and its end date shown.

**Depth**
8. **Panchanga** — the five limbs of the day: tithi, nakshatra, yoga, karana,
   and the Moon's elongation.
9. **Divisional charts** — sixteen vargas as a browsable grid.
10. **Recommendations** — gemstones and colours, each stating which placement it
    was derived from. Colours need swatches.

**Around the edges**
11. **Profiles** — a list of saved birth profiles, with the person's own marked.
12. **Settings** — account (showing which Google account is signed in), house
    system (Placidus or Whole Sign), ayanamsa (four options), theme, sign out,
    and account deletion. Deletion is required by Google Play and must be
    reachable here, with a confirmation that says plainly what is destroyed.
13. **Contribution** — a voluntary support screen. This must never pressure,
    never gate content, and never imply anything is withheld.
14. **Empty and error states** — no chart yet, offline, reading unavailable.

### Authentication

Google Sign-In is the only way in. There is no email-and-password path, no
password reset, and no separate registration flow to design — a first sign-in
creates the account silently. This removes four screens most apps need, and the
ones that remain should feel like there was never a decision to make.

### What the screens actually contain

Do not invent data. The engine produces exactly this:

- Ten planets, fifteen aspects, twelve house cusps
- Nine dasha periods spanning a lifetime, each with a ruling planet and dates
- Sixteen divisional charts
- Twenty-seven nakshatras with four padas each
- Four Chinese pillars, each a stem and a branch, plus a day master
- Five trait dimensions, each read by up to five traditions
- Three gemstone and three colour recommendations
- Numerology: life path, expression, soul urge, personality, birthday, maturity

Five traditions contribute to the trait comparison; ten compute placements. If a
screen states a count, those are the true numbers.

### Two rules that carry the product

**Disagreement is a finding, not an error.** When traditions split evenly, the
screen must not call that "balanced" — balanced means moderate, and a
two-against-two split is not moderate. Label it as contested and name both sides.

**Every claim shows its source.** A reading that cannot say which placement it
came from is indistinguishable from one that was invented. Design for a claim
and its provenance to sit together.

---

## Reference — for your own use, not part of the prompt

### Why bordered cards, not shadows
Carried from the previous build's design system. On a warm parchment ground a
drop shadow reads as grime; a hairline border gives the same separation cleanly.

### Why one gold element
The moment a second element borrows the accent, neither reads as the thing to
press.

### Fonts
Lora and Montserrat are declared in `src/ui/theme.ts` but not yet bundled, so the
current build renders in the platform default. Bundling them is a one-line change
once the design is settled.

### What already exists in code
Screens 2, 3, and 4 are built and running on device. The rest are designed-but-
unbuilt. The tokens above are read from `src/ui/theme.ts` and are current.

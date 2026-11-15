# Pairing and Harmonizing Arabic with Latin

## Why Latin metrics don't transfer

Arabic has no capitals and no x-height in the Latin sense. Its vertical structure is roughly:
- **Body / tooth zone.** The main mass of most letters (the bowls of ب ت ن, the teeth of س ش). This is the closest analogue to x-height.
- **Ascender zone.** ا ل ك ط ظ and the dots above.
- **Descender zone.** Deep: ي ع ج ح خ ن م ر و and their tails, plus dots below.

Arabic also spreads horizontally, and its stroke weight is concentrated differently than in Latin. At the *same point size*, most Arabic faces look smaller and lighter than their Latin partner. Setting both scripts at the same size is the most common bilingual mistake.

## Pairing criteria (in priority order)

1. **Construction model.** Geometric Kufi with geometric/grotesque sans. Calligraphic Naskh with humanist sans or a serif. Ruqaa or handwritten with a script or informal Latin. A mismatch reads as two brands.
2. **Contrast.** Monolinear with monolinear. High-contrast Naskh needs a Latin with comparable thick–thin modulation, or the Latin looks anaemic next to it.
3. **Terminals and stroke endings.** Flat vs angled vs rounded cuts should agree. Rounded Arabic terminals beside sharp Latin ones look accidental.
4. **Texture and color.** Squint at a paragraph of each. The gray value and rhythm should feel like one voice.
5. **Proportion and width.** A condensed Latin next to a wide Arabic (or the reverse) unbalances lockups.
6. **Personality and register.** Both scripts should say the same thing about the brand.

A designed multi-script family usually satisfies 1–5 out of the box. With mixed foundries, check all six explicitly and say which ones are compromises.

## Matching visual size

Method, for any pair:
1. Set a representative Arabic word (with ا ل and a tooth sequence like سنة) and a Latin word (with x-height letters and a cap) side by side at the same point size.
2. Scale the Arabic until its **body/tooth height** sits close to the Latin **x-height** and the alef height sits near the Latin **cap/ascender height**. Then adjust by eye for equal *weight presence*.
3. Record the ratio (e.g. Arabic = 115% of Latin).

Typical starting ranges, to be confirmed by eye:
- Multi-script families designed together: about 100–110%.
- Mixed-foundry pairs: often 110–130%.
- Naskh with a deep descender against a large-x-height sans: can be 120–135%.

State the ratio you used. In web work, express it with `size-adjust` on the Arabic `@font-face`, or a scaled `font-size` under `:lang(ar)`.

## Matching weights

Weight names (Regular, Medium, Bold) are not comparable across scripts or foundries. Match by **dominant stem thickness** at the chosen sizes. Often the Arabic needs one step heavier than the nominally matching Latin weight (Latin Regular ↔ Arabic Medium). Variable fonts make fine matching easier.

## Line height

Arabic needs more leading because of its tall ascenders, deep descenders and stacked dots/harakat.
- Latin body: ~1.4–1.5.
- Arabic body: ~1.6–1.9, higher for Naskh and for vocalized text.
- In bilingual paragraphs on a shared grid, set the baseline grid to the Arabic needs. Don't squeeze Arabic to fit a Latin grid.

## Tracking and justification

- No positive tracking on connected Arabic. It breaks the joining strokes.
- Justify Arabic with **kashida (ـ)** inserted at grammatically and visually valid joins, or with word-space adjustment, not letter-space. InDesign's Arabic/World-Ready composer supports kashida justification. Browsers have limited kashida support, so prefer `text-align: start` for web body text.
- Don't stretch every word. One or two kashidas per line in display settings at most, at consistent letter pairs.

## Bilingual type scale

Build one scale and attach a per-script multiplier:

| Role | Latin | Arabic (×1.15 example) | Arabic line-height |
|---|---|---|---|
| Display | 64 | 74 | 1.25 |
| H1 | 40 | 46 | 1.35 |
| H2 | 28 | 32 | 1.45 |
| Body | 16 | 18 | 1.75 |
| Caption | 12 | 14 | 1.7 |

The multiplier comes from the size-matching step. Don't reuse 1.15 blindly.

Minimum sizes. Arabic body text below ~9pt in print, or ~14px on screen, loses dots and counters in most faces. Be conservative on low-quality print such as newsprint and thermal receipts.

## CSS patterns

```css
@font-face {
  font-family: "Brand Arabic";
  src: url("/fonts/brand-arabic.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
  size-adjust: 115%;          /* from the size-matching step */
  unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
}

html[lang="ar"], :lang(ar) {
  font-family: "Brand Arabic", "Brand Latin", system-ui, sans-serif;
  line-height: 1.75;
  letter-spacing: 0;          /* never track connected Arabic */
}

:lang(en) { font-family: "Brand Latin", system-ui, sans-serif; line-height: 1.5; }
```

- Set `dir="rtl"` on the document or container, and use logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-*`).
- Put Arabic first in the stack, with Latin as a fallback, so embedded Latin words in Arabic text use the brand Latin face via `unicode-range`.
- Mark inherently LTR content inside RTL (emails, URLs, codes, phone numbers) with `dir="ltr"` or `<bdi>`.
- Feature settings: leave `liga`, `calt`, `rlig` on (they're required for correct shaping). Use `ss01`, `ss02` only if the font documents them.

## Mixed-script lines

When an English word or number appears inside Arabic text:
- The Latin should come from the paired Latin face at the matched size, not from a fallback.
- Watch punctuation direction: the Arabic comma is ، and the question mark is ؟.
- Numbers keep left-to-right digit order inside right-to-left text. Isolate number+unit groups (`<bdi>`) to stop units jumping sides.

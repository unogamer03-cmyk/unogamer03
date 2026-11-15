# Arabic and Bilingual Logotype Construction

## Contents
1. Joining behavior (the non-negotiables)
2. Dots, ligatures, kashida
3. Script models for wordmarks
4. Construction approach
5. Bilingual lockups
6. Common failures to catch in critique
7. How to describe a logotype so a designer can build it

---

## 1. Joining behavior

Arabic letters take up to four contextual forms: isolated, initial, medial, final.

**Non-connecting letters** join only to the letter *before* them (on their right), never to the one after: ا د ذ ر ز و (and ء, plus ة/ى which end words). A word breaks into sub-words (*parts of words*) after each of these. For example, "دار" is three disconnected units, while "سلمان" is سلما + ن.

This rhythm of breaks is the wordmark's skeleton. Count the sub-words early, because they set the silhouette and spacing.

Checks:
- Letters that should join actually join. Many tools render Arabic disconnected or in isolated forms when shaping fails, and AI image generators frequently invent letters.
- The word reads right-to-left, and the first letter is on the right.
- Final forms are correct at word ends (final ي, ن, ه look very different from initial and medial ones).

## 2. Dots, ligatures, kashida

**Dots (نقاط, i'jam)** distinguish letters: ب ت ث ن ي share a skeleton. A missing, merged or misplaced dot changes the word.
- Keep dot size and shape consistent across the mark.
- Stylizing dots (square, round, diamond) is a strong, legitimate identity device. Dropping them is not, unless it is deliberate archaic Kufi for a cultural brand and the word stays readable to the audience.
- Two- and three-dot groups follow conventional arrangements (ت side by side, ث as a triangle).

**Lam-alef (لا) is mandatory.** ل followed by ا must form the لا ligature, not a ل glyph next to an ا. Its form (crossed or looped) is a design choice.

**Kashida / tatweel (ـ):**
- Insert it only between connecting letters, on the connecting stroke.
- Never place it after a non-connecting letter (ا د ذ ر ز و), because there is no join to stretch.
- Prefer stretches before final letters or on wide connecting pairs. One deliberate stretch reads as design. Several read as filler.
- Don't use kashida to force Arabic to match the Latin's length unless the result still looks natural. Adjust the lockup instead.

**Harakat (تشكيل):** usually omitted in logos. Add a shadda or other mark only if it prevents a real misreading or is part of the concept.

## 3. Script models for wordmarks

| Model | Character | Typical fit | Watch out |
|---|---|---|---|
| Geometric / square Kufi | Constructed, modular, modern, official | Tech, government, architecture, mobility | Overly rigid grids kill readability. Square Kufi can become a pattern that no one reads. |
| Contemporary Kufi-Naskh hybrid sans | Clean, versatile, legible | Most commercial brands, apps, retail | Easy to make generic. It needs one ownable detail. |
| Naskh | Literate, trustworthy, classical | Publishing, education, law, heritage F&B | Fine contrast fails at small sizes. Can feel conservative. |
| Thuluth | Ceremonial, monumental | Luxury, cultural institutions, perfume | Complex stacking. Hard at small sizes. Associated with sacred inscriptions, so use it respectfully. |
| Diwani | Ornate, flowing, royal | Luxury, wedding, perfume, hospitality | Legibility drops quickly. Often clichéd. |
| Ruqaa | Everyday handwriting, quick, warm | Cafés, casual F&B, street, youth | Can look unpolished if not refined. |
| Maghribi / Nastaliq | Regional (North Africa / Persian–Urdu) | Only when the brand is from that culture | Reads as foreign in KSA. Don't use it as a generic "calligraphic" look. |

## 4. Construction approach

1. **Start from a pen or construction logic.** For calligraphic models, keep a consistent nib angle and stroke contrast. For geometric models, define a module (stroke width, corner radius, grid unit) and apply it consistently, including to dots.
2. **Base on a typeface or draw from scratch.** If customizing a font, check that the EULA allows modification for logos. OFL allows it. Many commercial EULAs restrict modification or require a specific license.
3. **Choose 1–2 ownable moves.** A custom stroke terminal, a distinctive لا, a stretched connection, a dot treatment, a letter that becomes a symbol. Don't customize every letter.
4. **Optical corrections.** Round letters overshoot the baseline. Heavy joins need thinning at the junction. Keep counters (of ه, ص, ف, و, م) open at small sizes.
5. **Test at the smallest use size** (favicon, app icon, embroidery, stamp) and in one color.
6. **Outline and verify.** Final artwork is outlined vectors. Live text in a browser or design tool depends on its shaping engine, so a custom mark must be drawn.

## 5. Bilingual lockups

Arrangements:
- **Horizontal, Arabic on the right, Latin on the left.** Natural for RTL-first markets. Align on a shared visual center line or baseline, chosen deliberately.
- **Stacked, Arabic above Latin.** Common for Saudi and GCC local brands and for situations where Arabic must lead. Latin above Arabic signals an international brand with an Arabic adaptation.
- **Symbol + Arabic + Latin.** The symbol often sits at the start of the reading direction for the dominant language.

Balance rules:
- Aim for **equal visual weight** (or deliberate Arabic dominance where Arabic leads), not equal width. Forcing equal widths with kashida or condensing usually distorts one script.
- Match stroke weight and the size of the visual core (Arabic body ≈ Latin x-height), then adjust optically.
- Define the spacing between scripts with a unit taken from the mark (for example, the height of the Arabic tooth or the Latin x-height).
- Provide approved variants: horizontal, stacked, Arabic-only, Latin-only, symbol-only. Specify which variant each context uses (Saudi storefront signage, app icon, social avatar, international press).

For legal and regulatory points on Arabic prominence in Saudi signage, see `gcc-context.md`.

## 6. Common failures to catch in critique

- Disconnected letters, isolated forms used mid-word, reversed direction.
- Missing or wrong dots. Inconsistent dot styles.
- ل + ا not forming لا.
- Kashida after ا د ذ ر ز و, or too many kashidas.
- Latin geometry applied without Arabic stroke logic, for example circles forced into ه or ع until they become unrecognizable.
- Persian forms (ک ی ۴) in a Gulf brand.
- Slanted "italic" Arabic, fake bold, outline strokes that close counters.
- Arabic visibly smaller or lighter than Latin in a lockup where it should be equal.
- Pseudo-Arabic: Latin letters dressed up to look Arabic. Native audiences read this as caricature.
- Sacred text or the name of Allah used decoratively, or national symbols used commercially (see `gcc-context.md`).
- A mark that only works with a heavy outline or shadow, or that fails in one color.

## 7. Describing a logotype

When you can't draw the final mark, describe it precisely enough to execute:

```
الكلمة: [Arabic name] — sub-words: [list, right to left]
النموذج: [script model] — based on / inspired by [typeface or from scratch]
الوحدة: stroke [x], corner radius [y], dot shape [z]
الحركة المميزة: e.g. extended connection between م and ا, custom لا with crossed stems, square dots
خط الأساس والمحاذاة: baseline, overshoot, ascender cap
الإقفال الثنائي: arrangement, ratio AR:EN, spacing unit, alignment line
الاختبار: minimum size, one-color, reversed
```

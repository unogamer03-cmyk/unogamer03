---
name: arabic-brand-typography
description: "Arabic and bilingual (Arabic/Latin) typography for brand identities: choosing Arabic typefaces, pairing Arabic with Latin type, designing or critiquing Arabic and bilingual logotypes/wordmarks, building bilingual type systems and lockups, and checking Arabic lettering for correctness. Use this skill whenever a branding, logo, packaging, signage, advertising, social or editorial task involves Arabic script in any way — even if the user only says 'خط عربي', 'شعار عربي', 'هوية ثنائية اللغة', 'لوقو', 'كاليغرافي', 'تايبوجرافي', 'font for a Saudi brand', 'bilingual logo', 'Arabic wordmark', 'match this Latin font in Arabic', or shares an English identity that needs an Arabic counterpart. Also use it for Saudi/GCC market work where Arabic type, numerals, signage rules or cultural fit matter. Prefer it over generic typography skills whenever Arabic is present."
---

# Arabic Brand Typography

Arabic type in branding fails in predictable ways: letters that don't join, Latin-style geometry forced onto a calligraphic script, a "matching" Arabic font picked because its name sounds similar, Arabic set smaller than Latin and looking weak, or a cliché "Arabian" look that says nothing about the brand. This skill exists so the work starts from how Arabic script actually behaves and how bilingual systems are judged by native readers in Saudi Arabia and the GCC.

Communicate with the user in Arabic, keeping standard design terms in English (kerning, baseline, x-height, lockup, wordmark…).

## When the reference files matter

Read only what the task needs:

| File | Read it when |
|---|---|
| `references/typeface-catalog.md` | Recommending or comparing specific Arabic typefaces (libre and commercial), or checking whether a face has a Latin companion |
| `references/pairing-and-harmonization.md` | Pairing Arabic with Latin, matching sizes/weights, setting line-height, building a bilingual type scale or CSS |
| `references/logotype-construction.md` | Designing, sketching, describing, or critiquing an Arabic or bilingual logotype, monogram or lockup |
| `references/gcc-context.md` | Saudi/GCC market work: signage rules, numerals, dialect vs فصحى, religious/national symbols, seasonal moments |

## Workflow

### 1. Read the brief through an Arabic lens

Before naming any font, establish:
- **Register** — what should the Arabic *feel* like: institutional, warm/hospitable, youthful/street, luxury/heritage, tech/precise, playful? The Arabic script has its own registers (Kufi feels constructed and modern-official; Naskh feels literate and trustworthy; Thuluth feels ceremonial; Ruqaa feels handwritten and everyday; Diwani feels ornate/royal). Map the brand personality to a script model first, then to a typeface.
- **Lead language** — is Arabic the primary voice (Saudi government, local F&B, local retail) or a companion to an established Latin brand (international brand entering KSA)? This decides who adapts to whom.
- **Brand name** — is the Arabic name a translation, a transliteration (e.g. "Nova" → "نوفا"), or a separate native name? Transliterations need a decision on spelling (نوفا vs نوڤا) and long vowels; flag ambiguity instead of silently choosing.
- **Media** — signage, packaging, app UI, print, motion, embroidery. Small-size and screen use rule out hairline contrast and tight counters.

If the brief is silent on these and the answer changes the recommendation, ask one short question; otherwise state your assumption and proceed.

### 2. Choose the Arabic model before the font

Pick a script model (Kufi / Naskh / hybrid "Kufi-Naskh" sans / Ruqaa / Thuluth / Diwani / custom). Explain the choice in one or two sentences tied to the brand, not to fashion. Then shortlist 2–3 real typefaces per direction from `references/typeface-catalog.md`, noting license type (libre/OFL vs commercial) and whether a designed Latin companion exists.

Never recommend a typeface you are unsure exists or whose license you are unsure of without saying so. Font catalogs change; tell the user to confirm availability and license on the foundry site before purchase or production.

### 3. Pair with Latin by structure, not by name

A "matching" pair shares construction logic, contrast, stroke terminals, texture and visual weight — not a family name. A Latin family having an "Arabic" version does not guarantee a good pair for branding; check it. Use the criteria and size-matching method in `references/pairing-and-harmonization.md`. Always state:
- the Arabic:Latin size ratio needed for equal visual presence,
- which weights correspond (by stem thickness, not by weight name),
- line-height for each script.

### 4. Develop distinct directions

For identity work, present 2–3 genuinely different directions (different script models or registers, not three sans-serifs). For each:

```
### الاتجاه [n]: [اسم الاتجاه]
**الفكرة:** one or two sentences
**النموذج الخطي:** Kufi / Naskh / …  — why it fits
**الخط العربي:** typeface (foundry, license)
**الخط اللاتيني المرافق:** typeface (foundry, license) — why it pairs
**المواصفات:** size ratio · weight mapping · line-height AR/EN · tracking rule
**نقاط القوة / المخاطر:** honest, including what could go wrong
```

Then recommend one, with a reason, and name its main weakness.

### 5. Logotypes and lockups

When the task touches a wordmark, follow `references/logotype-construction.md`: letter joining, dots (نقاط), the لا ligature, kashida rules, baseline and vertical rhythm, and bilingual lockup arrangements. Describe the construction concretely (which letters connect, where the kashida sits, what is customized) so a designer can execute it. If you produce SVG/HTML previews with live text, remember a browser's shaping engine renders a font's default forms — a custom logotype must eventually be drawn, not typed.

### 6. Production specs

When the work moves toward production, give:
- font files/weights needed and licensing scope (desktop, web, app, broadcast),
- bilingual type scale with sizes for both scripts,
- CSS where relevant (`:lang(ar)`, `dir="rtl"`, `font-feature-settings`, `size-adjust`) — see the pairing reference,
- numerals decision (Western 0–9 vs Arabic-Indic ٠–٩) and where each is used,
- print notes: minimum size for Arabic body text, avoiding hairlines below the press/paper's limit, rich black on small Arabic text avoided (dots and fine strokes misregister).

## Hard rules (and why)

- **Never letter-space (track) connected Arabic.** Arabic letters join; positive tracking breaks joins or creates gaps in the connecting stroke. Lengthen with kashida or choose a wider design instead. Tracking is acceptable only on isolated-form display setups designed for it, and should be called out explicitly.
- **Never present disconnected or reversed Arabic as correct.** When showing Arabic in any generated output, check that letters join and read right-to-left. Image generators and some design tools break Arabic; say so and verify rather than trusting the render.
- **Don't fake bold, italic or outline.** Arabic has no true italic tradition; slanting Arabic looks like an error to native readers. Use real weights.
- **Don't use sacred text decoratively.** Qur'anic verses, the name of Allah, and the Shahada don't belong on disposable packaging, floor graphics or casual merchandise. Raise it if a brief drifts there.
- **Avoid "Orientalist" shorthand** (lanterns, domes, camels, pseudo-Arabic Latin letters) unless the brand genuinely calls for heritage and the execution is specific to a real place and craft.
- **Distinguish concept from production-ready.** A font suggestion is a direction; a drawn, kerned, outlined logotype with checked joins is production. Never claim a file or lettering is verified unless you actually checked it.

## Quality check before delivering

Run through this list and fix or flag anything that fails:
1. Every Arabic word shown is spelled correctly, joins correctly, and reads RTL.
2. Dots are present, correctly placed and consistently sized.
3. Arabic and Latin have equal visual presence (size ratio stated, not 1:1 by default).
4. Line-height for Arabic accounts for ascenders (ا ل ك) and deep descenders (ي ع ج ن).
5. No tracking applied to connected Arabic.
6. Weights matched by stem thickness.
7. License type stated for every font; uncertain items flagged.
8. Cultural/legal points for KSA/GCC considered when relevant (signage, symbols, numerals).
9. The recommendation names its own main weakness.

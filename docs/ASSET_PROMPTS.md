# Fish Hunting Battle — Asset Prompts

## Style lock (paste at the START of every prompt)

```
Stylized 3D game asset for a premium mobile arcade fish-shooting game. Original character design. Glossy toy-like materials, soft subsurface scattering, strong cyan-white rim light from upper left, warm key light, soft ambient occlusion, crisp clean silhouette, vibrant saturated colors, high detail, 4K render quality. No text, no watermark, no logo, no ground shadow, no frame.
```

## Technical rules (all character / prop assets)

- Transparent PNG (32-bit, sRGB). If the tool cannot export transparency, use a **solid flat background color** (listed per asset), so it can be removed cleanly.
- Full body visible, centered, ~6% empty padding around it, nothing cropped.
- Fish and shark: **pure side view, facing RIGHT**, mouth on the right side.
- One subject per image, square-ish canvas unless the size says otherwise.

| Folder | Content |
|---|---|
| `public/assets/fish/` | fish + shark |
| `public/assets/weapon/` | cannon, base, bullets |
| `public/assets/bg/` | background layers |
| `public/assets/ui/` | icons |
| `public/assets/fx/` | effects |

---

## 1. Fish (512×512, facing right)

**fish_01_bumble.png** — 80 pts · small · bg: solid magenta #FF00FF
```
[STYLE LOCK] A small round tropical tang fish, bright lemon-yellow body with three bold black vertical stripes, cream belly, orange-tipped translucent fins, big friendly glossy eyes, small smiling mouth, cute and harmless. Side view facing right.
```

**fish_02_bluestripe.png** — 100 pts · small · bg: solid magenta #FF00FF
```
[STYLE LOCK] A sleek fast reef fish, royal-blue body with white vertical bands outlined in navy, white belly, bright orange-yellow fins and forked tail, alert surprised eyes, streamlined racing shape. Side view facing right.
```

**fish_03_piranha.png** — 120 pts · medium · bg: solid magenta #FF00FF
```
[STYLE LOCK] An aggressive green piranha, deep emerald back fading to lime-yellow belly, dark scale spots, heavy underbite with an open mouth full of sharp white triangular teeth, angry yellow eyes with thick frowning brow, spiky dorsal fin. Side view facing right.
```

**fish_04_fang.png** — 150 pts · medium · bg: solid green #00C060
```
[STYLE LOCK] A menacing purple fang fish, violet body with glowing orange curved stripes, lavender belly, wide open jaw with long sharp teeth, furious red eyes, tall spiky purple dorsal fin with orange tips. Side view facing right.
```

**fish_05_puffer.png** — 200 pts · medium, round · bg: solid magenta #FF00FF
```
[STYLE LOCK] An inflated golden pufferfish, perfectly round body covered in short cream spikes, golden-amber top with brown spots, pale belly, huge worried glossy eyes, small round pouting orange lips, tiny fluttering fins. Side view facing right.
```

**fish_06_clown.png** — 250 pts · medium · bg: solid green #00C060
```
[STYLE LOCK] An angry hot-pink clownfish-style warrior fish, magenta-pink body with bold white bands outlined in black, open mouth with sharp teeth, aggressive slanted eyes, rounded fins with white edges. Side view facing right.
```

**fish_07_angler.png** — 300 pts · large · bg: solid magenta #FF00FF
```
[STYLE LOCK] A deep-sea anglerfish, dark indigo-blue body with bioluminescent cyan dots, huge open jaw with needle teeth, glowing cyan bulb lure on a curved stalk above its head emitting light, intimidating cyan eyes. Side view facing right.
```

**fish_08_king.png** — 500 pts · large, premium · bg: solid magenta #FF00FF
```
[STYLE LOCK] A majestic royal fire fish, rich orange body with cream bands outlined in dark red, golden metallic sheen, tall crown-like spiky dorsal fin with golden tips, big flowing orange-to-gold tail, confident eyes, subtle warm golden glow around the body. Premium boss-like look. Side view facing right.
```

## 2. Shark (1024×512)

**shark_boss.png** — 1000 pts · bg: solid magenta #FF00FF
```
[STYLE LOCK] A huge fierce tiger shark boss, cobalt-blue back with dark navy tiger stripes, clean white belly, wide open jaws with rows of sharp white teeth and red mouth interior, angry yellow eye with heavy brow, scars on the head, large pectoral fin, tall dorsal fin, crescent tail. Powerful and threatening but cartoon-stylized. Side view facing right, full body.
```

## 3. Weapon

**cannon_gun.png** — 1024×384 · bg: solid magenta #FF00FF
```
[STYLE LOCK] A futuristic sci-fi gatling plasma cannon, side view with the barrels pointing RIGHT, triple rotating gunmetal barrels, gold-yellow armor plates with black hazard stripes, glowing cyan energy cells along the body, red scope lens, chunky premium arcade-weapon design, metallic reflections. No hands, no person.
```

**cannon_base.png** — 768×384 · bg: solid magenta #FF00FF
```
[STYLE LOCK] A sci-fi turret mounting base seen from the front, half-dome of dark gunmetal with gold armor trim, glowing cyan ring light, hazard-stripe skirt at the bottom, rotating pivot hub at the top center. Flat bottom edge.
```

**bullet_plasma.png** — 256×96 · black background (used with additive blend)
```
Glowing plasma bolt projectile pointing right, white-hot core, orange-yellow energy glow, motion streak trailing left, game VFX sprite on pure black background.
```

**bullet_power.png** — 256×128 · black background
```
Large glowing magenta-red plasma energy orb projectile pointing right, white-hot core, crackling energy, long motion trail to the left, game VFX sprite on pure black background.
```

## 4. Background layers (1920×1080, 16:9, opaque except where noted)

**bg_01_far.png** — opaque
```
Underwater ocean scene background, stylized 3D game environment, deep blue and turquoise gradient water, bright surface light at the top, strong volumetric god rays shining down, distant hazy silhouettes of reef cliffs, floating plankton particles, empty middle area for gameplay, cinematic depth, no fish, no text.
```

**bg_02_mid_reef.png** — transparent upper part · bg fallback: solid magenta #FF00FF
```
[STYLE LOCK] Mid-distance underwater rock formations and coral reef silhouettes along the bottom third of a wide 16:9 image, blue-tinted by water depth, soft atmospheric haze, upper two thirds completely empty. No fish.
```

**bg_03_near_reef.png** — transparent upper part · bg fallback: solid magenta #FF00FF
```
[STYLE LOCK] Foreground coral reef along the bottom of a wide 16:9 image: colorful branching red and orange corals, purple sea fans, brain coral, tube sponges, mossy rocks, sand with starfish, taller reef clusters at the far left and far right corners, the center bottom kept lower and clear for a cannon. Upper area completely empty. No fish.
```

**seaweed_01.png / seaweed_02.png** — 256×768 · bg: solid magenta #FF00FF
```
[STYLE LOCK] A single tall cluster of wavy green kelp seaweed, translucent leaves catching light, rooted at the bottom, standing straight up, isolated.
```

## 5. UI icons (256×256, transparent · bg fallback: solid magenta #FF00FF)

Add to every icon prompt: `Glossy 3D game UI icon, bold readable shape, thick dark outline, isolated.`

| File | Prompt (after STYLE LOCK + icon line) |
|---|---|
| `icon_power.png` | `Explosive fire burst ability icon, red-orange starburst with white-hot center.` |
| `icon_freeze.png` | `Ice freeze ability icon, glowing crystal snowflake, icy blue and white.` |
| `icon_lightning.png` | `Lightning strike ability icon, jagged purple-white electric bolt with glow.` |
| `icon_coin.png` | `Shiny gold coin with an embossed star, slightly tilted.` |
| `icon_coins_stack.png` | `Stack of shiny gold coins.` |
| `icon_trophy.png` | `Golden trophy cup with handles.` |
| `icon_bullet.png` | `Single golden brass bullet cartridge, upright.` |
| `icon_target.png` | `Red and white sniper crosshair reticle.` |
| `icon_skull.png` | `Cartoon white skull with crossbones and red glowing eyes.` |

## 6. Effects (on pure black background, for additive blending)

| File | Size | Prompt |
|---|---|---|
| `fx_explosion_sheet.png` | 2048×256 (8 frames in a row) | `Cartoon game explosion animation sprite sheet, 8 frames in a single horizontal row, from small flash to big orange-yellow fireball to smoke puff, on pure black background.` |
| `fx_muzzle_flash.png` | 256×256 | `Bright gun muzzle flash starburst, white-yellow core, orange spikes, on pure black background.` |
| `fx_hit_spark.png` | 256×256 | `Small electric impact spark burst, white and cyan, on pure black background.` |
| `fx_bubble.png` | 128×128 · transparent | `Single translucent underwater bubble with a glossy highlight, isolated.` |

---

## Consistency checklist before sending

- [ ] Every fish faces **right** and is a pure side view.
- [ ] Same lighting direction (upper left) on every asset.
- [ ] Backgrounds are clean and easy to remove (or truly transparent).
- [ ] Nothing cropped at the edges.
- [ ] No text or watermark inside the images.

# BIG OUTDOORS EXPEDITE LLC — 15s commercial (Remotion)

A 15-second commercial in black and gold, built with [Remotion](https://remotion.dev). It renders at 3840×2160 and 30 fps.

| Time | Scene | On-screen voice-over caption |
|---|---|---|
| 0–3s | Businessman at night; phone shows **DELAYED** | "Shipment delayed? Every second counts!" |
| 3–6s | Chicago skyline (Willis Tower, Hancock, Trump, Aon). Truck backs into the dock, freight is loaded and the truck rolls out | "Big Outdoors Expedite LLC is ready to move!" |
| 6–11s | Tilted 3D US map from real state boundaries. A gold route runs Chicago → I-55 → St. Louis → I-44 → Oklahoma City → I-35 → Dallas, then cuts to the truck on I-35 in Texas | "From Chicago to Texas, delivering in record time!" |
| 11–15s | Truck arrives in Dallas with a **DELIVERED** stamp, then the brand reveal | — |

The end card shows, exactly: **BIG OUTDOORS EXPEDITE LLC** · **www.bigoutdoors.co** · **219-400-SHIP** · **YOUR SHIPMENT. OUR PRIORITY.**
All brand text lives in `src/theme.ts` (`BRAND`). No delivery times or durations appear anywhere.

## Commands

```bash
npm install
npm run studio        # live preview / timeline editor
npm run audio         # regenerate public/soundtrack.wav (procedural score + SFX)
npm run render:4k     # out/big-outdoors-4k.mp4 (3840x2160)
npm run render        # 1080p
```

In a container without Chrome, set `REMOTION_CHROME=/path/to/chrome-headless-shell`.

## Voice-over

The voice-over lines appear as kinetic captions. To add a recorded deep male voice-over:
1. Record or produce the three lines at the timings above as one 15s file and save it to `public/voiceover.mp3`.
2. Render with `npx remotion render src/index.ts BigOutdoorsCommercial out/final-4k.mp4 --scale=2 --props='{"withVoiceover":true}'`.

## Notes

- Everything is vector or procedural (SVG trucks, map, particles, synthesized audio), so there are no stock-asset licenses to clear.
- State geometry comes from `us-atlas` (US Census Bureau shapes), drawn with an Albers USA projection.

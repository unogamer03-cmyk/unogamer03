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

A deep American male narrator reads the script, made with the open-source [Kokoro](https://github.com/thewh1teagle/kokoro-onnx) text-to-speech model (voice `am_onyx`). The music dips under each line.

| Time | Line |
|---|---|
| 0.45s | Shipment delayed? Every second counts! |
| 3.15s | Big Outdoors Expedite LLC is ready to move! |
| 6.5s | From Chicago to Texas, delivering in record time! |
| 13.2s | Your shipment. Our priority. |

- The cue times are in `src/theme.ts` (`VO_CUES`) and the audio files are in `public/vo/`.
- To regenerate the lines, run `scripts/make-voiceover.sh <kokoro-model-dir>`.
- To use a professional recording instead, replace `public/vo/line1-4.wav` and adjust `VO_CUES` to match.
- To render without narration, pass `--props='{"withVoiceover":false}'`.

## Notes

- Everything is vector or procedural (SVG trucks, map, particles, synthesized audio), so there are no stock-asset licenses to clear.
- State geometry comes from `us-atlas` (US Census Bureau shapes), drawn with an Albers USA projection.

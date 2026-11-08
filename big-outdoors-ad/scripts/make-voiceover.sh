#!/usr/bin/env bash
# Regenerates public/vo/line*.wav with the open-source Kokoro TTS model (voice: am_onyx).
# Usage: scripts/make-voiceover.sh <dir-with-kokoro-v1.0.onnx-and-voices-v1.0.bin>
# Model files: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
set -euo pipefail
MODEL_DIR="$1"
HERE="$(cd "$(dirname "$0")" && pwd)"
TMP="$(mktemp -d)"
python3 -m venv "$TMP/venv"
"$TMP/venv/bin/pip" install -q kokoro-onnx soundfile
"$TMP/venv/bin/python" -I "$HERE/vo_lines.py" "$MODEL_DIR" "$TMP"
mkdir -p "$HERE/../public/vo"
for i in 1 2 3 4; do
  ffmpeg -v error -y -i "$TMP/line$i.wav" -af "highpass=f=60,equalizer=f=110:t=q:w=1:g=4,equalizer=f=3500:t=q:w=1.5:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=90:makeup=2,silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-15:TP=-1.5:LRA=7" -ar 48000 -ac 2 "$HERE/../public/vo/line$i.wav"
done
echo "Update durations in src/theme.ts (VO_CUES) if the lines changed length."

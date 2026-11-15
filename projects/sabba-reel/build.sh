#!/bin/bash
# Rebuild the Reel: render visuals with HyperFrames, mix audio, normalize to -14 LUFS, mux.
# Usage: projects/sabba-reel/build.sh [version]   (run from anywhere)
set -euo pipefail
cd "$(dirname "$0")"
V=${1:-v2}; A=audio; T=$(mktemp -d)
npx --yes hyperframes render . --output "$T/silent.mp4"
ffmpeg -nostdin -v error -y -i "$T/silent.mp4" -ss 10.0 -i $A/music-mixkit-1104-lazy-camel.mp3 \
  -i $A/vo-1.wav -i $A/vo-2.wav -i $A/vo-3.wav -i $A/vo-4.wav -i $A/vo-5.wav \
  -i $A/sfx-mixkit-2183-metal-ring.mp3 -i $A/sfx-mixkit-2182-wood-hit.mp3 -i $A/sfx-mixkit-1318-pour.mp3 \
  -filter_complex_script $A/mix.fg -map "[pre]" -ar 48000 -ac 2 "$T/pre.wav"
J=$(ffmpeg -nostdin -i "$T/pre.wav" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
g(){ echo "$J" | grep "\"$1\"" | cut -d'"' -f4; }
ffmpeg -nostdin -v error -y -i "$T/pre.wav" -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000,apad=whole_dur=15,atrim=0:15" "$T/final.wav"
mkdir -p out
ffmpeg -nostdin -v error -y -i "$T/silent.mp4" -i "$T/final.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -t 15 -movflags +faststart "out/sabba-reel-$V.mp4"
rm -rf "$T"; echo "out/sabba-reel-$V.mp4"

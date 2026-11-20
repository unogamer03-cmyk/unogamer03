#!/bin/bash
# Usage: ./render.sh out.png [res] [samples]
# Blender can't shape Arabic itself, so the word is shaped + reordered here first.
export AR_VISUAL=$(python3 -c "import arabic_reshaper;from bidi.algorithm import get_display;print(get_display(arabic_reshaper.reshape('بوابة')))")
blender -b --python "$(dirname "$0")/logo.py" -- "$(realpath "$1")" "${2:-1080}" "${3:-160}"

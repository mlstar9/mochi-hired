#!/bin/bash
# Generate placeholder MP4s for each section — black bg with white label text
OUT="premiere/ai-selves-leti-v2/placeholders"
mkdir -p "$OUT"

declare -A sections
sections[01-hook]="4"
sections[02-explain]="1"
sections[03-anthony]="2"
sections[04-theo]="2"
sections[05-theo-work]="4"
sections[06-montage-starry]="1.3"
sections[07-montage-rus]="1.3"
sections[08-montage-matan]="1.4"
sections[09-demi]="2"
sections[10-not-exactly]="1.5"
sections[11-semi]="1.5"
sections[12-demi-busy]="2"
sections[13-leti-intro]="3"
sections[14-mochi-reveal]="3"
sections[15-leti-annoyed]="2"
sections[16-mochi-glitch]="1"
sections[17-leti-comeback]="1.5"
sections[18-mochi-done]="3.5"
sections[19-loop-zoom]="2"

for key in $(echo "${!sections[@]}" | tr ' ' '\n' | sort); do
  dur="${sections[$key]}"
  label=$(echo "$key" | sed 's/^[0-9]*-//' | tr '-' ' ' | tr '[:lower:]' '[:upper:]')
  echo "Generating $key (${dur}s)..."
  ffmpeg -y -f lavfi -i "color=c=0x111111:s=1920x1080:d=${dur}:r=24" \
    -vf "drawtext=text='${label}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2:font=monospace" \
    -c:v libx264 -pix_fmt yuv420p -preset ultrafast \
    "$OUT/${key}.mp4" 2>/dev/null
done

echo "Done! Generated $(ls "$OUT"/*.mp4 | wc -l) placeholders in $OUT/"

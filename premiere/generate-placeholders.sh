#!/bin/bash
# Generate placeholder images for Premiere Pro timeline
# Each placeholder is 1920x1080 with label text

ASSETS="assets"
cd "$(dirname "$0")"

# Check if ImageMagick is available
if ! command -v convert &> /dev/null; then
  echo "ImageMagick not found, using ffmpeg for placeholders"
  USE_FFMPEG=1
fi

generate() {
  local name="$1"
  local label="$2"
  local color="$3"
  
  if [ "$USE_FFMPEG" = "1" ]; then
    ffmpeg -y -f lavfi -i "color=c=${color}:s=1920x1080:d=1" \
      -vf "drawtext=text='${label}':fontsize=48:fontcolor=white:x=(w-tw)/2:y=(h-th)/2:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" \
      -frames:v 1 "$ASSETS/${name}.png" 2>/dev/null
  else
    convert -size 1920x1080 "xc:${color}" \
      -gravity center -pointsize 48 -fill white \
      -annotate 0 "${label}" \
      "$ASSETS/${name}.png"
  fi
  echo "Generated: ${name}.png"
}

mkdir -p "$ASSETS"

# Text cards (white on black)
for card in \
  "text_01_incredible_people:I work with some incredible people.:black" \
  "text_02_makes_me_better:he makes me better.:black" \
  "text_03_she_does:I don't. She does.:black" \
  "text_04_thats_enough:sometimes that's enough.:black" \
  "text_05_shes_a_cat:she's a cat.:black" \
  "text_06_not_replacing:they're not replacing us.:black" \
  "text_07_more_than_one:more than one.:black" \
  "endcard:PIKA - AI Selves:black"
do
  IFS=: read -r name label color <<< "$card"
  generate "$name" "$label" "$color"
done

# Placeholder screenshots (colored with descriptive labels)
for card in \
  "placeholder_theo_slack:THEO - Slack #creator-identification:0x2C2F33" \
  "placeholder_theo_response:THEO - Detailed Response + Table:0x2C2F33" \
  "placeholder_semi_huddle:SEMI - Slack Huddle Meeting Grid:0x1a1d21" \
  "placeholder_semi_dm:SEMI - DM Recap to Demi:0x1a1d21" \
  "placeholder_semi_general:SEMI - Messages in #general:0x1a1d21" \
  "placeholder_semi_reaction:SEMI - Emoji Reaction nice work:0x1a1d21" \
  "placeholder_nyx_dm:NYX - DM to Jessie:0x1a1d21" \
  "placeholder_nyx_selfie:NYX - Selfie + Reactions:0x1a1d21" \
  "placeholder_momo_huddle:MOMO - Cat in Meeting Grid:0x1a1d21" \
  "placeholder_momo_hype:MOMO - 3 DAYS UNTIL LAUNCH Hype:0x1a1d21" \
  "placeholder_momo_selfie:MOMO - Cat Selfie Tongue Out:0x1a1d21" \
  "placeholder_reveal_flash:REVEAL - Quick Flashes All Four:0x111111"
do
  IFS=: read -r name label color <<< "$card"
  generate "$name" "$label" "$color"
done

echo ""
echo "Done! All placeholders in $ASSETS/"

#!/bin/bash
# Test different face crop compositions

cd /home/ke/.openclaw-leti-2/workspace/mochi-hired

# Create test versions with different crop values
declare -A CROPS
CROPS["v23"]="width: '300%', transform: 'translate(-35%, -25%)'"
CROPS["v24"]="width: '350%', transform: 'translate(-40%, -28%)'"
CROPS["v25"]="width: '280%', transform: 'translate(-32%, -22%)'"
CROPS["v26"]="width: '320%', transform: 'translate(-38%, -26%)'"

for VERSION in v23 v24 v25 v26; do
    CROP="${CROPS[$VERSION]}"
    echo "=== Rendering $VERSION with $CROP ==="
    
    # Update the crop values in the tsx file
    sed -i "s|width: '[0-9]*%', height: 'auto', transform: 'translate(-[0-9]*%, -[0-9]*%)'|${CROP}, height: 'auto'|g" src/MochiHired.tsx
    
    # Render
    npx remotion render src/index.tsx MochiHired out/mochi-hired-${VERSION}.mp4 --overwrite 2>&1 | tail -3
done

echo "=== Done ==="
ls -la out/mochi-hired-v2*.mp4

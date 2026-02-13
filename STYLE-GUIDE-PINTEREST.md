# Pinterest Board Style Guide — Motion Graphics Reference

> Synthesized from 24 reference images (pinterest-board/). This document defines the visual language for all animation work on this project.

---

## 1. Color Rules

### Primary Palettes

The board gravitates toward **three distinct color modes**, used interchangeably:

| Mode | Colors | Hex Range | Usage |
|------|--------|-----------|-------|
| **Monochrome** | Black + White (+ gray) | `#0A0A0A`, `#1A1A1A`, `#FFFFFF`, `#D0D0D0` | Dominant mode (~50% of references). Kinetic type, title cards, brand intros |
| **Neon Accent on Dark** | Near-black + single saturated pop | `#0D0D0D` + `#C8F520` / `#7ED641` / `#00C853` | Sports, esports, high-energy pieces |
| **Gradient/Duotone** | Blue→Pink, Purple→Gold | `#3B5CE4`→`#FF3399`, `#2B2060`+`#FF0A0A` | Tutorial thumbnails, editorial, expressive type |

### Secondary Palettes (occasional)

| Mode | Colors | When Used |
|------|--------|-----------|
| **Warm Neutral** | Cream `#F2ECDC`, Olive `#B5B84B`, Tan `#C4A882` | Portfolio/editorial layouts |
| **Candy Pastel** | Periwinkle `#9B8AE8`, Pink `#F2A0B0`, Orange `#F9A84D` | Illustrated/character-driven pieces |
| **Tech Blue** | Cerulean `#0C87C1`, Electric Blue `#3B6BF5` | Clean UI/product animation |

### Color Principles

- **Limit to 2–3 colors max per composition.** Most references use only 2.
- **One dominant background color** (usually dark or white) + one accent.
- **High contrast is non-negotiable** — text must pop aggressively against background.
- **No muddy mid-tones.** Colors are either very dark, very light, or fully saturated.
- **Gradients** are allowed but should be smooth, spanning analogous hues (blue→pink, not random).

---

## 2. Typography Rules

### Typeface Selection

| Category | Recommended Styles | References |
|----------|-------------------|------------|
| **Primary Display** | Ultra-bold condensed sans-serif | Impact, Bebas Neue, Dharma Gothic, Druk Wide, Knockout |
| **Secondary Display** | Geometric bold sans-serif | Futura Bold, Montserrat Black, Circular Bold |
| **Editorial/Brand** | High-contrast serif italic | Playfair Display, Didone/Bodoni style |
| **UI/Body** | Clean geometric sans | Inter, Helvetica Neue, Product Sans |

### Typography Principles

- **ALL CAPS is the default** for display/headline type. Lowercase reserved for editorial or body.
- **Weight: Heavy.** Use Bold, Black, or Ultra-Bold (700–900). Thin/light weights only for intentional contrast (outline vs. fill).
- **Scale: Oversized.** Text should fill 50–100% of the frame width. Bleed off edges when possible.
- **Tight tracking and leading.** Letters nearly touch. Lines stack with minimal breathing room.
- **Two-treatment system:** Alternate between **solid fill** and **outline/stroke-only** text to create rhythm and hierarchy.
- **Italic/slant** for forward momentum and energy (~5–15° angle).
- **Bilingual pairing** (when applicable): Use matching weights across scripts.

### Type Hierarchy Pattern

```
LINE 1: Solid fill — primary statement
LINE 2: Outline/hollow — secondary/connector
LINE 3: Solid fill — payoff/emphasis
```

---

## 3. Layout Rules

### Composition Patterns

| Pattern | Frequency | Description |
|---------|-----------|-------------|
| **Full-bleed type** | ★★★★★ | Text fills entire frame, bleeds off edges. Most common. |
| **Dead center** | ★★★★☆ | Single element (logo, word) centered with massive negative space |
| **Vertical stack/repeat** | ★★★★☆ | Same word repeated vertically, one instance highlighted (fill vs outline) |
| **Grid (3-col or 3×3)** | ★★☆☆☆ | Clean card layouts, product grids |
| **Asymmetric anchor** | ★★☆☆☆ | Element in corner with negative space for incoming content |
| **Corner registration marks** | ★★★☆☆ | Small `+` crosshairs, rotated labels in corners — adds "designed" feel |

### Spacing Rules

- **Negative space is strategic.** Either use tons of it (minimalist) or nearly none (maximal type filling frame).
- **No medium amounts of space.** Commit to one extreme.
- **Frame-breaking:** Elements should occasionally break frame boundaries for depth and energy.
- **Aspect ratios:** 16:9 (standard video), 9:16 (stories/reels), 1:1 (social) all represented.
- **Border/matte framing:** Thin black borders or letterbox mattes add cinematic polish.

---

## 4. Animation Principles

### Motion Vocabulary

| Technique | Priority | Description |
|-----------|----------|-------------|
| **Kinetic typography** | ★★★★★ | Core technique. Words slam, snap, slide, scale into frame. |
| **Hard smash cuts** | ★★★★★ | Sharp, aggressive transitions between type frames. No soft fades. |
| **Fill ↔ Outline toggle** | ★★★★☆ | Text alternates between solid and outlined states. |
| **Weight animation** | ★★★★☆ | Variable font or swap — thin→bold or bold→thin transitions. |
| **Vertical/horizontal wipes** | ★★★☆☆ | Clean directional reveals. |
| **Scale punch** | ★★★☆☆ | Elements scale from 0→100% (or 200%→100%) with overshoot. |
| **Organic blob morphing** | ★★☆☆☆ | Fluid, amorphous shapes as masks or transitions. |
| **Dot/particle reveals** | ★★☆☆☆ | Single point expands into full content. |
| **3D extrusion** | ★★☆☆☆ | Subtle depth on type via shadow/extrusion layer. |
| **Stretch/distortion** | ★★☆☆☆ | Letterforms physically stretch to illustrate meaning. |

### Easing & Timing

- **Easing:** Snappy ease-out with slight overshoot. Think `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **Hold frames:** Let key typography sit for 0.5–1s before transitioning. Give the viewer time to read.
- **Stagger:** When multiple elements enter, offset by 2–4 frames each.
- **Speed:** Fast entrances (4–8 frames), longer holds, fast exits. **Snap in, breathe, snap out.**
- **No slow fades.** This style is punchy, not gentle.

### Transition Patterns

1. **Smash cut** — hard cut between full-frame type cards
2. **Wipe reveal** — shape or color block wipes to reveal next frame
3. **Scale zoom** — zoom into a letter/element, which becomes the next scene
4. **Morph** — one word morphs into the next via shape interpolation

---

## 5. Texture & Finish

### Primary Finish: Matte Flat

- **Default is flat color** — no gradients on type, no drop shadows (unless 3D extrusion).
- **Solid fills** with hard edges dominate.

### Texture Overlays (Optional, Impactful)

| Texture | When to Use | Intensity |
|---------|-------------|-----------|
| **Film grain** | Dark backgrounds, aggressive/editorial tone | Subtle to moderate |
| **Scan lines / VHS artifacts** | Retro, punk, esports energy | Moderate |
| **Halftone dots** | Vintage, print-inspired | Sparse |
| **Hand-drawn strokes** | Playful, organic, sketch-adjacent | As illustration element |
| **Noise overlay** | Nearly always — adds subtle warmth to flat color | Very subtle (5–10% opacity) |

### Finish Rules

- **No glossy/shiny effects.** No lens flares, no metallic sheen.
- **No drop shadows** (except intentional 3D extrusion).
- **No bevels or emboss.** Ever.
- **Grain > smooth.** A slight noise overlay makes flat colors feel tactile rather than sterile.
- **Outlines should be uniform weight** (~2–4px), not tapered or calligraphic.

---

## 6. Do's and Don'ts

### ✅ DO

- **Use oversized, bold typography** as the primary visual element
- **Limit your palette** to 2–3 colors with extreme contrast
- **Alternate solid/outline type** for visual rhythm
- **Let text bleed off the frame** — embrace cropping
- **Use snappy, aggressive timing** — fast in, hold, fast out
- **Add subtle grain/noise** for warmth
- **Use registration marks, corner labels, and thin borders** for polish
- **Commit to a hierarchy** — one element dominates, everything else supports
- **Make typography do the work** — if the type is strong, you need nothing else
- **Use repetition** as a design device (same word stacked, repeated, varied treatment)

### ❌ DON'T

- Don't use more than 3 colors per composition
- Don't use thin/light type weights as your primary (only for intentional contrast)
- Don't use soft, slow fades or gentle easing — this style is punchy
- Don't add unnecessary illustration when type alone can carry the frame
- Don't use realistic textures (wood, marble, metal) on type
- Don't center everything with equal spacing — either commit to centered minimalism or full-bleed maximalism
- Don't use rounded/bubbly typefaces for the primary display (save for character/illustration work only)
- Don't over-animate — restraint with 1–2 strong moves per frame beats 10 weak ones
- Don't use gradients ON the type itself (gradients are for backgrounds only)
- Don't forget the hold frame — every piece of text needs reading time

---

## Quick Reference: The Formula

```
DARK BACKGROUND
+ MASSIVE BOLD CONDENSED ALL-CAPS TYPE
+ SOLID/OUTLINE ALTERNATION
+ 2-COLOR PALETTE (+ optional neon accent)
+ SNAP-IN ANIMATION WITH OVERSHOOT
+ SUBTLE GRAIN OVERLAY
+ HOLD → SMASH CUT → NEXT
= THIS STYLE ✓
```

---

## Mood Keywords

`aggressive` · `confident` · `editorial` · `punchy` · `high-contrast` · `typographic` · `modern` · `bold` · `kinetic` · `minimal-maximal` · `street` · `sport` · `brand-forward`

---

*Generated from 24 Pinterest board references. 2 GIF files exceeded analysis size limits but patterns were consistent across all analyzable images.*

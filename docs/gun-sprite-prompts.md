# Space Kings — First-person gun sprite prompt

Image-generation prompt for the **first-person blaster** seen in the bottom-right
of Planet Exploration and Ship Boarding scenes, in the same **retro 16-bit
pixel-art** style as the enemy sprites and backgrounds.

Sourced from the current procedural art in `js/ui.js` → `SK.UI.fpGunSVG()`: a
chrome/gunmetal energy blaster with a glowing cyan vertical core and lens,
gripped by two hands held up from the bottom of the frame.

---

## How to use

- **Canvas:** landscape, roughly **2:1** (e.g. **1024×512**) — matches the
  in-game viewBox (`600×300`). The gun is vertical and centered; arms spread
  toward the lower-left/lower-right corners.
- **Transparent background.** This is a foreground overlay sprite, not a scene
  background.
- **Don't bake in a muzzle flash or beam** — those are separate animated
  layers added by CSS (`.fp-flash`, `.fp-laser`) on top of the static art.
- Leave a bit of empty margin above the lens and outside the arms so the CSS
  rotation/positioning (`rotate(-25deg)`, anchored bottom-right) doesn't crop
  the weapon.
- Save as `assets/sprites/weapons/blaster.png` (new folder) once generated —
  happy to wire it in with an SVG fallback, same pattern as the enemy sprites
  and backgrounds.

**Shared style suffix** (already appended to the prompts below):

> *16-bit pixel-art game sprite, SNES/Sega-Genesis era, crisp clean pixels,
> bold dark outline, limited cohesive palette, dithered shading, subtle neon
> rim-light, centered, transparent background, no text or UI, bold readable
> silhouette.*

**Negative prompt:**

```
text, words, logo, watermark, UI, HUD, crosshair, health bar, face, helmet,
full body, background, scenery, room, sky, muzzle flash, fire, explosion,
blurry, soft gradients, antialiased edges, photorealistic, 3D render
```

---

## Prompt A (recommended) — gun only, no hands

Keeps the existing procedural hands (already tinted live to each captain's
skin tone) and swaps in real art for just the weapon body. Drop-in replacement
for the metal/energy parts of the current SVG.

```
A futuristic sci-fi energy blaster rifle, viewed head-on and upright, floating
with no hands or arms. A tall rounded gunmetal-chrome receiver body (cool
grey-blue brushed steel) with a vertical glowing cyan energy core/chamber
running up its center, topped by a round glowing cyan lens like a scope-eye
(white-hot center fading to deep blue rim, soft cyan glow halo behind it). A
smaller secondary sight module mounted on the right side of the receiver, a
dark vented slot on the front, and an angled dark-slate stock/grip below.
Symmetrical, weapon pointing straight up, bottom of the grip at the bottom
edge of the frame. 16-bit pixel-art game sprite, SNES/Sega-Genesis era, crisp
clean pixels, bold dark outline, limited cohesive palette, dithered shading,
subtle neon rim-light, centered, transparent background, no text or UI, bold
readable silhouette.
```

---

## Prompt B (alternative) — gun + gloved hands baked in

A complete, fixed art piece (no per-captain skin tint). Use this instead of
Prompt A if you'd rather have one finished image and drop the skin-tone
tinting feature for the gun.

```
First-person view of a futuristic sci-fi energy blaster rifle held upright in
two armored gloved hands, gripped from the bottom of the frame, weapon
pointing straight up, centered. Tall rounded gunmetal-chrome receiver body
with a vertical glowing cyan energy core and a round glowing cyan lens on top
(white-hot center, deep blue rim, soft glow halo). Small secondary sight
module on the right side of the receiver, dark angled stock below. Two
matte-dark armored gloves grip the weapon — one hand on the front grip near
the receiver, one further back near the stock — simple panel-line knuckle
detail, forearms cropped at the cuffs with a thin cyan accent band. No face,
no body, no muzzle flash, no background scenery. 16-bit pixel-art game
sprite, SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited
cohesive palette, dithered shading, subtle neon rim-light, centered,
transparent background, no text or UI, bold readable silhouette.
```

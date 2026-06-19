# Space Kings — Background generation prompts (Gemini / Imagen)

Backgrounds for **planet exploration** (one per biome) and **ship battles**
(one per enemy vessel), in the same **retro 16‑bit pixel‑art** style as the
enemy sprites.

---

## How to use

- **Aspect ratio:** set **9:16 (portrait)** in the tool (each prompt also says it).
- One scene per file, **opaque** (not transparent). Save as:
  - planets → `assets/backgrounds/planet/<slug>.png`
  - ships → `assets/backgrounds/ships/<slug>.png`
- **Composition matters** (so the gameplay overlays fit):
  - *Planets:* first‑person eye‑level, a **path receding to a horizon near the
    vertical middle**; keep the **lower third + bottom‑center open** (that's where
    enemies stand and your blaster sits) — **no characters, creatures, or weapons**.
  - *Ships:* open **deep space with a clear center** for the ships — **no ships, no UI**.

**Shared style line** (already appended to every prompt):
> *retro 16‑bit pixel art, SNES/Sega‑Genesis era, limited cohesive palette,
> dithered shading, atmospheric depth, no text, no UI, no HUD, no watermark,
> no characters, vertical 9:16 portrait background.*

**Negative prompt (if your tool supports one):**
```
text, words, logo, watermark, UI, HUD, health bar, people, character, creature,
spaceship, vehicle, weapon, hands, blurry, jpeg artifacts, photorealistic, 3D render
```

---

## 🪐 Planet biome backgrounds

### Jungle — `jungle`
```
Alien jungle world at night, first-person ground-level view. Deep blue starry sky with
a faint colorful holographic UFO; jagged snow-capped mountains on the horizon; lush
teal-and-green alien undergrowth; glowing violet bioluminescent mushrooms dotting both
sides; a glowing cyan crystalline stone path running from the foreground to the horizon
near the middle; lower third and bottom-center kept open. Palette: deep blue sky,
teal-green ground, magenta-purple glow, cyan path. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited cohesive palette, dithered shading, atmospheric depth,
no text, no UI, no characters, no weapons, vertical 9:16 portrait background.
```

### Volcanic — `volcanic`
```
Volcanic alien world, first-person ground-level view. Smouldering dark-red and
ember-orange sky with drifting ash; black basalt mountains veined with glowing lava on
the horizon; cracked obsidian ground with rivers of molten orange; glowing red-orange
spiny flora on the sides; a cracked lava-lit path of glowing stones leading to the
horizon near the middle; lower third and bottom-center kept open. Palette: ember
red/orange, black rock, molten-orange glow. Retro 16-bit pixel art, SNES/Sega-Genesis
era, limited cohesive palette, dithered shading, atmospheric depth, no text, no UI,
no characters, no weapons, vertical 9:16 portrait background.
```

### Frozen — `frozen`
```
Frozen alien tundra at dusk, first-person ground-level view. Pale icy-blue sky with
soft aurora ribbons and faint stars; tall white snow-capped peaks on the horizon; a
glittering pale-blue ice field; glowing blue ice crystals and shards flanking the route;
a smooth cyan ice path leading to the horizon near the middle; lower third and
bottom-center kept open. Palette: white and ice-blue, cyan glow. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited cohesive palette, dithered shading, atmospheric depth,
no text, no UI, no characters, no weapons, vertical 9:16 portrait background.
```

### Desert — `desert`
```
Alien desert at dusk, first-person ground-level view. Purple-and-orange gradient sky
with two faint moons; weathered sandstone mesas and buttes on the horizon; rolling ochre
sand dunes; alien cacti and small orange flowering plants on the sides; a cracked
sandstone path leading to the horizon near the middle; lower third and bottom-center kept
open. Palette: dusk purple-orange sky, ochre and tan sand, warm amber glow. Retro 16-bit
pixel art, SNES/Sega-Genesis era, limited cohesive palette, dithered shading, atmospheric
depth, no text, no UI, no characters, no weapons, vertical 9:16 portrait background.
```

### Toxic — `toxic`
```
Toxic alien wasteland, first-person ground-level view. Sickly yellow-green hazy sky;
jagged dark ridges on the horizon; cracked ground with bubbling acid-green pools;
mutated glowing-green fungus and twisted plants flanking the way; a glowing toxic-green
path leading to the horizon near the middle; lower third and bottom-center kept open.
Palette: acid green and dark olive, radioactive-green glow. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited cohesive palette, dithered shading, atmospheric depth,
no text, no UI, no characters, no weapons, vertical 9:16 portrait background.
```

### Crystal — `crystal`
```
Crystalline alien world at night, first-person ground-level view. Deep violet starry
sky; mountains of giant faceted crystals on the horizon; ground studded with glowing
magenta and cyan gem clusters; tall prismatic crystal formations flanking the path; a
luminous crystal path leading to the horizon near the middle; lower third and
bottom-center kept open. Palette: violet and magenta with cyan prismatic glow. Retro
16-bit pixel art, SNES/Sega-Genesis era, limited cohesive palette, dithered shading,
atmospheric depth, no text, no UI, no characters, no weapons, vertical 9:16 portrait background.
```

### Oceanic — `oceanic`
```
Alien ocean world at dusk, first-person ground-level view. Teal-blue sky with soft
clouds and faint stars; distant sea-cliff mountains on the horizon; shallow glowing
water and wet sand in the foreground; bioluminescent coral and kelp flanking the route;
a shimmering cyan water-channel path leading to the horizon near the middle; lower third
and bottom-center kept open. Palette: teal and deep blue, aqua glow. Retro 16-bit pixel
art, SNES/Sega-Genesis era, limited cohesive palette, dithered shading, atmospheric
depth, no text, no UI, no characters, no weapons, vertical 9:16 portrait background.
```

### Barren — `barren`
```
Barren rocky moon, first-person ground-level view. Muted grey-blue sky with a large pale
planet rising and scattered stars; bleak grey rocky mountains and craters on the horizon;
dusty grey rubble ground; sparse dull-blue glowing rock formations on the sides; a worn
stone path leading to the horizon near the middle; lower third and bottom-center kept
open. Palette: desaturated grey and slate-blue, faint cold glow. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited cohesive palette, dithered shading, atmospheric depth,
no text, no UI, no characters, no weapons, vertical 9:16 portrait background.
```

---

## 🚀 Ship‑battle space backgrounds (one per enemy vessel)

### Marauder — `marauder`
```
Pirate-raider ambush in deep space, first-person view. A dense belt of drifting rocky
asteroids and floating scrap debris, a dim rust-brown nebula, scattered stars, a small
distant planet; gritty scrappy mood; open clear space in the center for ships. Palette:
rusty browns and gunmetal with cyan engine-glow accents. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited cohesive palette, dithered starfield, atmospheric depth,
no text, no UI, no ships, no characters, vertical 9:16 portrait background.
```

### Frigate — `frigate`
```
Contested star-system patrol zone in deep space, first-person view. A bright blue-white
distant star, orderly drifting buoys and satellites, faint red warning beacons, crisp
stars, a distant ringed planet; tense military mood; open clear space in the center for
ships. Palette: steel-blue and slate with red trim accents. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited cohesive palette, dithered starfield, atmospheric depth,
no text, no UI, no ships, no characters, vertical 9:16 portrait background.
```

### Dreadnought — `dreadnought`
```
Looming siege near a giant world, first-person view in deep space. Dominated by a huge
ominous gas giant, smoky orange war-glow on the horizon, distant silhouettes of capital-
ship wreckage and debris, embers and haze; heavy foreboding mood; open clear space in the
center for ships. Palette: dark gunmetal and ominous orange glow. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited cohesive palette, dithered starfield, atmospheric depth,
no text, no UI, no ships, no characters, vertical 9:16 portrait background.
```

### Corsair — `corsair`
```
High-speed raid through a crimson nebula, first-person view in deep space. A vivid
red-and-magenta nebula, streaking motion-blurred starlight suggesting great speed, a
blood-red distant sun; sleek aggressive predatory mood; open clear space in the center
for ships. Palette: black and crimson with hot-orange streak accents. Retro 16-bit pixel
art, SNES/Sega-Genesis era, limited cohesive palette, dithered starfield, atmospheric
depth, no text, no UI, no ships, no characters, vertical 9:16 portrait background.
```

### Reaver — `reaver`
```
Scavenger raid in a ship graveyard, first-person view in deep space. Drifting broken
derelict hulls and twisted wreckage, a toxic-green nebula, eerie green fog, cold distant
stars; menacing decayed mood; open clear space in the center for ships. Palette: scorched
dark metal and toxic-green glow. Retro 16-bit pixel art, SNES/Sega-Genesis era, limited
cohesive palette, dithered starfield, atmospheric depth, no text, no UI, no ships, no
characters, vertical 9:16 portrait background.
```

---

## Slugs

| Group | Slugs |
|---|---|
| Planet biomes | `jungle`, `volcanic`, `frozen`, `desert`, `toxic`, `crystal`, `oceanic`, `barren` |
| Ship vessels | `marauder`, `frigate`, `dreadnought`, `corsair`, `reaver` |

> When the images are ready I can wire them in (like the sprites): the planet
> background per biome and the space backdrop per enemy vessel, layered behind the
> path/gun and the ship — with the current SVG scenes as the fallback.

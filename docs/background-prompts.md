# Space Kings — Background generation prompts (Gemini / Imagen)

Backgrounds for **planet exploration** (one per biome), **ship battles** (one per
enemy vessel) and **boarding corridors** (one per enemy vessel), in the same
**retro 16‑bit pixel‑art** style as the enemy sprites.

---

## How to use

- **Aspect ratio:** set **9:16 (portrait)** in the tool (each prompt also says it).
- One scene per file, **opaque** (not transparent).
- **All backgrounds live in one folder with unique, self‑describing names:**
  - planets → `assets/backgrounds/planet-<biome>.png`
  - ship space → `assets/backgrounds/space-<vessel>.png`
  - boarding corridor → `assets/backgrounds/corridor-<vessel>.png`
  - (these are deliberately **distinct from the sprite filenames** in `assets/sprites/`)
- **Composition matters** (so the gameplay overlays fit):
  - *Planets:* first‑person eye‑level, a **path receding to a horizon near the
    vertical middle**; keep the **lower third + bottom‑center open** (enemies + blaster) — **no characters, creatures, weapons**.
  - *Ships:* open **deep space with a clear center** for the ships — **no ships, no UI**.
  - *Corridors:* first‑person **one‑point perspective down a ship hallway** to a closed
    bulkhead door; keep the **lower third + bottom‑center open** — **no characters, no weapons**.

**Negative prompt (if your tool supports one):**
```
text, words, logo, watermark, UI, HUD, health bar, people, character, creature,
spaceship, vehicle, weapon, hands, UFO, flying saucer, blurry, jpeg artifacts,
photorealistic, 3D render
```

---

## 🪐 Planet biome backgrounds

### Jungle — `planet-jungle.png`
```
Alien jungle world at night, first-person ground-level view. Deep blue starry sky; jagged
snow-capped mountains on the horizon; lush teal-and-green alien undergrowth; glowing violet
bioluminescent mushrooms on both sides; a glowing cyan crystalline stone path from the
foreground to the horizon near the middle; lower third and bottom-center kept open. Palette:
deep blue sky, teal-green ground, magenta-purple glow, cyan path. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited palette, dithered shading, no text, no UI, no characters,
no weapons, vertical 9:16 portrait background.
```

### Volcanic — `planet-volcanic.png`
```
Volcanic alien world, first-person ground-level view. Smouldering dark-red and ember-orange
sky with drifting ash; black basalt mountains veined with glowing lava on the horizon;
cracked obsidian ground with rivers of molten orange; glowing red-orange spiny flora on the
sides; a cracked lava-lit stone path to the horizon near the middle; lower third and
bottom-center kept open. Palette: ember red/orange, black rock, molten-orange glow. Retro
16-bit pixel art, SNES/Sega-Genesis era, limited palette, dithered shading, no text, no UI,
no characters, no weapons, vertical 9:16 portrait background.
```

### Frozen — `planet-frozen.png`
```
Frozen alien tundra at dusk, first-person ground-level view. Pale icy-blue sky with soft
aurora ribbons and faint stars; tall white snow-capped peaks on the horizon; a glittering
pale-blue ice field; glowing blue ice crystals and shards flanking the route; a smooth cyan
ice path to the horizon near the middle; lower third and bottom-center kept open. Palette:
white and ice-blue, cyan glow. Retro 16-bit pixel art, SNES/Sega-Genesis era, limited
palette, dithered shading, no text, no UI, no characters, no weapons, vertical 9:16 portrait
background.
```

### Desert — `planet-desert.png`
```
Alien desert at dusk, first-person ground-level view. Purple-and-orange gradient sky with
two faint moons; weathered sandstone mesas and buttes on the horizon; rolling ochre sand
dunes; alien cacti and small orange flowering plants on the sides; a cracked sandstone path
to the horizon near the middle; lower third and bottom-center kept open. Palette: dusk
purple-orange sky, ochre and tan sand, warm amber glow. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited palette, dithered shading, no text, no UI, no characters,
no weapons, vertical 9:16 portrait background.
```

### Toxic — `planet-toxic.png`
```
Toxic alien wasteland, first-person ground-level view. Sickly yellow-green hazy sky; jagged
dark ridges on the horizon; cracked ground with bubbling acid-green pools; mutated
glowing-green fungus and twisted plants flanking the way; a glowing toxic-green path to the
horizon near the middle; lower third and bottom-center kept open. Palette: acid green and
dark olive, radioactive-green glow. Retro 16-bit pixel art, SNES/Sega-Genesis era, limited
palette, dithered shading, no text, no UI, no characters, no weapons, vertical 9:16 portrait
background.
```

### Crystal — `planet-crystal.png`
```
Crystalline alien world at night, first-person ground-level view. Deep violet starry sky;
mountains of giant faceted crystals on the horizon; ground studded with glowing magenta and
cyan gem clusters; tall prismatic crystal formations flanking the path; a luminous crystal
path to the horizon near the middle; lower third and bottom-center kept open. Palette:
violet and magenta with cyan prismatic glow. Retro 16-bit pixel art, SNES/Sega-Genesis era,
limited palette, dithered shading, no text, no UI, no characters, no weapons, vertical 9:16
portrait background.
```

### Oceanic — `planet-oceanic.png`
```
Alien ocean world at dusk, first-person ground-level view. Teal-blue sky with soft clouds
and faint stars; distant sea-cliff mountains on the horizon; shallow glowing water and wet
sand in the foreground; bioluminescent coral and kelp flanking the route; a shimmering cyan
water-channel path to the horizon near the middle; lower third and bottom-center kept open.
Palette: teal and deep blue, aqua glow. Retro 16-bit pixel art, SNES/Sega-Genesis era,
limited palette, dithered shading, no text, no UI, no characters, no weapons, vertical 9:16
portrait background.
```

### Barren — `planet-barren.png`
```
Barren rocky moon, first-person ground-level view. Muted grey-blue sky with a large pale
planet rising and scattered stars; bleak grey rocky mountains and craters on the horizon;
dusty grey rubble ground; sparse dull-blue glowing rock formations on the sides; a worn
stone path to the horizon near the middle; lower third and bottom-center kept open. Palette:
desaturated grey and slate-blue, faint cold glow. Retro 16-bit pixel art, SNES/Sega-Genesis
era, limited palette, dithered shading, no text, no UI, no characters, no weapons, vertical
9:16 portrait background.
```

---

## 🚀 Ship‑battle (space) backgrounds — one per enemy vessel

### Marauder — `space-marauder.png`
```
Pirate-raider ambush in deep space, first-person view. A dense belt of drifting rocky
asteroids and floating scrap debris, a dim rust-brown nebula, scattered stars, a small
distant planet; gritty scrappy mood; open clear space in the center for ships. Palette:
rusty browns and gunmetal with cyan engine-glow accents. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited palette, dithered starfield, no text, no UI, no ships,
no characters, vertical 9:16 portrait background.
```

### Frigate — `space-frigate.png`
```
Contested star-system patrol zone in deep space, first-person view. A bright blue-white
distant star, orderly drifting buoys and satellites, faint red warning beacons, crisp stars,
a distant ringed planet; tense military mood; open clear space in the center for ships.
Palette: steel-blue and slate with red trim accents. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited palette, dithered starfield, no text, no UI, no ships,
no characters, vertical 9:16 portrait background.
```

### Dreadnought — `space-dreadnought.png`
```
Looming siege near a giant world, first-person view in deep space. Dominated by a huge
ominous gas giant, smoky orange war-glow on the horizon, distant silhouettes of capital-ship
wreckage and debris, embers and haze; heavy foreboding mood; open clear space in the center
for ships. Palette: dark gunmetal and ominous orange glow. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited palette, dithered starfield, no text, no UI, no ships,
no characters, vertical 9:16 portrait background.
```

### Corsair — `space-corsair.png`
```
High-speed raid through a crimson nebula, first-person view in deep space. A vivid
red-and-magenta nebula, streaking motion-blurred starlight suggesting great speed, a
blood-red distant sun; sleek aggressive predatory mood; open clear space in the center for
ships. Palette: black and crimson with hot-orange streak accents. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited palette, dithered starfield, no text, no UI, no ships,
no characters, vertical 9:16 portrait background.
```

### Reaver — `space-reaver.png`
```
Scavenger raid in a ship graveyard, first-person view in deep space. Drifting broken
derelict hulls and twisted wreckage, a toxic-green nebula, eerie green fog, cold distant
stars; menacing decayed mood; open clear space in the center for ships. Palette: scorched
dark metal and toxic-green glow. Retro 16-bit pixel art, SNES/Sega-Genesis era, limited
palette, dithered starfield, no text, no UI, no ships, no characters, vertical 9:16 portrait
background.
```

---

## 🚪 Boarding corridors — one per enemy vessel

### Marauder — `corridor-marauder.png`
```
Interior corridor of a scrappy pirate raider, first-person one-point-perspective view down
the hallway toward a closed bulkhead door at the far end. Mismatched welded scrap-metal wall
plates, exposed wiring and pipes, rust streaks, scattered crates, flickering dim lights;
gritty makeshift mood; cyan emergency strip-lights along the metal floor, a small star-lit
viewport in the far door; lower third and bottom-center kept open. Palette: rusty browns and
gunmetal with cyan glow. Retro 16-bit pixel art, SNES/Sega-Genesis era, limited palette,
dithered shading, deep interior perspective, no text, no UI, no characters, no weapons,
vertical 9:16 portrait background.
```

### Frigate — `corridor-frigate.png`
```
Interior corridor of a military frigate, first-person one-point-perspective view down the
hallway toward a reinforced bulkhead door at the far end. Clean riveted steel panels,
recessed ceiling lights, numbered hatches along the sides, pulsing red alert strips;
disciplined tense mood; metal floor leading away; lower third and bottom-center kept open.
Palette: steel-blue and slate with red alert accents. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited palette, dithered shading, deep interior perspective, no text,
no UI, no characters, no weapons, vertical 9:16 portrait background.
```

### Dreadnought — `corridor-dreadnought.png`
```
Interior corridor of a massive dreadnought, first-person one-point-perspective view down a
cavernous hallway toward a huge blast door at the far end. Towering industrial bulkheads,
thick armored ribs, heavy machinery and cables overhead, deep shadows; oppressive scale,
foreboding mood; ominous orange work-lights along the floor; lower third and bottom-center
kept open. Palette: dark gunmetal with ominous orange glow. Retro 16-bit pixel art,
SNES/Sega-Genesis era, limited palette, dithered shading, deep interior perspective, no text,
no UI, no characters, no weapons, vertical 9:16 portrait background.
```

### Corsair — `corridor-corsair.png`
```
Interior corridor of a sleek corsair attack ship, first-person one-point-perspective view
down the hallway toward a sleek bulkhead door at the far end. Smooth black wall panels with
sharp angular trim, neon-crimson light strips, polished dark floor, minimalist; fast and
predatory mood; the far door glowing red; lower third and bottom-center kept open. Palette:
black and crimson with hot-red neon accents. Retro 16-bit pixel art, SNES/Sega-Genesis era,
limited palette, dithered shading, deep interior perspective, no text, no UI, no characters,
no weapons, vertical 9:16 portrait background.
```

### Reaver — `corridor-reaver.png`
```
Interior corridor of a derelict scavenger reaver, first-person one-point-perspective view
down a damaged hallway toward a battered bulkhead door at the far end. Broken and torn wall
panels, dangling cables and sparks, scattered wreckage and grime, drifting haze; eerie
decayed mood; sickly toxic-green emergency lighting along the floor; lower third and
bottom-center kept open. Palette: scorched dark metal with toxic-green glow. Retro 16-bit
pixel art, SNES/Sega-Genesis era, limited palette, dithered shading, deep interior
perspective, no text, no UI, no characters, no weapons, vertical 9:16 portrait background.
```

---

## Filenames (all in `assets/backgrounds/`)

| Group | Files |
|---|---|
| Planets | `planet-jungle.png` · `planet-volcanic.png` · `planet-frozen.png` · `planet-desert.png` · `planet-toxic.png` · `planet-crystal.png` · `planet-oceanic.png` · `planet-barren.png` |
| Ship (space) | `space-marauder.png` · `space-frigate.png` · `space-dreadnought.png` · `space-corsair.png` · `space-reaver.png` |
| Corridors | `corridor-marauder.png` · `corridor-frigate.png` · `corridor-dreadnought.png` · `corridor-corsair.png` · `corridor-reaver.png` |

**18 backgrounds total** — 8 planets, 5 ship-space, 5 corridors.

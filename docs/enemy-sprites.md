# Space Kings — Enemy & Boss Sprite Prompts

Image-generation prompts for every enemy, boss, and enemy vessel in the game,
all in a consistent **retro 16‑bit pixel‑art** style (SNES / Sega Genesis era).

The roster is sourced from `js/data.js` → `SK.ENEMY_POOLS`.

---

## How to use

- Each entry below is a **ready‑to‑paste prompt** — it already includes the
  shared style suffix, so you can copy a single block straight into your image
  generator (Stable Diffusion, Midjourney, DALL·E, etc.).
- Generate on a **transparent background**, then drop the PNGs into
  `assets/sprites/<group>/<slug>.png` (suggested slugs are listed per section).
- Keep one **shared palette discipline** so the set looks cohesive:
  - **Planet creatures** → alien/organic, dark base + one neon bio‑glow accent.
  - **Ship crew & captains** → grimy industrial metal, red/amber hazard accents.
  - **Vessels** → metallic hull plating + a single glowing engine color.
- Suggested sizes: **minions ≈ 64×64**, **bosses ≈ 112×112**, **vessels ≈ 96×64**
  (Dreadnought larger). Sprites face the viewer (first‑person combat); ships are
  drawn in side profile.

**Recommended negative prompt (for SD‑style tools):**

```
blurry, soft gradients, antialiased edges, 3D render, photorealistic, text, watermark,
signature, UI, health bar, frame, border, extra limbs, cropped, busy background
```

**Midjourney tip:** append `--style raw --ar 1:1` (creatures) or `--ar 3:2` (ships),
and add `pixel art, no anti-aliasing` to keep hard pixels.

**Shared style suffix** (already appended to every prompt below):

> *16‑bit pixel‑art game sprite, SNES/Sega‑Genesis era, crisp clean pixels, bold
> dark outline, limited cohesive palette, dithered shading, subtle neon rim‑light,
> centered, full body, transparent background, no text or UI, bold readable
> silhouette.*

---

## 🪐 Planet Exploration — Minions  (≈64×64)

Slugs → `assets/sprites/planet/`

### Void Crawler 🕷️ — `void-crawler`
```
A menacing alien spider creature, the Void Crawler: eight spindly barbed legs, a
sleek dark carapace flecked with tiny starlight specks, a cluster of glowing violet
eyes and dripping mandibles, low predatory crouch. Palette deep void-purple and
black with magenta glow. 16-bit pixel-art game sprite, SNES/Sega-Genesis era, crisp
clean pixels, bold dark outline, limited cohesive palette, dithered shading, subtle
neon rim-light, centered, full body, front 3/4 view facing the viewer, transparent
background, no text, bold readable silhouette.
```

### Rock Golem 🪨 — `rock-golem`
```
A hulking golem of jagged interlocking stone and ore, the Rock Golem: massive boulder
fists, a craggy blocky body, deep cracks glowing with molten amber energy, mossy
patches. Palette slate grey and brown with amber glowing seams. 16-bit pixel-art game
sprite, SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited cohesive
palette, dithered shading, subtle neon rim-light, centered, full body, front 3/4 view
facing the viewer, transparent background, no text, bold readable silhouette.
```

### Plasma Wraith 👻 — `plasma-wraith`
```
A ghostly hovering specter of crackling plasma, the Plasma Wraith: translucent flowing
energy body with no legs, hollow glowing eyes, wispy electric tendrils trailing, a
white-hot core. Palette electric cyan and pale blue with white-hot center. 16-bit
pixel-art game sprite, SNES/Sega-Genesis era, crisp clean pixels, bold dark outline,
limited cohesive palette, dithered shading, subtle neon rim-light, centered, full body,
front 3/4 view facing the viewer, transparent background, no text, bold readable silhouette.
```

### Sand Stalker 🦎 — `sand-stalker`
```
A desert reptilian predator, the Sand Stalker: a lean four-legged lizard with sandy
armored scales, a row of dorsal spines and fins, a whipping tail, slit amber eyes,
dust-caked claws, stalking pose. Palette ochre, tan and rust with amber eyes. 16-bit
pixel-art game sprite, SNES/Sega-Genesis era, crisp clean pixels, bold dark outline,
limited cohesive palette, dithered shading, subtle neon rim-light, centered, full body,
front 3/4 view facing the viewer, transparent background, no text, bold readable silhouette.
```

### Hive Drone 🐝 — `hive-drone`
```
An insectoid alien hive drone: a chitinous armored body, four translucent buzzing wings,
a segmented thorax, bladed forelimbs and a glowing stinger, aggressive hover. Palette
amber-yellow and black chitin with green bio-glow. 16-bit pixel-art game sprite,
SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited cohesive palette,
dithered shading, subtle neon rim-light, centered, full body, front 3/4 view facing the
viewer, transparent background, no text, bold readable silhouette.
```

### Frost Beast 🐻‍❄️ — `frost-beast`
```
A shaggy bipedal ice beast, the Frost Beast: thick frost-rimed white-blue fur, jagged
ice-shard claws, frozen breath, glowing pale-blue eyes, a roaring stance. Palette white
and ice-blue with cyan glow. 16-bit pixel-art game sprite, SNES/Sega-Genesis era, crisp
clean pixels, bold dark outline, limited cohesive palette, dithered shading, subtle neon
rim-light, centered, full body, front 3/4 view facing the viewer, transparent background,
no text, bold readable silhouette.
```

### Spore Fiend 🍄 — `spore-fiend`
```
A fungal humanoid creature, the Spore Fiend: a glowing mushroom-cap head, gnarled
bark-and-fungus limbs, clusters of bioluminescent spore pods, drifting glowing spores.
Palette deep purple cap with teal-green bioluminescence. 16-bit pixel-art game sprite,
SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited cohesive palette,
dithered shading, subtle neon rim-light, centered, full body, front 3/4 view facing the
viewer, transparent background, no text, bold readable silhouette.
```

### Scrap Hound 🐕 — `scrap-hound`
```
A four-legged robotic hound welded from salvaged scrap, the Scrap Hound: mismatched
metal plating, exposed wires and hydraulic pistons, a single glowing red optic, antenna
ears, bared metal teeth, snarling. Palette rusty steel and gunmetal with red optic glow.
16-bit pixel-art game sprite, SNES/Sega-Genesis era, crisp clean pixels, bold dark
outline, limited cohesive palette, dithered shading, subtle neon rim-light, centered,
full body, front 3/4 view facing the viewer, transparent background, no text, bold
readable silhouette.
```

---

## 🪐 Planet Exploration — Bosses  (≈112×112)

Slugs → `assets/sprites/planet-boss/`

### Ancient Sentinel 🗿 — `ancient-sentinel`
```
A towering ancient stone guardian, the Ancient Sentinel, BOSS: a monolithic carved-statue
body covered in glowing alien runes, a single great central eye, broken floating segments
held together by energy, weathered and imposing. Palette stone grey with glowing turquoise
runes. Large detailed boss. 16-bit pixel-art game sprite, SNES/Sega-Genesis era, crisp
clean pixels, bold dark outline, limited cohesive palette, dithered shading, subtle neon
rim-light, centered, full body, front view facing the viewer, transparent background, no
text, bold readable silhouette.
```

### Hive Queen 🐛 — `hive-queen`
```
A massive insectoid Hive Queen, BOSS: a bloated segmented egg-laying abdomen, multiple
bladed limbs, a crowned chitin head, dripping ichor, regal and grotesque. Palette sickly
green and amber chitin with purple glow. Large detailed boss. 16-bit pixel-art game sprite,
SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited cohesive palette,
dithered shading, subtle neon rim-light, centered, full body, front view facing the viewer,
transparent background, no text, bold readable silhouette.
```

### Magma Titan 🌋 — `magma-titan`
```
A colossal molten lava giant, the Magma Titan, BOSS: cracked obsidian-rock skin with
rivers of glowing magma, huge fists of molten stone, ember sparks and rising smoke,
thunderous stance. Palette black rock with bright orange-red molten glow. Large detailed
boss. 16-bit pixel-art game sprite, SNES/Sega-Genesis era, crisp clean pixels, bold dark
outline, limited cohesive palette, dithered shading, subtle neon rim-light, centered, full
body, front view facing the viewer, transparent background, no text, bold readable silhouette.
```

### Void Devourer 🦑 — `void-devourer`
```
A giant cosmic kraken, the Void Devourer, BOSS: a massive tentacled dark-matter squid, a
gaping glowing maw lined with teeth, a swirling starfield visible inside its translucent
body, writhing tentacles. Palette deep indigo and black with magenta and cyan cosmic glow.
Large detailed boss. 16-bit pixel-art game sprite, SNES/Sega-Genesis era, crisp clean
pixels, bold dark outline, limited cohesive palette, dithered shading, subtle neon
rim-light, centered, full body, front view facing the viewer, transparent background, no
text, bold readable silhouette.
```

### Crystal Behemoth 💎 — `crystal-behemoth`
```
A huge crystalline monster, the Crystal Behemoth, BOSS: a body of faceted glowing gemstone
shards, prismatic refracting light, heavy crystal limbs, a bright glowing core in its chest.
Palette aquamarine and violet crystal with prismatic highlights. Large detailed boss. 16-bit
pixel-art game sprite, SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited
cohesive palette, dithered shading, subtle neon rim-light, centered, full body, front view
facing the viewer, transparent background, no text, bold readable silhouette.
```

---

## 🛸 Ship Battle — Crew (Boarding) Minions  (≈64×64)

Slugs → `assets/sprites/ship-crew/`

### Pirate Raider 🏴‍☠️ — `pirate-raider`
```
A space pirate raider: a human boarder in patched vacuum-suit armor, a tattered red
bandana/scarf, a cracked helmet visor, gripping a battered laser pistol, a bandolier of
energy cells. Palette grimy browns and steel with red accents. 16-bit pixel-art game sprite,
SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited cohesive palette,
dithered shading, subtle neon rim-light, centered, full body, front 3/4 view facing the
viewer, transparent background, no text, bold readable silhouette.
```

### Battle Droid 🤖 — `battle-droid`
```
A humanoid combat droid, the Battle Droid: worn riveted armor plating, exposed servo joints,
a single glowing red optic on a blocky head, holding a blaster carbine, stiff military stance.
Palette gunmetal and olive plating with red optic glow. 16-bit pixel-art game sprite,
SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited cohesive palette,
dithered shading, subtle neon rim-light, centered, full body, front 3/4 view facing the
viewer, transparent background, no text, bold readable silhouette.
```

### Mercenary 💂 — `mercenary`
```
An armored sci-fi mercenary soldier: heavy modular combat armor and a helmet with a glowing
visor, shoulder pauldrons, gripping a bullpup energy rifle, ready stance. Palette dark
tactical grey and teal with cyan visor glow. 16-bit pixel-art game sprite, SNES/Sega-Genesis
era, crisp clean pixels, bold dark outline, limited cohesive palette, dithered shading,
subtle neon rim-light, centered, full body, front 3/4 view facing the viewer, transparent
background, no text, bold readable silhouette.
```

### Cyber Brute 👹 — `cyber-brute`
```
A hulking cybernetic enforcer, the Cyber Brute: massive augmented muscles, a riveted metal
jaw and a chrome cybernetic arm, glowing red eyes, scarred flesh, clenched fists, intimidating
hunch. Palette pale scarred flesh and chrome augments with red glow. 16-bit pixel-art game
sprite, SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited cohesive palette,
dithered shading, subtle neon rim-light, centered, full body, front 3/4 view facing the viewer,
transparent background, no text, bold readable silhouette.
```

### Boarding Drone 🛠️ — `boarding-drone`  (small ≈48×48)
```
A small floating combat/maintenance drone, the Boarding Drone: a spherical riveted chassis,
a single camera eye, an articulated tool-claw and a cutting-torch arm, small hover thrusters.
Palette yellow-and-black hazard plating with a cyan sensor glow. 16-bit pixel-art game sprite,
SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited cohesive palette,
dithered shading, subtle neon rim-light, centered, transparent background, no text, bold
readable silhouette.
```

---

## 🛸 Ship Battle — Pirate Captains (Boarding Bosses)  (≈112×112)

Slugs → `assets/sprites/ship-boss/`

### Captain Blackhole ☠️ — `captain-blackhole`
```
A menacing space pirate captain, Captain Blackhole, BOSS: a long dark coat, a skull-emblem
helm, a gauntlet channeling a swirling miniature black hole, commanding stance, glowing
event-horizon weapon. Palette black and gunmetal with purple gravity-glow. Large detailed
boss. 16-bit pixel-art game sprite, SNES/Sega-Genesis era, crisp clean pixels, bold dark
outline, limited cohesive palette, dithered shading, subtle neon rim-light, centered, full
body, front view facing the viewer, transparent background, no text, bold readable silhouette.
```

### Warlord Vex 😈 — `warlord-vex`
```
A demonic alien warlord, Warlord Vex, BOSS: a red-skinned horned humanoid in ornate spiked
battle armor, glowing eyes, wielding a jagged energy blade, a menacing grin. Palette crimson
and obsidian armor with orange glow. Large detailed boss. 16-bit pixel-art game sprite,
SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited cohesive palette,
dithered shading, subtle neon rim-light, centered, full body, front view facing the viewer,
transparent background, no text, bold readable silhouette.
```

### Admiral Rust 🦾 — `admiral-rust`
```
A grizzled cyborg admiral, Admiral Rust, BOSS: a tattered military greatcoat with medals, a
heavy rusted augmetic arm, a cybernetic eye, a peaked officer's cap, a scarred face,
commanding posture. Palette rusted iron and faded navy-blue coat with an amber eye glow.
Large detailed boss. 16-bit pixel-art game sprite, SNES/Sega-Genesis era, crisp clean pixels,
bold dark outline, limited cohesive palette, dithered shading, subtle neon rim-light, centered,
full body, front view facing the viewer, transparent background, no text, bold readable silhouette.
```

### Dread Corsair 🦹 — `dread-corsair`
```
A cloaked rogue pirate captain, the Dread Corsair, BOSS: a flowing dark hooded cape, a smooth
featureless mask with glowing slit eyes, dual plasma pistols drawn, an agile menacing pose.
Palette charcoal and deep teal with electric-green glow. Large detailed boss. 16-bit pixel-art
game sprite, SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited cohesive
palette, dithered shading, subtle neon rim-light, centered, full body, front view facing the
viewer, transparent background, no text, bold readable silhouette.
```

---

## 🚀 Enemy Vessels (Ship‑vs‑Ship)  (side profile, ≈96×64)

Slugs → `assets/sprites/ships/`

### Marauder 🛸 — `marauder`
```
A small agile pirate raider ship, the Marauder: a saucer-and-fuselage hull with welded scrap
armor plates, side-mounted blaster pods, a glowing rear thruster, scrappy and asymmetric, side
profile. Palette rusty hull plating with cyan engine glow. 16-bit pixel-art spaceship sprite,
SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited palette, dithered metal
shading, glowing engine, side-view profile, centered, transparent background, no text, bold
readable silhouette.
```

### Frigate 🚀 — `frigate`
```
A mid-size warship, the Frigate: an angular armored hull, forward cannon turrets, a bridge
tower, twin engines, sleek but military, side profile. Palette steel-grey hull with red trim
and blue engine glow. 16-bit pixel-art spaceship sprite, SNES/Sega-Genesis era, crisp clean
pixels, bold dark outline, limited palette, dithered metal shading, glowing engine, side-view
profile, centered, transparent background, no text, bold readable silhouette.
```

### Dreadnought 🛰️ — `dreadnought`  (large ≈128×72)
```
A massive heavily-armored battleship, the Dreadnought: a long bulky hull bristling with cannon
batteries, antennae and layered armor, a huge engine block, imposing, side profile. Palette dark
gunmetal with orange running lights and engine glow. 16-bit pixel-art spaceship sprite,
SNES/Sega-Genesis era, crisp clean pixels, bold dark outline, limited palette, dithered metal
shading, glowing engine, side-view profile, centered, transparent background, no text, bold
readable silhouette.
```

### Corsair 🦅 — `corsair`
```
A sleek fast attack craft, the Corsair: a raptor-like swept-wing hull, a sharp nose, twin
afterburner engines, predatory aggressive lines, side profile. Palette black and crimson with
bright orange engine glow. 16-bit pixel-art spaceship sprite, SNES/Sega-Genesis era, crisp clean
pixels, bold dark outline, limited palette, dithered metal shading, glowing engine, side-view
profile, centered, transparent background, no text, bold readable silhouette.
```

### Reaver 🛩️ — `reaver`
```
An aggressive jagged scavenger fighter, the Reaver: a spiked asymmetric hull with exposed weapon
spikes and welded-on claws, a menacing look, a glowing thruster, side profile. Palette dark
scorched metal with toxic-green glow. 16-bit pixel-art spaceship sprite, SNES/Sega-Genesis era,
crisp clean pixels, bold dark outline, limited palette, dithered metal shading, glowing engine,
side-view profile, centered, transparent background, no text, bold readable silhouette.
```

---

## Quick reference — slugs

| Group | Slugs |
|---|---|
| Planet minions | `void-crawler`, `rock-golem`, `plasma-wraith`, `sand-stalker`, `hive-drone`, `frost-beast`, `spore-fiend`, `scrap-hound` |
| Planet bosses | `ancient-sentinel`, `hive-queen`, `magma-titan`, `void-devourer`, `crystal-behemoth` |
| Ship crew | `pirate-raider`, `battle-droid`, `mercenary`, `cyber-brute`, `boarding-drone` |
| Ship captains | `captain-blackhole`, `warlord-vex`, `admiral-rust`, `dread-corsair` |
| Vessels | `marauder`, `frigate`, `dreadnought`, `corsair`, `reaver` |

**Totals:** 13 minions · 9 bosses · 5 vessels = **27 sprites**.

> When the sprites are ready, they can replace the emoji icons currently used in
> `js/data.js` (`SK.ENEMY_POOLS`) and `js/combat.js` (the `enemy-sprite` element).

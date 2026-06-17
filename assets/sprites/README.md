# Enemy sprites — drop them here

Drop the generated enemy/boss/vessel sprites into the subfolders below.
File **names must match the slug exactly** (lowercase, hyphenated) so they can be
wired up automatically later. Prompts for each are in
[`docs/enemy-sprites.md`](../../docs/enemy-sprites.md).

## Format
- **PNG, transparent background**, one sprite per file.
- Retro **16-bit pixel-art** style (see the prompt doc for the shared style).
- Suggested sizes: minions ≈ 64×64, bosses ≈ 112×112, vessels ≈ 96×64
  (Dreadnought larger). They'll be scaled to fit in-game, so exact size is flexible.

## Folders & expected filenames

### `planet/` — planet exploration minions
- `void-crawler.png`
- `rock-golem.png`
- `plasma-wraith.png`
- `sand-stalker.png`
- `hive-drone.png`
- `frost-beast.png`
- `spore-fiend.png`
- `scrap-hound.png`

### `planet-boss/` — planet bosses
- `ancient-sentinel.png`
- `hive-queen.png`
- `magma-titan.png`
- `void-devourer.png`
- `crystal-behemoth.png`

### `ship-crew/` — boarding crew minions
- `pirate-raider.png`
- `battle-droid.png`
- `mercenary.png`
- `cyber-brute.png`
- `boarding-drone.png`

### `ship-boss/` — pirate captains (boarding bosses)
- `captain-blackhole.png`
- `warlord-vex.png`
- `admiral-rust.png`
- `dread-corsair.png`

### `ships/` — enemy vessels (ship-vs-ship)
- `marauder.png`
- `frigate.png`
- `dreadnought.png`
- `corsair.png`
- `reaver.png`

---

**These are wired up and load automatically.** In combat the game looks for
`assets/sprites/<folder>/<slug>.png` for each enemy and shows it in place of the
emoji; if the file isn't there yet it quietly falls back to the emoji. So just
drop a correctly-named PNG in the right folder, commit, and it appears in-game —
no code changes needed.

(Mapping lives in `SK.ENEMY_FOLDER` / `SK.spritePath` in `js/core.js`; rendering
is in `js/combat.js`.)

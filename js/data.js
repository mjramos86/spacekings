/* ===================================================================
   SPACE KINGS — data.js
   Static game data: rarities, stats, slots, enemies, robots, cosmetics.
   Everything hangs off the global SK namespace.
   =================================================================== */
(function () {
  const SK = (window.SK = window.SK || {});

  /* ---------------- Rarities ---------------- */
  SK.RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary"];
  SK.RARITIES = {
    common:    { name: "Common",    color: "#9fb0c0", weight: 58, statMult: 1.0, bonusStats: 0, valueMult: 1 },
    uncommon:  { name: "Uncommon",  color: "#46e08a", weight: 26, statMult: 1.35, bonusStats: 1, valueMult: 2 },
    rare:      { name: "Rare",      color: "#3d9bff", weight: 11, statMult: 1.85, bonusStats: 2, valueMult: 4 },
    epic:      { name: "Epic",      color: "#b45cff", weight: 4,  statMult: 2.5,  bonusStats: 3, valueMult: 9 },
    legendary: { name: "Legendary", color: "#ffb020", weight: 1,  statMult: 3.4,  bonusStats: 4, valueMult: 20 },
  };

  /* ---------------- Character stats ---------------- */
  SK.CHAR_STAT_META = {
    hp:      { label: "Health",   icon: "❤️" },
    attack:  { label: "Attack",   icon: "⚔️" },
    defense: { label: "Defense",  icon: "🛡️" },
    speed:   { label: "Speed",    icon: "⚡" },
    crit:    { label: "Crit",     icon: "🎯", percent: true },
    critDmg: { label: "Crit Dmg", icon: "💥", percent: true },
    luck:    { label: "Luck",     icon: "🍀" },
  };
  // base unit used to scale generated gear
  SK.CHAR_STAT_UNIT = { hp: 38, attack: 8, defense: 6, speed: 4, crit: 4, critDmg: 12, luck: 5 };

  /* ---------------- Ship stats ---------------- */
  SK.SHIP_STAT_META = {
    hull:      { label: "Hull",      icon: "🚀" },
    shield:    { label: "Shield",    icon: "🔰" },
    weapon:    { label: "Weapons",   icon: "💠" },
    targeting: { label: "Targeting", icon: "🛰️", percent: true },
    engine:    { label: "Engines",   icon: "🔥" },
  };
  SK.SHIP_STAT_UNIT = { hull: 60, shield: 22, weapon: 9, targeting: 4, engine: 5 };

  /* ---------------- Equipment slots ---------------- */
  SK.CHAR_SLOTS = {
    weapon:    { label: "Weapon",    icon: "⚔️", primary: "attack",  secondaries: ["crit", "critDmg", "speed"], names: ["Blade", "Rifle", "Saber", "Cannon", "Lance", "Repeater"] },
    helmet:    { label: "Helmet",    icon: "⛑️", primary: "hp",      secondaries: ["defense", "crit", "luck"],   names: ["Visor", "Helm", "Hood", "Mask", "Crown"] },
    armor:     { label: "Armor",     icon: "🦺", primary: "defense", secondaries: ["hp", "speed"],               names: ["Plating", "Vest", "Carapace", "Exosuit", "Aegis"] },
    gloves:    { label: "Gloves",    icon: "🧤", primary: "crit",    secondaries: ["attack", "critDmg", "speed"],names: ["Gauntlets", "Grips", "Servos", "Talons"] },
    boots:     { label: "Boots",     icon: "🥾", primary: "speed",   secondaries: ["defense", "luck", "hp"],     names: ["Boots", "Greaves", "Thrusters", "Striders"] },
    accessory: { label: "Accessory", icon: "🔮", primary: "luck",    secondaries: ["critDmg", "crit", "hp"],     names: ["Implant", "Core", "Charm", "Sigil", "Module"] },
  };
  SK.SHIP_SLOTS = {
    primary:   { label: "Primary Wpn",  icon: "💠", primary: "weapon",    secondaries: ["targeting"],         names: ["Laser Array", "Railgun", "Plasma Lance", "Missile Bay", "Beam Cannon"] },
    shieldGen: { label: "Shield Gen",   icon: "🔰", primary: "shield",    secondaries: ["hull", "engine"],    names: ["Deflector", "Barrier Field", "Phase Shield", "Aegis Field"] },
    hullPlate: { label: "Hull Plating", icon: "🚀", primary: "hull",      secondaries: ["shield"],            names: ["Hull Plating", "Armor Belt", "Reinforced Frame", "Bulkhead"] },
    engine:    { label: "Engine",       icon: "🔥", primary: "engine",    secondaries: ["shield", "targeting"],names: ["Ion Drive", "Warp Coil", "Thruster Array", "Pulse Engine"] },
    targeting: { label: "Targeting",    icon: "🛰️", primary: "targeting", secondaries: ["weapon"],            names: ["Targeting Computer", "Sensor Suite", "Aim Core", "Fire Control"] },
    reactor:   { label: "Reactor",      icon: "⚛️", primary: "weapon",    secondaries: ["shield", "hull"],    names: ["Reactor Core", "Power Cell", "Fusion Core", "Antimatter Core"] },
  };

  /* ---------------- Name flavour ---------------- */
  SK.NAME_PREFIX = ["Quantum", "Plasma", "Ion", "Nova", "Stellar", "Void", "Solar", "Cryo", "Pulse", "Neutron", "Astral", "Photon", "Hyper", "Cosmic"];
  SK.NAME_SUFFIX = ["of the Nebula", "of the Void", "of Andromeda", "of the Comet", "of the Pulsar", "of Eternity"];

  /* ---------------- Enemies ---------------- */
  SK.ENEMY_POOLS = {
    planetMinion: [
      { name: "Void Crawler", icon: "🕷️" }, { name: "Rock Golem", icon: "🪨" },
      { name: "Plasma Wraith", icon: "👻" }, { name: "Sand Stalker", icon: "🦎" },
      { name: "Hive Drone", icon: "🐝" }, { name: "Frost Beast", icon: "🐻‍❄️" },
      { name: "Spore Fiend", icon: "🍄" }, { name: "Scrap Hound", icon: "🐕" },
    ],
    planetBoss: [
      { name: "Ancient Sentinel", icon: "🗿" }, { name: "Hive Queen", icon: "🐛" },
      { name: "Magma Titan", icon: "🌋" }, { name: "Void Devourer", icon: "🦑" },
      { name: "Crystal Behemoth", icon: "💎" },
    ],
    shipMinion: [
      { name: "Pirate Raider", icon: "🏴‍☠️" }, { name: "Battle Droid", icon: "🤖" },
      { name: "Mercenary", icon: "💂" }, { name: "Cyber Brute", icon: "👹" },
      { name: "Boarding Drone", icon: "🛠️" },
    ],
    shipBoss: [
      { name: "Captain Blackhole", icon: "☠️" }, { name: "Warlord Vex", icon: "😈" },
      { name: "Admiral Rust", icon: "🦾" }, { name: "Dread Corsair", icon: "🦹" },
    ],
    ships: [
      { name: "Marauder", icon: "🛸" }, { name: "Frigate", icon: "🚀" },
      { name: "Dreadnought", icon: "🛰️" }, { name: "Corsair", icon: "🦅" },
      { name: "Reaver", icon: "🛩️" },
    ],
  };

  /* ---------------- Planet & pirate flavour ---------------- */
  SK.PLANET_BIOMES = [
    { name: "Volcanic", icon: "🌋" }, { name: "Frozen", icon: "🧊" },
    { name: "Jungle", icon: "🌴" }, { name: "Desert", icon: "🏜️" },
    { name: "Toxic", icon: "☢️" }, { name: "Crystal", icon: "💎" },
    { name: "Oceanic", icon: "🌊" }, { name: "Barren", icon: "🪨" },
  ];
  SK.PLANET_NAMES = ["Xal", "Vroon", "Keth", "Auros", "Zenith", "Drell", "Myr", "Caldris", "Obex", "Tarsis", "Helix", "Nyx", "Orin", "Vael", "Pyra"];
  SK.PIRATE_SHIP_PREFIX = ["Black", "Red", "Iron", "Ghost", "Storm", "Blood", "Star", "Night", "Doom", "Razor"];
  SK.PIRATE_SHIP_SUFFIX = ["Fang", "Reaver", "Talon", "Maw", "Spectre", "Vandal", "Wraith", "Serpent", "Hydra"];

  /* ---------------- Robots ---------------- */
  // Robots assist during on-foot (character) combat by adding their stats.
  SK.ROBOT_CATALOG = [
    { key: "scout",  name: "Scout Bot",  icon: "🛰️", rarity: "common",    cost: 120,  stats: { speed: 6, hp: 30 } },
    { key: "gunner", name: "Gunner Bot", icon: "🔫", rarity: "uncommon",  cost: 320,  stats: { attack: 10, crit: 4 } },
    { key: "guard",  name: "Guard Bot",  icon: "🛡️", rarity: "uncommon",  cost: 340,  stats: { defense: 10, hp: 60 } },
    { key: "medic",  name: "Medic Bot",  icon: "💉", rarity: "rare",      cost: 700,  stats: { hp: 160, defense: 6 } },
    { key: "striker",name: "Striker Bot",icon: "⚡", rarity: "rare",      cost: 760,  stats: { attack: 18, critDmg: 30 } },
    { key: "lucky",  name: "Lucky Bot",  icon: "🍀", rarity: "epic",      cost: 1500, stats: { luck: 14, crit: 8 } },
    { key: "titan",  name: "Titan Bot",  icon: "🤖", rarity: "epic",      cost: 1900, stats: { attack: 16, defense: 14, hp: 120 } },
    { key: "omega",  name: "Omega Unit", icon: "🔱", rarity: "legendary", cost: 4200, stats: { attack: 28, defense: 18, hp: 220, crit: 8, critDmg: 40 } },
  ];
  SK.ROBOT_TEAM_SIZE = 3;

  /* ---------------- Appearance options ---------------- */
  SK.APPEARANCE = {
    sex: [{ key: "male", label: "Male" }, { key: "female", label: "Female" }],
    skin: ["#f1c27d", "#e0ac69", "#c68642", "#8d5524", "#5c3317", "#cdb4a0", "#9fd6a0", "#b4a0e0"],
    eyes: ["#4a90d9", "#3aa655", "#7a4a2b", "#6b6b6b", "#b0432f", "#7d3ac1", "#e0a020", "#27c2c2"],
    hair: ["#1a1a1a", "#4a2f1b", "#8a5a2b", "#c9a227", "#b0b0b0", "#d94f70", "#3a6fd9", "#36c2c2", "#9b59b6"],
  };

  /* ---------------- Planet surface palettes (one per biome) ---------------- */
  // sky[4] (top→horizon), ground[3], path[2], pathEdge, pathLine, mountain,
  // snow (or null), glow, cap[3], stem, spot, plant[2], horizonGlow
  SK.PLANET_PALETTES = {
    Jungle:   { sky:["#070a20","#0e1740","#1b2a63","#27619a"], ground:["#1c5a44","#123a30","#0b211c"], path:["#7fe9ff","#2a6f9e"], pathEdge:"#aef6ff", pathLine:"#0f3550", mountain:"#26365f", snow:"#cfe0ff", glow:"#b06bff", cap:["#c79bf2","#8a4fd0","#5a2f9a"], stem:"#d8c7e8", spot:"#ecdcff", plant:["#3aa66a","#2f8f5a"], horizonGlow:"#46c9e0" },
    Volcanic: { sky:["#1a0808","#3a1208","#5a1e10","#a83a18"], ground:["#3a1410","#240b0a","#160706"], path:["#ffc46a","#a83a12"], pathEdge:"#ffe0a0", pathLine:"#5a1606", mountain:"#3a2018", snow:null,      glow:"#ff6a2a", cap:["#ffb27a","#e8501e","#9a2a0e"], stem:"#e8c8a8", spot:"#ffe4c0", plant:["#c8401a","#e8701a"], horizonGlow:"#ff7a3a" },
    Frozen:   { sky:["#06122a","#0e2447","#1b3e6b","#3f78b0"], ground:["#7fa6c4","#4f7390","#2e4a66"], path:["#cfeeff","#6fb8e0"], pathEdge:"#ffffff", pathLine:"#2a4a66", mountain:"#4f6f99", snow:"#ffffff", glow:"#9fe0ff", cap:["#bfe9ff","#6fb8e8","#3a7ab0"], stem:"#dff4ff", spot:"#ffffff", plant:["#6fb8e0","#9fd0ee"], horizonGlow:"#9fe0ff" },
    Desert:   { sky:["#10081e","#2a1430","#5a2e3a","#b86a44"], ground:["#c9a86a","#9a7a44","#6b522c"], path:["#e8c98a","#a8823a"], pathEdge:"#ffe9b0", pathLine:"#6b4a1a", mountain:"#8a6a44", snow:null,      glow:"#ffb24a", cap:["#ffba6a","#d8843a","#9a5a1e"], stem:"#e8d8b0", spot:"#ffe9c0", plant:["#6aa84a","#4a8a3a"], horizonGlow:"#ffb24a" },
    Toxic:    { sky:["#0a1606","#16280a","#26401a","#5a7a2a"], ground:["#3a5a1e","#26400f","#16280a"], path:["#caff6a","#6a9a2a"], pathEdge:"#e8ffb0", pathLine:"#2a4a14", mountain:"#2a3a1a", snow:null,      glow:"#b6ff3a", cap:["#d6ff7a","#9ad83a","#5a8a1e"], stem:"#d8e8b0", spot:"#eaffc0", plant:["#6a9a2a","#9ad83a"], horizonGlow:"#b6ff3a" },
    Crystal:  { sky:["#0a0620","#170a3a","#2a1466","#5a3aa8"], ground:["#2a1f4a","#1a1336","#100a22"], path:["#cfd0ff","#6a5ad0"], pathEdge:"#ffffff", pathLine:"#2a1f5a", mountain:"#3a2a66", snow:"#cfe0ff", glow:"#c46bff", cap:["#e0aaff","#a86bff","#6a3ad0"], stem:"#d8c7e8", spot:"#f0dcff", plant:["#7a3ac1","#37e6ff"], horizonGlow:"#b46bff" },
    Oceanic:  { sky:["#04121e","#0a2638","#13466b","#2a7a9a"], ground:["#1c5a5a","#123a3e","#0b2124"], path:["#7fe9ff","#2a8f9e"], pathEdge:"#aef6ff", pathLine:"#0f3a44", mountain:"#2a5a66", snow:null,      glow:"#46e0d0", cap:["#9ff0e0","#46c0c8","#2a7a8a"], stem:"#cdeef0", spot:"#dffff8", plant:["#2a8f9e","#37a8ff"], horizonGlow:"#46c9e0" },
    Barren:   { sky:["#08080e","#14141f","#26263a","#56607a"], ground:["#5a5a66","#3a3a44","#22222a"], path:["#aab0c0","#5a606e"], pathEdge:"#d8dde8", pathLine:"#2a2a36", mountain:"#4a4a5a", snow:"#cfd6e8", glow:"#7a9ac0", cap:["#aab8d0","#6a7a98","#3a4a66"], stem:"#cdd6e8", spot:"#e0e8f4", plant:["#5a6a88","#7a8aa8"], horizonGlow:"#8a9ab0" },
  };
  SK.PLANET_PALETTES.default = SK.PLANET_PALETTES.Jungle;

  /* ===================================================================
     BALANCE — central tuning for progression & difficulty
     =================================================================== */
  SK.BALANCE = {
    // power-score weights (a single number summarising captain/ship strength)
    powerW: { hp: 0.22, attack: 2, defense: 2, speed: 1.5, crit: 1.2, critDmg: 0.4, luck: 0.6 },
    shipPowerW: { hull: 0.18, shield: 0.3, weapon: 2.2, targeting: 1.2, engine: 1.4 },
    // gear-aware difficulty: effLevel = level + min(max,(powerFactor-1)*nudge)
    gearNudge: 2.4,
    gearNudgeMax: 9,
    // equipment upgrades
    upgradePerLevel: 0.10,   // +10% of base stats per upgrade level
    upgradeMaxPlus: 5,
    // set bonus: % to all char stats per equipped epic/legendary item
    setBonusPerEpic: 0.025,
    // salvage currency gained when selling loot, by rarity
    scrapBySell: { common: 1, uncommon: 2, rare: 5, epic: 12, legendary: 28 },
    // depth ("push deeper") ramp
    depthEnemyMul: 0.13,     // +13% enemy stats per depth beyond 1
    depthRareBonus: 0.45,    // +rarity boost per depth
    haulCreditsPerEnc: 9,    // pending haul credits per cleared encounter (x level x tier x depth)
    haulScrapPerEnc: 0.5,
    affixDepthStep: 2,       // +1 affix every N depths
  };

  /* ---------------- Mission difficulty tiers ---------------- */
  SK.TIERS = [
    { key: "patrol",    name: "Patrol",    color: "#46e08a", dLevel: -1, enemyMul: 0.85, lootMul: 1.0, rare: 1,   credMul: 0.9, partyBonus: -1, affixes: 0 },
    { key: "standard",  name: "Standard",  color: "#37e6ff", dLevel: 0,  enemyMul: 1.0,  lootMul: 1.0, rare: 1,   credMul: 1.0, partyBonus: 0,  affixes: 0 },
    { key: "elite",     name: "Elite",     color: "#b46bff", dLevel: 2,  enemyMul: 1.3,  lootMul: 1.5, rare: 2,   credMul: 1.6, partyBonus: 1,  affixes: 1 },
    { key: "nightmare", name: "Nightmare", color: "#ff5d6c", dLevel: 4,  enemyMul: 1.7,  lootMul: 2.2, rare: 3.5, credMul: 2.4, partyBonus: 1,  affixes: 2 },
  ];
  SK.TIER = {};
  SK.TIERS.forEach((t) => { SK.TIER[t.key] = t; });

  /* ---------------- Elite affixes (enemy modifiers) ---------------- */
  SK.AFFIXES = {
    shielded: { name: "Shielded", icon: "🔰", apply: (e) => { e.maxShield = e.shield = Math.round(e.maxHp * 0.45); } },
    swift:    { name: "Swift",    icon: "💨", apply: (e) => { e.spd = Math.round(e.spd * 1.6) + 2; } },
    armored:  { name: "Armored",  icon: "🧱", apply: (e) => { e.def = Math.round(e.def * 1.8) + 5; } },
    fierce:   { name: "Fierce",   icon: "💢", apply: (e) => { e.atk = Math.round(e.atk * 1.35); } },
    regen:    { name: "Regen",    icon: "♻️", apply: (e) => { e.regen = Math.max(1, Math.round(e.maxHp * 0.02)); } },
    vampiric: { name: "Vampiric", icon: "🩸", apply: (e) => { e.lifesteal = 0.4; } },
  };
  SK.AFFIX_KEYS = Object.keys(SK.AFFIXES);
})();


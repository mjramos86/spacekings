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
})();

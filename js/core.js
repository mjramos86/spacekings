/* ===================================================================
   SPACE KINGS — core.js
   Game state, stat math, item generation, XP/levels, combatant builders.
   =================================================================== */
(function () {
  const SK = (window.SK = window.SK || {});

  /* ---------------- RNG helpers ---------------- */
  const rand = () => Math.random();
  const randInt = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  SK.rand = rand; SK.randInt = randInt; SK.pick = pick; SK.uid = uid;

  /* ---------------- Sprite paths (drop PNGs in assets/sprites/*) ---------------- */
  SK.slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  SK.spritePath = (folder, name) => `assets/sprites/${folder}/${SK.slugify(name)}.png`;
  SK.ENEMY_FOLDER = {
    planetMinion: "planet", planetBoss: "planet-boss",
    shipMinion: "ship-crew", shipBoss: "ship-boss", ships: "ships",
  };

  /* ---------------- Runtime state ---------------- */
  SK.state = { save: null, mission: null };
  SK.save = function () { if (SK.state.save) SK.Storage.save(SK.state.save); };

  // Bumped whenever gear stat formulas change so existing saves get recalibrated
  // once (see SK.recalibrateSave). v2 = the "slow progression" equipment nerf.
  SK.BALANCE_VER = 2;

  /* ---------------- New save ---------------- */
  SK.newSave = function (name, appearance) {
    return {
      name,
      appearance,
      shipName: "S.S. " + pick(SK.PLANET_NAMES),
      level: 1,
      xp: 0,
      credits: 150,
      scrap: 0,
      equipped: {
        char: { weapon: null, helmet: null, armor: null, gloves: null, boots: null, accessory: null },
        ship: { primary: null, shieldGen: null, hullPlate: null, engine: null, targeting: null, reactor: null },
      },
      inventory: [],
      robotsOwned: [],
      robotTeam: [],
      shop: { char: [], ship: [], robots: [], stockLevel: 1, refreshedAt: 0 },
      stats: { planetsCleared: 0, shipsDefeated: 0, boarded: 0, kills: 0 },
      balanceVer: SK.BALANCE_VER,
      createdAt: Date.now(),
    };
  };

  /* ---------------- Base stats by level ---------------- */
  SK.baseCharStats = function (level) {
    return {
      hp: 100 + (level - 1) * 22,
      attack: 12 + (level - 1) * 3,
      defense: 5 + (level - 1) * 2,
      speed: 10 + (level - 1) * 1,
      crit: 5,
      critDmg: 50,
      luck: 0,
    };
  };
  SK.baseShipStats = function (level) {
    return {
      hull: 220 + (level - 1) * 28,
      shield: 60 + (level - 1) * 9,
      weapon: 18 + (level - 1) * 3,
      targeting: 5,
      engine: 12 + (level - 1) * 1,
    };
  };

  function addStats(target, src) {
    if (!src) return;
    for (const k in src) target[k] = (target[k] || 0) + src[k];
  }

  /* ---------------- Robots ---------------- */
  SK.robotDef = (key) => SK.ROBOT_CATALOG.find((r) => r.key === key);
  SK.ownedRobot = (save, id) => save.robotsOwned.find((r) => r.id === id);

  /* ---------------- Aggregate stats ---------------- */
  // count of equipped char items that are epic or legendary (for the set bonus)
  SK.epicCount = function (save) {
    let n = 0;
    for (const slot in save.equipped.char) {
      const it = save.equipped.char[slot];
      if (it && (it.rarity === "epic" || it.rarity === "legendary")) n++;
    }
    return n;
  };
  SK.getCharStats = function (save) {
    const total = SK.baseCharStats(save.level);
    for (const slot in save.equipped.char) addStats(total, save.equipped.char[slot]?.stats);
    for (const id of save.robotTeam) {
      const inst = SK.ownedRobot(save, id);
      if (inst) addStats(total, SK.robotDef(inst.key)?.stats);
    }
    const setBonus = SK.epicCount(save) * SK.BALANCE.setBonusPerEpic;
    if (setBonus > 0) for (const k in total) total[k] = Math.round(total[k] * (1 + setBonus));
    return total;
  };
  SK.getShipStats = function (save) {
    const total = SK.baseShipStats(save.level);
    for (const slot in save.equipped.ship) addStats(total, save.equipped.ship[slot]?.stats);
    return total;
  };

  /* ---------------- Power score & gear-aware effective level ---------------- */
  function weighted(stats, w) { let p = 0; for (const k in w) p += (stats[k] || 0) * w[k]; return p; }
  SK.charPower = (save) => Math.round(weighted(SK.getCharStats(save), SK.BALANCE.powerW));
  SK.shipPower = (save) => Math.round(weighted(SK.getShipStats(save), SK.BALANCE.shipPowerW));
  SK.basePower = (level) => weighted(SK.baseCharStats(level), SK.BALANCE.powerW);
  SK.effectiveLevel = function (save) {
    const factor = SK.charPower(save) / Math.max(1, SK.basePower(save.level));
    const nudge = Math.min(SK.BALANCE.gearNudgeMax, Math.max(0, (factor - 1) * SK.BALANCE.gearNudge));
    return save.level + Math.round(nudge);
  };

  /* ---------------- Rarity roll ---------------- */
  // rareBoost > 1 increases the odds of rare/epic/legendary (used by bosses & coffers)
  SK.rollRarity = function (luck, rareBoost) {
    luck = luck || 0; rareBoost = rareBoost || 1;
    const w = {};
    let total = 0;
    for (const r of SK.RARITY_ORDER) {
      let weight = SK.RARITIES[r].weight;
      if (r !== "common") weight *= 1 + luck * 0.02;
      if (r === "rare" || r === "epic" || r === "legendary") weight *= rareBoost;
      w[r] = weight; total += weight;
    }
    let roll = Math.random() * total;
    for (const r of SK.RARITY_ORDER) { roll -= w[r]; if (roll <= 0) return r; }
    return "common";
  };

  /* ---------------- Item generation ---------------- */
  function buildName(def, rarity) {
    let name = pick(SK.NAME_PREFIX) + " " + pick(def.names);
    if (rarity === "epic" || rarity === "legendary") name += " " + pick(SK.NAME_SUFFIX);
    return name;
  }

  SK.generateItem = function (opts) {
    opts = opts || {};
    const domain = opts.domain || "char";
    const slots = domain === "char" ? SK.CHAR_SLOTS : SK.SHIP_SLOTS;
    const unit = domain === "char" ? SK.CHAR_STAT_UNIT : SK.SHIP_STAT_UNIT;
    const allKeys = Object.keys(unit);
    const level = opts.level || 1;

    let slotKey = opts.slot;
    if (!slotKey) {
      if (opts.focusSlot && rand() < 0.6) slotKey = opts.focusSlot;
      else slotKey = pick(Object.keys(slots));
    }
    const def = slots[slotKey];
    const rarity = opts.rarity || SK.rollRarity(opts.luck || 0, opts.rareBoost || 1);
    const rar = SK.RARITIES[rarity];
    const levelScale = 1 + (level - 1) * SK.BALANCE.gearLevelScale;
    const variance = () => 0.85 + rand() * 0.3;

    const stats = {};
    const primaryKey = def.primary;
    stats[primaryKey] = Math.max(1, Math.round(unit[primaryKey] * levelScale * rar.statMult * variance()));

    // bonus stats
    const pool = def.secondaries.slice();
    for (const k of allKeys) if (k !== primaryKey && !pool.includes(k)) pool.push(k);
    let added = 0;
    for (let i = 0; i < pool.length && added < rar.bonusStats; i++) {
      const k = pool[i];
      if (k === primaryKey || stats[k]) continue;
      stats[k] = Math.max(1, Math.round(unit[k] * levelScale * rar.statMult * 0.4 * variance()));
      added++;
    }

    return {
      id: uid(),
      domain,
      slot: slotKey,
      slotLabel: def.label,
      rarity,
      level,
      icon: def.icon,
      name: buildName(def, rarity),
      stats,
      plus: 0,
      _base: { ...stats },
      value: Math.max(1, Math.round(8 * rar.valueMult * levelScale)),
    };
  };

  /* ---------------- Equipment upgrades (credits + scrap) ---------------- */
  SK.upgradeCost = function (item) {
    const r = SK.RARITY_ORDER.indexOf(item.rarity) + 1;
    const plus = item.plus || 0;
    return {
      credits: Math.round(item.value * 1.2 * (plus + 1) * (1 + r * 0.3)) + 15,
      scrap: Math.round(r * (plus + 1) * 0.8) + 1,
    };
  };
  SK.canUpgrade = (item) => (item.plus || 0) < SK.BALANCE.upgradeMaxPlus;
  SK.upgradeItem = function (save, item) {
    if (!SK.canUpgrade(item)) return false;
    const c = SK.upgradeCost(item);
    if (save.credits < c.credits || (save.scrap || 0) < c.scrap) return false;
    save.credits -= c.credits; save.scrap -= c.scrap;
    if (!item._base) item._base = { ...item.stats };
    item.plus = (item.plus || 0) + 1;
    const f = 1 + item.plus * SK.BALANCE.upgradePerLevel;
    const ns = {};
    for (const k in item._base) ns[k] = Math.max(1, Math.round(item._base[k] * f));
    item.stats = ns;
    SK.save();
    return true;
  };

  /* ---------------- Balance migration (recalibrate old gear) ---------------- */
  // Recompute one item's stats from the current formula, preserving its stat
  // identity (which stats it has) and its +upgrade level. Mirrors the magnitude
  // math in generateItem at an average roll (variance = 1).
  SK.recalibrateItem = function (item) {
    if (!item) return;
    const slots = item.domain === "ship" ? SK.SHIP_SLOTS : SK.CHAR_SLOTS;
    const unit = item.domain === "ship" ? SK.SHIP_STAT_UNIT : SK.CHAR_STAT_UNIT;
    const def = slots[item.slot];
    if (!def) return;
    const rar = SK.RARITIES[item.rarity] || SK.RARITIES.common;
    const level = item.level || 1;
    const levelScale = 1 + (level - 1) * SK.BALANCE.gearLevelScale;
    const keys = Object.keys(item._base || item.stats || {});
    const base = {};
    for (const k of keys) {
      if (!unit[k]) continue;
      const factor = k === def.primary ? 1 : 0.4;
      base[k] = Math.max(1, Math.round(unit[k] * levelScale * rar.statMult * factor));
    }
    item._base = base;
    const f = 1 + (item.plus || 0) * SK.BALANCE.upgradePerLevel;
    const ns = {};
    for (const k in base) ns[k] = Math.max(1, Math.round(base[k] * f));
    item.stats = ns;
    item.value = Math.max(1, Math.round(8 * rar.valueMult * levelScale));
  };

  // Run once per save when the balance version changes: recalibrate every owned
  // and equipped item so existing characters feel the rebalance. Returns the
  // number of items touched (0 if the save is already current).
  SK.recalibrateSave = function (save) {
    if (!save || save.balanceVer === SK.BALANCE_VER) return 0;
    let n = 0;
    for (const domain of ["char", "ship"]) {
      const eq = save.equipped && save.equipped[domain];
      for (const slot in eq) if (eq[slot]) { SK.recalibrateItem(eq[slot]); n++; }
    }
    (save.inventory || []).forEach((it) => { SK.recalibrateItem(it); n++; });
    // shop stock too, so freshly-bought items match the new balance
    if (save.shop) for (const k of ["char", "ship"]) (save.shop[k] || []).forEach((it) => { SK.recalibrateItem(it); n++; });
    save.balanceVer = SK.BALANCE_VER;
    return n;
  };

  /* ---------------- Stat delta (for loot cards) ---------------- */
  SK.statDelta = function (save, item) {
    const equipped = save.equipped[item.domain][item.slot] || null;
    const meta = item.domain === "char" ? SK.CHAR_STAT_META : SK.SHIP_STAT_META;
    const keys = [];
    for (const k in meta) {
      if ((item.stats && item.stats[k] != null) || (equipped && equipped.stats[k] != null)) keys.push(k);
    }
    return keys.map((k) => {
      const cur = equipped ? equipped.stats[k] || 0 : 0;
      const nw = item.stats[k] || 0;
      return { key: k, meta: meta[k], from: cur, to: nw, delta: nw - cur };
    });
  };

  /* ---------------- Inventory / equip / sell ---------------- */
  function removeFromInventory(save, id) {
    const i = save.inventory.findIndex((it) => it.id === id);
    if (i >= 0) save.inventory.splice(i, 1);
  }

  SK.equipItem = function (save, item) {
    removeFromInventory(save, item.id);
    const old = save.equipped[item.domain][item.slot];
    save.equipped[item.domain][item.slot] = item;
    if (old) save.inventory.push(old);
    SK.save();
    return old;
  };

  SK.sellItem = function (save, item) {
    removeFromInventory(save, item.id);
    save.credits += item.value;
    const scrap = SK.BALANCE.scrapBySell[item.rarity] || 1;
    save.scrap = (save.scrap || 0) + scrap;
    SK.save();
    return { credits: item.value, scrap };
  };

  SK.unequip = function (save, domain, slot) {
    const it = save.equipped[domain][slot];
    if (!it) return;
    save.equipped[domain][slot] = null;
    save.inventory.push(it);
    SK.save();
  };

  SK.addCredits = function (save, n) {
    save.credits = Math.max(0, save.credits + n);
    SK.save();
  };

  /* ---------------- XP / levels ---------------- */
  // Steeper curve so high levels are a long-haul grind (years-of-play pacing);
  // early levels stay cheap so the first hour still feels rewarding.
  SK.xpToNext = (level) => Math.round(65 * Math.pow(level, 1.6));
  SK.addXP = function (save, amount) {
    save.xp += amount;
    const leveled = [];
    while (save.xp >= SK.xpToNext(save.level)) {
      save.xp -= SK.xpToNext(save.level);
      save.level++;
      leveled.push(save.level);
    }
    SK.save();
    return leveled;
  };

  /* ---------------- Combatant builders ---------------- */
  SK.makePlayerCombatant = function (save) {
    const s = SK.getCharStats(save);
    const team = save.robotTeam.map((id) => {
      const inst = SK.ownedRobot(save, id);
      return inst ? SK.robotDef(inst.key)?.icon : null;
    }).filter(Boolean);
    return {
      side: "player", name: save.name, icon: "🧑‍🚀",
      weaponIcon: save.equipped.char.weapon ? save.equipped.char.weapon.icon : "🔫",
      maxHp: s.hp, hp: s.hp, atk: s.attack, def: s.defense, spd: Math.max(1, s.speed),
      critPct: s.crit, critDmgPct: s.critDmg, evasionPct: 0, shield: 0, maxShield: 0,
      robots: team,
    };
  };

  SK.makeEnemyCombatant = function (opts) {
    const type = opts.type;
    const level = opts.level;
    const isBoss = !!opts.isBoss;
    const tpl = pick(SK.ENEMY_POOLS[type]);
    const hpMult = isBoss ? 1.7 : 0.8;
    const atkMult = isBoss ? 1.05 : 0.8;
    const defMult = isBoss ? 1.1 : 0.7;
    const scale = opts.scale || 1; // party members are scaled down a touch for fairness
    const mul = opts.mul || 1;     // tier/depth difficulty multiplier
    const atkF = scale * (0.4 + 0.6 * mul); // soften attack vs hp so high tiers don't one-shot
    return {
      side: "enemy", name: tpl.name, icon: tpl.icon, isBoss, affixes: [],
      sprite: SK.spritePath(SK.ENEMY_FOLDER[type] || "planet", tpl.name),
      maxHp: Math.round((55 + level * 15) * hpMult * scale * mul),
      hp: Math.round((55 + level * 15) * hpMult * scale * mul),
      atk: Math.round((7 + level * 1.7) * atkMult * atkF),
      def: Math.round((2 + level * 1.0) * defMult * (0.6 + 0.4 * mul)),
      spd: isBoss ? 9 : 7 + randInt(0, 4),
      critPct: isBoss ? 10 : 5, critDmgPct: 50,
      evasionPct: isBoss ? 5 : 0, shield: 0, maxShield: 0,
    };
  };

  // apply N random affixes to an enemy (returns the keys)
  SK.applyAffixes = function (e, count) {
    if (!count || count <= 0) return;
    const keys = SK.AFFIX_KEYS.slice();
    for (let i = 0; i < count && keys.length; i++) {
      const k = keys.splice(Math.floor(Math.random() * keys.length), 1)[0];
      SK.AFFIXES[k].apply(e);
      e.affixes.push(k);
    }
  };

  SK.makePlayerShip = function (save) {
    const s = SK.getShipStats(save);
    return {
      side: "player", isShip: true, name: save.shipName, icon: "🚀", weaponIcon: "💠",
      maxHp: s.hull, hp: s.hull, shield: s.shield, maxShield: s.shield,
      atk: s.weapon, def: 0, spd: Math.max(1, s.engine),
      critPct: s.targeting, critDmgPct: 50,
      evasionPct: Math.min(35, (s.engine / (s.engine + 60)) * 100),
    };
  };

  SK.makeEnemyShip = function (opts) {
    const level = opts.level;
    const engine = 8 + randInt(0, 3);
    const mul = opts.mul || 1;
    return {
      side: "enemy", isShip: true, name: opts.name, icon: opts.icon, affixes: [],
      sprite: SK.spritePath("ships", opts.sprite || opts.name),
      maxHp: Math.round((160 + level * 24) * mul), hp: Math.round((160 + level * 24) * mul),
      shield: Math.round((36 + level * 7) * mul), maxShield: Math.round((36 + level * 7) * mul),
      atk: Math.round((9 + level * 2) * (0.5 + 0.5 * mul)), def: 0, spd: engine,
      critPct: 6, critDmgPct: 50,
      evasionPct: Math.min(28, (engine / (engine + 60)) * 100),
    };
  };

  /* ---------------- XP reward helpers ---------------- */
  SK.xpForKill = (level, isBoss) => Math.round((isBoss ? 70 : 18) * (1 + level * 0.25));
})();

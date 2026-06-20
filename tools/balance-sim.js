/* ===================================================================
   SPACE KINGS — dev balance sim (Node only; not loaded by the game)
   Mirrors the combat math in js/combat.js to estimate win-rates for the
   mission tiers and the depth ramp, so tuning in js/data.js (SK.BALANCE,
   SK.TIERS) can be checked in seconds.

   Run from the repo root:   node tools/balance-sim.js
   =================================================================== */
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.join(__dirname, "..");
const ctx = { window: {}, Math, Date, JSON, console };
vm.createContext(ctx);
for (const f of ["js/data.js", "js/core.js"]) vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
const SK = ctx.window.SK;
const ap = { sex: "male", skin: "#e0ac69", eyes: "#4a90d9", hair: "#1a1a1a" };
const clone = (o) => JSON.parse(JSON.stringify(o));

function geared(level, rarity, slots) {
  const sv = SK.newSave("g", ap); sv.level = level;
  (slots || Object.keys(SK.CHAR_SLOTS)).forEach((sl) =>
    sv.equipped.char[sl] = SK.generateItem({ domain: "char", slot: sl, level, rarity }));
  return sv;
}
// one combat, mirroring js/combat.js (focus-fire, shield, crit, affix heal)
function sim(P, Es) {
  const p = clone(P), es = Es.map(clone); let pg = 0, g = es.map(() => 0), t = 0; const T = 55;
  const dead = (e) => e.hp <= 0;
  function hit(a, d, enemyAtk) {
    if (Math.random() * 100 < (d.evasionPct || 0)) return;
    const mit = 100 / (100 + d.def * 2);
    const crit = Math.random() * 100 < (a.critPct || 0);
    const cm = crit ? 1 + (a.critDmgPct || 0) / 100 : 1;
    let dmg = Math.max(1, Math.round(a.atk * mit * cm * (0.9 + Math.random() * 0.2)));
    if (d.shield > 0) { const s = Math.min(d.shield, dmg); d.shield -= s; dmg -= s; }
    d.hp -= dmg;
    if (enemyAtk) { let h = 0; if (a.lifesteal && dmg > 0) h += Math.round(dmg * a.lifesteal); if (a.regen) h += a.regen; if (h) a.hp = Math.min(a.maxHp, a.hp + h); }
  }
  const target = () => { let b = -1, r = 99; es.forEach((e, i) => { if (dead(e)) return; const rr = e.isBoss ? 1 : 0; if (rr < r) { r = rr; b = i; } }); return b; };
  while (p.hp > 0 && es.some((e) => !dead(e)) && t++ < 8000) {
    pg += p.spd; es.forEach((e, i) => { if (!dead(e)) g[i] += e.spd; });
    if (pg >= T) { pg -= T; const x = target(); if (x >= 0) hit(p, es[x], false); }
    for (let i = 0; i < es.length; i++) { if (dead(es[i])) continue; if (g[i] >= T) { g[i] -= T; hit(es[i], p, true); if (p.hp <= 0) break; } }
  }
  return p.hp > 0;
}
const rate = (P, mk, n = 300) => { let w = 0; for (let i = 0; i < n; i++) if (sim(P, mk())) w++; return Math.round(w / n * 100); };

// build a boss-party (boss + 2 escorts) for level/mul/affixes, mirroring missions.buildParty
function bossParty(level, mul, aff) {
  const boss = SK.makeEnemyCombatant({ type: "planetBoss", level: level + 1, isBoss: true, mul });
  boss.atk = Math.round(boss.atk * 0.9); boss.maxHp = boss.hp = Math.round(boss.maxHp * 0.85);
  SK.applyAffixes(boss, aff);
  return [SK.makeEnemyCombatant({ type: "planetMinion", level, scale: 0.45, mul }), boss,
          SK.makeEnemyCombatant({ type: "planetMinion", level, scale: 0.45, mul })];
}
// a regular (non-boss) minion encounter of N enemies, mirroring missions.buildParty
function minionParty(level, mul, size, aff) {
  const scale = size === 3 ? 0.78 : size === 2 ? 0.9 : 1;
  const party = [];
  for (let i = 0; i < size; i++) party.push(SK.makeEnemyCombatant({ type: "planetMinion", level, scale, mul }));
  if (aff) SK.applyAffixes(party[0], aff);
  return party;
}

// naked save (level only, no gear) — the baseline power that gear sits on top of
function naked(level) { const sv = SK.newSave("n", ap); sv.level = level; return sv; }

console.log("== GEAR CONTRIBUTION (how much full gear adds over naked, by rarity) ==\n");
console.log("  A 'serious nerf' means each rarity is a modest %, not a doubling.\n");
console.log("  level   naked   common   uncommon   rare    epic    legendary");
for (const lvl of [1, 5, 10, 20, 40]) {
  const base = SK.charPower(naked(lvl));
  const cells = ["common", "uncommon", "rare", "epic", "legendary"].map((r) => {
    const p = SK.charPower(geared(lvl, r));
    return (p + " (+" + Math.round((p / base - 1) * 100) + "%)").padEnd(11);
  });
  console.log("  L" + String(lvl).padEnd(5) + " " + String(base).padEnd(7) + " " + cells.join(" "));
}

// attach a 3-bot team to a save (instances only store {id,key}; stats read live)
function withRobots(sv, keys) {
  const s = clone(sv); s.robotsOwned = []; s.robotTeam = [];
  keys.forEach((k, i) => { const id = "r" + i; s.robotsOwned.push({ id, key: k }); s.robotTeam.push(id); });
  return s;
}
console.log("\n== ROBOT TEAM CONTRIBUTION (full 3-bot team, atop rare gear) ==\n");
console.log("  Robots are flat (don't scale), so impact fades as level grows.\n");
for (const lvl of [5, 15, 30]) {
  const base = geared(lvl, "rare");
  const teams = [
    ["no robots", []],
    ["early (scout/gunner/guard)", ["scout", "gunner", "guard"]],
    ["top DPS (omega/titan/striker)", ["omega", "titan", "striker"]],
  ];
  const bp = SK.charPower(base);
  console.log("  L" + lvl + " (gear-only power " + bp + ")");
  for (const [name, keys] of teams) {
    const sv = keys.length ? withRobots(base, keys) : base;
    const p = SK.charPower(sv);
    console.log("    " + name.padEnd(30) + " power " + String(p).padStart(4) + "  (+" + Math.round((p / bp - 1) * 100) + "%)");
  }
}

console.log("\n== TIER WIN-RATES (boss + 2 escorts), by captain gear ==\n");
const cases = [
  ["L1 naked", naked(1)],
  ["L1 +3 common", geared(1, "common", ["weapon", "helmet", "armor"])],
  ["L4 uncommon", geared(4, "uncommon")],
  ["L8 rare", geared(8, "rare")],
  ["L15 epic", geared(15, "epic")],
  ["L25 legendary", geared(25, "legendary")],
];
console.log("  " + "case".padEnd(16) + "power   " + SK.TIERS.map((t) => t.name).join("  "));
for (const [name, sv] of cases) {
  const P = SK.makePlayerCombatant(sv);
  const out = SK.TIERS.map((t) => (rate(P, () => bossParty(Math.max(1, sv.level + t.dLevel), t.enemyMul, t.affixes)) + "%").padStart(t.name.length));
  console.log("  " + name.padEnd(16) + String(SK.charPower(sv)).padStart(4) + "    " + out.join("  "));
}

console.log("\n== OPENING: can a fresh player earn their first gear? (minion encounters) ==");
{
  const rows = [
    ["L1 naked", naked(1)],
    ["L1 +1 common", geared(1, "common", ["weapon"])],
    ["L2 +2 common", (() => { const s = geared(2, "common", ["weapon", "armor"]); return s; })()],
  ];
  for (const [name, sv] of rows) {
    const P = SK.makePlayerCombatant(sv);
    const single = rate(P, () => minionParty(sv.level, 0.85, 1, 0));   // Patrol single
    const pair   = rate(P, () => minionParty(sv.level, 0.85, 2, 0));   // Patrol pair
    const trio   = rate(P, () => minionParty(sv.level, 1.0, 3, 0));    // Standard trio
    console.log("  " + name.padEnd(14) + " Patrol 1:" + (single + "%").padStart(4) + "  Patrol 2:" + (pair + "%").padStart(4) + "  Standard 3:" + (trio + "%").padStart(4));
  }
}

console.log("\n== DEPTH RAMP (endless endgame; boss-party, Standard tier) ==");
{
  const B = SK.BALANCE;
  const depthRow = (sv) => [1, 4, 8, 12, 16, 20].map((d) =>
    "d" + d + ":" + (rate(sv.P, () => bossParty(sv.lvl + d - 1, 1.0 * (1 + (d - 1) * B.depthEnemyMul), Math.min(3, Math.floor((d - 1) / B.affixDepthStep)))) + "%").padStart(4));
  for (const c of [
    { name: "L8 rare", lvl: 8, sv: geared(8, "rare") },
    { name: "L20 epic", lvl: 20, sv: geared(20, "epic") },
    { name: "L40 legendary", lvl: 40, sv: geared(40, "legendary") },
  ]) {
    c.P = SK.makePlayerCombatant(c.sv);
    console.log("  " + c.name.padEnd(14) + " " + depthRow(c).join("  "));
  }
}

console.log("\n== XP PACING (cumulative XP to reach each level) ==");
{
  let cum = 0, line = [];
  for (let l = 1; l <= 100; l++) {
    if ([2, 5, 10, 20, 30, 50, 75, 100].includes(l)) line.push("L" + l + ":" + (cum >= 1000 ? Math.round(cum / 1000) + "k" : cum));
    cum += SK.xpToNext(l);
  }
  console.log("  " + line.join("  "));
}

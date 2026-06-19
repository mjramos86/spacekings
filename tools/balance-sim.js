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

console.log("Tier win-rates (boss + 2 escorts), by captain gear:\n");
const cases = [
  ["L1 +3 uncommon", geared(1, "uncommon", ["weapon", "helmet", "armor"])],
  ["L4 uncommon", geared(4, "uncommon")],
  ["L6 rare", geared(6, "rare")],
  ["L10 epic", geared(10, "epic")],
];
for (const [name, sv] of cases) {
  const P = SK.makePlayerCombatant(sv);
  const out = SK.TIERS.map((t) => t.name[0] + ":" + String(rate(P, () => bossParty(Math.max(1, sv.level + t.dLevel), t.enemyMul, t.affixes))).padStart(3) + "%");
  console.log("  " + name.padEnd(16) + " power " + String(SK.charPower(sv)).padStart(4) + "  " + out.join("  "));
}
console.log("\nDepth ramp (L6 rare, Standard tier):");
{
  const sv = geared(6, "rare"), P = SK.makePlayerCombatant(sv), B = SK.BALANCE;
  const out = [1, 3, 5, 7, 9].map((d) => "d" + d + ":" + rate(P, () => bossParty(6 + d - 1, 1.0 * (1 + (d - 1) * B.depthEnemyMul), Math.min(3, Math.floor((d - 1) / B.affixDepthStep)))) + "%");
  console.log("  " + out.join("  "));
}

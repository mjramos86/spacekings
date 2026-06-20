/* ===================================================================
   SPACE KINGS — missions.js
   Planet Exploration & Ship Battle, with:
   - gear-aware difficulty (effective level)
   - mission tiers (Patrol/Standard/Elite/Nightmare)
   - "push deeper" depth ramp with extract-or-descend (push-your-luck haul)
   - elite affixes at higher tiers/depth
   =================================================================== */
(function () {
  const SK = (window.SK = window.SK || {});
  const $ = (s) => document.querySelector(s);
  const UI = SK.UI;
  const S = () => SK.state.save;
  const M = () => SK.state.mission;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------------- run-screen helpers ---------------- */
  function showRun() { UI.showScreen("screen-run"); }

  function setScene(mode) {
    const sc = $("#run-scene");
    sc.classList.remove("space", "planet", "corridor");
    if (mode === "space") sc.classList.add("space");
    else if (mode === "planet") { sc.classList.add("planet"); ensureGun(); }
    else if (mode === "corridor") { sc.classList.add("corridor"); ensureCorridor(); ensureGun(); }
  }
  function ensureCorridor() {
    const el = $(".corridor-scene");
    if (el && !el.firstChild) el.innerHTML = SK.UI.corridorSceneSVG();
  }
  function ensureGun() {
    const g = $("#fp-gun");
    g.classList.remove("img-art");
    g.innerHTML =
      '<div class="fp-gun-inner"><div class="fp-laser"></div><div class="fp-flash"></div>' +
      '<img class="fp-gun-img" alt="" src="assets/inventory/in-game/defaultgun.png"></div>';
    const img = g.querySelector(".fp-gun-img");
    img.onload = () => g.classList.add("img-art");
    img.onerror = () => {
      g.classList.remove("img-art");
      img.outerHTML = SK.UI.fpGunSVG(S().appearance && S().appearance.skin);
    };
  }

  // Layer a background image over a scene's drawn fallback; if the file is
  // missing the <img> removes itself and the SVG/CSS scene shows through.
  function sceneBg(sel, path) {
    const el = $(sel); if (!el) return;
    el.querySelectorAll(".scene-bg").forEach((n) => n.remove());
    const img = document.createElement("img");
    img.className = "scene-bg"; img.alt = ""; img.src = path;
    img.onerror = function () { this.remove(); };
    el.appendChild(img);
  }

  function setProgress(seq, idx) {
    $("#run-progress").innerHTML = seq.map((e, i) => {
      const cls = ["prog-dot"];
      if (e.type === "boss") cls.push("boss");
      if (i < idx) cls.push("done");
      else if (i === idx) cls.push("active");
      return `<div class="${cls.join(" ")}"></div>`;
    }).join("");
  }

  function travel(cb) {
    const t = $("#run-travel");
    $("#combat-view").classList.remove("show");
    const g = $("#fp-gun"); if (g) g.classList.add("running");
    t.classList.add("show");
    setTimeout(() => { t.classList.remove("show"); if (g) g.classList.remove("running"); cb(); }, 1050);
  }

  function applyXP(amount) {
    const leveled = SK.addXP(S(), amount);
    UI.toast("+" + amount + " XP");
    if (leveled.length) UI.toast("LEVEL UP → Lv " + leveled[leveled.length - 1] + "!", "level");
  }

  function showLoot(item, cb) {
    SK.Cards.show(item, (action) => {
      if (action === "equip") { SK.equipItem(S(), item); UI.toast("Equipped " + item.name, "good"); }
      else { const r = SK.sellItem(S(), item); UI.toast("Sold ▸ 💰" + r.credits + " · ⚙️" + r.scrap, "gold"); }
      cb();
    });
  }

  function refreshFootPlayer(m) {
    const frac = m.player.hp / m.player.maxHp;
    const np = SK.makePlayerCombatant(S());
    np.hp = Math.max(1, Math.round(np.maxHp * frac));
    m.player = np;
  }

  /* ---------------- difficulty context (tier + depth) ---------------- */
  function ctx(m) {
    const B = SK.BALANCE, d = m.depth - 1;
    return {
      level: Math.max(1, m.baseLevel + d),
      mul: m.tier.enemyMul * (1 + d * B.depthEnemyMul),
      affixCount: Math.min(3, m.tier.affixes + Math.floor(d / B.affixDepthStep)),
      rareMul: m.tier.rare * (1 + d * B.depthRareBonus),
      partyBonus: m.tier.partyBonus,
    };
  }

  // Build a party for a foot encounter using the difficulty context.
  function buildParty(minionType, bossType, isBoss, c) {
    if (isBoss) {
      const boss = SK.makeEnemyCombatant({ type: bossType, level: c.level + 1, isBoss: true, mul: c.mul });
      const n = SK.randInt(0, 2);
      if (n > 0) { boss.atk = Math.round(boss.atk * 0.9); boss.maxHp = boss.hp = Math.round(boss.maxHp * 0.85); }
      SK.applyAffixes(boss, c.affixCount);
      const minions = [];
      for (let i = 0; i < n; i++) minions.push(SK.makeEnemyCombatant({ type: minionType, level: c.level, scale: 0.45, mul: c.mul }));
      const mid = Math.floor(minions.length / 2);
      return [...minions.slice(0, mid), boss, ...minions.slice(mid)];
    }
    const size = clamp(SK.pick([1, 2, 2, 3]) + (c.partyBonus || 0), 1, 3);
    const scale = size === 3 ? 0.78 : size === 2 ? 0.9 : 1;
    const party = [];
    for (let i = 0; i < size; i++) party.push(SK.makeEnemyCombatant({ type: minionType, level: c.level, scale, mul: c.mul }));
    if (c.affixCount > 0) SK.applyAffixes(party[SK.randInt(0, size - 1)], c.affixCount); // one "elite" minion
    return party;
  }
  const partyXP = (enemies, m) => Math.round(enemies.reduce((s, e) => s + SK.xpForKill(m.baseLevel + m.depth - 1, e.isBoss), 0) * m.tier.credMul);

  /* ---------------- haul (push-your-luck reward) ---------------- */
  function addHaul(m) {
    const B = SK.BALANCE, lvl = Math.max(1, m.baseLevel + m.depth - 1);
    m.haul.credits += Math.round(B.haulCreditsPerEnc * lvl * m.tier.credMul * (1 + (m.depth - 1) * 0.25));
    m.haul.scrap += Math.round(B.haulScrapPerEnc * lvl * m.tier.credMul) + 1;
  }
  function bankHaul(m) {
    const save = S();
    save.credits += m.haul.credits;
    save.scrap = (save.scrap || 0) + m.haul.scrap;
    UI.toast("Haul banked ▸ 💰" + m.haul.credits + " · ⚙️" + m.haul.scrap, "gold");
    m.haul = { credits: 0, scrap: 0 };
    SK.save();
  }

  // Extract-or-descend prompt after a sector is cleared.
  function depthChoice(emoji, onDescend, onExtract) {
    const m = M();
    UI.modal({
      title: "Sector cleared — Depth " + m.depth,
      body: `<span class="big-emoji">${emoji}</span>` +
        `Pending haul: <b>💰 ${m.haul.credits}</b> · <b>⚙️ ${m.haul.scrap}</b>.<br><br>` +
        `<b>Extract</b> to bank it, or <b>descend deeper</b> for higher threat and richer loot. ` +
        `If you fall, the pending haul is lost.`,
      actions: [
        { label: "Extract", class: "btn-primary", onClick: onExtract },
        { label: "Descend ▾", class: "btn-gold", onClick: onDescend },
      ],
    });
  }

  /* ---------------- mission end ---------------- */
  function endModal(emoji, title, body, win) {
    SK.Combat.stop();
    UI.modal({
      title, body: `<span class="big-emoji">${emoji}</span>${body}`,
      actions: [{ label: "Return to Station", class: win ? "btn-primary" : "btn-ghost", onClick: returnHub }],
    });
  }
  function missionFail(msg) { SK.save(); endModal("💀", "Mission Failed", msg, false); }
  function missionDone(emoji, title, msg) { SK.save(); endModal(emoji, title, msg, true); }
  function returnHub() {
    SK.state.mission = null;
    SK.Combat.stop();
    setScene("none");
    SK.Hub.refreshTop();
    UI.showScreen("screen-hub");
  }

  /* ---------------- selection UI ---------------- */
  function chooseTiers(save) {
    const top = save.level >= 6 && Math.random() < 0.4 ? SK.TIER.nightmare : SK.TIER.elite;
    return [SK.TIER.patrol, SK.TIER.standard, top];
  }
  function tierBadge(t) {
    return `<span class="loot-chip tier-badge" style="border-color:${t.color};color:${t.color}">${t.name}</span>`;
  }
  function targetCard(icon, name, sub, chips, tier) {
    return `<div class="target-card" style="border-left:4px solid ${tier.color}"><div class="tc-icon">${icon}</div><div class="tc-main">` +
      `<div class="tc-name">${name}</div><div class="tc-sub">${sub}</div>` +
      `<div class="tc-loot">${chips}</div></div></div>`;
  }
  function renderSelect(title, intro, cardsHTML, onPick) {
    $("#select-title").textContent = title;
    $("#select-content").innerHTML = `<p class="select-intro">${intro}</p>` + cardsHTML.join("");
    UI.showScreen("screen-select");
    $("#select-content").querySelectorAll(".target-card").forEach((el, i) =>
      el.addEventListener("click", () => onPick(i)));
  }

  /* =================================================================
     PLANET EXPLORATION
     ================================================================= */
  function startPlanet() {
    // tiers are the difficulty band; depth is the infinite ramp. Threat is
    // level-based (gear lets you out-gear low tiers — push tiers/depth for more).
    const save = S(), eff = save.level;
    const opts = chooseTiers(save).map((tier) => ({
      tier,
      biome: SK.pick(SK.PLANET_BIOMES),
      name: SK.pick(SK.PLANET_NAMES) + "-" + SK.randInt(1, 9),
      level: Math.max(1, eff + tier.dLevel),
      focusSlot: SK.pick(Object.keys(SK.CHAR_SLOTS)),
    }));
    const cards = opts.map((o) => {
      const sd = SK.CHAR_SLOTS[o.focusSlot];
      const chips = tierBadge(o.tier) +
        `<span class="loot-chip">${sd.icon} ${sd.label}s</span>` +
        `<span class="loot-chip">⚔️ Threat ${o.level}</span>` +
        (o.tier.lootMul > 1 ? `<span class="loot-chip r-epic">✦ loot ×${o.tier.lootMul}</span>` : "") +
        (o.tier.affixes ? `<span class="loot-chip r-rare">☣ affixes</span>` : "");
      return targetCard(o.biome.icon, "Planet " + o.name, o.biome.name + " world", chips, o.tier);
    });
    renderSelect("Planet Exploration",
      "Pick a sector. Clear it, then extract — or push deeper for richer loot at rising threat.",
      cards, (i) => beginPlanet(opts[i]));
  }

  function beginPlanet(opt) {
    SK.state.mission = {
      kind: "planet", opt, tier: opt.tier, baseLevel: opt.level, depth: 1, idx: 0,
      player: SK.makePlayerCombatant(S()),
      seq: [{ type: "minion" }, { type: "minion" }, { type: "minion" }, { type: "boss" }],
      haul: { credits: 0, scrap: 0 },
    };
    showRun();
    $(".planet-scene").innerHTML = SK.UI.planetSceneSVG(SK.PLANET_PALETTES[opt.biome.name] || SK.PLANET_PALETTES.default);
    setScene("planet");
    sceneBg(".planet-scene", "assets/backgrounds/planet-" + SK.slugify(opt.biome.name) + ".png");
    setProgress(M().seq, 0);
    travel(planetEncounter);
  }

  function planetEncounter() {
    const m = M(), save = S(), c = ctx(m);
    const isBoss = m.seq[m.idx].type === "boss";
    if (m.idx > 0) m.player.hp = Math.min(m.player.maxHp, m.player.hp + Math.round(m.player.maxHp * 0.15));
    setProgress(m.seq, m.idx);
    const enemies = buildParty("planetMinion", "planetBoss", isBoss, c);
    SK.Combat.start({
      player: m.player, enemies,
      onEnd: (win) => {
        if (!win) return missionFail("Your captain fell on Planet " + m.opt.name + " (depth " + m.depth + ").");
        save.stats.kills += enemies.length;
        applyXP(partyXP(enemies, m));
        addHaul(m);
        const item = SK.generateItem({
          domain: "char", level: c.level + (isBoss ? 1 : 0),
          focusSlot: m.opt.focusSlot, luck: SK.getCharStats(save).luck, rareBoost: (isBoss ? 2.5 : 1) * c.rareMul,
        });
        showLoot(item, () => {
          refreshFootPlayer(m);
          m.idx++;
          if (m.idx >= m.seq.length) {
            save.stats.planetsCleared++;
            depthChoice("🪐",
              () => { m.depth++; m.idx = 0; m.seq = [{ type: "minion" }, { type: "minion" }, { type: "minion" }, { type: "boss" }];
                m.player.hp = Math.min(m.player.maxHp, m.player.hp + Math.round(m.player.maxHp * 0.4));
                UI.toast("Descending to depth " + m.depth + "…"); travel(planetEncounter); },
              () => { bankHaul(m); applyXP(20 + c.level * 4);
                missionDone("🪐", "Sector Cleared!", "Planet " + m.opt.name + " — extracted at depth " + m.depth + "."); });
          } else travel(planetEncounter);
        });
      },
    });
  }

  /* =================================================================
     SHIP BATTLE
     ================================================================= */
  function startShip() {
    const save = S(), eff = save.level;
    const opts = chooseTiers(save).map((tier) => ({
      tier,
      vessel: SK.pick(SK.ENEMY_POOLS.ships),
      shipName: SK.pick(SK.PIRATE_SHIP_PREFIX) + " " + SK.pick(SK.PIRATE_SHIP_SUFFIX),
      level: Math.max(1, eff + tier.dLevel),
      focusSlot: SK.pick(Object.keys(SK.SHIP_SLOTS)),
    }));
    const cards = opts.map((o) => {
      const sd = SK.SHIP_SLOTS[o.focusSlot];
      const chips = tierBadge(o.tier) +
        `<span class="loot-chip">${sd.icon} ${sd.label}</span>` +
        `<span class="loot-chip">⚔️ Threat ${o.level}</span>` +
        (o.tier.lootMul > 1 ? `<span class="loot-chip r-epic">✦ loot ×${o.tier.lootMul}</span>` : "");
      return targetCard(o.vessel.icon, o.shipName, o.vessel.name + "-class", chips, o.tier);
    });
    renderSelect("Ship Battle",
      "Engage a pirate. Destroy it or board for loot — then extract or hunt deeper.",
      cards, (i) => beginShip(opts[i]));
  }

  function beginShip(opt) {
    SK.state.mission = {
      kind: "ship", opt, tier: opt.tier, baseLevel: opt.level, depth: 1, phase: "space",
      haul: { credits: 0, scrap: 0 },
    };
    showRun();
    shipSpacePhase();
  }

  // (re)start the ship-vs-ship phase for the current depth
  function shipSpacePhase() {
    const m = M(), save = S(), c = ctx(m);
    m.phase = "space";
    setScene("space");
    sceneBg(".run-stars", "assets/backgrounds/space-" + SK.slugify(m.opt.vessel.name) + ".png");
    setProgress([{ type: "boss" }], 0);
    const player = SK.makePlayerShip(save);
    const enemy = SK.makeEnemyShip({ level: c.level, name: m.opt.shipName, icon: m.opt.vessel.icon, sprite: m.opt.vessel.name, mul: c.mul });
    SK.applyAffixes(enemy, c.affixCount);
    m.player = player; m.enemy = enemy;
    travel(() => {
      SK.Combat.start({
        player, enemy, thresholdPct: 0.10,
        onThreshold: shipChoice,
        onEnd: (win) => { if (!win) return missionFail("Your ship " + save.shipName + " was destroyed (depth " + m.depth + ")."); shipDestroyed(); },
      });
    });
  }

  function shipChoice() {
    const ch = SK.Combat.choiceEl();
    ch.innerHTML =
      `<h3>Enemy Ship Crippled!</h3>` +
      `<p>Finish it for a quick salvage, or board it to fight the crew for far greater spoils.</p>` +
      `<div class="choice-btns">` +
        `<button class="btn btn-danger" data-destroy><span style="font-size:1.5rem">💥</span>Destroy<br><small>Salvage 1 part</small></button>` +
        `<button class="btn btn-gold" data-board><span style="font-size:1.5rem">🚪</span>Board<br><small>Fight crew • big loot</small></button>` +
      `</div>`;
    ch.classList.add("show");
    ch.querySelector("[data-destroy]").onclick = () => { ch.classList.remove("show"); shipDestroyed(); };
    ch.querySelector("[data-board]").onclick = () => { ch.classList.remove("show"); shipBoard(); };
  }

  function shipDestroyed() {
    const m = M(), save = S(), c = ctx(m);
    SK.Combat.stop();
    const e = $("#cb-enemy-0"); if (e) e.classList.add("dying");
    save.stats.shipsDefeated++;
    applyXP(Math.round(SK.xpForKill(c.level, true) * m.tier.credMul));
    addHaul(m);
    setTimeout(() => {
      const item = SK.generateItem({ domain: "ship", level: c.level, focusSlot: m.opt.focusSlot, rareBoost: 2 * c.rareMul });
      showLoot(item, () => shipSectorDone("💥"));
    }, 350);
  }

  function shipBoard() {
    const m = M(), save = S();
    save.stats.boarded++;
    m.phase = "boarding";
    m.player = SK.makePlayerCombatant(save);
    m.idx = 0;
    m.seq = [{ type: "minion" }, { type: "minion" }, { type: "minion" }, { type: "boss" }];
    UI.toast("Boarding " + m.opt.shipName + "…");
    setScene("corridor");
    sceneBg(".corridor-scene", "assets/backgrounds/corridor-" + SK.slugify(m.opt.vessel.name) + ".png");
    setProgress(m.seq, 0);
    travel(boardEncounter);
  }

  function boardEncounter() {
    const m = M(), save = S(), c = ctx(m);
    const isBoss = m.seq[m.idx].type === "boss";
    if (m.idx > 0) m.player.hp = Math.min(m.player.maxHp, m.player.hp + Math.round(m.player.maxHp * 0.15));
    setProgress(m.seq, m.idx);
    const enemies = buildParty("shipMinion", "shipBoss", isBoss, c);
    SK.Combat.start({
      player: m.player, enemies,
      onEnd: (win) => {
        if (!win) return missionFail("Your boarding party was wiped out aboard " + m.opt.shipName + ".");
        save.stats.kills += enemies.length;
        applyXP(partyXP(enemies, m));
        addHaul(m);
        const dom = isBoss ? "char" : Math.random() < 0.3 ? "ship" : "char";
        const item = SK.generateItem({
          domain: dom, level: c.level + (isBoss ? 1 : 0),
          focusSlot: dom === "ship" ? m.opt.focusSlot : undefined,
          luck: SK.getCharStats(save).luck, rareBoost: (isBoss ? 3 : 1.4) * c.rareMul,
        });
        showLoot(item, () => {
          refreshFootPlayer(m);
          m.idx++;
          if (m.idx >= m.seq.length) {
            UI.toast("Captain's coffer found! 🎁", "gold");
            const coffer = SK.generateItem({ domain: "ship", level: c.level + 1, focusSlot: m.opt.focusSlot, rareBoost: 3.5 * c.rareMul });
            showLoot(coffer, () => { save.stats.shipsDefeated++; shipSectorDone("🏴‍☠️"); });
          } else travel(boardEncounter);
        });
      },
    });
  }

  // after a ship sector (destroy salvage or full board) — extract or hunt deeper
  function shipSectorDone(emoji) {
    const m = M(), c = ctx(m);
    depthChoice(emoji,
      () => { // hunt deeper: a fresh, tougher pirate
        m.depth++;
        m.opt.vessel = SK.pick(SK.ENEMY_POOLS.ships);
        m.opt.shipName = SK.pick(SK.PIRATE_SHIP_PREFIX) + " " + SK.pick(SK.PIRATE_SHIP_SUFFIX);
        m.opt.focusSlot = SK.pick(Object.keys(SK.SHIP_SLOTS));
        UI.toast("Hunting deeper — depth " + m.depth + "…");
        shipSpacePhase();
      },
      () => { bankHaul(m); applyXP(25 + c.level * 4);
        missionDone(emoji === "💥" ? "💥" : "🏴‍☠️", "Sector Cleared!", "Extracted after depth " + m.depth + "."); });
  }

  SK.Mission = { startPlanet, startShip };
})();

/* ===================================================================
   SPACE KINGS — missions.js
   Planet Exploration and Ship Battle flows.
   Foot chains = 3 minions + boss, each drops a loot card.
   Ship battle = ship-vs-ship; at 10% enemy HP choose Destroy or Board.
   =================================================================== */
(function () {
  const SK = (window.SK = window.SK || {});
  const $ = (s) => document.querySelector(s);
  const UI = SK.UI;
  const S = () => SK.state.save;
  const M = () => SK.state.mission;

  /* ---------------- shared run-screen helpers ---------------- */
  function showRun() { UI.showScreen("screen-run"); }

  // scene modes: 'space' = starfield (ship-vs-ship), 'planet' = alien surface +
  // first-person weapon, 'corridor' = grid (on-foot boarding / default)
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
    $("#fp-gun").innerHTML =
      '<div class="fp-gun-inner"><div id="fp-laser" class="fp-laser"></div><div id="fp-flash" class="fp-flash"></div>' +
      SK.UI.fpGunSVG(S().appearance && S().appearance.skin) + "</div>";
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
    const g = $("#fp-gun"); if (g) g.classList.add("running"); // bigger weapon bob while moving
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
      if (action === "equip") {
        SK.equipItem(S(), item);
        UI.toast("Equipped " + item.name, "good");
      } else {
        const v = SK.sellItem(S(), item);
        UI.toast("Sold for 💰 " + v, "gold");
      }
      cb();
    });
  }

  // Rebuild the on-foot player's stats from the save (e.g. after equipping
  // loot mid-run) while preserving the current HP fraction.
  function refreshFootPlayer(m) {
    const frac = m.player.hp / m.player.maxHp;
    const np = SK.makePlayerCombatant(S());
    np.hp = Math.max(1, Math.round(np.maxHp * frac));
    m.player = np;
  }

  function endModal(emoji, title, body, win) {
    SK.Combat.stop();
    UI.modal({
      title,
      body: `<span class="big-emoji">${emoji}</span>${body}`,
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
  function rewardHint(level) {
    const pl = S().level;
    const r = level >= pl + 2 ? "epic" : level >= pl + 1 ? "rare" : "uncommon";
    return `<span class="loot-chip r-${r}">✦ up to ${SK.RARITIES[r].name}</span>`;
  }
  function targetCard(icon, name, sub, chips) {
    return `<div class="target-card"><div class="tc-icon">${icon}</div><div class="tc-main">` +
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
    const save = S();
    const opts = [];
    for (let i = 0; i < 3; i++) {
      opts.push({
        biome: SK.pick(SK.PLANET_BIOMES),
        name: SK.pick(SK.PLANET_NAMES) + "-" + SK.randInt(1, 9),
        level: Math.max(1, save.level + SK.randInt(-1, 2)),
        focusSlot: SK.pick(Object.keys(SK.CHAR_SLOTS)),
      });
    }
    const cards = opts.map((o) => {
      const sd = SK.CHAR_SLOTS[o.focusSlot];
      return targetCard(o.biome.icon, "Planet " + o.name,
        o.biome.name + " world • Threat Lv " + o.level,
        `<span class="loot-chip">${sd.icon} ${sd.label}s</span>` + rewardHint(o.level));
    });
    renderSelect("Planet Exploration",
      "Scanners found three worlds. Pick one — clear 3 encounters and the boss.",
      cards, (i) => beginPlanet(opts[i]));
  }

  function beginPlanet(opt) {
    SK.state.mission = {
      kind: "planet", opt, level: opt.level, idx: 0,
      player: SK.makePlayerCombatant(S()),
      seq: [{ type: "minion" }, { type: "minion" }, { type: "minion" }, { type: "boss" }],
    };
    showRun();
    $(".planet-scene").innerHTML = SK.UI.planetSceneSVG(SK.PLANET_PALETTES[opt.biome.name] || SK.PLANET_PALETTES.default);
    setScene("planet");
    setProgress(M().seq, 0);
    travel(planetEncounter);
  }

  function planetEncounter() {
    const m = M(), save = S();
    const isBoss = m.seq[m.idx].type === "boss";
    if (m.idx > 0) m.player.hp = Math.min(m.player.maxHp, m.player.hp + Math.round(m.player.maxHp * 0.15));
    setProgress(m.seq, m.idx);
    const enemy = SK.makeEnemyCombatant({ type: isBoss ? "planetBoss" : "planetMinion", level: m.level + (isBoss ? 1 : 0), isBoss });
    SK.Combat.start({
      player: m.player, enemy, isBoss,
      onEnd: (win) => {
        if (!win) return missionFail("Your captain fell on Planet " + m.opt.name + ".");
        save.stats.kills++;
        applyXP(SK.xpForKill(m.level, isBoss));
        const cs = SK.getCharStats(save);
        const item = SK.generateItem({
          domain: "char", level: m.level + (isBoss ? 1 : 0),
          focusSlot: m.opt.focusSlot, luck: cs.luck, rareBoost: isBoss ? 2.5 : 1,
        });
        showLoot(item, () => {
          refreshFootPlayer(m);
          m.idx++;
          if (m.idx >= m.seq.length) {
            save.stats.planetsCleared++;
            applyXP(40 + m.level * 5);
            missionDone("🪐", "Planet Cleared!", "Planet " + m.opt.name + " explored and looted.");
          } else travel(planetEncounter);
        });
      },
    });
  }

  /* =================================================================
     SHIP BATTLE
     ================================================================= */
  function startShip() {
    const save = S();
    const opts = [];
    for (let i = 0; i < 3; i++) {
      const vessel = SK.pick(SK.ENEMY_POOLS.ships); // hull type -> drives the sprite
      opts.push({
        shipName: SK.pick(SK.PIRATE_SHIP_PREFIX) + " " + SK.pick(SK.PIRATE_SHIP_SUFFIX),
        vessel,
        icon: vessel.icon,
        level: Math.max(1, save.level + SK.randInt(-1, 2)),
        focusSlot: SK.pick(Object.keys(SK.SHIP_SLOTS)),
      });
    }
    const cards = opts.map((o) => {
      const sd = SK.SHIP_SLOTS[o.focusSlot];
      return targetCard(o.icon, o.shipName,
        o.vessel.name + "-class • Threat Lv " + o.level,
        `<span class="loot-chip">${sd.icon} ${sd.label}</span>` + rewardHint(o.level));
    });
    renderSelect("Ship Battle",
      "Three pirate ships on the scope. Engage one — destroy it for salvage, or board for the real haul.",
      cards, (i) => beginShip(opts[i]));
  }

  function beginShip(opt) {
    const save = S();
    SK.state.mission = { kind: "ship", opt, level: opt.level, phase: "space" };
    showRun();
    setScene("space");
    setProgress([{ type: "boss" }], 0);
    const player = SK.makePlayerShip(save);
    const enemy = SK.makeEnemyShip({ level: opt.level, name: opt.shipName, icon: opt.vessel.icon, sprite: opt.vessel.name });
    M().player = player; M().enemy = enemy;
    travel(() => {
      SK.Combat.start({
        player, enemy, thresholdPct: 0.10,
        onThreshold: shipChoice,
        onEnd: (win) => {
          if (!win) return missionFail("Your ship " + save.shipName + " was destroyed in the void.");
          shipDestroyed(); // outright kill before the 10% prompt
        },
      });
    });
  }

  function shipChoice() {
    const ch = SK.Combat.choiceEl();
    ch.innerHTML =
      `<h3>Enemy Ship Crippled!</h3>` +
      `<p>The pirate vessel is venting atmosphere. Finish it for a quick salvage, or board it to fight the crew for far greater spoils.</p>` +
      `<div class="choice-btns">` +
        `<button class="btn btn-danger" data-destroy><span style="font-size:1.5rem">💥</span>Destroy<br><small>Salvage 1 part</small></button>` +
        `<button class="btn btn-gold" data-board><span style="font-size:1.5rem">🚪</span>Board<br><small>Fight crew • big loot</small></button>` +
      `</div>`;
    ch.classList.add("show");
    ch.querySelector("[data-destroy]").onclick = () => { ch.classList.remove("show"); shipDestroyed(); };
    ch.querySelector("[data-board]").onclick = () => { ch.classList.remove("show"); shipBoard(); };
  }

  function shipDestroyed() {
    const m = M(), save = S();
    SK.Combat.stop();
    const e = $("#cb-enemy"); if (e) e.classList.add("dying");
    save.stats.shipsDefeated++;
    applyXP(SK.xpForKill(m.level, true));
    setTimeout(() => {
      const item = SK.generateItem({ domain: "ship", level: m.level, focusSlot: m.opt.focusSlot, rareBoost: 2 });
      showLoot(item, () => {
        applyXP(30 + m.level * 4);
        missionDone("💥", "Ship Destroyed", "You salvaged parts from the wreck of " + m.opt.shipName + ".");
      });
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
    setScene("corridor"); // boarding happens on-foot inside the ship's corridors
    setProgress(m.seq, 0);
    travel(boardEncounter);
  }

  function boardEncounter() {
    const m = M(), save = S();
    const isBoss = m.seq[m.idx].type === "boss";
    if (m.idx > 0) m.player.hp = Math.min(m.player.maxHp, m.player.hp + Math.round(m.player.maxHp * 0.15));
    setProgress(m.seq, m.idx);
    const enemy = SK.makeEnemyCombatant({ type: isBoss ? "shipBoss" : "shipMinion", level: m.level + (isBoss ? 1 : 0), isBoss });
    SK.Combat.start({
      player: m.player, enemy, isBoss,
      onEnd: (win) => {
        if (!win) return missionFail("Your boarding party was wiped out aboard " + m.opt.shipName + ".");
        save.stats.kills++;
        applyXP(SK.xpForKill(m.level, isBoss));
        const cs = SK.getCharStats(save);
        const dom = isBoss ? "char" : Math.random() < 0.3 ? "ship" : "char";
        const item = SK.generateItem({
          domain: dom, level: m.level + (isBoss ? 1 : 0),
          focusSlot: dom === "ship" ? m.opt.focusSlot : undefined,
          luck: cs.luck, rareBoost: isBoss ? 3 : 1.4,
        });
        showLoot(item, () => {
          refreshFootPlayer(m);
          m.idx++;
          if (m.idx >= m.seq.length) {
            // captain's coffer — guaranteed ship part with a big rarity boost
            UI.toast("Captain's coffer found! 🎁", "gold");
            const coffer = SK.generateItem({ domain: "ship", level: m.level + 1, focusSlot: m.opt.focusSlot, rareBoost: 3.5 });
            showLoot(coffer, () => {
              save.stats.shipsDefeated++;
              applyXP(60 + m.level * 6);
              missionDone("🏴‍☠️", "Ship Captured!", "You looted " + m.opt.shipName + " and cracked the captain's coffer.");
            });
          } else travel(boardEncounter);
        });
      },
    });
  }

  SK.Mission = { startPlanet, startShip };
})();

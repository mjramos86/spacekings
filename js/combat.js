/* ===================================================================
   SPACE KINGS — combat.js
   Automatic ATB combat. The enemy side is a PARTY of 1-3 combatants.
   The player focus-fires (minions first, boss last); every living enemy
   attacks the player. Ship-vs-ship is just a party of one (with the
   Destroy/Board threshold hook).
   =================================================================== */
(function () {
  const SK = (window.SK = window.SK || {});
  const $ = (s) => document.querySelector(s);

  const THRESH = 55;     // gauge needed to act
  const TICK_MS = 110;   // gauge tick
  const MAX_TICKS = 3000;

  function pct(cur, max) { return Math.max(0, Math.min(1, cur / max)); }
  const dead = (e) => e._dead || e.hp <= 0;

  const Combat = {
    _timer: null,
    _cur: null,

    start(cfg) {
      this.stop();
      const player = cfg.player;
      const enemies = (cfg.enemies && cfg.enemies.length ? cfg.enemies : [cfg.enemy]).filter(Boolean);
      const isShip = !!(player.isShip || enemies.some((e) => e.isShip));
      enemies.forEach((e) => { e._dead = false; });

      const view = $("#combat-view");
      view.innerHTML = this._html(player, enemies, isShip);
      view.classList.add("show");

      const state = {
        player, enemies, cfg, isShip,
        pGauge: 0, gauges: enemies.map(() => 0), ticks: 0,
        ended: false, paused: false, thresholdFired: false,
      };
      this._cur = state;
      this._refreshBars(state);
      this._timer = setInterval(() => this._tick(state), TICK_MS);
    },

    stop() { if (this._timer) clearInterval(this._timer); this._timer = null; },
    choiceEl() { return $("#cb-choice"); },
    finish(win) { if (this._cur) this._end(this._cur, win); },

    /* ---------- render ---------- */
    _html(player, enemies, isShip) {
      const n = enemies.length;
      const hasBoss = enemies.some((e) => e.isBoss);
      // size custom-properties tuned so 1-3 enemies fit the row on any width
      // each sprite fits an object-fit box: height (rem) x width min(vw,px)
      let es, mw, bs = "", bmw = "";
      if (isShip) { es = "16rem"; mw = "min(72vw,380px)"; }
      else if (hasBoss) {
        bs = n >= 3 ? "13rem" : n === 2 ? "15rem" : "16.5rem";
        bmw = n >= 3 ? "min(40vw,210px)" : n === 2 ? "min(50vw,260px)" : "min(66vw,340px)";
        es = "9rem"; mw = "min(28vw,150px)";
      } else {
        es = n >= 3 ? "9.5rem" : n === 2 ? "10.5rem" : "12rem";
        mw = n >= 3 ? "min(28vw,150px)" : n === 2 ? "min(42vw,220px)" : "min(60vw,320px)";
      }
      const rowStyle = `--es:${es};--mw:${mw};` + (bs ? `--bs:${bs};--bmw:${bmw};` : "");

      const stacks = enemies.map((e, i) => {
        const cls = e.isBoss ? "boss" : e.isShip ? "ship" : "";
        const showName = n === 1 || e.isBoss;
        const bars =
          (e.maxShield > 0 ? `<div class="hpbar"><div class="sh-fill" id="cb-e-sh-${i}"></div></div>` : "") +
          `<div class="hpbar"><div class="hp-fill" id="cb-e-hp-${i}"></div><div class="hp-text" id="cb-e-ht-${i}"></div></div>`;
        const affixes = e.affixes && e.affixes.length
          ? `<div class="affixes">${e.affixes.map((k) => (SK.AFFIXES[k] || {}).icon || "").join(" ")}</div>` : "";
        return `<div class="enemy-stack" id="cb-stack-${i}">` +
          (e.isBoss ? `<div class="boss-tag">◆ BOSS ◆</div>` : "") +
          (showName ? `<div class="combatant-name">${e.name}</div>` : "") +
          affixes +
          bars +
          `<div class="enemy-sprite ${cls}" id="cb-enemy-${i}">` +
            `<span class="enemy-emoji">${e.icon}</span>` +
            (e.sprite ? `<img class="enemy-img" alt="" src="${e.sprite}" onload="this.parentNode.classList.add('hasimg')" onerror="this.remove()">` : "") +
          `</div></div>`;
      }).join("");

      const playerBars =
        (player.maxShield > 0 ? `<div class="hpbar"><div class="sh-fill" id="cb-p-sh"></div></div>` : "") +
        `<div class="hpbar"><div class="hp-fill" id="cb-p-hp"></div><div class="hp-text" id="cb-p-ht"></div></div>`;
      const robots = player.robots && player.robots.length
        ? `<div class="robots-row">${player.robots.map((r) => `<span class="rb">${r}</span>`).join("")}</div>`
        : "";

      return (
        `<div class="enemy-area"><div class="enemy-row" style="${rowStyle}">${stacks}</div></div>` +
        `<div class="player-area">` +
          (isShip ? "" : `<div class="player-weapon" id="cb-weapon">${player.weaponIcon || "⚔️"}</div>`) +
          robots +
          `<div class="player-bars">` +
            `<div class="bar-label"><span>${isShip ? "🚀 " + player.name : "You — " + player.name}</span></div>` +
            playerBars +
          `</div>` +
        `</div>` +
        `<div class="combat-choice" id="cb-choice"></div>`
      );
    },

    _refreshBars(st) {
      st.enemies.forEach((e, i) => {
        const hp = $("#cb-e-hp-" + i), ht = $("#cb-e-ht-" + i), sh = $("#cb-e-sh-" + i);
        if (hp) hp.style.transform = `scaleX(${pct(e.hp, e.maxHp)})`;
        if (ht) ht.textContent = Math.max(0, Math.ceil(e.hp)) + " / " + e.maxHp;
        if (sh) sh.style.transform = `scaleX(${pct(e.shield, e.maxShield)})`;
      });
      const p = st.player, ph = $("#cb-p-hp"), pht = $("#cb-p-ht"), psh = $("#cb-p-sh");
      if (ph) ph.style.transform = `scaleX(${pct(p.hp, p.maxHp)})`;
      if (pht) pht.textContent = Math.max(0, Math.ceil(p.hp)) + " / " + p.maxHp;
      if (psh) psh.style.transform = `scaleX(${pct(p.shield, p.maxShield)})`;
    },

    // player focuses: living minions first, boss last
    _target(st) {
      let best = -1, rank = 99;
      st.enemies.forEach((e, i) => {
        if (dead(e)) return;
        const r = e.isBoss ? 1 : 0;
        if (r < rank) { rank = r; best = i; }
      });
      return best;
    },

    _tick(st) {
      if (st.ended || st.paused) return;
      st.ticks++;
      if (st.ticks > MAX_TICKS) {
        const eHp = st.enemies.reduce((s, e) => s + Math.max(0, e.hp), 0);
        return this._end(st, pct(st.player.hp, st.player.maxHp) >= pct(eHp, 1));
      }
      st.pGauge += st.player.spd;
      st.enemies.forEach((e, i) => { if (!dead(e)) st.gauges[i] += e.spd; });

      if (st.pGauge >= THRESH) {
        st.pGauge -= THRESH;
        const t = this._target(st);
        if (t >= 0) {
          this._attack(st, st.player, st.enemies[t], "player", t);
          if (this._check(st)) return;
          if (this._threshold(st)) return;
        }
      }
      for (let i = 0; i < st.enemies.length; i++) {
        if (st.ended || st.paused) return;
        const e = st.enemies[i];
        if (dead(e)) continue;
        if (st.gauges[i] >= THRESH) {
          st.gauges[i] -= THRESH;
          this._attack(st, e, st.player, "enemy", i);
          if (this._check(st)) return;
        }
      }
    },

    _attack(st, atk, def, side, idx) {
      if (side === "player") {
        const w = $("#cb-weapon"); if (w) { w.classList.remove("attack"); void w.offsetWidth; w.classList.add("attack"); }
        const e = $("#cb-enemy-" + idx); if (e) { e.classList.remove("hit"); void e.offsetWidth; e.classList.add("hit"); }
        const sc = document.getElementById("run-scene");
        if (sc && (sc.classList.contains("planet") || sc.classList.contains("corridor"))) {
          const fg = document.getElementById("fp-gun");
          if (fg) { fg.classList.remove("fire"); void fg.offsetWidth; fg.classList.add("fire"); }
        }
      } else {
        const view = $("#combat-view"); if (view) { view.classList.remove("shake"); void view.offsetWidth; view.classList.add("shake"); }
      }

      const defEl = side === "player" ? $("#cb-enemy-" + idx) : ($("#cb-weapon") || $(".player-area"));

      if (Math.random() * 100 < (def.evasionPct || 0)) { this._float(defEl, "MISS", "miss"); return; }

      const mitig = 100 / (100 + def.def * 2);
      const crit = Math.random() * 100 < (atk.critPct || 0);
      const critMult = crit ? 1 + (atk.critDmgPct || 0) / 100 : 1;
      let dmg = Math.max(1, Math.round(atk.atk * mitig * critMult * (0.9 + Math.random() * 0.2)));

      if (def.shield > 0) {
        const soak = Math.min(def.shield, dmg);
        def.shield -= soak; dmg -= soak;
        if (soak > 0) this._float(defEl, "-" + soak, "shield");
      }
      if (dmg > 0) {
        def.hp -= dmg;
        this._float(defEl, dmg + (crit ? "!" : ""), crit ? "crit" : side === "player" ? "player" : "enemy");
      }
      // enemy affix self-heal (vampiric / regen) when an enemy attacks
      if (side === "enemy") {
        let heal = 0;
        if (atk.lifesteal && dmg > 0) heal += Math.round(dmg * atk.lifesteal);
        if (atk.regen) heal += atk.regen;
        if (heal > 0 && atk.hp > 0) {
          atk.hp = Math.min(atk.maxHp, atk.hp + heal);
          this._float($("#cb-enemy-" + idx), "+" + heal, "heal");
        }
      }
      // enemy died?
      if (side === "player" && def.hp <= 0 && !def._dead) {
        def._dead = true;
        if (defEl) defEl.classList.add("dying");
        const stk = $("#cb-stack-" + idx); if (stk) stk.classList.add("dead");
      }
      this._refreshBars(st);
    },

    _float(el, txt, cls) {
      if (!el) return;
      const view = $("#combat-view");
      const r = el.getBoundingClientRect(), vr = view.getBoundingClientRect();
      const d = document.createElement("div");
      d.className = "dmg " + cls; d.textContent = txt;
      d.style.left = (r.left - vr.left + r.width / 2 + (Math.random() * 44 - 22)) + "px";
      d.style.top = (r.top - vr.top + r.height / 3) + "px";
      view.appendChild(d);
      setTimeout(() => d.remove(), 1000);
    },

    _check(st) {
      if (st.player.hp <= 0) { this._end(st, false); return true; }
      if (st.enemies.every(dead)) { this._end(st, true); return true; }
      return false;
    },

    // Destroy/Board prompt — only for single-enemy ship battles
    _threshold(st) {
      const cfg = st.cfg;
      if (!cfg.thresholdPct || st.thresholdFired || st.enemies.length !== 1) return false;
      const e = st.enemies[0];
      if (e.hp > 0 && pct(e.hp, e.maxHp) <= cfg.thresholdPct) {
        st.thresholdFired = true; st.paused = true; this.stop();
        if (cfg.onThreshold) cfg.onThreshold();
        return true;
      }
      return false;
    },

    _end(st, win) {
      if (st.ended) return;
      st.ended = true;
      this.stop();
      setTimeout(() => { if (st.cfg.onEnd) st.cfg.onEnd(win); }, win ? 640 : 420);
    },
  };

  SK.Combat = Combat;
})();

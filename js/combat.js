/* ===================================================================
   SPACE KINGS — combat.js
   Automatic combat engine (used for both on-foot and ship battles).
   Active-Time-Battle gauges drive auto attacks; the player watches.
   Supports a "threshold" hook so ship battles can offer Destroy/Board
   when the enemy drops to low HP.
   =================================================================== */
(function () {
  const SK = (window.SK = window.SK || {});
  const $ = (s) => document.querySelector(s);

  const THRESH = 55;     // gauge needed to act
  const TICK_MS = 110;   // gauge tick
  const MAX_TICKS = 2500;

  function pct(cur, max) { return Math.max(0, Math.min(1, cur / max)); }

  const Combat = {
    _timer: null,
    _cur: null,

    start(cfg) {
      this.stop();
      const player = cfg.player, enemy = cfg.enemy;
      const isShip = !!(player.isShip || enemy.isShip);

      // ---- render scene ----
      const view = $("#combat-view");
      view.innerHTML = this._html(player, enemy, isShip);
      view.classList.add("show");

      const state = {
        player, enemy, cfg, isShip,
        pGauge: 0, eGauge: 0, ticks: 0,
        ended: false, paused: false, thresholdFired: false,
      };
      this._cur = state;
      this._refreshBars(state);

      this._timer = setInterval(() => this._tick(state), TICK_MS);
    },

    stop() {
      if (this._timer) clearInterval(this._timer);
      this._timer = null;
    },

    /* ---- choice overlay access (ship board/destroy) ---- */
    choiceEl() { return $("#cb-choice"); },

    /* end combat from outside (used after threshold handled) */
    finish(win) {
      const st = this._cur;
      if (!st) return;
      this._end(st, win);
    },

    /* ---------- internals ---------- */
    _html(player, enemy, isShip) {
      const enemyBars =
        (enemy.maxShield > 0 ? `<div class="hpbar"><div class="sh-fill" id="cb-e-sh"></div></div>` : "") +
        `<div class="hpbar"><div class="hp-fill" id="cb-e-hp"></div><div class="hp-text" id="cb-e-ht"></div></div>`;
      const playerBars =
        (player.maxShield > 0 ? `<div class="hpbar"><div class="sh-fill" id="cb-p-sh"></div></div>` : "") +
        `<div class="hpbar"><div class="hp-fill" id="cb-p-hp"></div><div class="hp-text" id="cb-p-ht"></div></div>`;
      const robots = player.robots && player.robots.length
        ? `<div class="robots-row">${player.robots.map((r) => `<span class="rb">${r}</span>`).join("")}</div>`
        : "";
      return (
        `<div class="enemy-area">` +
          `<div class="enemy-sprite ${enemy.isBoss ? "boss" : ""}" id="cb-enemy">${enemy.icon}</div>` +
          (enemy.isBoss ? `<div class="boss-tag">◆ BOSS ◆</div>` : "") +
          `<div class="combatant-name">${enemy.name}</div>` +
          enemyBars +
        `</div>` +
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
      const e = st.enemy, p = st.player;
      const eh = $("#cb-e-hp"), eht = $("#cb-e-ht"), ph = $("#cb-p-hp"), pht = $("#cb-p-ht");
      if (eh) eh.style.transform = `scaleX(${pct(e.hp, e.maxHp)})`;
      if (eht) eht.textContent = Math.max(0, Math.ceil(e.hp)) + " / " + e.maxHp;
      if (ph) ph.style.transform = `scaleX(${pct(p.hp, p.maxHp)})`;
      if (pht) pht.textContent = Math.max(0, Math.ceil(p.hp)) + " / " + p.maxHp;
      const esh = $("#cb-e-sh"), psh = $("#cb-p-sh");
      if (esh) esh.style.transform = `scaleX(${pct(e.shield, e.maxShield)})`;
      if (psh) psh.style.transform = `scaleX(${pct(p.shield, p.maxShield)})`;
    },

    _tick(st) {
      if (st.ended || st.paused) return;
      st.ticks++;
      if (st.ticks > MAX_TICKS) { // safety: decide by remaining HP fraction
        return this._end(st, pct(st.player.hp, st.player.maxHp) >= pct(st.enemy.hp, st.enemy.maxHp));
      }
      st.pGauge += st.player.spd;
      st.eGauge += st.enemy.spd;

      if (st.pGauge >= THRESH) {
        st.pGauge -= THRESH;
        this._attack(st, st.player, st.enemy, "player");
        if (this._check(st)) return;
        if (this._threshold(st)) return;
      }
      if (st.eGauge >= THRESH && !st.ended && !st.paused) {
        st.eGauge -= THRESH;
        this._attack(st, st.enemy, st.player, "enemy");
        if (this._check(st)) return;
      }
    },

    _attack(st, atk, def, side) {
      // animations
      if (side === "player") {
        const w = $("#cb-weapon"); if (w) { w.classList.remove("attack"); void w.offsetWidth; w.classList.add("attack"); }
        const e = $("#cb-enemy"); if (e) { e.classList.remove("hit"); void e.offsetWidth; e.classList.add("hit"); }
      } else {
        const view = $("#combat-view"); if (view) { view.classList.remove("shake"); void view.offsetWidth; view.classList.add("shake"); }
      }

      const defEl = side === "player" ? $("#cb-enemy") : ($("#cb-weapon") || $(".player-area"));

      // evasion
      if (Math.random() * 100 < (def.evasionPct || 0)) {
        this._float(defEl, "MISS", "miss");
        return;
      }

      const mitig = 100 / (100 + def.def * 2);
      const crit = Math.random() * 100 < (atk.critPct || 0);
      const critMult = crit ? 1 + (atk.critDmgPct || 0) / 100 : 1;
      const variance = 0.9 + Math.random() * 0.2;
      let dmg = Math.max(1, Math.round(atk.atk * mitig * critMult * variance));

      // shield soaks first
      if (def.shield > 0) {
        const soak = Math.min(def.shield, dmg);
        def.shield -= soak; dmg -= soak;
        if (soak > 0) this._float(defEl, "-" + soak, "shield");
      }
      if (dmg > 0) {
        def.hp -= dmg;
        const cls = crit ? "crit" : side === "player" ? "player" : "enemy";
        this._float(defEl, dmg + (crit ? "!" : ""), cls);
      }
      this._refreshBars(st);
    },

    _float(el, txt, cls) {
      if (!el) return;
      const view = $("#combat-view");
      const r = el.getBoundingClientRect();
      const vr = view.getBoundingClientRect();
      const d = document.createElement("div");
      d.className = "dmg " + cls;
      d.textContent = txt;
      d.style.left = (r.left - vr.left + r.width / 2 + (Math.random() * 44 - 22)) + "px";
      d.style.top = (r.top - vr.top + r.height / 3) + "px";
      view.appendChild(d);
      setTimeout(() => d.remove(), 1000);
    },

    _check(st) {
      if (st.enemy.hp <= 0) { this._end(st, true); return true; }
      if (st.player.hp <= 0) { this._end(st, false); return true; }
      return false;
    },

    _threshold(st) {
      const cfg = st.cfg;
      if (!cfg.thresholdPct || st.thresholdFired) return false;
      if (st.enemy.hp > 0 && pct(st.enemy.hp, st.enemy.maxHp) <= cfg.thresholdPct) {
        st.thresholdFired = true;
        st.paused = true;
        this.stop();
        if (cfg.onThreshold) cfg.onThreshold();
        return true;
      }
      return false;
    },

    _end(st, win) {
      if (st.ended) return;
      st.ended = true;
      this.stop();
      if (win) {
        const e = $("#cb-enemy"); if (e) e.classList.add("dying");
      }
      setTimeout(() => { if (st.cfg.onEnd) st.cfg.onEnd(win); }, win ? 620 : 400);
    },
  };

  SK.Combat = Combat;
})();

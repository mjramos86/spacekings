/* ===================================================================
   SPACE KINGS — cards.js
   The loot card-swipe mechanic. Drag left = sell, right = equip.
   Works with mouse and touch via Pointer Events. Buttons mirror it.
   The card shows the stat gained/lost vs the currently equipped item.
   =================================================================== */
(function () {
  const SK = (window.SK = window.SK || {});
  const $ = (s) => document.querySelector(s);
  const COMMIT = 110; // px drag distance to commit a choice

  const Cards = {
    _item: null,
    _cb: null,
    _dragging: false,
    _startX: 0,
    _dx: 0,

    init() {
      const card = $("#loot-card");
      card.addEventListener("pointerdown", (e) => this._down(e));
      window.addEventListener("pointermove", (e) => this._move(e));
      window.addEventListener("pointerup", () => this._up());
      window.addEventListener("pointercancel", () => this._up());
      $("#card-sell").onclick = () => { if (this._item) this._fly(-1); };
      $("#card-equip").onclick = () => { if (this._item) this._fly(1); };
    },

    show(item, cb) {
      this._item = item;
      this._cb = cb;
      const rar = SK.RARITIES[item.rarity];

      $("#loot-card .loot-rarity-bar").style.background = rar.color;
      $("#loot-card .loot-icon").textContent = item.icon;
      const nameEl = $("#loot-card .loot-name");
      nameEl.textContent = item.name;
      nameEl.style.color = rar.color;
      const rarEl = $("#loot-card .loot-rarity");
      rarEl.textContent = rar.name + " • " + item.slotLabel;
      rarEl.style.color = rar.color;

      // stat deltas
      const deltas = SK.statDelta(SK.state.save, item);
      const equipped = SK.state.save.equipped[item.domain][item.slot];
      const rows = deltas.map((d) => {
        const cls = d.delta > 0 ? "delta-up" : d.delta < 0 ? "delta-down" : "delta-zero";
        const deltaTxt = d.delta === 0 ? "—" : SK.UI.fmtDelta(d.meta, d.delta);
        return (
          `<div class="loot-stat">` +
          `<span class="ls-ic">${d.meta.icon}</span>` +
          `<span class="ls-name">${d.meta.label}</span>` +
          `<span class="ls-new">${SK.UI.fmtStat(d.meta, d.to)}</span>` +
          `<span class="ls-delta ${cls}">${deltaTxt}</span>` +
          `</div>`
        );
      }).join("");
      const header = equipped
        ? `<div class="muted center" style="font-size:.7rem;margin-bottom:4px">new value · change vs equipped</div>`
        : `<div class="muted center" style="font-size:.7rem;margin-bottom:4px">slot is empty — all stats are a gain</div>`;
      $("#loot-card .loot-stats").innerHTML = header + rows;

      $("#loot-card .loot-slot").textContent = item.domain === "char" ? "Captain Gear" : "Ship Part";
      $("#loot-card .loot-value").textContent = "Sell ▸ 💰 " + item.value;

      const card = $("#loot-card");
      card.classList.remove("snap");
      card.style.transform = "";
      const ov = $("#card-overlay");
      ov.classList.remove("hint-left", "hint-right");
      ov.classList.add("show");
    },

    _down(e) {
      if (!this._item) return;
      this._dragging = true;
      this._startX = e.clientX;
      this._dx = 0;
      $("#loot-card").classList.remove("snap");
      try { $("#loot-card").setPointerCapture(e.pointerId); } catch (_) {}
    },
    _move(e) {
      if (!this._dragging) return;
      this._dx = e.clientX - this._startX;
      this._apply(this._dx);
    },
    _up() {
      if (!this._dragging) return;
      this._dragging = false;
      if (this._dx > COMMIT) this._fly(1);
      else if (this._dx < -COMMIT) this._fly(-1);
      else this._snapBack();
    },

    _apply(dx) {
      const card = $("#loot-card");
      card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
      const ov = $("#card-overlay");
      ov.classList.toggle("hint-right", dx > 40);
      ov.classList.toggle("hint-left", dx < -40);
    },
    _snapBack() {
      const card = $("#loot-card");
      card.classList.add("snap");
      card.style.transform = "";
      $("#card-overlay").classList.remove("hint-left", "hint-right");
      this._dx = 0;
    },
    _fly(dir) {
      const card = $("#loot-card");
      const ov = $("#card-overlay");
      card.classList.add("snap");
      card.style.transform = `translateX(${dir * (window.innerWidth + 200)}px) rotate(${dir * 22}deg)`;
      ov.classList.toggle("hint-right", dir > 0);
      ov.classList.toggle("hint-left", dir < 0);
      const item = this._item, cb = this._cb;
      this._item = null; this._cb = null; this._dragging = false; this._dx = 0;
      setTimeout(() => {
        ov.classList.remove("show", "hint-left", "hint-right");
        card.classList.remove("snap");
        card.style.transform = "";
        if (cb) cb(dir > 0 ? "equip" : "sell", item);
      }, 240);
    },
  };

  SK.Cards = Cards;
})();

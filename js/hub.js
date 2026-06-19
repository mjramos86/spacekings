/* ===================================================================
   SPACE KINGS — hub.js
   The space station: captain sheet, ship bay, robotics, shop, backpack.
   =================================================================== */
(function () {
  const SK = (window.SK = window.SK || {});
  const $ = (s) => document.querySelector(s);
  const UI = SK.UI;

  /* ---------------- shared item rendering ---------------- */
  function metaFor(domain) { return domain === "char" ? SK.CHAR_STAT_META : SK.SHIP_STAT_META; }

  function statsAbsInline(item) {
    const meta = metaFor(item.domain);
    return Object.keys(item.stats)
      .map((k) => `<span>${meta[k].icon}${UI.fmtStat(meta[k], item.stats[k])}</span>`)
      .join(" ");
  }
  function deltaInline(item) {
    const ds = SK.statDelta(SK.state.save, item).filter((d) => d.delta !== 0);
    if (!ds.length) return `<span class="muted">no change vs equipped</span>`;
    return ds.map((d) => {
      const c = d.delta > 0 ? "delta-up" : "delta-down";
      return `<span class="${c}">${d.meta.icon}${UI.fmtDelta(d.meta, d.delta)}</span>`;
    }).join("  ");
  }
  function itemRow(item, actionsHTML, extraLine) {
    return (
      `<div class="item-row" data-rarity="${item.rarity}">` +
        `<div class="ir-icon">${item.icon}</div>` +
        `<div class="ir-main">` +
          `<div class="ir-name r-${item.rarity}">${item.name}${item.plus ? ' <span class="plus">+' + item.plus + "</span>" : ""}</div>` +
          `<div class="ir-meta">${SK.RARITIES[item.rarity].name} • ${item.slotLabel} • Lv ${item.level}</div>` +
          `<div class="ir-stats">${statsAbsInline(item)}</div>` +
          (extraLine ? `<div class="ir-stats">${extraLine}</div>` : "") +
        `</div>` +
        `<div class="ir-actions">${actionsHTML}</div>` +
      `</div>`
    );
  }

  function upgBtn(item, attr) {
    if (!SK.canUpgrade(item)) return `<button class="btn btn-ghost btn-sm" disabled>MAX +${item.plus || 0}</button>`;
    const c = SK.upgradeCost(item);
    return `<button class="btn btn-up btn-sm" ${attr}>⬆ 💰${c.credits} ⚙️${c.scrap}</button>`;
  }

  const Hub = {
    _rerender: null,

    refreshTop() {
      const s = SK.state.save;
      $("#hub-avatar").innerHTML = UI.avatarSVG(s.appearance, 46);
      $("#hub-name").textContent = s.name + "  ·  Lv " + s.level;
      $("#hub-credits").textContent = "💰 " + s.credits;
      const scrapEl = $("#hub-scrap"); if (scrapEl) scrapEl.textContent = "⚙️ " + (s.scrap || 0);
      const need = SK.xpToNext(s.level);
      $("#hub-xpfill").style.width = Math.min(100, (s.xp / need) * 100) + "%";
      $("#hub-xptext").textContent = "XP " + s.xp + " / " + need;
    },

    _panel(title, html, wire) {
      $("#panel-title").textContent = title;
      const c = $("#panel-content");
      c.innerHTML = html;
      UI.showScreen("screen-panel");
      if (wire) wire(c);
    },

    /* ===================== CAPTAIN & SHIP ===================== */
    openCharacter() { this._rerender = () => this._gear("char"); this._gear("char"); },
    openShip() { this._rerender = () => this._gear("ship"); this._gear("ship"); },

    _gear(domain) {
      const save = SK.state.save;
      const stats = domain === "char" ? SK.getCharStats(save) : SK.getShipStats(save);
      const meta = metaFor(domain);
      const slots = domain === "char" ? SK.CHAR_SLOTS : SK.SHIP_SLOTS;
      const equipped = save.equipped[domain];

      const power = domain === "char" ? SK.charPower(save) : SK.shipPower(save);
      const sheet = domain === "char"
        ? `<div class="sheet"><div class="sheet-av">${UI.avatarSVG(save.appearance, 84)}</div>` +
          `<div class="sheet-meta"><div class="sheet-name">${save.name}</div>` +
          `<div class="sheet-lvl">Captain • Level ${save.level}</div>` +
          `<div class="sheet-power">⚡ Power ${power}</div></div></div>`
        : `<div class="sheet"><div class="sheet-av" style="display:flex;align-items:center;justify-content:center;font-size:2.6rem">🚀</div>` +
          `<div class="sheet-meta"><div class="sheet-name">${save.shipName}</div>` +
          `<div class="sheet-lvl">Starship • Level ${save.level}</div>` +
          `<div class="sheet-power">⚡ Power ${power}</div></div></div>`;

      const statGrid = `<div class="stat-grid">` + Object.keys(meta).map((k) =>
        `<div class="stat-row"><span class="si">${meta[k].icon}</span><span class="sl">${meta[k].label}</span>` +
        `<span class="sv">${UI.fmtStat(meta[k], stats[k])}</span></div>`
      ).join("") + `</div>`;

      const slotGrid = `<h3 class="section-title">Equipment</h3><div class="slots">` +
        Object.keys(slots).map((k) => {
          const it = equipped[k];
          const def = slots[k];
          return `<div class="slot" data-slot="${k}" ${it ? `data-rarity="${it.rarity}"` : ""}>` +
            `<div class="slot-icon">${def.icon}</div><div class="slot-info">` +
            `<div class="slot-kind">${def.label}</div>` +
            (it ? `<div class="slot-name r-${it.rarity}">${it.name}${it.plus ? " +" + it.plus : ""}</div>`
                : `<div class="slot-empty">Empty — tap to equip</div>`) +
            `</div></div>`;
        }).join("") + `</div>`;

      const note = domain === "char"
        ? `<p class="muted center mt16" style="font-size:.76rem">Deployed robots also add to these stats. Tap a slot to swap gear from your backpack.</p>`
        : `<p class="muted center mt16" style="font-size:.76rem">Salvage and board pirate ships to upgrade your starship.</p>`;

      this._panel(domain === "char" ? "Captain" : "Ship Bay", sheet + statGrid + slotGrid + note, (c) => {
        c.querySelectorAll(".slot").forEach((el) =>
          el.addEventListener("click", () => this._picker(domain, el.dataset.slot)));
      });
    },

    _picker(domain, slotKey) {
      const save = SK.state.save;
      const slots = domain === "char" ? SK.CHAR_SLOTS : SK.SHIP_SLOTS;
      const def = slots[slotKey];
      const current = save.equipped[domain][slotKey];
      const list = save.inventory
        .filter((it) => it.domain === domain && it.slot === slotKey)
        .sort((a, b) => SK.RARITY_ORDER.indexOf(b.rarity) - SK.RARITY_ORDER.indexOf(a.rarity));

      const curHTML = current
        ? `<div class="muted" style="font-size:.72rem;text-align:left;margin-bottom:6px">Equipped</div>` +
          itemRow(current, upgBtn(current, "data-upg-eq") + `<button class="btn btn-ghost btn-sm" data-unequip>Unequip</button>`)
        : `<div class="muted center" style="margin-bottom:10px">No ${def.label} equipped.</div>`;

      const listHTML = list.length
        ? `<div class="muted" style="font-size:.72rem;text-align:left;margin:10px 0 6px">Backpack</div>` +
          `<div class="item-list">` + list.map((it) =>
            itemRow(it,
              `<button class="btn btn-equip btn-sm" data-equip="${it.id}">Equip</button>` +
              upgBtn(it, `data-upg="${it.id}"`) +
              `<button class="btn btn-sell btn-sm" data-sell="${it.id}">💰${it.value}</button>`,
              deltaInline(it))
          ).join("") + `</div>`
        : `<div class="empty-note">No spare ${def.label.toLowerCase()} in your backpack.</div>`;

      UI.modal({
        title: def.icon + " " + def.label,
        body: `<div style="max-height:54vh;overflow:auto;text-align:left">${curHTML}${listHTML}</div>`,
        dismissible: true,
        actions: [{ label: "Close", class: "btn-ghost" }],
      });

      const body = $("#modal-body");
      const refresh = () => { UI.closeModal(); this._picker(domain, slotKey); };
      const un = body.querySelector("[data-unequip]");
      if (un) un.onclick = () => { SK.unequip(save, domain, slotKey); UI.toast("Unequipped"); this._rerender && this._rerender(); refresh(); };
      const ue = body.querySelector("[data-upg-eq]");
      if (ue) ue.onclick = () => { this._doUpgrade(current); this._rerender && this._rerender(); refresh(); };
      body.querySelectorAll("[data-equip]").forEach((b) => b.onclick = () => {
        const it = save.inventory.find((x) => x.id === b.dataset.equip);
        if (it) { SK.equipItem(save, it); UI.toast("Equipped " + it.name, "good"); }
        this.refreshTop(); this._rerender && this._rerender(); refresh();
      });
      body.querySelectorAll("[data-upg]").forEach((b) => b.onclick = () => {
        const it = save.inventory.find((x) => x.id === b.dataset.upg);
        if (it) this._doUpgrade(it);
        refresh();
      });
      body.querySelectorAll("[data-sell]").forEach((b) => b.onclick = () => {
        const it = save.inventory.find((x) => x.id === b.dataset.sell);
        if (it) { const r = SK.sellItem(save, it); UI.toast("+💰" + r.credits + " ⚙️" + r.scrap, "gold"); }
        this.refreshTop(); refresh();
      });
    },

    _doUpgrade(item) {
      if (!item) return;
      const save = SK.state.save;
      if (!SK.canUpgrade(item)) { UI.toast("Already max upgrade", "bad"); return; }
      const c = SK.upgradeCost(item);
      if (save.credits < c.credits || (save.scrap || 0) < c.scrap) { UI.toast("Need 💰" + c.credits + " ⚙️" + c.scrap, "bad"); return; }
      SK.upgradeItem(save, item);
      UI.toast(item.name + " → +" + item.plus, "good");
      this.refreshTop();
    },

    /* ===================== ROBOTICS ===================== */
    openRobots() { this._rerender = () => this._robots(); this._robots(); },
    _robots() {
      const save = SK.state.save;

      // team strip
      const team = [];
      for (let i = 0; i < SK.ROBOT_TEAM_SIZE; i++) {
        const id = save.robotTeam[i];
        if (id) {
          const inst = SK.ownedRobot(save, id);
          const def = inst && SK.robotDef(inst.key);
          team.push(`<div class="team-slot filled" data-remove="${id}"><span class="ts-x">✕</span>${def ? def.icon : "🤖"}</div>`);
        } else {
          team.push(`<div class="team-slot">+</div>`);
        }
      }
      const teamHTML = `<h3 class="section-title">Active Team (${save.robotTeam.length}/${SK.ROBOT_TEAM_SIZE})</h3>` +
        `<div class="team-strip">${team.join("")}</div>` +
        `<p class="muted" style="font-size:.74rem">Deployed robots assist your captain in on-foot battles (planet & boarding).</p>`;

      // owned
      const ownedHTML = save.robotsOwned.length
        ? `<h3 class="section-title">Hangar</h3><div class="item-list">` + save.robotsOwned.map((inst) => {
            const def = SK.robotDef(inst.key);
            const inTeam = save.robotTeam.includes(inst.id);
            const teamFull = save.robotTeam.length >= SK.ROBOT_TEAM_SIZE;
            const statsLine = Object.keys(def.stats).map((k) => `${SK.CHAR_STAT_META[k].icon}+${def.stats[k]}`).join("  ");
            const action = inTeam
              ? `<button class="btn btn-ghost btn-sm" data-undeploy="${inst.id}">Recall</button>`
              : `<button class="btn btn-primary btn-sm" data-deploy="${inst.id}" ${teamFull ? "disabled" : ""}>Deploy</button>`;
            return `<div class="item-row" data-rarity="${def.rarity}"><div class="ir-icon">${def.icon}</div>` +
              `<div class="ir-main"><div class="ir-name r-${def.rarity}">${def.name}${inTeam ? " • deployed" : ""}</div>` +
              `<div class="ir-stats">${statsLine}</div></div>` +
              `<div class="ir-actions">${action}` +
              `<button class="btn btn-sell btn-sm" data-sellbot="${inst.id}">💰${Math.floor(def.cost * 0.5)}</button></div></div>`;
          }).join("") + `</div>`
        : `<div class="empty-note">No robots yet — recruit one below.</div>`;

      // recruit catalog
      const recruitHTML = `<h3 class="section-title">Recruit</h3><div class="item-list">` +
        SK.ROBOT_CATALOG.map((def) => {
          const statsLine = Object.keys(def.stats).map((k) => `${SK.CHAR_STAT_META[k].icon}+${def.stats[k]}`).join("  ");
          const afford = save.credits >= def.cost;
          return `<div class="item-row" data-rarity="${def.rarity}"><div class="ir-icon">${def.icon}</div>` +
            `<div class="ir-main"><div class="ir-name r-${def.rarity}">${def.name}</div>` +
            `<div class="ir-stats">${statsLine}</div></div>` +
            `<div class="ir-actions"><button class="btn btn-gold btn-sm" data-buybot="${def.key}" ${afford ? "" : "disabled"}>💰${def.cost}</button></div></div>`;
        }).join("") + `</div>`;

      this._panel("Robotics", teamHTML + ownedHTML + recruitHTML, (c) => {
        c.querySelectorAll("[data-remove]").forEach((el) => el.onclick = () => {
          save.robotTeam = save.robotTeam.filter((id) => id !== el.dataset.remove);
          SK.save(); this._robots();
        });
        c.querySelectorAll("[data-deploy]").forEach((b) => b.onclick = () => {
          if (save.robotTeam.length < SK.ROBOT_TEAM_SIZE && !save.robotTeam.includes(b.dataset.deploy)) {
            save.robotTeam.push(b.dataset.deploy); SK.save(); UI.toast("Deployed", "good");
          }
          this._robots();
        });
        c.querySelectorAll("[data-undeploy]").forEach((b) => b.onclick = () => {
          save.robotTeam = save.robotTeam.filter((id) => id !== b.dataset.undeploy);
          SK.save(); this._robots();
        });
        c.querySelectorAll("[data-sellbot]").forEach((b) => b.onclick = () => {
          const inst = SK.ownedRobot(save, b.dataset.sellbot);
          if (!inst) return;
          const def = SK.robotDef(inst.key);
          save.robotsOwned = save.robotsOwned.filter((r) => r.id !== inst.id);
          save.robotTeam = save.robotTeam.filter((id) => id !== inst.id);
          SK.addCredits(save, Math.floor(def.cost * 0.5));
          UI.toast("+💰 " + Math.floor(def.cost * 0.5), "gold");
          this.refreshTop(); this._robots();
        });
        c.querySelectorAll("[data-buybot]").forEach((b) => b.onclick = () => {
          const def = SK.robotDef(b.dataset.buybot);
          if (save.credits < def.cost) return;
          SK.addCredits(save, -def.cost);
          save.robotsOwned.push({ id: SK.uid(), key: def.key });
          SK.save();
          UI.toast("Recruited " + def.name, "good");
          this.refreshTop(); this._robots();
        });
      });
    },

    /* ===================== SHOP ===================== */
    _shopTab: "char",
    openShop() { this._rerender = () => this._shop(this._shopTab); this._shop(this._shopTab); },

    _ensureStock(domain) {
      const save = SK.state.save;
      if (!save.shop[domain] || !save.shop[domain].length) this._restock(domain, false);
    },
    _restock(domain, paid) {
      const save = SK.state.save;
      const n = 5;
      const arr = [];
      for (let i = 0; i < n; i++) {
        arr.push(SK.generateItem({ domain, level: save.level, luck: 4 }));
      }
      save.shop[domain] = arr;
      SK.save();
    },

    _shop(tab) {
      this._shopTab = tab;
      const save = SK.state.save;
      const tabs = `<div class="tabs">` +
        `<div class="tab ${tab === "char" ? "active" : ""}" data-tab="char">Captain</div>` +
        `<div class="tab ${tab === "ship" ? "active" : ""}" data-tab="ship">Ship</div>` +
        `<div class="tab ${tab === "backpack" ? "active" : ""}" data-tab="backpack">Backpack</div>` +
        `</div>`;

      let body = "";
      if (tab === "backpack") {
        const inv = save.inventory.slice().sort((a, b) => SK.RARITY_ORDER.indexOf(b.rarity) - SK.RARITY_ORDER.indexOf(a.rarity));
        body = inv.length
          ? `<div class="item-list">` + inv.map((it) =>
              itemRow(it,
                `<button class="btn btn-equip btn-sm" data-equip="${it.id}">Equip</button>` +
                upgBtn(it, `data-upg="${it.id}"`) +
                `<button class="btn btn-sell btn-sm" data-sell="${it.id}">💰${it.value}</button>`,
                deltaInline(it))
            ).join("") + `</div>`
          : `<div class="empty-note">Your backpack is empty. Win loot on missions or buy gear here.</div>`;
      } else {
        this._ensureStock(tab);
        const stock = save.shop[tab];
        const refreshCost = 40 + save.level * 10;
        body = `<div class="row-split" style="margin-bottom:10px"><span class="muted" style="font-size:.78rem">Stock · Lv ${save.level}</span>` +
          `<button class="btn btn-ghost btn-sm" data-refresh>🔄 Refresh 💰${refreshCost}</button></div>`;
        body += stock.length
          ? `<div class="item-list">` + stock.map((it) => {
              const price = it.value * 3;
              const afford = save.credits >= price;
              return itemRow(it,
                `<button class="btn btn-gold btn-sm" data-buy="${it.id}" ${afford ? "" : "disabled"}>Buy 💰${price}</button>`,
                deltaInline(it));
            }).join("") + `</div>`
          : `<div class="empty-note">Sold out — refresh the stock.</div>`;
      }

      this._panel("Shop", tabs + body, (c) => {
        c.querySelectorAll(".tab").forEach((t) => t.onclick = () => this._shop(t.dataset.tab));

        const rf = c.querySelector("[data-refresh]");
        if (rf) rf.onclick = () => {
          const cost = 40 + save.level * 10;
          if (save.credits < cost) { UI.toast("Not enough credits", "bad"); return; }
          SK.addCredits(save, -cost); this._restock(tab, true);
          this.refreshTop(); this._shop(tab);
        };
        c.querySelectorAll("[data-buy]").forEach((b) => b.onclick = () => {
          const it = save.shop[tab].find((x) => x.id === b.dataset.buy);
          if (!it) return;
          const price = it.value * 3;
          if (save.credits < price) { UI.toast("Not enough credits", "bad"); return; }
          SK.addCredits(save, -price);
          save.shop[tab] = save.shop[tab].filter((x) => x.id !== it.id);
          save.inventory.push(it);
          SK.save();
          UI.toast("Bought " + it.name + " — equip from Backpack", "good");
          this.refreshTop(); this._shop(tab);
        });
        c.querySelectorAll("[data-equip]").forEach((b) => b.onclick = () => {
          const it = save.inventory.find((x) => x.id === b.dataset.equip);
          if (it) { SK.equipItem(save, it); UI.toast("Equipped " + it.name, "good"); }
          this.refreshTop(); this._shop(tab);
        });
        c.querySelectorAll("[data-upg]").forEach((b) => b.onclick = () => {
          const it = save.inventory.find((x) => x.id === b.dataset.upg);
          if (it) this._doUpgrade(it);
          this._shop(tab);
        });
        c.querySelectorAll("[data-sell]").forEach((b) => b.onclick = () => {
          const it = save.inventory.find((x) => x.id === b.dataset.sell);
          if (it) { const r = SK.sellItem(save, it); UI.toast("+💰" + r.credits + " ⚙️" + r.scrap, "gold"); }
          this.refreshTop(); this._shop(tab);
        });
      });
    },
  };

  SK.Hub = Hub;
})();

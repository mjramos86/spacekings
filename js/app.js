/* ===================================================================
   SPACE KINGS — app.js
   Bootstrap: login, appearance creation, navigation wiring.
   =================================================================== */
(function () {
  const SK = (window.SK = window.SK || {});
  const $ = (s) => document.querySelector(s);
  const UI = SK.UI;

  let pendingName = "";
  let pendingAppearance = null;

  /* ---------------- login ---------------- */
  function attemptLogin() {
    const first = $("#login-first").value.trim();
    const last = $("#login-last").value.trim();
    if (!first || !last) { UI.toast("Enter a first and last name", "bad"); return; }
    loginAs(SK.Storage.normName(first, last));
  }

  function loginAs(name) {
    const existing = SK.Storage.load(name);
    if (existing) {
      // migration safety for any future fields
      existing.shop = existing.shop || { char: [], ship: [], robots: [] };
      existing.inventory = existing.inventory || [];
      existing.robotsOwned = existing.robotsOwned || [];
      existing.robotTeam = existing.robotTeam || [];
      existing.stats = existing.stats || { planetsCleared: 0, shipsDefeated: 0, boarded: 0, kills: 0 };
      SK.state.save = existing;
      enterHub(false);
    } else {
      pendingName = name;
      pendingAppearance = { sex: "male", skin: SK.APPEARANCE.skin[1], eyes: SK.APPEARANCE.eyes[0], hair: SK.APPEARANCE.hair[0] };
      buildPickers();
      updatePreview();
      UI.showScreen("screen-appearance");
    }
  }

  function renderRoster() {
    const wrap = $("#login-roster");
    const names = SK.Storage.roster();
    if (!names.length) { wrap.innerHTML = ""; return; }
    wrap.innerHTML = `<div class="muted" style="font-size:.72rem;text-align:center;margin-top:4px">Saved captains</div>` +
      names.map((n) => {
        const s = SK.Storage.load(n);
        if (!s) return "";
        return `<div class="roster-item" data-name="${encodeURIComponent(n)}">` +
          `<div class="ra-av">${UI.avatarSVG(s.appearance, 38)}</div>` +
          `<div class="ra-meta"><div class="ra-name">${s.name}</div>` +
          `<div class="ra-sub">Level ${s.level} • 💰 ${s.credits}</div></div>` +
          `<div class="ra-del" data-del="${encodeURIComponent(n)}">✕</div></div>`;
      }).join("");

    wrap.querySelectorAll(".roster-item").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target.closest("[data-del]")) return;
        loginAs(decodeURIComponent(el.dataset.name));
      });
    });
    wrap.querySelectorAll("[data-del]").forEach((b) => {
      b.addEventListener("click", () => {
        const n = decodeURIComponent(b.dataset.del);
        UI.confirm("Delete captain?", `This permanently removes <b>${n}</b> from this device.`, () => {
          SK.Storage.remove(n); renderRoster();
        }, "Delete");
      });
    });
  }

  /* ---------------- appearance ---------------- */
  function buildPickers() {
    // sex
    $("#pick-sex").innerHTML = SK.APPEARANCE.sex.map((o) =>
      `<button class="opt ${pendingAppearance.sex === o.key ? "selected" : ""}" data-sex="${o.key}">${o.label}</button>`).join("");
    // color swatches
    const swatch = (group, color, sel) =>
      `<button class="opt swatch ${sel ? "selected" : ""}" data-${group}="${color}" style="background:${color}"></button>`;
    $("#pick-skin").innerHTML = SK.APPEARANCE.skin.map((c) => swatch("skin", c, c === pendingAppearance.skin)).join("");
    $("#pick-eyes").innerHTML = SK.APPEARANCE.eyes.map((c) => swatch("eyes", c, c === pendingAppearance.eyes)).join("");
    $("#pick-hair").innerHTML = SK.APPEARANCE.hair.map((c) => swatch("hair", c, c === pendingAppearance.hair)).join("");

    bindPicker("sex"); bindPicker("skin"); bindPicker("eyes"); bindPicker("hair");
  }
  function bindPicker(group) {
    document.querySelectorAll(`#pick-${group} .opt`).forEach((el) => {
      el.addEventListener("click", () => {
        pendingAppearance[group] = el.dataset[group];
        document.querySelectorAll(`#pick-${group} .opt`).forEach((x) => x.classList.remove("selected"));
        el.classList.add("selected");
        updatePreview();
      });
    });
  }
  function updatePreview() {
    $("#appearance-avatar").innerHTML = UI.avatarSVG(pendingAppearance, 160);
    $("#appearance-name").textContent = pendingName;
  }

  function confirmAppearance() {
    const save = SK.newSave(pendingName, pendingAppearance);
    SK.state.save = save;
    SK.Storage.save(save);
    enterHub(true);
  }

  /* ---------------- hub entry & nav ---------------- */
  function enterHub(isNew) {
    SK.Hub.refreshTop();
    UI.showScreen("screen-hub");
    if (isNew) {
      UI.modal({
        title: "Welcome, Captain " + SK.state.save.name.split(" ").slice(-1)[0] + "!",
        body:
          `<span class="big-emoji">🚀</span>` +
          `Run <b>Planet</b> and <b>Ship</b> missions to fight and loot.<br><br>` +
          `When loot drops, <b>swipe right to equip</b> or <b>left to sell</b> — each card shows the stat change.<br><br>` +
          `Spend credits at the Station on gear and robots. Good luck out there.`,
        actions: [{ label: "Let's go", class: "btn-primary" }],
      });
    }
  }

  function wireNav() {
    document.querySelectorAll(".hub-card[data-action]").forEach((b) => {
      b.addEventListener("click", () => {
        switch (b.dataset.action) {
          case "mission-planet": SK.Mission.startPlanet(); break;
          case "mission-ship": SK.Mission.startShip(); break;
          case "character": SK.Hub.openCharacter(); break;
          case "ship": SK.Hub.openShip(); break;
          case "robots": SK.Hub.openRobots(); break;
          case "shop": SK.Hub.openShop(); break;
        }
      });
    });

    document.querySelectorAll("[data-back]").forEach((b) =>
      b.addEventListener("click", () => { SK.Hub.refreshTop(); UI.showScreen("screen-hub"); }));
    document.querySelectorAll("[data-back-hub]").forEach((b) =>
      b.addEventListener("click", () => { SK.Hub.refreshTop(); UI.showScreen("screen-hub"); }));

    $("#hub-logout").addEventListener("click", () => {
      UI.confirm("Switch captain?", "Your progress is saved. Return to the login screen?", () => {
        SK.state.save = null;
        $("#login-first").value = ""; $("#login-last").value = "";
        renderRoster();
        UI.showScreen("screen-login");
      }, "Switch");
    });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    SK.Cards.init();
    wireNav();

    $("#login-btn").addEventListener("click", attemptLogin);
    ["#login-first", "#login-last"].forEach((sel) =>
      $(sel).addEventListener("keydown", (e) => { if (e.key === "Enter") attemptLogin(); }));
    $("#appearance-confirm").addEventListener("click", confirmAppearance);

    // prefill last captain for convenience
    const last = SK.Storage.last();
    if (last) {
      const parts = last.split(" ");
      $("#login-first").value = parts[0] || "";
      $("#login-last").value = parts.slice(1).join(" ") || "";
    }
    renderRoster();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

/* ===================================================================
   SPACE KINGS — ui.js
   Shared UI: screen routing, toasts, modal, avatar SVG, formatting.
   =================================================================== */
(function () {
  const SK = (window.SK = window.SK || {});
  const $ = (sel) => document.querySelector(sel);

  const UI = {
    $,
    all: (sel) => Array.from(document.querySelectorAll(sel)),

    showScreen(id) {
      UI.all(".screen").forEach((s) => s.classList.remove("active"));
      const el = document.getElementById(id);
      if (el) el.classList.add("active");
      // scroll content panes to top
      const scroller = el && el.querySelector(".panel-content,.hub-body,.select-content,.appearance-wrap");
      if (scroller) scroller.scrollTop = 0;
    },

    /* ---- toasts ---- */
    toast(msg, type) {
      const wrap = $("#toast-wrap");
      const t = document.createElement("div");
      t.className = "toast " + (type || "");
      t.textContent = msg;
      wrap.appendChild(t);
      setTimeout(() => t.remove(), 2600);
    },

    /* ---- modal ---- */
    modal(opts) {
      $("#modal-title").innerHTML = opts.title || "";
      $("#modal-body").innerHTML = opts.body || "";
      const actions = $("#modal-actions");
      actions.innerHTML = "";
      (opts.actions || [{ label: "OK" }]).forEach((a) => {
        const b = document.createElement("button");
        b.className = "btn " + (a.class || "btn-primary");
        b.textContent = a.label;
        b.onclick = () => {
          if (!a.keepOpen) UI.closeModal();
          if (a.onClick) a.onClick();
        };
        actions.appendChild(b);
      });
      const ov = $("#modal-overlay");
      ov.classList.add("show");
      ov.onclick = opts.dismissible
        ? (e) => { if (e.target === ov) UI.closeModal(); }
        : null;
    },
    closeModal() { $("#modal-overlay").classList.remove("show"); },

    confirm(title, body, onOk, okLabel) {
      UI.modal({
        title, body, dismissible: true,
        actions: [
          { label: "Cancel", class: "btn-ghost" },
          { label: okLabel || "Confirm", class: "btn-primary", onClick: onOk },
        ],
      });
    },

    /* ---- formatting ---- */
    fmtStat(meta, val) { return meta && meta.percent ? val + "%" : "" + val; },
    fmtDelta(meta, d) {
      const sign = d > 0 ? "+" : "";
      return sign + d + (meta && meta.percent ? "%" : "");
    },
    rarityName: (r) => SK.RARITIES[r].name,

    /* ---- avatar ---- */
    avatarSVG(ap, size) {
      ap = ap || { sex: "male", skin: "#e0ac69", eyes: "#4a90d9", hair: "#1a1a1a" };
      const skin = ap.skin, eyes = ap.eyes, hair = ap.hair, female = ap.sex === "female";
      const hairTop = female
        ? `<path d="M27 46 Q27 14 50 14 Q73 14 73 46 Q73 28 50 26 Q27 28 27 46 Z" fill="${hair}"/>`
        : `<path d="M30 44 Q30 17 50 17 Q70 17 70 44 Q60 29 50 29 Q40 29 30 44 Z" fill="${hair}"/>`;
      const hairBack = female ? `<ellipse cx="50" cy="48" rx="26" ry="31" fill="${hair}"/>` : "";
      return (
        `<svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">` +
        `<defs><radialGradient id="av-bg" cx="50%" cy="28%" r="85%"><stop offset="0%" stop-color="#1b2350"/><stop offset="100%" stop-color="#0a0f24"/></radialGradient></defs>` +
        `<rect width="100" height="100" fill="url(#av-bg)"/>` +
        `<path d="M14 100 Q14 71 50 71 Q86 71 86 100 Z" fill="#1d3a55"/>` +
        `<path d="M14 100 Q14 71 50 71 Q86 71 86 100 Z" fill="none" stroke="#37e6ff" stroke-width="2" opacity="0.45"/>` +
        `<path d="M40 73 L50 84 L60 73" fill="none" stroke="#37e6ff" stroke-width="2"/>` +
        `<rect x="44" y="59" width="12" height="16" rx="5" fill="${skin}"/>` +
        hairBack +
        `<circle cx="30" cy="47" r="4" fill="${skin}"/><circle cx="70" cy="47" r="4" fill="${skin}"/>` +
        `<ellipse cx="50" cy="44" rx="20" ry="23" fill="${skin}"/>` +
        hairTop +
        `<ellipse cx="42" cy="46" rx="3.4" ry="4" fill="#fff"/><circle cx="42" cy="47" r="2.2" fill="${eyes}"/>` +
        `<ellipse cx="58" cy="46" rx="3.4" ry="4" fill="#fff"/><circle cx="58" cy="47" r="2.2" fill="${eyes}"/>` +
        `<rect x="37" y="40" width="9" height="1.8" rx="1" fill="${hair}"/><rect x="54" y="40" width="9" height="1.8" rx="1" fill="${hair}"/>` +
        `<path d="M44 56 Q50 60 56 56" fill="none" stroke="#7a3b3b" stroke-width="2" stroke-linecap="round"/>` +
        `</svg>`
      );
    },
  };

  SK.UI = UI;
})();

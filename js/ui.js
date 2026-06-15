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
    /* ---- colour shading ---- */
    shade(hex, p) {
      hex = (hex || "#c68642").replace("#", "");
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      const ch = (i) => parseInt(hex.slice(i, i + 2), 16);
      const f = (v) => Math.max(0, Math.min(255, Math.round(p < 0 ? v * (1 + p) : v + (255 - v) * p)));
      return "#" + [ch(0), ch(2), ch(4)].map((v) => f(v).toString(16).padStart(2, "0")).join("");
    },

    /* ---- first-person hands + blaster, tinted to the captain's skin ---- */
    fpGunSVG(skin) {
      const hi = UI.shade(skin, 0.18), lo = UI.shade(skin, -0.4);
      return (
        `<svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">` +
        `<defs>` +
        `<linearGradient id="fpg-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdd6e6"/><stop offset="50%" stop-color="#8a97ad"/><stop offset="100%" stop-color="#566075"/></linearGradient>` +
        `<linearGradient id="fpg-metal2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#aeb9cc"/><stop offset="100%" stop-color="#697488"/></linearGradient>` +
        `<linearGradient id="fpg-energy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eaffff"/><stop offset="100%" stop-color="#1fb6e6"/></linearGradient>` +
        `<radialGradient id="fpg-lens" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#fff"/><stop offset="45%" stop-color="#46e6ff"/><stop offset="100%" stop-color="#0d6e9e"/></radialGradient>` +
        `<radialGradient id="fpg-lensGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#9ff4ff" stop-opacity=".9"/><stop offset="100%" stop-color="#9ff4ff" stop-opacity="0"/></radialGradient>` +
        `<linearGradient id="fpg-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset="100%" stop-color="${lo}"/></linearGradient>` +
        `<linearGradient id="fpg-cuff" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d8fa6"/><stop offset="100%" stop-color="#15414f"/></linearGradient>` +
        `<filter id="fpg-g4"><feGaussianBlur stdDeviation="4"/></filter></defs>` +
        `<g><g transform="rotate(-22 300 250)"><rect x="20" y="210" width="300" height="92" rx="44" fill="url(#fpg-skin)"/><rect x="20" y="244" width="78" height="58" rx="24" fill="url(#fpg-cuff)"/></g>` +
        `<g transform="rotate(22 300 250)"><rect x="280" y="210" width="300" height="92" rx="44" fill="url(#fpg-skin)"/><rect x="502" y="244" width="78" height="58" rx="24" fill="url(#fpg-cuff)"/></g></g>` +
        `<ellipse cx="300" cy="40" rx="96" ry="70" fill="url(#fpg-lensGlow)"/>` +
        `<rect x="266" y="26" width="68" height="150" rx="16" fill="url(#fpg-metal)" stroke="#3a4456" stroke-width="2"/>` +
        `<rect x="283" y="42" width="34" height="120" rx="10" fill="url(#fpg-energy)" filter="url(#fpg-g4)"/>` +
        `<rect x="286" y="44" width="28" height="116" rx="9" fill="url(#fpg-energy)"/>` +
        `<circle cx="300" cy="38" r="26" fill="url(#fpg-lens)" stroke="#cfeffd" stroke-width="3"/>` +
        `<rect x="232" y="146" width="136" height="82" rx="18" fill="url(#fpg-metal)" stroke="#3a4456" stroke-width="2"/>` +
        `<rect x="252" y="156" width="96" height="16" rx="7" fill="#39435a"/>` +
        `<rect x="350" y="170" width="54" height="34" rx="9" fill="url(#fpg-metal2)" stroke="#3a4456" stroke-width="2"/>` +
        `<rect x="278" y="206" width="44" height="66" rx="12" fill="#4a5468" transform="rotate(8 300 238)"/>` +
        `<g fill="url(#fpg-skin)">` +
        `<ellipse cx="300" cy="214" rx="60" ry="36"/>` +
        `<g stroke="${lo}" stroke-width="4" stroke-linecap="round"><line x1="270" y1="198" x2="330" y2="198"/><line x1="266" y1="214" x2="334" y2="214"/><line x1="270" y1="230" x2="330" y2="230"/></g>` +
        `<ellipse cx="300" cy="132" rx="46" ry="30"/>` +
        `<g stroke="${lo}" stroke-width="4" stroke-linecap="round"><line x1="278" y1="120" x2="322" y2="120"/><line x1="276" y1="134" x2="324" y2="134"/><line x1="278" y1="148" x2="322" y2="148"/></g>` +
        `</g></svg>`
      );
    },
  };

  SK.UI = UI;
})();

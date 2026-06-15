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

    /* ---- planet surface scene, themed by biome palette ---- */
    planetSceneSVG(pal) {
      pal = pal || SK.PLANET_PALETTES.default;
      const md = UI.shade(pal.mountain, -0.34);
      const snow = pal.snow
        ? `<polygon points="360,300 410,355 330,355" fill="${pal.snow}"/>` +
          `<polygon points="240,330 285,378 200,378" fill="${pal.snow}" opacity=".85"/>` +
          `<polygon points="850,330 895,382 805,382" fill="${pal.snow}" opacity=".9"/>`
        : "";
      const mush = (gx, gy, capRx, capRy, stemX, stemW, stemH, spots) =>
        `<ellipse cx="${gx}" cy="${gy}" rx="${capRx * 1.45}" ry="${capRx * 1.45}" fill="url(#ps-mushGlow)"/>` +
        `<rect x="${stemX}" y="${gy}" width="${stemW}" height="${stemH}" rx="${stemW / 2}" fill="${pal.stem}"/>` +
        `<ellipse cx="${gx}" cy="${gy}" rx="${capRx}" ry="${capRy}" fill="url(#ps-mush)"/>` + spots;
      return (
        `<svg class="planet-bg" viewBox="0 0 1000 1100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">` +
        `<defs>` +
        `<linearGradient id="ps-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal.sky[0]}"/><stop offset="40%" stop-color="${pal.sky[1]}"/><stop offset="70%" stop-color="${pal.sky[2]}"/><stop offset="100%" stop-color="${pal.sky[3]}"/></linearGradient>` +
        `<linearGradient id="ps-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal.ground[0]}"/><stop offset="55%" stop-color="${pal.ground[1]}"/><stop offset="100%" stop-color="${pal.ground[2]}"/></linearGradient>` +
        `<linearGradient id="ps-path" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal.path[0]}"/><stop offset="100%" stop-color="${pal.path[1]}"/></linearGradient>` +
        `<linearGradient id="ps-ufo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff5db0"/><stop offset="35%" stop-color="#ffd54a"/><stop offset="65%" stop-color="#46e08a"/><stop offset="100%" stop-color="#37a8ff"/></linearGradient>` +
        `<radialGradient id="ps-ufoGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#bff7ff" stop-opacity=".9"/><stop offset="100%" stop-color="#bff7ff" stop-opacity="0"/></radialGradient>` +
        `<radialGradient id="ps-mush" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="${pal.cap[0]}"/><stop offset="60%" stop-color="${pal.cap[1]}"/><stop offset="100%" stop-color="${pal.cap[2]}"/></radialGradient>` +
        `<radialGradient id="ps-mushGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${pal.glow}" stop-opacity=".8"/><stop offset="100%" stop-color="${pal.glow}" stop-opacity="0"/></radialGradient>` +
        `<radialGradient id="ps-horizon" cx="50%" cy="100%" r="60%"><stop offset="0" stop-color="${pal.horizonGlow}" stop-opacity=".55"/><stop offset="100%" stop-color="${pal.horizonGlow}" stop-opacity="0"/></radialGradient>` +
        `</defs>` +
        `<rect width="1000" height="560" fill="url(#ps-sky)"/>` +
        `<ellipse cx="500" cy="500" rx="600" ry="120" fill="url(#ps-horizon)"/>` +
        `<g fill="#fff"><circle cx="120" cy="70" r="2.5"/><circle cx="240" cy="140" r="1.6"/><circle cx="360" cy="60" r="2"/><circle cx="520" cy="110" r="1.5"/><circle cx="180" cy="220" r="1.8"/><circle cx="300" cy="280" r="1.4"/><circle cx="60" cy="320" r="1.6"/><circle cx="640" cy="80" r="1.7"/><circle cx="880" cy="300" r="2"/><circle cx="820" cy="150" r="1.5"/><circle cx="940" cy="90" r="1.8"/><circle cx="440" cy="200" r="1.4"/><circle cx="700" cy="250" r="1.5"/><circle cx="980" cy="220" r="1.6"/><circle cx="40" cy="140" r="1.5"/></g>` +
        `<g class="ps-ufo"><ellipse cx="760" cy="180" rx="170" ry="90" fill="url(#ps-ufoGlow)"/><ellipse cx="760" cy="190" rx="130" ry="30" fill="url(#ps-ufo)" stroke="#bff7ff" stroke-width="3"/><ellipse cx="760" cy="172" rx="62" ry="34" fill="#0e2036" stroke="#9fe9ff" stroke-width="3"/><ellipse cx="760" cy="166" rx="46" ry="20" fill="#37a8ff" opacity=".7"/><ellipse cx="760" cy="205" rx="150" ry="12" fill="url(#ps-ufo)" opacity=".5"/></g>` +
        `<polygon points="-20,520 120,330 240,440 360,300 470,440 560,360 700,470 850,330 1020,500 1020,560 -20,560" fill="${pal.mountain}"/>` + snow +
        `<polygon points="-20,560 200,470 420,560 -20,560" fill="${md}" opacity=".7"/>` +
        `<polygon points="1020,560 760,470 560,560 1020,560" fill="${md}" opacity=".7"/>` +
        `<rect y="520" width="1000" height="580" fill="url(#ps-ground)"/>` +
        `<polygon points="468,520 532,520 760,1100 240,1100" fill="url(#ps-path)" opacity=".92"/>` +
        `<polygon points="468,520 532,520 760,1100 240,1100" fill="none" stroke="${pal.pathEdge}" stroke-width="4" opacity=".8"/>` +
        `<g stroke="${pal.pathLine}" stroke-width="3" opacity=".55" fill="none"><path d="M470,560 L530,560"/><path d="M458,620 L542,620"/><path d="M442,700 L558,700"/><path d="M420,800 L580,800"/><path d="M392,920 L608,920"/><path d="M360,1060 L640,1060"/></g>` +
        `<path d="M500,520 L500,1100" stroke="${pal.pathEdge}" stroke-width="2" opacity=".5" fill="none"/>` +
        `<g class="ps-flora"><path d="M120,1000 q-30,-120 10,-220" stroke="${pal.plant[0]}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M150,1000 q10,-140 -30,-240" stroke="${pal.plant[1]}" stroke-width="8" fill="none" stroke-linecap="round"/>` +
          mush(118, 690, 86, 46, 104, 26, 120,
            `<circle cx="95" cy="678" r="9" fill="${pal.spot}"/><circle cx="140" cy="690" r="7" fill="${pal.spot}"/><circle cx="118" cy="668" r="6" fill="${pal.spot}"/>`) + `</g>` +
        `<g class="ps-flora">` +
          mush(70, 900, 64, 34, 58, 22, 100,
            `<circle cx="50" cy="892" r="7" fill="${pal.spot}"/><circle cx="86" cy="902" r="6" fill="${pal.spot}"/>`) + `</g>` +
        `<g class="ps-flora"><path d="M900,1010 q40,-130 -6,-240" stroke="${pal.plant[0]}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M928,1010 q20,-150 -40,-250" stroke="${pal.plant[1]}" stroke-width="7" fill="none" stroke-linecap="round"/>` +
          mush(905, 700, 90, 48, 892, 26, 120,
            `<circle cx="880" cy="688" r="9" fill="${pal.spot}"/><circle cx="928" cy="700" r="7" fill="${pal.spot}"/><circle cx="906" cy="678" r="6" fill="${pal.spot}"/>`) + `</g>` +
        `<g class="ps-flora">` +
          mush(950, 910, 66, 34, 938, 22, 100,
            `<circle cx="930" cy="902" r="7" fill="${pal.spot}"/><circle cx="966" cy="912" r="6" fill="${pal.spot}"/>`) + `</g>` +
        `</svg>`
      );
    },
  };

  SK.UI = UI;
})();

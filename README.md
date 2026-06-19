# 👑 Space Kings

A first-person, auto-combat **RPG endless runner** for the browser, with a space
theme. Inspired by card-swipe mobile RPGs — play with a **mouse on desktop** or
**touch on mobile**. No build step, no dependencies: just open `index.html`.

> No story yet — this is the mechanics + visuals foundation.

---

## ▶️ Play

- **Easiest:** open `index.html` directly in any modern browser.
- **Recommended (so saves persist reliably):** serve the folder, e.g.
  ```bash
  python3 -m http.server 8000
  # then visit http://localhost:8000
  ```
  Saves use `localStorage`; some browsers restrict it on `file://` pages.

Works great as a phone web-app too — add it to your home screen.

---

## 🎮 How to play

1. **Log in** with a captain first + last name. Your save is linked to that name
   on this device.
2. **First login:** customize your captain (sex, skin, eyes, hair).
3. **The HUB (space station):**
   - **Captain** — view stats & swap character gear from your backpack.
   - **Ship Bay** — view ship stats & swap ship parts.
   - **Robotics** — recruit, sell, and deploy combat robots (team of 3).
   - **Shop** — buy Captain/Ship gear, refresh stock, sell from your backpack.
4. **Missions:**
   - **🪐 Planet Exploration** — pick 1 of 3 worlds. Auto-run the surface
     through **3 minion encounters + a boss**. Each fight drops loot.
   - **🛸 Ship Battle** — pick 1 of 3 pirates. Auto ship-vs-ship combat; at
     **10% enemy hull** choose to **Destroy** (quick salvage) or **Board**
     (fight the crew on foot for far greater loot + the captain's coffer).

### The loot card-swipe

After every fight a loot card appears showing the **stat change vs your equipped
item** (green = gain, red = loss):

- **Swipe / drag RIGHT → Equip**
- **Swipe / drag LEFT → Sell** for credits
- Or tap the **Equip / Sell** buttons.

Combat is **fully automatic** — you watch the battle and make the gear/route
decisions.

### Rarities

`Common → Uncommon → Rare → Epic → Legendary` — higher rarity means stronger
stats and more bonus stats. Bosses, boarding, and coffers have boosted odds for
the top tiers. Your **Luck** stat improves drop quality.

### Progression & difficulty

- **XP & levels** raise your base stats; **equipment does the heavy lifting**.
- **Power Score** — a single number (on the Captain/Ship sheets) summarising your strength.
- **Upgrades** — spend **credits + ⚙️ scrap** (scrap is earned by selling loot) to upgrade an item up to **+5**, so you can improve a favourite instead of praying for drops.
- **Set bonus** — each equipped **epic/legendary** item grants +2.5% to all your stats.
- **Mission tiers** — every mission offers **Patrol / Standard / Elite / Nightmare** options: higher tiers mean tougher enemies (and **elite affixes** like Shielded, Swift, Regen, Vampiric…) but better loot, more rarity, and bigger rewards.
- **Push deeper** — after clearing a sector you can **Extract** (bank your haul) or **Descend** for richer loot at rising threat. Fall and the *pending haul* is lost — your equipped/sold gear is always kept. Depth is the endless difficulty ramp.

Tuning lives in one place — `SK.BALANCE` / `SK.TIERS` / `SK.AFFIXES` in
`js/data.js`. Run `node tools/balance-sim.js` to estimate tier win-rates
after any change.

---

## 🧩 Project structure

```
index.html        # all screens + script includes
styles.css        # space-themed, mobile-first, responsive
js/
  data.js         # static data: rarities, stats, slots, enemies, robots, cosmetics
  storage.js      # localStorage save/load, keyed by captain name
  core.js         # state, stat math, item generation, XP/levels, combatants
  ui.js           # screen routing, toasts, modal, SVG avatar generator
  cards.js        # the loot card-swipe mechanic (pointer events: mouse + touch)
  combat.js       # automatic ATB combat engine (foot & ship), boarding hook
  hub.js          # station screens: captain, ship, robotics, shop, backpack
  missions.js     # planet exploration & ship battle flows
  app.js          # bootstrap: login, appearance creation, navigation
```

## 🛠️ Tech notes

- **Vanilla HTML/CSS/JS.** No frameworks, no bundler, no network calls.
- Unified **Pointer Events** drive both mouse drags and touch swipes.
- Avatars are generated as inline **SVG** from the chosen colors.
- Combat uses an **Active-Time-Battle** model: each side fills a gauge by its
  Speed and attacks when full; damage uses defense mitigation, crits, shields
  (ships), and evasion.
- All progress is saved locally per captain; multiple captains are supported.

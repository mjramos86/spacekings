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

### Progression

You gain **XP and levels** that permanently raise your base stats, but
**equipment does the heavy lifting** — gear up to beat the bosses.

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

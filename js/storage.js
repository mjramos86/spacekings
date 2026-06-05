/* ===================================================================
   SPACE KINGS — storage.js
   Local persistence. Save data is keyed by the captain's
   first + last name combination.
   =================================================================== */
(function () {
  const SK = (window.SK = window.SK || {});
  const PREFIX = "spacekings:save:";
  const ROSTER_KEY = "spacekings:roster";
  const LAST_KEY = "spacekings:last";

  function normName(first, last) {
    return (first + " " + last).trim().replace(/\s+/g, " ");
  }
  function keyFor(name) {
    return PREFIX + name.toLowerCase();
  }

  const Storage = {
    normName,

    load(name) {
      try {
        const raw = localStorage.getItem(keyFor(name));
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.warn("load failed", e);
        return null;
      }
    },

    save(data) {
      try {
        localStorage.setItem(keyFor(data.name), JSON.stringify(data));
        this._touchRoster(data.name);
        localStorage.setItem(LAST_KEY, data.name);
      } catch (e) {
        console.warn("save failed", e);
      }
    },

    remove(name) {
      try {
        localStorage.removeItem(keyFor(name));
        const r = this.roster().filter((n) => n.toLowerCase() !== name.toLowerCase());
        localStorage.setItem(ROSTER_KEY, JSON.stringify(r));
      } catch (e) {}
    },

    roster() {
      try {
        return JSON.parse(localStorage.getItem(ROSTER_KEY) || "[]");
      } catch (e) {
        return [];
      }
    },

    _touchRoster(name) {
      const r = this.roster().filter((n) => n.toLowerCase() !== name.toLowerCase());
      r.unshift(name);
      localStorage.setItem(ROSTER_KEY, JSON.stringify(r.slice(0, 12)));
    },

    last() {
      return localStorage.getItem(LAST_KEY);
    },
  };

  SK.Storage = Storage;
})();

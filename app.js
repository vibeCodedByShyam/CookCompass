// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STORAGE_KEY = "ruchi_data";
const AVOID_DAYS = 7;
const MEAL_ICONS = { Breakfast: "☀️", Dinner: "🌙" };

// ─── SECURITY: HTML ESCAPE ────────────────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─── STATE (in-memory, synced to localStorage) ────────────────────────────────
let state = {
  selectedMeal: null,   // "Breakfast" | "Dinner" | null
  activeTab: "today",
};

// ─── TAB NAVIGATION ───────────────────────────────────────────────────────────
function switchTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(`page-${tab}`)?.classList.add("active");
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
}

// ─── STORAGE ─────────────────────────────────────────────────────────────────
function isValidEntry(h) {
  return h && typeof h.dish === "string" && typeof h.side === "string" &&
    typeof h.meal === "string" && typeof h.date === "string";
}

function loadStore() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (s && Array.isArray(s.history) && typeof s.todayMenu === "object") {
      s.history = s.history.filter(isValidEntry);
      if (!s.settings || typeof s.settings !== "object") s.settings = {};
      if (s.settings.nutrientBias === undefined) s.settings.nutrientBias = true;
      if (s.settings.genericSides === undefined) s.settings.genericSides = false;
      return s;
    }
  } catch { }
  return { todayMenu: {}, history: [], settings: { nutrientBias: true, genericSides: false } };
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// ─── CORE HELPERS ─────────────────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function recentlyCooked(history) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - AVOID_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return new Set(history.filter(h => h.date >= cutoffStr).map(h => h.dish));
}

// ─── SIDE TYPE LABELS (for generic-sides display mode) ───────────────────────
const SIDE_TYPE_LABELS = {
  "Chutney": "Chutney",
  "Sambar": "Sambar",
  "Podi": "Podi",
  "SalnaCurry": "Salna / Kuruma",
  "KeralaKurry": "Kerala Curry",
  "EggCurry": "Egg Curry",
  "VadaCurry": "Vada Curry",
  "Papad": "Papad / Pickle",
};

function genericSideName(sideName) {
  const type = SIDES.find(s => s.name === sideName)?.type;
  return (type && SIDE_TYPE_LABELS[type]) || sideName;
}

// ─── WEEKLY NUTRITION ANALYSIS ───────────────────────────────────────────────
const ALL_NUTRIENTS = ["Protein", "Calcium", "Iron", "Fiber"];

// ICMR weekly targets, scaled to breakfast + dinner only (~45% of daily intake)
const WEEKLY_TARGETS = { Protein: 100, Calcium: 1500, Iron: 30, Fiber: 70 };
const NUTRIENT_UNITS = { Protein: "g", Calcium: "mg", Iron: "mg", Fiber: "g" };

function getWeeklyAnalysis(history) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const weekHistory = history.filter(h => h.date >= cutoffStr);

  const totals = { Protein: 0, Calcium: 0, Iron: 0, Fiber: 0 };
  weekHistory.forEach(h => {
    const dish = DISHES.find(d => d.name === h.dish);
    if (dish && dish.nutrition) {
      totals.Protein += dish.nutrition.protein || 0;
      totals.Calcium += dish.nutrition.calcium || 0;
      totals.Iron += dish.nutrition.iron || 0;
      totals.Fiber += dish.nutrition.fiber || 0;
    }
  });

  const totalMeals = weekHistory.length;
  const pace = totalMeals / 14;
  // Sort by fill ratio ascending — most deficient first
  const deficient = ALL_NUTRIENTS
    .filter(n => pace > 0 && (totals[n] / WEEKLY_TARGETS[n]) < pace * 0.85)
    .sort((a, b) => (totals[a] / WEEKLY_TARGETS[a]) - (totals[b] / WEEKLY_TARGETS[b]));

  return { totals, deficient, totalMeals };
}

// ─── DISH + SIDE PICKING ──────────────────────────────────────────────────────
function pickDish(meal, history, settings) {
  let pool = DISHES.filter(d => d.meals.includes(meal));

  const recent = recentlyCooked(history);
  let filtered = pool.filter(d => !recent.has(d.name));

  // Fallback: if everything was recently cooked, pick oldest-cooked
  if (filtered.length === 0) {
    const cookedDates = {};
    history.forEach(h => {
      if (!cookedDates[h.dish] || h.date > cookedDates[h.dish]) cookedDates[h.dish] = h.date;
    });
    filtered = [...pool].sort((a, b) =>
      (cookedDates[a.name] || "0000-00-00").localeCompare(cookedDates[b.name] || "0000-00-00")
    );
  }

  // Bias toward dishes that cover deficient nutrients (only when nutrientBias is on)
  if (settings?.nutrientBias !== false) {
    const { deficient } = getWeeklyAnalysis(history);
    if (deficient.length > 0) {
      const topN = Math.max(1, Math.ceil(deficient.length / 2));
      const priority = deficient.slice(0, topN);

      const coversAll = filtered.filter(d => priority.every(n => d.nutrients.includes(n)));
      if (coversAll.length > 0) return pickRandom(coversAll);

      const coversWorst = filtered.filter(d => d.nutrients.includes(deficient[0]));
      if (coversWorst.length > 0) return pickRandom(coversWorst);

      const coversAny = filtered.filter(d => d.nutrients.some(n => priority.includes(n)));
      if (coversAny.length > 0) return pickRandom(coversAny);

      const biased = filtered.filter(d => d.nutrients.some(n => deficient.includes(n)));
      if (biased.length > 0) return pickRandom(biased);
    }
  }

  return pickRandom(filtered);
}

function pickSide(category, inheritedSide) {
  const validTypes = CATEGORY_RULES[category] || ["Chutney"];

  // Leftover logic: reuse breakfast side for dinner if the type is valid
  if (inheritedSide) {
    const inheritedType = SIDES.find(s => s.name === inheritedSide)?.type;
    if (inheritedType && validTypes.includes(inheritedType)) {
      return { name: inheritedSide, reused: true };
    }
  }

  const chosenType = pickRandom(validTypes);
  const pool = SIDES.filter(s => s.type === chosenType);
  return { name: pickRandom(pool).name, reused: false };
}

// ─── GENERATE / SHUFFLE ───────────────────────────────────────────────────────
function generateMeal(meal, store, isReshuffle = false) {
  const dish = pickDish(meal, store.history, store.settings);

  // For Dinner, try to inherit today's Breakfast side — but not when user explicitly shuffles
  let inheritedSide = null;
  if (!isReshuffle && meal === "Dinner" && store.todayMenu[todayStr()]?.Breakfast) {
    inheritedSide = store.todayMenu[todayStr()].Breakfast.side;
  }

  const side = pickSide(dish.category, inheritedSide);

  return {
    dish: dish.name,
    category: dish.category,
    weight: dish.weight,
    nutrients: dish.nutrients,
    nutrition: dish.nutrition,
    side: side.name,
    sideSame: side.reused,
    cooked: false,
  };
}

// ─── ACTIONS ─────────────────────────────────────────────────────────────────
function onSelectMeal(meal) {
  state.selectedMeal = meal;
  const store = loadStore();

  // Auto-generate if no suggestion exists for this meal today
  if (!store.todayMenu[todayStr()]?.[meal]) {
    store.todayMenu[todayStr()] = store.todayMenu[todayStr()] || {};
    store.todayMenu[todayStr()][meal] = generateMeal(meal, store);
    saveStore(store);
  }

  renderAll(store);
}

function onShuffle() {
  const meal = state.selectedMeal;
  if (!meal) return;
  const store = loadStore();
  const entry = store.todayMenu[todayStr()]?.[meal];
  if (entry?.cooked) return;

  store.todayMenu[todayStr()][meal] = generateMeal(meal, store, true);

  // If breakfast side changed, re-generate dinner's side too (if dinner was reusing breakfast's side)
  if (meal === "Breakfast") {
    const dinner = store.todayMenu[todayStr()]?.Dinner;
    if (dinner && dinner.sideSame && !dinner.cooked) {
      store.todayMenu[todayStr()].Dinner = generateMeal("Dinner", store);
    }
  }

  saveStore(store);
  renderCard(store.todayMenu[todayStr()][meal]);
  renderAnalysisBanner(store);
}

function onCooked() {
  const meal = state.selectedMeal;
  if (!meal) return;
  const store = loadStore();
  const entry = store.todayMenu[todayStr()]?.[meal];
  if (!entry) return;

  if (entry.cooked) {
    // UNMARK — remove from history, re-enable shuffle
    entry.cooked = false;
    store.history = store.history.filter(h => !(h.date === todayStr() && h.meal === meal));
  } else {
    // MARK as cooked
    entry.cooked = true;
    store.history = store.history.filter(h => !(h.date === todayStr() && h.meal === meal));
    store.history.push({ dish: entry.dish, side: entry.side, meal, date: todayStr() });
  }

  saveStore(store);
  renderCard(entry);
  renderTodayCooked(store);
  renderHistory(store.history);
  renderAnalysisBanner(store);
  renderGroceryList(store);
}

function onGoToGrocery() {
  switchTab("grocery");
}

// ─── INFO / FAQ SHEET ────────────────────────────────────────────────────────
// Accordion: close other <details> when one opens
document.addEventListener("toggle", e => {
  if (e.target.tagName === "DETAILS" && e.target.open && e.target.closest("#info-sheet")) {
    document.querySelectorAll("#info-sheet details").forEach(d => {
      if (d !== e.target) d.open = false;
    });
  }
}, true);

function openInfo() {
  document.getElementById("info-overlay").classList.add("open");
  document.getElementById("info-sheet").classList.add("open");
}

function closeInfo() {
  document.getElementById("info-overlay").classList.remove("open");
  document.getElementById("info-sheet").classList.remove("open");
}

// ─── SETTINGS SHEET ──────────────────────────────────────────────────────────
function openSettings() {
  const store = loadStore();
  document.getElementById("toggle-genericSides").checked = !!store.settings.genericSides;
  document.getElementById("toggle-nutrientBias").checked = store.settings.nutrientBias !== false;
  document.getElementById("settings-overlay").classList.add("open");
  document.getElementById("settings-sheet").classList.add("open");
}

function closeSettings() {
  document.getElementById("settings-overlay").classList.remove("open");
  document.getElementById("settings-sheet").classList.remove("open");
}

function onToggleSetting(key, value) {
  const store = loadStore();
  store.settings[key] = value;
  saveStore(store);
  renderAll(store);
}

// ─── DISH SEARCH SHEET ───────────────────────────────────────────────────────
function openDishSearch() {
  const input = document.getElementById("dish-search-input");
  if (input) input.value = "";
  renderDishSearchResults([], "");
  document.getElementById("search-overlay").classList.add("open");
  document.getElementById("search-sheet").classList.add("open");
  setTimeout(() => input?.focus(), 320);
}

function closeDishSearch() {
  document.getElementById("search-overlay").classList.remove("open");
  document.getElementById("search-sheet").classList.remove("open");
}

function onDishSearch(query) {
  const q = query.toLowerCase().trim();
  if (q.length < 2) { renderDishSearchResults([], query); return; }
  const results = DISHES.filter(d => d.name.toLowerCase().includes(q));
  renderDishSearchResults(results, query);
}

function renderDishSearchResults(results, query) {
  const container = document.getElementById("dish-search-results");
  if (!container) return;

  if (!query || query.trim().length < 2) {
    container.innerHTML = `<p class="search-hint">Type at least 2 letters to search all dishes</p>`;
    return;
  }
  if (results.length === 0) {
    container.innerHTML = `<p class="search-hint">No dishes found for "<strong>${esc(query.trim())}</strong>"</p>`;
    return;
  }

  container.innerHTML = results.map(dish => {
    const mealBtns = dish.meals.map(m =>
      `<button class="dish-result-log-btn"
               data-dish="${esc(dish.name)}" data-meal="${m}"
               data-action="log-dish">
         ${MEAL_ICONS[m]} ${m}
       </button>`
    ).join("");
    return `
      <div class="dish-result">
        <div class="dish-result-info">
          <div class="dish-result-name">${esc(dish.name)}</div>
          <div class="dish-result-cat">${esc(dish.category)}</div>
        </div>
        <div class="dish-result-actions">${mealBtns}</div>
      </div>`;
  }).join("");
}

function logSearchedDish(dishName, meal) {
  const dish = DISHES.find(d => d.name === dishName);
  if (!dish) return;

  const store = loadStore();
  const today = todayStr();
  store.todayMenu[today] = store.todayMenu[today] || {};

  const side = pickSide(dish.category, null);
  store.todayMenu[today][meal] = {
    dish: dish.name,
    category: dish.category,
    weight: dish.weight,
    nutrients: dish.nutrients,
    nutrition: dish.nutrition,
    side: side.name,
    sideSame: false,
    cooked: true,
  };

  store.history = store.history.filter(h => !(h.date === today && h.meal === meal));
  store.history.push({ dish: dish.name, side: side.name, meal, date: today });

  saveStore(store);
  closeDishSearch();
  state.selectedMeal = meal;
  switchTab("today");
  renderAll(store);
}

// ─── EXPORT / IMPORT ─────────────────────────────────────────────────────────
function onExport() {
  const store = loadStore();
  const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ruchi-backup-${todayStr()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function onImportFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 500_000) { showDataStatus("File too large to import.", true); return; }
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data.history) || typeof data.todayMenu !== "object") {
        showDataStatus("Invalid backup file — import cancelled.", true);
        return;
      }
      data.history = data.history.filter(isValidEntry);
      if (!data.settings || typeof data.settings !== "object") {
        data.settings = { includeEgg: true };
      }
      saveStore(data);
      renderAll(loadStore());
      showDataStatus("Data restored successfully!");
    } catch {
      showDataStatus("Could not read file. Choose a valid Ruchi backup.", true);
    }
  };
  reader.readAsText(file);
  event.target.value = ""; // reset so same file can be re-imported
}

function showDataStatus(msg, isError = false) {
  const el = document.getElementById("data-status");
  if (!el) return;
  el.textContent = msg;
  el.className = "data-status" + (isError ? " data-status-error" : "");
  setTimeout(() => { el.textContent = ""; el.className = "data-status"; }, 3500);
}

// ─── GROCERY LIST ────────────────────────────────────────────────────────────
function getGroceryItems(store) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const items = new Set();

  // From cooked history (past 7 days)
  store.history.filter(h => h.date >= cutoffStr).forEach(h => {
    addDishIngredients(h.dish, items);
    addSideIngredients(h.side, items);
  });

  // Today's planned meals (even if not yet cooked)
  const todayMenu = store.todayMenu[todayStr()] || {};
  ["Breakfast", "Dinner"].forEach(meal => {
    if (todayMenu[meal]) {
      addDishIngredients(todayMenu[meal].dish, items);
      addSideIngredients(todayMenu[meal].side, items);
    }
  });

  return [...items];
}

function addDishIngredients(dishName, items) {
  const dish = DISHES.find(d => d.name === dishName);
  if (!dish) return;
  (CATEGORY_BASE_INGREDIENTS[dish.category] || []).forEach(i => items.add(i));
  (DISH_EXTRAS[dishName] || []).forEach(i => items.add(i));
}

function addSideIngredients(sideName, items) {
  const side = SIDES.find(s => s.name === sideName);
  if (!side) return;
  (SIDE_TYPE_INGREDIENTS[side.type] || []).forEach(i => items.add(i));
}

// ─── TODAY COOKED SUMMARY ─────────────────────────────────────────────────────
function renderTodayCooked(store) {
  const el = document.getElementById("today-cooked");
  if (!el) return;

  const todayMenu = store.todayMenu[todayStr()] || {};
  const cooked = [];
  ["Breakfast", "Dinner"].forEach(meal => {
    if (todayMenu[meal]?.cooked) {
      cooked.push({ meal, dish: todayMenu[meal].dish, side: todayMenu[meal].side });
    }
  });

  if (cooked.length === 0) { el.innerHTML = ""; return; }

  const settings = store.settings || {};
  el.innerHTML = `
    <div class="today-cooked-section">
      <div class="today-cooked-title">Cooked today</div>
      ${cooked.map(c => {
    const sd = settings.genericSides ? genericSideName(c.side) : c.side;
    return `
          <div class="today-cooked-item">
            <span class="today-cooked-icon">${MEAL_ICONS[c.meal] || ""}</span>
            <div class="today-cooked-text">
              <span class="today-cooked-dish">${esc(c.dish)}</span>
              <span class="today-cooked-side">with ${esc(sd)}</span>
            </div>
          </div>`;
  }).join("")}
    </div>
  `;
}

// ─── RENDERING ────────────────────────────────────────────────────────────────
function renderAll(store) {
  // Meal selector buttons
  ["Breakfast", "Dinner"].forEach(meal => {
    const btn = document.getElementById(`btn-meal-${meal.toLowerCase()}`);
    if (btn) btn.className = "btn-meal" + (state.selectedMeal === meal ? " active" : "");
  });

  // Card
  const entry = state.selectedMeal
    ? store.todayMenu[todayStr()]?.[state.selectedMeal]
    : null;
  renderCard(entry);
  renderSuggestionNudge(store);
  renderTodayCooked(store);

  renderAnalysisBanner(store);
  renderHistory(store.history);
  renderGroceryList(store);
}

// ─── PENDING MEALS TOAST ─────────────────────────────────────────────────────
let _pendingToastTimer = null;

function showPendingToast(store) {
  const toast = document.getElementById("pending-toast");
  if (!toast) return;

  const cookedToday = new Set(
    store.history.filter(h => h.date === todayStr()).map(h => h.meal)
  );
  const pending = ["Breakfast", "Dinner"].filter(meal => !cookedToday.has(meal));

  if (pending.length === 0) { hidePendingToast(); return; }

  const mealLabel = pending.length === 2 ? "meals" : pending[0].toLowerCase();
  toast.innerHTML = `
    <span class="pending-toast-icon">🍽️</span>
    <div class="pending-toast-body">
      <div class="pending-toast-msg">Remember to log today's ${esc(mealLabel)}</div>
      <div class="pending-toast-sub">Keeps your nutrient tracking accurate</div>
    </div>
    <button class="pending-toast-close" data-action="close-toast">✕</button>
  `;

  toast.classList.add("show");
  clearTimeout(_pendingToastTimer);
  _pendingToastTimer = setTimeout(hidePendingToast, 5000);
}

function hidePendingToast() {
  const toast = document.getElementById("pending-toast");
  if (toast) toast.classList.remove("show");
  clearTimeout(_pendingToastTimer);
}

function selectPendingMeal(meal) {
  state.selectedMeal = meal;
  const store = loadStore();
  renderAll(store);
  document.getElementById("card-wrap")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ─── SERVING SIZES PER CATEGORY ──────────────────────────────────────────────
const SERVING_SIZES = {
  "Idli": "2 pieces",
  "Dosa": "1 medium",
  "Uttapam": "1 piece",
  "Pongal": "1 bowl (~200g)",
  "Upma": "1 bowl (~200g)",
  "Semiya": "1 bowl (~200g)",
  "Chapati": "2 rotis",
  "Puttu": "1 serving (~150g)",
  "Poori": "2 pieces",
  "Paniyaram": "4–5 pieces",
  "Kozhukattai": "3–4 pieces",
  "Naan": "1 piece",
  "Rice": "1 serving (~250g)",
  "Noodles": "1 serving (~200g)",
  "Bread": "1 serving",
  "Other": "1 serving",
};

// ─── ANALYSIS BANNER ─────────────────────────────────────────────────────────
const NUTRIENT_ICONS = { Protein: "🥚", Calcium: "🦴", Iron: "🌿", Fiber: "🌾" };
const NUTRIENT_COLORS = { Protein: "#E74C3C", Calcium: "#3498DB", Iron: "#F39C12", Fiber: "#27AE60" };

function renderSuggestionNudge(store) {
  const el = document.getElementById("suggestion-nudge");
  if (!el) return;
  if (!state.selectedMeal) { el.innerHTML = ""; return; }

  const settings = store.settings || {};
  const { deficient } = getWeeklyAnalysis(store.history);

  let text = "";
  if (settings.nutrientBias === false) {
    text = "Variety-based pick · nutrient-smart picks off";
  } else if (deficient.length > 0) {
    const topN = Math.max(1, Math.ceil(deficient.length / 2));
    const priority = deficient.slice(0, topN);
    text = `Picking for <strong>${esc(priority.join(" + "))}</strong> this week`;
  }

  el.innerHTML = text ? `<div class="suggestion-nudge">${text}</div>` : "";
}

function renderAnalysisBanner(store) {
  const banner = document.getElementById("analysis-banner");
  if (!banner) return;

  const history = store.history;
  const settings = store.settings || {};
  const { totals, deficient, totalMeals } = getWeeklyAnalysis(history);

  if (totalMeals === 0) {
    banner.innerHTML = `<p class="no-history" style="padding:40px 0">Cook a few meals and your nutrient balance will appear here.</p>`;
    return;
  }

  const bars = ALL_NUTRIENTS.map(n => {
    const fillPct = Math.min((totals[n] / WEEKLY_TARGETS[n]) * 100, 100);
    const color = fillPct >= 66 ? "#27AE60"
      : fillPct >= 33 ? "#F9C74F"
        : "#E74C3C";
    const fillStr = fillPct.toFixed(1);
    const val = totals[n] < 10 ? totals[n].toFixed(1) : Math.round(totals[n]);
    return `
      <div class="pbar-row">
        <div class="pbar-label">${NUTRIENT_ICONS[n]} ${esc(n)}</div>
        <div class="pbar-track">
          <div class="pbar-fill" style="width:${fillStr}%;background:${color}"></div>
        </div>
        <div class="pbar-value">${esc(String(val))}${esc(NUTRIENT_UNITS[n])}</div>
      </div>`;
  }).join("");

  const nudge = deficient.length > 0
    ? `<div class="analysis-nudge">Low this week: <strong>${esc(deficient.join(", "))}</strong></div>`
    : `<div class="analysis-nudge">Great balance this week! 🎉</div>`;

  banner.innerHTML = `
    <div class="analysis-title">This week's nutrient intake</div>
    <div class="analysis-subtitle">Breakfast &amp; dinner · this week</div>
    ${bars}
    ${nudge}
  `;
}

function renderCard(entry) {
  const wrap = document.getElementById("card-wrap");
  if (!wrap) return;

  if (!state.selectedMeal) {
    wrap.innerHTML = `<div class="meal-card empty"><div class="empty-icon">🍽️</div><div class="empty-title">What should I cook today?</div><div class="empty-sub">Tap ☀️ Breakfast or 🌙 Dinner above to get a suggestion</div><div class="empty-badge">🌿 Currently featuring South Indian meals only</div></div>`;
    return;
  }

  if (!entry) {
    wrap.innerHTML = `<div class="meal-card empty">Generating suggestion...</div>`;
    return;
  }

  const cooked = entry.cooked;

  const store = loadStore();
  const settings = store.settings || {};
  const sideDisplay = settings.genericSides ? genericSideName(entry.side) : entry.side;

  // Verify the sides actually match right now — stored sideSame can go stale if breakfast is shuffled
  const breakfastSide = store.todayMenu[todayStr()]?.Breakfast?.side;
  const isSameSide = state.selectedMeal === "Dinner" && !!breakfastSide && breakfastSide === entry.side;
  const sameSideHTML = isSameSide
    ? `<div class="same-side-note">♻️ Same as breakfast — no extra cooking needed</div>`
    : "";

  // Standout nutrient tags (always visible)
  const tagsHTML = entry.nutrients && entry.nutrients.length > 0
    ? `<div class="nutrient-tags">${entry.nutrients.map(t =>
      `<span class="nutrient-tag" style="border-color:${esc(NUTRIENT_COLORS[t] || "#888")};color:${esc(NUTRIENT_COLORS[t] || "#888")}">${NUTRIENT_ICONS[t] || ""} ${esc(t)}</span>`
    ).join("")}</div>`
    : `<div class="nutrient-tags"><span class="nutrient-tag-plain">No standout nutrients</span></div>`;

  // Collapsible macro breakdown
  const n = entry.nutrition || {};
  const nutritionPanelHTML = n.cal ? `
    <button class="btn-nutrition-toggle" data-action="nut-toggle">
      📊 Nutrition info <span class="toggle-arrow">▾</span>
    </button>
    <div class="nutrition-panel">
      <div class="nutrition-row">
        <span class="nut-item"><span class="nut-label">Cal</span>${esc(String(n.cal))}</span>
        <span class="nut-item"><span class="nut-label">Protein</span>${esc(String(n.protein))}g</span>
        <span class="nut-item"><span class="nut-label">Carbs</span>${esc(String(n.carbs))}g</span>
        <span class="nut-item"><span class="nut-label">Fat</span>${esc(String(n.fat))}g</span>
        <span class="nut-item"><span class="nut-label">Fiber</span>${esc(String(n.fiber))}g</span>
      </div>
      <div class="nutrition-note">Main dish only · per ${esc(SERVING_SIZES[entry.category] || "1 serving")} · approx</div>
    </div>
  ` : "";

  wrap.innerHTML = `
    <div class="meal-card${cooked ? " cooked" : ""}">
      <span class="category-badge">${esc(entry.category)}</span>
      <div class="dish-name">${esc(entry.dish)}</div>
      <div class="side-label">Side dish</div>
      <div class="side-name">${esc(sideDisplay)}</div>
      ${sameSideHTML}
      ${tagsHTML}
      ${nutritionPanelHTML}
      <div class="card-actions">
        <button class="btn-shuffle" data-action="shuffle" ${cooked ? "disabled" : ""}>↻ Try another</button>
        <button class="btn-cooked ${cooked ? "btn-cooked-undo" : ""}" data-action="cooked">
          ${cooked ? "✓ Cooked — Tap to undo" : "Mark as Cooked"}
        </button>
      </div>
    </div>
  `;
}

function renderHistory(history) {
  const container = document.getElementById("history-list");
  if (!container) return;

  if (!history || history.length === 0) {
    container.innerHTML = `<p class="no-history">No history yet. Start cooking!</p>`;
    return;
  }

  const grouped = {};
  history.forEach(h => { (grouped[h.date] = grouped[h.date] || []).push(h); });

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  container.innerHTML = sortedDates.map(date => {
    const label = date === todayStr() ? "Today" : formatDate(date);
    const entries = grouped[date].map(h => `
      <div class="history-entry">
        <span class="history-meal-icon">${MEAL_ICONS[h.meal] || ""}</span>
        <div class="history-text">
          <span class="history-dish">${esc(h.dish)}</span>
          <span class="history-side">with ${esc(h.side)}</span>
        </div>
      </div>
    `).join("");
    return `<div class="history-day"><div class="history-date">${esc(label)}</div>${entries}</div>`;
  }).join("");
}

function renderGroceryList(store) {
  const section = document.getElementById("grocery-section");
  if (!section) return;

  const mealItems = getGroceryItems(store);

  const MEAL_LIMIT = 10;

  const mealItemRow = item => `
    <label class="grocery-item" data-item="${esc(item.toLowerCase())}">
      <input type="checkbox">
      <span>${esc(item)}</span>
    </label>`;

  const needsCollapse = mealItems.length > MEAL_LIMIT;

  const mealHTML = mealItems.length > 0 ? `
    <div class="grocery-group" id="grocery-group-meal">
      <div class="grocery-group-label">This week's ingredients</div>
      <div class="grocery-meal-wrap${needsCollapse ? ' collapsed' : ''}" id="grocery-meal-wrap">
        <div class="grocery-list">
          ${mealItems.map(mealItemRow).join("")}
        </div>
        ${needsCollapse ? `
          <button class="grocery-fade-btn" id="btn-meal-show-more"
                  data-expanded="false" data-action="show-more">▾ Show more</button>
        ` : ""}
      </div>
    </div>
  ` : "";

  // Exclude items already shown in "This week's ingredients" to avoid duplicates
  const mealItemsLower = new Set(mealItems.map(i => i.toLowerCase()));
  const pantryItems = GENERIC_GROCERIES.filter(i => !mealItemsLower.has(i.toLowerCase()));

  const pantryHTML = `
    <div class="grocery-group grocery-group--collapsible" id="grocery-group-pantry">
      <button class="grocery-group-toggle" data-action="pantry-toggle" aria-expanded="false">
        <span class="grocery-group-label-text">Everyday ingredients</span>
        <span class="grocery-group-count">${pantryItems.length} items</span>
        <span class="grocery-group-arrow">▶</span>
      </button>
      <div class="grocery-group-body">
        <div class="grocery-list">
          ${pantryItems.map(item => `
            <label class="grocery-item" data-item="${esc(item.toLowerCase())}">
              <input type="checkbox">
              <span>${esc(item)}</span>
            </label>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  section.innerHTML = `
    <h2>🛒 Grocery List</h2>
    <div class="grocery-search-wrap">
      <input type="search" class="grocery-search" placeholder="Search groceries…"
             autocomplete="off">
    </div>
    ${mealHTML}
    ${pantryHTML}
    <p class="grocery-note">Tick off as you shop · top section based on this week's meals</p>
  `;
}

function toggleMealMore() {
  const wrap = document.getElementById("grocery-meal-wrap");
  const btn = document.getElementById("btn-meal-show-more");
  if (!wrap || !btn) return;
  const expanding = wrap.classList.contains("collapsed");
  wrap.classList.toggle("collapsed", !expanding);
  btn.dataset.expanded = String(expanding);
  btn.textContent = expanding ? "▴ Show less" : "▾ Show more";
}

function togglePantryGroup() {
  const group = document.getElementById("grocery-group-pantry");
  if (!group) return;
  const isOpen = group.classList.toggle("open");
  const btn = group.querySelector(".grocery-group-toggle");
  if (btn) btn.setAttribute("aria-expanded", isOpen);
}

function onGrocerySearch(query) {
  const q = query.toLowerCase().trim();
  const wrap = document.getElementById("grocery-meal-wrap");
  const showMoreBtn = document.getElementById("btn-meal-show-more");

  // During search reveal all items; on clear restore user's choice
  if (wrap) wrap.classList.toggle("collapsed", !q && showMoreBtn?.dataset.expanded !== "true");
  if (showMoreBtn) showMoreBtn.style.display = q ? "none" : "";

  document.querySelectorAll("#grocery-section .grocery-item").forEach(el => {
    el.style.display = (!q || el.dataset.item.includes(q)) ? "" : "none";
  });

  // Hide group if none of its items match
  document.querySelectorAll("#grocery-section .grocery-group").forEach(group => {
    const hasVisible = [...group.querySelectorAll(".grocery-item")].some(el => el.style.display !== "none");
    group.style.display = hasVisible ? "" : "none";
  });

  // Auto-expand pantry when search finds matches there; collapse when search cleared
  const pantryGroup = document.getElementById("grocery-group-pantry");
  if (pantryGroup) {
    const hasPantryMatch = q && [...pantryGroup.querySelectorAll(".grocery-item")].some(el => el.style.display !== "none");
    const btn = pantryGroup.querySelector(".grocery-group-toggle");
    if (hasPantryMatch) {
      pantryGroup.classList.add("open");
      if (btn) btn.setAttribute("aria-expanded", "true");
    } else if (!q) {
      pantryGroup.classList.remove("open");
      if (btn) btn.setAttribute("aria-expanded", "false");
    }
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

// ─── EVENT BINDING ────────────────────────────────────────────────────────────
function bindEvents() {
  // ── Static element handlers ─────────────────────────────────────────────────
  document.querySelector(".btn-info").addEventListener("click", openInfo);
  document.querySelector(".btn-settings").addEventListener("click", openSettings);
  document.querySelector(".dish-search-pill").addEventListener("click", openDishSearch);
  document.getElementById("btn-meal-breakfast").addEventListener("click", () => onSelectMeal("Breakfast"));
  document.getElementById("btn-meal-dinner").addEventListener("click", () => onSelectMeal("Dinner"));
  document.querySelectorAll(".tab-btn[data-tab]").forEach(btn =>
    btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
  document.getElementById("settings-overlay").addEventListener("click", closeSettings);
  document.getElementById("settings-close-btn").addEventListener("click", closeSettings);
  document.getElementById("toggle-genericSides").addEventListener("change", e => onToggleSetting("genericSides", e.target.checked));
  document.getElementById("toggle-nutrientBias").addEventListener("change", e => onToggleSetting("nutrientBias", e.target.checked));
  document.getElementById("btn-export").addEventListener("click", onExport);
  document.getElementById("file-import").addEventListener("change", onImportFile);
  document.getElementById("info-overlay").addEventListener("click", closeInfo);
  document.getElementById("info-close-btn").addEventListener("click", closeInfo);
  document.getElementById("search-overlay").addEventListener("click", closeDishSearch);
  document.getElementById("search-close-btn").addEventListener("click", closeDishSearch);
  document.getElementById("dish-search-input").addEventListener("input", e => onDishSearch(e.target.value));

  // ── Delegated handlers (dynamic content) ────────────────────────────────────
  document.getElementById("card-wrap").addEventListener("click", e => {
    if (e.target.closest("[data-action='shuffle']")) onShuffle();
    if (e.target.closest("[data-action='cooked']")) onCooked();
    const nutBtn = e.target.closest("[data-action='nut-toggle']");
    if (nutBtn) nutBtn.nextElementSibling.classList.toggle("open");
  });

  document.getElementById("pending-toast").addEventListener("click", e => {
    if (e.target.closest("[data-action='close-toast']")) hidePendingToast();
  });

  document.getElementById("dish-search-results").addEventListener("click", e => {
    const btn = e.target.closest("[data-action='log-dish']");
    if (btn) logSearchedDish(btn.dataset.dish, btn.dataset.meal);
  });

  const grocery = document.getElementById("grocery-section");
  grocery.addEventListener("click", e => {
    if (e.target.closest("[data-action='show-more']")) toggleMealMore();
    if (e.target.closest("[data-action='pantry-toggle']")) togglePantryGroup();
  });
  grocery.addEventListener("change", e => {
    if (e.target.type === "checkbox" && e.target.closest(".grocery-item"))
      e.target.closest(".grocery-item").classList.toggle("checked", e.target.checked);
  });
  grocery.addEventListener("input", e => {
    if (e.target.matches(".grocery-search")) onGrocerySearch(e.target.value);
  });
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
function init() {
  bindEvents();
  const store = loadStore();
  if (!store.todayMenu[todayStr()]) {
    store.todayMenu = { [todayStr()]: {} }; // Only keep today's slot
    saveStore(store);
  }
  switchTab("today");
  renderAll(store);
  setTimeout(() => showPendingToast(loadStore()), 1500);
}

document.addEventListener("DOMContentLoaded", init);

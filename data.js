// ─── SIDES ───────────────────────────────────────────────────────────────────
const SIDES = [
  { name: "Coconut Chutney",         type: "Chutney" },
  { name: "Tomato Chutney",          type: "Chutney" },
  { name: "Onion Chutney",           type: "Chutney" },
  { name: "Garlic Chutney",          type: "Chutney" },
  { name: "Peanut Chutney",          type: "Chutney" },
  { name: "Curry Leaves Chutney",    type: "Chutney" },
  { name: "Pudina Chutney",          type: "Chutney" },
  { name: "Coriander Chutney",       type: "Chutney" },
  { name: "Beetroot Chutney",        type: "Chutney" },
  { name: "Tomato Thokku",           type: "Chutney" },
  { name: "Carrot Chutney",          type: "Chutney" },
  { name: "Beerakaya Chutney",       type: "Chutney" },
  { name: "Capsicum Chutney",        type: "Chutney" },
  { name: "Sorakaya Chutney",        type: "Chutney" },
  { name: "Toor Dal Chutney",        type: "Chutney" },
  { name: "Bombay Chutney",          type: "Chutney" },
  { name: "Classic Sambar",          type: "Sambar" },
  { name: "Brinjal Sambar",          type: "Sambar" },
  { name: "Buttermilk Sambar",       type: "Sambar" },
  { name: "Lady Finger Sambar",      type: "Sambar" },
  { name: "Kerala Ulli Sambar",      type: "Sambar" },
  { name: "Toor Dal Sambar",         type: "Sambar" },
  { name: "Tomato Onion Sambar",     type: "Sambar" },
  { name: "Moong Dal Sambar",        type: "Sambar" },
  { name: "Mix Vegetable Sambar",    type: "Sambar" },
  { name: "Arachuvitta Sambar",      type: "Sambar" },
  { name: "Mango Sambar",            type: "Sambar" },
  { name: "Drumstick Leaves Sambar", type: "Sambar" },
  { name: "Palaa Seed Sambar",       type: "Sambar" },
  { name: "Idli Podi",               type: "Podi" },
  { name: "Ellu Podi",               type: "Podi" },
  { name: "Poondu Podi",             type: "Podi" },
  { name: "Curry Leaves Podi",       type: "Podi" },
  { name: "Pudina Podi",             type: "Podi" },
  { name: "Karam Podi",              type: "Podi" },
  { name: "Coriander Podi",          type: "Podi" },
  { name: "Drumstick Leaves Podi",   type: "Podi" },
  { name: "Vallarai Podi",           type: "Podi" },
  { name: "Groundnut Podi",          type: "Podi" },
  { name: "Empty Salna",    type: "SalnaCurry"  },  // Tamil Nadu gravy → Poori, Chapati, Naan
  { name: "Tomato Kuruma",  type: "SalnaCurry"  },
  { name: "Aviyal",         type: "KeralaKurry" },  // Kerala Sadya style → Puttu only
  { name: "Kadala Curry",   type: "KeralaKurry" },  // Classic Puttu-Kadala pair
  { name: "Egg Curry",      type: "EggCurry"    },  // Gravy egg → Chapati, Naan, Puttu
  { name: "Egg Thokku",     type: "EggCurry"    },  // Dry egg → Dosa, Chapati
  { name: "Vada Curry",     type: "VadaCurry"   },  // Idli/Dosa classic (Madurai)
  // Rice dish accompaniments
  { name: "Appalam (Papad)",  type: "Papad" },
  { name: "Mango Pickle",     type: "Papad" },
  { name: "Mixed Pickle",     type: "Papad" },
  { name: "Lemon Pickle",     type: "Papad" },
];

// ─── CATEGORY RULES ──────────────────────────────────────────────────────────
const CATEGORY_RULES = {
  "Idli":        ["Sambar", "Chutney", "Podi", "VadaCurry"],
  "Dosa":        ["Sambar", "Chutney", "Podi", "EggCurry"],
  "Uttapam":     ["Sambar", "Chutney"],
  "Pongal":      ["Sambar", "Chutney"],
  "Upma":        ["Chutney", "Sambar"],
  "Semiya":      ["Chutney"],
  "Chapati":     ["Chutney", "SalnaCurry", "EggCurry"],
  "Puttu":       ["KeralaKurry", "EggCurry", "Chutney"],
  "Poori":       ["SalnaCurry"],
  "Paniyaram":   ["Chutney", "Sambar"],
  "Kozhukattai": ["Chutney", "Sambar"],
  "Naan":        ["SalnaCurry", "EggCurry", "Chutney"],
  "Rice":        ["Papad", "Chutney"],
  "Noodles":    ["Chutney"],
  "Bread":      ["Chutney", "EggCurry"],
  "Idiyappam":  ["KeralaKurry", "EggCurry", "Chutney", "Sambar"],
  "Appam":      ["KeralaKurry", "EggCurry", "Chutney"],
  "Pasta":      ["Chutney"],
  "Kothu":      ["Chutney"],
  "Paratha":    ["Chutney", "EggCurry"],
  "Other":      ["Chutney"],
};

// ─── DISHES ──────────────────────────────────────────────────────────────────
// nutrition: approximate per typical serving (home-cooked, moderate oil)
//   Idli = 2 pcs | Dosa = 1 medium | Chapati = 2 rotis
//   Pongal/Upma/Semiya = 1 bowl (~200g) | Puttu = 1 serving (~150g)
// nutrients: tags for STANDOUT nutrients only
//   Protein ≥ 7g | Calcium ≥ 100mg | Iron ≥ 2.5mg | Fiber ≥ 3g
// weight: "Light" or "Heavy" (less/more oil, filling)

const DISHES = [

  // ── Idli ──────────────────────────────────────────────────────────────────
  {
    name: "Rice Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 130, protein: 4.5, carbs: 26, fat: 0.5, fiber: 1.0, calcium: 20, iron: 0.5},
    nutrients: [],
  },
  {
    name: "Podi Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 145, protein: 4.5, carbs: 26, fat: 2.5, fiber: 1.0, calcium: 20, iron: 0.5},
    nutrients: [],
  },
  {
    name: "Poha Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 135, protein: 4.5, carbs: 27, fat: 0.8, fiber: 1.2, calcium: 15, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Oats Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 145, protein: 6.0, carbs: 25, fat: 2.0, fiber: 3.0, calcium: 25, iron: 1.5},
    nutrients: ["Fiber"],
  },
  {
    name: "Ragi Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 150, protein: 5.5, carbs: 28, fat: 1.0, fiber: 2.5, calcium: 230, iron: 2.0},
    nutrients: ["Calcium"],
  },
  {
    name: "Vermicelli Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 140, protein: 4.0, carbs: 28, fat: 1.0, fiber: 1.0, calcium: 15, iron: 0.5},
    nutrients: [],
  },
  {
    name: "Drumstick Leaves Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 135, protein: 5.0, carbs: 26, fat: 1.0, fiber: 1.5, calcium: 160, iron: 3.5},
    nutrients: ["Iron"],
  },
  {
    name: "Rava Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 155, protein: 5.0, carbs: 29, fat: 2.5, fiber: 1.5, calcium: 20, iron: 0.8},
    nutrients: [],
  },
  {
    name: "Pumpkin Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 130, protein: 4.0, carbs: 26, fat: 0.5, fiber: 1.5, calcium: 25, iron: 0.8},
    nutrients: [],
  },
  {
    name: "Carrot / Beetroot Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 135, protein: 4.5, carbs: 27, fat: 0.5, fiber: 1.5, calcium: 25, iron: 1.5},
    nutrients: [],
  },
  {
    name: "Mongdaal Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 150, protein: 8.5, carbs: 24, fat: 1.0, fiber: 3.0, calcium: 40, iron: 2.5},
    nutrients: ["Protein", "Fiber"],
  },
  {
    name: "Horsegram Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 160, protein: 9.0, carbs: 25, fat: 1.5, fiber: 4.5, calcium: 80, iron: 3.5},
    nutrients: ["Protein", "Iron", "Fiber"],
  },
  {
    name: "Broken Wheat Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 145, protein: 5.5, carbs: 27, fat: 1.0, fiber: 3.5, calcium: 25, iron: 1.5},
    nutrients: ["Fiber"],
  },
  {
    name: "Kanchipuram Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 165, protein: 5.0, carbs: 28, fat: 3.0, fiber: 1.0, calcium: 22, iron: 0.8},
    nutrients: [],
  },
  {
    name: "Mini Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 130, protein: 4.5, carbs: 26, fat: 0.5, fiber: 1.0, calcium: 20, iron: 0.5},
    nutrients: [],
  },
  {
    name: "Varagu Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 140, protein: 5.0, carbs: 26, fat: 0.8, fiber: 2.5, calcium: 20, iron: 2.0},
    nutrients: ["Fiber"],
  },
  {
    name: "Thinai Idli", meals: ["Breakfast", "Dinner"], category: "Idli", weight: "Light",
    nutrition: { cal: 145, protein: 5.5, carbs: 27, fat: 0.8, fiber: 3.0, calcium: 25, iron: 2.5},
    nutrients: ["Fiber"],
  },

  // ── Dosa ──────────────────────────────────────────────────────────────────
  {
    name: "Plain Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 120, protein: 3.5, carbs: 22, fat: 2.0, fiber: 0.8, calcium: 15, iron: 0.5},
    nutrients: [],
  },
  {
    name: "Masala Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Heavy",
    nutrition: { cal: 200, protein: 5.0, carbs: 34, fat: 5.0, fiber: 2.5, calcium: 30, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Mysore Masala Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Heavy",
    nutrition: { cal: 230, protein: 5.5, carbs: 35, fat: 7.5, fiber: 2.5, calcium: 30, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Set Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 175, protein: 5.0, carbs: 30, fat: 4.0, fiber: 1.5, calcium: 20, iron: 0.8},
    nutrients: [],
  },
  {
    name: "Rava Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 150, protein: 4.0, carbs: 26, fat: 3.5, fiber: 1.0, calcium: 18, iron: 0.8},
    nutrients: [],
  },
  {
    name: "Cheese Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Heavy",
    nutrition: { cal: 220, protein: 9.0, carbs: 23, fat: 11.0, fiber: 0.8, calcium: 190, iron: 0.5},
    nutrients: ["Protein", "Calcium"],
  },
  {
    name: "Adai Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Heavy",
    nutrition: { cal: 175, protein: 9.0, carbs: 26, fat: 3.5, fiber: 4.0, calcium: 65, iron: 2.5},
    nutrients: ["Protein", "Fiber"],
  },
  {
    name: "Neer Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 100, protein: 2.5, carbs: 20, fat: 1.0, fiber: 0.5, calcium: 12, iron: 0.3},
    nutrients: [],
  },
  {
    name: "Atta Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 145, protein: 5.5, carbs: 25, fat: 2.5, fiber: 2.8, calcium: 20, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Millet Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 135, protein: 4.5, carbs: 24, fat: 1.5, fiber: 2.5, calcium: 30, iron: 2.5},
    nutrients: [],
  },
  {
    name: "Egg Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Heavy", egg: true,
    nutrition: { cal: 195, protein: 9.5, carbs: 21, fat: 7.5, fiber: 0.8, calcium: 35, iron: 1.5},
    nutrients: ["Protein"],
  },
  {
    name: "Oats Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 130, protein: 5.0, carbs: 21, fat: 2.5, fiber: 3.5, calcium: 25, iron: 1.5},
    nutrients: ["Fiber"],
  },
  {
    name: "Masala Oats Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Heavy",
    nutrition: { cal: 165, protein: 5.5, carbs: 27, fat: 5.0, fiber: 3.5, calcium: 30, iron: 1.8},
    nutrients: ["Fiber"],
  },
  {
    name: "Moon Dal Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 155, protein: 8.5, carbs: 23, fat: 2.0, fiber: 3.5, calcium: 35, iron: 2.5},
    nutrients: ["Protein", "Fiber"],
  },
  {
    name: "Ragi Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 140, protein: 4.5, carbs: 25, fat: 1.5, fiber: 2.0, calcium: 210, iron: 1.8},
    nutrients: ["Calcium"],
  },
  {
    name: "Jowar Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 125, protein: 4.0, carbs: 24, fat: 1.5, fiber: 2.5, calcium: 25, iron: 2.5},
    nutrients: [],
  },
  {
    name: "Chana Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 150, protein: 6.0, carbs: 24, fat: 3.0, fiber: 3.0, calcium: 40, iron: 2.0},
    nutrients: ["Fiber"],
  },
  {
    name: "Oats Green Gram Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 145, protein: 7.0, carbs: 22, fat: 3.0, fiber: 4.0, calcium: 40, iron: 2.5},
    nutrients: ["Protein", "Fiber"],
  },
  {
    name: "Podi Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Heavy",
    nutrition: { cal: 200, protein: 5.0, carbs: 28, fat: 9.0, fiber: 2.0, calcium: 18, iron: 0.8},
    nutrients: [],
  },
  {
    name: "Ghee Roast", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Heavy",
    nutrition: { cal: 185, protein: 3.5, carbs: 22, fat: 8.5, fiber: 0.8, calcium: 15, iron: 0.5},
    nutrients: [],
  },
  {
    name: "Varagu Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 130, protein: 4.0, carbs: 23, fat: 1.5, fiber: 2.0, calcium: 20, iron: 1.8},
    nutrients: [],
  },
  {
    name: "Thinai Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 135, protein: 4.5, carbs: 24, fat: 1.5, fiber: 2.5, calcium: 25, iron: 2.0},
    nutrients: [],
  },
  {
    name: "Pesarattu", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Heavy",
    nutrition: { cal: 180, protein: 10.0, carbs: 25, fat: 4.0, fiber: 4.0, calcium: 40, iron: 3.0},
    nutrients: ["Protein", "Iron", "Fiber"],
  },
  {
    name: "Tomato Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 125, protein: 3.5, carbs: 22, fat: 2.5, fiber: 1.5, calcium: 15, iron: 0.8},
    nutrients: [],
  },
  {
    name: "Palak Dosa", meals: ["Breakfast", "Dinner"], category: "Dosa", weight: "Light",
    nutrition: { cal: 130, protein: 4.5, carbs: 22, fat: 2.5, fiber: 2.0, calcium: 50, iron: 3.0},
    nutrients: ["Iron"],
  },

  // ── Uttapam ───────────────────────────────────────────────────────────────
  {
    name: "Uttapam", meals: ["Breakfast", "Dinner"], category: "Uttapam", weight: "Light",
    nutrition: { cal: 160, protein: 5.0, carbs: 28, fat: 3.5, fiber: 1.5, calcium: 22, iron: 0.8},
    nutrients: [],
  },
  {
    name: "Onion Uttapam", meals: ["Breakfast", "Dinner"], category: "Uttapam", weight: "Light",
    nutrition: { cal: 170, protein: 5.0, carbs: 29, fat: 4.0, fiber: 2.0, calcium: 25, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Tomato Uttapam", meals: ["Breakfast", "Dinner"], category: "Uttapam", weight: "Light",
    nutrition: { cal: 175, protein: 5.5, carbs: 30, fat: 4.0, fiber: 2.0, calcium: 30, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Mixed Veg Uttapam", meals: ["Breakfast", "Dinner"], category: "Uttapam", weight: "Light",
    nutrition: { cal: 185, protein: 6.0, carbs: 30, fat: 4.5, fiber: 3.0, calcium: 35, iron: 1.5},
    nutrients: ["Fiber"],
  },
  {
    name: "Cheese Uttapam", meals: ["Breakfast", "Dinner"], category: "Uttapam", weight: "Heavy",
    nutrition: { cal: 230, protein: 10.0, carbs: 28, fat: 9.0, fiber: 1.5, calcium: 200, iron: 0.8},
    nutrients: ["Protein", "Calcium"],
  },

  // ── Pongal ────────────────────────────────────────────────────────────────
  {
    name: "Rice Pongal", meals: ["Breakfast", "Dinner"], category: "Pongal", weight: "Light",
    nutrition: { cal: 310, protein: 9.5, carbs: 48, fat: 8.0, fiber: 2.5, calcium: 35, iron: 1.5},
    nutrients: ["Protein"],
  },
  {
    name: "Wheat Pongal", meals: ["Breakfast", "Dinner"], category: "Pongal", weight: "Light",
    nutrition: { cal: 300, protein: 9.5, carbs: 46, fat: 7.5, fiber: 4.0, calcium: 30, iron: 2.0},
    nutrients: ["Protein", "Fiber"],
  },
  {
    name: "Millet Pongal", meals: ["Breakfast", "Dinner"], category: "Pongal", weight: "Light",
    nutrition: { cal: 300, protein: 9.5, carbs: 46, fat: 7.5, fiber: 5.0, calcium: 40, iron: 3.5},
    nutrients: ["Protein", "Iron", "Fiber"],
  },
  {
    name: "Ragi Pongal", meals: ["Breakfast", "Dinner"], category: "Pongal", weight: "Light",
    nutrition: { cal: 295, protein: 9.0, carbs: 46, fat: 7.5, fiber: 4.5, calcium: 290, iron: 3.0},
    nutrients: ["Protein", "Calcium", "Iron", "Fiber"],
  },
  {
    name: "Horsegram Pongal", meals: ["Breakfast", "Dinner"], category: "Pongal", weight: "Light",
    nutrition: { cal: 305, protein: 12.0, carbs: 44, fat: 7.0, fiber: 6.0, calcium: 85, iron: 4.5},
    nutrients: ["Protein", "Iron", "Fiber"],
  },
  {
    name: "Varagu Pongal", meals: ["Breakfast", "Dinner"], category: "Pongal", weight: "Light",
    nutrition: { cal: 295, protein: 9.0, carbs: 45, fat: 7.0, fiber: 5.0, calcium: 35, iron: 3.5},
    nutrients: ["Protein", "Iron", "Fiber"],
  },
  {
    name: "Thinai Pongal", meals: ["Breakfast", "Dinner"], category: "Pongal", weight: "Light",
    nutrition: { cal: 285, protein: 8.5, carbs: 44, fat: 7.0, fiber: 5.0, calcium: 30, iron: 3.0},
    nutrients: ["Protein", "Iron", "Fiber"],
  },
  {
    name: "Sweet Pongal", meals: ["Breakfast", "Dinner"], category: "Pongal", weight: "Heavy",
    nutrition: { cal: 380, protein: 7.0, carbs: 68, fat: 9.0, fiber: 2.0, calcium: 40, iron: 1.5},
    nutrients: [],
  },

  // ── Upma ──────────────────────────────────────────────────────────────────
  {
    name: "Wheat Upma", meals: ["Breakfast", "Dinner"], category: "Upma", weight: "Light",
    nutrition: { cal: 250, protein: 6.5, carbs: 40, fat: 7.0, fiber: 2.0, calcium: 20, iron: 1.5},
    nutrients: [],
  },
  {
    name: "Millet Upma", meals: ["Breakfast", "Dinner"], category: "Upma", weight: "Light",
    nutrition: { cal: 230, protein: 6.5, carbs: 38, fat: 6.5, fiber: 5.5, calcium: 35, iron: 3.5},
    nutrients: ["Iron", "Fiber"],
  },
  {
    name: "Ragi Upma", meals: ["Breakfast", "Dinner"], category: "Upma", weight: "Light",
    nutrition: { cal: 235, protein: 6.0, carbs: 39, fat: 6.0, fiber: 3.5, calcium: 260, iron: 2.5},
    nutrients: ["Calcium", "Fiber"],
  },
  {
    name: "Horsegram Upma", meals: ["Breakfast", "Dinner"], category: "Upma", weight: "Light",
    nutrition: { cal: 240, protein: 9.0, carbs: 36, fat: 6.0, fiber: 5.0, calcium: 70, iron: 4.0},
    nutrients: ["Protein", "Iron", "Fiber"],
  },
  {
    name: "Varagu Upma", meals: ["Breakfast", "Dinner"], category: "Upma", weight: "Light",
    nutrition: { cal: 225, protein: 6.0, carbs: 37, fat: 6.0, fiber: 4.0, calcium: 30, iron: 3.0},
    nutrients: ["Fiber"],
  },
  {
    name: "Oats Upma", meals: ["Breakfast", "Dinner"], category: "Upma", weight: "Light",
    nutrition: { cal: 200, protein: 6.5, carbs: 32, fat: 5.0, fiber: 5.0, calcium: 25, iron: 2.0},
    nutrients: ["Fiber"],
  },
  {
    name: "Sabudana Upma", meals: ["Breakfast", "Dinner"], category: "Upma", weight: "Light",
    nutrition: { cal: 280, protein: 3.0, carbs: 58, fat: 5.0, fiber: 1.0, calcium: 15, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Kambu Upma", meals: ["Breakfast", "Dinner"], category: "Upma", weight: "Light",
    nutrition: { cal: 230, protein: 6.5, carbs: 38, fat: 6.5, fiber: 5.0, calcium: 40, iron: 4.0},
    nutrients: ["Iron", "Fiber"],
  },

  // ── Semiya ────────────────────────────────────────────────────────────────
  {
    name: "Wheat Semiya", meals: ["Breakfast", "Dinner"], category: "Semiya", weight: "Light",
    nutrition: { cal: 240, protein: 6.0, carbs: 40, fat: 6.5, fiber: 2.5, calcium: 15, iron: 0.8},
    nutrients: [],
  },
  {
    name: "Millet Semiya", meals: ["Breakfast", "Dinner"], category: "Semiya", weight: "Light",
    nutrition: { cal: 225, protein: 6.0, carbs: 38, fat: 6.0, fiber: 4.5, calcium: 30, iron: 3.0},
    nutrients: ["Iron", "Fiber"],
  },
  {
    name: "Ragi Semiya", meals: ["Breakfast", "Dinner"], category: "Semiya", weight: "Light",
    nutrition: { cal: 230, protein: 6.0, carbs: 39, fat: 6.0, fiber: 3.5, calcium: 220, iron: 2.5},
    nutrients: ["Calcium", "Fiber"],
  },
  {
    name: "Horsegram Semiya", meals: ["Breakfast", "Dinner"], category: "Semiya", weight: "Light",
    nutrition: { cal: 240, protein: 9.0, carbs: 37, fat: 6.0, fiber: 4.5, calcium: 65, iron: 3.5},
    nutrients: ["Protein", "Iron"],
  },
  {
    name: "Varagu Semiya", meals: ["Breakfast", "Dinner"], category: "Semiya", weight: "Light",
    nutrition: { cal: 220, protein: 6.0, carbs: 37, fat: 6.0, fiber: 4.0, calcium: 30, iron: 3.0},
    nutrients: ["Fiber"],
  },

  // ── Chapati ───────────────────────────────────────────────────────────────
  {
    name: "Wheat Chapati", meals: ["Breakfast", "Dinner"], category: "Chapati", weight: "Light",
    nutrition: { cal: 210, protein: 7.0, carbs: 38, fat: 4.0, fiber: 4.5, calcium: 20, iron: 2.0},
    nutrients: ["Protein", "Fiber"],
  },
  {
    name: "Millet Chapati", meals: ["Breakfast", "Dinner"], category: "Chapati", weight: "Light",
    nutrition: { cal: 220, protein: 7.0, carbs: 39, fat: 4.5, fiber: 5.5, calcium: 30, iron: 3.0},
    nutrients: ["Iron", "Fiber"],
  },
  {
    name: "Ragi Chapati", meals: ["Breakfast", "Dinner"], category: "Chapati", weight: "Light",
    nutrition: { cal: 230, protein: 7.5, carbs: 40, fat: 4.5, fiber: 6.0, calcium: 250, iron: 3.0},
    nutrients: ["Calcium", "Iron", "Fiber"],
  },
  {
    name: "Horsegram Chapati", meals: ["Breakfast", "Dinner"], category: "Chapati", weight: "Light",
    nutrition: { cal: 240, protein: 10.5, carbs: 37, fat: 4.5, fiber: 6.5, calcium: 80, iron: 4.0},
    nutrients: ["Protein", "Iron", "Fiber"],
  },
  {
    name: "Varagu Chapati", meals: ["Breakfast", "Dinner"], category: "Chapati", weight: "Light",
    nutrition: { cal: 215, protein: 7.0, carbs: 38, fat: 4.5, fiber: 5.5, calcium: 30, iron: 3.0},
    nutrients: ["Iron", "Fiber"],
  },

  // ── Puttu ─────────────────────────────────────────────────────────────────
  {
    name: "Rice Puttu", meals: ["Breakfast", "Dinner"], category: "Puttu", weight: "Light",
    nutrition: { cal: 220, protein: 4.5, carbs: 46, fat: 1.5, fiber: 1.5, calcium: 20, iron: 0.5},
    nutrients: [],
  },
  {
    name: "Wheat Puttu", meals: ["Breakfast", "Dinner"], category: "Puttu", weight: "Light",
    nutrition: { cal: 235, protein: 6.0, carbs: 46, fat: 2.0, fiber: 3.5, calcium: 25, iron: 1.5},
    nutrients: ["Fiber"],
  },
  {
    name: "Millet Puttu", meals: ["Breakfast", "Dinner"], category: "Puttu", weight: "Light",
    nutrition: { cal: 225, protein: 5.5, carbs: 44, fat: 1.5, fiber: 4.5, calcium: 35, iron: 3.0},
    nutrients: ["Iron", "Fiber"],
  },
  {
    name: "Ragi Puttu", meals: ["Breakfast", "Dinner"], category: "Puttu", weight: "Light",
    nutrition: { cal: 245, protein: 6.0, carbs: 47, fat: 2.0, fiber: 4.5, calcium: 260, iron: 2.5},
    nutrients: ["Calcium", "Iron", "Fiber"],
  },
  {
    name: "Horsegram Puttu", meals: ["Breakfast", "Dinner"], category: "Puttu", weight: "Light",
    nutrition: { cal: 250, protein: 8.5, carbs: 42, fat: 2.0, fiber: 5.0, calcium: 75, iron: 4.0},
    nutrients: ["Protein", "Iron", "Fiber"],
  },
  {
    name: "Varagu Puttu", meals: ["Breakfast", "Dinner"], category: "Puttu", weight: "Light",
    nutrition: { cal: 220, protein: 5.5, carbs: 43, fat: 1.5, fiber: 4.5, calcium: 30, iron: 2.5},
    nutrients: ["Fiber"],
  },

  // ── Others ────────────────────────────────────────────────────────────────
  {
    name: "Chola Poori", meals: ["Breakfast"], category: "Poori", weight: "Heavy",
    nutrition: { cal: 320, protein: 8.0, carbs: 46, fat: 10.0, fiber: 6.0, calcium: 45, iron: 3.5},
    nutrients: ["Protein", "Iron", "Fiber"],
  },
  {
    name: "Paniyaram", meals: ["Breakfast", "Dinner"], category: "Paniyaram", weight: "Light",
    nutrition: { cal: 180, protein: 5.5, carbs: 28, fat: 5.5, fiber: 1.5, calcium: 22, iron: 0.8},
    nutrients: [],
  },
  {
    name: "Masala Paniyaram", meals: ["Breakfast", "Dinner"], category: "Paniyaram", weight: "Light",
    nutrition: { cal: 200, protein: 6.0, carbs: 30, fat: 6.0, fiber: 2.0, calcium: 25, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Sweet Paniyaram", meals: ["Breakfast"], category: "Paniyaram", weight: "Light",
    nutrition: { cal: 230, protein: 5.0, carbs: 38, fat: 7.0, fiber: 1.0, calcium: 25, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Plain Poori", meals: ["Breakfast"], category: "Poori", weight: "Heavy",
    nutrition: { cal: 280, protein: 6.0, carbs: 38, fat: 12.0, fiber: 2.5, calcium: 15, iron: 1.5},
    nutrients: [],
  },
  {
    name: "Naan", meals: ["Dinner"], category: "Naan", weight: "Heavy",
    nutrition: { cal: 270, protein: 7.5, carbs: 47, fat: 5.0, fiber: 1.5, calcium: 25, iron: 1.5},
    nutrients: ["Protein"],
  },
  {
    name: "Bread Omelette", meals: ["Breakfast"], category: "Other", weight: "Heavy", egg: true,
    nutrition: { cal: 280, protein: 14.0, carbs: 28, fat: 10.5, fiber: 1.5, calcium: 60, iron: 2.0},
    nutrients: ["Protein"],
  },
  {
    name: "Pancake", meals: ["Breakfast"], category: "Other", weight: "Heavy",
    nutrition: { cal: 250, protein: 6.0, carbs: 35, fat: 10.0, fiber: 1.0, calcium: 40, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Poha", meals: ["Breakfast"], category: "Other", weight: "Light",
    nutrition: { cal: 270, protein: 5.5, carbs: 52, fat: 4.0, fiber: 3.0, calcium: 20, iron: 2.5},
    nutrients: ["Iron", "Fiber"],
  },

  // ── Kozhukattai ───────────────────────────────────────────────────────────
  {
    name: "Plain Kozhukattai", meals: ["Breakfast", "Dinner"], category: "Kozhukattai", weight: "Light",
    nutrition: { cal: 160, protein: 3.0, carbs: 32, fat: 3.0, fiber: 1.5, calcium: 15, iron: 0.5},
    nutrients: [],
  },
  {
    name: "Masala Kozhukattai", meals: ["Breakfast", "Dinner"], category: "Kozhukattai", weight: "Light",
    nutrition: { cal: 190, protein: 5.0, carbs: 33, fat: 4.5, fiber: 2.0, calcium: 20, iron: 1.0},
    nutrients: [],
  },

  // ── Rice dishes ───────────────────────────────────────────────────────────
  {
    name: "Curd Rice", meals: ["Breakfast", "Dinner"], category: "Rice", weight: "Light",
    nutrition: { cal: 280, protein: 7.0, carbs: 50, fat: 5.0, fiber: 1.0, calcium: 120, iron: 0.5},
    nutrients: ["Calcium"],
  },
  {
    name: "Lemon Rice", meals: ["Breakfast", "Dinner"], category: "Rice", weight: "Light",
    nutrition: { cal: 320, protein: 5.0, carbs: 58, fat: 8.0, fiber: 2.0, calcium: 15, iron: 1.5},
    nutrients: [],
  },
  {
    name: "Tamarind Rice", meals: ["Breakfast", "Dinner"], category: "Rice", weight: "Light",
    nutrition: { cal: 350, protein: 5.0, carbs: 60, fat: 10.0, fiber: 3.0, calcium: 20, iron: 2.5},
    nutrients: ["Fiber"],
  },
  {
    name: "Tomato Rice", meals: ["Breakfast", "Dinner"], category: "Rice", weight: "Light",
    nutrition: { cal: 300, protein: 5.5, carbs: 55, fat: 7.0, fiber: 2.5, calcium: 25, iron: 1.5},
    nutrients: [],
  },
  {
    name: "Coconut Rice", meals: ["Breakfast", "Dinner"], category: "Rice", weight: "Light",
    nutrition: { cal: 380, protein: 5.0, carbs: 56, fat: 14.0, fiber: 2.0, calcium: 15, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Sambar Rice", meals: ["Dinner"], category: "Rice", weight: "Light",
    nutrition: { cal: 290, protein: 8.0, carbs: 52, fat: 5.0, fiber: 3.0, calcium: 30, iron: 1.5},
    nutrients: ["Protein", "Fiber"],
  },
  {
    name: "Rasam Rice", meals: ["Dinner"], category: "Rice", weight: "Light",
    nutrition: { cal: 260, protein: 5.0, carbs: 48, fat: 5.0, fiber: 2.0, calcium: 20, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Bisibelebath", meals: ["Dinner"], category: "Rice", weight: "Heavy",
    nutrition: { cal: 370, protein: 10.0, carbs: 58, fat: 10.0, fiber: 4.0, calcium: 40, iron: 2.5},
    nutrients: ["Protein", "Fiber"],
  },
  {
    name: "Veg Fried Rice", meals: ["Dinner"], category: "Rice", weight: "Heavy",
    nutrition: { cal: 310, protein: 6.0, carbs: 56, fat: 8.0, fiber: 3.0, calcium: 25, iron: 1.5},
    nutrients: [],
  },
  {
    name: "Egg Fried Rice", meals: ["Dinner"], category: "Rice", weight: "Heavy", egg: true,
    nutrition: { cal: 350, protein: 12.0, carbs: 52, fat: 10.0, fiber: 2.0, calcium: 35, iron: 2.0},
    nutrients: ["Protein"],
  },
  {
    name: "Dal Rice", meals: ["Dinner"], category: "Rice", weight: "Light",
    nutrition: { cal: 300, protein: 10.0, carbs: 50, fat: 5.0, fiber: 4.0, calcium: 35, iron: 2.5},
    nutrients: ["Protein", "Fiber"],
  },
  {
    name: "Pudina Rice", meals: ["Breakfast", "Dinner"], category: "Rice", weight: "Light",
    nutrition: { cal: 290, protein: 5.5, carbs: 52, fat: 8.0, fiber: 2.0, calcium: 20, iron: 1.5},
    nutrients: [],
  },
  {
    name: "Coriander Rice", meals: ["Breakfast", "Dinner"], category: "Rice", weight: "Light",
    nutrition: { cal: 285, protein: 5.5, carbs: 52, fat: 7.5, fiber: 2.0, calcium: 25, iron: 1.5},
    nutrients: [],
  },
  {
    name: "Veg Pulao", meals: ["Dinner"], category: "Rice", weight: "Light",
    nutrition: { cal: 320, protein: 6.0, carbs: 58, fat: 8.0, fiber: 3.0, calcium: 30, iron: 1.5},
    nutrients: [],
  },
  {
    name: "Methi Rice", meals: ["Dinner"], category: "Rice", weight: "Light",
    nutrition: { cal: 295, protein: 7.0, carbs: 52, fat: 7.5, fiber: 3.5, calcium: 30, iron: 3.0},
    nutrients: ["Fiber"],
  },

  // ── Noodles ───────────────────────────────────────────────────────────────
  {
    name: "Masala Noodles", meals: ["Breakfast", "Dinner"], category: "Noodles", weight: "Heavy",
    nutrition: { cal: 300, protein: 8.0, carbs: 50, fat: 8.0, fiber: 3.0, calcium: 20, iron: 2.0},
    nutrients: [],
  },
  {
    name: "Veg Hakka Noodles", meals: ["Dinner"], category: "Noodles", weight: "Heavy",
    nutrition: { cal: 280, protein: 7.0, carbs: 48, fat: 7.0, fiber: 3.0, calcium: 25, iron: 1.5},
    nutrients: [],
  },
  {
    name: "Egg Noodles", meals: ["Dinner"], category: "Noodles", weight: "Heavy", egg: true,
    nutrition: { cal: 350, protein: 13.0, carbs: 48, fat: 12.0, fiber: 2.0, calcium: 35, iron: 2.5},
    nutrients: ["Protein"],
  },

  // ── Idiyappam ─────────────────────────────────────────────────────────────
  {
    name: "Rice Idiyappam", meals: ["Breakfast", "Dinner"], category: "Idiyappam", weight: "Light",
    nutrition: { cal: 180, protein: 3.5, carbs: 38, fat: 1.0, fiber: 1.0, calcium: 15, iron: 0.5},
    nutrients: [],
  },
  {
    name: "Ragi Idiyappam", meals: ["Breakfast", "Dinner"], category: "Idiyappam", weight: "Light",
    nutrition: { cal: 175, protein: 4.5, carbs: 36, fat: 1.5, fiber: 3.0, calcium: 210, iron: 2.5},
    nutrients: ["Calcium", "Fiber"],
  },
  {
    name: "Millet Idiyappam", meals: ["Breakfast", "Dinner"], category: "Idiyappam", weight: "Light",
    nutrition: { cal: 170, protein: 4.0, carbs: 35, fat: 1.0, fiber: 3.5, calcium: 25, iron: 2.5},
    nutrients: ["Fiber"],
  },
  {
    name: "Wheat Idiyappam", meals: ["Breakfast", "Dinner"], category: "Idiyappam", weight: "Light",
    nutrition: { cal: 185, protein: 5.5, carbs: 37, fat: 1.5, fiber: 3.5, calcium: 20, iron: 1.5},
    nutrients: ["Fiber"],
  },
  {
    name: "Horsegram Idiyappam", meals: ["Breakfast", "Dinner"], category: "Idiyappam", weight: "Light",
    nutrition: { cal: 180, protein: 8.0, carbs: 32, fat: 1.5, fiber: 4.5, calcium: 70, iron: 3.5},
    nutrients: ["Protein", "Iron", "Fiber"],
  },

  // ── Appam ──────────────────────────────────────────────────────────────────
  {
    name: "Rice Appam", meals: ["Breakfast", "Dinner"], category: "Appam", weight: "Light",
    nutrition: { cal: 170, protein: 3.5, carbs: 34, fat: 2.5, fiber: 1.0, calcium: 15, iron: 0.5},
    nutrients: [],
  },
  {
    name: "Wheat Appam", meals: ["Breakfast", "Dinner"], category: "Appam", weight: "Light",
    nutrition: { cal: 180, protein: 5.5, carbs: 34, fat: 3.0, fiber: 2.5, calcium: 20, iron: 1.5},
    nutrients: [],
  },
  {
    name: "Ragi Appam", meals: ["Breakfast", "Dinner"], category: "Appam", weight: "Light",
    nutrition: { cal: 175, protein: 5.0, carbs: 33, fat: 2.5, fiber: 3.5, calcium: 220, iron: 2.5},
    nutrients: ["Calcium", "Fiber"],
  },
  {
    name: "Oats Appam", meals: ["Breakfast", "Dinner"], category: "Appam", weight: "Light",
    nutrition: { cal: 165, protein: 5.5, carbs: 30, fat: 3.0, fiber: 4.0, calcium: 25, iron: 2.0},
    nutrients: ["Fiber"],
  },

  // ── Pasta ──────────────────────────────────────────────────────────────────
  {
    name: "Wheat Pasta", meals: ["Breakfast", "Dinner"], category: "Pasta", weight: "Heavy",
    nutrition: { cal: 280, protein: 8.0, carbs: 50, fat: 6.0, fiber: 3.0, calcium: 25, iron: 2.0},
    nutrients: [],
  },
  {
    name: "Ragi Pasta", meals: ["Breakfast", "Dinner"], category: "Pasta", weight: "Heavy",
    nutrition: { cal: 270, protein: 7.5, carbs: 48, fat: 6.0, fiber: 4.5, calcium: 200, iron: 2.5},
    nutrients: ["Calcium", "Fiber"],
  },
  {
    name: "Millet Pasta", meals: ["Breakfast", "Dinner"], category: "Pasta", weight: "Heavy",
    nutrition: { cal: 265, protein: 7.5, carbs: 46, fat: 6.0, fiber: 4.0, calcium: 30, iron: 3.0},
    nutrients: ["Fiber"],
  },
  {
    name: "Oats Pasta", meals: ["Breakfast", "Dinner"], category: "Pasta", weight: "Heavy",
    nutrition: { cal: 255, protein: 8.0, carbs: 42, fat: 6.0, fiber: 5.0, calcium: 25, iron: 2.5},
    nutrients: ["Fiber"],
  },
  {
    name: "Vermicelli Pasta", meals: ["Breakfast", "Dinner"], category: "Pasta", weight: "Heavy",
    nutrition: { cal: 270, protein: 7.0, carbs: 48, fat: 6.5, fiber: 2.5, calcium: 20, iron: 1.0},
    nutrients: [],
  },
  {
    name: "Spinach Pasta", meals: ["Dinner"], category: "Pasta", weight: "Heavy",
    nutrition: { cal: 260, protein: 8.0, carbs: 44, fat: 6.0, fiber: 4.0, calcium: 60, iron: 3.5},
    nutrients: ["Iron"],
  },
  {
    name: "Egg Pasta", meals: ["Dinner"], category: "Pasta", weight: "Heavy", egg: true,
    nutrition: { cal: 320, protein: 13.0, carbs: 46, fat: 10.0, fiber: 2.5, calcium: 40, iron: 2.5},
    nutrients: ["Protein"],
  },

  // ── Kothu ──────────────────────────────────────────────────────────────────
  {
    name: "Kothu Chapati", meals: ["Breakfast", "Dinner"], category: "Kothu", weight: "Heavy",
    nutrition: { cal: 290, protein: 8.5, carbs: 44, fat: 9.0, fiber: 4.0, calcium: 30, iron: 2.5},
    nutrients: ["Fiber"],
  },
  {
    name: "Egg Kothu Chapati", meals: ["Breakfast", "Dinner"], category: "Kothu", weight: "Heavy", egg: true,
    nutrition: { cal: 345, protein: 14.0, carbs: 44, fat: 12.0, fiber: 4.0, calcium: 50, iron: 3.0},
    nutrients: ["Protein", "Fiber"],
  },
  {
    name: "Veg Kothu Roti", meals: ["Breakfast", "Dinner"], category: "Kothu", weight: "Heavy",
    nutrition: { cal: 280, protein: 8.0, carbs: 44, fat: 8.0, fiber: 4.5, calcium: 35, iron: 2.5},
    nutrients: ["Fiber"],
  },
  {
    name: "Ragi Kothu", meals: ["Breakfast", "Dinner"], category: "Kothu", weight: "Heavy",
    nutrition: { cal: 300, protein: 8.5, carbs: 46, fat: 9.0, fiber: 5.5, calcium: 230, iron: 3.5},
    nutrients: ["Calcium", "Iron", "Fiber"],
  },

  // ── Paratha ────────────────────────────────────────────────────────────────
  {
    name: "Aloo Paratha", meals: ["Breakfast", "Dinner"], category: "Paratha", weight: "Heavy",
    nutrition: { cal: 310, protein: 7.0, carbs: 50, fat: 10.0, fiber: 3.5, calcium: 25, iron: 2.0},
    nutrients: [],
  },
  {
    name: "Methi Paratha", meals: ["Breakfast", "Dinner"], category: "Paratha", weight: "Light",
    nutrition: { cal: 270, protein: 8.0, carbs: 42, fat: 8.0, fiber: 5.0, calcium: 90, iron: 3.5},
    nutrients: ["Iron", "Fiber"],
  },
  {
    name: "Gobi Paratha", meals: ["Breakfast", "Dinner"], category: "Paratha", weight: "Heavy",
    nutrition: { cal: 290, protein: 7.5, carbs: 46, fat: 9.0, fiber: 4.0, calcium: 50, iron: 2.0},
    nutrients: [],
  },
  {
    name: "Palak Paratha", meals: ["Breakfast", "Dinner"], category: "Paratha", weight: "Light",
    nutrition: { cal: 265, protein: 7.5, carbs: 42, fat: 7.5, fiber: 4.5, calcium: 80, iron: 3.5},
    nutrients: ["Iron", "Fiber"],
  },
  {
    name: "Ragi Paratha", meals: ["Breakfast", "Dinner"], category: "Paratha", weight: "Light",
    nutrition: { cal: 280, protein: 8.0, carbs: 43, fat: 8.5, fiber: 6.0, calcium: 240, iron: 3.5},
    nutrients: ["Calcium", "Iron", "Fiber"],
  },

  // ── Bread ─────────────────────────────────────────────────────────────────
  {
    name: "Bread Upma", meals: ["Breakfast"], category: "Bread", weight: "Light",
    nutrition: { cal: 260, protein: 8.0, carbs: 40, fat: 8.0, fiber: 2.0, calcium: 40, iron: 2.0},
    nutrients: [],
  },
  {
    name: "Bread Poha", meals: ["Breakfast"], category: "Bread", weight: "Light",
    nutrition: { cal: 240, protein: 7.0, carbs: 42, fat: 5.0, fiber: 2.0, calcium: 35, iron: 1.5},
    nutrients: [],
  },
  {
    name: "French Toast", meals: ["Breakfast"], category: "Bread", weight: "Heavy", egg: true,
    nutrition: { cal: 250, protein: 10.0, carbs: 30, fat: 9.0, fiber: 1.0, calcium: 80, iron: 2.0},
    nutrients: ["Protein"],
  },
  {
    name: "Egg Sandwich", meals: ["Breakfast"], category: "Bread", weight: "Heavy", egg: true,
    nutrition: { cal: 290, protein: 14.0, carbs: 32, fat: 12.0, fiber: 2.0, calcium: 70, iron: 2.5},
    nutrients: ["Protein"],
  },
];

// ─── GROCERY: BASE INGREDIENTS PER CATEGORY ──────────────────────────────────
const CATEGORY_BASE_INGREDIENTS = {
  "Idli":      ["Rice (for batter)", "Urad dal", "Fenugreek seeds"],
  "Dosa":      ["Rice (for batter)", "Urad dal"],
  "Uttapam":   ["Rice (for batter)", "Urad dal", "Onion", "Tomato"],
  "Pongal":    ["Rice", "Moong dal", "Ghee", "Pepper", "Cumin"],
  "Upma":      ["Rava (semolina)", "Onion", "Oil", "Mustard seeds"],
  "Semiya":    ["Vermicelli", "Onion", "Oil"],
  "Chapati":   ["Whole wheat flour", "Oil"],
  "Puttu":     ["Puttu podi (rice flour)", "Coconut (grated)"],
  "Poori":     ["Whole wheat flour", "Oil (for frying)"],
  "Paniyaram":   ["Idli batter", "Sesame oil"],
  "Kozhukattai": ["Rice flour", "Coconut (grated)", "Salt"],
  "Naan":        ["Maida", "Baking powder", "Yoghurt", "Butter"],
  "Rice":        ["Cooked rice", "Salt", "Oil"],
  "Noodles":    ["Noodles", "Oil", "Onion", "Mixed vegetables", "Soy sauce"],
  "Bread":      ["Bread slices", "Oil / Butter"],
  "Idiyappam":  ["Rice flour (fine)", "Water", "Salt"],
  "Appam":      ["Raw rice (soaked)", "Coconut milk", "Yeast / Baking soda"],
  "Pasta":      ["Pasta", "Oil", "Onion", "Tomato", "Mixed vegetables", "Spices"],
  "Kothu":      ["Chapati / Roti", "Onion", "Tomato", "Oil", "Spices"],
  "Paratha":    ["Whole wheat flour", "Oil", "Salt"],
  "Other":      [],
};

// ─── GROCERY: DISH-SPECIFIC EXTRA INGREDIENTS ────────────────────────────────
const DISH_EXTRAS = {
  // Ragi
  "Ragi Idli":              ["Ragi flour"],
  "Ragi Dosa":              ["Ragi flour"],
  "Ragi Chapati":           ["Ragi flour"],
  "Ragi Upma":              ["Ragi flour"],
  "Ragi Pongal":            ["Ragi flour"],
  "Ragi Semiya":            ["Ragi vermicelli"],
  "Ragi Puttu":             ["Ragi flour"],
  // Millet
  "Millet Dosa":            ["Millet"],
  "Millet Chapati":         ["Millet flour"],
  "Millet Upma":            ["Millet"],
  "Millet Pongal":          ["Millet"],
  "Millet Semiya":          ["Millet vermicelli"],
  "Millet Puttu":           ["Millet flour"],
  // Varagu (Kodo millet)
  "Varagu Chapati":         ["Varagu (Kodo millet)"],
  "Varagu Pongal":          ["Varagu (Kodo millet)"],
  "Varagu Upma":            ["Varagu (Kodo millet)"],
  "Varagu Semiya":          ["Varagu vermicelli"],
  "Varagu Puttu":           ["Varagu flour"],
  // Horsegram
  "Horsegram Idli":         ["Horsegram (Kollu)"],
  "Horsegram Pongal":       ["Horsegram (Kollu)"],
  "Horsegram Upma":         ["Horsegram (Kollu)"],
  "Horsegram Semiya":       ["Horsegram"],
  "Horsegram Puttu":        ["Horsegram flour"],
  "Horsegram Chapati":      ["Horsegram flour"],
  // Oats
  "Oats Idli":              ["Oats"],
  "Oats Dosa":              ["Oats"],
  "Masala Oats Dosa":       ["Oats", "Potato", "Spices"],
  // Special dosas
  "Masala Dosa":            ["Potato", "Onion"],
  "Mysore Masala Dosa":     ["Potato", "Onion", "Red chilli paste"],
  "Cheese Dosa":            ["Processed cheese"],
  "Egg Dosa":               ["Eggs"],
  "Adai Dosa":              ["Chana dal", "Toor dal", "Red chilli"],
  "Moon Dal Dosa":          ["Moong dal"],
  "Chana Dosa":             ["Chana dal"],
  "Oats Green Gram Dosa":   ["Oats", "Green gram (Moong)"],
  "Jowar Dosa":             ["Jowar flour (Sorghum)"],
  "Atta Dosa":              ["Wheat flour (Atta)"],
  "Neer Dosa":              ["Raw rice (soaked & ground)"],
  "Podi Dosa":              ["Idli podi (gun powder)"],
  // Special idlis
  "Kanchipuram Idli":       ["Pepper", "Cumin", "Ghee"],
  "Podi Idli":              ["Idli podi (gun powder)"],
  "Mongdaal Idli":          ["Moong dal"],
  "Drumstick Leaves Idli":  ["Drumstick leaves (Murungai keerai)"],
  // Wheat variants
  "Wheat Upma":             ["Broken wheat (Dalia)"],
  "Wheat Pongal":           ["Broken wheat (Dalia)"],
  "Wheat Puttu":            ["Wheat flour"],
  "Wheat Semiya":           ["Wheat vermicelli"],
  // Others
  "Poha":                   ["Poha (flattened rice)"],
  "Pancake":                ["Maida / Wheat flour", "Milk"],
  "Bread Omelette":         ["Eggs", "Bread", "Butter"],
  "Chola Poori":            ["Kabuli chana (chickpeas)"],
  "Plain Poori":            ["Whole wheat flour", "Oil (for frying)"],
  // Varagu & Thinai
  "Varagu Idli":            ["Varagu (Kodo millet)"],
  "Varagu Dosa":            ["Varagu (Kodo millet)"],
  "Thinai Idli":            ["Thinai (Foxtail millet)"],
  "Thinai Dosa":            ["Thinai (Foxtail millet)"],
  "Thinai Pongal":          ["Thinai (Foxtail millet)"],
  // New dosas
  "Pesarattu":              ["Green moong dal", "Ginger", "Green chilli"],
  "Tomato Dosa":            ["Tomato", "Red chilli"],
  "Palak Dosa":             ["Spinach (Palak)"],
  // New uttapams
  "Tomato Uttapam":         ["Tomato", "Onion"],
  "Mixed Veg Uttapam":      ["Carrot", "Onion", "Capsicum", "Peas"],
  "Cheese Uttapam":         ["Processed cheese", "Onion"],
  // New pongal
  "Sweet Pongal":           ["Jaggery", "Ghee", "Cardamom", "Cashews", "Raisins"],
  // New upma
  "Oats Upma":              ["Oats"],
  "Sabudana Upma":          ["Sabudana (Tapioca pearls)", "Peanuts", "Green chilli"],
  // New paniyaram
  "Masala Paniyaram":       ["Idli batter", "Onion", "Green chilli"],
  "Sweet Paniyaram":        ["Idli batter", "Jaggery", "Cardamom"],
  // Kozhukattai
  "Masala Kozhukattai":     ["Rice flour", "Coconut (grated)", "Urad dal", "Mustard seeds"],
  // Rice dishes
  "Curd Rice":              ["Curd / Yoghurt", "Mustard seeds", "Curry leaves", "Green chilli"],
  "Lemon Rice":             ["Lemon", "Peanuts", "Turmeric", "Mustard seeds"],
  "Tamarind Rice":          ["Tamarind", "Peanuts", "Sesame seeds", "Sambar powder"],
  "Tomato Rice":            ["Tomato", "Onion", "Spices"],
  "Coconut Rice":           ["Coconut (grated)", "Cashews", "Mustard seeds"],
  "Sambar Rice":            ["Toor dal", "Tamarind", "Sambar powder", "Vegetables of choice"],
  "Rasam Rice":             ["Toor dal", "Tamarind", "Pepper", "Cumin"],
  "Bisibelebath":           ["Toor dal", "Bisibelebath powder", "Ghee", "Cashews", "Vegetables of choice"],
  "Veg Fried Rice":         ["Mixed vegetables", "Spring onion", "Soy sauce"],
  "Egg Fried Rice":         ["Eggs", "Spring onion", "Soy sauce"],
  // Noodles
  "Masala Noodles":         ["Noodles", "Onion", "Tomato", "Mixed vegetables"],
  "Veg Hakka Noodles":      ["Noodles", "Capsicum", "Carrot", "Cabbage", "Soy sauce"],
  "Egg Noodles":            ["Noodles", "Eggs", "Spring onion", "Soy sauce"],
  // Bread
  "Bread Upma":             ["Bread slices", "Onion", "Green chilli", "Mustard seeds"],
  "Bread Poha":             ["Bread slices", "Onion", "Peanuts", "Turmeric"],
  "French Toast":           ["Bread slices", "Eggs", "Milk", "Butter"],
  "Egg Sandwich":           ["Bread slices", "Eggs", "Onion", "Green chilli"],
  // Idiyappam
  "Rice Idiyappam":         ["Rice flour (fine)", "Water"],
  "Ragi Idiyappam":         ["Ragi flour"],
  "Millet Idiyappam":       ["Millet flour"],
  "Wheat Idiyappam":        ["Wheat flour"],
  "Horsegram Idiyappam":    ["Horsegram flour"],
  // Appam
  "Rice Appam":             ["Raw rice (soaked)", "Coconut milk", "Yeast / Baking soda"],
  "Wheat Appam":            ["Wheat flour", "Coconut milk"],
  "Ragi Appam":             ["Ragi flour", "Coconut milk"],
  "Oats Appam":             ["Oats", "Coconut milk"],
  // Pasta
  "Wheat Pasta":            ["Wheat pasta", "Onion", "Capsicum", "Tomato"],
  "Ragi Pasta":             ["Ragi pasta", "Onion", "Capsicum", "Tomato"],
  "Millet Pasta":           ["Millet pasta", "Onion", "Capsicum", "Tomato"],
  "Oats Pasta":             ["Oat flour pasta / Oat flakes", "Mixed vegetables"],
  "Vermicelli Pasta":       ["Vermicelli", "Onion", "Capsicum", "Tomato"],
  "Spinach Pasta":          ["Pasta", "Spinach (Palak)", "Onion", "Garlic"],
  "Egg Pasta":              ["Pasta", "Eggs", "Onion", "Capsicum"],
  // Kothu
  "Kothu Chapati":          ["Leftover chapati", "Onion", "Tomato", "Ginger-garlic paste"],
  "Egg Kothu Chapati":      ["Leftover chapati", "Eggs", "Onion", "Tomato"],
  "Veg Kothu Roti":         ["Leftover roti", "Mixed vegetables", "Onion", "Tomato"],
  "Ragi Kothu":             ["Ragi chapati", "Onion", "Tomato", "Spices"],
  // Paratha
  "Aloo Paratha":           ["Potato", "Onion", "Coriander leaves"],
  "Methi Paratha":          ["Fenugreek leaves (Methi)", "Whole wheat flour"],
  "Gobi Paratha":           ["Cauliflower (Gobi)", "Whole wheat flour"],
  "Palak Paratha":          ["Spinach (Palak)", "Whole wheat flour"],
  "Ragi Paratha":           ["Ragi flour", "Whole wheat flour"],
  // More rice
  "Dal Rice":               ["Toor dal / Moong dal", "Ghee", "Cumin"],
  "Pudina Rice":            ["Mint leaves (Pudina)", "Green chilli", "Ginger"],
  "Coriander Rice":         ["Coriander leaves (fresh)", "Green chilli", "Coconut"],
  "Veg Pulao":              ["Basmati rice", "Mixed vegetables", "Whole spices", "Ghee"],
  "Methi Rice":             ["Fenugreek leaves (Methi)", "Onion", "Spices"],
  // Kambu
  "Kambu Upma":             ["Kambu (Pearl millet)", "Onion", "Oil"],
};

// ─── GROCERY: GENERIC SOUTH INDIAN PANTRY STAPLES ────────────────────────────
const GENERIC_GROCERIES = [
  // Grains & Flours
  "Rice", "Idli rice", "Parboiled rice (Puzhungal arisi)", "Rava (semolina)", "Poha (flattened rice)",
  "Whole wheat flour (Atta)", "Maida", "Ragi flour", "Jowar flour (Sorghum)", "Oats",
  "Broken wheat (Dalia)", "Vermicelli", "Rice flour", "Puttu podi",
  "Kambu (Pearl millet)", "Wheat pasta", "Ragi pasta", "Millet pasta",
  // Dals & Legumes
  "Toor dal", "Moong dal (split yellow)", "Moong dal (whole green)", "Urad dal", "Chana dal",
  "Masoor dal", "Rajma (kidney beans)", "Kabuli chana (chickpeas)", "Horsegram (Kollu)",
  // Spices & Masalas
  "Salt", "Turmeric powder", "Red chilli powder", "Coriander powder", "Garam masala",
  "Sambar powder", "Pepper", "Mustard seeds", "Cumin (Jeera)", "Fenugreek seeds (Methi)",
  "Asafoetida (Hing)", "Bay leaves", "Cinnamon sticks", "Cloves", "Cardamom",
  "Idli podi (gun powder)",
  // Condiments & Wet Groceries
  "Tamarind", "Jaggery", "Coconut milk (can)", "Tomato puree",
  // Fresh Produce
  "Onion", "Tomato", "Ginger", "Garlic", "Green chilli",
  "Coconut (grated)", "Coriander leaves", "Curry leaves",
  "Drumstick (Murungakkai)", "Brinjal", "Carrot", "Beans", "Potato",
  "Lady finger (Okra)", "Peas", "Spinach", "Drumstick leaves (Murungai keerai)",
  // Oils & Fats
  "Coconut oil", "Sunflower oil", "Sesame oil (Gingelly)", "Ghee", "Butter",
  // Dairy & Eggs
  "Milk", "Curd / Yoghurt", "Paneer", "Cheese", "Eggs",
  // Nuts & Seeds
  "Groundnuts (Peanuts)", "Sesame seeds", "Cashews", "Dried coconut",
];

// ─── GROCERY: INGREDIENTS PER SIDE TYPE ─────────────────────────────────────
const SIDE_TYPE_INGREDIENTS = {
  "Chutney":     ["Coconut / Vegetable (as per variety)", "Green chilli", "Ginger", "Mustard seeds"],
  "Sambar":      ["Toor dal", "Tamarind", "Sambar powder", "Vegetables of choice"],
  "Podi":        ["Lentils (Urad / Chana)", "Sesame seeds", "Dry red chilli"],
  "SalnaCurry":  ["Tomato", "Onion", "Salna masala / Kuruma powder"],
  "KeralaKurry": ["Coconut milk", "Vegetables / Chickpeas", "Coconut oil"],
  "EggCurry":    ["Eggs", "Tomato", "Onion", "Spices"],
  "VadaCurry":   ["Chana dal (for vada)", "Onion", "Spices"],
  "Papad":       ["Papad / Appalam (ready-made)"],
};


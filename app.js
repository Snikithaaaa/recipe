/* =========================
   RECIPE DATA
========================= */

const recipes = [
  { id:1, title:"Garlic Butter Pasta", time:20, difficulty:"easy", description:"Simple garlic butter pasta.", category:"pasta" },
  { id:2, title:"Veg Fried Rice", time:30, difficulty:"easy", description:"Quick vegetable fried rice.", category:"rice" },
  { id:3, title:"Paneer Butter Masala", time:45, difficulty:"medium", description:"Rich paneer curry.", category:"curry" },
  { id:4, title:"Chicken Biryani", time:90, difficulty:"hard", description:"Classic layered biryani.", category:"rice" },
  { id:5, title:"Caesar Salad", time:15, difficulty:"easy", description:"Fresh salad with dressing.", category:"salad" },
  { id:6, title:"Margherita Pizza", time:60, difficulty:"medium", description:"Classic Italian pizza.", category:"pizza" },
  { id:7, title:"Beef Wellington", time:120, difficulty:"hard", description:"Pastry wrapped beef.", category:"meat" },
  { id:8, title:"Thai Green Curry", time:50, difficulty:"medium", description:"Spicy coconut curry.", category:"curry" }
];

/* =========================
   DOM
========================= */

const recipeContainer = document.querySelector("#recipe-container");

/* =========================
   STATE
========================= */

let currentFilter = "all";
let currentSort = "none";

/* =========================
   CREATE CARD
========================= */

const createRecipeCard = (recipe) => `
  <div class="recipe-card" data-id="${recipe.id}">
    <h3>${recipe.title}</h3>

    <div class="recipe-meta">
      <span>⏱️ ${recipe.time} min</span>
      <span class="difficulty ${recipe.difficulty}">
        ${recipe.difficulty}
      </span>
    </div>

    <p>${recipe.description}</p>
  </div>
`;

/* =========================
   RENDER
========================= */

const renderRecipes = (recipeArray) => {
  recipeContainer.innerHTML = recipeArray
    .map(createRecipeCard)
    .join("");
};

/* =========================
   FILTER (PURE)
========================= */

const filterRecipes = (recipeArray, filterType) => {

  if (filterType === "easy") return recipeArray.filter(r => r.difficulty === "easy");
  if (filterType === "medium") return recipeArray.filter(r => r.difficulty === "medium");
  if (filterType === "hard") return recipeArray.filter(r => r.difficulty === "hard");
  if (filterType === "quick") return recipeArray.filter(r => r.time < 30);

  return recipeArray;
};

/* =========================
   SORT (PURE)
========================= */

const sortRecipes = (recipeArray, sortType) => {

  const sorted = [...recipeArray]; // avoid mutation

  if (sortType === "name") {
    return sorted.sort((a,b) => a.title.localeCompare(b.title));
  }

  if (sortType === "time") {
    return sorted.sort((a,b) => a.time - b.time);
  }

  return recipeArray;
};

/* =========================
   UPDATE DISPLAY
========================= */

const updateDisplay = () => {

  let result = filterRecipes(recipes, currentFilter);
  result = sortRecipes(result, currentSort);

  renderRecipes(result);
};

/* =========================
   BUTTON EVENTS
========================= */

document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    updateDisplay();
  });
});

document.querySelectorAll("[data-sort]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentSort = btn.dataset.sort;
    updateDisplay();
  });
});

/* =========================
   INIT
========================= */

updateDisplay();
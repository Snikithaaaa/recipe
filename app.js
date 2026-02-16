const RecipeApp = (() => {

  let currentFilter = "all";
  let currentSort = "none";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];
  let debounceTimer;

  const recipeContainer = document.querySelector("#recipe-container");
  const searchInput = document.querySelector("#search-input");
  const clearSearchBtn = document.querySelector("#clear-search");
  const recipeCounter = document.querySelector("#recipe-counter");

  const recipes = [ /* Use your full 8 recipes from Part 3 */ ];

  const saveFavorites = () =>
    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));

  const isFavorite = id => favorites.includes(id);

  const toggleFavorite = id => {
    favorites = isFavorite(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];

    saveFavorites();
    updateDisplay();
  };

  const applySearch = (arr, query) => {
    if (!query) return arr;
    const q = query.toLowerCase().trim();

    return arr.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.toLowerCase().includes(q))
    );
  };

  const applyFilter = (arr, type) => {
    if (type === "favorites")
      return arr.filter(r => favorites.includes(r.id));
    if (type === "easy")
      return arr.filter(r => r.difficulty === "easy");
    if (type === "medium")
      return arr.filter(r => r.difficulty === "medium");
    if (type === "hard")
      return arr.filter(r => r.difficulty === "hard");
    if (type === "quick")
      return arr.filter(r => r.time < 30);
    return arr;
  };

  const applySort = (arr, type) => {
    const sorted = [...arr];
    if (type === "name")
      return sorted.sort((a,b)=>a.title.localeCompare(b.title));
    if (type === "time")
      return sorted.sort((a,b)=>a.time-b.time);
    return arr;
  };

  const renderSteps = (steps, level=0) => {
    let html="<ol>";
    steps.forEach(step=>{
      if(typeof step==="string"){
        html+=`<li class="step level-${level}">${step}</li>`;
      } else {
        html+=`
          <li class="step level-${level}">
            ${step.text}
            ${renderSteps(step.substeps, level+1)}
          </li>
        `;
      }
    });
    html+="</ol>";
    return html;
  };

  const createRecipeCard = recipe => `
    <div class="recipe-card">

      <button class="favorite-btn ${isFavorite(recipe.id)?"active":""}"
        data-id="${recipe.id}">❤</button>

      <h3>${recipe.title}</h3>

      <div class="recipe-meta">
        <span>⏱️ ${recipe.time} min</span>
        <span class="difficulty ${recipe.difficulty}">
          ${recipe.difficulty}
        </span>
      </div>

      <p>${recipe.description}</p>

      <button class="toggle-btn"
        data-id="${recipe.id}"
        data-type="ingredients">Show Ingredients</button>

      <div class="ingredients-container"
        data-id="${recipe.id}">
        <ul>
          ${recipe.ingredients.map(i=>`<li>${i}</li>`).join("")}
        </ul>
      </div>

      <button class="toggle-btn"
        data-id="${recipe.id}"
        data-type="steps">Show Steps</button>

      <div class="steps-container"
        data-id="${recipe.id}">
        ${renderSteps(recipe.steps)}
      </div>
    </div>
  `;

  const updateCounter = count =>
    recipeCounter.textContent =
      `Showing ${count} of ${recipes.length} recipes`;

  const updateDisplay = () => {
    let result = applySearch(recipes, searchQuery);
    result = applyFilter(result, currentFilter);
    result = applySort(result, currentSort);

    updateCounter(result.length);
    recipeContainer.innerHTML = result.map(createRecipeCard).join("");
  };

  const handleSearch = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(()=>{
      searchQuery = searchInput.value;
      clearSearchBtn.style.display = searchQuery?"block":"none";
      updateDisplay();
    },300);
  };

  const clearSearch = () => {
    searchInput.value="";
    searchQuery="";
    clearSearchBtn.style.display="none";
    updateDisplay();
  };

  const handleClick = e => {

    const favBtn = e.target.closest(".favorite-btn");
    if(favBtn){
      toggleFavorite(Number(favBtn.dataset.id));
      return;
    }

    const toggleBtn = e.target.closest(".toggle-btn");
    if(!toggleBtn) return;

    const id = toggleBtn.dataset.id;
    const type = toggleBtn.dataset.type;

    const target = document.querySelector(
      `.${type}-container[data-id="${id}"]`
    );

    target.classList.toggle("visible");

    toggleBtn.textContent =
      target.classList.contains("visible")
        ? `Hide ${type}`
        : `Show ${type}`;
  };

  const init = () => {

    recipeContainer.addEventListener("click", handleClick);
    searchInput.addEventListener("input", handleSearch);
    clearSearchBtn.addEventListener("click", clearSearch);

    document.querySelectorAll("[data-filter]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        currentFilter=btn.dataset.filter;
        updateDisplay();
      });
    });

    document.querySelectorAll("[data-sort]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        currentSort=btn.dataset.sort;
        updateDisplay();
      });
    });

    updateDisplay();
  };

  return { init };

})();

document.addEventListener("DOMContentLoaded", RecipeApp.init);

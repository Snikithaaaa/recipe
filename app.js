(() => {
  "use strict";

  /* ================================
     DATA
  ================================== */

  const recipes = [
    {
      id: 1,
      name: "Spaghetti Bolognese",
      difficulty: "easy",
      time: 25,
      description: "Classic Italian pasta with rich meat sauce.",
      ingredients: ["spaghetti", "ground beef", "tomato sauce", "onion", "garlic"],
      steps: [
        "Boil pasta according to package instructions.",
        "Cook beef with onion and garlic.",
        "Add tomato sauce and simmer 10 minutes.",
        "Combine pasta with sauce."
      ]
    },
    {
      id: 2,
      name: "Chicken Curry",
      difficulty: "medium",
      time: 40,
      description: "Spicy and creamy Indian-style curry.",
      ingredients: ["chicken", "curry paste", "coconut milk", "onion", "rice"],
      steps: [
        "Sauté onion.",
        "Add chicken and cook until browned.",
        "Stir in curry paste.",
        "Add coconut milk and simmer 20 minutes."
      ]
    },
    {
      id: 3,
      name: "Beef Wellington",
      difficulty: "hard",
      time: 90,
      description: "Elegant beef wrapped in puff pastry.",
      ingredients: ["beef fillet", "mushrooms", "puff pastry", "mustard"],
      steps: [
        "Sear beef.",
        "Prepare mushroom duxelles.",
        "Wrap beef in pastry.",
        "Bake until golden."
      ]
    },
    {
      id: 4,
      name: "Avocado Toast",
      difficulty: "easy",
      time: 10,
      description: "Quick and healthy breakfast option.",
      ingredients: ["bread", "avocado", "salt", "pepper", "lemon"],
      steps: [
        "Toast bread.",
        "Mash avocado.",
        "Spread and season."
      ]
    },
      {
  id: 5,
  name: "Pancakes",
  difficulty: "easy",
  time: 20,
  description: "Fluffy homemade breakfast pancakes.",
  ingredients: ["flour", "milk", "egg", "sugar", "baking powder"],
  steps: [
    "Mix dry ingredients together.",
    "Whisk in milk and egg.",
    "Pour batter onto hot pan.",
    "Flip when bubbles form and cook until golden."
  ]
},
{
  id: 6,
  name: "Vegetable Stir Fry",
  difficulty: "medium",
  time: 25,
  description: "Colorful vegetables sautéed in savory sauce.",
  ingredients: ["broccoli", "carrot", "bell pepper", "soy sauce", "garlic"],
  steps: [
    "Chop all vegetables.",
    "Heat oil in pan.",
    "Add garlic and sauté briefly.",
    "Add vegetables and stir fry 5-7 minutes.",
    "Add soy sauce and cook 2 more minutes."
  ]
},
{
  id: 7,
  name: "Chocolate Lava Cake",
  difficulty: "hard",
  time: 35,
  description: "Rich chocolate cake with a molten center.",
  ingredients: ["dark chocolate", "butter", "sugar", "eggs", "flour"],
  steps: [
    "Melt chocolate and butter together.",
    "Whisk eggs and sugar.",
    "Combine mixtures and fold in flour.",
    "Pour into ramekins.",
    "Bake until edges are firm but center is soft."
  ]


    }
  ];

  /* ================================
     STATE
  ================================== */

  let currentFilter = "all";
  let currentSort = "name";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];
  let debounceTimer;

  /* ================================
     DOM REFERENCES
  ================================== */

  const recipeContainer = document.getElementById("recipe-container");
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search");
  const counterDisplay = document.getElementById("recipe-counter");

  /* ================================
     FILTER FUNCTIONS
  ================================== */

  const filterByDifficulty = (recipeList, difficulty) => {
    if (difficulty === "all") return recipeList;
    if (difficulty === "quick") {
      return recipeList.filter(r => r.time <= 30);
    }
    if (difficulty === "favorites") {
      return recipeList.filter(r => favorites.includes(r.id));
    }
    return recipeList.filter(r => r.difficulty === difficulty);
  };

  const filterBySearch = (recipeList, query) => {
    if (!query) return recipeList;

    const lowerQuery = query.toLowerCase().trim();

    return recipeList.filter(recipe => {
      const titleMatch = recipe.name.toLowerCase().includes(lowerQuery);

      const ingredientMatch = recipe.ingredients.some(ingredient =>
        ingredient.toLowerCase().includes(lowerQuery)
      );

      const descriptionMatch = recipe.description
        .toLowerCase()
        .includes(lowerQuery);

      return titleMatch || ingredientMatch || descriptionMatch;
    });
  };

  /* ================================
     SORT FUNCTION
  ================================== */

  const sortRecipes = (recipeList, sortType) => {
    const sorted = [...recipeList];

    if (sortType === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortType === "time") {
      sorted.sort((a, b) => a.time - b.time);
    }

    return sorted;
  };

  /* ================================
     FAVORITES MANAGEMENT
  ================================== */

  const saveFavorites = () => {
    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
  };

  const toggleFavorite = (id) => {
    const recipeId = Number(id);

    if (favorites.includes(recipeId)) {
      favorites = favorites.filter(fav => fav !== recipeId);
    } else {
      favorites.push(recipeId);
    }

    saveFavorites();
    updateDisplay();
  };

  /* ================================
     UI HELPERS
  ================================== */

  const updateCounter = (visibleCount) => {
    counterDisplay.textContent = `Showing ${visibleCount} of ${recipes.length} recipes`;
  };

  const createRecipeCard = (recipe) => {
    const isFavorite = favorites.includes(recipe.id);

    return `
      <div class="recipe-card">
        <div class="card-header">
          <h2>${recipe.name}</h2>
          <button 
            class="favorite-btn ${isFavorite ? "active" : ""}" 
            data-recipe-id="${recipe.id}">
            ❤
          </button>
        </div>

        <p>${recipe.description}</p>
        <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
        <p><strong>Time:</strong> ${recipe.time} minutes</p>

        <button class="toggle-ingredients">Ingredients</button>
        <ul class="ingredients hidden">
          ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
        </ul>

        <button class="toggle-steps">Steps</button>
        <ol class="steps hidden">
          ${recipe.steps.map(s => `<li>${s}</li>`).join("")}
        </ol>
      </div>
    `;
  };

  const renderRecipes = (recipeList) => {
    recipeContainer.innerHTML = recipeList
      .map(recipe => createRecipeCard(recipe))
      .join("");
  };

  const updateDisplay = () => {
    let processed = [...recipes];

    processed = filterBySearch(processed, searchQuery);
    processed = filterByDifficulty(processed, currentFilter);
    processed = sortRecipes(processed, currentSort);

    updateCounter(processed.length);
    renderRecipes(processed);
  };

  /* ================================
     EVENT HANDLERS
  ================================== */

  const handleSearch = () => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value;
      updateDisplay();

      clearSearchBtn.style.display = searchQuery ? "inline" : "none";
    }, 300);
  };

  const clearSearch = () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.style.display = "none";
    updateDisplay();
  };

  const handleFilterClick = (e) => {
    if (!e.target.dataset.filter) return;
    currentFilter = e.target.dataset.filter;
    updateDisplay();
  };

  const handleSortClick = (e) => {
    if (!e.target.dataset.sort) return;
    currentSort = e.target.dataset.sort;
    updateDisplay();
  };

  const handleContainerClick = (e) => {
    if (e.target.classList.contains("favorite-btn")) {
      toggleFavorite(e.target.dataset.recipeId);
    }

    if (e.target.classList.contains("toggle-ingredients")) {
      e.target.nextElementSibling.classList.toggle("hidden");
    }

    if (e.target.classList.contains("toggle-steps")) {
      e.target.nextElementSibling.classList.toggle("hidden");
    }
  };

  /* ================================
     INIT
  ================================== */

  const init = () => {
    document.querySelector(".filter-buttons")
      .addEventListener("click", handleFilterClick);

    document.querySelector(".sort-buttons")
      .addEventListener("click", handleSortClick);

    recipeContainer.addEventListener("click", handleContainerClick);

    searchInput.addEventListener("input", handleSearch);
    clearSearchBtn.addEventListener("click", clearSearch);

    updateDisplay();

    console.log("RecipeJS initialized successfully");
  };

  document.addEventListener("DOMContentLoaded", init);

})();

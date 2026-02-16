const RecipeApp = (function () {

  console.log("RecipeApp initializing...");

  /* =========================
     STATE
  ========================= */

  let currentFilter = "all";
  let currentSort = "none";

  const recipeContainer = document.querySelector("#recipe-container");

  /* =========================
     RECIPE DATA
  ========================= */

  const recipes = [
    {
      id: 1,
      title: "Garlic Butter Pasta",
      time: 20,
      difficulty: "easy",
      description: "Simple garlic butter pasta.",
      category: "pasta",
      ingredients: ["Pasta", "Garlic", "Butter", "Salt", "Parsley"],
      steps: [
        "Boil water",
        "Add pasta and cook",
        {
          text: "Prepare garlic butter",
          substeps: [
            "Melt butter",
            "Add minced garlic",
            "Cook until fragrant"
          ]
        },
        "Mix pasta with garlic butter",
        "Serve hot"
      ]
    },
    {
      id: 2,
      title: "Veg Fried Rice",
      time: 30,
      difficulty: "easy",
      description: "Quick vegetable fried rice.",
      category: "rice",
      ingredients: ["Rice", "Carrot", "Beans", "Soy sauce", "Oil"],
      steps: [
        "Cook rice",
        "Heat oil in pan",
        {
          text: "Stir fry vegetables",
          substeps: [
            "Add carrots",
            "Add beans",
            "Cook until soft"
          ]
        },
        "Add rice and soy sauce",
        "Mix well and serve"
      ]
    },
    {
      id: 3,
      title: "Paneer Butter Masala",
      time: 45,
      difficulty: "medium",
      description: "Rich paneer curry.",
      category: "curry",
      ingredients: ["Paneer", "Tomatoes", "Cream", "Butter", "Spices"],
      steps: [
        "Saute onions",
        {
          text: "Prepare gravy",
          substeps: [
            "Add tomatoes",
            "Add spices",
            {
              text: "Blend mixture",
              substeps: [
                "Cool slightly",
                "Blend until smooth"
              ]
            }
          ]
        },
        "Add paneer",
        "Simmer with cream",
        "Serve hot"
      ]
    },
    {
      id: 4,
      title: "Chicken Biryani",
      time: 90,
      difficulty: "hard",
      description: "Classic layered biryani.",
      category: "rice",
      ingredients: ["Chicken", "Rice", "Yogurt", "Spices", "Onions"],
      steps: [
        "Marinate chicken",
        "Cook rice separately",
        {
          text: "Layer biryani",
          substeps: [
            "Add rice layer",
            "Add chicken layer",
            "Repeat layers"
          ]
        },
        "Cook on low heat",
        "Serve hot"
      ]
    },
    {
      id: 5,
      title: "Caesar Salad",
      time: 15,
      difficulty: "easy",
      description: "Fresh salad with dressing.",
      category: "salad",
      ingredients: ["Lettuce", "Croutons", "Parmesan", "Caesar dressing"],
      steps: [
        "Wash lettuce",
        "Prepare dressing",
        "Toss lettuce with dressing",
        "Add croutons and parmesan",
        "Serve immediately"
      ]
    },
    {
      id: 6,
      title: "Margherita Pizza",
      time: 60,
      difficulty: "medium",
      description: "Classic Italian pizza.",
      category: "pizza",
      ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella", "Basil"],
      steps: [
        "Preheat oven",
        "Roll dough",
        "Spread tomato sauce",
        "Add mozzarella",
        "Bake until golden",
        "Garnish with basil"
      ]
    },
    {
      id: 7,
      title: "Beef Wellington",
      time: 120,
      difficulty: "hard",
      description: "Pastry wrapped beef.",
      category: "meat",
      ingredients: ["Beef fillet", "Mushrooms", "Puff pastry", "Egg wash"],
      steps: [
        "Sear beef",
        "Prepare mushroom duxelles",
        "Wrap beef in pastry",
        "Brush with egg wash",
        "Bake until done"
      ]
    },
    {
      id: 8,
      title: "Thai Green Curry",
      time: 50,
      difficulty: "medium",
      description: "Spicy coconut curry.",
      category: "curry",
      ingredients: ["Coconut milk", "Green curry paste", "Vegetables", "Tofu"],
      steps: [
        "Heat curry paste",
        "Add coconut milk",
        {
          text: "Add vegetables",
          substeps: [
            "Add bell peppers",
            "Add zucchini",
            "Simmer until tender"
          ]
        },
        "Add tofu",
        "Serve with rice"
      ]
    }
  ];

  /* =========================
     RECURSIVE STEP RENDER
  ========================= */

  const renderSteps = (steps, level = 0) => {
    let html = "<ol>";
    steps.forEach(step => {
      if (typeof step === "string") {
        html += `<li class="step level-${level}">${step}</li>`;
      } else {
        html += `
          <li class="step level-${level}">
            ${step.text}
            ${renderSteps(step.substeps, level + 1)}
          </li>
        `;
      }
    });
    html += "</ol>";
    return html;
  };

  /* =========================
     CREATE CARD
  ========================= */

  const createRecipeCard = (recipe) => `
    <div class="recipe-card">
      <h3>${recipe.title}</h3>

      <div class="recipe-meta">
        <span>⏱️ ${recipe.time} min</span>
        <span class="difficulty ${recipe.difficulty}">
          ${recipe.difficulty}
        </span>
      </div>

      <p>${recipe.description}</p>

      <button class="toggle-btn"
        data-recipe-id="${recipe.id}"
        data-toggle="ingredients">
        Show Ingredients
      </button>

      <div class="ingredients-container"
        data-recipe-id="${recipe.id}">
        <ul>
          ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
        </ul>
      </div>

      <button class="toggle-btn"
        data-recipe-id="${recipe.id}"
        data-toggle="steps">
        Show Steps
      </button>

      <div class="steps-container"
        data-recipe-id="${recipe.id}">
        ${renderSteps(recipe.steps)}
      </div>
    </div>
  `;

  /* =========================
     FILTER + SORT
  ========================= */

  const filterRecipes = (arr, type) => {
    if (type === "easy") return arr.filter(r => r.difficulty === "easy");
    if (type === "medium") return arr.filter(r => r.difficulty === "medium");
    if (type === "hard") return arr.filter(r => r.difficulty === "hard");
    if (type === "quick") return arr.filter(r => r.time < 30);
    return arr;
  };

  const sortRecipes = (arr, type) => {
    const sorted = [...arr];
    if (type === "name") return sorted.sort((a,b)=>a.title.localeCompare(b.title));
    if (type === "time") return sorted.sort((a,b)=>a.time-b.time);
    return arr;
  };

  const renderRecipes = (arr) => {
    recipeContainer.innerHTML = arr.map(createRecipeCard).join("");
  };

  const updateDisplay = () => {
    let result = filterRecipes(recipes, currentFilter);
    result = sortRecipes(result, currentSort);
    renderRecipes(result);
  };

  /* =========================
     EVENT DELEGATION
  ========================= */

  const handleToggleClick = (event) => {
    const button = event.target.closest(".toggle-btn");
    if (!button) return;

    const id = button.dataset.recipeId;
    const type = button.dataset.toggle;

    const target = document.querySelector(
      `.${type}-container[data-recipe-id="${id}"]`
    );

    target.classList.toggle("visible");

    button.textContent = target.classList.contains("visible")
      ? `Hide ${type}`
      : `Show ${type}`;
  };

  const setupEventListeners = () => {
    recipeContainer.addEventListener("click", handleToggleClick);

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

    console.log("Event listeners attached!");
  };

  const init = () => {
    updateDisplay();
    setupEventListeners();
    console.log("RecipeApp ready!");
  };

  return { init };

})();

document.addEventListener("DOMContentLoaded", RecipeApp.init);

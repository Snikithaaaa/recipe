/* =========================
   RECIPE DATA
========================= */

const recipes = [
  {
    id: 1,
    title: "Garlic Butter Pasta",
    time: 20,
    difficulty: "easy",
    description: "Simple pasta tossed in garlic butter sauce.",
    category: "pasta"
  },
  {
    id: 2,
    title: "Veg Fried Rice",
    time: 30,
    difficulty: "easy",
    description: "Quick vegetable fried rice with soy sauce.",
    category: "rice"
  },
  {
    id: 3,
    title: "Paneer Butter Masala",
    time: 45,
    difficulty: "medium",
    description: "Rich tomato gravy with soft paneer cubes.",
    category: "curry"
  },
  {
    id: 4,
    title: "Chicken Biryani",
    time: 90,
    difficulty: "hard",
    description: "Layered rice dish cooked with spiced chicken.",
    category: "rice"
  },
  {
    id: 5,
    title: "Caesar Salad",
    time: 15,
    difficulty: "easy",
    description: "Fresh lettuce tossed with creamy dressing.",
    category: "salad"
  },
  {
    id: 6,
    title: "Margherita Pizza",
    time: 60,
    difficulty: "medium",
    description: "Classic pizza with tomato, basil and mozzarella.",
    category: "pizza"
  },
  {
    id: 7,
    title: "Beef Wellington",
    time: 120,
    difficulty: "hard",
    description: "Beef wrapped in pastry and baked.",
    category: "meat"
  },
  {
    id: 8,
    title: "Thai Green Curry",
    time: 50,
    difficulty: "medium",
    description: "Spicy coconut curry with vegetables.",
    category: "curry"
  }
];

/* =========================
   DOM SELECTION
========================= */

const recipeContainer = document.querySelector("#recipe-container");

/* =========================
   CREATE RECIPE CARD
========================= */

const createRecipeCard = (recipe) => {
  return `
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
};

/* =========================
   RENDER RECIPES
========================= */

const renderRecipes = (recipeArray) => {
  const recipeHTML = recipeArray
    .map(recipe => createRecipeCard(recipe))
    .join("");

  recipeContainer.innerHTML = recipeHTML;
};

/* =========================
   INIT APP
========================= */

renderRecipes(recipes);
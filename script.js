/*
Mapping from MealDB Categories to TheCocktailDB drink ingredient
You can customize or expand this object to suit your needs.
*/
const mealCategoryToCocktailIngredient = {
  Beef: "whiskey",
  Chicken: "gin",
  Dessert: "amaretto",
  Lamb: "vodka",
  Miscellaneous: "vodka",
  Pasta: "tequila",
  Pork: "tequila",
  Seafood: "rum",
  Side: "brandy",
  Starter: "rum",
  Vegetarian: "gin",
  Breakfast: "vodka",
  Goat: "whiskey",
  Vegan: "rum",
  // Add more if needed; otherwise default to something like 'cola'
};

/*
    2) Main Initialization Function
       Called on page load to start all the requests:
       - Fetch random meal
       - Display meal
       - Map meal category to spirit
       - Fetch matching (or random) cocktail
       - Display cocktail
*/
function init() {
  fetchRandomMeal()
    .then((meal) => {
      displayMealData(meal);
      const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
      return fetchCocktailByDrinkIngredient(spirit);
    })
    .then((cocktail) => {
      displayCocktailData(cocktail);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/*
 Fetch a Random Meal from TheMealDB
 Returns a Promise that resolves with the meal object
 */
function fetchRandomMeal() {
    return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.meals[0];
        });
}

/*
Display Meal Data in the DOM
Receives a meal object with fields like:
  strMeal, strMealThumb, strCategory, strInstructions,
  strIngredientX, strMeasureX, etc.
*/
function displayMealData(meal) {
    const container = document.getElementById("meal-container");

    // Samle ingredienser og mål i en liste
    let ingredientsHTML = "<ul>";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredientsHTML += `<li>${measure ? measure.trim() : ""} ${ingredient.trim()}</li>`;
        }
    }
    ingredientsHTML += "</ul>";

    container.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <p><strong>Kategori:</strong> ${meal.strCategory}</p>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <h3>Ingredienser</h3>
        ${ingredientsHTML}
        <h3>Fremgangsmåte</h3>
        <p>${meal.strInstructions}</p>
    `;
}
/*
Convert MealDB Category to a TheCocktailDB Spirit
Looks up category in our map, or defaults to 'cola'
*/
function mapMealCategoryToDrinkIngredient(category) {
  if (!category) return "cola";
  return mealCategoryToCocktailIngredient[category] || "cola";
}

function fetchCocktailByDrinkIngredient(drinkIngredient) {
    return fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(drinkIngredient)}`)
        .then(response => response.json())
        .then(data => {
            if (data.drinks) {
                return data.drinks[0];
            } 
            else {
                return fetchRandomCocktail();
            }
        });
}

/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
function fetchRandomCocktail() {
    return fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
        .then(response => response.json())
        .then(data => {
            return data.drinks[0];
        });
}

/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) {
    // Fill in
}

/*
Call init() when the page loads
*/
window.onload = init;

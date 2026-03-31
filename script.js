
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
};


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


function fetchRandomMeal() {
    return fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data.meals[0];
        });
}


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


function fetchRandomCocktail() {
    return fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
        .then(response => response.json())
        .then(data => {
            return data.drinks[0];
        });
}

function displayCocktailData(cocktail) {
    const container = document.getElementById("cocktail-container");

    let ingredientsHTML = "<ul>";
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredientsHTML += `<li>${measure ? measure.trim() : ""} ${ingredient.trim()}</li>`;
        }
    }
    ingredientsHTML += "</ul>";

    container.innerHTML = `
        <h2>${cocktail.strDrink}</h2>
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" />
        <h3>Ingredienser</h3>
        ${ingredientsHTML}
        <h3>Fremgangsmåte</h3>
        <p>${cocktail.strInstructions}</p>
    `;
}

window.onload = init;

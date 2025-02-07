import { API_URL, RES_PER_PAGE, API_KEY } from './config.js';
import { AJAX } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    currentPage: 1,
  },
  bookmarks: [],
};
function createRecipeObject(data) {
  state.recipe = {};
  Object.entries(data.data.recipe).forEach(value => {
    if (value[0].includes('_')) value[0] = value[0].slice(0, value[0].indexOf('_'));
    state.recipe[value[0]] = value.at(1);
  });
}
export async function loadRecipe(recipeId) {
  try {
    const data = await AJAX(`${API_URL}/${recipeId}?key=${API_KEY}`);
    createRecipeObject(data);
    console.log(state.recipe);
    if (state.bookmarks.some(bookmark => bookmark.id === recipeId)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
    // throw new Error(err.message);
  }
}
export async function loadSearchResults(query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(function (recipe) {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.currentPage = 1;
  } catch (err) {
    throw err;
  }
}
export function getResultsByPage(page = state.search.currentPage) {
  state.search.currentPage = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}
export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => (ing.quantity *= newServings / state.recipe.servings));
  state.recipe.servings = newServings;
}
function persistData() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}
export function addBookmark(recipe) {
  state.bookmarks.push({ ...recipe });
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistData();
}
export function deleteBookmark(id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistData();
}
function init() {
  const storageData = localStorage.getItem('bookmarks');
  if (storageData) state.bookmarks = JSON.parse(storageData);
}

function clearBookmarks() {
  localStorage.clear('bookmarks');
}

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error('wrong input format:(\n please use the correct format :)');
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    const recipeToUpload = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };
    const sentData = await AJAX(`${API_URL}?key=${API_KEY}`, recipeToUpload);
    createRecipeObject(sentData);
    console.log(sentData);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}
init();

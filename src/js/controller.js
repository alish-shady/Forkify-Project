import * as model from './model.js';
import { MODAL_CLOSE_TIME_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }
function init() {
  bookmarksView.addHandlerRender(controlRetrievedBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerAddRecipe(controlAddRecipe);
}
async function controlRecipes() {
  try {
    const recipeId = window.location.hash.slice(1);
    if (!recipeId) return;
    recipeView.loadingSpinner();
    resultsView.update(model.getResultsByPage());
    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(recipeId);
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
}
async function controlSearchResults() {
  try {
    resultsView.loadingSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    if (!model.state.search.results.length) throw new Error();
    resultsView.render(model.getResultsByPage());
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
}
function controlServings(newServings) {
  try {
    model.updateServings(newServings);
    recipeView.update(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}
function controlPagination(goToPageNum) {
  resultsView.render(model.getResultsByPage(goToPageNum));
  paginationView.render(model.state.search);
}
function controlAddBookmark() {
  try {
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);
    recipeView.update(model.state.recipe);
    if (!model.state.bookmarks.length) throw new Error();
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    bookmarksView.renderError();
  }
}
function controlRetrievedBookmarks() {
  try {
    if (!model.state.bookmarks.length) throw new Error();
    bookmarksView.render(model.state.bookmarks);
  } catch {
    bookmarksView.renderError();
  }
}
async function controlAddRecipe(newRecipe) {
  try {
    addRecipeView.loadingSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_TIME_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message.replace('\n', '<br>'));
  }
}
init();

//PARCEL
//MATERIAL ICON

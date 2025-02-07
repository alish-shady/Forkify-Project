import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was uploaded successfully :)))';
  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnShow = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  constructor() {
    super();
    this.#addHandlerShowRecipeWindow();
    this.#addHandlerHideRecipeWindow();
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  #addHandlerShowRecipeWindow() {
    this._btnShow.addEventListener('click', this.toggleWindow.bind(this));
  }
  #addHandlerHideRecipeWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerAddRecipe(subscriber) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = [...new FormData(this)];
      subscriber(Object.fromEntries(data));
    });
  }
  _generateMarkup() {}
}
export default new AddRecipeView();

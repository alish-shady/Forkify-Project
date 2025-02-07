import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage =
    'No bookmarks yet! find your favorite recipes and bookmark it :)';
  _message = '';
  addHandlerRender(subscriber) {
    window.addEventListener('load', subscriber);
  }
  _generateMarkup() {
    return this._data
      .map(function (bookmark) {
        return previewView.render(bookmark, false);
      })
      .join('');
  }
}
export default new BookmarksView();

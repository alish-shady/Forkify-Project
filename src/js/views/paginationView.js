import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  #generateNextBTN() {
    return `<button data-goto="${
      this._data.currentPage + 1
    }" class="btn--inline pagination__btn--next">
                <span>Page ${this._data.currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`;
  }
  #generatePrevBTN() {
    return `<button data-goto="${
      this._data.currentPage - 1
    }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.currentPage - 1}</span>
            </button>`;
  }
  addHandlerClick(subscriber) {
    this._parentElement.addEventListener('click', function (e) {
      const clickedBtn = e.target.closest('.btn--inline');
      if (!clickedBtn) return;
      const goToPageNum = +clickedBtn.dataset.goto;
      subscriber(goToPageNum);
    });
  }
  _generateMarkup() {
    const pagesSum = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    if (this._data.currentPage === 1 && pagesSum > 1)
      return this.#generateNextBTN();
    if (this._data.currentPage === pagesSum && pagesSum > 1)
      return this.#generatePrevBTN();
    if (this._data.currentPage < pagesSum && this._data.currentPage > 1)
      return `${this.#generatePrevBTN()}
    ${this.#generateNextBTN()}`;
    return '';
  }
}
export default new PaginationView();

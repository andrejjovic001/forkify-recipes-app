import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');  // Ako npr. kliknemo na span element da pronadje parent element tj citav button
           
            if(!btn) return;

            const goToPage = +btn.dataset.goto; // Pomocu dataset atributa dobijamo broj stranice na koju zelimo ici

            handler(goToPage);  // I taj broj stavlajmo u handler funkciju
        })
    }

    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage); //  npr. imamo 60 rezultata i podielimo sa brojem rez po stranici koji je kod nas 10 i dobijemo 6 stranica

        // Page 1, and there are other pages
        if (curPage === 1 && numPages > 1) {
            return this._generateBtnMarkup('next');
        }


        // Last page
        if (curPage === numPages && numPages > 1) {
            return this._generateBtnMarkup('prev');
        }

        // Other page
        if (curPage < numPages) {
            return `${this._generateBtnMarkup('next')}${this._generateBtnMarkup('prev')}`;
        }

        // Page 1, and there are NO other pages
        return '' // Ako ima samo jedna stranica da se ne prikazuju buttoni

    };


    _generateBtnMarkup(direction) {
        let pageNumber = this._data.page;
        direction.toLowerCase() === 'prev' ? (pageNumber -= 1) : (pageNumber += 1);
     
        return `
            <button data-goto="${pageNumber}" class="btn--inline pagination__btn--${direction}">
                <span>Page ${pageNumber}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-${direction==='prev' ? 'left' : 'right'}"></use>
                </svg>
            </button>`;
      }
}    


export default new PaginationView();
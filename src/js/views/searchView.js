class SearchView {
    _parentEl = document.querySelector('.search');

    // Metoda za dobijanje vrijednosti search-a
    getQuery() {
        const query = this._parentEl.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }


    // Metode stavljamo da su privatne kada znamo da ih necemo koristiti izvan ovog fajla
    _clearInput() {
        this._parentEl.querySelector('.search__field').value = '';
    }


    // Dodavanje listenera za controlSearchResults funkciju
    addHandlerSearch(handler) {
        this._parentEl.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        })
    }
}

export default new SearchView();
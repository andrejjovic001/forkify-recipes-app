// import icons from '../img/icons.svg';  // Parcel 1
import icons from 'url:../../img/icons.svg';  // Parcel 2


export default class View {
    _data;
    render(data, render = true) {
        // Provjervamo ako data ne postoji ili ako data postoji ali je duzina niza nula
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;  // Ovo su podaci koje smo unjeli u contoller fajlu u metodu render() model.state.recipe i ovo korisrimo u metodi #generateMarkup

        const markup = this._generateMarkup();

        if(!render) return markup;

        this._clear(); // Prvo isprazniti container
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }


    update(data) {
     
        this._data = data;  // Ovo su podaci koje smo unjeli u contoller fajlu u metodu render() model.state.recipe i ovo korisrimo u metodi #generateMarkup

        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        // isEqualNode je metoda koja se koristi za poređenje dva čvora i proverava da li su ekvivalentni (isti). true or false
        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // console.log(curEl, newEl.isEqualNode(curEl));

            // Updates changed TEXT - ako su cvorovi razliciti i ako nisu prazni
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                // console.log('🔴', newEl.firstChild.nodeValue.trim());
                curEl.textContent = newEl.textContent;
            }

            // Updates changed ATTRIBUTES - kopira atribute iz newEl u curEl
            if(!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
            }
        })
    }


    _clear() {
        this._parentElement.innerHTML = '';
    }

    

    renderSpinner() {
        const markup = `
        <div class="spinner">
        <svg>
            <use href="${icons}#icon-loader"></use>
        </svg>
        </div>
        `;
    
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }


    renderError(message = this._errorMessage) {
        const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }



    renderMessage(message = this._message) {
        const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

}
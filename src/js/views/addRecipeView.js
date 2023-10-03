import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully upload!'

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');


    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
        // this._addHandlerToggleWindow();
    }


    
    toggleWindow() {
      this._overlay.classList.toggle('hidden');
      this._window.classList.toggle('hidden');
    };


    _addHandlerShowWindow() {
      this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    };


    _addHandlerHideWindow() {
      this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
      this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    };


    // Ovo ne bi radilo da koristimo obicnu funkciju umjesto arrow, zato sto this rijec dobija drugi kontkest
    // _addHandlerShowWindow() {
    //     this._btnOpen.addEventListener('click', () => {
    //         this._overlay.classList.toggle('hidden');
    //         this._window.classList.toggle('hidden');
    //     })
    // };


    // // Zbog ponavljanja istog koda mozemo napraviti posebnu metodu za toggle
    // _addHandlerHideWindow() {
    //     this._btnClose.addEventListener('click', () => {
    //         this._overlay.classList.toggle('hidden');
    //         this._window.classList.toggle('hidden');
    //     });

    //     this._overlay.addEventListener('click', () => {
    //         this._overlay.classList.toggle('hidden');
    //         this._window.classList.toggle('hidden');
    //     });
    // };

    // _addHandlerToggleWindow() {
    //     [this._btnOpen, this._btnClose, this._overlay].forEach(btn => {
    //       btn.addEventListener('click', () => {
    //         this._overlay.classList.toggle('hidden');
    //         this._window.classList.toggle('hidden');
    //       });
    //     });
    //   }


    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(e) {
           e.preventDefault();

           // FormData uzmi sve podatke forme, radi na principu key/value, npr. kolicina: 20g i tako za sve podatke forme
           const dataArr = [...new FormData(this)]; // this oznacava formu zato sto na formi stavljamo addEventListener i onda this pripada elemntu na koji se stavio listener 

           // Object.fromEntries sluzi da konvertuje niz koji se sastoji od nizova key/value u jedan objekat koji se sastoji od key/value vrijednosti
           const data = Object.fromEntries(dataArr); 
           handler(data);
        })
    }


    _generateMarkup() {};

}    


export default new AddRecipeView();
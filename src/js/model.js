import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";
import { map } from "core-js/./es/array";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};


const createRecipeObject = function(data) {
    const { recipe } = data.data; // destructing array

    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }), // Ako recipe.key postoji onda u objekat dodaj key: recipe.key
      };
}


export const loadRecipe = async function(id) {
    try{
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

        state.recipe = createRecipeObject(data);

        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;     
    
        console.log(state.recipe);

    } catch (err) {
        console.error(`${err} ❌`);
        throw err;
    }
   
};


export const loadSearchResults = async function(query) {
    try {
        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

        // Ovdje prolazimo pomocu map metodu kroz sve nizove i vracamo novi niz, jer su u pitanju svi recepti
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),
            }
        });


        // Kada npr. ukucamo pizza i odemo na trecu stranicu u objektu state page postaje 3
        // i ako opet ukucamo pasta odvesce nas odma na stranicu 3 a ne na pocetnu
        // zbog toga trebamo resetovati page na 1
        state.search.page = 1;  

    }catch (err) {
        console.log(`${err} ❌`);
        throw err; 
    }

};



// Funkcija za rasporedjivanje rezultata u vise stranica, da ne budu svi rezulati odjenom ispisan
export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;   //0;
    const end = page * state.search.resultsPerPage;  //9;

    return state.search.results.slice(start, end);
};



// Funkcija koja kada promjenimo broj ljudi promjeni i kolicnu recepta
export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        // formula za izracunavanje nove kolicine recepta
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        // newQt = oldQt * newServings / oldServings  // 2 * 8 / 4 = 4
    });

    state.recipe.servings = newServings;
};


// Funkcija za spremanje podataka u localstorage - koristi se try/catch zato sto korisnici mogu onemoguciti u pregledniku localstorage
const persistBookmarks = () => {
    try {
      localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    } catch (err) {
      console.error(err, "localStorage disabled, can't use bookmarks");
    }
  };



export const addBookmark = function(recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmarked
    recipe.bookmarked = true;

    persistBookmarks();
};



export const deleteBookmark = function(id) {
    // Delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    state.recipe.bookmarked = false;

    persistBookmarks();
}


// Funkcija za uzmianje podataka iz localstorage-a
export const restoreBookmarks  = function() {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};




// Funkcija za brisanje iz localstoragea-a, korisiti se samo u slucaju debugg-iga
const clearBookmarks = function() {
    localStorage.clear('bookmarks');
};
// clearBookmarks(); 



export const uploadRecipe = async function(newRecipe) {
    try {
        // Objext.entries redi suprotno od Object.fromEntries, pretvara objekat u niz koji se sastoji od nizova
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0]
                            .startsWith('ingredient') && entry[1] !== '')
                            .map(ing => {
                                const ingArr = ing[1].split(',').map(el => el.trim());

                                if (ingArr.length !== 3) 
                                    throw new Error('Wrong fromat! Please use the correct format :)');

                                const [quantity, unit, description] = ingArr; 
                                return { quantity: quantity ? +quantity : null , unit, description }
                            });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };                                


        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);

    }catch (err) {
        throw err;
    }

};
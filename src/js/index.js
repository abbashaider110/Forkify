// Babel is used to convert modern javascript to ES5
// webpack is a module bundler which is used to bundle all modules
// npm scripts
//Command Line(DIR to see folders,cd to change directory,mkdir to make new folder, copy nul filename to make new file)
// copy jonas.js .. it copies the file in parent folder,move test.js .. moves the file to aprent folder
//del jonas.js it will delete the jonas.js file permenantly
// rmdir /S test it will delete whole folder test and its files
// start index.html will open this html file
// npm  init
// npm install webpack --save-dev to install webpack as develpment depend
// where as just npm install jquery --save will save it as dependecies
//npm install live-server --global  to instaall live server globally
// npm install webpack-cli --save-dev
// npm install webpack-dev-server --save-dev 
// npm run dev
// npm run start
// plugins allow us to do complex processing of our input file
//loader allow us to convert files 
// Global app controller

// use upper case for model name

// import str from './models/Search';
//import {add as a, multiply as m,ID} from './views/searchView';
// import * as searchView from './views/searchView'; // * means import everything

// console.log(`using imported function! ${searchView.add(searchView.ID,2)} and ${searchView.multiply(3,5)}. ${str}`);

/****First API call****/

//API key is kind of a password and it keeps track
// npm install axios --save use it for old browsers
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader,clearLoader} from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

 /**
  * Search Controller
  */


 const state = {};
 
 const controlSearch = async ()=>{
     // 1) Get query from view
     const query = searchView.getInput();

    

     if(query){
         // 2) New search object and add to state
         state.search = new Search(query);

         // 3) Prepare UI for results
         searchView.clearInput();
         searchView.clearResults();
         renderLoader(elements.searchRes);
        try{
            // 4) Search for recipes
         await state.search.getResults();

         // 5) Render results on UI
         clearLoader(); 

         searchView.renderResults(state.search.result);


        }catch(err){
            console.log('something went wrog')
            clearLoader(); 

        }
         
     }
 }

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});
// //Testing
// window.addEventListener('load', e =>{
//     e.preventDefault();
//     controlSearch();
// });

elements.searchResPages.addEventListener('click',e=>{

    const btn = e.target.closest('.btn-inline');// read at mdn
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10); //read at mdn
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
    }
});

/**
 * Recipe Controller
 */

const controlRecipe = async ()=>{
    //Get ID from url
    const ID = window.location.hash.replace('#',''); //thats how we get hash id

    if(ID)  {
        //prepare UI for changes
        recipeView.clearRecipe();
          renderLoader(elements.recipe);

        //highlight selected search item
        if(state.search) searchView.highlightSelected(ID);
        // create new recipe object
        state.recipe = new Recipe(ID);
        // //testing
        // window.r = state.recipe;

        try{
             // get recipe data

        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        // calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
        // state.recipe.parseIngredients();

        //render reciper
        clearLoader();
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(ID)
                );  
        }catch(err){
            console.log(err);
            console.log('something went wrong');
        }

       
    }

};

// window.addEventListener('hashchange',controlRecipe); //hashchange is use to change id written in url after hash

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));//load means when we load the page

/**
 * List Controller
 */

 const controlList =() => {
     // create a new list if there is none yet
     if(!state.list) state.list = new List();

     //add each ingredient to list

     state.recipe.ingredients.forEach(el =>{
         const item = state.list.addItem(el.count, el.unit, el.ingredient);
         listView.renderItem(item); 
     });
 }

 // Handle delete and update list items events
 elements.shopping.addEventListener('click',e=>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button
    if(e.target.matches('.shopping__delete,.shopping__delete *')){
        //delete the item from state
        state.list.deleteItem(id);

        //delete from list view
        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id,val); 
    }

    // Handling recipe button clicks
 })
 

/**
 * Like Controller
 */
//Testing


const controlLike = () =>{
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    //user has not yer liked current recipe
    if(!state.likes.isLiked(currentID)){
    // Add like to the state
    const newLike = state.likes.addLike(
        currentID,
        state.recipe.title,
        state.recipe.author,
        state.recipe.img

    )

    //toggle the like button
    likesView.toggleLikeBtn(true);

    // add like to UI list
    likesView.renderLike(newLike);
     console.log(state.likes);

    }//user has  liked current recipe
    else{
        // remove like to the state
        state.likes.deleteLike(currentID);

    //toggle the like button
    likesView.toggleLikeBtn(false);

    // remove like to UI list
    likesView.deleteLike(currentID);
    
    console.log(state.likes);

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// Restore liked recipes on page load

window.addEventListener('load', ()=>{

    state.likes = new Likes();

    // restore likes
    state.likes.readStorage();
    //toggle like menu button
likesView.toggleLikeMenu(state.likes.getNumLikes());

//render the existing likes

state.likes.likes.forEach(like => likesView.renderLike(like));

})


elements.recipe.addEventListener('click',e =>{
    if(e.target.matches('.btn-decrease,.btn-decrease *')){ // *  means any btn-decrease child
        // dec btn was clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);

        }
        
        }else if(e.target.matches('.btn-increase,.btn-increase *')){
        //inc btn was clicked
        state.recipe.updateServings('inc');
        
        recipeView.updateServingsIngredients(state.recipe);


    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){

        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        // like controller
        controlLike();
    }
});

// npm run build .......to bundle up
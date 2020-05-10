// export const add = (a,b) => a+b;
// export const multiply = (a,b) => a*b;
// export const ID = 23;

import {elements} from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = ()=>{
    elements.searchInput.value = '';
}

export const clearResults = ()=>{
    elements.searchResList.innerHTML = '';  // innerHTML is the code written in html for that particular field
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el =>{
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active'); //read about it
}

/**
 * acc: 0/ acc + cur.length = 5 / newTitle = ['Paste'] 
 * acc: 5/ acc + cur.length = 9 / newTitle = ['Paste' 'with'] 
 * acc: 9/ acc + cur.length = 15 / newTitle = ['Paste' 'with' 'tomato] 
 * acc: 15/ acc + cur.length = 18 / newTitle = ['Paste'] 
 * acc: 18/ acc + cur.length = 24 / newTitle = ['Paste'] 
 */

export const limitRecipeTitle = (title,limit = 17) => {
     const newTitle =[];
     if(title.length > limit){
         title.split(' ').reduce((acc,cur)=>{
             if(acc + cur.length <= limit){
                 newTitle.push(cur);
             } return acc + cur.length;
         },0);
         return `${newTitle.join(' ')} ...`;
     }
     return title;
 }
const renderRecipe = recipe =>{
    const markup = `
    <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
   </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

const creatButton = (page,type) => `

                <button class="btn-inline results__btn--${type}" data-goto= ${type==='prev' ? page-1:page+1} >
                <span>page ${type==='prev' ? page-1:page+1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type==='prev'?'left':'right'}"></use>
                    </svg>
                   
                </button>

`;

const renderButtons =(page,numResults,resPerPage)=>{
    const pages = Math.ceil(numResults/resPerPage); // ceil will round the number to next integer 4.1 = 5
    let button;
    if(page===1 && pages>1){
        // only button to go to next
        button = creatButton(page,'next');

    }else if (page < pages){
        // both buttons
        button = `
        ${creatButton(page,'prev')}
        ${creatButton(page,'next')}
        `
    }else if (page===pages && pages>1){
        // only prev button
        button = creatButton(page,'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
}

export const renderResults = (recipes, page =1,resPerPage = 10) => {
    //render result of result page
    const start =(page-1)*resPerPage;
    const end = page*resPerPage;

    recipes.slice(start,end).forEach(renderRecipe); // slice will slice the array in parts, and you  can pass in start and upto but not including the end end number of position of an array you want to get

    // button
    renderButtons(page,recipes.length,resPerPage);
};
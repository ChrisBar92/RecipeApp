const navBurger = document.querySelector('.nav__burger')
const burgerIcon = document.querySelector('.fa-bars')
const xIcon = document.querySelector('.fa-times')
const navList = document.querySelector('.nav__list')
const navListItem = document.querySelectorAll('.nav__list-item')
const search = document.querySelector('.search')
const searchInput = document.querySelector('.search__input')
const searchWarning = document.querySelector('.search__warning')
const recipeWarning = document.querySelector('.recipe__item-container-warning')
const recipe = document.querySelector('.recipe')
const listButtons = document.querySelectorAll('.list-buttons__item')
const additionalMenus = document.querySelectorAll('.additional-menu')
const additionFavouriteRecipes = document.querySelector('.additional-menus__favourite-recipes')

let searchDish = ''
let recipesArray = []

const APP_ID = '437b637b'
const APP_KEY = '63fef548c3655824d9fd2b6458b87b4d'

const handleNav = () => {
	burgerIcon.classList.toggle('hide')
	xIcon.classList.toggle('hide')
	navList.classList.toggle('activeNav')
}

navBurger.addEventListener('click', handleNav)

async function fetchAPI() {
	const URL = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchDish}&app_id=${APP_ID}&app_key=${APP_KEY}`
	const response = await fetch(URL)
	const data = await response.json()
	console.log(data.hits)
	// if(data.hits.length > 0) {
	// 	console.log(searchDish)
	// }
	createNewItems(data.hits)
	lastSearched(data.hits)

	// added and deleted to favourite tab
	const favButton = recipe.querySelectorAll('.recipe__item-container-fav')
	favButton.forEach(button => {
		button.addEventListener('click', () => {
			button.classList.toggle('added')
			if (button.matches('.added')) {
				button.textContent = 'Added to favourite'
				additionFavouriteRecipes.append(button.parentElement.parentElement)
			} else {
				button.textContent = 'Add to favourite'
				button.parentElement.parentElement.remove()
				recipe.append(button.parentElement.parentElement)
			}
		})
	})

	if (data.count === 0) {
		searchWarning.textContent = 'Meal or ingredient does not exist'
	}
}

const lastSearched = e => {
	console.log(e.target)
}

const createNewItems = items => {
	let newItem = ''
	items.map(item => {
		newItem += `	
        <div class="recipe__item">
            <div class="recipe__item-boxImage"><img class="recipe__item-boxImage-image" src="${
							item.recipe.image
						}" alt="${item.recipe.label}"></div>
                <div class="recipe__item-container">
                    <div class="recipe__item-container-header">
                        <p class="recipe__item-container-title">Title: ${item.recipe.label}</p>
                        <a href="${item.recipe.url}" target="_blank" class="recipe__item-container-link">View Recipe</a>
                    </div>
                    <div class="recipe__item-container-info">
                        <p class="recipe__item-container-cuisine"><span>Cuisine:</span> ${item.recipe.cuisineType}</p>
                        <p class="recipe__item-container-fat"><span>Fat:</span> ${Math.round(
													item.recipe.digest[0].total
												)} g</p>
                        <p class="recipe__item-container-diet"><span>Diet:</span> ${
													item.recipe.dietLabels.length > 0 ? item.recipe.dietLabels : 'No specific diet'
												}</p>
                        <p class="recipe__item-container-carb"><span>Carb:</span> ${Math.round(
													item.recipe.digest[1].total
												)} g</p>
                        <p class="recipe__item-container-calories"><span>Calories:</span> ${Math.round(
													item.recipe.calories
												)} kcal</p>
                        <p class="recipe__item-container-protein"><span>Protein:</span> ${Math.round(
													item.recipe.digest[2].total
												)} g</p>
                    </div>
                    <button class="recipe__item-container-fav">Add to favourite</button>
                   
                </div>
            </div>
	
	`
		recipe.innerHTML = newItem
	})
}

const pressEnter = e => {
	if (e.key === 'Enter') {
		if (searchInput.value === '') {
			searchWarning.textContent = 'You have to enter meal or ingredient!'
		} else {
			searchDish = searchInput.value
			fetchAPI()

			searchWarning.textContent = ''
			searchInput.value = ''
		}
	}
}

searchInput.addEventListener('keydown', pressEnter)

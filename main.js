const navBurger = document.querySelector('.nav__burger')
const navList = document.querySelector('.nav__list')
const navListItem = document.querySelectorAll('.nav__list-item')
const search = document.querySelector('.search')
const searchInput = document.querySelector('.search__input')
const searchWarning = document.querySelector('.search__warning')
const favButton = document.querySelector('.recipe__item-container-fav')
const recipeWarning = document.querySelector('.recipe__item-container-warning')

let searchDish = ''

const APP_ID = '437b637b'
const APP_KEY = '63fef548c3655824d9fd2b6458b87b4d'

async function fetchAPI() {
	const URL = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchDish}&app_id=${APP_ID}&app_key=${APP_KEY}`
	const response = await fetch(URL)
	const data = await response.json()
	console.log(data)
	
	if(data.count === 0) {
		searchWarning.textContent = 'Meal or ingredient does not exist'
	}
}

const checkEnter = e => {
	if (e.key === 'Enter') {
		if (searchInput.value === '') {
			searchWarning.textContent = 'You have to enter meal or ingredient!'
		} else {
			searchDish = searchInput.value
			fetchAPI()
			searchWarning.textContent = ''
		}
	}
}

searchInput.addEventListener('keydown', checkEnter)

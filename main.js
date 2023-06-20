const searchInput = document.querySelector('.search__input')
const searchWarning = document.querySelector('.search__warning')
const recipeView = document.querySelectorAll('.recipe__item-container-link')
const recipe = document.querySelector('.recipe')
const listButtons = document.querySelectorAll('.list-buttons__item')
const lastViewedBtn = document.querySelector('.last-searched')
const favouriteRecipesBtn = document.querySelector('.favourite-recipes')
const clearBtn = document.querySelector('.clear')
const additionalSearchedList = document.querySelector('.additional-menus__last-searched-list')
const additionalFavouriteRecipes = document.querySelector('.additional-menus__favourite-recipes')
const additionalLastReviewed = document.querySelector('.additional-menus__last-searched')
const paginatedList = document.getElementById('paginated-list')
const paginationContainer = document.querySelector('.pagination__container')
const paginationNumbers = document.querySelector('.pagination__numbers')
const nextButton = document.getElementById('next-button')
const prevButton = document.getElementById('prev-button')

let searchDish = ''
let recipesArray = []

const APP_ID = '437b637b'
const APP_KEY = '63fef548c3655824d9fd2b6458b87b4d'

async function fetchAPI() {
	const URL = `https://api.edamam.com/search?q=${searchDish}&app_id=${APP_ID}&app_key=${APP_KEY}&to=60`
	const response = await fetch(URL)
	const data = await response.json()
	recipe.classList.remove('hide')
	favouriteRecipesBtn.classList.remove('focus')
	lastViewedBtn.classList.remove('focus')

	createNewItems(data.hits)
	addToFavourite()
	addToLastViewed()
	// paginationContainer.remove()
	pagination()

	if (data.count === 0) {
		searchWarning.textContent = 'Meal or ingredient does not exist'
	}
}

// added to last viewed tab
const addToLastViewed = () => {
	const recipeView = recipe.querySelectorAll('.recipe__item-container-link')
	recipeView.forEach(button => {
		button.addEventListener('click', () => {
			let searchLi = document.createElement('li')
			searchLi.classList.add('additional-menus__last-searched-list-item')
			let searchA = document.createElement('a')
			let copiedLink = button.cloneNode()
			searchA = copiedLink
			searchA.classList.remove('recipe__item-container-link')
			searchA.textContent = button.previousElementSibling.textContent
			let checkItem = recipesArray.indexOf(searchA.textContent)
			if (checkItem === -1) {
				recipesArray.push(searchA.textContent)
				searchLi.append(searchA)
				additionalSearchedList.append(searchLi)
			}
		})
	})
}

// added and deleted favourite items
const addToFavourite = () => {
	const favButton = recipe.querySelectorAll('.recipe__item-container-fav')
	favButton.forEach(button => {
		let favItem
		button.addEventListener('click', () => {
			button.classList.toggle('added')
			if (button.matches('.added')) {
				button.textContent = 'Added to favourite'
				favItem = button.parentElement.parentElement
				additionalFavouriteRecipes.append(favItem)
			} else {
				button.textContent = 'Add to favourite'
				additionalFavouriteRecipes.removeChild(favItem)
				recipe.append(favItem)
			}
		})
	})
}

// function create recipes items
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
                        <p class="recipe__item-container-title">${item.recipe.label}</p>
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
		additionalFavouriteRecipes.classList.add('hide')
		additionalLastReviewed.classList.add('hide')
	})
}

// enter works after fill input
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

// function clear list in last viewed tab
const clearStuff = e => {
	e.target.previousElementSibling.innerHTML = ''
}

// function showing additional menus
const showAdditionalMenu = e => {
	if (e.target.matches('.last-searched')) {
		paginationContainer.classList.add('hide')
		additionalLastReviewed.classList.toggle('hide')
		if (!additionalLastReviewed.matches('.hide')) {
			favouriteRecipesBtn.classList.remove('focus')
			additionalFavouriteRecipes.classList.add('hide')
			e.target.classList.add('focus')
			recipe.classList.add('hide')
		} else {
			e.target.classList.remove('focus')
			recipe.classList.remove('hide')
		}
	} else if (e.target.matches('.favourite-recipes')) {
		paginationContainer.classList.add('hide')
		additionalFavouriteRecipes.classList.toggle('hide')
		if (!additionalFavouriteRecipes.matches('.hide')) {
			lastViewedBtn.classList.remove('focus')
			additionalLastReviewed.classList.add('hide')
			e.target.classList.add('focus')
			recipe.classList.add('hide')
		} else {
			e.target.classList.remove('focus')
			recipe.classList.remove('hide')
		}
	} else {
		recipe.classList.remove('hide')
	}
}

//paginaction
function pagination() {
	const listItems = paginatedList.querySelectorAll('.recipe__item')
	const paginationLimit = 15
	const pageCount = Math.ceil(listItems.length / paginationLimit)
	let currentPage = 1
	paginationContainer.classList.remove('hide')

	const disableButton = button => {
		button.classList.add('disabled')
		button.setAttribute('disabled', true)
	}

	const enableButton = button => {
		button.classList.remove('disabled')
		button.removeAttribute('disabled')
	}

	const handlePageButtonsStatus = () => {
		if (currentPage === 1) {
			disableButton(prevButton)
		} else {
			enableButton(prevButton)
		}

		if (pageCount === currentPage) {
			disableButton(nextButton)
		} else {
			enableButton(nextButton)
		}
	}

	const handleActivePageNumber = () => {
		document.querySelectorAll('.pagination__number').forEach(button => {
			button.classList.remove('active')
			const pageIndex = Number(button.getAttribute('page-index'))
			if (pageIndex == currentPage) {
				button.classList.add('active')
			}
		})
	}

	const appendPageNumber = index => {
		const pageNumber = document.createElement('button')
		pageNumber.className = 'pagination__number'
		pageNumber.innerHTML = index
		pageNumber.setAttribute('page-index', index)
		pageNumber.setAttribute('aria-label', 'Page ' + index)

		paginationNumbers.appendChild(pageNumber)
	}

	const getPaginationNumbers = () => {
		paginationNumbers.innerHTML = ''
		for (let i = 1; i <= pageCount; i++) {
			appendPageNumber(i)
		}
	}

	const setCurrentPage = pageNum => {
		currentPage = pageNum
		handleActivePageNumber()
		handlePageButtonsStatus()
		const prevRange = (pageNum - 1) * paginationLimit
		const currRange = pageNum * paginationLimit

		listItems.forEach((item, index) => {
			item.classList.add('hide')
			if (index >= prevRange && index < currRange) {
				item.classList.remove('hide')
			}
		})
	}

	getPaginationNumbers()
	setCurrentPage(1)

	prevButton.addEventListener('click', () => {
		setCurrentPage(currentPage - 1)
	})

	nextButton.addEventListener('click', () => {
		setCurrentPage(currentPage + 1)
	})

	document.querySelectorAll('.pagination__number').forEach(button => {
		const pageIndex = Number(button.getAttribute('page-index'))

		if (pageIndex) {
			button.addEventListener('click', () => {
				setCurrentPage(pageIndex)
			})
		}
	})
}

// add event listeners
listButtons.forEach(button => {
	button.addEventListener('click', showAdditionalMenu)
})
clearBtn.addEventListener('click', clearStuff)
searchInput.addEventListener('keydown', pressEnter)

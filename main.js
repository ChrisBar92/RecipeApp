
fetch('https://api.edamam.com/api/recipes/v2?type=public&q=spicy&app_id=437b637b&app_key=63fef548c3655824d9fd2b6458b87b4d')
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
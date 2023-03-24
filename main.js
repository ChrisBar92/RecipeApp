const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'df3fe9e3f0msh19a9ee45f189fbap1d3e19jsndda6b28feeea',
		'X-RapidAPI-Host': 'car-api2.p.rapidapi.com'
	}
};

fetch('https://car-api2.p.rapidapi.com/api/models?sort=id&direction=asc&verbose=yes', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
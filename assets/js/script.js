var searchResultsEl = $("#search-results");
var searchButtonEl = $("#search-button");
var inputEl = $("#search-input");
var searchList = [];
var searchListContainer = $("#search-list-container");
var APIKey = "6b9b01d3d9f1c0c20437677fc0595010";
var currentForecast = $('#currentForecast')
var futureForecast = $('#futureForecast')



function searchCity(event) {
    event.preventDefault();

    var searchString = $(inputEl).val().trim();
    //to add the search list to the front of the array
    searchList.unshift(searchString);
    inputEl.val("");

    storeSearchList();
}

function latLong(query) {
    currentForecast.html('');
    futureForecast.html('');
    fetch(`https://api.openweathermap.org/geo/1.0/direct?appid=${apiKey}&limit=1&q=` + query)
        .then(
            function (response) {
                return response.json();
            },
            function (error) {
                console.log(error.message);
            }
        )
        .then(function (data) {
            console.log(data);
            var lat = data[0].lat
            var long = data[0].long

            weatherApi(lat, long);
            fiveDayWeatherApi(lat, long);

        });
    inputEl.val("");
}

// This function is being called below and will run when the page loads.
function init() {
    // Get stored recent search list from localStorage
    var recentSearchList = JSON.parse(localStorage.getItem("recentSearch"));
    if (recentSearchList !== null) {
        searchList = recentSearchList;
    }
    renderSearchList();
}

function storeSearchList() {
    // Stringify and set key in localStorage to searchList array
    localStorage.setItem("recentSearch", JSON.stringify(searchList));
}

function renderSearchList() {
    searchListContainer.html("");
    //using DOM manipulation to dynamically create the search list
    var recentTitle = $('<h2 class="text-center font-bold">');
    recentTitle.text("Recent Searches").appendTo(searchListContainer);

    //Code will run as long as the list or when it reaches 5 items whichever is less
    for (var i = 0; i < searchList.length && i < 5; i++) {
        var search = searchList[i];
        var recentSearchButton = $(
            '<button class="recent-search bg-violet-500 hover:bg-violet-300 text-white font-bold py-2 px-4 rounded-full">'
        );
        //adding an event listener to the button so that they bring to the search page
        $(recentSearchButton).on("click", function (event) {
            searchCity = (event.target).text();
            latLong(searchCity)
        });

        recentSearchButton.text(search).appendTo(searchListContainer);
    }
}

searchButtonEl.on("click", searchCity);

init();


function fetchWeather() {
    var weather =
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&appid=" +
        APIKey;
    //api.openweathermap.org / data / 2.5 / forecast ? lat = { lat } & lon={ lon }& appid={ 6b9b01d3d9f1c0c20437677fc0595010 };
    fetch(weather)
        .then(function (response) {
            return response.json();
        })
        .then((data) => {
            console.log(data);
        });


}

function futureForecastApi(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&cnt=5&units=metric` + `&lat=` + lat + '&lon=' + lon)
        .then(
            function (response) {
                return response.json();
            },
            function (error) {
                console.log(error.message);
            }
        )
        .then(function (data) {
            console.log(data);
            appendFutureForecast(data);
        });
}

function appendCurrentForcast(data) {

    var currentDate = moment().format('dddd, Do MMMM YYYY')
    var cityLoc = $(`<h2 class="text-xl font-bold mb-1">${data.name} - ${currentDate} <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"></h2>`)
    var descriptionEl = data.weather[0].description
    var description = descriptionEl.toUpperCase()


    todayForecast.append(cityLoc)
    todayForecast.append(`<p class='mt-px mb-8'> ${description}`)
    todayForecast.append(`<p class="mb-4">Temp: ${data.main.temp} °C</p>`)
    todayForecast.append(`<p class="mb-4">Wind: ${data.wind.speed} KM/H</p>`)
    todayForecast.append(`<p class="mb-4">Humidity: ${data.main.humidity}%</p>`)
    // todayForecast.append(`<p class="mb-4">UV Index: ${data.wind.speed}</p>`)
}

function appendFutureForecast(data) {

    fiveDayContainer.append('<h3 class="text-xl font-bold mb-8 col-span-10">5-Day Forecast:</h3>')

    for (var i = 0; i < data.list.length; i++) {
        var list = data.list[i]
        var cardContainer = $('<div class="col-span-10 md:col-span-2 bg-indigo-400 text-white p-3 rounded-lg m-1">');
        let date = moment().add(i + 1, 'days').format('DD/MM/YYYY');
        fiveDayContainer.append(cardContainer);
        cardContainer.append(`<p class="text-xl font-bold mb-4">${date}</p>`);
        cardContainer.append(`<img src="http://openweathermap.org/img/wn/${list.weather[0].icon}@2x.png">`);
        cardContainer.append(`<p class="mb-4">Temp: ${list.main.temp} °C</p>`);
        cardContainer.append(`<p class="mb-4">Wind: ${list.wind.speed}KM/H</p>`);
        cardContainer.append(`<p class="mb-4">Humidity: ${list.main.humidity}%</p>`);
    }

}



var searchResultsEl = $("#search-results");
var searchButtonEl = $("#search-button");
var inputEl = $("#search-input");
var searchList = [];
var searchListContainer = $("#search-list-container");
var apiKey = "6b9b01d3d9f1c0c20437677fc0595010";
var currentForecast = $('#currentForecast')
var futureForecast = $('#futureForecast')



function searchCity(event) {
    event.preventDefault();

    var searchString = $(inputEl).val().trim();
    //to add the search list to the front of the array
    searchList.unshift(searchString);
    inputEl.val("");

    storeSearchList();
    renderSearchList();
    latLong(searchString);
}


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

        //recent btn to seach
        recentSearchButton.text(search).appendTo(searchListContainer);

        $(recentSearchButton).on("click", function (event) {
            searchItem = $(event.target).text();
            console.log(searchItem);

            latLong(searchItem);
        })
    }
}
searchButtonEl.on("click", searchCity);

init();

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
            var lon = data[0].lon

            fetchWeather(lat, lon);
            futureForecastApi(lat, lon);

        });
    inputEl.val("");
}

function fetchWeather(lat, lon) {
    var weather =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey;
    //api.openweathermap.org / data / 2.5 / forecast ? lat = { lat } & lon={ lon }& appid={ 6b9b01d3d9f1c0c20437677fc0595010 };
    fetch(weather)
        .then(function (response) {
            return response.json();
        })
        .then((data) => {
            console.log(data)
            appendCurrentForcast(data)
        });
        
};


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


    currentForecast.append(cityLoc)
    currentForecast.append(`<p class='mt-px m-8'> ${description}`)
    currentForecast.append(`<p class="m-4">Temp: ${data.main.temp} °C</p>`)
    currentForecast.append(`<p class="m-4">Wind: ${data.wind.speed} KM/H</p>`)
    currentForecast.append(`<p class="m-4">Humidity: ${data.main.humidity}%</p>`)

}

function appendFutureForecast(data) {

    futureForecast.append('<h3 class="text-xl font-bold mb-8 col-span-12">Five Day Forecast:</h3>')

    for (var i = 0; i < data.list.length; i++) {
        var list = data.list[i]
        var futureForecastCard = $('<div class="col-span-12 md:col-span-4 bg-violet-500 text-white p-4 rounded-lg m-1">');
        let date = moment().add(i + 1, 'days').format('DD/MM/YYYY');
        futureForecast.append(futureForecastCard);
        futureForecastCard.append(`<p class="text-xl font-bold m-4">${date}</p>`);
        futureForecastCard.append(`<img src="http://openweathermap.org/img/wn/${list.weather[0].icon}@2x.png">`);
        futureForecastCard.append(`<p class="m-4">Temp: ${list.main.temp} °C</p>`);
        futureForecastCard.append(`<p class="m-4">Wind: ${list.wind.speed}KM/H</p>`);
        futureForecastCard.append(`<p class="m-4">Humidity: ${list.main.humidity}%</p>`);
    }

}

  //not working UV Index
    // var uvIndex = "https://api.openweathermap.org/data/2.5/uvi?lat="
    //     + lat
    //     + "&lon="
    //     + lon
    //     + "&appid="
    //     + apiKey;
    // fetch(uvIndex)
    //     .then(function (response) {
    //         var pElUvi = $('<p>').text(`UV Index: `);
    //         var uviSpan = $('<span>').text(response.current.uvi);
    //         var uvi = response.current.uvi;
    //         pElUvi.append(uviSpan);
    //         appendCurrentForcast.append(pElUvi);;
    //         appendFutureForecast.append(pElUvi)
    //         //set the UV index to match an exposure chart severity based on color 
    //         if (uvi >= 0 && uvi <= 2) {
    //             uviSpan.attr('class', 'green');
    //         } else if (uvi > 2 && uvi <= 5) {
    //             uviSpan.attr("class", "yellow")
    //         } else if (uvi > 5 && uvi <= 7) {
    //             uviSpan.attr("class", "orange")
    //         } else if (uvi > 7 && uvi <= 10) {
    //             uviSpan.attr("class", "red")
    //         } else {
    //             uviSpan.attr("class", "purple")
    //         }
    //     });

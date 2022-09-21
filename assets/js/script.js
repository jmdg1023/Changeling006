var searchResultsEl = $("#search-results");
var searchButtonEl = $("#search-button");
var inputEl = $("#search-input");
var searchList = [];
var searchListContainer = $("#search-list-container");
var APIKey = "6b9b01d3d9f1c0c20437677fc0595010";




function searchCity(event) {
    event.preventDefault();

    var searchString = $(inputEl).val().trim();
    //to add the search list to the front of the array
    searchList.unshift(searchString);
    inputEl.val("");

    storeSearchList();



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
                document.location.assign("./search.html?query=" + $(event.target).text());
            });

            recentSearchButton.text(search).appendTo(searchListContainer);
        }
    }

    searchButtonEl.on("click", searchCity);

    init();


    function getCityWeather() {
        var weatherUrl =
            "https://api.openweathermap.org/data/2.5/uvi?lat=" +
            latitude +
            "&lon=" +
            longitude +
            "&appid=" +
            APIKey;
        //api.openweathermap.org / data / 2.5 / forecast ? lat = { lat } & lon={ lon }& appid={ 6b9b01d3d9f1c0c20437677fc0595010 };
        fetch(weatherUrl)
            .then(function (response) {
                return response.json();
            })
            .then((data) => {
                console.log(data);
            });
    }


    function displayUVindex(uv) {
        $.ajax({ // gets the UV index info
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + uv,
            method: "GET"
        })
            .then(function (response) {
                $("#uvIndex").text(response.value);
            });
    };
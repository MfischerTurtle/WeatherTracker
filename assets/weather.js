var searchHistoryList = $("#search-history-list");
var searchCityInput = $("#search-city");
var searchCityButton = $("#search-city-button");
var clearHistoryButton = $("#clear-history");

var currentCity = $("#current-city");
var currentTemp = $("#current-temp");
var currentHumidity = $("#current-humidity");
var currentWindSpeed = $("#current-wind-speed");

var weatherContent = $("#weather-content");

var APIkey = "db9f1d0bfd522ec5009cfa0a1e1de461";

// Easy access to data
var cityList = [];

var currentDate = moment().format("L");
$("#current-date").text("(" + currentDate + ")");

searchCityButton.on("click", function (event) {
  event.preventDefault();

  // Grab value entered into search bar
  var searchValue = searchCityInput.val().trim();
  if (searchValue == "") {
    alert("Please enter city name");
    return;
  }
  currentConditionsRequest(searchValue);
  getFiveDayForecast(searchValue);
  searchHistory(searchValue);

  searchCityInput.val("");
});

clearHistoryButton.on("click", function(){
  // Empty out the list of citys
  cityList = [];
  // Update list of history in local storage
  listArray();
});

function currentConditionsRequest(searchValue) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + APIkey;

  fetch(queryURL, {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      currentCity.text(response.name);
      currentCity.append("<small class='text-muted' id='current-date'>");
      $("#current-date").text("(" + currentDate + ")");
      currentCity.append(
        "<img src='https://openweathermap.org/img/w/" +
          response.weather[0].icon +
          ".png' alt='" +
          response.weather[0].main +
          "' />"
      );
      currentTemp.text(response.main.temp);
      currentTemp.append("&deg;F");
      currentHumidity.text(response.main.humidity + "%");
      currentWindSpeed.text(response.wind.speed + "MPH");
      weatherContent.removeClass("hide");

      var lat = response.coord.lat;
      var lon = response.coord.lon;
    });
}

function getFiveDayForecast(searchValue) {
  var forcastURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    searchValue +
    "&units=imperial&appid=" +
    APIkey;

  fetch(forcastURL, {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      for (i = 0; i < 5; i++) {
        var fiveDayTemp = $("#fiveday-temp" + i);
        var fiveDayHumi = $("#fiveday-Humi" + i);
        var fiveDayWind = $("#fiveday-Wind" + i);
        var fiveDayDate = $("#fiveday-date" + i);
        fiveDayDate.text(response.list[i * 8].dt_txt);
        fiveDayTemp.text(response.list[i * 8].main.temp);
        fiveDayTemp.append("&deg;F");
        fiveDayHumi.text(response.list[i * 8].main.humidity + "%");
        fiveDayWind.text(response.list[i * 8].wind.speed + "MPH");
      }
      console.log(response);
      currentCity.text(response.name);
    
      var lat = response.city.coord.lat;
      var lon = response.city.coord.lon;
    });
}

function searchHistory(searchValue) {
  // Grab value entered into search bar
  // var searchValue = searchCityInput.val().trim();

  // If there are characters entered into the search bar
  if (searchValue) {
    // Place value in the array of cities
    // if it is a new entry
    if (cityList.indexOf(searchValue) === -1) {
      cityList.push(searchValue);

      // List all of the cities in user history
      listArray();
      clearHistoryButton.removeClass("hide");
      weatherContent.removeClass("hide");
    } else {
      // Remove the existing value from
      // the array
      var removeIndex = cityList.indexOf(searchValue);
      cityList.splice(removeIndex, 1);

      // Push the value again to the array
      cityList.push(searchValue);

      // list all of the cities in user history
      // so the old entry appears at the top
      // of the search history
      listArray();
      clearHistoryButton.removeClass("hide");
      weatherContent.removeClass("hide");
    }
  }
  // console.log(cityList);
}

// List the array into the search history sidebar
function listArray() {
  // Empty out the elements in the sidebar
  searchHistoryList.empty();
  // Repopulate the sidebar with each city
  // in the array
  cityList.forEach(function (city) {
    var searchHistoryItem = $('<li class="list-group-item city-btn">');
    searchHistoryItem.attr("data-value", city);
    searchHistoryItem.text(city);
    searchHistoryList.prepend(searchHistoryItem);
  });
  // Update city list history in local storage
  localStorage.setItem("cities", JSON.stringify(cityList));
}

// Grab city list string from local storage
// and update the city list array
// for the search history sidebar
function initalizeHistory() {
  if (localStorage.getItem("cities")) {
    cityList = JSON.parse(localStorage.getItem("cities"));
    var lastIndex = cityList.length - 1;
    // console.log(cityList);
    listArray();
    // Display the last city viewed
    // if page is refreshed
    if (cityList.length !== 0) {
      currentConditionsRequest(cityList[lastIndex]);
      weatherContent.removeClass("hide");
    }
  }
}

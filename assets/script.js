const ONE_DAY_LATER = 0;
const TWO_DAYS_LATER = 8;
const THREE_DAYS_LATER = 16;
const FOUR_DAYS_LATER = 24;
const FIVE_DAYS_LATER = 32;

var resultTextEl = $('#result-text');
var resultContentEl = $('#result-content');
var searchButton = $('#submit');
searchButton.on('click', handleSearchFormSubmit);

getWeatherData(displayCurrentData, displayFutureData);

// Click Button Function
function handleSearchFormSubmit(event) {
  // Stops form from submitting multiple times
  event.preventDefault();

  // Grabbing string from search box
  var searchInputVal = $('#search-input')[0].value;

  // If there's nothing typed in the search box, adding error in console
  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  // Fetch Call to weather API
  searchApi(searchInputVal);
}

// API CALL
function searchApi(searchValue) {
  getWeatherData(searchValue, displayCurrentData, displayFutureData);
}

function getWeatherData(cityName, useCurrentData, useHistoricalData) {
  // API Query String
  var query = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=d5befa6b019f2ef72ad903993552776d`;
  fetch(query)
    .then(response => {
      return response.json();
    })
    .then(results => {
      const cityName = results.city.name;
      const currentDayData = results.list[0];
      const historicalData = [
        results.list[ONE_DAY_LATER],
        results.list[TWO_DAYS_LATER],
        results.list[THREE_DAYS_LATER],
        results.list[FOUR_DAYS_LATER],
        results.list[FIVE_DAYS_LATER]
      ];

      useCurrentData(currentDayData, cityName);
      useHistoricalData(historicalData);
    })
    .catch(function (error) {
      console.error(error);
    });
}

function displayCurrentData (currentData, cityName) {
  const date = new Date(currentData.dt_txt).toLocaleDateString();
  const currentElement = $('#current-data');
  const iconAddress = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}.png`;
  const icon = $(`<img src=${iconAddress} />`);
  const cityNameElement = $(`<div id="city-name">${cityName} ${date}</div>`);
  cityNameElement.append(icon);
  currentElement.append(cityNameElement);
  currentElement.append(`<div class="current-data-point">Temp: ${currentData.main.temp}ºC</div>`);
  currentElement.append(`<div class="current-data-point">Wind: ${currentData.wind.speed}kph</div>`);
  currentElement.append(`<div class="current-data-point">Humidity: ${currentData.main.humidity}%</div>`);
}

// Build Result Card Function
function displayFutureData(result) { 
  for (let day = 0; day < result.length; day++) {
    displayFutureDay(result[day]);
  }
}

function displayFutureDay(weatherData) {
  const date = new Date(weatherData.dt_txt).toLocaleDateString();
  const currentElement = $('#future-data');
  const futureDateElement = $('<div class="future-date-container card"></div>');
  const iconAddress = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
  const icon = $(`<img src=${iconAddress} />`);
  const cardBody = $('<div class="card-body"></div>');
  cardBody.append(`<div class="future-date">${date}</div>`);
  cardBody.append(icon);
  cardBody.append(`<div class="future-data-point">Temp: ${weatherData.main.temp}ºC</div>`);
  cardBody.append(`<div class="future-data-point">Wind: ${weatherData.wind.speed}kph</div>`);
  cardBody.append(`<div class="future-data-point">Humidity: ${weatherData.main.humidity}%</div>`);
  futureDateElement.append(cardBody);
  currentElement.append(futureDateElement);
}

function getParams() {
  var searchParamsArr = document.location.search.split('&');

  var query = searchParamsArr[0].split('=').pop();

  searchApi(query);
}


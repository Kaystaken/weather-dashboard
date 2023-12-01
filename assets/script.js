const CURRENT_DAY = 0;
const ONE_DAY_LATER = 8;
const TWO_DAYS_LATER = 16;
const THREE_DAYS_LATER = 24;
const FOURS_DAYS_LATER = 32;
// should be 40, but the result list isn't designed that way
const FIVE_DAYS_LATER = 39;

var resultTextEl = $('#result-text');
var resultContentEl = $('#result-content');
var searchButton = $('#submit');

searchButton.on('click', handleSearchFormSubmit);

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
  getWeatherData(searchValue, displayCurrentData, displayHistoricalData);

  // Clear Results Container
  resultContentEl.textContent = '';
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
      const currentDayData = results.list[CURRENT_DAY];
      const historicalData = [
        results.list[ONE_DAY_LATER],
        results.list[TWO_DAYS_LATER],
        results.list[THREE_DAYS_LATER],
        results.list[FOURS_DAYS_LATER],
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
  const date = new Date().toLocaleDateString();
  const currentElement = $('#current-data');
  currentElement.append(`<div id="city-name">${cityName} ${date}</div>`);
  currentElement.append(`<div class="current-data-point">Temp: ${currentData.main.temp}degreeC</div>`);
  currentElement.append(`<div class="current-data-point">Wind: ${currentData.wind.speed}KPH</div>`);
  currentElement.append(`<div class="current-data-point">Humidity: ${currentData.main.humidity}%</div>`);
}

// Build Result Card Funciton
function displayHistoricalData(result) { 
  for (let day = 0; day < result.length; day++) {
    displayHistoricalDay(result[day]);
  }
}

function displayHistoricalDay(weatherData) {
  console.log(weatherData.dt_txt + ' data:', weatherData);
}

function getParams() {
  var searchParamsArr = document.location.search.split('&');

  var query = searchParamsArr[0].split('=').pop();

  searchApi(query);
}


const API = 'https://api.openweathermap.org/data/2.5';
const API_KEY = 'd5befa6b019f2ef72ad903993552776d';
const API_OPTIONS = `units=metric&appid=${API_KEY}`;

const HISTORY_KEY = 'searchHistory';

const ONE_DAY_LATER = 0;
const TWO_DAYS_LATER = 8;
const THREE_DAYS_LATER = 16;
const FOUR_DAYS_LATER = 24;
const FIVE_DAYS_LATER = 32;

const searchHistory = $('#search-history');
const searchButton = $('#submit');
searchButton.on('click', handleSearchFormSubmit);
displaySearchHistory();

// Click Button Function
function handleSearchFormSubmit(event) {
  // Stops form from submitting multiple times
  event.preventDefault();

  // Grabbing string from search box
  const searchInputVal = $('#search-input')[0].value;

  // If there's nothing typed in the search box, adding error in console
  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  saveSearchHistory(searchInputVal);
  runSearch(searchInputVal);
}

function runSearch(search) {
  displaySearchHistory();
  searchApi(search);
}

function displaySearchHistory() {
  searchHistory.empty();
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? [];
  for (let count = 0; count < history.length; count++) {
    const button = $(`<button class='history-search-btn'>${history[count]}</button>`);
    button.on('click', () => runSearch(history[count]));
    searchHistory.append(button);
  }
}

function saveSearchHistory(previousSearch) {
  const modifiedSearch = previousSearch[0].toUpperCase() + previousSearch.substring(1).toLowerCase();
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? [];
  if (!history.includes(modifiedSearch)) {
    history.push(modifiedSearch)
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// API CALL
function searchApi(searchValue) {
  getFutureWeatherData(searchValue, displayCurrentData, displayFutureData);
}

function getCurrentWeatherData(latitude, longitude, useCurrentData) {
  const query = `${API}/weather?${API_OPTIONS}&lat=${latitude}&lon=${longitude}`;
  fetch(query)
    .then(response => response.json())
    .then(results => {
      const cityName = results.name;
      useCurrentData(results, cityName);
    })
    .catch(error => console.log(error));
}

function getFutureWeatherData(cityName, useCurrentData, useFutureData) {
  // API Query String
  const query = `${API}/forecast?${API_OPTIONS}&q=${cityName}`;
  fetch(query)
    .then(response => response.json())
    .then(results => {
      const futureData = [
        results.list[ONE_DAY_LATER],
        results.list[TWO_DAYS_LATER],
        results.list[THREE_DAYS_LATER],
        results.list[FOUR_DAYS_LATER],
        results.list[FIVE_DAYS_LATER]
      ];

      getCurrentWeatherData(results.city.coord.lat, results.city.coord.lon, useCurrentData);
      useFutureData(futureData);
    })
    .catch(error => console.error(error));
}

function displayCurrentData (currentData, cityName) {
  const currentElement = $('#current-data');
  currentElement.empty();

  const date = new Date().toLocaleDateString();
  const iconAddress = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}.png`;
  const icon = $(`<img src=${iconAddress} />`);
  const cityNameElement = $(`<div id="city-name">${cityName} ${date}</div>`);
  cityNameElement.append(icon);
  currentElement.append(cityNameElement);
  addWeatherDetails(currentElement, 'current-data-point', currentData.main.temp, currentData.wind.speed, currentData.main.humidity);
}

// Build Result Card Function
function displayFutureData(result) { 
  const currentElement = $('#future-data');
  currentElement.empty();

  for (let day = 0; day < result.length; day++) {
    displayFutureDay(result[day]);
  }
}

function displayFutureDay(weatherData) {
  const currentElement = $('#future-data');
  const date = new Date(weatherData.dt_txt).toLocaleDateString();
  const futureDateElement = $('<div class="future-date-container card"></div>');
  const iconAddress = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
  const icon = $(`<img src=${iconAddress} />`);
  const cardBody = $('<div class="card-body"></div>');
  cardBody.append(`<div class="future-date">${date}</div>`);
  cardBody.append(icon);
  addWeatherDetails(cardBody, 'future-data-point', weatherData.main.temp, weatherData.wind.speed, weatherData.main.humidity);
  futureDateElement.append(cardBody);
  currentElement.append(futureDateElement);
}

function addWeatherDetails(container, className, temp, wind, humidity) {
  container.append(`<div class=${className}>Temp: ${temp}ºC</div>`);
  container.append(`<div class=${className}>Wind: ${wind} km/h</div>`);
  container.append(`<div class=${className}>Humidity: ${humidity}%</div>`);
}

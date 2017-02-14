// visit www.wunderground.com/weather/api/ to get a key
const wunderground_key = '';
if (wunderground_key === '') console.log('No api key supplied!');

const geoRequestURL = `https://api.wunderground.com/api/${wunderground_key}/geolookup/q/autoip.json`;
let weatherRequestURL = `https://api.wunderground.com/api/${wunderground_key}/conditions/q/`;
let city, state;
let tempF, tempC, weatherStatus, weatherIconURL;

function toggleTemp() {
  let f = document.querySelector('.temperature-f');
  let c = document.querySelector('.temperature-c');

  if (f.style.display === '') {
    f.style.display = 'none';
    c.style.display = '';
  } else if (c.style.display === '') {
    c.style.display = 'none';
    f.style.display = '';
  }
}

fetch(geoRequestURL)
  .then(response => response.json())
  .then(json => {
    city = json.location.city.replace(/ /g, '_');
    state = json.location.state;

    // Dynamically build weatherRequest from geoRequest
    weatherRequestURL += state + '/' + city + '.json';
    document.querySelector('.location p').innerText = city + ', ' + state;
  })
  .then(() => {
    let weatherRequest = new XMLHttpRequest();
    weatherRequest.open('GET', weatherRequestURL, false);
    weatherRequest.send(null);
    const weatherjson = JSON.parse(weatherRequest.responseText);

    tempF = weatherjson.current_observation.temp_f;
    tempC = weatherjson.current_observation.temp_c;
    weatherStatus = weatherjson.current_observation.weather;
    weatherIconURL = weatherjson.current_observation.icon_url;

    document.querySelector('.temperature-f p').innerHTML = tempF +
      '<a onclick="toggleTemp();" class="fahrenheit" href="#">°</a>F';
    document.querySelector('.temperature-c p').innerHTML = tempC +
      '<a onclick="toggleTemp();" class="celsius" href="#">°</a>C';
    document.querySelector('.weather-status p').innerText = weatherStatus;

    let weatherImg = document.createElement('img');
    weatherImg.src = weatherIconURL;
    document.querySelector('.weather-icon').appendChild(weatherImg);
  });

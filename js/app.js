document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        findMe();
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});



//#region Find Location
//* GET COORDINATES IF USER ALLOW IT.
const findMe = () => {

    const success = (position) => {
        const { latitude, longitude } = position.coords;
        getCoordinates(latitude, longitude);
    };

    const error = () => {
        alert('Unable to retrieve your location.');
    };

    navigator.geolocation.getCurrentPosition(success, error);
};
//#endregion



//#region Location Coord
//* Get the Location Coordinates
function getCoordinates(latitude, longitude) {
    fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
        .then(response => response.json())
        .then(data => {
            let city = data.properties.relativeLocation.properties.city
            let state = data.properties.relativeLocation.properties.state
            console.log(city);
            console.log(state);
            displayInfo(city, state);
            const { gridId, gridX, gridY } = data.properties;
            getForecast(gridId, gridX, gridY);
        })
        .catch(error => console.error('Error fetching coordinates:', error));
};
//#endregion



//#region Display Location
//* Get Location to Display
function displayInfo(city, state) {
    const yourLocation = document.getElementById("infoLocation")
    yourLocation.innerHTML = ''; // Clear location

    const location = document.createElement('h3');
    location.className = 'location';
    location.textContent = `${city}, ${state}`;

    yourLocation.append(location);

};
//#endregion



//#region Forcast Info
//* Get Forcast Information
function getForecast(gridId, gridX, gridY) {
    fetch(`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayWeather(data.properties.periods);
        })
        .catch(error => console.error('Error fetching forecast:', error));
};
//#endregion



//#region Display Weather
//* Display the Weather on the Card of each day. 
function displayWeather(forecastInfo) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clear any existing content

    // Group forecasts by day
    const dailyForecasts = [];
    for (let i = 0; i < forecastInfo.length; i += 2) {
        dailyForecasts.push({
            day: forecastInfo[i],
            night: forecastInfo[i + 1]
        });
    }

    dailyForecasts.slice(0, 7).forEach(({ day, night }) => {
        const card = document.createElement('div');
        card.className = 'container card mb-3 text-center';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = day.name;
        if (title.textContent === 'This Afternoon') {
            title.textContent = "Today"
        }

        const dayIcon = document.createElement('img');
        dayIcon.className = 'card-img';
        dayIcon.src = day.icon;

        const dayTemp = document.createElement('p');
        dayTemp.className = 'card-text';
        dayTemp.textContent = `Temperature: ${day.temperature}°${day.temperatureUnit}`;

        const dayDesc = document.createElement('p');
        dayDesc.className = 'card-text';
        dayDesc.textContent = day.shortForecast;

        const nightIcon = document.createElement('img');
        nightIcon.className = 'card-img';
        nightIcon.src = night.icon;

        const nightTemp = document.createElement('p');
        nightTemp.className = 'card-text night';
        nightTemp.textContent = `Night Temperature: ${night.temperature}°${night.temperatureUnit}`;

        const nightDesc = document.createElement('p');
        nightDesc.className = 'card-text';
        nightDesc.textContent = night.shortForecast;

        cardBody.appendChild(title);
        cardBody.appendChild(dayTemp);
        cardBody.appendChild(dayDesc);
        cardBody.appendChild(dayIcon);
        cardBody.appendChild(nightTemp);
        cardBody.appendChild(nightDesc);
        cardBody.appendChild(nightIcon);
        card.appendChild(cardBody);
        forecastContainer.appendChild(card);
    });
};
//#endregion



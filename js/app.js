document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        findMe();
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

//* GET COORDINATES
const findMe = () => {

    const success = (position) => {
        status.textContent = "success";
        const { latitude, longitude } = position.coords;
        getCoordinates(latitude, longitude);
    };

    const error = () => {
        alert('Unable to retrieve your location.');
    };

    navigator.geolocation.getCurrentPosition(success, error);
};

function getCoordinates(latitude, longitude) {
    fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
        .then(response => response.json())
        .then(data => {
            const { gridId, gridX, gridY } = data.properties;
            getForecast(gridId, gridX, gridY);
        })
        .catch(error => console.error('Error fetching coordinates:', error));
};

function getForecast(gridId, gridX, gridY) {
    fetch(`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayWeather(data.properties.periods);
        })
        .catch(error => console.error('Error fetching forecast:', error));
}


function displayWeather(forecastInfo) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clear any existing content
    

    forecastInfo.forEach(day => {
        const card = document.createElement('div');
        card.className = 'container card mb-3';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = day.name;

        const icon = document.createElement('img');
        icon.className = 'card-img';
        icon.src = day.icon;

        const temp = document.createElement('p');
        temp.className = 'card-text';
        temp.textContent = `Temperature: ${day.temperature}°${day.temperatureUnit}`;

        const desc = document.createElement('p');
        desc.className = 'card-text';
        desc.textContent = day.shortForecast;

        cardBody.appendChild(title);
        cardBody.appendChild(icon);
        cardBody.appendChild(temp);
        cardBody.appendChild(desc);
        card.appendChild(cardBody);
        forecastContainer.appendChild(card);
    });
}


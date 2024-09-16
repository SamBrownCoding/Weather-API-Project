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
        const { latitude, longitude } = position.coords;
        getCoordinates(latitude, longitude);
    };

    const error = () => {
        alert('Unable to retrieve your location.');
    };

    navigator.geolocation.getCurrentPosition(success, error);
};

const getCoordinates = (latitude, longitude) => {
    fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
        .then(response => response.json())
        .then(data => {
            const { gridId, gridX, gridY } = data.properties;
            getForecast(gridId, gridX, gridY);
        })
        .catch(error => console.error('Error fetching coordinates:', error));
};

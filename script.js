let cities = [];

async function loadCities() {
    const response = await fetch('https://raw.githubusercontent.com/datasets/world-cities/master/data/world-cities.json');
    const data = await response.json();
    cities = data.map(city => `${city.name}, ${city.country}`); // Adjust as needed
}

function showSuggestions() {
    const input = document.getElementById('city-input').value.toLowerCase();
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none';

    if (input) {
        const filteredCities = cities.filter(city => city.toLowerCase().includes(input));
        filteredCities.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.onclick = () => selectCity(city);
            suggestionsContainer.appendChild(li);
        });
        if (filteredCities.length > 0) {
            suggestionsContainer.style.display = 'block';
        }
    }
}

function selectCity(city) {
    document.getElementById('city-input').value = city;
    document.getElementById('suggestions').style.display = 'none';
    getTime(city);
}

async function getTime(city) {
    const apiUrl = `https://worldtimeapi.org/api/timezone/${city}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('City not found');
            return response.json();
        })
        .then(data => {
            const dateTime = new Date(data.datetime);
            updateTime(dateTime);
        })
        .catch(error => {
            console.error('Error fetching time:', error);
            document.getElementById('current-time').innerText = 'Error fetching time';
        });
}

function updateTime(dateTime) {
    const hours = String(dateTime.getUTCHours()).padStart(2, '0');
    const minutes = String(dateTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(dateTime.getUTCSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById('current-time').innerText = timeString;
}

window.onload = async () => {
    await loadCities();
};

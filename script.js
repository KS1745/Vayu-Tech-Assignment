const API_KEY = "23a7aeffb8fecb6808f3792f06da9f87"; 
const API_URL = "https://api.openweathermap.org/data/2.5/weather?q=";
const GEO_URL = "https://api.openweathermap.org/data/2.5/weather?lat=";

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const weatherInfo = document.getElementById("weather-info");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const weatherCondition = document.getElementById("weather-condition");
const weatherIcon = document.getElementById("weather-icon");
const errorMessage = document.getElementById("error-message");
const geoButton = document.getElementById("geo-btn");
const unitToggle = document.getElementById("unit-toggle");

let isCelsius = true;


function fetchWeather(city) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${API_URL}${city}&appid=${API_KEY}&units=metric`);
    
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            updateUI(data);
        } else {
            errorMessage.textContent = "City not found. Please try again!";
            weatherInfo.classList.add("hidden");
        }
    };

    xhr.onerror = function () {
        errorMessage.textContent = "Error fetching weather data!";
    };

    xhr.send();
}

function updateUI(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    let tempC = data.main.temp;
    let tempF = (tempC * 9/5) + 32;
    temperature.textContent = `Temperature: ${tempC.toFixed(1)}°C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    weatherCondition.textContent = `Condition: ${data.weather[0].description}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    unitToggle.onclick = () => {
        isCelsius = !isCelsius;
        temperature.textContent = isCelsius 
            ? `Temperature: ${tempC.toFixed(1)}°C` 
            : `Temperature: ${tempF.toFixed(1)}°F`;
        unitToggle.textContent = isCelsius ? "Switch to °F" : "Switch to °C";
    };

    weatherInfo.classList.remove("hidden");
    errorMessage.textContent = "";
}


form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        errorMessage.textContent = "Please enter a city name!";
    }
});


geoButton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        }, () => {
            errorMessage.textContent = "Location access denied!";
        });
    } else {
        errorMessage.textContent = "Geolocation is not supported by your browser!";
    }
});


function fetchWeatherByCoords(lat, lon) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${GEO_URL}${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            updateUI(data);
        } else {
            errorMessage.textContent = "Error fetching location weather!";
        }
    };

    xhr.onerror = function () {
        errorMessage.textContent = "Network error!";
    };

    xhr.send();
}

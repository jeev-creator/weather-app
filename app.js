const apiKey = "17952d63e5044a6a9ad122335251202"; // Replace with your API key
let tempUnit = "C";

async function fetchWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
        const data = await response.json();

        if (response.ok) {
            updateWeatherUI(data);
            document.getElementById("error-message").innerText = "";
        } else {
            document.getElementById("error-message").innerText = `Error: ${data.error?.message || "City not found"}`;
            document.getElementById("weather-info").style.display = "none";
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Failed to fetch weather data. Check your internet connection.");
    }
}

function fetchWeatherByCoords() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`);
                const data = await response.json();

                if (response.ok) {
                    updateWeatherUI(data);
                    document.getElementById("error-message").innerText = "";
                } else {
                    document.getElementById("error-message").innerText = `Error: ${data.error?.message || "Location not found"}`;
                    document.getElementById("weather-info").style.display = "none";
                }
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function updateWeatherUI(data) {
    document.getElementById("location").innerText = `${data.location.name}, ${data.location.country}`;
    document.getElementById("temperature").innerText = `Temperature: ${Math.round(data.current.temp_c)}°C`;
    document.getElementById("humidity").innerText = `Humidity: ${data.current.humidity}%`;
    document.getElementById("wind").innerText = `Wind Speed: ${data.current.wind_kph} km/h`;
    document.getElementById("condition").innerText = `Condition: ${data.current.condition.text}`;
    document.getElementById("weather-icon").src = data.current.condition.icon;
    document.getElementById("weather-icon").alt = data.current.condition.text;
    document.getElementById("weather-info").style.display = "block";

    updateBackground(data.current.condition.text);
}

function updateBackground(condition) {
    const conditionLower = condition.toLowerCase();
    document.body.className =
        conditionLower.includes("clear") ? "sunny" :
        conditionLower.includes("cloud") ? "cloudy" :
        conditionLower.includes("rain") ? "rainy" :
        conditionLower.includes("storm") ? "stormy" :
        conditionLower.includes("snow") ? "snowy" :
        "default";
}

function toggleTemperatureUnit() {
    const tempElement = document.getElementById("temperature");
    if (!tempElement.innerText) return;

    let tempValue = parseInt(tempElement.innerText.match(/\d+/)[0]); // Extract number from text

    if (tempUnit === "C") {
        tempValue = Math.round(tempValue * 9/5 + 32);
        tempUnit = "F";
        document.getElementById("toggleTemp").innerText = "Convert to °C";
    } else {
        tempValue = Math.round((tempValue - 32) * 5/9);
        tempUnit = "C";
        document.getElementById("toggleTemp").innerText = "Convert to °F";
    }

    tempElement.innerText = `Temperature: ${tempValue}°${tempUnit}`;
}

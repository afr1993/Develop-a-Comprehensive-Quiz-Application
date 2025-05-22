const apiKey = '65677facdee2b6b5fdcde4d9bbe7facd'; // Replace with your OpenWeatherMap API key
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherOutput = document.getElementById('weatherOutput');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');

// Event Listener for button click
searchBtn.addEventListener('click', fetchWeather);

// Allow Enter key to trigger search
cityInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    fetchWeather();
  }
});

async function fetchWeather() {
  const city = cityInput.value.trim();
  weatherOutput.innerHTML = '';
  errorMessage.textContent = '';
  
  if (!city) {
    errorMessage.textContent = 'Please enter a city name.';
    return;
  }

  loadingIndicator.classList.remove('hidden');

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('City not found');
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    errorMessage.textContent = error.message;
  } finally {
    loadingIndicator.classList.add('hidden');
  }
}

function displayWeather(data) {
  const { name, main, weather } = data;
  const temperature = main.temp;
  const condition = weather[0].description;

  weatherOutput.innerHTML = `
    <h2>${name}</h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Condition: ${condition.charAt(0).toUpperCase() + condition.slice(1)}</p>
  `;
}

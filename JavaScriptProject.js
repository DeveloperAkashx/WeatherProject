const apiKey = 'ef804fc2cad1f7855188c81d9e70ef84'; // OpenWeather API key

document.getElementById('getWeather').addEventListener('click', () =>
{
    const city = document.getElementById('city').value;
    if (city) {
        getWeather(city);
        getForecast(city);
    } else {
        alert('Please enter a city name.');
    }
});

// Function to get the current date and time
function displayDateTime()
{
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = now.toLocaleDateString(undefined, options);
    const time = now.toLocaleTimeString();
    document.getElementById('datetime').innerHTML = `${date} - ${time}`;
}

// Call the function to set the date and time initially
displayDateTime();

// Update time every second
setInterval(displayDateTime, 1000);

function getWeather(city)
{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data =>
        {
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            const humidity = data.main.humidity;

            document.getElementById('weatherResult').innerHTML = `
                <h2>${data.name}</h2>
                <p>Temperature: ${temperature}°C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Description: ${weatherDescription}</p>
            `;
            setDynamicBackground(weatherDescription);
        })
        .catch(error =>
        {
            document.getElementById('weatherResult').innerHTML = `<p>${error.message}</p>`;
        });
}

function getForecast(city)
{
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response =>
        {
            if (!response.ok)
            {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => 
        {
            const forecastHTML = data.list
                .filter((item, index) => index % 8 === 0) // Get forecast for every 8th item (every 24 hours)
                .map(item => `
                    <tr>
                        <td>${new Date(item.dt * 1000).toLocaleDateString()}</td>
                        <td>${item.main.temp}°C</td>
                        <td>${item.main.humidity}%</td>
                        <td>
                            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
                            ${item.weather[0].description}
                        </td>
                    </tr>
                `)
                .join('');

            document.getElementById('forecastBody').innerHTML = forecastHTML;
        })
        .catch(error => 
        {
            document.getElementById('forecastBody').innerHTML = `<tr><td colspan="4">${error.message}</td></tr>`;
        });
}

function setDynamicBackground(weatherDescription) 
{
    const body = document.body;

    // Define a mapping of weather descriptions to image URLs
    const images = 
    {
        clear: 'clear.jpg',
        clouds: 'cloud.jpg',
        rain: 'rain.jpg',
        snow: 'snow.jpg',
        mist: 'mist.jpg',
        haze: 'mist.jpg',
    };

    // Find a matching image based on the weather description
    const imageKey = Object.keys(images).find(key => weatherDescription.includes(key)) || 'default';
    body.style.backgroundImage = `url('${images[imageKey] || 'images.jpg'}')`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
}

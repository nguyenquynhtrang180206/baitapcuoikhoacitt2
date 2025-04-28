const API_KEY = 'fcee8e3c23247c9931060785ee8fab70';
const city = 'Hanoi'; // Bạn có thể cho user chọn sau

async function fetchWeather() {
  try {
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=vi`);
    const weatherData = await weatherRes.json();

    // Update current weather info
    document.getElementById('city-name').textContent = weatherData.name;
    document.getElementById('temperature').textContent = `${Math.round(weatherData.main.temp)}°C`;
    document.getElementById('description').textContent = weatherData.weather[0].description;
    document.getElementById('feels-like').textContent = `Cảm giác như: ${Math.round(weatherData.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `Độ ẩm: ${weatherData.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Gió: ${weatherData.wind.speed} m/s`;
    document.getElementById('current-icon').src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

    updateCurrentTime();

    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=vi`);
    const forecastData = await forecastRes.json();

    const hourlyGrid = document.getElementById('hourly-grid');
    hourlyGrid.innerHTML = '';

    const now = new Date();
    const upcomingHours = forecastData.list.filter(item => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate > now;
    }).slice(0, 12);

    upcomingHours.forEach(hour => {
      const time = new Date(hour.dt * 1000);
      const hourEl = document.createElement('div');
      hourEl.className = 'forecast-hour';
      hourEl.innerHTML = `
        <div>${time.getHours()}:00</div>
        <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="icon">
        <div>${Math.round(hour.main.temp)}°C</div>
      `;
      hourlyGrid.appendChild(hourEl);
    });

  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Không thể lấy dữ liệu thời tiết. Vui lòng thử lại sau.');
  }
}

function updateCurrentTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('current-time').textContent = `Cập nhật lúc: ${timeString}`;
}

setInterval(updateCurrentTime, 60000);

// Start fetching data
fetchWeather();

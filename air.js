const apiKey = 'fcee8e3c23247c9931060785ee8fab70'; // API Key của bạn
const city = 'Hanoi'; // Thành phố mặc định

// Hàm lấy dữ liệu thời tiết
async function fetchWeatherData() {
  try {
    showLoading(true);

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=vi`;
    const response = await fetch(forecastUrl);

    if (!response.ok) throw new Error('Không thể kết nối tới API');

    const data = await response.json();

    if (data.cod !== "200") throw new Error(data.message);

    // Chỉ lấy bản ghi 12:00:00 mỗi ngày
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    renderDayCards(dailyData);

  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu thời tiết:', error);
    alert('Không thể lấy dữ liệu thời tiết! Hãy thử lại sau.');
  } finally {
    showLoading(false);
  }
}

// Hàm render các thẻ ngày
function renderDayCards(days) {
  const container = document.querySelector('.day-cards');
  container.innerHTML = '';

  days.forEach(day => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString('vi-VN', { weekday: 'long' });

    const card = document.createElement('div');
    card.className = 'day-card';
    card.style.animation = 'fadeIn 0.5s ease';

    card.innerHTML = `
      <div class="day">${dayName}</div>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
      <div class="temp">${Math.round(day.main.temp_max)}°C / ${Math.round(day.main.temp_min)}°C</div>
      <div class="rain">🌧️ ${day.pop !== undefined ? Math.round(day.pop * 100) : 0}%</div>
    `;

    card.addEventListener('click', () => showDetails(day));
    container.appendChild(card);
  });
}

// Hàm show chi tiết ngày khi click
function showDetails(day) {
  document.getElementById('detail-box').classList.remove('hidden');

  document.getElementById('detail-day').textContent = new Date(day.dt * 1000).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric'
  });

  document.getElementById('noon').textContent = `${Math.round((day.main.temp_max + day.main.temp_min) / 2)}°C`;
  document.getElementById('humidity').textContent = `${day.main.humidity}%`;
  document.getElementById('wind').textContent = `${Math.round(day.wind.speed)} km/h`;
  document.getElementById('feels').textContent = `${Math.round(day.main.feels_like)}°C`;
}

// Hàm đóng chi tiết
function closeDetails() {
  document.getElementById('detail-box').classList.add('hidden');
}

// Hàm hiển thị loading
function showLoading(state) {
  const loadingText = document.getElementById('loading-text');
  loadingText.innerHTML = state ? '🔄 Đang tải dữ liệu...' : '';
}

// Khi trang web load
window.onload = () => {
  fetchWeatherData();
  document.getElementById('close-detail').addEventListener('click', closeDetails);
};

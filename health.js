const apiKey = 'fcee8e3c23247c9931060785ee8fab70'; // API Key của bạn
const lat = '10.762622'; // Vĩ độ TP.HCM
const lon = '106.660172'; // Kinh độ TP.HCM

// Lấy dữ liệu thời tiết + AQI
async function getWeatherAndAQI() {
  try {
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=vi`);
    const weatherData = await weatherRes.json();

    const airRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const airData = await airRes.json();

    const temp = weatherData.main.temp;
    const weatherDesc = weatherData.weather[0].description;
    const weatherIcon = weatherData.weather[0].icon;
    const aqi = airData.list[0].main.aqi;

    updateHero(temp, weatherDesc, weatherIcon, aqi);
    updateActivities(temp, weatherDesc, aqi);

  } catch (error) {
    console.error('Lỗi lấy dữ liệu:', error);
  }
}

// Cập nhật Hero Section
function updateHero(temp, weatherDesc, weatherIcon, aqi) {
  const weatherInfo = document.getElementById('weather-info');
  weatherInfo.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Thời tiết">
    <p>${weatherDesc}, ${Math.round(temp)}°C</p>
    <p>Chỉ số AQI: ${aqi}</p>
  `;
}

// Cập nhật các hoạt động
function updateActivities(temp, weatherDesc, aqi) {
  const activities = document.querySelectorAll('.activity-card');

  activities.forEach((card) => {
    const title = card.querySelector('h3').innerText;

    if (title === 'Chạy bộ' || title === 'Đạp xe') {
      if (aqi > 2) {
        card.className = 'activity-card danger';
        card.querySelector('p').innerText = 'Chất lượng không khí xấu 😷';
      } else {
        card.className = 'activity-card good';
        card.querySelector('p').innerText = 'Phù hợp 😄';
      }
    } else if (title === 'Rửa xe') {
      if (weatherDesc.includes('mưa')) {
        card.className = 'activity-card danger';
        card.querySelector('p').innerText = 'Trời mưa, không nên rửa xe! ☔';
      } else {
        card.className = 'activity-card good';
        card.querySelector('p').innerText = 'Thời tiết phù hợp 👍';
      }
    } else if (title === 'Dã ngoại') {
      if (temp < 20 || temp > 35) {
        card.className = 'activity-card warning';
        card.querySelector('p').innerText = 'Nhiệt độ không lý tưởng 🌡️';
      } else {
        card.className = 'activity-card good';
        card.querySelector('p').innerText = 'Phù hợp cho dã ngoại 🏕️';
      }
    }
  });
}

// Khi trang web tải xong
document.addEventListener('DOMContentLoaded', getWeatherAndAQI);

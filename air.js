const apiKey = 'fcee8e3c23247c9931060785ee8fab70';
const city = 'Hanoi';

async function fetchAirQuality() {
  try {
    const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
    const geoData = await geoRes.json();

    if (!geoData.length) throw new Error('Không tìm thấy thành phố!');

    const { lat, lon } = geoData[0];

    const airRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const airData = await airRes.json();

    const aqi = airData.list[0].main.aqi;
    const components = airData.list[0].components;

    // Hiển thị AQI tổng thể
    document.getElementById('aqi-value').innerText = aqi;
    document.getElementById('aqi-description').innerText = describeAQI(aqi);
    document.getElementById('aqi-status').innerText = `Chất lượng không khí: ${describeAQI(aqi)}`;

    // Đổi màu nền banner
    const banner = document.getElementById('banner');
    banner.style.background = getAQIColor(aqi);

    // Hiển thị chi tiết thành phần ô nhiễm
    const pollutantTable = document.getElementById('pollutant-data');
    pollutantTable.innerHTML = `
      <tr><td data-tooltip="Bụi mịn PM2.5 - gây hại phổi">${components.pm2_5} µg/m³</td><td>PM2.5</td></tr>
      <tr><td data-tooltip="Bụi PM10 - gây kích ứng mũi, họng">${components.pm10} µg/m³</td><td>PM10</td></tr>
      <tr><td data-tooltip="Nitrogen Dioxide - gây viêm phổi">${components.no2} µg/m³</td><td>NO₂</td></tr>
      <tr><td data-tooltip="Carbon Monoxide - gây ngạt thở">${components.co} µg/m³</td><td>CO</td></tr>
    `;
    
  } catch (error) {
    console.error('Lỗi:', error);
    alert('Không thể tải dữ liệu chất lượng không khí!');
  }
}

// Mô tả AQI
function describeAQI(aqi) {
  switch (aqi) {
    case 1: return "Tốt";
    case 2: return "Trung bình";
    case 3: return "Không tốt cho người nhạy cảm";
    case 4: return "Xấu";
    case 5: return "Rất xấu";
    default: return "Không xác định";
  }
}

// Trả về màu nền theo mức AQI
function getAQIColor(aqi) {
  switch (aqi) {
    case 1: return 'linear-gradient(to right, #4ade80, #86efac)'; // Xanh
    case 2: return 'linear-gradient(to right, #fde047, #facc15)'; // Vàng
    case 3: return 'linear-gradient(to right, #fb923c, #f97316)'; // Cam
    case 4: return 'linear-gradient(to right, #f87171, #ef4444)'; // Đỏ
    case 5: return 'linear-gradient(to right, #9f1239, #be123c)'; // Đỏ đậm
    default: return 'linear-gradient(to right, #ccc, #eee)'; // Mặc định
  }
}

window.onload = fetchAirQuality;

const apiKey = 'fcee8e3c23247c9931060785ee8fab70';
const city = 'Hanoi';

async function fetchAirQuality() {
  try {
    // Lấy tọa độ
    const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
    const geoData = await geoRes.json();
    const { lat, lon } = geoData[0];

    // Lấy dữ liệu air pollution
    const airRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const airData = await airRes.json();
    const aqi = airData.list[0].main.aqi;
    const components = airData.list[0].components;

    // Hiển thị AQI tổng
    document.getElementById('aqi-value').innerText = aqi;
    document.getElementById('aqi-description').innerText = describeAQI(aqi);

    // Đổi màu banner theo AQI
    const banner = document.getElementById('banner');
    switch (aqi) {
      case 1: banner.style.background = 'linear-gradient(to right, #4ade80, #86efac)'; break; // Xanh
      case 2: banner.style.background = 'linear-gradient(to right, #fde047, #facc15)'; break; // Vàng
      case 3: banner.style.background = 'linear-gradient(to right, #fb923c, #f97316)'; break; // Cam
      case 4: banner.style.background = 'linear-gradient(to right, #f87171, #ef4444)'; break; // Đỏ
      case 5: banner.style.background = 'linear-gradient(to right, #9f1239, #be123c)'; break; // Đỏ đậm
    }

    // Load chi tiết chỉ số
    const pollutantTable = document.getElementById('pollutant-data');
    pollutantTable.innerHTML = `
      <tr><td data-tooltip="Bụi mịn PM2.5 - gây hại phổi">${components.pm2_5} µg/m³</td><td>PM2.5</td></tr>
      <tr><td data-tooltip="Bụi mịn PM10 - gây kích ứng mũi, họng">${components.pm10} µg/m³</td><td>PM10</td></tr>
      <tr><td data-tooltip="Nitrogen Dioxide - gây viêm phổi">${components.no2} µg/m³</td><td>NO₂</td></tr>
      <tr><td data-tooltip="Carbon Monoxide - gây ngạt thở">${components.co} µg/m³</td><td>CO</td></tr>
    `;
    
    document.getElementById('aqi-status').innerText = `Chất lượng hiện tại: ${describeAQI(aqi)}`;

  } catch (error) {
    console.error('Lỗi:', error);
  }
}

function describeAQI(aqi) {
  switch (aqi) {
    case 1: return "Tốt";
    case 2: return "Trung bình";
    case 3: return "Không tốt cho nhạy cảm";
    case 4: return "Xấu";
    case 5: return "Rất xấu";
    default: return "Không xác định";
  }
}

window.onload = fetchAirQuality;

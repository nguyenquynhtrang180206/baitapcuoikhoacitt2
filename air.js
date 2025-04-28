const API_KEY = '01fb6a697a4e270527c550f45e54a143';

// Lấy dữ liệu chất lượng không khí
async function getAirQualityData(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    const data = await response.json();
    return data;
}

// Lấy thông tin vị trí từ tên thành phố
async function getLocationFromCity(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    return {
        lat: data.coord.lat,
        lon: data.coord.lon,
        name: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        condition: data.weather[0].description
    };
}

// Cập nhật giao diện
function updateUI(airData, locationData) {
    const aqi = airData.list[0].main.aqi;
    const components = airData.list[0].components;

    document.getElementById('location-display').innerHTML = `<h2>${locationData.name}, ${locationData.country}</h2>`;
    document.getElementById('aqi-value').textContent = aqi;

    const table = document.querySelector('.details-table tbody');
    table.innerHTML = `
        <tr><th>Thông số</th><th>Giá trị</th><th>Mức độ</th></tr>
        <tr><td>PM2.5</td><td>${components.pm2_5} µg/m³</td><td>${levelPM25(components.pm2_5)}</td></tr>
        <tr><td>PM10</td><td>${components.pm10} µg/m³</td><td>${levelPM10(components.pm10)}</td></tr>
        <tr><td>NO₂</td><td>${components.no2} µg/m³</td><td>${levelNO2(components.no2)}</td></tr>
        <tr><td>O₃</td><td>${components.o3} µg/m³</td><td>${levelO3(components.o3)}</td></tr>
        <tr><td>SO₂</td><td>${components.so2} µg/m³</td><td>${levelSO2(components.so2)}</td></tr>
        <tr><td>CO</td><td>${components.co} mg/m³</td><td>${levelCO(components.co)}</td></tr>
    `;

    document.getElementById('temperature').textContent = locationData.temp.toFixed(1);
    document.getElementById('humidity').textContent = locationData.humidity;
    document.getElementById('wind-speed').textContent = locationData.wind;
    document.getElementById('weather-condition').textContent = locationData.condition;

    // Cập nhật mô tả mức độ ảnh hưởng + icon + màu
    const desc = document.getElementById('aqi-description-text');
    const container = document.querySelector('.aqi-container');
    container.className = 'aqi-container'; // reset class cũ

    switch (aqi) {
        case 1:
            desc.innerHTML = `<i class="fas fa-smile-beam"></i> Không khí tuyệt vời!`;
            desc.style.color = "#4CAF50";
            container.classList.add('good');
            break;
        case 2:
            desc.innerHTML = `<i class="fas fa-meh"></i> Chấp nhận được. Một số ô nhiễm nhẹ.`;
            desc.style.color = "black";
            container.classList.add('fair');
            break;
        case 3:
            desc.innerHTML = `<i class="fas fa-frown"></i> Không lành mạnh cho nhóm nhạy cảm.`;
            desc.style.color = "#FFC107";
            container.classList.add('moderate');
            break;
        case 4:
            desc.innerHTML = `<i class="fas fa-dizzy"></i> Không khí xấu. Nên hạn chế ra ngoài.`;
            desc.style.color = "#FF5722";
            container.classList.add('poor');
            break;
        case 5:
            desc.innerHTML = `<i class="fas fa-skull-crossbones"></i> Cảnh báo cực kỳ nguy hiểm!`;
            desc.style.color = "#9C27B0";
            container.classList.add('very-poor');
            break;
        default:
            desc.textContent = "Không xác định.";
            desc.style.color = "#333";
    }

    // Hiệu ứng fade-in
    desc.style.opacity = 0;
    setTimeout(() => {
        desc.style.opacity = 1;
    }, 100);
}

// Phân loại mức độ chi tiết
function levelPM25(value) {
    if (value <= 12) return 'Tốt';
    if (value <= 35.4) return 'Trung bình';
    if (value <= 55.4) return 'Không lành mạnh';
    if (value <= 150.4) return 'Rất không lành mạnh';
    return 'Nguy hiểm';
}

function levelPM10(value) {
    if (value <= 54) return 'Tốt';
    if (value <= 154) return 'Trung bình';
    if (value <= 254) return 'Không lành mạnh';
    if (value <= 354) return 'Rất không lành mạnh';
    return 'Nguy hiểm';
}

function levelNO2(value) {
    if (value <= 53) return 'Tốt';
    if (value <= 100) return 'Trung bình';
    if (value <= 360) return 'Không lành mạnh';
    if (value <= 649) return 'Rất không lành mạnh';
    return 'Nguy hiểm';
}

function levelO3(value) {
    if (value <= 54) return 'Tốt';
    if (value <= 124) return 'Trung bình';
    if (value <= 164) return 'Không lành mạnh';
    if (value <= 204) return 'Rất không lành mạnh';
    return 'Nguy hiểm';
}

function levelSO2(value) {
    if (value <= 35) return 'Tốt';
    if (value <= 75) return 'Trung bình';
    if (value <= 185) return 'Không lành mạnh';
    if (value <= 304) return 'Rất không lành mạnh';
    return 'Nguy hiểm';
}

function levelCO(value) {
    if (value <= 4.4) return 'Tốt';
    if (value <= 9.4) return 'Trung bình';
    if (value <= 12.4) return 'Không lành mạnh';
    if (value <= 15.4) return 'Rất không lành mạnh';
    return 'Nguy hiểm';
}

// Tự động lấy dữ liệu mặc định khi trang tải
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const locationData = await getLocationFromCity('Hanoi');
        const airData = await getAirQualityData(locationData.lat, locationData.lon);
        updateUI(airData, locationData);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
    }
});

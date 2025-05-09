
// Đặt API key 
const apiKey = 'fcee8e3c23247c9931060785ee8fab70'

// Hàm lấy thông tin thời tiết hiện tại
async function getCurrentWeather() {
    try {
        // Thay đổi thành vị trí (ví dụ: Hà Nội)
        const city = "Hanoi";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=vi&appid=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        // Cập nhật dữ liệu lên giao diện
        document.querySelector('.temperature').innerHTML = `${Math.round(data.main.temp)}°C`;
        document.querySelector('.description').innerHTML = data.weather[0].description;
        document.querySelector('.humidity').innerHTML = `Độ ẩm: ${data.main.humidity}%`;
        document.querySelector('.wind').innerHTML = `Gió: ${data.wind.speed} km/h`;
        document.querySelector('.feels-like').innerHTML = `Cảm giác như: ${Math.round(data.main.feels_like)}°C`;
        
        // Thay đổi icon
        updateWeatherIcon(data.weather[0].icon, '.current-weather .icon');
        
    } catch (error) {
        console.error("Lỗi lấy thời tiết hiện tại:", error);
    }
}

// Hàm lấy dự báo thời tiết theo giờ
async function getHourlyForecast() {
    try {
        // Dùng latitude và longitude của thành phố
        const lat = 21.0285;
        const lon = 105.8542;
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=vi&appid=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        const hourlyContainer = document.querySelector('.hourly');
        hourlyContainer.innerHTML = ''; // Xóa dữ liệu cũ

        // Lấy 12 giờ đầu tiên
        for (let i = 0; i < 12; i++) {
            const forecast = data.list[i];
            const time = new Date(forecast.dt * 1000).getHours(); // Giờ
            const temp = Math.round(forecast.main.temp); // Nhiệt độ
            const iconCode = forecast.weather[0].icon; // Icon thời tiết

            const hourElement = document.createElement('div');
            hourElement.classList.add('hour');
            hourElement.innerHTML = `
                <div class="time">${time}:00</div>
                <div class="icon"></div>
                <div class="temp">${temp}°C</div>
            `;

            // Gán icon cho mỗi giờ
            updateWeatherIcon(iconCode, hourElement.querySelector('.icon'));

            hourlyContainer.appendChild(hourElement);
        }

    } catch (error) {
        console.error("Lỗi lấy dự báo thời tiết:", error);
    }
}

// Hàm đổi icon thời tiết dựa trên mã icon của API
function updateWeatherIcon(iconCode, iconElement) {
    const iconMap = {
        "01d": "fas fa-sun",
        "01n": "fas fa-moon",
        "02d": "fas fa-cloud-sun",
        "02n": "fas fa-cloud-moon",
        "03d": "fas fa-cloud",
        "03n": "fas fa-cloud",
        "04d": "fas fa-cloud",
        "04n": "fas fa-cloud",
        "09d": "fas fa-cloud-showers-heavy",
        "09n": "fas fa-cloud-showers-heavy",
        "10d": "fas fa-cloud-rain",
        "10n": "fas fa-cloud-rain",
        "11d": "fas fa-bolt",
        "11n": "fas fa-bolt",
        "13d": "fas fa-snowflake",
        "13n": "fas fa-snowflake",
        "50d": "fas fa-smog",
        "50n": "fas fa-smog"
    };

    const iconClass = iconMap[iconCode] || "fas fa-question-circle";
    iconElement.innerHTML = `<i class="${iconClass}"></i>`;
}

// Hàm cập nhật đồng hồ thời gian thực
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    document.querySelector('h1').innerText = `Thời tiết hiện tại (${timeString})`;
}

// Gọi hàm khi trang được tải
document.addEventListener('DOMContentLoaded', function () {
    getCurrentWeather();
    getHourlyForecast();
    updateClock();
    setInterval(updateClock, 60000); // Cập nhật mỗi phút
});

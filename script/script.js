document.addEventListener('DOMContentLoaded', () => {
    const getWeather = async (city) => {
        const apiKey = "738f083ad01db14bdb81194bc7d940ae";
        if (!city) {
            alert("Введіть назву вашого міста!");
            return;
        }
        
        const cachedData = localStorage.getItem(city);
        if (cachedData) {
            console.log('Використовуеться кеш');
            return JSON.parse(cachedData);
        }
        
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=uk&units=metric&appid=${apiKey}`);
            
            if (!response.ok) {
                throw new Error('Перевірте назву вашного міста');
            }
            
            const data = await response.json();
            localStorage.setItem(city, JSON.stringify(data));
            return data;
        } catch (error) {
            console.error("Помилка", error.message);
            alert(error.message);
        }
    };
    
    const render = (dataList) => {
        if (!dataList || dataList.length === 0) {
            alert("Немає данних про погоду");
            return;
        }
        
        const weatherInfo = document.querySelector('.weatherInfo');
        weatherInfo.innerHTML = "";
        const cardCollection = document.createElement('div');
        cardCollection.classList.add('cardCollection');
        
        dataList.forEach(item => {
            const weatherElem = document.createElement('div');
            weatherElem.classList.add('cardWeather');
            
            const temp = item.main.temp;
            const feels = item.main.feels_like;
            const windSpeed = item.wind.speed;
            const icon = item.weather[0].icon;
            const description = item.weather[0].description;
            
            const date = new Date(item.dt_txt);
            const formattedDate = date.toLocaleString('uk-UA', {
                weekday: 'long', hour: '2-digit', minute: '2-digit'
            }).replace(/^./, match => match.toUpperCase());
            
            weatherElem.innerHTML = `
                <p>${formattedDate}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" title="${description}" />
                <p>Температура: ${temp}°C</p>
                <p>Відчуваеться  як: ${feels}°C</p>
                <p>Повітря: ${windSpeed} м/с</p>
            `;
            cardCollection.appendChild(weatherElem);
        });
        
        weatherInfo.appendChild(cardCollection);
    };

    const filterWeather = (data, daysAhead) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysAhead);
        const dateStr = targetDate.toISOString().split('T')[0];
        return data.list.filter(item => item.dt_txt.startsWith(dateStr));
    };

    const setupButton = (selector, daysAhead, title) => {
        document.querySelector(selector).addEventListener('click', async (event) => {
            event.preventDefault();
            const city = document.querySelector('.city').value.trim();
            const data = await getWeather(city);
            if (!data) return;
            
            const weatherInfo = document.querySelector('.weatherInfo');
            weatherInfo.innerHTML = `<div class='collectionName'>${title}</div>`;
            render(filterWeather(data, daysAhead));
        });
    };
    
    setupButton('.place', 0, 'Погода для вашого міста');
    setupButton('.weatherToday', 0, 'Погода на сьогодні');
    setupButton('.weathertomorrow', 1, 'Погода на завтра');
    setupButton('.weatherThree', 2, 'Погода на 3 дні');
    setupButton('.weatherWeek', 5, 'Погода на 5 днів');
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getWeather, render, filterWeather, setupButton };
}
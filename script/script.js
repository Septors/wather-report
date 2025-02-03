gdocument.addEventListener('DOMContentLoaded', () => {
    const getWeather = async function (city) {
        const key = "738f083ad01db14bdb81194bc7d940ae";
        

        const cachedData = localStorage.getItem(city);
        if (cachedData) {
            console.log('Використання кешу');
            return JSON.parse(cachedData);
        }
        
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=uk&units=metric&appid=${key}&_=${Date.now()}`);
            
            if (!response.ok) {
                throw new Error('Переіврь свое місто');
            }
            
            const data = await response.json();
            localStorage.setItem(city, JSON.stringify(data));
            return data;
        } catch (error) {
            console.error("Помилка", error.message);
        }
    };

    const render = function (mass) {
        const weatherInfo = document.querySelector('.weatherInfo');
        const cardCollection = document.createElement('div');
        cardCollection.classList.add('cardCollection');
        
        mass.forEach(element => {
            const weatherElem = document.createElement('div');
            weatherElem.classList.add('card');
            const temp = element.main.temp;
            const date = new Date(element.dt_txt);
            const winde = element.wind.speed;
            const icon = element.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
            const options = { 
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit'
            };
            let formattedDate = date.toLocaleDateString('uk-UA', options);
            formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
            const description = element.weather[0].description;
    
            const feels = element.main.feels_like;
            
            weatherElem.classList.add('cardWeather');
            weatherElem.innerHTML = `
                <p> ${formattedDate}</p>
                <img src="${iconUrl}" title="${description}" />
                <p>Температура : ${temp}°C</p>
                <p>Відчувается як: ${feels}°C</p>
                <p>Повітря: ${winde} м/с</p>
            `;
            cardCollection.appendChild(weatherElem);
        });

        weatherInfo.appendChild(cardCollection);
    };

    const todayWeather = function (data) {
        const date = new Date().toISOString().split('T')[0];
        const today = data.list.filter(item => item.dt_txt.startsWith(date));
        render(today);
    };

    const weatherTommoriw = function (data) {
        const todayDate = new Date();
        todayDate.setDate(todayDate.getDate() + 1);
        const date = todayDate.toISOString().split('T')[0];
        const tomorrow = data.list.filter(item => item.dt_txt.startsWith(date));
        render(tomorrow);
    };

    const threeDay = function (data) {
        const todayDate = new Date();
        todayDate.setDate(todayDate.getDate() + 2);
        const date = todayDate.toISOString().split("T")[0];
        const threeDaysWeather = data.list.filter(item => item.dt_txt.startsWith(date));
        render(threeDaysWeather);
    };

    const middle = function (data) {
        const middleWeather = data.list.filter(item => 
            item.dt_txt.endsWith("09:00:00") || 
            item.dt_txt.endsWith("15:00:00") || 
            item.dt_txt.endsWith("21:00:00")
        );
        render(middleWeather);
    };

    document.querySelector('.place').addEventListener('click', async (event) => {
        event.preventDefault();
        const city = document.querySelector('.city').value;
        const data = await getWeather(city);
        const weatherInfo = document.querySelector('.weatherInfo');
        weatherInfo.innerHTML = "";
        const title = document.createElement('div');
        title.classList.add('collectionName');
        title.textContent = 'Погода для вашего міста';
        weatherInfo.appendChild(title);
        render(data.list);
    });

    document.querySelector('.weatherToday').addEventListener('click', async (event) => {
        event.preventDefault();
        const city = document.querySelector('.city').value;
        const data = await getWeather(city);
        const weatherInfo = document.querySelector('.weatherInfo');
        weatherInfo.innerHTML = "";
        const title = document.createElement('div');
        title.classList.add('collectionName');
        title.textContent = 'Погода на сьогодні';
        weatherInfo.appendChild(title);
        todayWeather(data);
    });

    document.querySelector('.weathertomorrow').addEventListener('click', async (event) => {
        event.preventDefault();
        const city = document.querySelector('.city').value;
        const data = await getWeather(city);
        const weatherInfo = document.querySelector('.weatherInfo');
        weatherInfo.innerHTML = "";
        const title = document.createElement('div');
        title.classList.add('collectionName');
        title.textContent = 'Погода на завтра';
        weatherInfo.appendChild(title);
        weatherTommoriw(data);
    });

    document.querySelector('.weatherThree').addEventListener('click', async (event) => {
        event.preventDefault();
        const city = document.querySelector('.city').value;
        const data = await getWeather(city);
        const weatherInfo = document.querySelector('.weatherInfo');
        weatherInfo.innerHTML = "";
        const title = document.createElement('div');
        title.classList.add('collectionName');
        title.textContent = 'Погода на 3 дні';
        weatherInfo.appendChild(title);
        threeDay(data);
    });

    document.querySelector('.weatherWeek').addEventListener('click', async (event) => {
        event.preventDefault();
        const city = document.querySelector('.city').value;
        const data = await getWeather(city);
        const weatherInfo = document.querySelector('.weatherInfo');
        weatherInfo.innerHTML = "";
        const title = document.createElement('div');
        title.classList.add('collectionName');
        title.textContent = 'Погода на пять днів';
        weatherInfo.appendChild(title);
        middle(data);
    });
});
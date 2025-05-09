import "./style.css";


console.log('test');

(function (){
    const weatherData = document.getElementById('weather-data');
    const resultDiv = document.getElementById('result');
    resultDiv.classList.add('result-div');
    const submitBtn = document.getElementById('submit-city');

    let firstSection = document.createElement('div'); // this organizes the current city and weather description so that is separated from the day-by-day weather forecast
    firstSection.classList.add('first-section');
    // this is a div to organize the days below the main text weather description
    let secondSection = document.createElement('div');
    secondSection.classList.add('second-section');

    submitBtn.addEventListener('click', () => { //refreshes and searches for new data
        resultDiv.textContent = '';
        firstSection.textContent = '';
        secondSection.textContent = '';
        receiveData();
    });

    async function receiveData(content) {
        content = weatherData.value;
        if (content === '') {
            content = 'riodejaneiro'
        }

        // this section fetches data from the API
        // it fetches data from the current day up to the 5 next days
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${content}/next5days?unitGroup=metric&key=HWSEF7KS97GJ47ABSK7P2AN6B`)
        const apiData = await response.json();

        // display city description
        const addressCompleteName = document.createElement('div');
        addressCompleteName.textContent = apiData.resolvedAddress;
        firstSection.appendChild(addressCompleteName);

        const description = document.createElement('div');
        description.textContent = apiData.description || apiData.days[0].description || 'No description available';
        firstSection.appendChild(description);

        resultDiv.appendChild(firstSection);// append both
        resultDiv.appendChild(secondSection);

        // add all of address' info:
        function displayWeatherForecast(day) {
        
            const eachDayDiv = document.createElement('div'); // this is just for styling
        
            const currentDate = document.createElement('div');
            //convert 'datetime' into a date object like '2025-01-01'
            const dateObj = new Date(apiData.days[day].datetime);
            console.log(dateObj);
            // get weekday name (e.g., "Thursday")   
            const weekdayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

            currentDate.textContent = weekdayName;
            eachDayDiv.appendChild(currentDate);

            // weather forecast icon appending
            const iconName = apiData.days[day].icon;
            const iconPath = require(`./weather-icons/${iconName}.png`);// icon path

            let iconImg = document.createElement('img');
            iconImg.classList.add('weather-icon');
            iconImg.src = iconPath; // difficult asf
            iconImg.alt = iconName; // alt name
            eachDayDiv.appendChild(iconImg); // append this shit

            const currentTemperatureDiv = document.createElement('div');
            currentTemperatureDiv.textContent = `${apiData.days[day].temp}°C`;
            eachDayDiv.appendChild(currentTemperatureDiv);

            secondSection.appendChild(eachDayDiv);
            }

        //displays results for the next 5 days
        for(let i = 0; i <= 5; i++) {
            displayWeatherForecast(i);
        }

        console.log(resultDiv.textContent);
    }

    receiveData().catch(e => { //this handles errors
        console.log(e);
    });

})();
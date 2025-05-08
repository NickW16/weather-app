import "./style.css";

console.log('test');

(function (){
    const weatherData = document.getElementById('weather-data');
    const resultDiv = document.getElementById('result');
    const submitBtn = document.getElementById('submit-city');

    submitBtn.addEventListener('click', () => {
        resultDiv.textContent = '';
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
        resultDiv.appendChild(addressCompleteName);

        const description = document.createElement('div');
        description.textContent = apiData.description || apiData.days[0].description || 'No description available';
        resultDiv.appendChild(description);

        // add all of address' info:
        function displayWeatherForecast(day) {
        
        const currentDate = document.createElement('div');
        //convert 'datetime' into a date object like '2025-01-01'
        const dateObj = new Date(apiData.days[day].datetime);
        console.log(dateObj);
        // get weekday name (e.g., "Thursday")   
        const weekdayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        currentDate.textContent = weekdayName;
        resultDiv.appendChild(currentDate);

        const currentTemperatureDiv = document.createElement('div');
        currentTemperatureDiv.textContent = `${apiData.days[day].temp}°C`;
        resultDiv.appendChild(currentTemperatureDiv);
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
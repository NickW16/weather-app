import "./style.css";


console.log('test');

(function (){
    const inputData = document.getElementById('input-data'); // this is the input div
    const resultDiv = document.getElementById('result');
    resultDiv.classList.add('result-div');
    const submitBtn = document.getElementById('submit-city');
    const errorMessage = document.getElementById('error');

    const loadingScreen = document.getElementById('loading');
    loadingScreen.style.display = 'block'; // show loading

    // this displays the current weather information
    let currentWeatherDiv = document.createElement('div');
    currentWeatherDiv.id = 'current-weather';

    let firstSection = document.createElement('div'); // this organizes the current city and weather description so that is separated from the day-by-day weather forecast
    firstSection.classList.add('first-section');
    // this is a div to organize the days below the main text weather description
    let secondSection = document.createElement('div');
    secondSection.classList.add('second-section');

    let thirdSection = document.createElement('div');
    thirdSection.classList.add('third-section');

    submitBtn.addEventListener('click', () => { //refreshes and searches for new data
        loadingScreen.style.display = 'block'; // for showing load screen when the user presses the button 
        resultDiv.textContent = '';
        currentWeatherDiv.textContent = '';
        firstSection.textContent = '';
        secondSection.textContent = '';
        thirdSection.textContent = '';
        errorMessage.style.display = 'none';
        receiveData();
    });

    async function receiveData(content) {
        content = inputData.value;
        if (content === '') {
            content = 'riodejaneiro'
        }

        // this section fetches data from the API
        // it fetches data from the current day up to the 5 next days
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${content}/next6days?unitGroup=metric&include=current&key=HWSEF7KS97GJ47ABSK7P2AN6B`)
        
        if (!response.ok) {
            errorMessage.textContent = 'Error, could not find weather data for given city. Try again';
            errorMessage.style.display = 'block';
        }

        const apiData = await response.json();
        loadingScreen.style.display = 'none';

        // this section gets the current weather condition and appends all to a div
        const currentWeather = document.createElement('div');

        const currentDatetimeDiv = document.createElement('div');
        currentDatetimeDiv.textContent = `Most recent condition at ${apiData.currentConditions.datetime}Hrs:`;
        currentWeather.appendChild(currentDatetimeDiv);

        //this is for better css styling
        const divIconAndTemp = document.createElement('div');
        divIconAndTemp.id = 'current-icon-and-temp';

        let currentIcon = document.createElement('img');
        const currentIconPath = require(`./weather-icons/${apiData.currentConditions.icon}.png`);
        currentIcon.src = currentIconPath;
        currentIcon.classList.add('all-weather-icons');
        divIconAndTemp.appendChild(currentIcon); // append

        const currentTemp = document.createElement('div');
        currentTemp.textContent = `${apiData.currentConditions.temp}°C`;

        // this changes colors based on the temperature
        if ((apiData.currentConditions.temp) >= 25) {
            currentTemp.classList.add('hot-temp');
        } else {
            currentTemp.classList.add('cold-temp');
        }

        currentTemp.id = 'current-temperature';
        divIconAndTemp.appendChild(currentTemp); // append
        currentWeather.appendChild(divIconAndTemp);

        const currentConditionsDiv = document.createElement('div');
        currentConditionsDiv.textContent = apiData.currentConditions.conditions;
        currentConditionsDiv.id = 'current-conditions';
        currentWeather.appendChild(currentConditionsDiv);

        currentWeatherDiv.appendChild(currentWeather); //append to the main div on the top


        // display city description
        const addressCompleteName = document.createElement('div');
        addressCompleteName.textContent = apiData.resolvedAddress;
        firstSection.appendChild(addressCompleteName);

        const description = document.createElement('div');
        description.textContent = apiData.description || apiData.days[0].description || 'No description available';
        firstSection.appendChild(description);

        resultDiv.appendChild(currentWeatherDiv);
        currentWeatherDiv.appendChild(firstSection);// append to current weather
        resultDiv.appendChild(secondSection);
        resultDiv.appendChild(thirdSection);

        // this functions creates the first day-by-day weather info
        // add all of address' info:
        function displayWeatherForecast(day) {        

            const eachDayDiv = document.createElement('div'); // this is just for styling
            eachDayDiv.classList.add('each-day-div');


            const currentDate = document.createElement('div');
            //convert 'datetime' into a date object like '2025-01-01'
            const dateObj = new Date(apiData.days[day+1].datetime); // "+1" is for the api to not be stupid and prove the yesterday's weather data
            console.log(dateObj);
            // get weekday name (e.g., "Thursday")   
            const weekdayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

            currentDate.textContent = weekdayName;
            currentDate.classList.add('each-weekday-forecast'); // styling points
            eachDayDiv.appendChild(currentDate);

            // weather forecast icon appending
            const iconName = apiData.days[day].icon;
            const iconPath = require(`./weather-icons/${iconName}.png`);// icon path

            let iconImg = document.createElement('img');
            iconImg.classList.add('all-weather-icons');
            iconImg.classList.add('weather-icon');
            iconImg.classList.add('second-section-icon');
            iconImg.src = iconPath; // difficult asf
            iconImg.alt = iconName; // alt name
            eachDayDiv.appendChild(iconImg); // append this shit

            const maxTemperatureDiv = document.createElement('div');
            maxTemperatureDiv.classList.add('max-temp');
            maxTemperatureDiv.textContent = `${apiData.days[day].tempmax}°C`;
            eachDayDiv.appendChild(maxTemperatureDiv);

            const minTemperatureDiv = document.createElement('div');
            minTemperatureDiv.classList.add('min-temp');
            minTemperatureDiv.textContent = `${apiData.days[day].tempmin}°C`;
            eachDayDiv.appendChild(minTemperatureDiv);

            secondSection.appendChild(eachDayDiv);
        }

        //displays results for the next 5 days
        for(let i = 0; i <= 5; i++) {
            displayWeatherForecast(i);
        }

        console.log(resultDiv.textContent);

        // this is basically a copy of the other function, but with conditions
        function displayEachDayConditions (day) {

            // main container
            const conditionsDiv = document.createElement('div');
            conditionsDiv.classList.add('conditions-div');

            // this is for styling in flex
            const conditionsDivOne = document.createElement('div');
            conditionsDivOne.classList.add('conditions-part-one');
            conditionsDiv.appendChild(conditionsDivOne);

            //this one too
            const conditionsDivTwo = document.createElement('div');
            conditionsDivTwo.classList.add('conditions-part-two');

            const currentDate = document.createElement('div');
            //convert 'datetime' into a date object like '2025-01-01'
            const dateObj = new Date(apiData.days[day+1].datetime); // "+1" is for the api to not be stupid and prove the yesterday's weather data
            // get weekday name (e.g., "Thursday")   
            const weekdayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

            currentDate.textContent = weekdayName;
            currentDate.classList.add('conditions-each-date'); // styling points
            conditionsDivOne.appendChild(currentDate);

            const iconName = apiData.days[day].icon;
            const iconPath = require(`./weather-icons/${iconName}.png`);// icon path

            let iconImg = document.createElement('img');
            iconImg.classList.add('all-weather-icons');
            iconImg.classList.add('weather-icon');
            iconImg.src = iconPath; // difficult asf
            iconImg.alt = iconName; // alt name
            conditionsDivOne.appendChild(iconImg); // append this shit

            const averageTemp = document.createElement('div');
            averageTemp.classList.add('average-temp');
            averageTemp.textContent = `${apiData.days[day].temp}°C`;
            conditionsDivOne.appendChild(averageTemp);

            const dayCondition = document.createElement('div');
            dayCondition.classList.add('conditions-description');
            dayCondition.textContent = `${apiData.days[day].description}`;
            conditionsDiv.appendChild(dayCondition);

            const rainTitle = document.createElement('div');
            rainTitle.textContent = 'Precip:';
            conditionsDivTwo.appendChild(rainTitle);

            // gambiarra pra colocar uma gota d'água
            let waterDrop = document.createElement('img');
            const waterPath = require('./weather-icons/water-outline.png');
            waterDrop.classList.add('all-weather-icons');
            waterDrop.classList.add('water-drop');
            waterDrop.src = waterPath;
            conditionsDivTwo.appendChild(waterDrop);

            const precipitation = document.createElement('div');
            precipitation.textContent = `${apiData.days[day].precipprob}%`;
            precipitation.classList.add('precipitation');
            conditionsDivTwo.appendChild(precipitation);
            

            // this is appended later for styling reasons
            conditionsDiv.appendChild(conditionsDivTwo);

            thirdSection.appendChild(conditionsDiv);

            }

        for(let y = 0; y <= 5; y++) {
            displayEachDayConditions(y);
        }
    }


    // apparently, this calls the function so i cannot remove it
    // it does not handle the error, but if it goes out, it breaks
    // the code
     receiveData().catch(e => { //this handles errors
         console.log(e);
     });

})();


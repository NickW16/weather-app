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
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${content}?unitGroup=metric&key=HWSEF7KS97GJ47ABSK7P2AN6B`)
        const apiData = await response.json();

        // add all of address' info:
        const addressCompleteName = document.createElement('div');
        addressCompleteName.textContent = apiData.resolvedAddress;
        resultDiv.appendChild(addressCompleteName);

        const description = document.createElement('div');
        description.textContent = apiData.description;
        resultDiv.appendChild(description);

        const currentDate = document.createElement('div');
        currentDate.textContent = apiData.days[0].datetime;
        resultDiv.appendChild(currentDate);

        const currentTemperature = document.createElement('div');
        currentTemperature.textContent = `Current Temperature: ${apiData.days[0].temp}°C`;
        resultDiv.appendChild(currentTemperature);

        console.log(resultDiv.textContent);
    }

    receiveData().catch(e => { //this handles errors
        console.log(e);
    });

})();
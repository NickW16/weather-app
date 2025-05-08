import "./style.css";

console.log('test');

const weatherData = document.getElementById('weather-data');
const resultDiv = document.getElementById('result');

async function receiveData(content) {
    content = weatherData.value;
    if (content === '') {
        content = 'riodejaneiro'
    }

    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${content}?key=HWSEF7KS97GJ47ABSK7P2AN6B`, {mode: 'cors'})
    const apiData = await response.json();
    resultDiv.textContent = apiData.resolvedAddress;

    console.log(resultDiv.textContent);
}

receiveData().catch(e => {
    console.log(e);
});

receiveData();
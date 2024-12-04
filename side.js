
const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const renderCountry = function (data, className = "") {
    let currency;
    let lang;

    // For Dynamic Currencies
    if (data.currencies) {
        for (let currencyCode in data.currencies) {
             currency = data.currencies[currencyCode];
        }
    } else {
        console.log("No currency information available.");
    }
    
    // For Dynamic languages
    if (data.languages) {
        for (let countryLanguages in data.languages) {
            lang = data.languages[countryLanguages];
        }
    } else {
        console.log("No currency information available.");
    }
    
    // Html rendring code
    const html = `<article class="country ${className}">
  <img class="country__img" src="${data.flags.png}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region
        }</h4>
    <p class="country__row"><span>👫</span>${
            data.population } People's</p>
    <p class="country__row"><span>🗣️</span>${lang}</p>
    <p class="country__row"><span>💰</span>${currency.name} (${currency.symbol})</p>
  </div>
</article>`

    countriesContainer.insertAdjacentHTML("afterbegin", html)
    countriesContainer.style.opacity = 1;

}

async function whereIAm(country) {
    let countries = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    let getCountries = await countries.json();
    console.log(getCountries);
    
    renderCountry(getCountries[0]);

    if (getCountries[0].borders && getCountries[0].borders.length > 0) {
        let borderCountries = getCountries[0].borders;

        // Fetch data for each neighbor country
        for (let i = 0; i < borderCountries.length; i++) {
            let neighbourCode = borderCountries[i];

            // Fetch neighbor country data
            let getNeighbourCountries = await fetch(`https://restcountries.com/v3.1/alpha/${neighbourCode}`);

            let neighbourData = await getNeighbourCountries.json();

            // Render the neighbor country data
            renderCountry(neighbourData[0], "neighbour");
        }
    } else {
        console.log('This country has no borders.');
    }
}

console.log(whereIAm('India'));

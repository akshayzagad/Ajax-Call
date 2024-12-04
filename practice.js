"use strict";

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

   // Html rendaring code
   const html = `<article class="country ${className}">
  <img class="country__img" src="${data.flags.png}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region
      }</h4>
    <p class="country__row"><span>👫</span>${data.population} People's</p>
    <p class="country__row"><span>🗣️</span>${lang}</p>
    <p class="country__row"><span>💰</span>${currency.name} (${currency.symbol})</p>
  </div>
</article>`

   countriesContainer.insertAdjacentHTML("afterbegin", html)
   countriesContainer.style.opacity = 1;
}


let getGeoLocation = function () {
   return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(
         position => resolve(position), err => reject(err)
      );
   })

}

let getCountries = async function () {

   try {
      let getGeoLocationCords = await getGeoLocation();
      let { latitude: lat, longitude: lag } = getGeoLocationCords.coords;
      console.log(lat, lag);

      /*Reverse geocoding*/
      let revGeoCoding = await fetch(`https://geocode.xyz/${lat},${lag}?geoit=json`);
      console.log(revGeoCoding);
      let dataGeoCoding = await revGeoCoding.json();

      // if (revGeoCoding.redirected == false) throw new Error('Problem getting revGeoCoding location data');

      /*countries*/
      let countries = await fetch(`https://restcountries.com/v3.1/name/${dataGeoCoding.country}`);
      let getCountries = await countries.json();
      renderCountry(getCountries[0]);
      
      // if (!countries.ok) throw new Error('Problem getting countries data');

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

            if (!countries.ok) throw new Error('Problem getting neighbours countries data');
         }
      } else {
         console.log('This country has no borders.');
      }

      /*Return Statement*/
      return `You are in ${dataGeoCoding.city}, ${dataGeoCoding.country}`;
   } catch (err) {
      console.error(`${err} 💥`);
      renderError(`💥 ${err.message}`);

      /*Reject promise returned from async function*/
      throw err;
   }
}

btn.addEventListener('click', function () {
   getCountries();
});

// console.log('1: Will get location');
/*
Without Using async and wait 
getCountries().then(message => console.log(message)).catch(err => `2: ${err.message}`).finally(() => console.log('3: Finished getting location'));*/

/* Using async and wait */
(async function(){
try {
   let returnData =await getCountries();
   console.log(`2: ${returnData}`);
} catch (error) {
   console.error(`2: ${err.message} 💥`);
   } console.log('3: Finished getting location');
}());


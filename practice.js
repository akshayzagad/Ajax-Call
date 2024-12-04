"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");


const whereIAm = function (lang,long) {
  fetch(`https://geocode.xyz/${lang},${long}?geoit=json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Country Not found");
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);
      let countries = data.country;
      console.log(countries);
      return countries;
    }).catch(err => console.error(`${err}`))
};

console.log(whereIAm(52.568, 13.661));

// whereIAm(19.037, 72.873);
// whereIAm(-33.983, 18.884);
// TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
// TEST COORDINATES 2: 19.037, 72.873
// TEST COORDINATES 2: -33.933, 18.474

const renderCountry = function (data, className = "") {
   const html = `<article class="country ${className}">
  <img class="country__img" src="${data.flags.png}" />
  <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region
      }</h4>
    <p class="country__row"><span>👫</span>${(
         +data.population / 1000000
      ).toFixed(1)}</p>
    <p class="country__row"><span>🗣️</span>${data.languages}</p>
    <p class="country__row"><span>💰</span>${data.currencies}</p>
  </div>
</article>`

   countriesContainer.insertAdjacentHTML("afterend", html)
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
      console.log(getCountries);
      let neighbours = getCountries[0].borders[0];
      if (!countries.ok) throw new Error('Problem getting countries data');

      /*neighbours countries*/
      let getNeighbourCountries = await fetch(`https://restcountries.com/v3.1/alpha/${neighbours}`);
      let neighbourData = await getNeighbourCountries.json();
      renderCountry(neighbourData[0], "neighbour");
      if (!countries.ok) throw new Error('Problem getting neighbours countries data');

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

console.log('1: Will get location');
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


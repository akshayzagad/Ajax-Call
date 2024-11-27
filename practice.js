"use strict";

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

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

// getGeoLocation().then(position => console.log(position));

let getCountries = function () {
   getGeoLocation().then(position => { const { latitude: lang, longitude: long } = position.coords; return fetch(`https://geocode.xyz/${lang},${long}?geoit=json`) }).then(response => {
      if(!response.ok){throw new Error(`problem with geocoding ${response.status}`);
      }
      return response.json()
   }).then(data => {
      return fetch(`https://restcountries.com/v3.1/name/${data.country}`)
   }).catch(err => console.error(`${err.message} True`))
   .then(res => {
      if (!res.ok) {
         throw new Error(`Could not find flag ${res.status}`);
      }
      return res.json()
   }).then(data => {
      renderCountry(data[0]); const neighbours = data[0].borders[0]; console.log(neighbours);
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbours}`)
   }).catch(err => console.error(`${err.message} True`))
   .then(resp => {
      return resp.json();
   }).then(data => {
      renderCountry(data[0], "neighbour");
   })
}



btn.addEventListener('click', function () {
   getCountries();
});


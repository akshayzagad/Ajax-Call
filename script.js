'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError =function (msg){
  countriesContainer.insertAdjacentText('beforeend', msg);
}

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
}

// function getCountries(country) {
//   const request = new XMLHttpRequest();
//   /** First ajax call */
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();
//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     renderCountry(data);

//     /** second ajax call */

//     const neighbours = data.borders;
//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbours[0]}`);
//     request2.send();
//     request2.addEventListener('load', function () {
//       const [data2] = JSON.parse(this.responseText);
//       console.log(data2);
//       renderCountry(data2, 'neighbour');
//     });



//   });
// }



//  getCountries('usa');

// const getCountriesAndNeighbours = function (country){
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//   .then(function(response){
//     console.log(response);
//    return response.json();
//   }).then(function(data){
//     console.log(data);
//     renderCountry(data[0]);
//   });
// }

const getCountriesAndNeighbours = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Country Not found"); 
      }  
      return response.json();
    })
    .then(data =>{renderCountry(data[0]);
      // const neighbours = data[0].borders[1];
      // console.log(neighbours);
      const neighbours = '000';
      if (!neighbours) {
        return
      };
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbours}`) 
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Neighbour Country Not found"); 
      }  
      return response.json();
    })
    .then(data2 =>{
      console.log(data2);
      renderCountry(data2[0], "neighbour") 
    }  
    )
    .catch(err => {
      // console.error(`${err} this is error created by Akshay Is it`);
      renderError(`${err.message} this is error created by Akshay`)
    })
    .finally(()=> {
      countriesContainer.style.opacity = 1;
    })
};

btn.addEventListener('click', function () {
  getCountriesAndNeighbours('India');
});

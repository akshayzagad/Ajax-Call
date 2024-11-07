'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError =function (msg){
  countriesContainer.insertAdjacentText('beforeend', msg);
}

const getJson = function (url ,message = '') {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(message); 
      }  
      return response.json();
    })
}

const whereIAm = function (lang,long) {
  // fetch(`https://geocode.xyz/${lang},${long}?geoit=json`)
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Country Not found");
  //     }
  //     return response.json();
  //   })
  //   .then(function (data) {
  //     console.log(data);
  //     console.log(`You are in ${data.city}, ${data.country}`);
  //   }).catch(err => console.error(`${err}`))
  return getJson(`https://geocode.xyz/${lang},${long}?geoit=json`,'location not found')
  .then(function (data) {
        console.log(data);
        console.log(`You are in ${data.city}, ${data.country}`);
        let countries = data.country;
        console.log(countries);
        
        return countries;
        
  });
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
 /* fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Country Not found"); 
      }  
      return response.json();
    })*/
   getJson(`https://restcountries.com/v3.1/name/${country}` , 'Country not found')
    .then(data =>{renderCountry(data[0]);
      const neighbours = data[0].borders[1];
      console.log(neighbours);
      
      if (!neighbours || neighbours.length === 0) {
        throw new Error('No neighbour found!');
      }
      // Let's take the first neighbour const neighbour = neighbours[0];

      return getJson(`https://restcountries.com/v3.1/alpha/${neighbours}` , 'Neighbour Country Not found')})
    .then(data =>{renderCountry(data[0], "neighbour");
    })
    /**
     * .then(data2 =>{
       console.log(data2);
       renderCountry(data2[0], "neighbour") 
    }  
    ) 
    */
    .catch(err => {
      console.error(`${err}`);
      renderError(`${err.message} this is error created by Akshay`)
    })
    .finally(()=> {
      countriesContainer.style.opacity = 1;
    })
    };

btn.addEventListener('click', function () {
  getCountriesAndNeighbours();
  // getCountriesAndNeighbours('australia');
  
});

console.log(whereIAm(19.037, 72.873));


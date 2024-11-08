'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
}

const getJson = function (url, message = '') {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(message);
      }
      return response.json();
    })
}

const whereIAm = async function (lat, long) {
  try {
    const res = await getJson(`https://geocode.xyz/${lat},${long}?geoit=json`, 'location not found');
    console.log(res);
    console.log(`You are in ${res.city}, ${res.country}`);
    let countries = res.country;
    console.log(countries);

    return countries;
  } catch (err) {
    console.error(`${err}`);
    renderError("Location not found");
  }
}

const renderCountry = function (data, className = "") {
  const html = `<article class="country ${className}">
  <img class="country__img" src="${data.flags.png}" />
  <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}</p>
    <p class="country__row"><span>🗣️</span>${data.languages}</p>
    <p class="country__row"><span>💰</span>${data.currencies}</p>
  </div>
</article>`;

  countriesContainer.insertAdjacentHTML("afterend", html);
}

const getCountriesAndNeighbours = function (country) {
  getJson(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      const neighbours = data[0].borders[1];
      console.log(neighbours);

      if (!neighbours || neighbours.length === 0) {
        throw new Error('No neighbour found!');
      }

      return getJson(`https://restcountries.com/v3.1/alpha/${neighbours}`, 'Neighbour Country Not found')
    })
    .then(data => {
      renderCountry(data[0], "neighbour");
    })
    .catch(err => {
      console.error(`${err}`);
      renderError(`${err.message} this is error created by Akshay`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', async function () {
  // Use async/await to wait for the result of whereIAm
  const country = await whereIAm(-33.933, 18.474);
  if (country) {
    getCountriesAndNeighbours(country);
  } else {
    renderError("Could not determine country from location.");
  }
});

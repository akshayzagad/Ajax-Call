

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const whereIAm = function (lang, long) {
    fetch(`https://geocode.xyz/${lang},${long}?geoit=json`)
        .then(response =>

            //  console.log(response);
            response.json()

        )
        .then(function (data) {
            //  console.log(data);

            return data;
            // console.log(data);
            //  console.log(`You are in ${data.city}, ${data.country}`);

            // console.log(` ${data.country}`);
            // let countries = data.country;
            //  return data.country;
            // console.log(countries);
            // return countries;
        }).catch(err => console.error(`${err}`))
};




// whereIAm(19.037, 72.873);
// whereIAm(-33.983, 18.884);
// TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
// TEST COORDINATES 2: 19.037, 72.873
// TEST COORDINATES 2: -33.933, 18.474
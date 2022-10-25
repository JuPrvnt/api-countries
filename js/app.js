// je déclare mes variables
let allCountries = [];
let finalTab = [];

const container = document.getElementsByClassName("container");
const listCountries = document.querySelector(".list-countries");
const loading = document.querySelector(".loader");

// je connecte le site à l'API avec tous les pays
function fetchCountries() {
  fetch("https://restcountries.com/v3.1/all")
    .then((res) => {
      if (res.ok) {
        return res.json();
      }

      throw new Error(res.statusText);
    })
    .then((valueDouble) => {
      let value = Array.from(new Set(valueDouble));

      //console.log(value);

      value.forEach((country) => {
        //console.log(country);
        fetchCountryFull(country);
      });
    });
}
fetchCountries();

// je créé la fonction pour chaque pays
function fetchCountryFull(country) {
  let objCountryFull = {};
  let id = country.name.common;

  fetch(`https://restcountries.com/v3.1/name/${id}`)
    .then((res) => res.json())

    .then((countryData) => {
      //console.log(countryData);
      objCountryFull.name = countryData[0].name.common;
      objCountryFull.capital = countryData[0].capital;
      objCountryFull.language = countryData[0].languages;
      objCountryFull.flag = countryData[0].flags.png;

      allCountries.push(objCountryFull);

      if (allCountries.length === 250) {
        //console.log(allCountries);
        finalTab = allCountries.slice(0, 20);
      }

      createCard(finalTab);
      loading.style.display = "none";
    });
}

// je créé les cartes
function createCard(arr) {
  for (let i = 0; i < arr.length; i++) {
    const li = document.createElement("li");

    const card = document.createElement("div");
    card.className = "card";

    const flagclass = document.createElement("div");
    flagclass.className = "flagclass";
    const imgFlag = document.createElement("img");
    imgFlag.className = "flag";
    imgFlag.src = arr[i].flag;

    const informations = document.createElement("div");
    informations.className = "informations";

    const names = document.createElement("p");
    names.className = "name";
    names.innerText = arr[i].name;

    const capitals = document.createElement("p");
    capitals.className = "text";
    capitals.innerText = arr[i].capital;

    //const languages = document.createElement("p");
    //languages.className = "text";
    //languages.innerText = arr[i].language[0];

    li.appendChild(card);
    card.appendChild(flagclass);
    card.appendChild(informations);
    flagclass.appendChild(imgFlag);
    informations.appendChild(names);
    informations.appendChild(capitals);
    //informations.appendChild(languages);

    listCountries.appendChild(li);
  }
}

// scroll infini
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  // scrollTop = scroll depuis le top
  // scrollHeight = scroll total
  // clientHeight = hauteur de la fenêtre, partie visible

  //console.log(scrollTop, scrollHeight, clientHeight);

  if (clientHeight + scrollTop >= scrollHeight - 20) {
    addCountries(6);
  }
});

let index = 20;

function addCountries(nb) {
  if (index > 250) {
    return;
  }
  const arrToAdd = allCountries.slice(index, index + nb);
  createCard(arrToAdd);
  index += nb;
}

// animation input
const searchInput = document.querySelector(".search-countries input");

searchInput.addEventListener("input", function (e) {
  if (e.target.value !== "") {
    e.target.parentNode.classList.add("active-input");
  } else if (e.target.value === "") {
    e.target.parentNode.classList.remove("active-input");
  }
});

// search
searchInput.addEventListener("keyup", search);

function search() {
  if (index < 250) {
    addCountries(220);
  }

  let filter, allLi, titleValue, allTitles;

  filter = searchInput.value.toUpperCase();
  allLi = document.querySelectorAll("li");
  allTitles = document.querySelectorAll(".name");

  for (let i = 0; i < allLi.length; i++) {
    titleValue = allTitles[i].innerText;

    if (titleValue.toUpperCase().indexOf(filter) > -1) {
      allLi[i].style.display = "flex";
    } else {
      allLi[i].style.display = "none";
    }
  }
}

// #region ***  DOM references                           ***********
let fietserRood;
let fietserBlauw;
let fietserGeel;
let fietserGroen;
let fietserPaars;
let fietserWit;
let fietserKleur;
let voornaamSpeler1;
let achternaamSpeler1;
let kleurSpeler1;
let emailSpeler1;
let voornaamSpeler2;
let achternaamSpeler2;
let emailSpeler2;
let kleurSpeler2;
let chosenMap;
let htmlBody;

// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showFietser = function (id) {
  if (id == 'radio-rood') {
    console.log('rood');
    fietserKleur = 'rood';
  } else if (id == 'radio-blauw') {
    fietserBlauw.style.display = 'block';
    console.log('blauw');
    fietserKleur = 'blauw';
  } else if (id == 'radio-geel') {
    fietserGeel.style.display = 'block';
    console.log('geel');
    fietserKleur = 'geel';
  } else if (id == 'radio-groen') {
    fietserGroen.style.display = 'block';
    console.log('groen');
    fietserKleur = 'groen';
  } else if (id == 'radio-paars') {
    fietserPaars.style.display = 'block';
    console.log('paars');
    fietserKleur = 'paars';
  } else if (id == 'radio-wit') {
    fietserWit.style.display = 'block';
    console.log('wit');
    fietserKleur = 'wit';
  }
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const getRegistratie = function () {
  let htmlKleur = document.querySelectorAll('.js-kleur');
  let htmlVolgende = document.querySelector('.js-volgende');
  htmlKleur.forEach((kleur) => {
    kleur.addEventListener('click', function () {
      fietserBlauw.style.display = 'none';
      fietserGeel.style.display = 'none';
      fietserGroen.style.display = 'none';
      fietserPaars.style.display = 'none';
      fietserWit.style.display = 'none';
      showFietser(kleur.id);
    });
  });
  htmlVolgende.addEventListener('click', function () {
    console.log('volgende');
    let htmlVoornaam = document.querySelector('.js-voornaam');
    let htmlAchternaam = document.querySelector('.js-achternaam');
    let htmlEmail = document.querySelector('.js-email');
    listenToVolgende(htmlVoornaam, htmlAchternaam, htmlEmail);
  });
};

const getMap = function () {
  const maps = document.querySelectorAll('.js-map');
  maps.forEach((map) => {
    map.addEventListener('click', function () {
      if (map.id == 'radio-eilanden') {
        chosenMap = 'eilanden';
      } else if (map.id == 'radio-jungle') {
        chosenMap = 'jungle';
      } else if (map.id == 'radio-water') {
        chosenMap = 'water';
      }
    });
  });
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********

const listenToVolgende = function (voornaam, achternaam, email) {
  if (htmlBody.classList.contains('speler1')) {
    console.log('speler1');
    voornaamSpeler1 = voornaam.value;
    achternaamSpeler1 = achternaam.value;
    emailSpeler1 = email.value;
    kleurSpeler1 = fietserKleur;
    registratieInit();
  } else if (htmlBody.classList.contains('speler2')) {
    console.log('speler2');
    voornaamSpeler2 = voornaam.value;
    achternaamSpeler2 = achternaam.value;
    emailSpeler2 = email.value;
    kleurSpeler2 = fietserKleur;
  }
}
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********

const registratieInit = function () {
  console.log('start pagina');
  fietserRood = document.querySelector('.js-fietserRood');
  fietserBlauw = document.querySelector('.js-fietserBlauw');
  fietserGeel = document.querySelector('.js-fietserGeel');
  fietserGroen = document.querySelector('.js-fietserGroen');
  fietserPaars = document.querySelector('.js-fietserPaars');
  fietserWit = document.querySelector('.js-fietserWit');
  
  fietserBlauw.style.display = 'none';
  fietserGeel.style.display = 'none';
  fietserGroen.style.display = 'none';
  fietserPaars.style.display = 'none';
  fietserWit.style.display = 'none';

  voornaamSpeler1 = '';
  achternaamSpeler1 = '';
  emailSpeler1 = '';
  kleurSpeler1 = '';
  voornaamSpeler2 = '';
  achternaamSpeler2 = '';
  emailSpeler2 = '';
  kleurSpeler2 = '';
  
  getRegistratie();
};

const mapInit = function () {
  console.log('map');
  getMap();
};


document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded');
  htmlBody = document.querySelector('body');
  if(htmlBody.classList.contains('js-spelerInit')) {
    registratieInit();
  } else if(htmlBody.classList.contains('js-mapInit')) {
    mapInit();
  }
});

// #endregion

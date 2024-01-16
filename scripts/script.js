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
};

const getMap = function () {
  const maps = document.querySelectorAll('.js-map');
  let htmlVolgende = document.querySelector('.js-volgende');
  maps.forEach((map) => {
    map.addEventListener('click', function () {
      if (map.id == 'radio-eilanden') {
        chosenMap = 'eilanden';
        localStorage.setItem('chosenMap', chosenMap);
      } else if (map.id == 'radio-jungle') {
        chosenMap = 'jungle';
        localStorage.setItem('chosenMap', chosenMap);
      } else if (map.id == 'radio-water') {
        chosenMap = 'water';
        localStorage.setItem('chosenMap', chosenMap);
      }
    });
  });
  htmlVolgende.addEventListener('click', function () {
    console.log(chosenMap);
    window.location.href = 'speluitlegTablet.html'
  });
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********

const listenToVolgendeSpeler = function () {
  if (htmlBody.classList.contains('speler1')) {
    console.log('speler1');
    voornaamSpeler1 = voornaam.value;
    achternaamSpeler1 = achternaam.value;
    emailSpeler1 = email.value;
    kleurSpeler1 = fietserKleur;
    console.info(voornaamSpeler1, achternaamSpeler1, emailSpeler1, kleurSpeler1)
    localStorage.setItem('voornaamSpeler1', voornaamSpeler1);
    localStorage.setItem('achternaamSpeler1', achternaamSpeler1);
    localStorage.setItem('emailSpeler1', emailSpeler1);
    localStorage.setItem('kleurSpeler1', kleurSpeler1);
  } else if (htmlBody.classList.contains('speler2')) {
    console.log('speler2');
    voornaamSpeler2 = voornaam.value;
    achternaamSpeler2 = achternaam.value;
    emailSpeler2 = email.value;
    kleurSpeler2 = fietserKleur;
    console.info(voornaamSpeler2, achternaamSpeler2, emailSpeler2, kleurSpeler2)
    localStorage.setItem('voornaamSpeler2', voornaamSpeler2);
    localStorage.setItem('achternaamSpeler2', achternaamSpeler2);
    localStorage.setItem('emailSpeler2', emailSpeler2);
    localStorage.setItem('kleurSpeler2', kleurSpeler2);
  }
};

// #endregion

// #region ***  Init / DOMContentLoaded                  ***********

const spelerInit = function () {
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

  getRegistratie();
};

const mapInit = function () {
  console.log('map');
  getMap();
};

const startInit = function () {
  console.log('start');
  let htmlStart = document.querySelector('.js-start');
  htmlStart.addEventListener('click', function () {
    console.log('start');
    window.location.href = 'playerOneTablet.html';
  });
};

const uitlegInit = function () {
  console.log('uitleg');
  let htmlStart = document.querySelector('.js-start');
  htmlStart.addEventListener('click', function () {
    console.log('start');
    window.location.href = 'instructionTablet.html';
  });
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded');
  htmlBody = document.querySelector('body');
  if (htmlBody.classList.contains('js-spelerInit')) {
    spelerInit();
  } else if (htmlBody.classList.contains('js-mapInit')) {
    mapInit();
  } else if (htmlBody.classList.contains('js-startInit')) {
    startInit();
  } else if (htmlBody.classList.contains('js-uitlegInit')){
    uitlegInit();
  }
});

// #endregion

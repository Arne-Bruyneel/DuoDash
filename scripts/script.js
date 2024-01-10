// #region ***  DOM references                           ***********
let fietserRood;
let fietserBlauw;
let fietserGeel;
let fietserGroen;
let fietserPaars;
let fietserWit;

// #endregion

// #region ***  Callback-Visualisation - show___         ***********
const showFietser = function (classes) {
  if (classes.contains('c-keuzeRood')) {
    console.log('rood');
  } else if (classes.contains('c-keuzeBlauw')) {
    fietserBlauw.style.display = 'block';
    console.log('blauw');
  } else if (classes.contains('c-keuzeGeel')) {
    fietserGeel.style.display = 'block';
    console.log('geel');
  } else if (classes.contains('c-keuzeGroen')) {
    fietserGroen.style.display = 'block';
    console.log('groen');
  } else if (classes.contains('c-keuzePaars')) {
    fietserPaars.style.display = 'block';
    console.log('paars');
  } else if (classes.contains('c-keuzeWit')) {
    fietserWit.style.display = 'block';
    console.log('wit');
  }
};
// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const getRegistratie = function () {
  let htmlKleur = document.querySelectorAll('.js-kleur');
  htmlKleur.forEach((kleur) => {
    console.info(kleur);
    kleur.addEventListener('click', function () {
      fietserBlauw.style.display = 'none';
      fietserGeel.style.display = 'none';
      fietserGroen.style.display = 'none';
      fietserPaars.style.display = 'none';
      fietserWit.style.display = 'none';
      console.log('clicked');
      console.info(kleur.classList);
      showFietser(kleur.classList);
    });
  });
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded');
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
});

// #endregion

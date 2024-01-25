// #region ***  DOM references                           ***********

const lanIP = `${window.location.hostname}:5000`;
const socketio = io(`http://${lanIP}`);


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

const showDisabledColor = function () {
  let selectedColor = localStorage.getItem('kleurSpeler1');
  if (selectedColor == 'rood') {
    document.querySelector('#radio-rood').disabled = true;
    document.querySelector('.c-kruisje--rood').style.display = 'block';
    fietserRood.style.display = 'none';
    fietserBlauw.style.display = 'block';
    document.querySelector('#radio-blauw').checked = true;
  } else if (selectedColor == 'blauw') {
    document.querySelector('#radio-blauw').disabled = true;
    document.querySelector('.c-kruisje--blauw').style.display = 'block';
  } else if (selectedColor == 'geel') {
    document.querySelector('#radio-geel').disabled = true;
    document.querySelector('.c-kruisje--geel').style.display = 'block';
  } else if (selectedColor == 'groen') {
    document.querySelector('#radio-groen').disabled = true;
    document.querySelector('.c-kruisje--groen').style.display = 'block';
  } else if (selectedColor == 'paars') {
    document.querySelector('#radio-paars').disabled = true;
    document.querySelector('.c-kruisje--paars').style.display = 'block';
  } else if (selectedColor == 'wit') {
    document.querySelector('#radio-wit').disabled = true;
    document.querySelector('.c-kruisje--wit').style.display = 'block';
  }
};

// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********
const getRegistratie = function () {
  let htmlKleur = document.querySelectorAll('.js-kleur');
  voornaam.value = localStorage.getItem('voornaamSpeler1');
  achternaam.value = localStorage.getItem('achternaamSpeler1');
  email.value = localStorage.getItem('emailSpeler1');
  if(htmlBody.classList.contains('speler2')){
    showDisabledColor();
    voornaam.value = localStorage.getItem('voornaamSpeler2');
    achternaam.value = localStorage.getItem('achternaamSpeler2');
    email.value = localStorage.getItem('emailSpeler2');
  };
  fietserKleur = 'rood';
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
  chosenMap = 'Palmbomen';
  localStorage.setItem('chosenMap', chosenMap);

  maps.forEach((map) => {
    map.addEventListener('click', function () {
      if (map.id == 'radio-eilanden') {
        chosenMap = 'Palmbomen';
      } else if (map.id == 'radio-jungle') {
        chosenMap = 'Jungle';
      } else if (map.id == 'radio-water') {
        chosenMap = 'Water';
      }
      localStorage.setItem('chosenMap', chosenMap);
      socketio.emit('FT2B_show_map', { chosenMap });
      console.log("emitted for map: " + chosenMap);
    });
  });

  htmlVolgende.addEventListener('click', function () {
    console.log(chosenMap);
    window.location.href = 'speluitlegTablet.html';
  });
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********

const ListenToStart = function () {
  if (htmlBody.classList.contains('js-startInit')) {
    console.log('laad');
    socketio.emit('FT2B_go_to_countdown');
}};



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
    let speler1Json = {
      "voornaam": voornaamSpeler1,
      "achternaam": achternaamSpeler1,
      "email": emailSpeler1,
      "kleur": kleurSpeler1
    }
    socketio.emit('FT2B_show_player1_setup', {
      speler1Json
    });
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
    let speler2Json = {
      "voornaam": voornaamSpeler2,
      "achternaam": achternaamSpeler2,
      "email": emailSpeler2,
      "kleur": kleurSpeler2
    }
    socketio.emit('FT2B_show_player2_setup', {
      speler2Json
    });
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
  let htmlTrophy = document.querySelector('.js-trophy');
  htmlTrophy.addEventListener('click', function () {
    console.log('trophy');
    socketio.emit('FT2B_leaderboard');
  });
  htmlStart.addEventListener('click', function () {
    console.log('start');
    socketio.emit('FT2B_go_to_countdown');
    window.location.href = 'playerOneTablet.html';
  });
};

const uitlegInit = function () {
  console.log('uitleg');
  let htmlStart = document.querySelector('.js-start');
  htmlStart.addEventListener('click', function () {
    console.log('start');
    socketio.emit('FT2B_start_countdown');
    window.location.href = 'instructionTablet.html';
  });
};

const keuzeInit = function () {
  console.log('keuze');
  let htmlScorebord = document.querySelector('.js-scorebord');
  let htmlOpnieuw = document.querySelector('.js-opnieuw');
  let htmlNieuwspel = document.querySelector('.js-nieuwspel');
  htmlScorebord.addEventListener('click', function () {
    console.log('scorebord');
    socketio.emit('FT2B_show_leaderboard');
  });
  htmlOpnieuw.addEventListener('click', function () {
    console.log('opnieuw');
    socketio.emit('FT2B_restartGame');
  });
  htmlNieuwspel.addEventListener('click', function () {
    console.log('nieuwspel');
    socketio.emit('FT2B_newGame');
    window.location.href = 'startTablet.html';
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
    localStorage.clear();
    startInit();
  } else if (htmlBody.classList.contains('js-uitlegInit')){
    uitlegInit();
  } else if (htmlBody.classList.contains('js-keuzeInit')){
    keuzeInit();
  }
});

// #endregion

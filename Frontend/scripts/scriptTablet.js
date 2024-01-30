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
let htmlSolo;
let htmlDuo;

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
    document.querySelector('.c-keuzeRood').style.display = 'none';
    fietserRood.style.display = 'none';
    fietserBlauw.style.display = 'block';
    document.querySelector('#radio-blauw').checked = true;
  } else if (selectedColor == 'blauw') {
    document.querySelector('#radio-blauw').disabled = true;
    document.querySelector('.c-keuzeBlauw').style.display = 'none';
  } else if (selectedColor == 'geel') {
    document.querySelector('#radio-geel').disabled = true;
    document.querySelector('.c-keuzeGeel').style.display = 'none';
  } else if (selectedColor == 'groen') {
    document.querySelector('#radio-groen').disabled = true;
    document.querySelector('.c-keuzeGroen').style.display = 'none';
  } else if (selectedColor == 'paars') {
    document.querySelector('#radio-paars').disabled = true;
    document.querySelector('.c-keuzePaars').style.display = 'none';
  } else if (selectedColor == 'wit') {
    document.querySelector('#radio-wit').disabled = true;
    document.querySelector('.c-keuzeWit').style.display = 'none';
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

  if (localStorage.getItem('chosenSpelvorm') === 'solo') {
    console.log('solo');
    let titel = document.querySelector('.js-titel');
    titel.innerHTML = 'Speler';
    let form = document.querySelector('.js-form');
    form.action = 'mapTablet.html';
  }

  fietserKleur = 'rood';

  if (htmlBody.classList.contains('speler2')) {
    if (localStorage.getItem('kleurSpeler1') == 'rood') {
      fietserKleur = 'blauw';
    }
    showDisabledColor();
    voornaam.value = localStorage.getItem('voornaamSpeler2');
    achternaam.value = localStorage.getItem('achternaamSpeler2');
    email.value = localStorage.getItem('emailSpeler2');
  }
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
  socketio.emit('FT2B_show_map', { chosenMap });

  if (localStorage.getItem('chosenSpelvorm') === 'solo') {
    let duoPijl = document.querySelector('.js-duopijl');
    duoPijl.style.display = 'none';
  } else if (localStorage.getItem('chosenSpelvorm') === 'duo') {
    let soloPijl = document.querySelector('.js-solopijl');
    soloPijl.style.display = 'none';
  }

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
      console.log('emitted for map: ' + chosenMap);
    });
  });

  htmlVolgende.addEventListener('click', function () {
    console.log(chosenMap);
    window.location.href = 'speluitlegTablet.html';
  });
};

const getSpelvorm = function () {
  const spelvormen = document.querySelectorAll('.js-vorm');
  let htmlVolgende = document.querySelector('.js-volgende');
  let chosenSpelvorm = 'duo';
  localStorage.setItem('chosenSpelvorm', chosenSpelvorm);
  spelvormen.forEach((spelvorm) => {
    spelvorm.addEventListener('click', function () {
      if (spelvorm.id == 'radio-solo') {
        chosenSpelvorm = 'solo';
      } else if (spelvorm.id == 'radio-duo') {
        chosenSpelvorm = 'duo';
      }
      localStorage.setItem('chosenSpelvorm', chosenSpelvorm);
      console.log('emitted for spelvorm: ' + chosenSpelvorm);
    });
  });

  htmlVolgende.addEventListener('click', function () {
    console.log(chosenSpelvorm);
    window.location.href = 'playerOneTablet.html';
  });
  let htmlReturn = document.querySelector('.js-return');
  htmlReturn.addEventListener('click', function () {
    console.log('return');
    socketio.emit('FT2B_new_game');
    window.location.href = 'startTablet.html';
  });
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********

const ListenToStart = function () {
  if (htmlBody.classList.contains('js-startInit')) {
    console.log('laad');
    socketio.emit('FT2B_go_to_countdown');
  }
};

socketio.on('B2FT_go_to_choice', function () {
  console.log('go to choice');
  window.location.href = 'choiceTablet.html';
});

const listenToVolgendeSpeler = function () {
  if (htmlBody.classList.contains('speler1')) {
    console.log('speler1');
    voornaamSpeler1 = voornaam.value;
    achternaamSpeler1 = achternaam.value;
    emailSpeler1 = email.value;
    kleurSpeler1 = fietserKleur;
    console.info(
      voornaamSpeler1,
      achternaamSpeler1,
      emailSpeler1,
      kleurSpeler1
    );
    localStorage.setItem('voornaamSpeler1', voornaamSpeler1);
    localStorage.setItem('achternaamSpeler1', achternaamSpeler1);
    localStorage.setItem('emailSpeler1', emailSpeler1);
    localStorage.setItem('kleurSpeler1', kleurSpeler1);
    let speler1Json = {
      voornaam: voornaamSpeler1,
      achternaam: achternaamSpeler1,
      email: emailSpeler1,
      kleur: kleurSpeler1,
    };
    socketio.emit('FT2B_show_player1_setup', {
      speler1Json,
    });
  } else if (htmlBody.classList.contains('speler2')) {
    console.log('speler2');
    voornaamSpeler2 = voornaam.value;
    achternaamSpeler2 = achternaam.value;
    emailSpeler2 = email.value;
    kleurSpeler2 = fietserKleur;
    console.info(
      voornaamSpeler2,
      achternaamSpeler2,
      emailSpeler2,
      kleurSpeler2
    );
    localStorage.setItem('voornaamSpeler2', voornaamSpeler2);
    localStorage.setItem('achternaamSpeler2', achternaamSpeler2);
    localStorage.setItem('emailSpeler2', emailSpeler2);
    localStorage.setItem('kleurSpeler2', kleurSpeler2);
    let speler2Json = {
      voornaam: voornaamSpeler2,
      achternaam: achternaamSpeler2,
      email: emailSpeler2,
      kleur: kleurSpeler2,
    };
    socketio.emit('FT2B_show_player2_setup', {
      speler2Json,
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

  if (localStorage.getItem('chosenSpelvorm') === 'solo') {
    htmlDuo = document.querySelector('.js-duo');
    htmlDuo.style.display = 'none';
  } else if (localStorage.getItem('chosenSpelvorm') === 'duo') {
    htmlSolo = document.querySelector('.js-solo');
    htmlSolo.style.display = 'none';
  }

  const formulier = document.querySelector('.js-form');

  formulier.addEventListener('submit', function (event) {
    event.preventDefault();

    const emailInput = document.querySelector('.js-email');
    const email = emailInput.value;
    const positieat = email.indexOf('@');
    const deelnacomma = email.substring(positieat);
    const iserpunt = deelnacomma.includes('.');

    if (positieat >= 0 && iserpunt) {
      emailInput.setCustomValidity('');
      listenToVolgendeSpeler();
      formulier.submit();
    } else {
      emailInput.setCustomValidity('Please enter a valid email address.');
      emailInput.addEventListener('input', function () {
        emailInput.setCustomValidity('');
      });
    }

    emailInput.reportValidity();
  });

  getRegistratie();
  let htmlHome = document.querySelector('.js-home');
  htmlHome.addEventListener('click', function () {
    console.log('home');
    socketio.emit('FT2B_new_game');
    window.location.href = 'startTablet.html';
  });
};

const mapInit = function () {
  console.log('map');
  if (localStorage.getItem('chosenSpelvorm') === 'solo') {
    htmlDuo = document.querySelector('.js-duo');
    htmlDuo.style.display = 'none';
  } else if (localStorage.getItem('chosenSpelvorm') === 'duo') {
    htmlSolo = document.querySelector('.js-solo');
    htmlSolo.style.display = 'none';
  }
  let htmlHome = document.querySelector('.js-home');
  htmlHome.addEventListener('click', function () {
    console.log('home');
    socketio.emit('FT2B_new_game');
    window.location.href = 'startTablet.html';
  });
  getMap();
};

const startInit = function () {
  console.log('start');
  socketio.emit('FT2B_play_wachtmuziek')
  let htmlStart = document.querySelector('.js-start');
  let htmlTrophy = document.querySelector('.js-trophy');
  htmlTrophy.addEventListener('click', function () {
    console.log('trophy');
    socketio.emit('FT2B_leaderboard');
  });
  htmlStart.addEventListener('click', function () {
    console.log('start');
    socketio.emit('FT2B_go_to_countdown');
    window.location.href = 'spelvormTablet.html';
  });
};

const spelvormInit = function () {
  console.log('spelvorm');
  let htmlHome = document.querySelector('.js-home');
  htmlSolo = document.querySelector('.js-solo');
  htmlSolo.style.display = 'none';
  document.querySelector('.js-vorm__solo').addEventListener('click', function () {
    htmlDuo = document.querySelector('.js-duo');
    htmlDuo.style.display = 'none';
    htmlSolo = document.querySelector('.js-solo');
    htmlSolo.style.display = 'block';
  });
  document.querySelector('.js-vorm__duo').addEventListener('click', function () {
    htmlSolo = document.querySelector('.js-solo');
    htmlSolo.style.display = 'none';
    htmlDuo = document.querySelector('.js-duo');
    htmlDuo.style.display = 'block';
  });
  htmlHome.addEventListener('click', function () {
    console.log('home');
    socketio.emit('FT2B_new_game');
    window.location.href = 'startTablet.html';
  });

  getSpelvorm();
};

const uitlegInit = function () {
  console.log('uitleg');
  let htmlStart = document.querySelector('.js-start');
  if (localStorage.getItem('chosenSpelvorm') === 'solo') {
    htmlDuo = document.querySelector('.js-duo');
    htmlDuo.style.display = 'none';
  } else if (localStorage.getItem('chosenSpelvorm') === 'duo') {
    htmlSolo = document.querySelector('.js-solo');
    htmlSolo.style.display = 'none';
  }
  htmlStart.addEventListener('click', function () {
    console.log('start');
    socketio.emit('FT2B_start_countdown');
    window.location.href = 'instructionTablet.html';
  });
  let htmlHome = document.querySelector('.js-home');
  htmlHome.addEventListener('click', function () {
    // console.log('home');
    socketio.emit('FT2B_new_game');
    window.location.href = 'startTablet.html';
  });
};

const keuzeInit = function () {
  console.log('keuze');
  let htmlScorebord = document.querySelector('.js-scorebord');
  let htmlOpnieuw = document.querySelector('.js-opnieuw');
  let htmlNieuwspel = document.querySelector('.js-nieuwspel');
  htmlScorebord.addEventListener('click', function () {
    //html aanppassen
    document.querySelector('.c-keuzetekst').style.display = 'grid';
    console.log('scorebord');
    socketio.emit('FT2B_leaderboard');
  });
  htmlOpnieuw.addEventListener('click', function () {
    console.log('opnieuw');
    socketio.emit('FT2B_go_to_countdown');
    window.location.href = 'speluitlegTablet.html';
  });
  htmlNieuwspel.addEventListener('click', function () {
    console.log('nieuwspel');
    socketio.emit('FT2B_new_game');
    window.location.href = 'startTablet.html';
  });
};

const connectieInit = function () {
  console.log('connectie');
  document.querySelector('.js-loader').style.display = 'none';
  document.querySelector('.js-connect').style.display = 'none';
  // document.querySelector('.js-start').style.display = 'none';
  document.querySelector('.js-scan').addEventListener('click', function () {
    socketio.emit("F2B_start_bluetooth_scan");
    document.querySelector('.js-loader').style.display = 'block';
  });


  socketio.on('B2F_devices', function (jsonObject) {
    showDeviceData(jsonObject)
  });

  socketio.on('B2F_connected', function () {
    document.querySelector('.js-loader').style.display = 'none';
    window.location.href = 'startTablet.html';
  });

  socketio.on('B2F_bl_disconnect', function () {
    console.log('verbinding verbroken met fietsen via bluetooth');
    window.location.href = 'bikeConnectionTablet.html';
  });

}

const listenConnectPress = function () {
  var arr = []

  for (const device of document.querySelectorAll(".js-devices .js-device")) {
    if (device.value == 'Speler 1') {
      arr.push("L" + device.dataset.address);
    } else if (device.value == 'Speler 2') {
      arr.push("R" + device.dataset.address);
    }
  }

  document.querySelector('.js-loader').style.display = 'block';

  socketio.emit("F2B_connect", { "devices": arr });
};

const showDeviceData = function (jsonObject) {
  try {

    let htmlString = ''

    console.log(jsonObject)

    for (const device of jsonObject.devices) {
      console.log(device)
      let name = device["name"]

      htmlString += `<li class="c-connect__fiets">${name.split(': ')[1]}<select class="c-connect__select js-device" data-address="${device["address"]}">
          <option></option>
          <option>Speler 1</option>
          <option>Speler 2</option>
          <option>Non actief</option>
        </select>
      </li>`
    }

    document.querySelector('.js-loader').style.display = 'none';

    document.querySelector('.js-devices').innerHTML = htmlString;

    document.querySelector('.js-connect').style.display = 'block';

    const connectButton = document.querySelector('.js-connect');
    connectButton.addEventListener('click', listenConnectPress);

  } catch (error) {
    console.error(`Er ging iets mis met pol: ${error}`);
  }
}
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
  } else if (htmlBody.classList.contains('js-uitlegInit')) {
    uitlegInit();
  } else if (htmlBody.classList.contains('js-keuzeInit')) {
    keuzeInit();
  } else if (htmlBody.classList.contains('js-spelvormInit')) {
    spelvormInit();
  } else if (htmlBody.classList.contains('js-connectieInit')) {
    connectieInit();
  }
});

// #endregion

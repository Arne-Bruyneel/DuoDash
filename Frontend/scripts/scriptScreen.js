// #region ***  DOM references                           ***********
let countdownInterval;
let countdownValue;
// let htmlBody;

const lanIP = `${window.location.hostname}:5000`;
const socketio = io(`http://${lanIP}`);

// #endregion

// #region ***  Callback-Visualisation - show___         ***********

const showLeaderboard = function (leads) {
  let htmlPodium1 = document.querySelector('.js-podium1');
  let htmlPodium2 = document.querySelector('.js-podium2');
  let htmlPodium3 = document.querySelector('.js-podium3');
  let htmlKlasseLinks = document.querySelector('.js-klasselinks');
  let htmlKlasseRechts = document.querySelector('.js-klasserechts');
  let htmlString1 = `<div class="c-klasseNaam">${leads[0].naam}</div> 
    <div class="c-klasseAfstand">${leads[0].afstand}</div>
    <div class="c-klasseSnelheid">${leads[0].snelheid} km/u</div>`;
  htmlPodium1.innerHTML = htmlString1;
  let htmlString2 = `<div class="c-klasseNaam">${leads[1].naam}</div>
    <div class="c-klasseAfstand">${leads[1].afstand}</div>
    <div class="c-klasseSnelheid">${leads[1].snelheid} km/u</div>`;
  htmlPodium2.innerHTML = htmlString2;
  let htmlString3 = `<div class="c-klasseNaam">${leads[2].naam}</div>
    <div class="c-klasseAfstand">${leads[2].afstand}</div>
    <div class="c-klasseSnelheid">${leads[2].snelheid} km/u</div>`;
  htmlPodium3.innerHTML = htmlString3;
  let htmlStringLinks = '';
  leads.slice(3, 7).forEach((lead, index) => {
    htmlStringLinks += `<div class="c-klasse">
        <div class="c-klasseBegin">
            <div class="c-klasseNummer">${index + 4}.</div>
            <div class="c-klasseNaam">${lead.naam}</div>
        </div>
        <div class="c-klasseEind">
            <div class="c-klasseAfstand">${lead.afstand}</div>
            <div class="c-klasseSnelheid">${lead.snelheid} km/u</div>
        </div>
    </div>`;
  });
  htmlKlasseLinks.innerHTML = htmlStringLinks;
  const getRankClass = (rank) => {
    return rank === 10 ? 'c-klasseBegin c-klasseBegin--tien' : 'c-klasseBegin';
  };
  let htmlStringRechts = '';
  leads.slice(7, 11).forEach((lead, index) => {
    const rankClass = getRankClass(index + 8);
    htmlStringRechts += `<div class="c-klasse">
      <div class="${rankClass}">
        <div class="c-klasseNummer">${index + 8}.</div>
        <div class="c-klasseNaam">${lead.naam}</div>
      </div>
      <div class="c-klasseEind">
        <div class="c-klasseAfstand">${lead.afstand}</div>
        <div class="c-klasseSnelheid">${lead.snelheid} km/u</div>
      </div>
    </div>`;
  });
  htmlKlasseRechts.innerHTML = htmlStringRechts;
};

const showPlayer1Setup = function (player1) {
  document.querySelector('.js-speler1nk').style.display = 'none';
  document.querySelector('.js-speler1k').style.display = 'block';
  document.querySelector('.js-kader1').style.display = 'flex';
  localStorage.setItem('voornaam1', player1.voornaam);
  localStorage.setItem('kleur1', player1.kleur);
  document.querySelector('.js-speler1naam').innerHTML = player1.voornaam;
  document.querySelector(
    '.js-avatar1'
  ).src = `../../img/fietser1_${player1.kleur}.png`;
};

const showPlayer2Setup = function (player2) {
  document.querySelector('.js-speler2nk').style.display = 'none';
  document.querySelector('.js-speler2k').style.display = 'block';
  document.querySelector('.js-kader2').style.display = 'flex';
  localStorage.setItem('voornaam2', player2.voornaam);
  localStorage.setItem('kleur2', player2.kleur);
  document.querySelector('.js-speler2naam').innerHTML = player2.voornaam;
  document.querySelector(
    '.js-avatar2'
  ).src = `../../img/fietser1_${player2.kleur}.png`;
};

const showMap = function (map) {
  let htmlBackground = document.querySelector('.js-background');
  htmlBackground.style.backgroundImage = `url(../../img/Achtergronden/${map}.svg)`;
};

const showCountdown = function () {
  document.querySelector('.js-speler1k').style.display = 'none';
  document.querySelector('.js-speler2k').style.display = 'none';
  document.querySelector('.js-countdown').style.display = 'grid';
  document.querySelector('.js-spring').style.display = 'block';
  document.querySelector('.js-spring').style.display = 'block';
  // Usage
  const animationL = document.querySelector('.js-animationL');
  animationL.classList.add('c-beweegKader__links');

  const animationR = document.querySelector('.js-animationR');
  animationR.classList.add('c-beweegKader__rechts');

  startCountdown(19, () => {
    console.log('Countdown finished!');
    window.location.href = 'raceScreen.html';
  }, true);
};

const showCountdownPlayagain = function () {
  voornaamSpeler1 = localStorage.getItem('voornaam1');
  kleurSpeler1 = localStorage.getItem('kleur1');
  voornaamSpeler2 = localStorage.getItem('voornaam2');
  kleurSpeler2 = localStorage.getItem('kleur2');

  document.querySelector('.js-speler1nk').style.display = 'none';
  document.querySelector('.js-speler1k').style.display = 'block';
  document.querySelector('.js-kader1').style.display = 'flex';

  document.querySelector('.js-speler2nk').style.display = 'none';
  document.querySelector('.js-speler2k').style.display = 'block';
  document.querySelector('.js-kader2').style.display = 'flex';


  document.querySelector('.js-speler1naam').innerHTML = voornaamSpeler1;
  document.querySelector(
    '.js-avatar1'
  ).src = `../../img/fietser1_${kleurSpeler1}.png`;
  document.querySelector('.js-speler2naam').innerHTML = voornaamSpeler2;
  document.querySelector(
    '.js-avatar2'
  ).src = `../../img/fietser1_${kleurSpeler2}.png`;
  
  showCountdown();
};

const showResult = function (result, winnaar) {
  let winnaarLinks = document.querySelector('.js-winnaarLinks');
  let winnaarRechts = document.querySelector('.js-winnaarRechts');

  if (!winnaarLinks || !winnaarRechts) {
    console.error('One or both of the winner elements do not exist in the DOM');
    return;
  }
  let htmlString1 = `
  <div class="c-boog">
                    <div class="c-rondje">
                        <img class="c-avatar" src="../../img/fietser1_${localStorage.getItem('kleur1')}.png" alt="Rood">
                    </div>
                </div>
                <div class="c-kader">
                    <div class="c-winnaarStats">
                        <div class="c-klasseNaam">${result[0].naam}</div>
                        <div class="c-getalletjes">
                            <div class="c-getal">
                                <div class="c-klasseSnelheid">${result[0].snelheid} km/u</div>
                                <div>Max. snelheid</div>
                            </div>
                            <div class="c-streepje"></div>
                            <div class="c-getal c-getal--winnaar">
                                <div class="c-klasseAfstand c-klasseAfstand--winnaar">${result[0].afstand} m</div>
                                <div>Afstand</div>
                            </div>
                            <div class="c-streepje"></div>
                            <div class="c-getal">
                                <div class="c-klasseWatt">${result[0].wattage} W</div>
                                <div>Gem. wattage</div>
                            </div>
                        </div>
                    </div>
                </div>

                <svg class="c-medaille c-medaille--links" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="83" height="117" viewBox="0 0 83 117">
                    <defs>
                        <pattern id="pattern" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 362 512">
                            <image width="362" height="512"
                                xlink:href="data:image/png;base64,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" />
                        </pattern>
                    </defs>
                    <rect id="first-icon" width="83" height="117" fill="url(#pattern)" />
                </svg>`;
  winnaarLinks.innerHTML = htmlString1;
  let htmlString2 = `
  <div class="c-boog">
                    <div class="c-rondje">
                        <img class="c-avatar" src="../../img/fietser1_${localStorage.getItem('kleur2')}.png" alt="Blauw">
                    </div>
                </div>
                <div class="c-kader">
                    <div class="c-winnaarStats">
                        <div class="c-klasseNaam">${result[1].naam}</div>
                        <div class="c-getalletjes">
                            <div class="c-getal">
                                <div class="c-klasseSnelheid">${result[1].snelheid} km/u</div>
                                <div>Max. snelheid</div>
                            </div>
                            <div class="c-streepje"></div>
                            <div class="c-getal c-getal--winnaar">
                                <div class="c-klasseAfstand c-klasseAfstand--winnaar">${result[1].afstand} m</div>
                                <div>Afstand</div>
                            </div>
                            <div class="c-streepje"></div>
                            <div class="c-getal">
                                <div class="c-klasseWatt">${result[1].wattage} W</div>
                                <div>Gem. wattage</div>
                            </div>
                        </div>
                    </div>
                </div>
                <svg class="c-medaille c-medaille--rechts" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="83" height="117" viewBox="0 0 83 117">
                    <defs>
                        <pattern id="pattern2" preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 362 512">
                            <image width="362" height="512"
                                xlink:href="data:image/png;base64,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" />
                        </pattern>
                    </defs>
                    <rect id="second-icon" width="83" height="117" fill="url(#pattern2)" />
                </svg>`;
  winnaarRechts.innerHTML = htmlString2;
  showWinnaar(result, winnaar);
};

const showWinnaar = function (result, winnaar) {
  let medailleLinks = document.querySelector('.c-medaille--links');
  let medailleRechts = document.querySelector('.c-medaille--rechts');
  if (result[0].id === winnaar[0].id) {
    medailleRechts.style.display = 'none';
  } else if (result[1].id === winnaar[0].id) {
    medailleLinks.style.display = 'none';
  }
  let canvas = document.getElementById('#custom_canvas');
  const jsConfetti = new JSConfetti({ canvas });
  setTimeout(() => {
    jsConfetti.addConfetti({
      confettiRadius: 8,
      confettiNumber: 500,
    });
  }, 500);
};

// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********

function startCountdown(duration, callback, showFinalCountdown = false) {
  let timeLeft = duration;
  let countdownElement = document.querySelector('.js-countdown');
  let aftelElement = showFinalCountdown ? document.querySelector('.js-aftel') : null;

  let timerId = setInterval(() => {
    if (timeLeft > 0) {
      console.log(timeLeft + ' seconds remaining');
      
      // Only update the aftelElement if showFinalCountdown is true and timeLeft is 3 or less
      if (showFinalCountdown && timeLeft <= 3.5) {
        document.querySelector('.js-spring').style.display = 'none';
        countdownElement.style.display = 'none'; // Hide the countdown
        aftelElement.style.display = 'flex'; // Show the countdown
        aftelElement.textContent = timeLeft; // Update the text content with the current timeLeft
      }
      
      timeLeft--;
    } else {
      clearInterval(timerId);
      
      if (showFinalCountdown) {
        countdownElement.style.display = 'none'; // Hide the countdown
        aftelElement.textContent = ''; // Clear the countdown text
      }
      
      callback();
    }
  }, 1000); // countdown interval is 1 second
}

// #endregion

// #region ***  Data Access - get___                     ***********

const getLeaderboard = function (leaderboardData) {
  //sort data
  leaderboardData.sort(function (a, b) {
    return b[3] - a[3];
  });
  const formattedLeaderboard = leaderboardData.map((player) => {
    return {
      naam: player[1] + ' ' + player[2].charAt(0) + '.',
      afstand: player[3] + ' m',
      snelheid: parseFloat(player[4]).toFixed(1),
    };
  });

  // displayen van de data
  showLeaderboard(formattedLeaderboard);
};

const getPlayer1Setup = function (player1) {
  showPlayer1Setup(player1);
};

const getPlayer2Setup = function (player2) {
  showPlayer2Setup(player2);
};

const getResult = function (data) {
  if (!data || !data.metingen) {
    console.error('Data is not defined or malformed', data);
    return;
  }

  let result = [];
  data.metingen.forEach((meting) => {
    //speler voor meting zoeken
    let speler = data.spelers.find((speler) => speler.id === meting.speler_id);

    if (speler) {
      result.push({
        id: speler.id,
        naam: speler.voornaam + ' ' + speler.achternaam.charAt(0) + '.',
        afstand: meting.afstand,
        snelheid: meting.maxSnelheid,
        wattage: meting.gemVermogen,
      });
    } else {
      console.error('No player found for meting:', meting);
    }
  });

  let winners = data.spelers.filter((speler) => speler.winnaar);

  showResult(result, winners);
};
// #endregion

// #region ***  Event Listeners - listenTo___            ***********

socketio.on('B2FS_go_to_countdown', function () {
  console.log('go to countdown');
  window.location.href = 'countdownScreen.html';
});

socketio.on('B2FS_leaderboard', function () {
  console.log('leaderboard');
  window.location.href = 'leaderboard.html';
});

socketio.on('B2FS_show_player1_setup', function (JsonObject) {
  console.log('show player 1 setup');
  data = JsonObject.data;
  console.log(data);
  // window.location.href = 'countdownScreen.html';
  getPlayer1Setup(data.speler1Json);
});

socketio.on('B2FS_new_game', function () {
  window.location.href = 'startScreen.html';
});

socketio.on('B2FS_show_player2_setup', function (JsonObject) {
  console.log('show player 2 setup');
  data = JsonObject.data;
  console.log(data.speler2Json);
  getPlayer2Setup(data.speler2Json);
});

socketio.on('B2FS_show_map', function (JsonObject) {
  console.log('show map');
  // window.location.href = 'countdownScreen.html';
  console.log('emit received map');
  map = JsonObject.data;
  console.log(map.chosenMap);
  localStorage.setItem('theMap', map.chosenMap);
  showMap(map.chosenMap);
});


socketio.on('B2FS_start_countdown', function () {
  console.log('start game');
  // window.location.href = 'raceScreen.html';
  //deze moet linken naar pagina die countdown laat zien

  const player1Name = localStorage.getItem('voornaamSpeler1');
  const player2Name = localStorage.getItem('voornaamSpeler2');
  console.log('player1: ',player1Name);
  console.log('Player2: ',player2Name);

  if (player1Name && player2Name) {
    // window.location.href = 'countdownScreen.html';
    showCountdownPlayagain();
  } else {
    showCountdown();
  };
});

socketio.on('connect', function () {
  console.log('verbonden met socket webserver');
});

socketio.on('B2FS_show_result', function () {
  console.log('show result');
  // window.location.href = `http://${lanIP}/Frontend/html/Screen/resultScreen.html`;
  window.location.href = 'resultScreen.html';
});

// #endregion

function fetchLeaderboardData() {
  handleData(`http://${lanIP}/api/v1/leaderboard`, getLeaderboard);
}

function fetchResultData() {
  handleData(`http://${lanIP}/api/v1/results`, getResult);
}

// #region ***  Init / DOMContentLoaded                  ***********

const laadInit = function () {};

const countdownInit = function () {
};

const raceInit = function () {
  console.info('race init');
  startCountdown(14, () => {
    console.log('Countdown finished!');
    window.location.href = 'resultScreen.html';
  }, false);
  let map = localStorage.getItem('theMap');
  let htmlImg = document.querySelector('.js-move');
  htmlImg.src = `../../img/Achtergronden/Moving/${map}Twee.svg`;
  let htmlNaam1 = document.querySelector('.js-naam1');
  let htmlNaam2 = document.querySelector('.js-naam2');
  let avatar1 = document.querySelector('.js-avatar1');
  let avatar2 = document.querySelector('.js-avatar2');
  let kleur1 = localStorage.getItem('kleur1');
  let kleur2 = localStorage.getItem('kleur2');
  htmlNaam1.innerHTML = localStorage.getItem('voornaam1');
  htmlNaam2.innerHTML = localStorage.getItem('voornaam2');
  avatar1.src = `../../img/fietser1_${kleur1}.png`;
  avatar2.src = `../../img/fietser1_${kleur2}.png`;
};

const resultInit = function () {
  showMap(localStorage.getItem('theMap'));
  fetchResultData();
  socketio.emit('FS2B_go_to_choice');
};

const leaderboardInit = function () {
  showMap(localStorage.getItem('theMap'));
  fetchLeaderboardData();
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded');
  htmlBody = document.querySelector('body');
  if (htmlBody.classList.contains('js-laadInit')) {
    laadInit();
  } else if (htmlBody.classList.contains('js-countdownInit')) {
    countdownInit();
  } else if (htmlBody.classList.contains('js-raceInit')) {
    raceInit();
  } else if (htmlBody.classList.contains('js-resultInit')) {
    console.log('result init');
    resultInit();
  } else if (htmlBody.classList.contains('js-leaderboardInit')) {
    console.log('leaderboard init');
    fetchLeaderboardData();
  }
});
// #endregion

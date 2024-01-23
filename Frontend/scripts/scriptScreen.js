// #region ***  DOM references                           ***********
let countdownInterval;
let countdownValue;
// let htmlBody;

const lanIP = `${window.location.hostname}:5000`;
// const socketio = io(`http://${lanIP}`);

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
    let htmlStringRechts = '';
    leads.slice(7, 11).forEach((lead, index) => {
        htmlStringRechts += `<div class="c-klasse">
        <div class="c-klasseBegin">
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

const showPlayerSetup = function () {
  window.location.href = 'countdownScreen.html';
};

const showPlayer1Setup = function () {};

const showPlayer2Setup = function () {};

const showMap = function (map) {
  let htmlBackground = document.querySelector('.js-background');
  htmlBackground.style.backgroundImage = `url(..img/Achtergronden/${map}.svg)`;
};

const showCountdown = function () {
  //commented for testing
  // document.querySelectorAll('.js-spelertekst').style.display = 'none';
  // countdownValue = document.querySelector('.js-countdown').innerHTML;
  getCountdown();
  countdownInterval = setInterval(getCountdown, 1000);
};

// #endregion

// #region ***  Callback-No Visualisation - callback___  ***********
// #endregion

// #region ***  Data Access - get___                     ***********


const getLeaderboard = function (leaderboardData) {
  //sort data
  leaderboardData.sort(function (a, b) {
    return b[3] - a[3];
  });
  const formattedLeaderboard = leaderboardData.map(player => {
    return {
      naam: player[1] + ' ' + player[2].charAt(0) + '.',
      afstand: player[3] + ' m',
      snelheid: parseFloat(player[4]).toFixed(1)
    };
  });

  // displayen van de data
  showLeaderboard(formattedLeaderboard);
};


const getPlayer1Setup = function (player1) {
  showPlayer1Setup();
};

const getPlayer2Setup = function (player2) {
  showPlayer2Setup();
};

const getCountdown = function () {
  countdownValue--;

  if (countdownValue < 4) {
    document.querySelector('.js-countdown').style.display = 'none';
    countdownValue = document.querySelector('.js-aftel').innerHTML;
    countdownValue--;
    if (countdownValue == 0) {
      clearInterval(countdownInterval);
      console.log('start game');
      socketio.emit('FS2B_start_game');
      window.location.href = 'raceScreen.html';
    }
  }
};

// #endregion

// #region ***  Event Listeners - listenTo___            ***********



// socketio.on('B2FS_show_player_setup', function () {
//   console.log('show player setup');
//   showPlayerSetup();
// });
// socketio.on('B2FS_show_player1_setup', function (player1) {
//   console.log('show player 1 setup');
//   getPlayer1Setup(player1);
// });
// socketio.on('B2FS_show_player2_setup', function (player2) {
//   console.log('show player 2 setup');
//   getPlayer2Setup(player2);
// });
// socketio.on('B2FS_show_map', function (map) {
//   console.log('show map');
//   showMap(map);
// });
// socketio.on('B2FS_start_countdown', function () {
//   console.log('start game');
//   showCountdown();
// });



// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
function fetchLeaderboardData() {
  handleData(`http://${lanIP}/api/v1/leaderboard`, getLeaderboard);
}

const laadInit = function () {

};

const countdownInit = function () {

};

const raceInit = function () {
  console.info('race init')
  let map = localStorage.getItem('chosenMap');
  console.info(map);
  let htmlImg = document.querySelector('.js-move');
  htmlImg.src = `../../img/Achtergronden/Moving/${map}Twee.svg`;
  let htmlNaam1 = document.querySelector('.js-naam1');
  let htmlNaam2 = document.querySelector('.js-naam2');
  let naam1 = localStorage.getItem('voornaamSpeler1');
  let naam2 = localStorage.getItem('voornaamSpeler2');
  htmlNaam1.innerHTML = naam1;
  htmlNaam2.innerHTML = naam2;
};

const resultInit = function () {

};

const leaderboardInit = function () {
  fetchLeaderboardData();
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded');
  htmlBody = document.querySelector('body');
  if(htmlBody.classList.contains('js-laadInit')){
    laadInit();
  } else if(htmlBody.classList.contains('js-countdownInit')){
    countdownInit();
  } else if(htmlBody.classList.contains('js-raceInit')){
    raceInit();
  } else if(htmlBody.classList.contains('js-resultInit')){
    resultInit();
  } else if(htmlBody.classList.contains('js-leaderboardInit')){
    console.log('leaderboard init');
    fetchLeaderboardData();
  }
});
// #endregion

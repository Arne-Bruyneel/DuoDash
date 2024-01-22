// #region ***  DOM references                           ***********
let countdownInterval;
let countdownValue;
// let htmlBody;
// #endregion

// #region ***  Callback-Visualisation - show___         ***********

const showLeaderboard = function () {
  window.location.href = 'leaderboard.html';
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

const getLeaderboard = function () {
  showLeaderboard();
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



socketio.on('B2FS_show_player_setup', function () {
  console.log('show player setup');
  showPlayerSetup();
});
socketio.on('B2FS_show_player1_setup', function (player1) {
  console.log('show player 1 setup');
  getPlayer1Setup(player1);
});
socketio.on('B2FS_show_player2_setup', function (player2) {
  console.log('show player 2 setup');
  getPlayer2Setup(player2);
});
socketio.on('B2FS_show_map', function (map) {
  console.log('show map');
  showMap(map);
});
socketio.on('B2FS_start_countdown', function () {
  console.log('start game');
  showCountdown();
});
// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const laadInit = function () {

};

const countdownInit = function () {

};

const raceInit = function () {

};

const resultInit = function () {

};

const leaderboardInit = function () {
  
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded');
  htmlBody = document.querySelector('body');
  if(htmlBody.classList.contains('.js-laadInit')){
    laadInit();
  } else if(htmlBody.classList.contains('.js-countdownInit')){
    countdownInit();
  } else if(htmlBody.classList.contains('.js-raceInit')){
    raceInit();
  } else if(htmlBody.classList.contains('.js-resultInit')){
    resultInit();
  } else if(htmlBody.classList.contains('.js-leaderboardInit')){
    leaderboardInit();
  }
});
// #endregion

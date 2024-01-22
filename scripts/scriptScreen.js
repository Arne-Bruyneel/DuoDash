// #region ***  DOM references                           ***********
let countdownInterval;
let countdownValue;
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
  countdownValue = document.querySelector('.js-countdown').innerHTML;
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

  if (countdownValue < 0) {
    clearInterval(countdownInterval);
  }
};

// #endregion

// #region ***  Event Listeners - listenTo___            ***********

socketio.on('B2F_showLeaderboard', function () {
  console.log('show leaderboard');
  getLeaderboard();
});

socketio.on('B2F_showPlayerSetup', function () {
  console.log('show player setup');
  showPlayerSetup();
});
socketio.on('B2F_showPlayer1Setup', function (player1) {
  console.log('show player 1 setup');
  getPlayer1Setup(player1);
});
socketio.on('B2F_showPlayer2Setup', function (player2) {
  console.log('show player 2 setup');
  getPlayer2Setup(player2);
});
socketio.on('B2F_showMap', function (map) {
  console.log('show map');
  showMap(map);
});
socketio.on('B2F_startGame', function () {
  console.log('start game');
  showCountdown();
});
socketio.on('B2F_restartGame');
socketio.on('B2F_newGame');

// #endregion

// #region ***  Init / DOMContentLoaded                  ***********

// #endregion

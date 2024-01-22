// #region ***  DOM references                           ***********
const lanIP = `${window.location.hostname}:5000`;
const socketio = io(`http://${lanIP}`);
//#endregion

//#region ***  Callback-Visualisation - show___         ***********
const showDeviceData = function(jsonObject) {
  try {

    let cardString = ''

    for (const device of jsonObject.devices) {
      console.log(device)
      let name = device["name"]

      cardString += `<div class="card js-device" data-address="${device["address"]}">
          <h3>${name.split(': ')[1]}</h3>
        </div>`
    }

    document.querySelector('.js-devices').innerHTML = cardString;

    addEventListenersDevices();

  } catch(error) {
    console.error(`Er ging iets mis met pol: ${error}`);
  }
}

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***********

//#endregion

//#region ***  Data Access - get___                     ***********
const getDestinationData = function(url) {
  handleData(url, showDeviceData)
}

//#endregion

//#region ***  Event Listeners - listenTo___            ***********
const listenToDevicePress = function () {
  this.classList.toggle('selected');

  const submit = document.querySelector('.js-submit');
  submit.addEventListener('click', listenSubmitPress);
};

const addEventListenersDevices = function(){

  for (const card of document.querySelectorAll(".js-device")) {
    card.addEventListener('click', listenToDevicePress);
  }
};

const listenButtonPress = function () {
  console.log('scan press')
  socketio.emit("F2B_start_bluetooth_scan");
};

const listenSubmitPress = function () {
  console.log('submit press')

  var arr = []

  for (const card of document.querySelectorAll(".js-device")) {
    if (card.classList.contains('selected')) {
      arr.push(card.dataset.address);
    }
  }

  socketio.emit("F2B_connect", {"devices": arr});

  const start = document.querySelector('.js-start');
  start.addEventListener('click', listenStartPress);
};

const listenStartPress = function () {
  console.log('start press')

  socketio.emit("F2B_start_game");
};

const listenToUI = function () {

  const button = document.querySelector('.js-knop');

  button.addEventListener('click', listenButtonPress);

};

const listenToSocket = function () {

  socketio.on('connect', function (jsonObject) {
    console.info('verbonden met de server');
  });

  socketio.on('B2F_devices', function (jsonObject) {
    console.log('Dit is de status van de devices');
    showDeviceData(jsonObject)
  });

  socketio.on('B2F_connected', function () {
    console.log('fiets connected');
  });

  socketio.on('B2F_data', function (jsonObject) {
    console.log('data ontvangen');
    console.log(jsonObject.data['value']);
  });
};
//#endregion

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  console.info('DOM geladen');
  listenToUI();
  listenToSocket();
};

document.addEventListener('DOMContentLoaded', init);

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
          <div class="radio-container">
            <input type="radio" name="direction" value="left" class="radio-input js-left">Left
          </div>
  
        <div class="radio-container">
          <input type="radio" name="direction" value="right" class="radio-input js-right">Right
        </div>
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

      // const radioButtons = card.querySelectorAll('input[type="radio"]');

      // radioButtons.forEach(function(radioButton) {
      //   if (radioButton.checked) {
      //     console.log(`Card "${card.querySelector('label').textContent}" selected: ${radioButton.value}`);
      //   }
      // });

      if (card.dataset.address == "E3:B4:38:07:DA:17") {
        arr.push("L" + card.dataset.address);
      } else {
        arr.push("R" + card.dataset.address);
      }

    }
  }

  socketio.emit("F2B_connect", {"devices": arr});
};

const listenStartPress = function () {
  console.log('start press')

  socketio.emit("F2B_startgame");
};

const listenInstantConnectPress = function () {
  console.log('instant connect press')

  var arr = []

  arr.push("RE3:B4:38:07:DA:17");
  arr.push("LEE:C9:4D:93:35:3E");

  socketio.emit("F2B_connect", {"devices": arr})
};

const listenToUI = function () {

  const button = document.querySelector('.js-knop');
  const instantConnect = document.querySelector('.js-submit2');

  button.addEventListener('click', listenButtonPress);

  instantConnect.addEventListener('click', listenInstantConnectPress);

  const start = document.querySelector('.js-start');
  start.addEventListener('click', listenStartPress);

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
    console.log('fietsen connected');
  });

  socketio.on('B2F_heartbeat', function (jsonObject) {
    console.log('heart beat bitches');
  });


  socketio.on('B2F_data', function (jsonObject) {
    console.log('data ontvangen');

    for (const device of jsonObject) {

      console.log(device["side"] + ' s:' + device["data"]["speed"] + ' p:' + device["data"]["power"])
    }

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

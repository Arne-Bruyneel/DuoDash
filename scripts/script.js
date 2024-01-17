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

const getLeaderboard = function (data) {
  console.info(data.spelers);
  console.info(data.metingen);
  let metingen = data.metingen;
  let spelers = data.spelers;
  let leaderboard = [];

  metingen.sort(function (a, b) {
    return b.afstand - a.afstand;
  });
  console.log(JSON.stringify(data, null, 2));

  metingen.forEach((meting) => {
    let speler = spelers.find((speler) => speler.id === meting.speler_id);
    leaderboard.push({
      naam: speler.voornaam + ' ' + speler.achternaam.charAt(0) + '.',
      afstand: meting.afstand,
      snelheid: meting.maxSnelheid,
    });
  });
  console.log(leaderboard);
  showLeaderboard(leaderboard);
};

function fetchLeaderboardData() {
  fetch('./data/data.json')
    .then((response) => response.json())
    .then((data) => {
      // You can use the JSON data here
      console.log(data);
      console.log('fetch done');
      getLeaderboard(data);
    })
    .catch((error) => {
      console.error('An error occurred while fetching JSON data: ' + error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  fetchLeaderboardData();
});


const showLeaderboard = function () {

};

const getLeaderboard = function(data){
    console.info(data.spelers);
    console.info(data.metingen);
    let metingen = data.metingen;
    let spelers = data.spelers;

    metingen.sort(function(a, b) {
        return b.afstand - a.afstand;
    });
    console.log(JSON.stringify(data, null, 2));
    
    metingen.forEach(meting => {
        let speler = spelers.find(speler => speler.id === meting.speler_id);
        let sortedJson = {
            "naam": speler.voornaam + ' ' + speler.achternaam.charAt(0) + '.',
            "afstand": meting.afstand,
            "snelheid": meting.maxSnelheid,
        }
        console.log(sortedJson);
    });
}


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

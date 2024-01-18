


const getResult = function(data) {
    let spelers = data.spelers;
    let metingen = data.metingen;
    let winnaar = spelers.filter(function(speler) {
        return speler.winnaar === true;
    });
    metingen.forEach((meting) => {
        let speler = spelers.find((speler) => speler.id === meting.speler_id);
        console.log(speler);
    });
    var winnaardata = metingen.find((meting) => meting.speler_id === winnaar[0].id);
    
};

function fetchResultData() {
    fetch('./data/data.json')
      .then((response) => response.json())
      .then((data) => {
        // You can use the JSON data here
        console.log(data);
        console.log('fetch done');
        getResult(data);
      })
      .catch((error) => {
        console.error('An error occurred while fetching JSON data: ' + error);
      });
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    fetchResultData();
  });
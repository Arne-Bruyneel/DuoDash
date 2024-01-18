


const getResult = function(data) {
    let spelers = data.spelers;
    let metingen = data.metingen;
    
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
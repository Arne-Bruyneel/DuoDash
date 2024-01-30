// #region ***  DOM references                           ***********
const lanIP = `${window.location.hostname}:5000`;
// #endregion



// #region ***  Callback-Visualisation - show___         ***********
const showTopVijf = function (jsonObject) {
    let htmlRij = document.querySelector('.js-tableRij');
    let htmlRij2 = document.querySelector('.js-tableRij2');
    let htmlRij3= document.querySelector('.js-tableRij3');
    let htmlRij4 = document.querySelector('.js-tableRij4');
    let htmlRij5 = document.querySelector('.js-tableRij5');
    let htmlString1 = ``;
    let htmlString2 = ``;
    let htmlString3 = ``;
    let htmlString4 = ``;
    let htmlString5 = ``;
    console.log(jsonObject);
    htmlString1 += 
        `<th class="c-table__nummer">1.</th>
        <td class="c-table__naam">${jsonObject[0][1]+ ' '  + jsonObject[0][2]}</td>
        <td class="c-table__mail">${jsonObject[0][3]}</td>
        <td class="c-table__afstand">${jsonObject[0][4]} m</td>
        `;
    htmlString2 += 
        `<th class="c-table__nummer">2.</th>
        <td class="c-table__naam">${jsonObject[1][1]+ ' '  + jsonObject[1][2]}</td>
        <td class="c-table__mail">${jsonObject[1][3]}</td>
        <td class="c-table__afstand">${jsonObject[1][4]} m</td>
        `;
    htmlString3 += 
        `<th class="c-table__nummer">3.</th>
        <td class="c-table__naam">${jsonObject[2][1] + ' ' + jsonObject[2][2]}</td>
        <td class="c-table__mail">${jsonObject[2][3]}</td>
        <td class="c-table__afstand">${jsonObject[2][4]} m</td>
        `;
    htmlString4 += 
        `<th class="c-table__nummer">4.</th>
        <td class="c-table__naam">${jsonObject[3][1] + " " + jsonObject[3][2]}</td>
        <td class="c-table__mail">${jsonObject[3][3]}</td>
        <td class="c-table__afstand">${jsonObject[3][4]} m</td>
        `;
    htmlString5 += 
        `<th class="c-table__nummer">5.</th>
        <td class="c-table__naam">${jsonObject[4][1]+ ' '  + jsonObject[4][2]}</td>
        <td class="c-table__mail">${jsonObject[4][3]}</td>
        <td class="c-table__afstand">${jsonObject[4][4]} m</td>
        `;
    
    htmlRij.innerHTML = htmlString1;
    htmlRij2.innerHTML = htmlString2;
    htmlRij3.innerHTML = htmlString3;
    htmlRij4.innerHTML = htmlString4;
    htmlRij5.innerHTML = htmlString5;
}
// #endregion



// #region ***  Callback-No Visualisation - callback___  ***********

// #endregion



// #region ***  Data Access - get___                     ***********
const getTopVijf = function () {
    handleData(`http://${lanIP}/api/v1/top5`, showTopVijf); 
}


// #endregion



// #region ***  Event Listeners - listenTo___            ***********

// #endregion



// #region ***  Init / DOMContentLoaded                  ***********
const paginaInit = function () {
    console.log("Top 5 pagina geladen");
    getTopVijf();
}
// #endregion

paginaInit();
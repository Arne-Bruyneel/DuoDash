const getData = function(){
    handleData(`../data/data.json`, showData, showError)
}

const showData = function(data){
    console.log(data);
}
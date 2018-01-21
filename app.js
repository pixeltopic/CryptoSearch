
class fetchCrypto {
    // powered by cryptocompare - add message later to UI
    // gets info from the API link.
    constructor() {
    }
    
    getJSON(apiURL, coinName) {
        fetch(apiURL, {mode:"cors"}).then(function(response) { // mode:"cors" required for https links
            console.log("fetched");
            return response.json();
        }).then(function(response) {
//            console.log(response);
            console.log(response.Data);
            
            // iterate though response.Data for the .CoinName or .Symbol that matches coinName attr.
            // later to do: increase speed of search.
            for (let DataEntry in response.Data) {
                let dataObj = response.Data[DataEntry];
                if (dataObj.CoinName.toUpperCase() === coinName || dataObj.Symbol === coinName) {
                    document.querySelector(".cryptologo").src = response.BaseImageUrl + dataObj.ImageUrl;
                    return;
                }
            }
            console.log("Nothing found");
        }).catch(function(err) {
            console.log(err);
        });
    }
}

class UIcontroller {
    // this class handles the UI updating.
    constructor() {
        document.querySelector(".btn-fetch").addEventListener("click", () => {
            let toSearch = document.querySelector(".coin-search-input").value.toUpperCase();
            console.log(toSearch);
            if (toSearch.length !== 0){
                let fetch = new fetchCrypto();
                fetch.getJSON("https://min-api.cryptocompare.com/data/all/coinlist", toSearch);
            } else {
                console.log("input was empty!");
            }
        });
    }
}

//class controller {
//    // this class handles user interaction with the UI.
//    constructor() {
//        ;
//    }
//}

new UIcontroller();
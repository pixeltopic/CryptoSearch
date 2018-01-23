/*
how app will work:
user searches for a coin (.CoinName or .Symbol) and selects a currency to display details in. (USD, EUR, CAD)
fetchDescription gets the Image and other basic data from the search input.
fetchAverage gets the statistics from the .Symbol and currency (USD, EUR, CAD)

display all relevant information for the user.

implement:
when a user enters a new search, insert HTML for the search. User can click x to delete the search entry, but
it requires a custom ID. If the search is invalid, show an error message.

(currently, if search failed, there is no noticable message besides a console log, and
Old data is still shown if your first search works, but next search fails. need fix)

Averages fetched 7 different exchanges. API provided by Cryptocompare.
*/



{ // IIFE: gets info from the API link. Uses UIcontroller functions to update interface.
    
    function fetchDescription(coinName, exchangeInput, curInput) {
        
        let apiURL = "https://min-api.cryptocompare.com/data/all/coinlist";
        
        fetch(apiURL, {mode:"cors"}).then(function(response) { // mode:"cors" required for https links
            return response.json();
        }).then(function(response) {
            console.log("fetchDescription: Fetched");
            
//            console.log(response);
//            console.log(response.Data);
            
            // iterate though response.Data for the .CoinName or .Symbol that matches coinName attr.
            for (let DataEntry in response.Data) {
                let dataObj = response.Data[DataEntry];
                if (dataObj.CoinName.toUpperCase() === coinName || dataObj.Symbol === coinName) {
                    
                    return {
                        BaseImageUrl: response.BaseImageUrl,
                        CoinName: dataObj.CoinName,
                        FullName: dataObj.FullName,
                        ImageUrl: dataObj.ImageUrl,
                        Symbol: dataObj.Symbol,
                        
                    };
                }
            }
            
            return -1; // JSON fetched successfully, but Response was an error (maybe because search was invalid)
            
        }).then(function(obj) {
            if (obj !== -1) {
                updatePicture(obj.BaseImageUrl, obj.ImageUrl);
                updateSearchDetails(obj.CoinName, obj.Symbol, exchangeInput, curInput);
                fetchAverage(obj.Symbol, exchangeInput, curInput);
            } else {
                console.log("fetchDescription: Invalid CoinName or Symbol");
            }
            
        }).catch(function(err) {
            console.log(err);
        });
    }
    
    function fetchAverage(coin = "BTC", exchange = "Coinbase", cur = "USD") { // set cur by dropdown: USD, CAD, EUR.
        
        let apiURL = `https://min-api.cryptocompare.com/data/generateAvg?fsym=${coin}&tsym=${cur}&e=${exchange}`;
        
        fetch(apiURL, {mode:"cors"}).then(function(response) {
            return response.json();
        }).then(function(response) {
            if (response.Response === "Error") {
                console.log("fetchAverage: API Url was Invalid, likely no exchange for that currency.");
                return -1;
            } else {
                console.log("Fetched Averages");
                console.log(response);
                
                let statDetail = response.DISPLAY;
                
                return {
                    PRICE: statDetail.PRICE,
                    CHANGE24HOUR: statDetail.CHANGE24HOUR,
                    CHANGEPCT24HOUR: statDetail.CHANGEPCT24HOUR,
                    VOLUME24HOUR: statDetail.VOLUME24HOUR,
                    VOLUME24HOURTO: statDetail.VOLUME24HOURTO,
                    OPEN24HOUR: statDetail.OPEN24HOUR,
                    LOW24HOUR: statDetail.LOW24HOUR,
                    HIGH24HOUR: statDetail.HIGH24HOUR
                }
            }
            
//            console.log(response.Display);
        }).then(function(obj) {
            if (obj !== -1) {
                updateStatsDetails(obj);
            }
            
        }).catch(function(err) {
            console.log(err);
        });;
    }
}

{ // IIFE: UIcontroller, functions that handle UI updates
    
    let DOMstr = {
        coinSearchInput: ".coin-search-input",
        exchangeInput: ".exchange__input",
        curInput: ".cur__input",
        btnInput: ".btn-fetch",
        
        coinLogo: ".coinlogo",
        
        statsDetail: ".stats__detail"
    }
    
    function getInput() {
        // gets all user input and returns an object
        return {
            searchInput: document.querySelector(DOMstr.coinSearchInput).value.toUpperCase(),
            exchangeInput: document.querySelector(DOMstr.exchangeInput).value,
            curInput: document.querySelector(DOMstr.curInput).value
            
        }
    }
    
    function buttonInit() { 
        // initializes all button functionality
        document.querySelector(DOMstr.btnInput).addEventListener("click", () => {
            
            var allInput = getInput();
            
            if (allInput.searchInput.length !== 0){
                fetchDescription(allInput.searchInput, allInput.exchangeInput, allInput.curInput);
            } else {
                console.log("input was empty!");
            }
        });
    }
    
    function updateSearchDetails(coin, coinSymbol, exchange, cur) {
        document.getElementById("SEARCH-DETAILS").textContent = `Coin: ${coin} (${coinSymbol}) | Exchange: ${exchange} | Currency: ${cur}`;
    }
    
    function updatePicture(baseImageUrl, imageUrl) {
        document.querySelector(DOMstr.coinLogo).src = baseImageUrl + imageUrl;
    }
    
    function updateStatsDetails(obj) {
        
//        let details = document.querySelectorAll(DOMstr.statsDetail);
//        let detailArr = Array.from(details);
        
        document.getElementById("PRICE").textContent = `Price Just Now: ${obj.PRICE}`;
        document.getElementById("CHANGE24HOUR").textContent = `Change 24H: ${obj.CHANGE24HOUR} (${obj.CHANGEPCT24HOUR}%)`;
        document.getElementById("VOLUME24HOUR").textContent = `Volume 24H: ${obj.VOLUME24HOUR} (${obj.VOLUME24HOURTO})`;
        document.getElementById("OPEN24HOUR").textContent = `Open 24H: ${obj.OPEN24HOUR}`;
        document.getElementById("LOWHIGH24HOUR").textContent = `Low/High 24H: ${obj.LOW24HOUR} - ${obj.HIGH24HOUR}`;
        
        let now = new Date();
        let timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} - ${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`
        
        document.getElementById("TIMESTAMP").textContent = `Timestamp: ${timestamp}`;
    }
    
}

buttonInit();
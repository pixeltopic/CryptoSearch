/*
TO DO:
Will have a drop down menu to select currencies to calculate average
Account for json response errors after fetching


how app will work:
user searches for a coin (.CoinName or .Symbol) and selects a currency to display details in. (USD, EUR, CAD)
fetchDescription gets the Image and other basic data from the search input.
fetchAverage gets the statistics from the .Symbol and currency (USD, EUR, CAD)

display all relevant information for the user.



create area to display fetched average data

Averages fetched from CoinBase. API provided by Cryptocompare. Add QuadrigaCX implementation and some other big exchanges
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
            
            return -1;
            
        }).then(function(obj) {
            if (obj !== -1) {
                updatePicture(obj.BaseImageUrl, obj.ImageUrl);
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
            } else {
                console.log("Fetched Averages");
                console.log(response);
            }
            
//            console.log(response.Display);
        }).catch(function(err) {
            console.log(err);
        });
    }
}

{ // IIFE: UIcontroller, functions that handle UI updates
    
    let DOMstr = {
        coinSearchInput: ".coin-search-input",
        exchangeInput: ".exchange__input",
        curInput: ".cur__input",
        btnInput: ".btn-fetch",
        
        coinLogo: ".coinlogo"
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
    
    function updatePicture(baseImageUrl, imageUrl) {
        document.querySelector(DOMstr.coinLogo).src = baseImageUrl + imageUrl;
    }
    
    
    
}

buttonInit();